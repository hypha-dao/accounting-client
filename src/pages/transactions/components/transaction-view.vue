<template lang="pug">
q-card.q-pa-sm.full-width
  .row.justify-between
    .text-h6 {{ $t('pages.transactions.transactions') }}
    #transaction-info
        .row.q-gutter-md
            .row.q-gutter-xs
                .text-secondary.text-bold Approved
                q-icon.self-center(
                name="app:unapproved"
                size="sm"
                )
            .row.q-gutter-xs
                .text-secondary.text-bold Balanced
                q-icon.self-center(
                name="app:unbalanced"
                size="sm"
                )
  .row.q-col-gutter-sm
    .col
        .row.q-gutter-md
            q-input.transaction-input(
              :label="$t('pages.transactions.transaction')"
              v-model="transaction"
              dense
              filled
              v-if="!isSelect"
            )
            q-select.transaction-input(
              :label="$t('pages.transactions.transaction')"
              filled
              dense
              v-model="transaction"
              clearable
              use-input
              hide-selected
              fill-input
              input-debounce="0"
              :options="unapprovedTransactionsOptions"
              style="width: 250px"
              v-else
            )
            .text.self-center.text-secondary.text-uppercase.text-bold {{ $t('pages.transactions.or') }}
            q-btn(
                :label="labelModeSelectTransaction"
                dense
                size="sm"
                color="secondary"
                @click="isSelect = !isSelect"
            )
    .col-4
        q-input(
            :label="$t('pages.transactions.memo')"
            dense
            filled
        )
    .col-3
        q-input(
            :label="$t('pages.transactions.date')"
            dense
            filled
        )
  #container
    q-table.sticky-virtscroll-table.q-mt-sm.t-table(
        :columns="columns"
        :data="components"
        virtual-scroll
        :rows-per-page-options="[0]"
        :virtual-scroll-item-size="pageSize - 2"
        :virtual-scroll-sticky-size-start="pageSize - 2"
    )
      template(v-slot:body-cell-from="props")
        q-td.text-center
          .text-cell {{ props.row.from }}
          q-popup-edit(v-model="props.row.from")
            q-input(v-model="props.row.from" dense autofocus counter :label="$t('pages.transactions.from')" color="secondary")
      template(v-slot:body-cell-to="props")
        q-td.text-center
          .text-cell {{ props.row.to }}
          q-popup-edit(v-model="props.row.to")
            q-input(v-model="props.row.to" dense autofocus counter :label="$t('pages.transactions.to')" color="secondary")
      template(v-slot:body-cell-amount="props")
        q-td.text-center
          .text-cell {{ props.row.quantity }}
          q-popup-edit(v-model="props.row.quantity")
            q-input(v-model="props.row.quantity" type="number" dense autofocus counter :label="$t('pages.transactions.amount')" color="secondary")
      template(v-slot:body-cell-actions="props")
        q-td.text-center
          q-btn(icon="remove" round size="sm")
    //- Foot
    .row.q-col-gutter-sm.q-mt-xs
        .col-6
            q-input(
                :label="$t('pages.transactions.notes')"
                dense
                filled
            )
        .col.self-center
            q-btn.full-width(
                :label="$t('pages.transactions.approve')"
                dense
                size="md"
                class="bg-grey-6 text-white"
            )
        .col.self-center
            q-btn.full-width(
                :label="$t('pages.transactions.save')"
                dense
                size="md"
                class="bg-grey-6 text-white"
                @click="storeTransaction()"
            )
</template>

<script>
import { mapActions } from 'vuex'
import { transactionPayout } from '~/const/payouts/transaction-payout'
import { componentPayout } from '~/const/payouts/component-payout'

export default {
  name: 'transaction-view',
  data () {
    return {
      pageSize: 20,
      nextPage: 2,
      components: [],
      columns: [
        {
          name: 'account',
          align: 'center',
          label: this.$t('pages.transactions.account'),
          field: row => row.account,
          sortable: true,
          headerClasses: 'bg-secondary text-white'
        },
        {
          name: 'from',
          align: 'center',
          label: this.$t('pages.transactions.from'),
          field: row => row.from,
          sortable: true,
          headerClasses: 'bg-secondary text-white'
        },
        {
          name: 'to',
          align: 'center',
          label: this.$t('pages.transactions.to'),
          field: row => row.to,
          sortable: true,
          headerClasses: 'bg-secondary text-white'
        },
        {
          name: 'amount',
          align: 'center',
          label: this.$t('pages.transactions.amount'),
          field: row => row.quantity,
          sortable: true,
          headerClasses: 'bg-secondary text-white'
        },
        {
          name: 'currency',
          align: 'center',
          label: this.$t('pages.transactions.currency'),
          field: row => row.currency,
          sortable: true,
          headerClasses: 'bg-secondary text-white'
        },
        {
          name: 'memo',
          align: 'center',
          label: this.$t('pages.transactions.memo'),
          field: row => row.memo,
          sortable: true,
          headerClasses: 'bg-secondary text-white'
        },
        {
          name: 'date',
          align: 'center',
          label: this.$t('pages.transactions.date'),
          field: row => row.date,
          sortable: true,
          headerClasses: 'bg-secondary text-white'
        },
        {
          name: 'actions',
          align: 'center',
          label: this.$t('pages.transactions.actions'),
          field: row => row.actions,
          sortable: true,
          headerClasses: 'bg-secondary text-white'
        }
      ],
      isSelect: true,
      unapprovedTransactions: undefined,
      transaction: undefined
    }
  },
  computed: {
    labelModeSelectTransaction () {
      return this.isSelect ? this.$t('pages.transactions.selectTransaction') : 'Create new transaction'
    },
    unapprovedTransactionsOptions () {
      if (!this.unapprovedTransactions) return
      return this.unapprovedTransactions.map(v => {
        return {
          label: v.memo,
          value: v
        }
      })
    }
  },
  mounted () {
    this.loadUnapprovedTransactions()
  },
  methods: {
    ...mapActions('transaction', ['getUnapprovedTransactions', 'createTxn', 'updateTxn']),
    addEventToTransaction (event) {
      console.log('addEventToTransaction', event)
      this.components.push(event)
    },
    async loadUnapprovedTransactions () {
      this.unapprovedTransactions = await this.getUnapprovedTransactions()
    },
    storeTransaction () {
      let fullTrx = transactionPayout
      let trxHash = ''
      if (this.isSelect) trxHash = this.transaction.value.hash

      fullTrx[0][1].value[1] = this.transaction.value.date
      fullTrx[0][3].value[1] = this.transaction.value.memo

      // Creates an content group for each component. It nead memo, account hash and amount
      this.components.forEach(comp => {
        fullTrx.push(this.formattedComponent(comp))
      })

      // console.log(trxHash, 'complete trx', fullTrx)

      !this.isSelect ? this.createTxn({ contentGroups: fullTrx }) : this.updateTxn({ contentGroups: fullTrx, transactionHash: trxHash })
    },
    formattedComponent ({ memo, account, quantity, currency }) {
      // console.log('add compo')
      // let acc = 'f462d1b4fa41e7456faddda9d088db6a2ab4073d9a2a441dbd73d9555b608f8d'
      let component = componentPayout

      component[1].value[1] = memo
      component[2].value[1] = account
      component[3].value[1] = `${quantity} ${currency}`

      return component
    }
  }
}
</script>

<style lang="sass" scoped>
.transaction-input
  min-width: 250px
.t-table
  height: 30vh
</style>
