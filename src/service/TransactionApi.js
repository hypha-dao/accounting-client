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
        name: contents.find(el => el.label === 'trx_name').value,
        approved: !(trans.transaction[0].unapproved)
      }
    })
    return mappedTransactions
  }

  async getUnapprovedTransactions () {
    const query = `
    {
      node(func: uid(0x18933)) {
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
    if (!data.node[0]) return []
    let mappedTransactions = data.node[0].trxbucket[0].unapproved.map((trans, i) => {
      let contents = trans.content_groups[0].contents
      return {
        id: contents.find(el => el.label === 'id').value,
        hash: trans.hash,
        uid: trans.uid,
        date: contents.find(el => el.label === 'trx_date').value,
        ledger: contents.find(el => el.label === 'trx_ledger').value,
        memo: contents.find(el => el.label === 'trx_memo').value,
        name: contents.find(el => el.label === 'trx_name').value,
        approved: false
      }
    })
    return mappedTransactions
  }

  async getApprovedTransactions () {
    const query = `
    {
      node(func: uid(0x18933)) {
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
        name: contents.find(el => el.label === 'trx_name').value,
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
        hash
        content_groups(orderasc:content_group_sequence, first:1) {
          contents(orderasc:label)  {
            label
            value
          }
        }
        component {
          event {
            hash
            content_groups(orderasc:content_group_sequence, first:1) {
              contents(orderasc:label)  {
                label
                value
               }
             }
          }
          cmpacct {
            accountv(orderasc:creator){
              content_groups(orderasc:content_group_sequence, first:1){
                contents(orderasc:label) {
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
          account {
            hash
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

    console.log('data of trx', data)

    let transaction = data.transaction.map((cont, idx) => {
      let trx = cont.content_groups[0].contents
      var comps = []
      if (cont.component) {
        comps = cont.component.map(comp => {
          let event = (comp.event) ? comp.event[0].content_groups[0].contents : ''
          let cmpacct = comp.cmpacct[0].content_groups[0].contents
          let account = comp.cmpacct[0].accountv[0].content_groups[0].contents
          let compo = comp.content_groups[0].contents

          console.log(compo)

          return {
            account: {
              _hasChildren: false,
              hash: compo.find(el => el.label === 'account') ? compo.find(el => el.label === 'account').value : '',
              accountName: account.find(el => el.label === 'account_name')?.value || '',
              accountCode: cmpacct.find(el => el.label === 'account_code')?.value || '',
              typeTag: cmpacct.find(el => el.label === 'account_tag_type')?.value || ''
            },
            isFromEvent: !!comp.event,
            hash: comp.event ? comp.event[0].hash : '',
            from: compo.find(el => el.label === 'from')?.value || '',
            to: compo.find(el => el.label === 'to')?.value || '',
            currency: compo.find(el => el.label === 'amount').value.split(' ')[1],
            quantity: compo.find(el => el.label === 'amount').value.split(' ')[0],
            treasuryId: comp.event ? event.find(el => el.label === 'treasury_id').value : '',
            source: comp.event ? event.find(el => el.label === 'source').value : '',
            // usdValue: comp.event ? event.find(el => el.label === 'usd_value').value : '',
            date: compo.find(el => el.label === 'create_date').value,
            memo: compo.find(el => el.label === 'memo').value,
            type: compo.find(el => el.label === 'type') ? compo.find(el => el.label === 'type').value : ''
          }
        })
      }

      return {
        hash: cont.hash,
        id: trx.find(el => el.label === 'id').value,
        name: trx.find(el => el.label === 'trx_name').value,
        memo: trx.find(el => el.label === 'trx_memo').value,
        date: trx.find(el => el.label === 'trx_date').value,
        ledger: trx.find(el => el.label === 'trx_ledger').value,
        components: comps
      }
    })
    return transaction[0]
  }

  async createTxn ({ accountName, contentGroups }) {
    const actions = [{
      account: Contracts.HYPHA,
      name: 'upserttrx',
      data: {
        trx_hash: '0000000000000000000000000000000000000000000000000000000000000000',
        issuer: accountName,
        trx_info: contentGroups,
        approve: false
      }
    }]
    return this.eosApi.signTransaction(actions)
  }

  async createTxnWithEvent ({ accountName, contentGroups }) {
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
      name: 'upserttrx',
      data: {
        issuer: updater,
        trx_hash: transactionHash,
        trx_info: contentGroups,
        approve: false
      }
    }]

    console.log(JSON.stringify(actions, null, 2))
    return this.eosApi.signTransaction(actions)
  }

  async balanceTxn ({ issuer, transactionHash, contentGroups }) {
    const actions = [{
      account: Contracts.HYPHA,
      name: 'upserttrx',
      data: {
        issuer,
        trx_hash: transactionHash | `'0000000000000000000000000000000000000000000000000000000000000000'`,
        trx_info: contentGroups,
        approve: true
      }
    }]

    console.log(actions)
    console.log(JSON.stringify(actions, null, 2))
    return this.eosApi.signTransaction(actions)
  }

  async deteleTxn ({ deleter, transactionHash }) {
    const actions = [{
      account: Contracts.HYPHA,
      name: 'deletetrx',
      data: {
        deleter,
        trx_hash: transactionHash
      }
    }]
    return this.eosApi.signTransaction(actions)
  }
}

export default TransactionApi
