// import api from 'api';
// import auth from 'utils/auth';
import types from 'config/types'

// "Log In" action creators
export const contactsFetch = () => ({
  type: types.CONTACTS_FETCH__BEGIN,
})

export const contactsFetchSuccess = contacts => ({
  type: types.CONTACTS_FETCH__SUCCESS, contacts,
})

export const contactsFetchError = error => ({
  type: types.CONTACTS_FETCH__ERROR, error,
})

export const contactsCreate = username => ({
  type: types.CONTACTS_CREATE__BEGIN, username,
})

export const contactsCreateSuccess = contacts => ({
  type: types.CONTACTS_CREATE__SUCCESS, contacts,
})

export const contactsCreateError = error => ({
  type: types.CONTACTS_CREATE__ERROR, error,
})

export const contactsDelete = username => ({
  type: types.CONTACTS_DELETE__BEGIN, username,
})

export const contactsDeleteSuccess = contacts => ({
  type: types.CONTACTS_DELETE__SUCCESS, contacts,
})

export const contactsDeleteError = error => ({
  type: types.CONTACTS_DELETE__ERROR, error,
})
