// import api from 'api';
// import auth from 'utils/auth';
import types from 'config/types'

// "Log In" action creators
export const paymentsFetch = () => ({
  type: types.PAYMENTS_FETCH__BEGIN,
})

export const paymentsFetchSuccess = payments => ({
  type: types.PAYMENTS_FETCH__SUCCESS, payments,
})

export const paymentsFetchError = error => ({
  type: types.PAYMENTS_FETCH__ERROR, error,
})

export const paymentsCreate = data => ({
  type: types.PAYMENTS_CREATE__BEGIN, data,
})

export const paymentsCreateSuccess = payments => ({
  type: types.PAYMENTS_CREATE__SUCCESS, payments,
})

export const paymentsCreateError = error => ({
  type: types.PAYMENTS_CREATE__ERROR, error,
})

export const paymentsPurge = () => ({
  type: types.PAYMENTS_PURGE,
})
