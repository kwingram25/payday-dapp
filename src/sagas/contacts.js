import {
  call, put, select, takeEvery, takeLatest,
} from 'redux-saga/effects'
import {
  lookupProfile,
  getFile,
  putFile,
} from 'blockstack'

import { createUserObject } from 'utils'

import * as actions from 'actions/contacts'
import { billsFetch, billsDeleteMultiple } from 'actions/bills'

import { contactsFilePath, gaiaOptions } from 'config/app'
import types from 'config/types'

import Bill from 'models/Bill'
import Contact from 'models/Contact'

function* contactsFetch() {
  try {
    yield Contact.init()
    yield put(actions.contactsFetchSuccess())
  } catch (e) {
    console.log(e)
    yield put(actions.contactsFetchError())
  }
}

function* contactsCreate({ username }) {
  let contact
  console.log(username)
  try {
    contact = new Contact({ username })
    yield contact.populate()
    Contact.save()
  } catch (e) {
    console.log(e)
    yield put(actions.contactsCreateError(e))
    return
  }

  if (!contact) {
    yield put(actions.contactsCreateError('unknown'))
    return
  }

  yield put(actions.contactsCreateSuccess())
}

function* contactsDelete({ username }) {
  try {
    yield Contact.delete(username)

    yield put(actions.contactsDeleteSuccess())
  } catch (e) {
    yield put(actions.contactsDeleteError())
  }
}


// function* userAccountFetchSuccess() {
//   yield put(push('/dashboard'))
// }
//
// function* userAccountFetchError() {
//   yield signUserOut(window.location.origin)
// }

export default function* contactsSaga() {
  yield takeLatest(types.CONTACTS_FETCH__BEGIN, contactsFetch)
  yield takeLatest(types.CONTACTS_CREATE__BEGIN, contactsCreate)
  yield takeLatest(types.CONTACTS_DELETE__BEGIN, contactsDelete)

  yield takeLatest([
    types.CONTACTS_FETCH__SUCCESS,
    types.CONTACTS_CREATE__SUCCESS,
    types.CONTACTS_DELETE__SUCCESS,
  ], function* () {
    yield put(
      billsFetch(),
    )
  })


  // yield takeEvery([
  //   types.CONTACTS_DELETE__SUCCESS,
  // ], deleteUserBills)

  // yield takeEvery(types.USER_BALANCE_FETCH__BEGIN, userBalanceFetch)

  // yield takeEvery(types.USER_ACCOUNT_FETCH__SUCCESS, userAccountFetchSuccess)
  // yield takeEvery(types.USER_ACCOUNT_FETCH__ERROR, userAccountFetchError)
}
