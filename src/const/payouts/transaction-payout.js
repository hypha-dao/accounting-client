export const transactionPayout = [
  [
    {
      'label': 'content_group_label',
      'value': ['string', 'details']
    },
    {
      'label': 'trx_date',
      'value': ['time_point', '']
    },
    {
      'label': 'trx_name',
      'value': ['string', '']
    },
    {
      'label': 'trx_ledger',
      'value': ['checksum256', process.env.DGRAPH_TRX_LEDGER]
    },
    {
      'label': 'trx_memo',
      'value': ['string', '']
    }
  ]
]
