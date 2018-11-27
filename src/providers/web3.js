import Web3 from 'web3'
import EthereumTx from 'ethereumjs-tx'
import * as ethUtils from 'ethereumjs-util'

const PROVIDER_URL = 'https://rinkeby.infura.io/v3/d2398c1c074c4801ab63712c6b850406'

const web3 = new Web3(new Web3.providers.HttpProvider(PROVIDER_URL))

const privateKeyToBuffer = key => Buffer.from(key, 'hex')

const privateKeyToAddress = (key) => {
  const buf = privateKeyToBuffer(key)
  return `0x${ethUtils.privateToAddress(buf).toString('hex')}`
}

export default class Ethereum {
  static generateAccountAddress(key) {
    return privateKeyToAddress(key)
  }

  static async sendTransaction({
    privateKey, to, amount, gasLimit, gasPrice,
  }) {
    const nonce = await web3.eth.getTransactionCount(
      privateKeyToAddress(privateKey),
    )

    const params = {
      to,
      nonce: nonce ? web3.utils.toHex(nonce.toString()) : undefined,
      value: web3.utils.toHex(
        web3.utils.toWei(amount.toString(), 'ether').toString(),
      ),
      gasLimit: web3.utils.toHex(gasLimit.toString()),
      gasPrice: web3.utils.toHex((gasPrice * 10e8).toString()),
    }

    const tx = new EthereumTx(params)

    tx.sign(privateKeyToBuffer(privateKey))
    return web3.eth.sendSignedTransaction(
      `0x${tx.serialize().toString('hex')}`,
    )
  }
}
