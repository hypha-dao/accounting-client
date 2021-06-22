import BaseEosApi from './BaseEosApi'
import {
  Contracts
} from '~/const/contracts'

class TransactionApi extends BaseEosApi {
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
        id: contents.find(el => el.label === 'id').value,
        hash: trans.transaction[0].hash,
        uid: trans.transaction[0].uid,
        date: contents.find(el => el.label === 'trx_date').value,
        ledger: contents.find(el => el.label === 'trx_ledger').value,
        memo: contents.find(el => el.label === 'trx_memo').value,
        approved: !(trans.transaction[0].unapproved)
      }
    })
    return mappedTransactions
  }

  async getUnapprovedTransactions () {
    const query = `
    {
      node(func: uid(0x75c6)) {
        trxbucket {
          unapproved {
            hash
            uid
            content_groups(orderasc:content_group_sequence, first:1) {
              contents {
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

    let mappedTransactions = data.node[0].trxbucket[0].unapproved.map((trans, i) => {
      let contents = trans.content_groups[0].contents
      return {
        id: contents.find(el => el.label === 'id').value,
        hash: trans.hash,
        uid: trans.uid,
        date: contents.find(el => el.label === 'trx_date').value,
        ledger: contents.find(el => el.label === 'trx_ledger').value,
        memo: contents.find(el => el.label === 'trx_memo').value,
        approved: false
      }
    })
    return mappedTransactions
  }

  async getApprovedTransactions () {
    const query = `
    {
      node(func: uid(0x75c6)) {
        trxbucket {
          approved {
            hash
            uid
            content_groups(orderasc:content_group_sequence, first:1) {
              contents {
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

    let mappedTransactions = data.node[0].trxbucket[0].approved.map((trans, i) => {
      let contents = trans.content_groups[0].contents
      return {
        hash: trans.hash,
        uid: trans.uid,
        id: contents.find(el => el.label === 'id').value,
        date: contents.find(el => el.label === 'trx_date').value,
        ledger: contents.find(el => el.label === 'trx_ledger').value,
        memo: contents.find(el => el.label === 'trx_memo').value,
        approved: true
      }
    })
    return mappedTransactions
  }

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

  async getLastTransaction () {
    const query = `
    {
      component(func: has(component), orderdesc: created_date, first:1)
      {
        component {
          hash
          created_date
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
        uid: contents.find(el => el.label === 'id').value,
        date: contents.find(el => el.label === 'trx_date').value,
        ledger: contents.find(el => el.label === 'trx_ledger').value,
        memo: contents.find(el => el.label === 'trx_memo').value,
        approved: !(trans.transaction[0].unapproved)
      }
    })
    return mappedTransactions
  }

  async createTxn ({ accountName, contentGroups }) {
    console.log('api create', accountName, contentGroups)
    const actions = [{
      account: Contracts.HYPHA,
      name: 'createtrx',
      data: {
        creator: accountName,
        trx_info: contentGroups
      }
    }]
    return this.eosApi.signTransaction(actions)
  }

  async createTxnWithEvent ({ accountName, contentGroups }) {
    // console.log('api', accountName, contentGroups)
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
    console.log('api update', updater, contentGroups)
    const actions = [{
      account: Contracts.HYPHA,
      name: 'updatetrx',
      data: {
        updater,
        trx_hash: transactionHash,
        trx_info: contentGroups
      }
    }]
    console.log('actions', actions)
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
}

export default TransactionApi
