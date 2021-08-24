<template lang="pug">
  q-card.event-card.q-pa-sm
    .text-h6 {{ $t('pages.events.events') }}
    #container
      q-table.sticky-virtscroll-table.t-table(
        :columns="columns"
        :data="eventsFreeze"
        virtual-scroll
        :pagination.sync="pagination"
        :rows-per-page-options="[0]"
        :virtual-scroll-item-size="pageSize - 2"
        :virtual-scroll-sticky-size-start="pageSize - 2"
        dense
        ref="table"
        @virtual-scroll="onScroll"
      )
        template(v-slot:body-cell-actions="props")
          q-td.text-center.add-icon
            q-icon.add-icon.cursor-pointer.animated-icon(name="app:add" flat size="sm" @click="onEventClick(props.row)")
        template(v-slot:body-cell-memo="props")
          q-td.responsive-cell
            .text-memo {{ props.row.memo }}
              q-tooltip {{ props.value }}
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
      pagination: {
        rowsPerPage: 10
      },
      offset: 0,
      limit: 10,
      pageSize: 10,
      entryStatus: undefined,
      nextKey: 2,
      events: {
        rows: [],
        more: true
      },
      columns: [
        {
          name: 'from',
          align: 'left',
          label: this.$t('pages.events.from'),
          field: row => row.from,
          sortable: true,
          headerClasses: 'bg-secondary text-white'
        },
        {
          name: 'to',
          align: 'left',
          label: this.$t('pages.events.to'),
          field: row => row.to,
          sortable: true,
          headerClasses: 'bg-secondary text-white'
        },
        {
          name: 'amount',
          align: 'right',
          label: this.$t('pages.events.amount'),
          field: row => `${row.quantity}`,
          sortable: true,
          headerClasses: 'bg-secondary text-white'
        },
        {
          name: 'currency',
          align: 'left',
          label: this.$t('pages.transactions.currency'),
          field: row => `${row.currency}`,
          sortable: true,
          headerClasses: 'bg-secondary text-white'
        },
        {
          name: 'memo',
          align: 'left',
          label: this.$t('pages.events.memo'),
          field: row => row.memo,
          sortable: true,
          headerClasses: 'bg-secondary text-white'
        },
        {
          name: 'date',
          align: 'left',
          label: this.$t('pages.events.date'),
          field: row => row.date,
          sortable: true,
          headerClasses: 'bg-secondary text-white',
          format: v => new Date(v).toUTCString().replace('GMT', '')
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
  mounted () {
    this.loadEvents()
  },
  computed: {
    eventsFreeze () {
      return Object.freeze(this.events.rows.slice(0, this.pageSize * (this.nextKey - 2)))
    }
  },
  methods: {
    ...mapActions('event', ['getEvents']),
    onEventClick (event) {
      this.$emit('eventClick', {
        ...event,
        isFromEvent: true
      })
      this.tempRemoveEvent(event)
    },
    tempRemoveEvent (event) {
      const indexEvent = this.events.rows.findIndex(v => event === v)
      this.events.rows.splice(indexEvent, 1)
    },
    returnEventRemoved (event) {
      console.log('return event in evs', event)
      this.events.rows.push(event)
    },
    async onScroll ({ to, ref, index, direction }) {
      try {
        if (!this.loading && this.events.more && index > (to - 15) && direction === 'increase') {
          this.pagination.rowsPerPage = this.pagination.rowsPerPage + this.pageSize
          this.loading = true
          let newRows = await this.loadEvents()
          this.events.rows = this.events.rows.concat(newRows.rows)
          this.events.more = newRows.more
          this.nextKey = this.nextKey + 1
          this.loading = false
          this.offset = this.offset + this.pageSize
          this.limit = this.offset + this.pageSize
          await this.$nextTick()
        }
      } catch (e) {
        console.error(e)
      }
    },
    async loadEvents () {
      return this.getEvents({
        offset: this.offset,
        first: this.pageSize
      })
    },
    resetPagination () {
      this.events.rows = []
      this.events.more = true
      this.offset = 0
      this.nextPage = 2
      this.onScroll({ to: -1, ref: this.$refs.table, index: 0, direction: 'increase' })
    }
  }
}
</script>

<style scoped lang="scss">
.customTable {
  max-height: 350px;
}
.t-table {
  height: 33vh
}
.add-icon {
  padding: 0px !important;
  margin: 0px !important;
}
</style>
