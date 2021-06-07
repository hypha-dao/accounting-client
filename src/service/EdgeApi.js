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
    const query = `
    {
      chartOfAccounts(func: type(Document)) @filter(eq(hash, 91806de20aafa70e53fdb8fd79c6fbfea1c58f85a9fd0b0d57eda162e04e05b4)) {
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
    // console.log('queryResult', queryR esult)
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

  async createAccount ({ accountName, accountInfo }) {
    const actions = [{
      account: Contracts.BENNYFI,
      name: 'createacc',
      data: {
        creator: accountName,
        account_info: accountInfo
      }
    }]
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
}

export default EdgeApi
