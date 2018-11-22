import types from '../config/types'

export const initialState = {
  user: null,
  working: false,
  error: null,
}

const actionsMap = (type) => {
  switch (type) {
    case types.USER_SIGNIN__BEGIN:
    case types.USER_SIGNOUT__BEGIN:
      return state => ({
        ...state, working: true, error: null,
      })

    case types.USER_SIGNIN__SUCCESS:
      return (state, { user }) => ({
        ...state, working: false, user, error: null,
      })

    case types.USER_SIGNOUT__SUCCESS:
      return state => ({
        ...state, working: false, user: null, error: null,
      })

    case types.USER_SIGNIN__ERROR:
    case types.USER_SIGNOUT__ERROR:
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
