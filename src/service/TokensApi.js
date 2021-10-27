import BaseEosApi from './BaseEosApi'
import {
  Contracts
} from '~/const/contracts'

class TokensApi extends BaseEosApi {
  constructor ({
    eosApi,
    dgraph,
    notifier
  }) {
    super(
      eosApi,
      notifier,
      {
        contractAccount: Contracts.HYPHA,
        table: 'currencies',
        tableId: 'id',
        defaultSortField: 'key'
      }
    )
    this.dgraph = dgraph
    this.baseNodeHash = process.env.DGRAPH_BASE_NODE_HASH
  }

  /** *
  * Parse transfers base
  */
  async _parseRows (rows, modifierProps) {
    return rows
  }

  async getTokens () {
    const query = `
    {
      settings(func: has(hash)) @cascade {
        hash
        content_groups {
          contents @filter(allofterms(label, "allowed_currency")) {
            label
            value
          }
        }
      }
    }
    `
    let { data } = await this.dgraph.newTxn().query(query)
    console.log(data)
    if (!data.settings[0]) return []
    const currencies = data.settings[0].content_groups[0].contents.filter(t => t.label === 'allowed_currency')
    const mappedTransactions = currencies.map(t => {
      const [amount, symbol] = t.value.split(' ')
      const precision = amount.split('.')[1].length
      const tempHash = [...Array(8)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')
      return { symbol, precision, tempHash }
    })

    return mappedTransactions
  }

  addToken ({ symbol, accountName }) {
    const actions = [{
      account: Contracts.HYPHA,
      name: 'addcurrency',
      data: {
        issuer: accountName,
        currency_symbol: symbol
      }
    }]
    return this.eosApi.signTransaction(actions)
  }

  removeToken ({ symbol, accountName }) {
    const actions = [{
      account: Contracts.HYPHA,
      name: 'remcurrency',
      data: {
        issuer: accountName,
        currency_symbol: symbol
      }
    }]
    return this.eosApi.signTransaction(actions)
  }
}

export default TokensApi
