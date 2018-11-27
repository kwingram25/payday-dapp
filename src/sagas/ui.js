import {
  put, takeEvery,
} from 'redux-saga/effects'

import types from 'config/types'

import * as actions from 'actions/ui'

function* showTestModeNotice() {
  yield put(actions.showTestModeNotice(true))
}

function* showNotification(action) {
  let text = null
  switch (action.type) {
    case types.BILLS_CREATE__SUCCESS:
      text = 'Bill created!'
      break

    case types.BILLS_UPDATE__SUCCESS:
    case types.BILLS_MARK_AS_PAID__SUCCESS:
      text = 'Bill updated!'
      break

    case types.BILLS_DELETE__SUCCESS:
      text = 'Bill deleted!'
      break

    case types.CONTACTS_CREATE__SUCCESS:
      text = 'New contact added!'
      break

    case types.CONTACTS_DELETE__SUCCESS:
      text = 'Contact removed!'
      break

    case types.PAYMENTS_CREATE__SUCCESS:
      text = 'Your payment was sent successfully!'
      break

    case types.USER_POST_SIGNIN__SUCCESS:
      text = 'Sign in successful!'
      break

    case types.USER_SIGNOUT__SUCCESS:
      text = 'Sign out successful!'
      break
    default:
      break
  }

  yield put(actions.setNotification(text))
}

export default function* uiSaga() {
  yield takeEvery([
    types.BILLS_CREATE__SUCCESS,
    types.BILLS_UPDATE__SUCCESS,
    types.BILLS_MARK_AS_PAID__SUCCESS,
    types.BILLS_DELETE__SUCCESS,
    types.CONTACTS_CREATE__SUCCESS,
    types.CONTACTS_DELETE__SUCCESS,
    types.PAYMENTS_CREATE__SUCCESS,
    types.USER_SIGNOUT__SUCCESS,
  ], showNotification)

  yield takeEvery([
    types.USER_POST_SIGNIN__SUCCESS,
  ], showTestModeNotice)
}
