import { all, call } from 'redux-saga/effects'

import authSaga from './auth'
import accountSaga from './account'
import contactsSaga from './contacts'
import billsSaga from './bills'
import navigationSaga from './navigation'

export default function* rootSaga() {
  yield all([
    call(accountSaga),
    call(authSaga),
    call(contactsSaga),
    call(billsSaga),
    call(navigationSaga),
  ])
}
