import {
  put, select, takeLatest,
} from 'redux-saga/effects'

import * as actions from 'actions/contacts'
import { billsFetch } from 'actions/bills'
import { paymentsFetch } from 'actions/payments'

import types from 'config/types'

import Contact from 'models/Contact'

const getMe = () => select(state => state.auth.user.username)

function* contactsFetch() {
  try {
    const me = yield getMe()
    yield Contact.init(me)
    yield put(actions.contactsFetchSuccess(Contact.store || {}))
  } catch (e) {
    yield put(actions.contactsFetchError())
  }
}

function* contactsCreate({ username }) {
  let contact
  try {
    contact = new Contact({ username })
    yield contact.populate()
    yield Contact.save()
  } catch (e) {
    yield put(actions.contactsCreateError(e.message))
    return
  }

  if (!contact) {
    yield put(actions.contactsCreateError('unknown'))
    return
  }

  yield put(actions.contactsCreateSuccess(Contact.store))
}

function* contactsDelete({ username }) {
  try {
    yield Contact.delete(username)

    yield put(actions.contactsDeleteSuccess(Contact.store))
  } catch (e) {
    yield put(actions.contactsDeleteError())
  }
}

function* fetchUserItems() {
  yield put(billsFetch())
  yield put(paymentsFetch())
}

export default function* contactsSaga() {
  yield takeLatest(types.CONTACTS_FETCH__BEGIN, contactsFetch)
  yield takeLatest(types.CONTACTS_CREATE__BEGIN, contactsCreate)
  yield takeLatest(types.CONTACTS_DELETE__BEGIN, contactsDelete)

  yield takeLatest([
    types.CONTACTS_FETCH__SUCCESS,
    types.CONTACTS_CREATE__SUCCESS,
    types.CONTACTS_DELETE__SUCCESS,
  ], fetchUserItems)
}
