// import api from 'api';
// import auth from 'utils/auth';
import types from 'config/types'

// "Log In" action creators
export const userAccountFetch = () => ({
  type: types.USER_ACCOUNT_FETCH__BEGIN,
})

export const userAccountFetchSuccess = address => ({
  type: types.USER_ACCOUNT_FETCH__SUCCESS, address,
})

export const userAccountFetchError = error => ({
  type: types.USER_ACCOUNT_FETCH__ERROR, error,
})

export const userBalanceFetch = address => ({
  type: types.USER_BALANCE_FETCH__BEGIN, address,
})

export const userBalanceFetchSuccess = balance => ({
  type: types.USER_BALANCE_FETCH__SUCCESS, balance,
})

export const userBalanceFetchError = error => ({
  type: types.USER_BALANCE_FETCH__ERROR, error,
})
