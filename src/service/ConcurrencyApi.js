import BaseEosApi from './BaseEosApi'
import {
  Contracts
} from '~/const/Contracts'

class ConcurrencyApi extends BaseEosApi {
  constructor ({
    eosApi,
    notifier
  }) {
    super(
      eosApi,
      notifier,
      {
        contractAccount: Contracts.HYPHA,
        table: 'concurrencies',
        tableId: 'id',
        defaultSortField: 'key'
      }
    )
  }

  /** *
  * Parse transfers base
  */
  async _parseRows (rows, modifierProps) {
    return rows
  }

  async getConcurrencies ({ offset, limit }) {
    const concurrencies = await this.fetch({
      scope: Contracts.HYPHA,
      offset,
      limit
    })
    return concurrencies
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

export default ConcurrencyApi
