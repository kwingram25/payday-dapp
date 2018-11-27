import pickBy from 'lodash.pickby'
import Q from 'q'
import {
  lookupProfile, Person,
} from 'blockstack'

import Gaia from 'providers/gaia'

const fields = [
  'username',
  'name',
  'avatarUrl',
  'address',
]

export default class Contact {
  static store = null

  static async init(me) {
    Contact.me = me
    await Contact.load()
  }

  static async load() {
    const usernames = await Gaia.loadContacts()
    const contacts = usernames.map(username => new Contact({ username }))

    await Q.allSettled(
      contacts.map(contact => contact.populate()),
    )
  }

  static populate(usernames) {
    return Q.allSettled(
      usernames.map(username => lookupProfile(username)),
    )
  }

  static save = () => Gaia.saveContacts(
    Object.keys(Contact.store),
  )

  static async delete(username) {
    Contact.store = pickBy(Contact.store, (v, k) => k !== username)
    Contact.save()
  }

  username

  name = null

  avatarUrl = null

  constructor(data) {
    try {
      fields.forEach((key) => {
        if (this.validate(key, data)) {
          this[key] = data[key] || this[key]
        }
      })
    } catch (e) {
      throw e
    }
  }

  validate = (key, values) => {
    const { [key]: value = this[key] } = values

    switch (key) {
      case 'username':
        if (typeof value !== 'string' || value === '') {
          throw new Error('invalid-username')
        }
        if (value === Contact.me) {
          throw new Error('cannot-add-self')
        }
        if (Contact.store && Contact.store[value]) {
          throw new Error('contact-exists')
        }
        break
      default:
        break
    }
    return true
  }

  populate = () => new Promise(async (resolve, reject) => {
    try {
      const [profile, account] = await Q.allSettled([
        lookupProfile(this.username),
        Gaia.loadAccount(this.username)(),
      ])
      if (!profile.value) {
        throw new Error('invalid-username')
      }

      const person = new Person(profile.value)

      this.name = person.name() || this.username.split('.')[0]
      this.avatarUrl = person.avatarUrl()

      if (account.value) {
        const { address } = account.value
        this.address = address
      }

      Contact.store = Object.assign(
        {},
        Contact.store || {},
        {
          [this.username]: this.toObject(),
        },
      )

      resolve(this)
    } catch (e) {
      reject(e)
    }
  })

  toObject = () => ({
    ...fields.reduce(
      (obj, key) => ({
        ...obj,
        [key]: this[key],
      }),
      {},
    ),
  })
}
