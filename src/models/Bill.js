import mapValues from 'lodash.mapvalues'
import set from 'lodash.set'
import get from 'lodash.get'
import unset from 'lodash.unset'
import groupBy from 'lodash.groupby'
import keyBy from 'lodash.keyby'

import moment from 'moment'
import Q from 'q'
import generate from 'nanoid/generate'

import Gaia from 'providers/gaia'

import Payment from './Payment'

const fields = [
  'id',
  'owner',
  'target',
  'amount',
  'description',
  'date',
  'markedPaid',
]

const newId = () => generate('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 8)

export const getErrors = (values, defaults) => {
  const errors = Object.keys(values).reduce(
    (obj, key) => {
      const err = {}
      let { [key]: value } = values
      if (!value && defaults) {
        value = defaults[key]
      }
      switch (key) {
        case 'amount':
          if (typeof value !== 'number' || value <= 0) {
            err[key] = 'invalid'
          }
          break
        case 'owner':
          if (!value || typeof value !== 'string') {
            err[key] = 'invalid'
          } else if (value === values.target || (defaults && value === defaults.target)) {
            err[key] = 'cannot-self-bill'
          }
          break
        case 'target':
          if (!value || typeof value !== 'string') {
            err[key] = 'invalid'
          } else if (value === values.owner || (defaults && value === defaults.owner)) {
            err[key] = 'cannot-self-bill'
          }
          break
        case 'description':
          if (typeof value !== 'string' || value === '') {
            err[key] = 'invalid'
          }
          break
        case 'date':
          if (typeof value !== 'number') {
            err[key] = 'invalid'
          }
          break
        default:
          break
      }

      return {
        ...obj,
        ...err,
      }
    },
    {},
  )

  return errors
  // if (Object.keys(errors).length) {
  //   throw errors
  // }
}

export default class Bill {
  static store = null

  static owner = null

  static async init(owner, targets) {
    const result = await Q.allSettled([
      ...targets.map(target => Gaia.loadBills(target)()),
      ...targets.map(target => Gaia.loadBills(owner, target)()),
    ])
    Bill.owner = owner
    Bill.store = result.reduce(
      (output, { value }) => ({
        ...output,
        ...(
          typeof value === 'object' ? mapValues(
            value,
            values => new Bill(values, owner),
          )
            : {}),
      }),
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
    if (Bill.store && (Bill.byUser[target] || {})) {
      Gaia.saveBills(target)(
        mapValues(Bill.byUser[target], bill => bill.toObject()),
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
    return Gaia.loadBills(target, owner)
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

  get payments() {
    return get(Payment, ['store', this.id], [])
  }

  get amountPaid() {
    return this.payments.reduce((sum, { amount: amt }) => sum + amt, 0)
  }

  get amountRemaining() {
    return this.amount - this.amountPaid
  }

  get pctPaid() {
    return 100 * (this.amountPaid / this.amount)
  }

  get isPaid() {
    return this.amountPaid >= this.amount
  }

  get isClosed() {
    return this.markedPaid || this.isPaid
  }

  constructor(data) {
    this.update(data)
  }

  // validate = (key, values) => !fields.reduce(
  //   (errors,
  //     validate(key, values, this)

  update = (data) => {
    try {
      const errors = getErrors(data, this)

      if (Object.keys(errors).length) {
        throw errors
      }

      Object.keys(data).forEach((key) => {
        this[key] = data[key]
      })

      this.isOwned = this.owner === Bill.owner
      set(Bill.store, this.id, this)
      Bill.save(this.target)
    } catch (e) {
      throw typeof e === 'object' ? e : new Error(e)
    }
  }

  delete = () => {
    unset(Bill.store, this.id, this)
  }

  toObject = (withMeta = false) => ({
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
      isClosed: this.isClosed,
      amountPaid: this.amountPaid,
      amountRemaining: this.amountRemaining,
      pctPaid: this.pctPaid,
    } : {}),
  })

  isOwnedBy = username => this.owner === username
}
