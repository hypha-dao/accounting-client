<script>
export default {
  name: 'components-table',
  props: {
    components: Array
  },
  data () {
    return {
      pageSize: 200,
      nextPage: 2,
      search: undefined,
      columns: [
        {
          name: 'amount',
          align: 'right',
          label: this.$t('pages.transactions.amount'),
          field: row => `${row.amount}`,
          sortable: true,
          headerClasses: 'bg-secondary text-white'
        },
        {
          name: 'memo',
          align: 'left',
          label: this.$t('pages.transactions.memo'),
          field: row => `${row.memo}`,
          sortable: true,
          headerClasses: 'bg-secondary text-white'
        },
        {
          name: 'date',
          align: 'left',
          label: this.$t('pages.transactions.date'),
          field: row => `${row.create_date}`,
          sortable: true,
          headerClasses: 'bg-secondary text-white',
          format: v => { return this.dateToString(v) }
        },
        {
          name: 'from',
          align: 'left',
          label: this.$t('pages.transactions.from'),
          field: row => `${row.from}`,
          sortable: true,
          headerClasses: 'bg-secondary text-white',
          format: (value) => {
            if (value && value !== undefined && value !== 'undefined') {
              return value
            } else return 'N/A'
          }
        },
        {
          name: 'to',
          align: 'left',
          label: this.$t('pages.transactions.to'),
          field: row => `${row.to}`,
          sortable: true,
          headerClasses: 'bg-secondary text-white',
          format: (value) => {
            if (value && value !== undefined && value !== 'undefined') {
              return value
            } else return 'N/A'
          }
        },
        {
          name: 'type',
          align: 'left',
          label: this.$t('pages.transactions.type'),
          field: row => `${row.type}`,
          sortable: true,
          headerClasses: 'bg-secondary text-white'
        }
      ]
    }
  }
}
</script>

<template lang="pug">
#container
  //- p {{ components }}
  q-table(
    :columns="columns"
    :data="components"
    virtual-scroll
    :rows-per-page-options="[0]"
    :virtual-scroll-item-size="pageSize - 2"
    :virtual-scroll-sticky-size-start="pageSize - 2"
    dense
    ref="table"
    :filter="search"
  )
     template(v-slot:top-right)
       q-input(
         v-model="search"
         label="Search"
       )
         template(v-slot:append)
           q-icon(name="search")
</template>

<style lang="stylus" scoped>

</style>
