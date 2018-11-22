// reducer.js
import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

import auth from './auth'
import account from './account'
import bills from './bills'
import contacts from './contacts'
import ui from './ui'

export default history => combineReducers({
  auth,
  account,
  bills,
  contacts,
  ui,
  router: connectRouter(history),
})
