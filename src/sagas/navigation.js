import {
  call, fork, put, take, takeLatest, takeEvery, select,
} from 'redux-saga/effects'
import { push } from 'connected-react-router';

import types from 'config/types'

function* goToDashboard() {
  // yield call(() => { redirectToSignIn() })
  const pathname = yield select(state => state.router.location.pathname)
  if (pathname !== '/dashboard') {
    yield put(push('/dashboard'))
  }
}

export default function* navigationSaga() {
  yield takeEvery([
    types.BILLS_CREATE__SUCCESS,
    types.BILLS_UPDATE__SUCCESS,
    types.BILLS_DELETE__SUCCESS,
  ], goToDashboard)
}
