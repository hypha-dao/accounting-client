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
              contents(orderasc:label)  {
                label
                value
                type
              }
            }
          }
          content_groups(offset:1) {
            contents(orderasc:label) {
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
      amount: '1 BTC', // It should be the sum of each component amount
      transaction: trans.transaction[0].content_groups[0].contents[3].value,
      approved: true,
      balanced: false,
      components: trans.transaction[0].component.map((com, i) => ({
        no: i,
        account: com.content_groups[0].contents[4].value,
        amount: com.content_groups[0].contents[1].value,
        percent: '10%'
      }))
    }))

    return mappedTransactions
    // return data
  }

  async getUnbalancedTransactions () {
    const query = `
    {
      unbalancedTxn(func: has(hash))
      @filter(eq(hash, ${this.baseNodeHash}))
      {
        uid
        hash
        unrvwdbucket {
          uid
          hash
          unrvwdtrx {
            uid
            hash
            content_groups {
              contents(orderdesc:label) {
                label
                value
              }
            }
          }
        }
      }
    }
    `
    let { data } = await this.dgraph.newTxn().query(query)

    let mappedTransactions = data.unbalancedTxn[0].unrvwdbucket[0].unrvwdtrx.map(tnx => ({
      uid: tnx.uid,
      hash: tnx.hash,
      usdValue: tnx.content_groups[0].contents[0].value,
      to: tnx.content_groups[0].contents[3].value,
      timestamp: tnx.content_groups[0].contents[4].value,
      source: tnx.content_groups[0].contents[5].value,
      quantity: tnx.content_groups[0].contents[6].value,
      memo: tnx.content_groups[0].contents[7].value,
      from: tnx.content_groups[0].contents[8].value,
      currency: tnx.content_groups[0].contents[10].value
    }))

    return mappedTransactions
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
