/* eslint max-len: off */
import React from 'react'
import Helmet from 'react-helmet'

export default () => ((
  <Helmet {...{
    titleTemplate: '%s | PayDay ',
    defaultTitle: 'PayDay',
  }}
  >
    <html lang="en" />
    <meta charSet="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <meta httpEquiv="X-UA-Compatible " />
  </Helmet>
))
