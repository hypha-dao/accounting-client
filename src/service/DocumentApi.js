import BaseEosApi from './BaseEosApi'
import {
  Contracts
} from '~/const/contracts'

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

  async sendTransaction ({ accountName, contentGroups }) {
    console.log('api', accountName, contentGroups)
    const actions = [{
      account: Contracts.HYPHA,
      name: 'newunrvwdtrx',
      data: {
        issuer: accountName,
        trx_info: contentGroups
      }
    }]
    return this.eosApi.signTransaction(actions)
  }

  async getTransactionById ({ uid }) {
    const query = `
    query transactions($uid:string)
    {
      transaction(func: uid($uid)) {
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
      }
    }
    `

    const vars = { $uid: uid }

    let { data } = await this.dgraph.newTxn().queryWithVars(query, vars)

    let mappedComponents = data.transaction[0].component.map(com => ({
      account: com.content_groups[0].contents[4].value,
      amount: com.content_groups[0].contents[1].value,
      date: com.content_groups[0].contents[3].value,
      memo: com.content_groups[0].contents[4].value,
      percent: '10%'
    }))

    return mappedComponents
    // return data
  }

  async getTransactions () {
    const query = `
    {
      transactions(func: has(hash))
      {
        transaction {
          uid
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
      uid: trans.transaction[0].uid,
      date: trans.transaction[0].content_groups[0].contents[1].value,
      amount: '1 BTC', // It should be the sum of each component amount
      transaction: trans.transaction[0].content_groups[0].contents[3].value,
      approved: true,
      balanced: false
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

    console.log(data)

    let mappedTransactions = data.unbalancedTxn[0].unrvwdbucket[0].unrvwdtrx.map((tnx, i) => ({
      id: i,
      uid: tnx.uid,
      hash: tnx.hash,
      usdValue: tnx.content_groups[0].contents[0].value,
      to: tnx.content_groups[0].contents[3].value,
      date: tnx.content_groups[0].contents[4].value,
      source: tnx.content_groups[0].contents[5].value,
      amount: tnx.content_groups[0].contents[6].value + ' ' + tnx.content_groups[0].contents[10].value,
      memo: tnx.content_groups[0].contents[7].value,
      from: tnx.content_groups[0].contents[8].value
    }))

    return mappedTransactions
  }
}

export default DocumentApi
