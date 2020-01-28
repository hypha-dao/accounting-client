export const sendTokens = async function ({ commit, rootState }, { to, quantity, memo }) {
  const actions = [{
    account: 'eosio.token',
    name: 'transfer',
    data: {
      from: rootState.accounts.account,
      to,
      quantity: `${parseFloat(quantity).toFixed(4)} TLOS`,
      memo
    }
  }]
  return this.$api.signTransaction(actions)
}
