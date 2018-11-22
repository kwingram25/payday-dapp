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

export const userSignOut = () => ({
  type: types.USER_SIGNOUT__BEGIN,
})

export const userSignOutSuccess = () => ({
  type: types.USER_SIGNOUT__SUCCESS,
})

export const userSignOutError = error => ({
  type: types.USER_SIGNOUT__ERROR, error,
})
