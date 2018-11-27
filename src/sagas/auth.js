import {
  put, takeEvery, select,
} from 'redux-saga/effects'
import { push } from 'connected-react-router'

import types from 'config/types'

import * as actions from 'actions/auth'
import { contactsPurge } from 'actions/contacts'
import { billsPurge } from 'actions/bills'
import { paymentsPurge } from 'actions/payments'

import User from 'models/User'

function* userSignIn() {
  yield User.signIn()
}

function* userSignOut() {
  yield User.signOut()
  yield put(actions.userSignOutSuccess())

  yield put(contactsPurge())
  yield put(billsPurge())
  yield put(paymentsPurge())
}

function* userPostSignIn() {
  try {
    const user = yield User.init()

    yield put(actions.userPostSignInSuccess(user))
    const location = yield select(({ router }) => router.location)

    if (location.pathname === '/') {
      yield put(push('/dashboard'))
    }
  } catch (e) {
    yield put(actions.userPostSignInError(e.message))
  }
}

function* userAccountFetch() {
  try {
    const user = yield select(({ auth }) => auth.user)

    yield user.fetchAccount()

    yield put(actions.userAccountFetchSuccess(user))
  } catch (e) {
    yield put(actions.userAccountFetchError(e.message))
  }
}

function* userAccountBalanceFetch() {
  try {
    const user = yield select(({ auth }) => auth.user)

    yield user.fetchBalance()

    yield put(actions.userAccountBalanceFetchSuccess(user))
  } catch (e) {
    yield put(actions.userAccountBalanceFetchError(e.message))
  }
}


export default function* authSaga() {
  yield takeEvery(types.USER_SIGNIN__BEGIN, userSignIn)
  yield takeEvery(types.USER_SIGNOUT__BEGIN, userSignOut)
  yield takeEvery(types.USER_POST_SIGNIN__BEGIN, userPostSignIn)

  yield takeEvery(types.USER_ACCOUNT_FETCH__BEGIN, userAccountFetch)
  yield takeEvery(types.USER_ACCOUNT_BALANCE_FETCH__BEGIN, userAccountBalanceFetch)
}
