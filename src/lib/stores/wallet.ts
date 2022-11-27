import { initWeb3W } from 'web3w'

export const { wallet, builtin, flow, transactions, chain } = initWeb3W({
  builtin: {
    autoprobe: true
  },
  options: [
    'builtin',
  ]
})
