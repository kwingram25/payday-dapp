import types from 'config/types'
import Bill from 'models/Bill'

export const initialState = {
  data: Bill.store,
  working: false,
  error: null,
}

const actionsMap = (type) => {
  switch (type) {
    case types.BILLS_FETCH__BEGIN:
      return state => ({
        ...state, working: 'fetch', error: null,
      })

    case types.BILLS_CREATE__BEGIN:
      return state => ({
        ...state, working: 'create', error: null,
      })

    case types.BILLS_DELETE__BEGIN:
      return state => ({
        ...state, working: 'delete', error: null,
      })

    case types.BILLS_UPDATE__BEGIN:
    case types.BILLS_MARK_AS_PAID__BEGIN:
      return state => ({
        ...state, working: 'update', error: null,
      })

    case types.BILLS_FETCH__SUCCESS:
    case types.BILLS_CREATE__SUCCESS:
    case types.BILLS_DELETE__SUCCESS:
    case types.BILLS_UPDATE__SUCCESS:
    case types.BILLS_MARK_AS_PAID__SUCCESS:
      return (state) => ({
        ...state, working: false, data: Bill.store, error: null,
      })

    case types.BILLS_FETCH__ERROR:
    case types.BILLS_CREATE__ERROR:
    case types.BILLS_DELETE__ERROR:
    case types.BILLS_UPDATE__ERROR:
    case types.BILLS_MARK_AS_PAID__ERROR:
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
