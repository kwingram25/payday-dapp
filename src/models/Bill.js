import mapValues from 'lodash.mapvalues'
import set from 'lodash.set'
import get from 'lodash.get'
import unset from 'lodash.unset'
import groupBy from 'lodash.groupby'
import keyBy from 'lodash.keyby'

import moment from 'moment'
import Q from 'q'
import generate from 'nanoid/generate'
import { getFile, putFile } from 'blockstack'

import { gaiaOptions } from 'config/app'

const fields = [
  'id',
  'owner',
  'target',
  'amount',
  'description',
  'date',
  'markedPaid',
  'transactions',
]

const newId = () => generate('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 8)

const filePath = username => `bills/${username}.json`

export default class Bill {
  static store = null

  static owner = null

  static async init(owner, targets) {
    const result = await Q.allSettled([
      ...targets.map(target => Bill.load(target)),
      ...targets.map(target => Bill.load(owner, target)),
    ])
    Bill.owner = owner
    Bill.store = result.reduce(
      (output, { value }) => {
        let obj
        try {
          obj = JSON.parse(value || '{}')
        } catch (e) {
          obj = {}
        }

        return {
          ...output,
          ...mapValues(
            obj,
            values => new Bill(values, owner),
          ),
        }
      },
      {},
    )
  }

  static get byUser() {
    return mapValues(
      groupBy(
        Object.values(Bill.store).filter(({ owner }) => owner === Bill.owner),
        'target',
      ),
      arr => keyBy(arr, 'id'),
    )
  }

  static save(target) {
    if (Bill.store && Bill.byUser[target]) {
      return putFile(
        filePath(target),
        JSON.stringify(
          mapValues(Bill.byUser[target], bill => bill.toJSON()),
        ),
        gaiaOptions({
          encrypt: false,
        }),
      )
    }

    return null
  }

  static async saveAll() {
    if (Bill.store) {
      await Q.allSettled(
        Object.keys(Bill.store).map(target => Bill.save(target)),
      )
    }
  }

  static load(target, owner) {
    return getFile(
      filePath(target),
      gaiaOptions({
        decrypt: false,
        ...(
          owner
            ? { username: owner }
            : { }
        ),
      }),
    )
  }

  static async loadAll(targets) {
    const result = await Q.allSettled([
      ...targets.map(target => Bill.load(target)),
      ...targets.map(target => Bill.load(Bill.owner, target)),
    ])

    return result.reduce(
      (output, { value }) => {
        let obj
        try {
          obj = JSON.parse(value || '{}')
        } catch (e) {
          obj = {}
        }

        return {
          ...output,
          ...mapValues(
            obj,
            values => new Bill(values),
          ),
        }
      },
      {},
    )
  }

  static async delete(billIds) {
    const targets = []
    billIds.forEach((billId) => {
      targets.push(get(Bill.store, [billId, 'target']))
      unset(Bill.store, billId)
    })
    console.log(targets)
    return Q.allSettled(
      targets.map(target => Bill.save(target)),
    )
  }

  id = newId()

  owner

  target

  amount

  description

  date = moment().unix()

  markedPaid = false

  transactions = []

  get amountPaid() {
    return this.transactions.length ? this.transactions.reduce((sum, { amount: amt }) => sum + amt, 0) : 0
  }

  get pctPaid() {
    return 100 * (this.amountPaid / this.amount)
  }

  get isPaid() {
    return this.markedPaid || (this.amountPaid >= this.amount)
  }

  constructor(data) {
    try {
      fields.forEach((key) => {
        if (this.validate(key, data)) {
          this[key] = data[key] || this[key]
        }
      })
      this.isOwned = this.owner === Bill.owner

      set(Bill.store, this.id, this)
      Bill.save(this.target)
    } catch (e) {
      throw new Error(e)
    }
  }

  validate = (key, values) => {
    let { [key]: value } = values
    if (!value) {
      value = this[key]
    }
    switch (key) {
      case 'amount':
        if (typeof value !== 'number' || value <= 0) {
          throw new Error('invalid-amount')
        }
        break
      case 'owner':
        if (value === values.target || value === this.target) {
          throw new Error('cannot-self-bill')
        }
        break
      case 'target':
        if (value === values.owner || value === this.owner) {
          throw new Error('cannot-self-bill')
        }
        break
      case 'description':
        if (typeof value !== 'string' || value === '') {
          throw new Error('invalid-description')
        }
        break
      case 'date':
        if (typeof value !== 'number') {
          throw new Error('invalid-date')
        }
        break
      default:
        break
    }
    return true
  }

  update = (data) => {
    try {
      Object.keys(data).forEach((key) => {
        if (this.validate(key, data)) {
          this[key] = data[key]
        }
      })
      this.isOwned = this.owner === Bill.owner
      set(Bill.store, this.id, this)
      Bill.save(this.target)
    } catch (e) {
      throw new Error(e)
    }
  }

  delete = () => {
    unset(Bill.store, this.id, this)
  }

  toJSON = (withMeta = false) => ({
    ...fields.reduce(
      (obj, key) => ({
        ...obj,
        [key]: this[key],
      }),
      {},
    ),
    ...(withMeta ? {
      isOwned: this.isOwned,
      isPaid: this.isPaid,
      amountPaid: this.amountPaid,
      pctPaid: this.pctPaid,
    } : {}),
  })

  isOwnedBy = username => this.owner === username
}
