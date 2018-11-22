import keyBy from 'lodash.keyby'
import groupBy from 'lodash.groupby'
import mapValues from 'lodash.mapvalues'

import Q from 'q'
import moment from 'moment'
import {
  all, call, put, select, takeEvery, takeLatest,
} from 'redux-saga/effects'
import {
  lookupProfile,
  getFile,
  putFile,
} from 'blockstack'

import { billId as newBillId } from 'utils'

import * as actions from 'actions/bills'
import { dashboard } from 'actions/navigation'

import { billsFilePath, gaiaOptions } from 'config/app'
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
    yield put(actions.billsFetchSuccess())
  } catch (e) {
    console.log(e)
    yield put(actions.billsFetchError())
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
    yield put(actions.billsCreateError('unknown'))
    return
  }

  // const bills = yield getBills()
  // bills[bill.id] = bill
  yield put(actions.billsCreateSuccess())
}

function* billsUpdate({ billId, data }) {
  try {
    // const {
    //   target,
    //   amount,
    //   amountPaid,
    //   description,
    //   date,
    // } = data

    const bills = yield getBills()
    const { [billId]: bill } = bills

    bill.update(data, yield getMe())

    // if (me.username === target) {
    //   yield put(actions.billsUpdateError('target'))
    //   return
    // }
    //
    // if (typeof amount !== 'undefined' && amount <= 0) {
    //   yield put(actions.billsUpdateError('amount'))
    //   return
    // }
    //
    // const newData = {
    //   ...(target && bill.target !== target ? { target } : {}),
    //   ...(amount && bill.amount !== amount ? { amount } : {}),
    //   ...(amountPaid && bill.amountPaid !== amountPaid ? { amountPaid } : {}),
    //   ...(description && bill.description !== description ? { description } : {}),
    //   ...(date && bill.date !== date ? { date } : {}),
    // }

    yield put(
      actions.billsUpdateSuccess(
        // {
        //   ...bills,
        //   [billId]: bill,
        // },
      ),
    )
  } catch (e) {
    yield put(actions.billsUpdateError(e))
  }
}

function* billsMarkAsPaid({ billId }) {
  try {
    const bills = yield getBills()
    const me = yield getMe()
    const { [billId]: bill } = bills

    bill.update({ markedPaid: true }, me)
    //
    // if (me.username === bill.target) {
    //   yield put(actions.billsMarkAsPaidError(true))
    //   return
    // }
    //
    // const newData = {
    //   amountPaid: bill.amount,
    // }

    yield put(
      actions.billsUpdateSuccess(),
    )
  } catch (e) {
    yield put(actions.billsMarkAsPaidError(e))
  }
}


function* billsDelete(action) {
  console.log(action)

  try {
    const { billIds } = action

    yield Bill.delete(billIds)

    yield put(
      actions.billsDeleteSuccess(),
      // Object.keys(bills).reduce(
      //   (filtered, billId) => {
      //     if (billIds.includes(billId)) {
      //       return filtered
      //     }
      //     return {
      //       ...filtered,
      //       [billId]: bills[billId],
      //     }
      //   },
      //   {},
      // ),
    )
  } catch (e) {
    yield put(
      actions.billsDeleteError(e),
    )
  }
}

function* redirectFromBill() {
  const bills = select(state => state.bills.data)
  const billId = (select(state => state.router.location.hash))

  console.log(billId)

  if (!bills[billId]) {
    yield put(dashboard())
  }
}


export default function* contactsSaga() {
  yield takeLatest(types.BILLS_FETCH__BEGIN, billsFetch)
  yield takeLatest(types.BILLS_CREATE__BEGIN, billsCreate)
  yield takeLatest(types.BILLS_UPDATE__BEGIN, billsUpdate)
  yield takeLatest(types.BILLS_DELETE__BEGIN, billsDelete)
  yield takeLatest(types.BILLS_MARK_AS_PAID__BEGIN, billsMarkAsPaid)

  // yield takeEvery([
  //   types.BILLS_FETCH__SUCCESS,
  // ], redirectFromBill)
}
