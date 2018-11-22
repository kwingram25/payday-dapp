import types from '../config/types'

export const initialState = {
  dashboardFilter: 'all',
  dashboardShowArchived: false,
}

const actionsMap = (type) => {
  switch (type) {
    case types.SET_DASHBOARD_FILTER:
      return (state, { filter }) => {
        if (!['all', 'mine', 'others'].includes(filter)) {
          return state
        }
        return {
          ...state, dashboardFilter: filter,
        }
      }

    case types.SET_DASHBOARD_SHOW_ARCHIVED:
      return (state, { showArchived }) => ({
        ...state, dashboardShowArchived: showArchived,
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
