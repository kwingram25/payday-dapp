import mapValues from 'lodash.mapvalues'
import groupBy from 'lodash.groupby'
import gett from 'lodash.get'

import Q from 'q'
import moment from 'moment'

import Gaia from 'providers/gaia'
import Ethereum from 'providers/web3'

import User from './User'
import Bill from './Bill'

const fields = [
  'billId',
  'date',
  'sender',
  'recipient',
  'amount',
  'txHash',
]

const txFields = [
  'amount',
  'gasPrice',
  'gasLimit',
]

export const getTxErrors = (
  values,
  owner,
  keys = Object.keys(values),
) => {
  const errors = keys.reduce(
    (obj, key) => {
      const err = {}
      const { [key]: value } = values

      if (!value) {
        err[key] = 'invalid'
      } else {
        switch (key) {
          case 'amount':

            if (typeof value !== 'number' || value <= 0) {
              err[key] = 'invalid'
            } else if (value > owner.balance) {
              err[key] = 'insufficient-funds'
            }
            break
          case 'gasPrice':
            if (typeof value !== 'number' || value <= 0) {
              err[key] = 'invalid'
            }
            break
          case 'gasLimit':
            if (typeof value !== 'number' || value <= 0) {
              err[key] = 'invalid'
            }
            break
          default:
            break
        }
      }

      return {
        ...obj,
        ...err,
      }
    },
    {},
  )

  return errors
}


export default class Payment {
  static store = null

  static async init(owner, targets) {
    try {
      const result = await Q.allSettled([
        ...targets.map(target => Gaia.loadPayments(target)()),
        ...targets.map(target => Gaia.loadPayments(owner.username, target)()),
      ])

      Payment.owner = owner

      Payment.store = result.reduce(
        (output, { value }) => ({
          ...output,
          ...mapValues(
            value,
            payments => payments.reduce(
              (arr, payment) => {
                try {
                  return [
                    ...arr,
                    new Payment(payment),
                  ]
                } catch (e) {
                  return arr
                }
              },
              [],
            ),
          ),
        }),
        {},
      )
    } catch (e) {
      throw e
    }
  }

  static get byRecipient() {
    const allPayments = Object.entries(Payment.store).reduce(
      (arr, [billId, payments]) => {
        if (gett(Bill.store, billId)) {
          return [
            ...arr,
            ...payments.map(payment => payment.toObject()),
          ]
        }
        return arr
      },
      [],
    )

    return mapValues(
      groupBy(
        allPayments.filter(({ sender }) => sender === Payment.owner.username),
        'recipient',
      ),
      arr => groupBy(
        arr,
        'billId',
      ),
    )
  }

  static async load() {
    const payments = await Gaia.loadPayments()

    Payment.store = payments
  }

  static save(target) {
    if (Payment.store && Payment.byRecipient[target]) {
      Gaia.savePayments(target)(
        Payment.byRecipient[target],
      )
    }

    return null
  }

  static async saveAll() {
    if (Payment.store) {
      await Q.allSettled(
        Object.keys(Payment.store).map(target => Payment.save(target)),
      )
    }
  }

  static send({
    to, amount, gasLimit, gasPrice,
  }) {
    const params = {
      privateKey: User.privateKey,
      to,
      amount,
      gasLimit,
      gasPrice,
    }

    return Ethereum.sendTransaction(params)
  }

  static validateTx(values) {
    const errors = getTxErrors(values, Payment.owner, txFields)
    if (Object.keys(errors).length) {
      throw errors
    }
    return true
  }

  billId

  sender

  recipient

  amount

  date = moment().unix()

  txHash

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
    let { [key]: value } = values
    if (!value) {
      value = this[key]
    }
    const errors = {}
    switch (key) {
      case 'billId':
        if (typeof value !== 'string' || (Bill.store && !Bill.store[value])) {
          errors.billId = 'invalid'
        }
        break
      case 'amount':
        if (typeof value !== 'number' || value <= 0) {
          errors.amount = 'invalid'
        }
        break
      case 'sender':
        if (!value || typeof value !== 'string') {
          errors.sender = 'empty-sender'
        }
        if (value === values.recipient) {
          errors.sender = 'cannot-pay-self'
        }
        break
      case 'recipient':
        if (!value || typeof value !== 'string') {
          errors.recipient = 'empty-target'
        }
        if (value === values.sender) {
          errors.recipient = 'cannot-pay-self'
        }
        break
      case 'date':
        if (typeof value !== 'number') {
          errors.date = 'invalid-date'
        }
        break
      default:
        break
    }
    if (Object.keys(errors).length) {
      throw errors
    }
    return true
  }

  save = () => {
    Payment.store[this.billId] = [
      ...(Payment.store[this.billId] || []),
      this,
    ]
    Payment.save(this.recipient)
  }

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
