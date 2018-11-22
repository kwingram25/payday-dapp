import types from 'config/types'

import Contact from 'models/Contact'

export const initialState = {
  data: Contact.store,
  working: false,
  error: null,
}

const actionsMap = (type) => {
  switch (type) {
    case types.CONTACTS_FETCH__BEGIN:
      return state => ({
        ...state, working: 'fetch', error: null,
      })

    case types.CONTACTS_CREATE__BEGIN:
      return state => ({
        ...state, working: 'create', error: null,
      })

    case types.CONTACTS_DELETE__BEGIN:
      return state => ({
        ...state, working: 'delete', error: null,
      })

    case types.CONTACTS_FETCH__SUCCESS:
    case types.CONTACTS_CREATE__SUCCESS:
    case types.CONTACTS_DELETE__SUCCESS:
      return state => ({
        ...state, working: false, data: Contact.store, error: null,
      })

    case types.CONTACTS_FETCH__ERROR:
    case types.CONTACTS_CREATE__ERROR:
    case types.CONTACTS_DELETE__ERROR:
      return (state, { error }) => ({
        ...state, working: false, error,
      })

    default:
      return state => state
  }
}

export default (
  state = initialState,
  action,
) => {
  const reduceFn = actionsMap(action.type)
  if (!reduceFn) return state
  return reduceFn(state, action)
}
