// import api from 'api';
// import auth from 'utils/auth';
import types from 'config/types'

// "Log In" action creators
export const billsFetch = () => ({
  type: types.BILLS_FETCH__BEGIN,
})

export const billsFetchSuccess = bills => ({
  type: types.BILLS_FETCH__SUCCESS, bills,
})

export const billsFetchError = error => ({
  type: types.BILLS_FETCH__ERROR, error,
})

export const billsCreate = data => ({
  type: types.BILLS_CREATE__BEGIN, data,
})

export const billsCreateSuccess = (bills, newBillId) => ({
  type: types.BILLS_CREATE__SUCCESS, bills, newBillId,
})

export const billsCreateError = error => ({
  type: types.BILLS_CREATE__ERROR, error,
})

export const billsUpdate = (billId, data) => ({
  type: types.BILLS_UPDATE__BEGIN, billId, data,
})

export const billsUpdateSuccess = bills => ({
  type: types.BILLS_UPDATE__SUCCESS, bills,
})

export const billsUpdateError = error => ({
  type: types.BILLS_UPDATE__ERROR, error,
})

export const billsMarkAsPaid = (billId, markedPaid) => ({
  type: types.BILLS_MARK_AS_PAID__BEGIN, billId, markedPaid,
})

export const billsMarkAsPaidSuccess = bills => ({
  type: types.BILLS_MARK_AS_PAID__SUCCESS, bills,
})

export const billsMarkAsPaidError = error => ({
  type: types.BILLS_MARK_AS_PAID__ERROR, error,
})

export const billsDelete = billIds => ({
  type: types.BILLS_DELETE__BEGIN, billIds,
})

export const billsDeleteSuccess = (bills, billIds) => ({
  type: types.BILLS_DELETE__SUCCESS, bills, billIds,
})

export const billsDeleteError = error => ({
  type: types.BILLS_DELETE__ERROR, error,
})

export const billsPurge = () => ({
  type: types.BILLS_PURGE,
})
