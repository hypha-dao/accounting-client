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
    const query = `
    query account($uid:string)
    {
      account(func: uid($uid)) {
        uid
        ownedby {
          expand(_all_)
        }
        account {
          uid
          hash
          account {
            uid
            hash
          }
        }
      }
    }
    `
    const vars = { $uid: uid }

    return this.dgraph.newTxn().queryWithVars(query, vars)
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
