import {
  put, select, takeLatest,
} from 'redux-saga/effects'

import * as actions from 'actions/payments'
import { userAccountBalanceFetch } from 'actions/auth'

import types from 'config/types'

import Payment from 'models/Payment'
import Contact from 'models/Contact'

const getMe = () => select(state => state.auth.user)
const getContacts = () => select(state => Object.keys(state.contacts.data || {}))

function* paymentsFetch() {
  try {
    const me = yield getMe()
    const contacts = yield getContacts()

    yield Payment.init(me, contacts)

    yield put(actions.paymentsFetchSuccess(Payment.store))
  } catch (e) {
    yield put(actions.paymentsFetchError(e.message))
  }
}


function* paymentsCreate({ data }) {
  let payment
  let txParams
  let contact
  let receipt
  try {
    const {
      amount,
      gasLimit,
      gasPrice,
      ...rest
    } = data

    const { recipient } = rest
    contact = Contact.store[recipient]

    if (!contact || !contact.address) {
      const err = { recipient: 'invalid' }
      throw err
    }

    txParams = {
      to: contact.address,
      amount,
      gasLimit,
      gasPrice,
    }

    try {
      Payment.validateTx(txParams)
    } catch (e) {
      throw e
    }

    payment = new Payment({
      ...rest,
      amount,
    })
  } catch (e) {
    yield put(actions.paymentsCreateError(e))
    return
  }

  if (!payment || !txParams) {
    yield put(actions.paymentsCreateError({ unknown: true }))
    return
  }

  try {
    receipt = yield Payment.send(txParams)
  } catch (e) {
    yield put(actions.paymentsCreateError({
      transaction: 'failed',
    }))
    return
  }

  if (!receipt) {
    yield put(actions.paymentsCreateError({
      transaction: 'failed',
    }))
    return
  }

  const { transactionHash } = receipt
  payment.txHash = transactionHash
  payment.save()

  yield put(actions.paymentsCreateSuccess(Payment.store))
  yield put(userAccountBalanceFetch())
}

export default function* paymentsSaga() {
  yield takeLatest(types.PAYMENTS_FETCH__BEGIN, paymentsFetch)
  yield takeLatest(types.PAYMENTS_CREATE__BEGIN, paymentsCreate)
}
