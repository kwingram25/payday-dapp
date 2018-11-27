// import api from 'api';
// import auth from 'utils/auth';
import types from 'config/types'

// "Log In" action creators
export const userSignIn = () => ({
  type: types.USER_SIGNIN__BEGIN,
})

export const userSignInSuccess = user => ({
  type: types.USER_SIGNIN__SUCCESS, user,
})

export const userSignInError = error => ({
  type: types.USER_SIGNIN__ERROR, error,
})

export const userPostSignIn = () => ({
  type: types.USER_POST_SIGNIN__BEGIN,
})

export const userPostSignInSuccess = user => ({
  type: types.USER_POST_SIGNIN__SUCCESS, user,
})

export const userPostSignInError = error => ({
  type: types.USER_POST_SIGNIN__ERROR, error,
})

export const userAccountFetch = () => ({
  type: types.USER_ACCOUNT_FETCH__BEGIN,
})

export const userAccountFetchSuccess = user => ({
  type: types.USER_ACCOUNT_FETCH__SUCCESS, user,
})

export const userAccountFetchError = error => ({
  type: types.USER_ACCOUNT_FETCH__ERROR, error,
})

export const userAccountBalanceFetch = () => ({
  type: types.USER_ACCOUNT_BALANCE_FETCH__BEGIN,
})

export const userAccountBalanceFetchSuccess = user => ({
  type: types.USER_ACCOUNT_BALANCE_FETCH__SUCCESS, user,
})

export const userAccountBalanceFetchError = error => ({
  type: types.USER_ACCOUNT_BALANCE_FETCH__ERROR, error,
})

export const userSignOut = () => ({
  type: types.USER_SIGNOUT__BEGIN,
})

export const userSignOutSuccess = () => ({
  type: types.USER_SIGNOUT__SUCCESS,
})

export const userSignOutError = error => ({
  type: types.USER_SIGNOUT__ERROR, error,
})
