export const getEdges = async function ({ commit }) {
  try {
    commit('general/setIsLoading', true, { root: true })
    // const accountName = this.getters['accounts/account']
    const response = await this.$edgeApi.getChartOfAccount({ })
    return response
  } catch (e) {
    console.error('An error ocurred while trying to get Charts of accounts', e)
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
    const components = await this.$edgeApi.getAllTransactionComponents({ })
    await commit('setComponents', components)
    const response = await this.$edgeApi.getChartOfAccount({ })
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
    // const accountName = this.getters['accounts/account']
    const response = await this.$edgeApi.getAccountById({ uid })
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

export const getAccountPathByHash = async function ({ commit }, { hash }) {
  try {
    commit('general/setIsLoading', true, { root: true })
    // const accountName = this.getters['accounts/account']
    const response = await this.$edgeApi.getAccountPathByHash({ hash })
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
