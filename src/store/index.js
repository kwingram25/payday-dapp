import 'regenerator-runtime/runtime'
import { applyMiddleware, createStore, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';

import createRootReducer from '../reducers'
import rootSaga from '../sagas'

const sagaMiddleware = createSagaMiddleware()

const history = createBrowserHistory()

const middlewares = [
  routerMiddleware(history),
  sagaMiddleware,
]

export default (initialState) => {
  let composeEnhancers
  if (window.navigator.userAgent.includes('Chrome')) {
    composeEnhancers = (
      typeof window !== 'undefined'
        ? (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose)
        : compose
    )
  } else {
    composeEnhancers = compose
  }

  const enhancers = composeEnhancers(
    applyMiddleware(...middlewares),
  )

  const store = createStore(
    createRootReducer(history),
    initialState,
    enhancers,
  )

  sagaMiddleware.run(rootSaga)

  return { history, store }
}
