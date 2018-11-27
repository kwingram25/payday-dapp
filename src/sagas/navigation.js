import {
  put, takeEvery,
} from 'redux-saga/effects'
import {
  replace, goBack, push,
} from 'connected-react-router'

import types from 'config/types'

function* root() {
  yield put(push('/'))
}

function* back() {
  yield put(goBack())
}

// function* dashboard({ billIds }) {
//   yield put(replace('/dashboard'))
// }

function* bill({ newBillId }) {
  yield put(replace(`/bill#${newBillId}`))
}

export default function* navigationSaga() {
  yield takeEvery(types.BILLS_UPDATE__SUCCESS, back)
  yield takeEvery(types.BILLS_CREATE__SUCCESS, bill)
  // yield takeEvery(types.BILLS_DELETE__SUCCESS, dashboard)
  yield takeEvery(types.USER_SIGNOUT__SUCCESS, root)
}
