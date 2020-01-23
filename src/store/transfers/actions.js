export const sendTokens = async function ({ commit, rootState }, { to, quantity, memo }) {
  try {
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
    await this.$api.signTransaction(actions)
  } catch (e) {
    console.log(e)
  }
}
