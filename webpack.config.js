const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

require('dotenv').config()

const publicFolder = path.resolve(__dirname, 'dist')
const srcFolder = path.resolve(__dirname, 'src')

const isProd = process.env.NODE_ENV === 'production'

const cssFilename = isProd ? 'styles.[chunkhash].css' : 'styles.css'

const getPlugins = () => {
  const basePlugins = [
    new webpack.EnvironmentPlugin(['NODE_ENV', 'API_URL', 'STATIC_URL']),

    new webpack.optimize.SplitChunksPlugin(),

    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

    new CopyWebpackPlugin([{ from: isProd ? 'manifest.prod.json' : 'manifest.dev.json', to: 'manifest.json' }]),
    new CopyWebpackPlugin([{ from: 'src/assets/icon-192x192.png', to: 'icon-192x192.png' }]),
    new CopyWebpackPlugin([{ from: 'src/assets/favicon.ico', to: 'favicon.ico' }]),
    ...(isProd ? [
      new CopyWebpackPlugin([{ from: 'now.json', to: 'now.json' }]),
    ] : []),

    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(srcFolder, 'index.html'),
    }),
  ]
  /*
  *   List of production plugins
  */
  const prodPlugins = [
    new CleanWebpackPlugin(publicFolder, {
      root: __dirname,
      verbose: true,
    }),
    new CompressionPlugin({
      filename: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8,
    }),
    new ExtractTextPlugin({
      filename: cssFilename,
      allChunks: true,
    }),
    // new TerserPlugin({
    //   terserOptions: {
    //     keep_fnames: true,
    //     keep_classnames: true,
    //     mangle: {
    //       reserved: [
    //         'Buffer', 'BigInteger', 'Point', 'ECPubKey',
    //         'ECKey', 'sha512_asm', 'asm', 'ECPair', 'HDNode',
    //       ],
    //     },
    //   },
    // }),

  ]

  return basePlugins.concat(
    isProd
      ? prodPlugins
      : [
        new webpack.HotModuleReplacementPlugin(),
        // new ManifestPlugin({
        //   seed: {
        //     name: 'PayDay',
        //     start_url: 'localhost:8080',
        //     description: 'A Ethereum billing and payment app',
        //     icons: [
        //
        //     ],
        //   },
        // }),

        new webpack.DllReferencePlugin({
          context: publicFolder,
          manifest: require(path.resolve(__dirname, './bundleLibs/lib_1.json')),
        }),
        new webpack.DllReferencePlugin({
          context: publicFolder,
          manifest: require(path.resolve(__dirname, './bundleLibs/lib_2.json')),
        }),
      ],
  )
}

module.exports = {
  mode: process.env.NODE_ENV,

  devtool: isProd ? false : 'source-map',

  entry: {
    vendor: ['redux', 'redux-saga', 'react-redux', 'react', 'react-dom', 'babel-polyfill'],
    app: [
      'whatwg-fetch',
      path.resolve(srcFolder, 'index.css'),
      path.resolve(srcFolder, 'index.js'),
    ],
  },

  output: {
    path: publicFolder,
    publicPath: '/',
    filename: isProd ? '[name].[chunkhash].js' : '[name].js',
  },

  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      actions: path.resolve(__dirname, './src/actions/'),
      components: path.resolve(__dirname, './src/components/'),
      containers: path.resolve(__dirname, './src/containers/'),
      config: path.resolve(__dirname, './src/config'),
      models: path.resolve(__dirname, './src/models'),
      pages: path.resolve(__dirname, './src/pages'),
      providers: path.resolve(__dirname, './src/providers'),
      sagas: path.resolve(__dirname, './src/sagas'),
      utils: path.resolve(__dirname, './src/utils'),
    },
  },

  optimization: {
    // minimize: false,
    splitChunks: {
      chunks: 'async',
      cacheGroups: {
        default: {
          minChunks: 1,
          priority: -20,
          reuseExistingChunk: true,
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: 'initial',
          enforce: true,
        },
      },
    },
    minimizer: isProd ? [
      new TerserPlugin({
        terserOptions: {
          cache: true,
          parallel: true,
          mangle: true,
          compress: {
            warnings: false, // Suppress uglification warnings
            pure_getters: true,
            // unsafe: true,
            unsafe_comps: true,
            conditionals: true,
            unused: true,
            comparisons: true,
            sequences: true,
            dead_code: true,
            evaluate: true,
            if_return: true,
            join_vars: true,
            drop_console: true,
          },
          output: {
            comments: false,
          },
        },
        exclude: [/\.min\.js$/gi], // skip pre-minified libs
      }),
    ] : [],

  },

  devServer: {
    host: process.env.WEBPACK_DEV_SERVER_HOST,
    port: process.env.WEBPACK_DEV_SERVER_PORT,
    inline: true,
    hot: !isProd,
    contentBase: './dist',
    historyApiFallback: true,
    watchOptions: {
      ignored: /node_modules/,
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        include: srcFolder,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: isProd ? [] : ['transform-runtime', 'react-hot-loader/babel'],
          },
        },
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: isProd
          ? ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: ['css-loader', 'postcss-loader'],
          })
          : ['css-hot-loader', 'style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.svg|\.png|\.jpg$/,
        exclude: /node_modules/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'static/[name]-[hash:8].[ext]',
          },
        },
      },
    ],
  },

  plugins: getPlugins(),
}
