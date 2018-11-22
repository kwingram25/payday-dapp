import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router';

import configureStore from './store'

import Root from './containers/Root'

// Require Sass file so webpack can build it
// import bootstrap from 'bootstrap/dist/css/bootstrap.css';
import './styles/style.css'

const { history, store } = configureStore()

// store.runSaga(rootSaga)

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Root />
    </ConnectedRouter>
  </Provider>, document.getElementById('root'),
)
