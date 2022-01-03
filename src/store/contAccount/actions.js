export const createAccount = async function ({ commit }, { accountInfo }) {
  try {
    commit('general/setIsLoading', true, { root: true })
    const creator = this.getters['accounts/account']

    // console.log('ACTION', creator, accountInfo)
    const account = await this.$accountApi.createAccount({ creator, accountInfo })
    return account
  } catch (e) {
    console.error('An error ocurred while trying to create account', e)
    commit('general/setErrorMsg', e.message || e, { root: true })
    throw new Error(e)
  } finally {
    commit('general/setIsLoading', false, { root: true })
  }
}

export const updateAccount = async function ({ commit }, { accountInfo, accountHash }) {
  try {
    commit('general/setIsLoading', true, { root: true })
    const updater = this.getters['accounts/account']
    const account = await this.$accountApi.updateAccount({ updater, accountInfo, accountHash })
    return account
  } catch (e) {
    console.error('An error ocurred while trying to create account', e)
    commit('general/setErrorMsg', e.message || e, { root: true })
    throw new Error(e)
  } finally {
    commit('general/setIsLoading', false, { root: true })
  }
}

export const getChartOfAccounts = async function ({ commit }) {
  try {
    commit('general/setIsLoading', true, { root: true })
    // const accountName = this.getters['accounts/account']
    const components = await this.$accountApi.getAllTransactionComponents({ })
    await commit('setComponents', components)
    const response = await this.$accountApi.getChartOfAccount({ })
    console.log('')
    // await commit('setEdges', response)
    return response
  } catch (e) {
    console.error('An error ocurred while trying to get my entries', e)
    commit('general/setErrorMsg', e.message || e, { root: true })
    throw new Error(e)
  } finally {
    commit('general/setIsLoading', false, { root: true })
  }
}

export const getAllAccounts = async function ({ commit }, { first, offset }) {
  try {
    commit('general/setIsLoading', true, { root: true })
    const response = await this.$accountApi.getAllAccounts({ first, offset })
    // await commit('setComponents', components)
    // const response = await this.$accountApi.getChartOfAccount({ })
    // await commit('setEdges', response)
    return response
  } catch (e) {
    console.error('An error ocurred while trying to get my entries', e)
    commit('general/setErrorMsg', e.message || e, { root: true })
    throw new Error(e)
  } finally {
    commit('general/setIsLoading', false, { root: true })
  }
}

export const getAccountById = async function ({ commit }, { uid }) {
  try {
    commit('general/setIsLoading', true, { root: true })
    const response = await this.$accountApi.getAccountById({ uid })
    return response
  } catch (e) {
    console.error('An error ocurred while trying to get my entries', e)
    commit('general/setErrorMsg', e.message || e, { root: true })
    throw new Error(e)
  } finally {
    commit('general/setIsLoading', false, { root: true })
  }
}

export const getAccountByCode = async function ({ commit }, { code }) {
  try {
    commit('general/setIsLoading', true, { root: true })
    const response = await this.$accountApi.getAccountByCode({ code })
    return response
  } catch (e) {
    console.error('An error ocurred while trying to get accountByCode', e)
    // commit('general/setErrorMsg', e.message || e, { root: true })
    throw new Error(e)
  } finally {
    commit('general/setIsLoading', false, { root: true })
  }
}

export const getAccountByHash = async function ({ commit }, { hash }) {
  try {
    commit('general/setIsLoading', true, { root: true })
    const response = await this.$accountApi.getAccountByHash({ hash })
    return response
  } catch (e) {
    console.error('An error ocurred while trying to get accountByCode', e)
    // commit('general/setErrorMsg', e.message || e, { root: true })
    throw new Error(e)
  } finally {
    commit('general/setIsLoading', false, { root: true })
  }
}

export const deleteAccount = async function ({ commit }, { accountHash }) {
  try {
    commit('general/setIsLoading', true, { root: true })
    const deleter = this.getters['accounts/account']
    const account = await this.$accountApi.deleteAccount({ deleter, accountHash })
    return account
  } catch (e) {
    console.error('An error ocurred while trying to delete account', e)
    commit('general/setErrorMsg', e.message || e, { root: true })
    throw new Error(e)
  } finally {
    commit('general/setIsLoading', false, { root: true })
  }
}
