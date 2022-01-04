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

export const getExchangeRates = async function ({ commit }) {
  try {
    commit('general/setIsLoading', true, { root: true })
    const { data: tokens } = await this.$tokensApi.getExchangeForTokens()
    console.log('Exchange rate', tokens)
    commit('setTokensWithExchange', tokens)
  } catch (e) {
    console.error('An error ocurred while trying to get exchange rates', e)
    commit('general/setErrorMsg', e.message || e, { root: true })
  } finally {
    commit('general/setIsLoading', false, { root: true })
  }
}

export const getExchangeRateForDateAndToken = async function ({ commit }, { date, token }) {
  try {
    const { data: { market_data: { current_price: { usd } } } } = await this.$tokensApi.getExchangeRateForDateAndToken({ date, token })
    return usd
  } catch (e) {
    console.error('An error ocurred while trying to get exchange rates', e)
  }
}
