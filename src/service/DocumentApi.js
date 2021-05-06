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
      chartOfAccounts(func: has(hash))
      @filter(eq(hash, ${this.baseNodeHash}))
      {
        transaction {
          uid
          created_date
          creator
          content_groups {
            contents {
              expand(_all_)
            }
          }
        }
      }
    }
    `
    return this.dgraph.newTxn().query(query)
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
