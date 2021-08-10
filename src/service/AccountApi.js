import BaseEosApi from './BaseEosApi'
import {
  Contracts
} from '~/const/contracts'

class AccountApi extends BaseEosApi {
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
        table: 'edges',
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

  /**
   * @returns Array<Object> of ledgers that contains the accounts in each ledger
   * and its sub accounts.
   */
  async getChartOfAccount () {
    const query = `
    {
      chartOfAccounts(func: type(Document)) @filter(eq(hash, ${process.env.DGRAPH_BASE_NODE_HASH})) {
        hash
        ledger {
          hash
          account {
            hash
            uid
            balances {
              content_groups (orderasc: content_group_sequence, first: 1) {
                contents {
                  label
                  value
                }
              }
            }
            content_groups (orderasc: content_group_sequence, first: 1) {
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
    const queryResult = await this.dgraph.newTxn().query(query)
    const data = {}
    data.accounts = queryResult.data.chartOfAccounts[0].ledger[0].account
    data.ledger_hash = queryResult.data.chartOfAccounts[0].ledger[0].hash
    return data
  }

  async getAccountById ({ uid }) {
    const query = `
    query account($uid:string)
    {
      account(func: uid($uid)) {
        uid
        account (first:1) {
          uid
          hash
          account {
            hash
          }
          content_groups (orderasc: content_group_sequence, first: 1) {
            contents {
              label
              value
            }
          }
          ownedby {
            hash
          }
          balances {
            content_groups (orderasc: content_group_sequence) {
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
    const vars = { $uid: uid }

    return this.dgraph.newTxn().queryWithVars(query, vars)
  }

  async getAllAccounts () {
    const query = `
    query accounts() {
      var(func: has(account)) {
        accounts as account
      }
      account(func: uid(accounts))
      @filter(NOT has(component))
      {
        uid
        hash
        ownedby {
          content_groups(orderasc:content_group_sequence, first:1) {
            contents(orderasc:label) {
              label
              value
            }
          }
        }
        content_groups(orderasc:content_group_sequence, first:1) {
          contents(orderasc:label) {
            label
            value
          }
        }
        balances {
          content_groups (orderasc:content_group_sequence, first:1) {
            contents {
              label
              value
            }
          }
        }
      }
    }
    `
    let { data } = await this.dgraph.newTxn().query(query)

    let mappedAccounts = data.account.map(acc => {
      const contents = acc.content_groups[0].contents
      const parent = acc.ownedby[0].content_groups[0].contents.find(el => el.label === 'name' || el.label === 'account_name').value
      let balances = acc.balances[0].content_groups[0].contents
      balances = balances.filter(el => el.label.startsWith('global'))
      balances = balances.map(bal => bal.value)
      return {
        parent,
        accountName: contents.find(el => el.label === 'account_name').value,
        accountCode: contents.find(el => el.label === 'account_code').value,
        balance: balances
      }
    })

    return { rows: mappedAccounts, more: data.length !== 0 }
  }

  async createAccount ({ creator, accountInfo }) {
    const actions = [{
      account: Contracts.HYPHA,
      name: 'createacc',
      data: {
        creator,
        account_info: accountInfo
      }
    }]

    console.log('ACTIONS SERVICE', actions)
    return this.eosApi.signTransaction(actions)
  }

  async getAllTransactionComponents () {
    let query = `
    {
      component(func: has(account))
      {
        content_groups(orderasc:content_group_sequence, first:1)  {
          contents(orderasc:label)
          @filter(anyofterms(label, "amount account")) {
            label
            value
          }
        }
      }
    }
    `
    let { data } = await this.dgraph.newTxn().query(query)

    let mappedComponents = data.component.map(com => ({
      accountHash: com.content_groups[0].contents[0].value,
      amount: com.content_groups[0].contents[1].value // Each component with the same hash
    }))

    return mappedComponents
  }

  async getAccountByCode ({ code }) {
    let query = `
    query account($code:string)
    {
      account(func: has(hash)) @cascade @filter(has(content_groups)) {
        uid
        content_groups @filter(has(contents)) {
          contents @filter(eq(value, $code) AND eq(label, "account_code")) {
            label
            value
          }
        }
      }
    }
      `

    let vars = { $code: code }
    let { data } = await this.dgraph.newTxn().queryWithVars(query, vars)
    console.log('data account', data)

    let { uid } = data.account[0]

    query = `
    query account($uid:string)
    {
      account(func: uid($uid)) {
        uid
        hash
        account {
          hash
        }
        content_groups (orderasc: content_group_sequence, first: 1) {
          contents {
            label
            value
          }
        }
        ownedby {
          hash
        }
        balances {
          content_groups (orderasc: content_group_sequence, first: 1) {
            contents {
              label
              value
            }
          }
        }
      }
    }
    `
    let vars2 = { $uid: uid }

    let res = await this.dgraph.newTxn().queryWithVars(query, vars2)

    let accData = res.data.account[0]
    let balance = accData.balances[0].content_groups[0].contents

    let balances = {}
    if (balance) {
      balances = balance
    }

    let mappedAccount = {
      _hasChildren: (!!accData.account && accData.account.length > 0),
      _id: accData.uid,
      hash: accData.hash,
      accountName: accData.content_groups[0].contents.find(el => el.label === 'account_name').value,
      accountCode: accData.content_groups[0].contents.find(el => el.label === 'account_code').value,
      typeTag: accData.content_groups[0].contents.find(el => el.label === 'account_tag_type').value,
      parentAccount: (accData.ownedby) ? accData.ownedby[0].hash : '',
      uid: accData.uid,
      balances
    }

    return { value: mappedAccount }
  }
}

export default AccountApi
