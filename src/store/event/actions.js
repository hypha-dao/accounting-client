export const getEvents = async function ({ commit }) {
  try {
    commit('general/setIsLoading', true, { root: true })
    const events = await this.$eventApi.getEvents()
    return events
  } catch (e) {
    console.error('An error ocurred while trying to get events', e)
    commit('general/setErrorMsg', e.message || e, { root: true })
  } finally {
    commit('general/setIsLoading', false, { root: true })
  }
}

export const createEvent = async function ({ commit }, { contentGroups }) {
  try {
    commit('general/setIsLoading', true, { root: true })
    const accountName = await this.getters['accounts/account']
    const event = await this.$eventApi.createEvent({ contentGroups, accountName })
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
    const event = await this.$eventApi.bindEvent({ updater, eventHash, componentHash })
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
    const event = await this.$eventApi.unbindEvent({ updater, eventHash, componentHash })
    return event
  } catch (e) {
    console.error('An error ocurred while trying to unbind event', e)
    commit('general/setErrorMsg', e.message || e, { root: true })
  } finally {
    commit('general/setIsLoading', false, { root: true })
  }
}
