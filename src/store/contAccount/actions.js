export const createAccount = async function ({ commit }, { accountInfo }) {
  try {
    commit('general/setIsLoading', true, { root: true })
    const creator = this.getters['accounts/account']
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
export const getChartOfAccounts = async function ({ commit }) {
  try {
    commit('general/setIsLoading', true, { root: true })
    // const accountName = this.getters['accounts/account']
    const components = await this.$accountApi.getAllTransactionComponents({ })
    await commit('setComponents', components)
    const response = await this.$accountApi.getChartOfAccount({ })
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
    const response = await this.$accountApi.getAccountById({ uid })
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
