export default {
  ...[
    'USER_SIGNIN',
    'USER_POST_SIGNIN',
    'USER_SIGNOUT',
    'USER_ACCOUNT_FETCH',
    'USER_ACCOUNT_BALANCE_FETCH',
    'CONTACTS_FETCH',
    'CONTACTS_CREATE',
    'CONTACTS_DELETE',
    'BILLS_FETCH',
    'BILLS_CREATE',
    'BILLS_UPDATE',
    'BILLS_DELETE',
    'BILLS_MARK_AS_PAID',
    'PAYMENTS_CREATE',
    'PAYMENTS_FETCH',
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
    'SET_DASHBOARD_SORT',
    'SET_NOTIFICATION',
    'SHOW_TEST_MODE_NOTICE',
    'CONTACTS_PURGE',
    'BILLS_PURGE',
    'PAYMENTS_PURGE',
  ].reduce(
    (obj, str) => ({
      ...obj,
      [str]: str,
    }),
    { },
  ),
}
