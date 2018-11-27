import { getFile, putFile } from 'blockstack'

export const accountFilePath = 'account.json'
export const contactsFilePath = 'contacts.json'
export const billsFilePath = username => `bills/${username}.json`
export const paymentsFilePath = username => `payments/${username}.json`

const baseOptions = {
  zoneFileLookupURL: 'https://core.blockstack.org/v1/names/',
}

const loader = ({
  path, fallback, decrypt = false, options = {},
}) => async () => {
  let data
  const opt = {
    ...baseOptions,
    decrypt,
    ...options,
  }

  try {
    data = JSON.parse(
      (await getFile(
        path,
        opt,
      )) || JSON.stringify(fallback),
    )
  } catch (e) {
    data = fallback
  }
  return data
}

const saver = ({
  path, fallback, encrypt = false, options = {},
}) => async (data) => {
  await putFile(
    path,
    JSON.stringify(data || fallback),
    {
      ...baseOptions,
      encrypt,
      ...options,
    },
  )
}

export default class Gaia {
  static loadOwnAccount = loader({
    path: accountFilePath,
    fallback: {},
  })

  static loadAccount = owner => loader({
    path: accountFilePath,
    fallback: {},
    options: { username: owner },
  })

  static saveAccount = saver({
    path: accountFilePath,
    fallback: {},
  })

  static loadContacts = loader({
    path: contactsFilePath,
    decrypt: true,
    fallback: [],
  })

  static saveContacts = saver({
    path: contactsFilePath,
    encrypt: true,
    fallback: [],
  })

  static loadBills = (target, owner = null) => loader({
    path: billsFilePath(target),
    fallback: {},
    options: owner ? { username: owner } : {},
  })

  static saveBills = target => saver({
    path: billsFilePath(target),
    fallback: {},
  })

  static loadPayments = (target, owner = null) => loader({
    path: paymentsFilePath(target),
    fallback: {},
    options: owner ? { username: owner } : {},
  })

  static savePayments = target => saver({
    path: paymentsFilePath(target),
    fallback: {},
  })
}
