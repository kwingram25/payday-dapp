import {
  call, fork, put, take, takeLatest, takeEvery,
} from 'redux-saga/effects'
import { push, replace } from 'connected-react-router'

import {
  redirectToSignIn,
  signUserOut,
} from 'blockstack'

import types from 'config/types'

function* userSignIn() {
  // yield call(() => { redirectToSignIn() })
  const { origin } = window.location
  yield redirectToSignIn(origin, `${origin}/manifest.json`, ['store_write', 'publish_data'])
}

function* userSignOut() {
  yield signUserOut(window.location.origin)
}

export default function* authSaga() {
  yield takeEvery(types.USER_SIGNIN__BEGIN, userSignIn)
  // yield takeEvery(types.USER_SIGNIN__SUCCESS, userSignInSuccess)
  yield takeEvery(types.USER_SIGNOUT__BEGIN, userSignOut)
}
