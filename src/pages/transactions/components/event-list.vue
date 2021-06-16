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
        q-td.text-center
          q-btn(icon="app:add" flat size="md" @click="onEventClick(props.row)")
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
    this.events = await this.getEvents({
      offset: 0,
      first: 100
    })
  },
  methods: {
    ...mapActions('event', ['getEvents']),
    onEventClick (event) {
      this.$emit('eventClick', event)
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
  max-height: 400px;
}
.t-table {
  height: 35vh
}
</style>
