import types from 'config/types'

export const initialState = {
  data: null,
  fetching: false,
  creating: false,
  deleting: false,
  error: null,
}

const actionsMap = (type) => {
  switch (type) {
    case types.CONTACTS_FETCH__BEGIN:
      return state => ({
        ...state, fetching: true, error: null,
      })

    case types.CONTACTS_CREATE__BEGIN:
      return state => ({
        ...state, creating: true, error: null,
      })

    case types.CONTACTS_DELETE__BEGIN:
      return state => ({
        ...state, deleting: true, error: null,
      })

    case types.CONTACTS_FETCH__SUCCESS:
      return (state, { contacts }) => ({
        ...state, fetching: false, data: contacts, error: null,
      })

    case types.CONTACTS_CREATE__SUCCESS:
      return (state, { contacts }) => ({
        ...state, creating: false, data: contacts, error: null,
      })

    case types.CONTACTS_DELETE__SUCCESS:
      return (state, { contacts }) => ({
        ...state, deleting: false, data: contacts, error: null,
      })

    case types.CONTACTS_FETCH__ERROR:
      return (state, { error }) => ({
        ...state, fetching: false, error,
      })

    case types.CONTACTS_CREATE__ERROR:
      return (state, { error }) => ({
        ...state, creating: false, error,
      })

    case types.CONTACTS_DELETE__ERROR:
      return (state, { error }) => ({
        ...state, deleting: false, error,
      })

    case types.CONTACTS_PURGE:
      return () => initialState

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
