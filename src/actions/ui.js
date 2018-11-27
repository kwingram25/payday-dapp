// import api from 'api';
// import auth from 'utils/auth';
import types from 'config/types'

// "Log In" action creators
export const setDashboardFilter = filter => ({
  type: types.SET_DASHBOARD_FILTER, filter,
})

export const setDashboardShowArchived = showArchived => ({
  type: types.SET_DASHBOARD_SHOW_ARCHIVED, showArchived,
})

export const setDashboardSort = (field, order) => ({
  type: types.SET_DASHBOARD_SORT, field, order,
})

export const setNotification = text => ({
  type: types.SET_NOTIFICATION, text,
})

export const showTestModeNotice = show => ({
  type: types.SHOW_TEST_MODE_NOTICE, show,
})
