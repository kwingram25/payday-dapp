import { isUserSignedIn } from 'blockstack'

import types from '../config/types'

export const initialState = {
  user: null,
  authenticated: false,
  working: null,
  error: null,
}

const actionsMap = (type) => {
  switch (type) {
    case types.USER_SIGNIN__BEGIN:
      return state => ({
        ...state, working: 'signin', error: null,
      })

    case types.USER_SIGNOUT__BEGIN:
      return state => ({
        ...state, working: 'signout', error: null,
      })

    case types.USER_POST_SIGNIN__BEGIN:
      return state => ({
        ...state, working: 'post-signin', error: null,
      })

    case types.USER_ACCOUNT_FETCH__BEGIN:
      return state => ({
        ...state, working: 'account-fetch', error: null,
      })

    case types.USER_ACCOUNT_BALANCE_FETCH__BEGIN:
      return state => ({
        ...state, working: 'account-balance-fetch', error: null,
      })

    case types.USER_SIGNIN__SUCCESS:
      return state => ({
        ...state, working: null,
      })

    case types.USER_POST_SIGNIN__SUCCESS:
    case types.USER_ACCOUNT_FETCH__SUCCESS:
    case types.USER_ACCOUNT_BALANCE_FETCH__SUCCESS:
      return (state, { user }) => ({
        ...state, working: null, user, authenticated: isUserSignedIn(), error: null,
      })

    case types.USER_SIGNOUT__SUCCESS:
      return state => ({
        ...state, working: null, user: null, authenticated: isUserSignedIn(), error: null,
      })

    case types.USER_SIGNIN__ERROR:
    case types.USER_SIGNOUT__ERROR:
    case types.USER_POST_SIGNIN__ERROR:
    case types.USER_ACCOUNT_FETCH__ERROR:
    case types.USER_ACCOUNT_BALANCE_FETCH__ERROR:
      return (state, { error }) => ({
        ...state, working: false, error,
      })

    default:
      return state => state
  }
}

export default (
  state = initialState,
  action,
) => {
  const reduceFn = actionsMap(action.type)
  if (!reduceFn) return state
  return reduceFn(state, action)
}
