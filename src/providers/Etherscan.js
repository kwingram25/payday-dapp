import axios from 'axios'

const apiUrl = 'https://api-rinkeby.etherscan.io/api'
const apikey = 'DT7BJSA6ACJNVH3V3B9IKI5IA4PVRIED1W'

export const etherscanUrl = address => `https://rinkeby.etherscan.io/address/${address}`

export default class Etherscan {
  static fetchBalance = async (address) => {
    const { status, data } = await axios({
      url: apiUrl,
      params: {
        module: 'account',
        action: 'balance',
        address,
        tag: 'latest',
        apikey,
      },
    })

    if (status < 400) {
      const balance = parseFloat(data.result, 10) / 1e18

      return isNaN(balance) ? 0 : balance
    }

    return null
  }

  static addressUrl = address => `https://rinkeby.etherscan.io/address/${address}`

  static txUrl = txHash => `https://rinkeby.etherscan.io/tx/${txHash}`
}
