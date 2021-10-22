import { Api, JsonRpc } from 'eosjs'

import {
  ConcurrencyApi,
  CursorApi,
  AccountApi,
  TransactionApi,
  EventApi,
  ExRateApi,
  TokensApi
} from '~/service'

const signTransaction = async function (actions) {
  actions.forEach(action => {
    if (!action.authorization || !action.authorization.length) {
      action.authorization = [{
        actor: this.state.accounts.account,
        permission: 'active'
      }]
    }
  })
  let transaction = null
  try {
    if (this.$type === 'ual') {
      transaction = await this.$ualUser.signTransaction({
        actions
      }, {
        blocksBehind: 3,
        expireSeconds: 30
      })
    }
  } catch (e) {
    throw new Error(e.cause.message)
  }
  return transaction
}

const getTableRows = async function (options) {
  if (this.$type === 'ual') {
    return this.$ualUser.rpc.get_table_rows({
      json: true,
      ...options
    })
  } else {
    return this.$defaultApi.rpc.get_table_rows({
      json: true,
      ...options
    })
  }
}

export default ({ store }) => {
  const rpc = new JsonRpc(`${process.env.NETWORK_PROTOCOL}://${process.env.NETWORK_HOST}:${process.env.NETWORK_PORT}`)
  store['$defaultApi'] = new Api({ rpc, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() })
  const dgraph = store.$dgraph

  const api = {
    signTransaction: signTransaction.bind(store),
    getTableRows: getTableRows.bind(store)
  }

  const concurrencyApi = new ConcurrencyApi({
    eosApi: api,
    dgraph
  })

  const cursorApi = new CursorApi({
    eosApi: api,
    dgraph
  })

  const accountApi = new AccountApi({
    eosApi: api,
    dgraph
  })

  const transactionApi = new TransactionApi({
    eosApi: api,
    dgraph
  })

  const eventApi = new EventApi({
    eosApi: api,
    dgraph
  })

  const exRateApi = new ExRateApi({
    eosApi: api,
    dgraph
  })

  const tokensApi = new TokensApi({
    eosApi: api,
    dgraph
  })

  store['$api'] = api
  store['$concurrencyApi'] = concurrencyApi
  store['$cursorApi'] = cursorApi
  store['$accountApi'] = accountApi
  store['$transactionApi'] = transactionApi
  store['$eventApi'] = eventApi
  store['$exRateApi'] = exRateApi
  store['$tokensApi'] = tokensApi
}
