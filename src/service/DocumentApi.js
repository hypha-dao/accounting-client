import BaseEosApi from './BaseEosApi'
import {
  Contracts
} from '~/const/Contracts'

class DocumentApi extends BaseEosApi {
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
        table: 'documents',
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

  async getDocuments ({ offset, limit }) {
    const documents = await this.fetch({
      scope: Contracts.HYPHA,
      offset,
      limit
    })
    return documents
  }

  async getTransactions () {
    const query = `
    {
      transactions(func: has(hash))
      {
        transaction {
          component {
            content_groups(
            orderasc:content_group_sequence,
            first:1)
            {
              contents {
                label
                value
                type
              }
            }
          }
          content_groups(first:1) {
            contents {
              label
              value
              type
            }
          }
        }
      }
    }
    `
    let { data } = await this.dgraph.newTxn().query(query)

    /**
     *  Contents[0] memo
     *  Contents[1] date
     *  Contents[2] ledger
     */
    let mappedTransactions = data.transactions.map((trans, i) => ({
      id: i,
      date: trans.transaction[0].content_groups[0].contents[1].value,
      amount: '100 BTC', // It should be the sum of each component amount
      transaction: trans.transaction[0].content_groups[0].contents[0].value,
      approved: true,
      balanced: false,
      components: trans.transaction[0].component.map((com, i) => ({
        no: i,
        account: com.content_groups[0].contents[com.content_groups[0].contents.findIndex(el => (el.label === 'memo'))].value,
        amount: com.content_groups[0].contents[com.content_groups[0].contents.findIndex(el => (el.label === 'amount'))].value,
        percent: '10%'
      }))
    }))

    return mappedTransactions
    // return data
  }

/*   async createSetting ({ accountName, key, value }) {
    const actions = [{
      account: Contracts.BENNYFI,
      name: 'setsetting',
      data: {
        setter: accountName,
        key: key,
        value: value
      }
    }]
    return this.eosApi.signTransaction(actions)
  }

  async eraseSetting ({ accountName, key }) {
    const actions = [{
      account: Contracts.BENNYFI,
      name: 'eraseSetting',
      data: {
        setter: accountName,
        key: key
      }
    }]
    return this.eosApi.signTransaction(actions)
  } */
}

export default DocumentApi
