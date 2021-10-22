import Vue from 'vue'
import Vuex from 'vuex'

import accounts from './accounts'
import general from './general'
import concurrency from './concurrency'
import cursor from './cursor'
import contAccount from './contAccount'
import transaction from './transaction'
import event from './event'
import exRate from './exRate'
import tokens from './tokens'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      accounts,
      general,
      concurrency,
      cursor,
      transaction,
      event,
      contAccount,
      exRate,
      tokens
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  })

  return Store
}
