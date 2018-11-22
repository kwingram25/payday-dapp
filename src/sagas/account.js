import {
  call, put, takeEvery,
} from 'redux-saga/effects'
import ethUtils from 'ethereumjs-util'
import {
  loadUserData,
  decryptContent,
  getFile,
  putFile,
} from 'blockstack'

import * as actions from 'actions/account'

import { accountFilePath, gaiaOptions } from 'config/app'
import types from 'config/types'

import { etherscan } from 'providers'

const generateAccountAddress = () => {
  const { appPrivateKey } = loadUserData()
  const privateKey = Buffer.from(appPrivateKey, 'hex')
  return `0x${ethUtils.privateToAddress(privateKey).toString('hex')}`
}

function* userAccountFetch() {
  try {
    const file = yield call(getFile, accountFilePath, gaiaOptions({ decrypt: true }))

    let { address } = JSON.parse(file || '{}')
    if (!address) {
      address = generateAccountAddress()
      yield call(putFile, accountFilePath, JSON.stringify({ address }), gaiaOptions({ encrypt: true }))
    }
    console.log(address);
    console.log(actions.userAccountFetchSuccess(address))

    yield put(actions.userAccountFetchSuccess(address))
    yield put(actions.userBalanceFetch(address))
  } catch (e) {
    console.log(e)
    yield put(actions.userAccountFetchError())
  }
}

function* userBalanceFetch({ address }) {
  try {
    const { status, data } = yield call(etherscan.fetchBalance, address)

    if (status < 400) {
      console.log(data)
      const balance = parseFloat(data.result, 10) / 1e18
      console.log(balance)
      yield put(actions.userBalanceFetchSuccess(
        isNaN(balance) ? 0 : balance,
      ))
    } else {
      yield put(actions.userBalanceFetchError())
    }
  } catch (e) {
    yield put(actions.userBalanceFetchError())
  }
}

// function* userAccountFetchSuccess() {
//   yield put(push('/dashboard'))
// }
//
// function* userAccountFetchError() {
//   yield signUserOut(window.location.origin)
// }

export default function* accountSaga() {
  yield takeEvery(types.USER_ACCOUNT_FETCH__BEGIN, userAccountFetch)
  yield takeEvery(types.USER_BALANCE_FETCH__BEGIN, userBalanceFetch)

  // yield takeEvery(types.USER_ACCOUNT_FETCH__SUCCESS, userAccountFetchSuccess)
  // yield takeEvery(types.USER_ACCOUNT_FETCH__ERROR, userAccountFetchError)
}
