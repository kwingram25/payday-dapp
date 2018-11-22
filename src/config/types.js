export default {
  ...[
    'USER_SIGNIN',
    'USER_SIGNOUT',
    'FETCH_BILLS',
    'ADD_BILL',
    'DELETE_BILL',
    'EDIT_BILL',
    'USER_ACCOUNT_FETCH',
    'USER_BALANCE_FETCH',
    'CONTACTS_FETCH',
    'CONTACTS_CREATE',
    'CONTACTS_DELETE',
    'BILLS_FETCH',
    'BILLS_CREATE',
    'BILLS_UPDATE',
    'BILLS_DELETE',
    'BILLS_MARK_AS_PAID',
  ].reduce(
    (obj, str) => ({
      ...obj,
      [`${str}__BEGIN`]: `${str}__BEGIN`,
      [`${str}__SUCCESS`]: `${str}__SUCCESS`,
      [`${str}__ERROR`]: `${str}__ERROR`,
    }),
    { },
  ),

  ...[
    'SET_DASHBOARD_FILTER',
    'SET_DASHBOARD_SHOW_ARCHIVED',
  ].reduce(
    (obj, str) => ({
      ...obj,
      [str]: str,
    }),
    { },
  ),
}
