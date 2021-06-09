<template lang="pug">
  q-card.event-card.q-pa-sm
    .text-h6 {{ $t('pages.events.events') }}
    q-table.sticky-virtscroll-table.t-table(
      :columns="columns"
      :data="events"
      virtual-scroll
      :rows-per-page-options="[0]"
      :virtual-scroll-item-size="pageSize - 2"
      :virtual-scroll-sticky-size-start="pageSize - 2"
    )
      template(v-slot:body-cell-actions="props")
        q-td.text-center
          q-btn(icon="app:add" flat size="md")
</template>

<script>
import { mapActions } from 'vuex'
import CreateTransaction from './create-transaction'

export default {
  name: 'event-list',
  components: {
    CreateTransaction
  },
  data () {
    return {
      pageSize: 20,
      nextPage: 2,
      events: [],
      columns: [
        {
          name: 'from',
          align: 'center',
          label: this.$t('pages.events.from'),
          field: row => row.from,
          sortable: true,
          headerClasses: 'bg-secondary text-white'
        },
        {
          name: 'to',
          align: 'center',
          label: this.$t('pages.events.to'),
          field: row => row.to,
          sortable: true,
          headerClasses: 'bg-secondary text-white'
        },
        {
          name: 'amount',
          align: 'center',
          label: this.$t('pages.events.amount'),
          field: row => `${row.quantity} ${row.currency}`,
          sortable: true,
          headerClasses: 'bg-secondary text-white'
        },
        {
          name: 'memo',
          align: 'center',
          label: this.$t('pages.events.memo'),
          field: row => row.memo,
          sortable: true,
          headerClasses: 'bg-secondary text-white'
        },
        {
          name: 'date',
          align: 'center',
          label: this.$t('pages.events.date'),
          field: row => row.date,
          sortable: true,
          headerClasses: 'bg-secondary text-white'
        },
        {
          name: 'actions',
          align: 'center',
          label: this.$t('pages.events.actions'),
          field: row => row.action,
          sortable: true,
          headerClasses: 'bg-secondary text-white'
        }
      ]
    }
  },
  async mounted () {
    this.events = await this.getEvents()
  },
  methods: {
    ...mapActions('event', ['getEvents'])
  }
}
</script>

<style scoped lang="scss">
.event-card {
  // height: 500px;
  // flex: 1;
}
.customTable {
  max-height: 400px;
}
.t-table {
  height: 35vh
}
</style>
