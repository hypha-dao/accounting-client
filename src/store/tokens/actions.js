export const getTokens = async function ({ commit }) {
  try {
    commit('general/setIsLoading', true, { root: true })
    const transaction = await this.$tokensApi.getTokens()
    return transaction
  } catch (e) {
    console.error('An error ocurred while trying to get transactions', e)
    commit('general/setErrorMsg', e.message || e, { root: true })
  } finally {
    commit('general/setIsLoading', false, { root: true })
  }
}

export const addToken = async function ({ commit }, { symbol }) {
  try {
    commit('general/setIsLoading', true, { root: true })
    const accountName = await this.getters['accounts/account']
    const transactions = await this.$tokensApi.addToken({ symbol, accountName })
    return transactions
  } catch (e) {
    console.error('An error ocurred while trying to get transactions', e)
    commit('general/setErrorMsg', e.message || e, { root: true })
  } finally {
    commit('general/setIsLoading', false, { root: true })
  }
}

export const removeToken = async function ({ commit }, { symbol }) {
  try {
    commit('general/setIsLoading', true, { root: true })
    const accountName = await this.getters['accounts/account']
    const transactions = await this.$tokensApi.removeToken({ symbol, accountName })
    return transactions
  } catch (e) {
    console.error('An error ocurred while trying to get transactions', e)
    commit('general/setErrorMsg', e.message || e, { root: true })
  } finally {
    commit('general/setIsLoading', false, { root: true })
  }
}
