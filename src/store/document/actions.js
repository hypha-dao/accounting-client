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

export const createEvent = async function ({ commit }, { contentGroups }) {
  try {
    commit('general/setIsLoading', true, { root: true })
    const accountName = await this.getters['accounts/account']
    const event = await this.$documentApi.createEvent({ contentGroups, accountName })
    return event
  } catch (e) {
    console.error('An error ocurred while trying to create event', e)
    commit('general/setErrorMsg', e.message || e, { root: true })
  } finally {
    commit('general/setIsLoading', false, { root: true })
  }
}

export const bindEvent = async function ({ commit }, { eventHash, componentHash }) {
  try {
    commit('general/setIsLoading', true, { root: true })
    const updater = await this.getters['accounts/account']
    const event = await this.$documentApi.bindEvent({ updater, eventHash, componentHash })
    return event
  } catch (e) {
    console.error('An error ocurred while trying to bind event', e)
    commit('general/setErrorMsg', e.message || e, { root: true })
  } finally {
    commit('general/setIsLoading', false, { root: true })
  }
}

export const unbindEvent = async function ({ commit }, { eventHash, componentHash }) {
  try {
    commit('general/setIsLoading', true, { root: true })
    const updater = await this.getters['accounts/account']
    const event = await this.$documentApi.unbindEvent({ updater, eventHash, componentHash })
    return event
  } catch (e) {
    console.error('An error ocurred while trying to unbind event', e)
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
    const transaction = await this.$documentApi.createTxn({ contentGroups, accountName })
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
    const transaction = await this.$documentApi.createTxnWithEvent({ contentGroups, accountName })
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
    const transaction = await this.$documentApi.updateTxn({ updater, transactionHash, contentGroups })
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
    const transaction = await this.$documentApi.updateTxn({ issuer, transactionHash })
    return transaction
  } catch (e) {
    console.error('An error ocurred while trying to crerate txn with event', e)
    commit('general/setErrorMsg', e.message || e, { root: true })
  } finally {
    commit('general/setIsLoading', false, { root: true })
  }
}
