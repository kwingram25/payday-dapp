// reducer.js
import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

import auth from './auth'
import bills from './bills'
import contacts from './contacts'
import payments from './payments'
import ui from './ui'

export default history => combineReducers({
  router: connectRouter(history),
  auth,
  bills,
  contacts,
  payments,
  ui,
})
