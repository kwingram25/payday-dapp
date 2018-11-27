import {
  put, select, takeLatest,
} from 'redux-saga/effects'

import * as actions from 'actions/bills'

import types from 'config/types'

import Bill from 'models/Bill'

const getMe = () => select(state => state.auth.user.username)
const getBills = () => select(state => state.bills.data)
const getContacts = () => select(state => Object.keys(state.contacts.data || {}))

function* billsFetch() {
  try {
    const me = yield getMe()
    const contacts = yield getContacts()

    yield Bill.init(me, contacts)
    // const bills = yield Bill.loadAll(me, contacts)
    //
    yield put(actions.billsFetchSuccess(Bill.store))
  } catch (e) {
    yield put(actions.billsFetchError(e.message))
  }
}


function* billsCreate({ data }) {
  let bill
  try {
    bill = new Bill(data)
  } catch (e) {
    yield put(actions.billsCreateError(e))
    return
  }

  if (!bill) {
    yield put(actions.billsCreateError({}))
    return
  }

  // const bills = yield getBills()
  // bills[bill.id] = bill
  yield put(actions.billsCreateSuccess(Bill.store, bill.id))
}

function* billsUpdate({ billId, data }) {
  try {
    const bills = yield getBills()
    const { [billId]: bill } = bills

    yield bill.update(data)

    yield put(
      actions.billsUpdateSuccess(Bill.store),
    )
  } catch (e) {
    yield put(actions.billsUpdateError(e))
  }
}

function* billsMarkAsPaid({ billId, markedPaid }) {
  try {
    const bills = yield getBills()
    const { [billId]: bill } = bills

    yield bill.update({ markedPaid })

    yield put(
      actions.billsMarkAsPaidSuccess(Bill.store),
    )
  } catch (e) {
    yield put(actions.billsMarkAsPaidError(e))
  }
}


function* billsDelete(action) {
  try {
    const { billIds } = action

    yield Bill.delete(billIds)

    yield put(
      actions.billsDeleteSuccess(Bill.store, billIds),
    )
  } catch (e) {
    yield put(
      actions.billsDeleteError(e.message),
    )
  }
}

export default function* contactsSaga() {
  yield takeLatest(types.BILLS_FETCH__BEGIN, billsFetch)
  yield takeLatest(types.BILLS_CREATE__BEGIN, billsCreate)
  yield takeLatest(types.BILLS_UPDATE__BEGIN, billsUpdate)
  yield takeLatest(types.BILLS_DELETE__BEGIN, billsDelete)
  yield takeLatest(types.BILLS_MARK_AS_PAID__BEGIN, billsMarkAsPaid)
}
