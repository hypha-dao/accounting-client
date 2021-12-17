import BaseEosApi from './BaseEosApi'
import {
  Contracts
} from '~/const/contracts'

class EventApi extends BaseEosApi {
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

  async getEvents ({ first, offset }) {
    const query = `
    query events($first:string, $offset:string) {
      var(func: has(event)) {
        events as event
      }
      event(func: uid(events), first:$first, offset:$offset)
      @filter(NOT has(component))
      {
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
    `

    let vars = { $first: first.toString(), $offset: offset.toString() }

    let data = {}
    let res = await this.dgraph.newTxn().queryWithVars(query, vars)
    data = JSON.parse(JSON.stringify(res.data))

    data.event = data.event.filter(ev => ev.content_groups)
    let mappedEvents = data.event.map((ev, i) => {
      const contents = ev.content_groups[0].contents
      return {
        uid: ev.uid,
        hash: ev.hash,
        chainId: contents.find(el => el.label === 'chainId') ? contents.find(el => el.label === 'chainId').value : '',
        currency: contents.find(el => el.label === 'currency') ? contents.find(el => el.label === 'currency').value : '',
        quantity: contents.find(el => el.label === 'quantity') ? contents.find(el => el.label === 'quantity').value : '',
        from: contents.find(el => el.label === 'from') ? contents.find(el => el.label === 'from').value : '',
        to: contents.find(el => el.label === 'to') ? contents.find(el => el.label === 'to').value : '',
        source: contents.find(el => el.label === 'source') ? contents.find(el => el.label === 'source').value : '',
        memo: contents.find(el => el.label === 'memo') ? contents.find(el => el.label === 'memo').value : '',
        date: contents.find(el => el.label === 'timestamp') ? contents.find(el => el.label === 'timestamp').value : '',
        usdValue: contents.find(el => el.label === 'usd_value') ? contents.find(el => el.label === 'usd_value').value : '',
        treasuryId: contents.find(el => el.label === 'treasury_id') ? contents.find(el => el.label === 'treasury_id').value : ''
      }
    })

    return { rows: mappedEvents, more: mappedEvents.length !== 0 }
  }

  async createEvent ({ accountName, contentGroups }) {
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
}

export default EventApi
