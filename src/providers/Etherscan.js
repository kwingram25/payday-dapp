import axios from 'axios'

const apiUrl = 'https://api-rinkeby.etherscan.io/api'
const apikey = 'DT7BJSA6ACJNVH3V3B9IKI5IA4PVRIED1W'

export const etherscanUrl = address => `https://rinkeby.etherscan.io/address/${address}`

export default class Etherscan {
  fetchBalance = address => axios({
    url: apiUrl,
    params: {
      module: 'account',
      action: 'balance',
      address,
      tag: 'latest',
      apikey,
    },
  })
}
