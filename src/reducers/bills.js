import types from 'config/types'
import Bill from 'models/Bill'

export const initialState = {
  data: null,
  fetching: false,
  creating: false,
  updating: false,
  deleting: false,
  error: {},
}

const actionsMap = (type) => {
  switch (type) {
    case types.BILLS_FETCH__BEGIN:
      return state => ({
        ...state, fetching: true, error: {},
      })

    case types.BILLS_CREATE__BEGIN:
      return state => ({
        ...state, creating: true, error: {},
      })

    case types.BILLS_DELETE__BEGIN:
      return state => ({
        ...state, deleting: true, error: {},
      })

    case types.BILLS_UPDATE__BEGIN:
    case types.BILLS_MARK_AS_PAID__BEGIN:
      return state => ({
        ...state, updating: true, error: {},
      })

    case types.BILLS_FETCH__SUCCESS:
      return state => ({
        ...state, fetching: false, data: Bill.store, error: {},
      })

    case types.BILLS_CREATE__SUCCESS:
      return state => ({
        ...state, creating: false, data: Bill.store, error: {},
      })

    case types.BILLS_UPDATE__SUCCESS:
    case types.BILLS_MARK_AS_PAID__SUCCESS:
      return state => ({
        ...state, updating: false, data: Bill.store, error: {},
      })

    case types.BILLS_DELETE__SUCCESS:
      return state => ({
        ...state, deleting: false, data: Bill.store, error: {},
      })

    case types.BILLS_FETCH__ERROR:
      return (state, { error }) => ({
        ...state, fetching: false, error,
      })

    case types.BILLS_CREATE__ERROR:
      return (state, { error }) => ({
        ...state, creating: false, error,
      })

    case types.BILLS_UPDATE__ERROR:
    case types.BILLS_MARK_AS_PAID__ERROR:
      return (state, { error }) => ({
        ...state, updating: false, error,
      })

    case types.BILLS_DELETE__ERROR:
      return (state, { error }) => ({
        ...state, deleting: false, error,
      })

    case types.BILLS_PURGE:
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
