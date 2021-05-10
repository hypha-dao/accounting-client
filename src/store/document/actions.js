export const getDocuments = async function ({ commit }) {
  try {
    commit('general/setIsLoading', true, { root: true })
    // const accountName = this.getters['accounts/account']
    const response = await this.$documentApi.getDocuments({ })
    // await commit('setDocuments', response)
    return response
  } catch (e) {
    console.error('An error ocurred while trying to get my entries', e)
    commit('general/setErrorMsg', e.message || e, { root: true })
    throw new Error(e)
  } finally {
    commit('general/setIsLoading', false, { root: true })
  }
}

export const getTransactions = async function ({ commit }) {
  try {
    commit('general/setIsLoading', true, { root: true })
    const transactions = await this.$documentApi.getTransactions()
    return transactions
  } catch (e) {
    console.error('An error ocurred while trying to get transactions', e)
    commit('general/setErrorMsg', e.message || e, { root: true })
  } finally {
    commit('general/setIsLoading', false, { root: true })
  }
}
export const getTransactionById = async function ({ commit }, { uid }) {
  try {
    commit('general/setIsLoading', true, { root: true })
    const transactions = await this.$documentApi.getTransactionById({ uid })
    return transactions
  } catch (e) {
    console.error('An error ocurred while trying to get transactions', e)
    commit('general/setErrorMsg', e.message || e, { root: true })
  } finally {
    commit('general/setIsLoading', false, { root: true })
  }
}

export const getUnbalancedTransactions = async function ({ commit }) {
  try {
    commit('general/setIsLoading', true, { root: true })
    const transactions = await this.$documentApi.getUnbalancedTransactions()
    return transactions
  } catch (e) {
    console.error('An error ocurred while trying to get unbalanced transactions', e)
    commit('general/setErrorMsg', e.message || e, { root: true })
  } finally {
    commit('general/setIsLoading', false, { root: true })
  }
}
