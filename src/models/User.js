import {
  redirectToSignIn,
  isSignInPending,
  isUserSignedIn,
  handlePendingSignIn,
  loadUserData,
  signUserOut,
  Person,
} from 'blockstack'

import Gaia from 'providers/gaia'
import Ethereum from 'providers/web3'
import Etherscan from 'providers/etherscan'

export default class User {
  static async signIn() {
    const { origin } = window.location
    return redirectToSignIn(origin, `${origin}/manifest.json`, ['store_write', 'publish_data'])
  }

  static async signOut() {
    return signUserOut()
  }

  static async init() {
    if (isSignInPending()) {
      try {
        await handlePendingSignIn()

        return new User()
      } catch (e) {
        throw new Error(e)
      }
    } else if (isUserSignedIn()) {
      return new User()
    }

    return null
  }

  static get privateKey() {
    return loadUserData().appPrivateKey
  }

  username

  name = null

  avatarUrl = null

  address = null

  balance = 0

  constructor() {
    try {
      const { username, profile } = loadUserData()
      this.username = username

      const person = new Person(profile)
      this.name = person.name() || username.split('.')[0]
      this.avatarUrl = person.avatarUrl()
    } catch (e) {
      throw e
    }
  }

  fetchAccount = async () => {
    try {
      let { address } = await Gaia.loadOwnAccount()

      if (!address) {
        address = Ethereum.generateAccountAddress(
          User.privateKey,
        )
        await Gaia.saveAccount({ address })
      }

      if (address) {
        this.address = address
        await this.fetchBalance()
      }
    } catch (e) {
      throw new Error(e.message)
    }
  }

  fetchBalance = async () => {
    try {
      let balance
      if (this.address) {
        balance = await Etherscan.fetchBalance(this.address)

        this.balance = typeof balance === 'number' ? balance : 0
      }
    } catch (e) {
      throw new Error(e.message)
    }
  }
}
