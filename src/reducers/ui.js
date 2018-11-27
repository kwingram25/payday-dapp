import types from '../config/types'

export const initialState = {
  dashboardFilter: 'all',
  dashboardShowArchived: false,
  dashboardSortField: 'date',
  dashboardSortOrder: true,
  notification: null,
  showTestModeNotice: false,
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

    case types.SET_DASHBOARD_SORT:
      return (state, { field, order }) => ({
        ...state, dashboardSortField: field, dashboardSortOrder: order,
      })

    case types.SET_NOTIFICATION:
      return (state, { text }) => ({
        ...state, notification: text,
      })

    case types.SHOW_TEST_MODE_NOTICE:
      return (state, { show }) => ({
        ...state, showTestModeNotice: show,
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
