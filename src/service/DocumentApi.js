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

  async createEvent ({ accountName, contentGroups }) {
    console.log('api', accountName, contentGroups)
    const actions = [{
      account: Contracts.HYPHA,
      name: 'newevent',
      data: {
        issuer: accountName,
        trx_info: contentGroups
      }
    }]
    return this.eosApi.signTransaction(actions)
  }

  async bindEvent ({ updater, eventHash, componentHash }) {
    const actions = [{
      account: Contracts.HYPHA,
      name: 'bindevent',
      data: {
        updater,
        event_hash: eventHash,
        component_hash: componentHash
      }
    }]
    return this.eosApi.signTransaction(actions)
  }

  async unbindEvent ({ updater, eventHash, componentHash }) {
    const actions = [{
      account: Contracts.HYPHA,
      name: 'unbindevent',
      data: {
        updater,
        event_hash: eventHash,
        component_hash: componentHash
      }
    }]
    return this.eosApi.signTransaction(actions)
  }

  async createTxn ({ accountName, contentGroups }) {
    console.log('api', accountName, contentGroups)
    const actions = [{
      account: Contracts.HYPHA,
      name: 'createtrx',
      data: {
        issuer: accountName,
        trx_info: contentGroups
      }
    }]
    return this.eosApi.signTransaction(actions)
  }

  async createTxnWithEvent ({ accountName, contentGroups }) {
    console.log('api', accountName, contentGroups)
    const actions = [{
      account: Contracts.HYPHA,
      name: 'createtrxwe',
      data: {
        issuer: accountName,
        trx_info: contentGroups
      }
    }]
    return this.eosApi.signTransaction(actions)
  }
  async updateTxn ({ updater, transactionHash, contentGroups }) {
    const actions = [{
      account: Contracts.HYPHA,
      name: 'updatetrx',
      data: {
        updater,
        trx_hash: transactionHash,
        trx_info: contentGroups
      }
    }]
    return this.eosApi.signTransaction(actions)
  }

  async balanceTxn ({ issuer, transactionHash }) {
    const actions = [{
      account: Contracts.HYPHA,
      name: 'balancetrx',
      data: {
        issuer,
        trx_hash: transactionHash
      }
    }]
    return this.eosApi.signTransaction(actions)
  }

  // Returns details of transaction (components details)
  async getTransactionById ({ uid }) {
    const query = `
    query transactions($uid:string)
    {
      transaction(func: uid($uid)) {
        component {
          account {
            content_groups(orderasc:content_group_sequence, first:1) {
              contents(orderasc:label)  {
                label
                value
              }
            }
          }
          content_groups(orderasc:content_group_sequence, first:1) {
            contents(orderasc:label)  {
              label
              value
            }
          }
        }
      }
    }
    `

    const vars = { $uid: uid }

    let { data } = await this.dgraph.newTxn().queryWithVars(query, vars)

    let mappedTxn = data.transaction[0].component.map((com, idx) => {
      let componentCont = com.content_groups[0].contents
      // let eventCont = com.event.content_groups[0].contents
      let accountCont = com.account[0].content_groups[0].contents
      return {
        id: idx,
        amount: componentCont.find(el => el.label === 'amount').value,
        accountHash: componentCont.find(el => el.label === 'account').value,
        accountPath: accountCont.find(el => el.label === 'path').value,
        accountType: accountCont.find(el => el.label === 'account_tag_type').value,
        accountCode: accountCont.find(el => el.label === 'account_code').value,
        accountName: accountCont.find(el => el.label === 'account_name').value,
        date: componentCont.find(el => el.label === 'create_date').value,
        memo: componentCont.find(el => el.label === 'memo').value
      }
    })

    return mappedTxn
  }

  async getEvents () {
    const query = `
    {
      events(func: has(hash))
      {
        event {
          uid
          hash
          content_groups(orderasc:content_group_sequence, first:1) {
            contents(orderasc:label) {
              label
              value
            }
          }
        }
      }
    }
    `
    let { data } = await this.dgraph.newTxn().query(query)

    let mappedEvents = data.events.map((event, i) => {
      const contents = event.event[0].content_groups[0].contents
      return {
        id: i,
        uid: event.event[0].uid,
        hash: event.event[0].hash,
        chainId: contents.find(el => el.label === 'chainId').value,
        currency: contents.find(el => el.label === 'currency').value,
        quantity: contents.find(el => el.label === 'quantity').value,
        from: contents.find(el => el.label === 'from').value,
        to: contents.find(el => el.label === 'to').value,
        source: contents.find(el => el.label === 'source').value,
        memo: contents.find(el => el.label === 'memo').value,
        date: contents.find(el => el.label === 'timestamp').value,
        usdValue: contents.find(el => el.label === 'usd_value').value,
        treasuryId: contents.find(el => el.label === 'treasury_id').value
      }
    })

    return mappedEvents
    // return data
  }

  async getTransactions () {
    const query = `
    {
      transactions(func: has(hash))
      {
        transaction {
          uid
          hash
          unapproved {
            hash
          }
          approved {
            hash
          }
          content_groups(orderasc:content_group_sequence, first:1) {
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

    let mappedTransactions = data.transactions.map((trans, i) => {
      let contents = trans.transaction[0].content_groups[0].contents
      return {
        id: i,
        hash: trans.transaction[0].hash,
        uid: trans.transaction[0].uid,
        date: contents.find(el => el.label === 'trx_date').value,
        ledger: contents.find(el => el.label === 'trx_ledger').value,
        memo: contents.find(el => el.label === 'trx_memo').value,
        approved: !(trans.transaction[0].unapproved)
      }
    })

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
      balanced: false,
      approved: false,
      // usdValue: tnx.content_groups[0].contents[0].value,
      to: tnx.content_groups[0].contents[3].value, // ??
      date: (tnx.content_groups[0].contents[4].value).slice(0, -5), // we remove the '.000Z' part of string
      // source: tnx.content_groups[0].contents[5].value,
      amount: tnx.content_groups[0].contents[6].value + ' ' + tnx.content_groups[0].contents[10].value,
      memo: tnx.content_groups[0].contents[7].value,
      from: tnx.content_groups[0].contents[8].value // ??
    }))

    return mappedTransactions
  }
}

export default DocumentApi
