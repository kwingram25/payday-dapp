import types from 'config/types'

export const initialState = {
  data: null,
  fetching: false,
  creating: false,
  error: {},
}

const actionsMap = (type) => {
  switch (type) {
    case types.PAYMENTS_FETCH__BEGIN:
      return state => ({
        ...state, fetching: true, error: null,
      })

    case types.PAYMENTS_FETCH__SUCCESS:
      return (state, { payments }) => ({
        ...state, fetching: false, data: payments, error: null,
      })

    case types.PAYMENTS_FETCH__ERROR:
      return (state, { error }) => ({
        ...state, fetching: false, error,
      })

    case types.PAYMENTS_CREATE__BEGIN:
      return state => ({
        ...state, creating: true, error: null,
      })

    case types.PAYMENTS_CREATE__SUCCESS:
      return (state, { payments }) => ({
        ...state, creating: false, data: payments, error: null,
      })

    case types.PAYMENTS_CREATE__ERROR:
      return (state, { error }) => ({
        ...state, creating: false, error,
      })

    case types.PAYMENTS_PURGE:
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
