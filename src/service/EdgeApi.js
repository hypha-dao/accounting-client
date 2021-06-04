import BaseEosApi from './BaseEosApi'
import {
  Contracts
} from '~/const/contracts'

class EdgeApi extends BaseEosApi {
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

  async getEdges ({ offset, limit }) {
    const edges = await this.fetch({
      scope: Contracts.HYPHA,
      offset,
      limit
    })
    return edges
  }

  /**
   * @returns Array<Object> of ledgers that contains the accounts in each ledger
   * and its sub accounts.
   */
  async getChartOfAccount () {
    // const query = `
    // {
    //   chartOfAccounts(func: has(hash))
    //   @filter(eq(hash, ${this.baseNodeHash}))
    //   {
    //     hash
    //     ledger {
    //       uid
    //       hash
    //       created_date
    //       creator
    //       account {
    //         hash
    //         uid
    //         creator
    //         content_groups {
    //           contents {
    //             expand(_all_)
    //           }
    //         }
    //       }
    //     }
    //   }
    // }
    // `
    const query = `
    {
      chartOfAccounts(func: type(Document)) @filter(eq(hash, ${this.baseNodeHash})) {
        hash
        ledger {
          hash
          account {
            hash
            uid
            content_groups (orderasc: content_group_sequence, first: 1) {
              contents {
                expand(_all_)
              }
            }
          }
        }
      }
    }
    `
    const queryResult = await this.dgraph.newTxn().query(query)
    // console.log('queryResult', queryResult)
    const data = {}
    data.accounts = queryResult.data.chartOfAccounts[0].ledger[0].account
    data.ledger_hash = queryResult.data.chartOfAccounts[0].ledger[0].hash
    return data
  }

  async getAccountById ({ uid }) {
    // const query = `
    // query account($uid:string)
    // {
    //   account(func: uid($uid)) {
    //     uid
    //       account {
    //         uid
    //         hash
    //         account {
    //           hash
    //         }
    //         content_groups (orderasc: content_group_sequence, first: 1) {
    //           contents {
    //             expand(_all_)
    //           }
    //         }
    //       }
    //   }
    // }
    // `
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
          }
      }
    }
    `
    const vars = { $uid: uid }

    // console.log('loading child of', uid)

    // this.getAccountTotalAmount({ hash: '2336016affb318b325b6a007aaa458911118d0f3b76b6a2da8f1b30bb2f47d92' })

    return this.dgraph.newTxn().queryWithVars(query, vars)
  }

  async getAccountPathByHash ({ hash }) {
    const query = `
    query account($hash:string)
    {
      account(func: eq(hash, $hash)) {
        uid
        content_groups(orderasc:content_group_sequence, first:1) {
          contents(orderasc:label) {
            label
            value
          }
        }
      }
    }
    `
    const vars = { $hash: hash }

    let { data } = await this.dgraph.newTxn().queryWithVars(query, vars)

    let accountName = data.account[0].content_groups[0].contents.find(el => el.label === 'parent_account') ? data.account[0].content_groups[0].contents.find(el => el.label === 'account_name').value : undefined
    let parentAccount = data.account[0].content_groups[0].contents.find(el => el.label === 'parent_account') ? data.account[0].content_groups[0].contents.find(el => el.label === 'parent_account').value : undefined

    let mappedAccount = {
      accountName,
      parentAccount
    }

    return mappedAccount
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

export default EdgeApi
