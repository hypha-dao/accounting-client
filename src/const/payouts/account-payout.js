export const accountPayout = [
  [
    {
      label: 'content_group_label',
      value: ['string', 'details']
    },
    {
      label: 'ledger_account',
      value: ['checksum256', process.env.DGRAPH_TRX_LEDGER]
    },
    {
      label: 'parent_account',
      value: ['checksum256', '']
    },
    {
      label: 'account_name',
      value: ['string', '']
    },
    {
      label: 'account_type',
      value: ['int64', 1]
    },
    {
      label: 'account_code',
      value: ['string', '']
    }
  ]
]

// let arraystezx = [
//   [
//     {
//       label: 'content_group_label',
//       value: ['string', 'details']
//     },
//     {
//       label: 'account_name',
//       value: ['string', 'Salary']
//     },
//     {
//       label: 'account_type',
//       value: ['int64', 1]
//     },
//     {
//       label: 'account_tag_type',
//       value: ['string', 'DEBIT']
//     },
//     {
//       label: 'account_code',
//       value: ['string', '000115']
//     }
//   ]
// ]
