export const getConcurrencies = async function ({ commit }) {
  try {
    commit('general/setIsLoading', true, { root: true })
    // const accountName = this.getters['accounts/account']
    const response = await this.$concurrencyApi.getConcurrencies({ })
    // await commit('setConcurrencies', response)

    return response
  } catch (e) {
    console.error('An error ocurred while trying to get concurrencies', e)
    commit('general/setErrorMsg', e.message || e, { root: true })
    throw new Error(e)
  } finally {
    commit('general/setIsLoading', false, { root: true })
  }
}
