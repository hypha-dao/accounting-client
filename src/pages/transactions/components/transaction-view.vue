<template lang="pug">
q-card.q-pa-sm.full-width
  .row
    .text-h6.q-mr-lg {{ $t('pages.transactions.transactions') }}
    #transaction-info
      .row.q-gutter-md
          //- .row.q-gutter-xs
          //-     .text-secondary.text-bold Approved
          //-     q-icon.self-center(
          //-     name="app:unapproved"
          //-     size="sm"
          //-     )
          #unbalanced(v-if="!transactionBalanced")
            .row.q-gutter-xs
              .text-secondary.text-bold Unbalanced
              q-icon.self-center(
              name="app:unbalanced"
              size="sm"
              )
          #unbalanced(v-else)
            .row.q-gutter-xs
              .text-secondary.text-bold Balanced
              q-icon.self-center(
                name="check_circle"
                size="sm"
                color="positive"
              )
  .row.q-col-gutter-sm
    .col
        .row.q-gutter-md
            q-input.transaction-input(
              :label="$t('pages.transactions.transaction')"
              v-model="transaction.value.name"
              dense
              filled
              v-if="!isSelect"
              style="width: 350px"
              ref="newTrxInput"
              color="secondary"
            )
            q-select.transaction-input(
              :label="$t('pages.transactions.chooseTransaction')"
              filled
              dense
              v-model="selectedTransaction"
              fill-input
              :options="unapprovedTransactionsOptions"
              style="width: 350px"
              v-else
              ref="chooseTrxSelect"
              color="secondary"
            )
            .text.self-center.text-secondary.text-uppercase.text-bold {{ $t('pages.transactions.or') }}
            q-btn.mode-btn(
                dense
                size="sm"
                color="secondary"
                @click="isSelect = !isSelect"
                no-caps
            )
              q-icon(name="add" v-if="isSelect")
              .label-mode-btn {{ labelModeSelectTransaction }}
    .col-3
        q-input(
            :label="$t('pages.transactions.notes')"
            dense
            filled
            v-model="transaction.value.memo"
            color="secondary"
        )
    .col-2
      q-input(filled v-model="transaction.value.date" dense mask="date" label="Date" color="secondary")
        template(v-slot:append)
         q-icon(name="event" class="cursor-pointer")
          q-popup-proxy(ref="qDateProxy" transition-show="scale" transition-hide="scale")
            q-date(v-model="transaction.value.date")
              div(class="row items-center justify-end")
                q-btn(v-close-popup label="Close" color="primary" flat)
        //- q-input(
        //-     :label="$t('pages.transactions.date')"
        //-     dense
        //-     filled
        //-     v-model="transaction.value.date"
        //- )
  #container
    q-table.sticky-virtscroll-table.q-mt-sm.t-table(
        :columns="columns"
        :data="components"
        virtual-scroll
        :rows-per-page-options="[0]"
        :virtual-scroll-item-size="pageSize - 2"
        :virtual-scroll-sticky-size-start="pageSize - 2"
        dense
    )
      template(v-slot:body-cell-account="props")
        q-td
          .text-cell(v-if="props.row.account") {{ props.row.account.accountCode }} - {{ props.row.account.accountName }}
            span
              q-icon.q-ml-xs.cursor-pointer(name="edit" color="positive" @click="props.row.showEditAccount = !props.row.showEditAccount")
          .text-cell(v-else) ---
            span
              q-icon.q-ml-xs.cursor-pointer(name="edit" color="positive" @click="props.row.showEditAccount = !props.row.showEditAccount")
          //- q-popup-edit.pop-edit(separate-close-popup v-model="props.row.account" auto-save)
          //-   custom-table-tree(v-model="props.row.account")
          q-dialog(v-model="props.row.showEditAccount" position="top")
            q-card.q-pa-md(style="min-width: 800px")
              custom-table-tree(v-model="props.row.account")
      template(v-slot:body-cell-from="props")
        q-td.short-input
          q-input.short-input(v-if="editingRow === props.row.hash && props.row.isCustomComponent" autofocus v-model="props.row.from" dense :label="$t('pages.transactions.from')" color="secondary")
          .text-cell.short-input(v-else) {{ props.row.from }}
      template(v-slot:body-cell-type="props")
        q-select(
          :options="optionTypeComponent"
          v-model="props.row.type"
          dense
          @popup-hide="checkIsBalancedTransaction()"
        )
        //- q-td
        //-   .text-cell(v-if="props.row.account") {{ props.row.account.typeTag }}
      template(v-slot:body-cell-to="props")
        q-td.short-input
          q-input.short-input(v-if="editingRow === props.row.hash && props.row.isCustomComponent" v-model="props.row.to" dense :label="$t('pages.transactions.to')" color="secondary")
          .text-cell(v-else) {{ props.row.to }}
      template(v-slot:body-cell-amount="props")
        q-td.text-right
          q-input(v-if="editingRow === props.row.hash && props.row.isCustomComponent" v-model="props.row.quantity" type="number" step="0.1" min="0" dense :label="$t('pages.transactions.amount')" color="secondary")
          .text-cell(v-else) {{ props.row.quantity }}
      template(v-slot:body-cell-currency="props")
        q-td
          q-select(
            :options="optionsCurrencies"
            v-if="editingRow === props.row.hash && props.row.isCustomComponent" v-model="props.row.currency" dense :label="$t('pages.transactions.currency')" color="secondary"
          )
          //- q-input(v-if="editingRow === props.row.hash && props.row.isCustomComponent" v-model="props.row.currency" dense counter :label="$t('pages.transactions.currency')" color="secondary")
          .text-cell(v-else) {{ props.row.currency }}
      template(v-slot:body-cell-memo="props")
        q-td.responsive-cell
          q-input.larger-input(v-if="editingRow === props.row.hash && props.row.isCustomComponent" v-model="props.row.memo" dense :label="$t('pages.transactions.memo')" color="secondary")
          .text-memo(v-else) {{ props.row.memo }}
            q-tooltip {{ props.row.memo }}
      template(v-slot:body-cell-date="props")
        q-td
          //- q-input(v-if="editingRow === props.row.hash && props.row.isCustomComponent" v-model="props.row.date" dense mask="date" :rules="['date']" :label="$t('pages.transactions.date')" color="secondary")
          q-input(v-if="editingRow === props.row.hash && props.row.isCustomComponent" v-model="props.row.date" dense :label="$t('pages.transactions.date')" mask="date" color="secondary")
            template(v-slot:append)
              q-icon(name="event" class="cursor-pointer")
                q-popup-proxy(ref="qDateProxy" transition-show="scale" transition-hide="scale")
                  q-date(v-model="props.row.date")
                    div(class="row items-center justify-end")
                      q-btn(v-close-popup label="Close" color="primary" flat)
          .text-cell(v-else) {{ new Date(props.row.date).toUTCString().replace('GMT', '') }}
      template(v-slot:body-cell-actions="props")
        q-td.q-gutter-xs.text-right
          q-btn(v-if="editingRow !== props.row.hash && !addingComponent && !props.row.isFromEvent" icon="edit" round size="xs" color="positive" @click="onClickEditRow(props.row)")
          q-btn(v-if="editingRow === props.row.hash" icon="save" round size="xs" color="primary" @click="onClickSaveRow(props.row)")
          q-btn(v-if="addingComponent && editingRow === props.row.hash" icon="close" round size="xs" color="negative" @click="onClickCancelAdding(props.row)")
          q-btn(v-if="editingRow === false" icon="delete" round size="xs" color="negative" @click="onClickRemoveRow(props.row)")
      template(v-slot:bottom v-if="!addingComponent")
        q-tr
          q-btn.full-width(style="font-size: 12px" no-caps icon="add" size="sm" :label="$t('pages.transactions.addComponent')" @click="onClickAddRow")
      template(v-slot:no-data v-if="!addingComponent")
        q-tr
          q-btn.full-width(style="font-size: 12px" no-caps icon="add" size="sm" :label="$t('pages.transactions.addComponent')" @click="onClickAddRow")
    //- Foot
    .row.q-col-gutter-sm.q-mt-xs
        .col.self-center
            q-btn.full-width(
                :label="$t('pages.transactions.approve')"
                dense
                size="md"
                color="primary"
                :disable="!transactionBalanced"
                @click="aproveTransaction()"
            )
        .col.self-center
            q-btn.full-width(
                :label="$t('pages.transactions.save')"
                dense
                size="md"
                color="secondary"
                @click="storeTransaction()"
                :disable="!readyToSave"
            )
        .col-3
            q-btn.full-width(
                :label="$t('pages.transactions.deleteTransaction')"
                dense
                size="md"
                class="bg-grey-6 text-white"
                @click="deleteTransaction()"
                :disable="!readyToSave"
            )
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import { transactionPayout } from '~/const/payouts/transaction-payout'
import { componentPayout } from '~/const/payouts/component-payout'
import CustomTableTree from '~/pages/accounts/components/custom-table-tree'

export default {
  name: 'transaction-view',
  components: { CustomTableTree },
  data () {
    return {
      autoSelect: false,
      transactionBalanced: false,
      optionsCurrencies: [
        'BTC', 'ETH', 'TLOS', 'HUSD', 'HYPHA', 'SEEDS'
      ],
      optionTypeComponent: [
        'DEBIT',
        'CREDIT'
      ],
      pageSize: 20,
      nextPage: 2,
      components: [],
      columns: [
        {
          name: 'account',
          align: 'left',
          label: this.$t('pages.transactions.account'),
          field: row => row.account,
          sortable: true,
          headerClasses: 'bg-secondary text-white'
        },
        {
          name: 'type',
          align: 'left',
          label: this.$t('pages.transactions.type'),
          field: row => row.account,
          sortable: true,
          headerClasses: 'bg-secondary text-white'
        },
        {
          name: 'from',
          align: 'left',
          label: this.$t('pages.transactions.from'),
          field: row => row.from,
          sortable: true,
          headerClasses: 'bg-secondary text-white'
        },
        {
          name: 'to',
          align: 'left',
          label: this.$t('pages.transactions.to'),
          field: row => row.to,
          sortable: true,
          headerClasses: 'bg-secondary text-white'
        },
        {
          name: 'amount',
          align: 'right',
          label: this.$t('pages.transactions.amount'),
          field: row => row.quantity,
          sortable: true,
          headerClasses: 'bg-secondary text-white'
        },
        {
          name: 'currency',
          align: 'left',
          label: this.$t('pages.transactions.currency'),
          field: row => row.currency,
          sortable: true,
          headerClasses: 'bg-secondary text-white'
        },
        {
          name: 'memo',
          align: 'left',
          label: this.$t('pages.transactions.memo'),
          field: row => row.memo,
          sortable: true,
          headerClasses: 'bg-secondary text-white'
        },
        {
          name: 'date',
          align: 'left',
          label: this.$t('pages.transactions.date'),
          field: row => row.date,
          sortable: true,
          headerClasses: 'bg-secondary text-white'
          // format: v => new Date(v).toUTCString()
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
      isSelect: false,
      unapprovedTransactions: undefined,
      selectedTransaction: undefined,
      transaction: {
        label: undefined,
        value: {
          memo: undefined,
          date: undefined,
          name: undefined
        }
      },
      baseTrx: {
        label: undefined,
        value: {
          memo: undefined,
          date: undefined,
          name: undefined
        }
      },
      editingRow: false,
      addingComponent: false
    }
  },
  computed: {
    labelModeSelectTransaction () {
      return this.isSelect ? this.$t('pages.transactions.newTransaction') : this.$t('pages.transactions.chooseTransaction')
    },
    unapprovedTransactionsOptions () {
      if (!this.unapprovedTransactions) return
      return this.unapprovedTransactions.map(v => {
        return {
          label: v.name,
          value: v
        }
      })
    },
    readyToSave () {
      // debugger
      let ready = true
      if (this.isSelect) {
        if (!this.selectedTransaction) {
          ready = false
        }
      } else {
        if (!this.transaction || !this.transaction.value || !this.transaction.value.name) {
          ready = false
        }
      }
      if (!this.transaction.value.date) {
        ready = false
      }
      return ready
    }
  },
  watch: {
    components (v) {
      this.checkIsBalancedTransaction()
    },
    editingRow (v) {
      this.checkIsBalancedTransaction()
    },
    addingComponent (v) {
      this.checkIsBalancedTransaction()
    },
    async isSelect (v) {
      this.transaction.value = {
        memo: undefined,
        date: undefined,
        name: undefined
      }
      this.components = []
      this.requestRefreshEvents()
      if (!this.autoSelect) this.selectedTransaction = undefined

      await this.$nextTick()
      if (v) {
        if (!this.autoSelect) this.$refs.chooseTrxSelect.showPopup()
      } else {
        this.$refs.newTrxInput.focus()
      }
    },
    async selectedTransaction (v) {
      this.transaction.value = {
        memo: undefined,
        date: undefined,
        name: undefined
      }
      this.components = []
      this.requestRefreshEvents()
      if (!v) return
      const trx = await this.getTransactionById({ uid: v.value.uid })
      if (trx) {
        this.transaction.value = {
          hash: trx.hash,
          memo: trx.memo,
          date: trx.date,
          name: trx.memo,
          id: trx.id
        }
        this.components = trx.components.map(v => {
          return {
            ...v,
            isLinked: true,
            showEditAccount: false
          }
        })
      }
    }
  },
  async mounted () {
    this.loadUnapprovedTransactions()
    // let account = await this.getAccountByCode({ code: '100100' })
  },
  methods: {
    ...mapActions('transaction', ['getUnapprovedTransactions', 'createTxn', 'updateTxn', 'getTransactionById', 'deteleTxn', 'balanceTxn']),
    ...mapActions('contAccount', ['getAccountByCode']),
    ...mapMutations('general', ['setIsLoading']),
    editAccount (row) {
      // row.accunt
    },
    requestRefreshEvents () {
      this.$emit('requestRefreshEvents')
    },
    checkIsBalancedTransaction () {
      console.log('checkIsBalancedTransaction')
      let isBalanced = true
      let allWithAccount = true
      const listValues = this.optionsCurrencies.map(v => {
        return {
          currency: v,
          value: 0
        }
      })
      if (this.components.length === 0) return false

      this.components.forEach(component => {
        if (component.account && component.currency) {
          if (component.type === 'DEBIT') {
            listValues.find(v => v.currency === component.currency).value += Number.parseFloat(component.quantity)
          } else if (component.type === 'CREDIT') {
            listValues.find(v => v.currency === component.currency).value -= Number.parseFloat(component.quantity)
          }
        } else {
          allWithAccount = false
        }
      })

      listValues.forEach(v => {
        if (v.value !== 0) {
          isBalanced = false
        }
      })

      if (allWithAccount && isBalanced && this.components.length >= 2) {
        this.transactionBalanced = true
      } else {
        this.transactionBalanced = false
      }
    },
    async addEventToTransaction (event) {
      if (this.components.length === 0) {
        this.isSelect = false
        // const defaultName = `${event.from} to ${event.to} (${event.quantity} ${event.currency})`
        await this.$nextTick()
        const defaultName = `${event.memo} - ${event.quantity} ${event.currency}`
        this.transaction.value.name = defaultName

        // date
        let d = new Date()
        let month = d.getUTCMonth() + 1
        let day = d.getUTCDate()
        let date = `${d.getUTCFullYear()}/${(month < 10 ? '0' + month : month)}/${(day < 10 ? '0' + day : day)}`
        this.transaction.value.date = date
      }
      this.components.push({
        ...event,
        showEditAccount: false,
        type: undefined
      })
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
        let d = new Date()
        let month = d.getUTCMonth() + 1
        let day = d.getUTCDate()
        let date = `${d.getUTCFullYear()}/${(month < 10 ? '0' + month : month)}/${(day < 10 ? '0' + day : day)}`
        this.components.push({
          hash: tempHash,
          isCustomComponent: true,
          account: undefined,
          showEditAccount: false,
          from: '',
          to: '',
          type: undefined,
          date
        })
        this.editingRow = tempHash
      }
    },
    onClickSaveRow (row) {
      if (!this.validateRow(row)) {
        this.showErrorMsg(this.$t('forms.errors.allComponentFilled'))
        return
      }
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
      if (row.isFromEvent) {
        // if (this.components.length === 0) this.transaction = JSON.parse(JSON.stringify(this.baseTrx))
        this.$emit('eventRemoved', row)
      }
    },
    validateRow (row) {
      let isValidRow = true
      if (!row.account) {
        isValidRow = false
      } else if (!row.quantity) {
        isValidRow = false
      } else if (!row.currency) {
        isValidRow = false
      } else if (!row.memo) {
        isValidRow = false
      } else if (!row.date) {
        isValidRow = false
      } else if (!row.type) {
        isValidRow = false
      }
      return isValidRow
    },
    async storeTransaction () {
      let fullTrx = JSON.parse(JSON.stringify(transactionPayout))

      let trxHash = ''
      if (this.isSelect) {
        trxHash = this.transaction.value.hash

        fullTrx[0].push({
          label: 'id',
          value: ['int64', this.transaction.value.id]
        })
      }

      fullTrx[0][1].value[1] = `${(this.transaction.value.date).replaceAll('/', '-')}T00:00:00` // Need to have this formmat
      fullTrx[0][2].value[1] = this.transaction.value.name
      fullTrx[0][4].value[1] = this.transaction.value.memo

      for (let comp of this.components) {
        fullTrx.push(await this.formattedComponent(comp))
      }

      try {
        if (!this.isSelect) {
          await this.createTxn({ contentGroups: fullTrx })
          let { name } = this.transaction.value
          await this.cleanTrx(name)
          this.autoSelect = false
        } else {
          await this.updateTxn({ contentGroups: fullTrx, transactionHash: trxHash })
        }
        this.showSuccessMsg('Transaction was saved successfully')
      } catch (e) {
        this.showErrorMsg(e)
      }
      console.log(JSON.stringify(fullTrx, null, 2))
    },
    formattedComponent ({ memo, account, quantity, currency, hash, isCustomComponent, isFromEvent, from, to, type }) {
      let component = JSON.parse(JSON.stringify(componentPayout))

      if (!isCustomComponent && isFromEvent) {
        component.push({
          label: 'event',
          value: ['checksum256', hash]
        })
      }

      component[1].value[1] = memo
      component[2].value[1] = account.hash
      component[3].value[1] = `${quantity} ${currency}`
      component[4].value[1] = from
      component[5].value[1] = to
      component[6].value[1] = type

      return component
    },
    async deleteTransaction () {
      await this.deteleTxn({ transactionHash: this.transaction.value.hash })
      await this.cleanTrx()
    },
    async aproveTransaction () {
      this.balanceTxn({ transactionHash: this.transaction.value.hash })

      this.cleanTrx()
    },
    async cleanTrx (name = undefined) {
      this.setIsLoading(true)
      this.transaction = JSON.parse(JSON.stringify(this.baseTrx))
      this.components = []
      setTimeout(async () => {
        await this.loadUnapprovedTransactions()
        if (name) {
          this.autoSelect = true
          this.isSelect = true
          this.setIsLoading(true)
          let trx = this.unapprovedTransactions.filter(el => el.name === name)
          this.selectedTransaction = {
            value: trx[trx.length - 1],
            label: name
          }
        } else {
          this.selectedTransaction = undefined
        }
        this.setIsLoading(false)
      }, 2100)
    }
  }
}
</script>

<style lang="sass" scoped>
.transaction-input
  min-width: 250px
.t-table
  height: 35vh
.pop-edit
  max-width: 1500px !important
  min-width: 400px !important
.mode-btn
  width: 125px
.label-mode-btn
  font-size: 12px
.short-input
  width: 150px !important
  white-space: nowrap
  text-overflow: ellipsis
  overflow: hidden
.larger-input
  width: 250px
</style>
