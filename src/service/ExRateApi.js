import BaseEosApi from './BaseEosApi'
import {
  Contracts
} from '~/const/Contracts'

class ExRateApi extends BaseEosApi {
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
        table: 'exrates',
        tableId: 'id',
        defaultSortField: 'key'
      }
    )
    this.dgraph = dgraph
  }

  /** *
  * Parse transfers base
  */
  async _parseRows (rows, modifierProps) {
    return rows
  }

  async getExRates ({ offset, limit }) {
    const exRates = await this.fetch({
      scope: Contracts.HYPHA,
      offset,
      limit
    })
    return exRates
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

export default ExRateApi
