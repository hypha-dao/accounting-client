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
      template(v-slot:body-cell-account="props")
        q-td.text-center
          .text-cell(v-if="props.row.account") {{ props.row.account.accountName }}
            span(v-if="editingRow === props.row.hash")
              q-icon.q-ml-xs(name="edit" color="positive")
          .text-cell(v-else) ---
            span(v-if="editingRow === props.row.hash")
              q-icon.q-ml-xs(name="edit" color="positive")
          q-popup-edit.pop-edit(v-if="editingRow === props.row.hash" separate-close-popup v-model="props.row.account" auto-save)
            custom-table-tree(v-model="props.row.account")
      template(v-slot:body-cell-from="props")
        q-td.text-center
          .text-cell(v-if="editingRow !== props.row.hash") {{ props.row.from }}
          q-input(v-else autofocus v-model="props.row.from" dense counter :label="$t('pages.transactions.from')" color="secondary")
      template(v-slot:body-cell-to="props")
        q-td.text-center
          .text-cell(v-if="editingRow !== props.row.hash") {{ props.row.to }}
          q-input(v-else v-model="props.row.to" dense counter :label="$t('pages.transactions.to')" color="secondary")
      template(v-slot:body-cell-amount="props")
        q-td.text-center
          .text-cell(v-if="editingRow !== props.row.hash") {{ props.row.quantity }}
          q-input(v-else v-model="props.row.quantity" type="number" step="0.1" min="0" dense counter :label="$t('pages.transactions.amount')" color="secondary")
      template(v-slot:body-cell-currency="props")
        q-td.text-center
          .text-cell(v-if="editingRow !== props.row.hash") {{ props.row.currency }}
          q-input(v-else v-model="props.row.currency" dense counter :label="$t('pages.transactions.currency')" color="secondary")
      template(v-slot:body-cell-memo="props")
        q-td.text-center
          .text-cell(v-if="editingRow !== props.row.hash") {{ props.row.memo }}
          q-input(v-else v-model="props.row.memo" dense counter :label="$t('pages.transactions.memo')" color="secondary")
      template(v-slot:body-cell-date="props")
        q-td.text-center
          .text-cell(v-if="editingRow !== props.row.hash") {{ props.row.date }}
          q-input(v-else v-model="props.row.date" dense counter :label="$t('pages.transactions.date')" color="secondary")
      template(v-slot:body-cell-actions="props")
        q-td.text-center.q-gutter-xs
          q-btn(v-if="editingRow !== props.row.hash && !addingComponent" icon="edit" round size="sm" color="positive" @click="onClickEditRow(props.row)")
          q-btn(v-if="editingRow === props.row.hash" icon="save" round size="sm" color="primary" @click="onClickSaveRow(props.row)")
          q-btn(v-if="addingComponent && editingRow === props.row.hash" icon="close" round size="sm" color="negative" @click="onClickCancelAdding(props.row)")
          q-btn(v-if="editingRow === false" icon="delete" round size="sm" color="negative" @click="onClickRemoveRow(props.row)")
      template(v-slot:bottom v-if="!addingComponent")
        q-tr
          q-btn.full-width(icon="add" size="sm" label="Add component" @click="onClickAddRow")
      template(v-slot:no-data v-if="!addingComponent")
        q-tr
          q-btn.full-width(icon="add" size="sm" label="Add component" @click="onClickAddRow")
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
import CustomTableTree from '~/pages/accounts/components/custom-table-tree'

export default {
  name: 'transaction-view',
  components: { CustomTableTree },
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
      transaction: undefined,
      editingRow: false,
      addingComponent: false
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
    onClickEditRow (row) {
      if (this.editingRow !== false) {
        if (!this.onClickSaveRow(row)) {
          return
        }
      }
      this.editingRow = row.hash
    },
    onClickAddRow () {
      if (!this.addingComponent) {
        this.addingComponent = true
        const tempHash = [...Array(8)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')
        console.log('tempHash', tempHash)
        this.components.push({
          hash: tempHash,
          isCustomComponent: true,
          account: undefined

        })
        this.editingRow = tempHash
      }
    },
    onClickSaveRow (row) {
      if (!this.validateRow(row)) {
        this.showErrorMsg('Please review all fields are filled')
        return
      }
      row.date = new Date()
      this.editingRow = false
      this.addingComponent = false
    },
    onClickCancelAdding (row) {
      this.editingRow = false
      this.addingComponent = false
      this.onClickRemoveRow(row)
    },
    onClickRemoveRow (row) {
      const rowIndex = this.components.findIndex(v => row === v)
      this.components.splice(rowIndex, 1)
    },
    validateRow (row) {
      let isValidRow = true
      if (!row.account) {
        isValidRow = false
      } else if (!row.from) {
        isValidRow = false
      } else if (!row.to) {
        isValidRow = false
      } else if (!row.quantity) {
        isValidRow = false
      } else if (!row.currency) {
        isValidRow = false
      } else if (!row.memo) {
        isValidRow = false
      } else if (!row.date) {
        isValidRow = false
      }
      return isValidRow
    },
    storeTransaction () {
      let fullTrx = transactionPayout
      debugger
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
.pop-edit
  max-width: 1500px !important
  min-width: 400px !important
</style>
