import types from '../config/types'

export const initialState = {
  address: null,
  balance: null,
  working: false,
  error: null,
}

const actionsMap = (type) => {
  switch (type) {
    case types.USER_ACCOUNT_FETCH__BEGIN:
      return state => ({
        ...state, working: true, error: null,
      })

    case types.USER_ACCOUNT_FETCH__SUCCESS:
      return (state, { address }) => ({
        ...state, working: false, address, error: null,
      })

    case types.USER_ACCOUNT_FETCH__ERROR:
      return (state, { error }) => ({
        ...state, working: false, error,
      })

    case types.USER_BALANCE_FETCH__BEGIN:
      return state => ({
        ...state, working: true, error: null,
      })

    case types.USER_BALANCE_FETCH__SUCCESS:
      return (state, { balance }) => ({
        ...state, working: false, balance, error: null,
      })

    case types.USER_BALANCE_FETCH__ERROR:
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
