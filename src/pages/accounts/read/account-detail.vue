<template lang="pug">
#container
  .text-h6 {{ $t('pages.accounts.details') }}
  .details.q-mt-md.q-px-sm.q-gutter-sm
    .text-caption {{ $t('pages.accounts.account') }}: Accounts
    .text-caption {{ $t('pages.accounts.memo') }}: Memo!!
    .row.justify-between
        .text-caption {{ $t('pages.accounts.date') }}: Date
        .text-caption.text-right {{ $t('pages.accounts.approved') }}: Icon
        .text-caption.text-right {{ $t('pages.accounts.balanced') }}: Icon
    q-table.q-mt-md(
      :columns="columns"
      :data="transactionsList"
      row-key="id"
      :pagination="initialPagination"
      table-header-class="bg-secondary text-white"
    )
</template>

<script>
export default {
  name: 'account-detail',
  data () {
    return {
      transactionsList: [
        {
          id: 0,
          transaction: 'Test Transaction',
          amount: 253,
          percent: '10%'
        },
        {
          id: 1,
          transaction: 'Test Transaction 2',
          amount: 536,
          percent: '60%'
        },
        {
          id: 2,
          transaction: 'Test Transaction 3',
          amount: 1024,
          percent: '30%'
        }
      ],
      initialPagination: {
        // sortBy: 'desc',
        // descending: false,
        page: 1,
        rowsPerPage: 10
        // rowsNumber: xx if getting data from a server
      },
      columns: [
        {
          name: 'transaction',
          label: this.$t('pages.accounts.transaction'),
          field: row => row.transaction,
          align: 'left',
          sortable: true
        },
        {
          name: 'amount',
          label: this.$t('pages.accounts.amount'),
          field: row => row.amount,
          align: 'left',
          sortable: true
        },
        {
          name: 'percent',
          label: this.$t('pages.accounts.percent'),
          field: row => row.percent,
          align: 'left',
          sortable: true
        }
      ]
    }
  }
}
</script>

<style lang="sass" scoped>
</style>
