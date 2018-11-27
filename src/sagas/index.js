import { all, call } from 'redux-saga/effects'

import authSaga from './auth'
import contactsSaga from './contacts'
import billsSaga from './bills'
import paymentsSaga from './payments'
import navigationSaga from './navigation'
import uiSaga from './ui'

export default function* rootSaga() {
  yield all([
    call(authSaga),
    call(contactsSaga),
    call(billsSaga),
    call(paymentsSaga),
    call(navigationSaga),
    call(uiSaga),
  ])
}
