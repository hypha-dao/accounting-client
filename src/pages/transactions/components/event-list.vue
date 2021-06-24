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
      dense
      ref="table"
    )
      template(v-slot:body-cell-actions="props")
        q-td.text-center.add-icon
          q-icon.add-icon.cursor-pointer.animated-icon(name="app:add" flat size="sm" @click="onEventClick(props.row)")
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
  methods: {
    ...mapActions('event', ['getEvents']),
    async loadEvents () {
      this.events = await this.getEvents({
        offset: 0,
        first: 100
      })
    },
    onEventClick (event) {
      this.$emit('eventClick', {
        ...event,
        isFromEvent: true
      })
      this.tempRemoveEvent(event)
    },
    tempRemoveEvent (event) {
      const indexEvent = this.events.findIndex(v => event === v)
      console.log('indexEvent', indexEvent, this.events)
      this.events.splice(indexEvent, 1)
    },
    returnEventRemoved (event) {
      this.events.push(event)
    }
    // async onScroll ({ to, ref, index, direction }) {
    //   try {
    //     if (!this.loading && this.users.more && index > (to - 15) && direction === 'increase') {
    //       console.log('scroll')
    //       this.loading = true
    //       let newRows = await this.getUsers(this.params)
    //       if (this.nextPage > 2) {
    //         newRows.rows.shift()
    //       }
    //       this.users.rows = this.users.rows.concat(newRows.rows)
    //       this.users.more = newRows.more
    //       this.nextPage = this.nextPage + 1
    //       this.loading = false
    //       this.params.offset = this.params.offset + this.pageSize
    //       this.params.nextKey = newRows.next_key
    //       if (this.users.rows.length > 0) {
    //         this.params.customOffset = this.users.rows[this.users.rows.length - 1].account || undefined
    //       }
    //       await this.$nextTick()
    //     }
    //   } catch (e) {
    //     console.error(e)
    //   }
    // },
    // resetPagination () {
    //   // this.$refs.table.resetVirtualScroll()
    //   this.users.rows = []
    //   this.users.more = true
    //   this.params.offset = 0
    //   this.nextPage = 2
    //   this.params.customOffset = this.params.search
    //   // this.$refs.table.resetVirtualScroll()
    //   this.onScroll({ to: -1, ref: this.$refs.table, index: 0, direction: 'increase' })
    // }
  }
}
</script>

<style scoped lang="scss">
.event-card {
  // height: 500px;
  // flex: 1;
}
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
