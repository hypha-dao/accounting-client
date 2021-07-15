import camelCase from 'camelcase'
import Util from '../utils/Util'
import TimeUtil from '../utils/TimeUtil'

class BaseEosApi {
  constructor (eosApi, notifier, {
    contractAccount,
    table,
    tableId,
    defaultSortField,
    isParsedSortField = false,
    workflowPayloadType
  }) {
    this.eosApi = eosApi
    this.notifier = notifier
    this.contractAccount = contractAccount
    this.table = table
    this.tableId = tableId
    this.defaultSortField = defaultSortField
    this.isParsedSortField = isParsedSortField
    this.workflowPayloadType = workflowPayloadType
  }

  async getAccount () {
    return this.eosApi.getAccount()
  }

  /**
   *
   * @param {Array} actions
   */
  async transactFull (actions) {
    actions = await this._formatActions(actions)
    try {
      const transaction = await this.eosApi.signTransaction(actions)
      this.notifier && this.notifier.success(actions, transaction)
      return transaction
    } catch (err) {
      let error = err
      const { cause } = err
      if (cause) {
        if (cause.cause) console.log(cause.cause)
        if (cause.cause && cause.cause.couse) console.log(cause.cause.cause)
        error = new Error(cause.message)
      }
      this.notifier && this.notifier.error(actions, error)
      throw error
    }
  }

  async transact ({ name, data }) {
    return this.transactFull([{ name, data }])
  }

  async _formatActions (actions) {
    const formatted = []
    for (const action of actions) {
      formatted.push(await this._formatAction(action))
    }
    return formatted
  }

  async _formatAction ({ account, name, data, authorization }) {
    account = account || this.contractAccount
    if (!authorization || !authorization.length) {
      authorization = [
        {
          actor: await this.getAccount(),
          permission: 'active'
        }
      ]
    }
    return {
      account,
      name,
      authorization,
      data
    }
  }

  /***
     * Fetch parsed rows
     */
  async fetchAll (scope = null, modifierProps = {}) {
    let allRows = []
    let rows = null
    let more = null
    let lowerBound = null
    do {
      ({ rows, more } = await this._getTableRows(
        {
          scope,
          lowerBound
        }
      ))
      if (lowerBound) {
        rows.shift()
      }
      if (more) {
        lowerBound = rows[rows.length - 1][this.tableId]
      }
      const parsedRows = await this._parseRows(rows, modifierProps, scope)
      allRows = allRows.concat(parsedRows)
    } while (more)
    return allRows
  }

  async mapAll (keyProp, scope = null, modifierProps = {}) {
    keyProp = keyProp || camelCase(this.tableId)
    const rows = await this.fetchAll(scope, modifierProps)
    return Util.arrayToMap(rows, keyProp)
  }

  async hydrate (objs, keyProp, hydratedProp = null, scope = null, modifierProps = {}) {
    return Util.hydrate(
      objs,
      keyProp,
      hydratedProp || `${keyProp}Info`,
      async (keys) => this.mapAll(null, scope, modifierProps)
    )
  }

  async fetchById (
    {
      scope,
      idValue,
      keyType = 'i64'
    },
    modifierProps
  ) {
    return this.fetchOne(
      {
        scope,
        lowerBound: idValue,
        upperBound: idValue,
        keyType
      },
      modifierProps
    )
  }

  async fetchByIndex (
    {
      scope,
      indexPosition,
      indexValue,
      keyType = 'i64',
      offset,
      limit
    },
    modifierProps
  ) {
    return this.fetch(
      {
        scope,
        indexPosition,
        lowerBound: indexValue,
        upperBound: indexValue,
        keyType,
        offset,
        limit
      },
      modifierProps
    )
  }

  async fetchOneByIndex (
    {
      scope,
      indexPosition,
      indexValue,
      keyType = 'i64'
    },
    modifierProps
  ) {
    const { rows } = await this.fetchByIndex(
      {
        scope,
        indexPosition,
        indexValue,
        keyType,
        limit: 1
      },
      modifierProps
    )
    return rows.length ? rows[0] : null
  }

  /***
     * Fetch parsed rows
     */
  async fetch (
    {
      scope,
      indexPosition,
      tableKey,
      lowerBound,
      upperBound,
      keyType,
      offset,
      limit,
      reverse
    },
    modifierProps
  ) {
    modifierProps = modifierProps || {}
    const {
      filters,
      parsedFilters
    } = modifierProps
    let { sort, parsedSort } = modifierProps

    if (!sort && !parsedSort) {
      const defaultSort = {
        field: this.defaultSortField
      }
      if (this.isParsedSortField) {
        parsedSort = defaultSort
      } else {
        sort = defaultSort
      }
    }
    if (parsedSort) {
      sort = null
    }

    let parsedOffset
    let parsedLimit
    const hasParsedProps = parsedSort || parsedFilters
    if (hasParsedProps) {
      parsedOffset = offset
      parsedLimit = limit
    }

    let { rows, more } = await this.getTableRows(
      {
        scope,
        indexPosition,
        tableKey,
        lowerBound,
        upperBound,
        keyType,
        offset,
        limit,
        reverse
      },
      filters,
      sort
    )
    let parsedRows = await this._parseRows(rows, modifierProps, scope)

    if (hasParsedProps) {
      ({ rows: parsedRows, more } = await this._filterSort({
        rows: parsedRows,
        filters: parsedFilters,
        sort: parsedSort,
        offset: parsedOffset,
        limit: parsedLimit

      }))
    }
    parsedRows = await this._changeStructure(parsedRows, modifierProps, scope)
    return {
      rows: parsedRows,
      more
    }
  }

  async fetchOne (
    {
      scope,
      indexPosition,
      tableKey,
      lowerBound,
      upperBound,
      keyType,
      offset,
      reverse
    },
    modifierProps
  ) {
    const { rows } = await this.fetch(
      {
        scope,
        indexPosition,
        tableKey,
        lowerBound,
        upperBound,
        keyType,
        offset,
        limit: 1,
        reverse
      },
      modifierProps
    )
    return rows.length ? rows[0] : null
  }

  async _parseRows (rows, modifierProps, scope) {
    throw new Error('Should be implemented by subclass')
  }

  async _changeStructure (rows, modifierProps, scope) {
    return rows
  }

  async getTableRows (
    {
      code,
      scope,
      table,
      indexPosition,
      tableKey,
      lowerBound,
      upperBound,
      keyType,
      offset,
      limit,
      reverse
    },
    filters,
    sort
  ) {
    let { rows } = await this._getTableRows(
      {
        code,
        scope,
        table,
        indexPosition,
        tableKey,
        lowerBound,
        upperBound,
        keyType,
        limit: Number.MAX_SAFE_INTEGER,
        reverse
      }
    )

    return this._filterSort({
      rows,
      filters,
      sort,
      offset,
      limit
    })
  }

  async getOneTableRow (
    {
      code,
      scope,
      table,
      indexPosition,
      tableKey,
      lowerBound,
      upperBound,
      keyType,
      reverse
    },
    filterFn
  ) {
    let { rows } = await this.getTableRows(
      {
        code,
        scope,
        table,
        indexPosition,
        tableKey,
        lowerBound,
        upperBound,
        keyType,
        reverse,
        limit: 1
      },
      filterFn
    )
    return rows.length ? rows[0] : null
  }

  async _getTableRows (
    {
      code,
      scope,
      table,
      indexPosition,
      tableKey,
      lowerBound,
      upperBound,
      keyType,
      limit,
      reverse
    }
  ) {
    code = code || this.contractAccount
    scope = scope == null ? this.contractAccount : scope
    table = table || this.table
    const params = {
      json: true,
      code,
      scope,
      table,
      index_position: indexPosition,
      table_key: tableKey,
      lower_bound: lowerBound,
      upper_bound: upperBound,
      key_type: keyType,
      limit,
      reverse
    }
    const results = await this.eosApi.getTableRows(params)
    // console.log('Table rows results:', JSON.stringify(results, null, 4))
    // console.log('For params:', params)
    return results
  }

  async _filterSort ({
    rows,
    filters,
    sort,
    offset,
    limit
  }) {
    if (filters) {
      const account = await this.getAccount()
      rows = this._applyFilters(rows, account, filters)
    }

    if (sort) {
      rows = this._sort(rows, sort)
    }

    const start = offset || 0
    const end = limit ? start + limit : Number.MAX_SAFE_INTEGER
    return {
      rows: rows.slice(start, end),
      more: rows.length > end
    }
  }

  _applyFilters (rows, account, filters) {
    const filtered = []
    const pFilters = []
    for (const filter of filters) {
      pFilters.push(Util.isString(filter) ? { fn: filter } : filter)
    }
    for (const row of rows) {
      let include = true
      for (const filter of pFilters) {
        const { fn, params } = filter
        if (!this.constructor.FILTERS[fn](row, account, params)) {
          include = false
          break
        }
      }
      if (include) {
        filtered.push(row)
      }
    }
    return filtered
  }

  _sort (rows, sort) {
    const useCompare = (field) => {
      for (const row of rows) {
        const value = Util.getProperty(row, field)
        if (value) {
          return !!value.compare
        }
      }
      return false
    }

    let compare = sort
    if (typeof sort !== 'function') {
      const { field } = sort
      let { desc } = sort
      desc = desc ? -1 : 1
      if (useCompare(field)) {
        compare = (a, b) => {
          const aValue = Util.getProperty(a, field)
          const bValue = Util.getProperty(b, field)
          if (!aValue) {
            return -1
          }
          if (!bValue) {
            return 1
          }
          return aValue.compare(bValue) * desc
        }
      } else {
        compare = (a, b) => {
          const aValue = Util.getProperty(a, field)
          const bValue = Util.getProperty(b, field)
          let result = 0
          if (aValue > bValue) {
            result = 1
          } else if (aValue < bValue) {
            result = -1
          }
          return result * desc
        }
      }
    }
    return rows.sort(compare)
  }

  _precisionToScale (precision) {
    return Number(`1${'0'.repeat(precision)}`)
  }

  intToDecimal (value, precision = 2) {
    return Number(value) / this._precisionToScale(precision)
  }

  decimalToInt (value, precision = 2) {
    return Math.round(Number(value) * this._precisionToScale(precision))
  }

  intToAsset (value, precision = 2, symbol = 'USD') {
    // return new Asset(this.intToDecimal(value, precision), symbol, precision)
  }

  assetToInt (asset) {
    return this.decimalToInt(asset.amount, asset.precision)
  }

  toFiatAsset (value) {
    // return value ? FiatAsset.parse(value) : null
  }

  toTokenAsset (value) {
    // return value ? TokenAsset.parse(value) : null
  }

  toDate (unixTimestamp) {
    return unixTimestamp ? TimeUtil.fromUnixTimestamp(unixTimestamp) : null
  }

  toUnixTimestamp (date) {
    return TimeUtil.toUnixTimestamp(date)
  }

  toFileArray (fileMap) {
    const files = []
    fileMap = fileMap || {}
    for (const key in fileMap) {
      files.push({
        filename: key,
        address: fileMap[key]
      })
    }
    return files
  }

  toFileMap (fileArray) {
    const fileMap = {}
    fileArray = fileArray || []
    for (const { filename, address } of fileArray) {
      fileMap[filename] = address
    }
    return fileMap
  }

  parseJson (str) {
    return str ? JSON.parse(str) : null
  }

  canResolvePayload (payload) {
    return false
  }

  async resolvePayload (payload) {
    const data = await this._resolvePayload(payload)
    return {
      data,
      type: this.workflowPayloadType
    }
  }

  async _resolvePayload (payload) {
    return null
  }

  resolvePayloadId (payload) {
    return null
  }
}

BaseEosApi.FILTERS = {
  inValues (property, values) {
    values = Array.isArray(values) ? values : [values]
    return property && values.indexOf(property) > -1
  },
  containsAny (properties, values) {
    properties = Array.isArray(properties) ? properties : [properties]
    values = Array.isArray(values) ? values : [values]
    for (const property of properties) {
      if (BaseEosApi.FILTERS.inValues(property, values)) {
        return true
      }
    }
    return false
  },
  /**
   * @param {string} property
   * @param {string} search
   */
  containsStr (property, search) {
    return property.toLowerCase().indexOf(search.toLowerCase()) > -1
  }
}

export default BaseEosApi
