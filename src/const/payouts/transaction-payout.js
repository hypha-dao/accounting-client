export const transactionPayout = [
  [
    {
      'label': 'content_group_label',
      'value': ['string', 'header']
    },
    {
      'label': 'trx_date',
      'value': ['time_point', undefined]
    },
    {
      'label': 'trx_ledger',
      'value': ['checksum256', process.env.DGRAPH_BASE_NODE_HASH]
    },
    {
      'label': 'trx_memo',
      'value': ['string', undefined]
    }
  ]
]
