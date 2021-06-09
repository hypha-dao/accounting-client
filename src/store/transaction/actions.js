export const getTransactions = async function ({ commit }) {
  try {
    commit('general/setIsLoading', true, { root: true })
    const transactions = await this.$transactionApi.getTransactions()
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
    console.log('uid', uid)
    commit('general/setIsLoading', true, { root: true })
    const transactions = await this.$transactionApi.getTransactionById({ uid })
    return transactions
  } catch (e) {
    console.error('An error ocurred while trying to get transactions', e)
    commit('general/setErrorMsg', e.message || e, { root: true })
  } finally {
    commit('general/setIsLoading', false, { root: true })
  }
}

export const createTxn = async function ({ commit }, { contentGroups }) {
  try {
    commit('general/setIsLoading', true, { root: true })
    const accountName = await this.getters['accounts/account']
    console.log('store', contentGroups)
    const transaction = await this.$transactionApi.createTxn({ contentGroups, accountName })
    return transaction
  } catch (e) {
    console.error('An error ocurred while trying to create txn', e)
    commit('general/setErrorMsg', e.message || e, { root: true })
  } finally {
    commit('general/setIsLoading', false, { root: true })
  }
}

export const createTxnWithEvent = async function ({ commit }, { contentGroups }) {
  try {
    commit('general/setIsLoading', true, { root: true })
    const accountName = await this.getters['accounts/account']
    console.log('store', contentGroups)
    const transaction = await this.$transactionApi.createTxnWithEvent({ contentGroups, accountName })
    return transaction
  } catch (e) {
    console.error('An error ocurred while trying to crerate txn with event', e)
    commit('general/setErrorMsg', e.message || e, { root: true })
  } finally {
    commit('general/setIsLoading', false, { root: true })
  }
}

export const updateTxn = async function ({ commit }, { transactionHash, contentGroups }) {
  try {
    commit('general/setIsLoading', true, { root: true })
    const updater = await this.getters['accounts/account']
    // console.log('store', contentGroups)
    const transaction = await this.$transactionApi.updateTxn({ updater, transactionHash, contentGroups })
    return transaction
  } catch (e) {
    console.error('An error ocurred while trying to crerate txn with event', e)
    commit('general/setErrorMsg', e.message || e, { root: true })
  } finally {
    commit('general/setIsLoading', false, { root: true })
  }
}

export const balanceTxn = async function ({ commit }, { transactionHash }) {
  try {
    commit('general/setIsLoading', true, { root: true })
    const issuer = await this.getters['accounts/account']
    const transaction = await this.$transactionApi.updateTxn({ issuer, transactionHash })
    return transaction
  } catch (e) {
    console.error('An error ocurred while trying to crerate txn with event', e)
    commit('general/setErrorMsg', e.message || e, { root: true })
  } finally {
    commit('general/setIsLoading', false, { root: true })
  }
}
