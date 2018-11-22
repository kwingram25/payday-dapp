import pickBy from 'lodash.pickby'
import Q from 'q'
import {
  getFile, putFile, lookupProfile, Person,
} from 'blockstack'

import { gaiaOptions } from 'config/app'

const fields = [
  'username',
  'name',
  'avatarUrl',
]


const filePath = 'contacts.json'

export default class Contact {
  static store = null

  static async init() {
    // Contact.store = {}
    // await Contact.save()
    await Contact.load()
  }

  static async load() {
    let usernames
    try {
      usernames = JSON.parse(
        await getFile(
          filePath,
          gaiaOptions({
            decrypt: true,
          }),
        ),
      ) || '[]'
    } catch (e) {
      usernames = []
    }

    // const profiles = (await Q.allSettled(
    //   usernames.map(username => lookupProfile(username)),
    // )).map(({ value }) => value && new Person(value))

    // const profiles = await Contact.populate(usernames)
    //
    // profiles.forEach()
    const contacts = usernames.map(username => new Contact({ username }))

    console.log(contacts)
    await Q.allSettled(
      contacts.map(contact => contact.populate()),
    )

    if (!Contact.store) {
      Contact.store = {}
    }
    await Contact.save()

    // Contact.store = usernames.reduce(
    //   (obj, username, index) => ({
    //     ...obj,
    //     ...(profiles[index] ? {
    //       username: new Contact({ username, ...profiles[index] }),
    //     } : {}),
    //   }),
    //   {},
    // )

  }

  static populate(usernames) {
    return Q.allSettled(usernames.map(username => lookupProfile(username)))
  }

  static save() {
    if (Contact.store) {
      return putFile(
        filePath,
        JSON.stringify(
          Object.keys(Contact.store),
        ),
        gaiaOptions({
          encrypt: true,
        }),
      )
    }

    return null
  }

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
      throw new Error(e)
    }
  }

  validate = (key, values) => {
    const { [key]: value = this[key] } = values

    switch (key) {
      case 'username':
        if (typeof value !== 'string' || value === '') {
          throw new Error('invalid-username')
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

  populate = () => new Promise((resolve, reject) => {
    lookupProfile(this.username)
      .then((profile) => {
        const person = new Person(profile)

        this.name = person.name() || this.username.split('.')[0]
        this.avatarUrl = person.avatarUrl()

        Contact.store = Object.assign(
          {},
          Contact.store || {},
          {
            [this.username]: this.toJSON(),
          },
        )

        resolve(this)
      })
      .catch((e) => {
        console.log(e)
        reject(e)
      })
  })

  toJSON = () => ({
    ...fields.reduce(
      (obj, key) => ({
        ...obj,
        [key]: this[key],
      }),
      {},
    ),
  })
  //
  // isOwnedBy = username => this.owner === username
}
