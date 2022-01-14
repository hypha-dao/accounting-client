<template lang="pug">
q-card.q-pa-sm.full-width
  .row.border
    #transaction-info.full-width
      .row.q-gutter-md.full-width.items-center.q-mb-md
        .col-2
          .text-h6.q-mr-lg.border {{ $t('pages.transactions.transactions') }}
        .col
            #balanced.row.q-gutter-xs.self-center(v-if="!transactionBalanced")
              .text-secondary.text-bold {{  $t('pages.transactions.unbalanced') }}
              q-icon.q-custom-mar-icon(
                name="app:unbalanced"
                size="sm"
              )
            #unbalanced.row.q-gutter-xs(v-else)
              .text-secondary.text-bold {{ $t('pages.transactions.balanced') }}
              q-icon.q-custom-mar-icon(
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
            q-checkbox(v-model="conversionTransaction" :label="$t('pages.transactions.currency_conversion_transaction')")
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
            q-date(v-model="transaction.value.date" today-btn)
              div(class="row items-center justify-end")
                q-btn(v-close-popup label="Close" color="primary" flat)
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
          q-dialog(v-model="props.row.showEditAccount" position="top")
            q-card.q-pa-md(style="min-width: 800px")
              custom-table-tree(v-model="props.row.account" @account-selected="props.row.showEditAccount = !props.row.showEditAccount")
      template(v-slot:body-cell-from="props")
        q-td.short-input
          q-input.short-input(v-if="(editingRow === props.row.hash && !props.row.isFromEvent) || props.row.isEditable.from" autofocus v-model="props.row.from" dense :label="$t('pages.transactions.from')" color="secondary")
          .text-cell.short-input(v-else) {{ props.row.from }}
      template(v-slot:body-cell-type="props")
        q-td.short-input
          q-select(
            :options="optionTypeComponent"
            v-model="props.row.type"
            dense
          )
        //- q-select(
        //-   :options="optionTypeComponent"
        //-   v-model="props.row.type"
        //-   dense
        //-   @popup-hide="checkIsBalancedTransaction()"
        //- )
      template(v-slot:body-cell-to="props")
        q-td.short-input
          q-input.short-input(v-if="(editingRow === props.row.hash && !props.row.isFromEvent) || props.row.isEditable.to" v-model="props.row.to" dense :label="$t('pages.transactions.to')" color="secondary")
          .text-cell(v-else) {{ props.row.to }}
      template(v-slot:body-cell-amount="props")
        q-td.text-right
          money-input-2(
            v-if="editingRow === props.row.hash && !props.row.isFromEvent"
            v-model="props.row.quantity"
            :label="$t('pages.transactions.amount')"
            color="secondary"
            dense
          )
          .text-cell(v-else) {{ formatAmount(props.row.quantity.value, String(props.row.quantity.value).split('.')[1].length ) }}
      template(v-slot:body-cell-currency="props")
        q-td
          q-select(
            :options="optionsCurrencies"
            v-if="editingRow === props.row.hash && !props.row.isFromEvent" v-model="props.row.currency" dense :label="$t('pages.transactions.currency')" color="secondary"
          )
          .text-cell(v-else) {{ props.row.currency }}
      template(v-slot:body-cell-memo="props")
        q-td.responsive-cell
          q-input.larger-input(v-if="(editingRow === props.row.hash && !props.row.isFromEvent) || props.row.isEditable.memo" v-model="props.row.memo" dense :label="$t('pages.transactions.memo')" color="secondary")
          .text-memo(v-else) {{ props.row.memo }}
            q-tooltip {{ props.row.memo }}
      template(v-slot:body-cell-date="props")
        q-td
          q-input(v-if="editingRow === props.row.hash && !props.row.isFromEvent" v-model="props.row.date" dense :label="$t('pages.transactions.date')" mask="date" color="secondary")
            template(v-slot:append)
              q-icon(name="event" class="cursor-pointer")
                q-popup-proxy(ref="qDateProxy" transition-show="scale" transition-hide="scale")
                  q-date(v-model="props.row.date")
                    div(class="row items-center justify-end")
                      q-btn(v-close-popup label="Close" color="primary" flat)
          .text-cell(v-else) {{ dateToString(props.row.date) }}
      template(v-slot:body-cell-actions="props")
        q-td.q-gutter-xs.text-right
          q-btn(v-if="editingRow !== props.row.hash && !addingComponent && !props.row.isFromEvent" icon="edit" round size="xs" color="positive" @click="onClickEditRow(props.row)")
          q-btn(v-if="editingRow === props.row.hash || props.row.isEditable.from || props.row.isEditable.to || props.row.isEditable.memo" icon="save" round size="xs" color="primary" @click="onClickSaveRow(props.row)")
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
                :disable="!validateBalancesWithDifferentsCurrencies"
                @click="approveConvertion"
                v-if="conversionTransaction && !editingRow"
            )
            q-btn.full-width(
                :label="$t('pages.transactions.approve')"
                dense
                size="md"
                color="primary"
                :disable="!transactionBalanced || (!transaction.value.hash && !transactionBalanced) || editingRow !== false"
                @click="aproveTransaction()"
                v-else
            )
        .col.self-center
            q-btn.full-width(
                :label="$t('pages.transactions.save')"
                dense
                size="md"
                color="secondary"
                @click="transactionConvertion = true"
                :disable="!validateBalancesWithDifferentsCurrencies"
                v-if="conversionTransaction && !editingRow"
            )
            q-btn.full-width(
                v-else
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
  #modals
    currency-transaction-modal(:isEnable="transactionConvertion", @cancel="cancellTransactionConvertion" @confirm="isApproveConvertion  ? approveTransactionWithCurrencyConvertion() : storeTransactionWithCurrencyConvertion()" :components="components")
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import { transactionPayout } from '~/const/payouts/transaction-payout'
import { componentPayout } from '~/const/payouts/component-payout'
import CustomTableTree from '~/pages/accounts/components/custom-table-tree'
import CurrencyTransactionModal from './currency-transaction-modal'
import MoneyInput from '~/components/inputs/money-input'
import MoneyInput2 from '~/components/inputs/money-input-2'

export default {
  name: 'transaction-view',
  components: { CustomTableTree, CurrencyTransactionModal, MoneyInput, MoneyInput2 },
  data () {
    return {
      autoSelect: false,
      // transactionBalanced: false,
      transactionConvertion: false,
      conversionTransaction: false,
      isApproveConvertion: false,
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
      if (this.editingRow) ready = false
      return ready
    },
    transactionBalanced () {
      let currencies = this.optionsCurrencies.map(val => {
        return {
          currency: val,
          balanced: false
        }
      })

      currencies.forEach(curr => {
        const compsOfCurr = this.components.filter(comp => comp.currency === curr.currency) // Filters all components of the current currency

        var balance = compsOfCurr.reduce((accumulated, current) => {
          // eslint-disable-next-line no-return-assign
          if (current.type === 'DEBIT') return accumulated += parseFloat(current.quantity.value)
          // eslint-disable-next-line no-return-assign
          if (current.type === 'CREDIT') return accumulated -= parseFloat(current.quantity.value)
        }, 0) // Sums all components of the current currency

        curr.balanced = balance === 0 // Is balanced if balance is 0
        console.log('is balanced', curr.balanced)
      })

      const everyCompWithAccount = this.components.every(com => com.account && com.currency && com.type)
      const everyCurrencyBalanced = currencies.every(curr => curr.balanced)
      const moreThanOneComponent = this.components.length > 0

      if (this.validateBalancesWithDifferentsCurrencies) return true

      return moreThanOneComponent && everyCurrencyBalanced && everyCompWithAccount
    },
    componentHasDifferentCurrencies () {
      const currencies = this.components.filter(c => c.currency).map(c => c.currency)
      const onlyCurrency = new Set(currencies)
      return onlyCurrency.size > 1
    },
    componentAreDifferentTypeTransaction () {
      if (!this.componentHasDifferentCurrencies) return false
      let currencyByType = {}
      this.components.forEach(component => {
        if (!currencyByType[component.currency]) currencyByType[component.currency] = { debit: 0, credit: 0 }
        if (component.type === 'DEBIT') currencyByType[component.currency].debit++
        if (component.type === 'CREDIT') currencyByType[component.currency].credit++
      })

      let debit = 0
      let credit = 0
      Object.values(currencyByType).forEach(type => {
        debit += type.debit
        credit += type.credit
      })

      return debit === credit
    },
    validateBalancesWithDifferentsCurrencies () {
      return this.componentHasDifferentCurrencies && this.componentAreDifferentTypeTransaction && this.conversionTransaction
    }
  },
  watch: {
    // components (v) {
    //   this.checkIsBalancedTransaction()
    // },
    // editingRow (v) {
    //   this.checkIsBalancedTransaction()
    // },
    // addingComponent (v) {
    //   this.checkIsBalancedTransaction()
    // },
    async isSelect (v) {
      this.transaction.value = {
        memo: undefined,
        date: undefined,
        name: undefined
      }

      // Returns components to events
      const returnComps = [...this.components]

      for (const comp of returnComps) {
        if (!comp.isLinked) {
          if (comp.isEditable) {
            if (comp.isEditable.memo) delete comp.memo
            if (comp.isEditable.from) delete comp.from
            if (comp.isEditable.to) delete comp.to
          }

          this.onClickRemoveRow(comp)
        }
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
      this.addingComponent = false
      this.editingRow = false
      this.transaction.value = {
        memo: undefined,
        date: undefined,
        name: undefined
      }
      this.components = []
      this.requestRefreshEvents()
      if (!v) return
      this.conversionTransaction = Boolean(v.value.isCurrencyConversion)
      const trx = await this.getTransactionById({ uid: v.value.uid })
      console.log(trx)

      if (trx) {
        this.transaction.value = {
          hash: trx.hash,
          memo: trx.memo,
          date: trx.date,
          name: trx.name,
          id: trx.id,
          type: trx.type
        }

        this.components = trx.components.map(v => {
          const hash = (v.hash === '' || !v.hash) ? [...Array(8)].map(() => Math.floor(Math.random() * 16).toString(16)).join('') : v.hash
          const quantity = { value: parseFloat(v.quantity), display: parseFloat(v.quantity) }
          return {
            ...v,
            quantity,
            hash,
            isEditable: {
              memo: false,
              from: false,
              to: false
            },
            isLinked: true,
            showEditAccount: false
          }
        })
      }
    }
  },
  async mounted () {
    this.loadUnapprovedTransactions()
    this.loadTokens()
  },
  methods: {
    ...mapActions('transaction', ['getUnapprovedTransactions', 'createTxn', 'updateTxn', 'getTransactionById', 'deteleTxn', 'balanceTxn', 'balanceCurrencyConversion', 'createCurrencyConvertion', 'updateCurrencyConversion']),
    ...mapActions('contAccount', ['getAccountByCode']),
    ...mapActions('tokens', ['getTokens']),
    ...mapMutations('general', ['setIsLoading']),
    editAccount (row) {
    },
    requestRefreshEvents () {
      this.$emit('requestRefreshEvents')
    },
    checkIsBalancedTransaction () {
      let isBalanced = true
      let allWithAccount = true
      const listValues = this.optionsCurrencies.map(v => {
        return {
          currency: v,
          value: 0
        }
      })
      if (this.components.length === 0) return false

      allWithAccount = this.components.every(com => com.account && com.currency && com.type)

      this.components.forEach(v => {
        // debugger
        // if (v.currency && v.amount) {
        if (v.type === 'DEBIT') {
          listValues.find(lv => v.currency === lv.currency).value += Number.parseFloat(v.quantity)
        } else if (v.type === 'CREDIT') {
          listValues.find(lv => v.currency === lv.currency).value -= Number.parseFloat(v.quantity)
        }
        // }
      })

      listValues.forEach(v => {
        if (v.value !== 0) {
          isBalanced = false
        }
      })

      console.log('all with account', allWithAccount, 'is balanced', isBalanced, this.components.length)

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
        const transactionName = this.transaction.value.name
        this.transaction.value.name = transactionName ? `${transactionName} - ${defaultName}` : defaultName

        // date
        let d = new Date(event.date)
        let month = d.getUTCMonth() + 1
        let day = d.getUTCDate()
        let date = `${d.getUTCFullYear()}/${(month < 10 ? '0' + month : month)}/${(day < 10 ? '0' + day : day)}`
        this.transaction.value.date = date
      }

      let isEditable = {
        memo: !event.memo,
        from: !event.from,
        to: !event.to
      }

      const quantity = { value: parseFloat(event.quantity), display: parseFloat(event.quantity) }
      this.components.push({
        ...event,
        quantity,
        isEditable,
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
      console.log(this.editingRow)
    },
    onClickAddRow () {
      if (!this.addingComponent) {
        this.addingComponent = true
        const tempHash = [...Array(8)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')
        let date = this.transaction.value.date
        if (!date) {
          let d = new Date()
          let month = d.getUTCMonth() + 1
          let day = d.getUTCDate()
          date = `${d.getUTCFullYear()}/${(month < 10 ? '0' + month : month)}/${(day < 10 ? '0' + day : day)}`
        }
        this.components.push({
          hash: tempHash,
          isCustomComponent: true,
          account: undefined,
          showEditAccount: false,
          from: '',
          to: '',
          type: undefined,
          date,
          memo: undefined
        })
        this.editingRow = tempHash
      }
    },
    onClickSaveRow (row) {
      console.log(row)
      if (!this.validateRow(row)) {
        this.showErrorMsg(this.$t('forms.errors.allComponentFilled'))
        return
      }
      row.isEditable = {}
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
        this.$emit('eventRemoved', { ...row, quantity: row.quantity.value })
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

      fullTrx[0].find(el => el.label === 'trx_date').value[1] = `${(this.transaction.value.date).replaceAll('/', '-')}T00:00:00` // Need to have this formmat
      fullTrx[0].find(el => el.label === 'trx_name').value[1] = this.transaction.value.name
      fullTrx[0].find(el => el.label === 'trx_memo').value[1] = this.transaction.value.memo || ''

      console.log(this.components, 'Components')
      for (let comp of this.components) {
        fullTrx.push(await this.formattedComponent(comp))
      }

      // console.log(JSON.stringify(fullTrx, null, 2))

      try {
        let { name } = this.transaction.value
        let response
        console.log('trxUpsert', this.isSelect, fullTrx)
        if (!this.isSelect) {
          response = await this.createTxn({ contentGroups: fullTrx })
        } else {
          response = await this.updateTxn({ contentGroups: fullTrx, transactionHash: trxHash })
        }
        if (response) {
          await this.cleanTrx(name)
          this.showSuccessMsg(this.$t('pages.transactions.saved'))
        }
      } catch (e) {
        this.showErrorMsg(e)
      }
      if (this.transactionConvertion) this.transactionConvertion = false
    },
    formattedComponent ({ memo, account, quantity, currency, hash, isCustomComponent, isFromEvent, from, to, type, date }) {
      let component = JSON.parse(JSON.stringify(componentPayout))

      if (!isCustomComponent && isFromEvent) {
        component.push({
          label: 'event',
          value: ['checksum256', hash]
        })
      }

      component[1].value[1] = memo ?? ''
      component[2].value[1] = account.hash
      component[3].value[1] = `${quantity.value} ${currency}`
      // component[3].value[1] = (currency === 'BTC') ? `${parseInt(quantity).toFixed(1)} ${currency}` : `${quantity} ${currency}`
      component[4].value[1] = from
      component[5].value[1] = to
      component[6].value[1] = type
      component[7].value[1] = date.includes('/') ? `${(date).replaceAll('/', '-')}T00:00:00` : date.split('.')[0]

      return component
    },
    async deleteTransaction () {
      const res = await this.deteleTxn({ transactionHash: this.transaction.value.hash })

      if (res) this.showSuccessMsg(this.$t('pages.transactions.deleted'))
      await this.cleanTrx()
    },
    async aproveTransaction () {
      try {
        let fullTrx = JSON.parse(JSON.stringify(transactionPayout))
        fullTrx[0].find(el => el.label === 'trx_date').value[1] = `${(this.transaction.value.date).replaceAll('/', '-')}T00:00:00` // Need to have this formmat
        fullTrx[0].find(el => el.label === 'trx_name').value[1] = this.transaction.value.name
        fullTrx[0].find(el => el.label === 'trx_memo').value[1] = this.transaction.value.memo || ''

        for (let comp of this.components) {
          fullTrx.push(await this.formattedComponent(comp))
        }
        console.log('Update Trx', fullTrx)
        const res = await this.balanceTxn({ transactionHash: this.transaction.value.hash, contentGroups: fullTrx })
        console.log('Update Trx res', res)

        if (res) {
          this.showSuccessMsg(this.$t('pages.transactions.approved'))
          this.cleanTrx()
        }
        if (this.isApproveConvertion) this.isApproveConvertion = false
      } catch (e) {
        console.error(e)
      }
    },
    async approveTransactionWithCurrencyConvertion () {
      try {
        let fullTrx = JSON.parse(JSON.stringify(transactionPayout))
        fullTrx[0].find(el => el.label === 'trx_date').value[1] = `${(this.transaction.value.date).replaceAll('/', '-')}T00:00:00` // Need to have this formmat
        fullTrx[0].find(el => el.label === 'trx_name').value[1] = this.transaction.value.name
        fullTrx[0].find(el => el.label === 'trx_memo').value[1] = this.transaction.value.memo || ''

        for (let comp of this.components) {
          fullTrx.push(await this.formattedComponent(comp))
        }
        console.log('Update Trx', fullTrx)
        const res = await this.balanceCurrencyConversion({ transactionHash: this.transaction.value.hash, contentGroups: fullTrx })
        console.log('Update Trx res', res)

        if (res) {
          this.showSuccessMsg(this.$t('pages.transactions.approved'))
          this.cleanTrx()
        }
        this.transactionConvertion = false
        this.conversionTransaction = false
      } catch (e) {
        console.error(e)
      }
    },
    async storeTransactionWithCurrencyConvertion () {
      let fullTrx = JSON.parse(JSON.stringify(transactionPayout))

      let trxHash = ''
      if (this.isSelect) {
        trxHash = this.transaction.value.hash

        fullTrx[0].push({
          label: 'id',
          value: ['int64', this.transaction.value.id]
        })
      }

      fullTrx[0].find(el => el.label === 'trx_date').value[1] = `${(this.transaction.value.date).replaceAll('/', '-')}T00:00:00` // Need to have this formmat
      fullTrx[0].find(el => el.label === 'trx_name').value[1] = this.transaction.value.name
      fullTrx[0].find(el => el.label === 'trx_memo').value[1] = this.transaction.value.memo || ''

      console.log(this.components, 'Components')
      for (let comp of this.components) {
        fullTrx.push(await this.formattedComponent(comp))
      }

      // console.log(JSON.stringify(fullTrx, null, 2))

      try {
        let { name } = this.transaction.value
        let response
        console.log('trxUpsert', this.isSelect, fullTrx)
        if (!this.isSelect) {
          response = await this.createCurrencyConvertion({ contentGroups: fullTrx })
        } else {
          response = await this.updateCurrencyConversion({ contentGroups: fullTrx, transactionHash: trxHash })
        }
        if (response) {
          await this.cleanTrx(name)
          this.showSuccessMsg(this.$t('pages.transactions.saved'))
        }
        this.transactionConvertion = false
        this.conversionTransaction = false
      } catch (e) {
        this.showErrorMsg(e)
      }
    },
    async cleanTrx (name = undefined) {
      this.setIsLoading(true)
      this.transaction = JSON.parse(JSON.stringify(this.baseTrx))
      this.components = []
      setTimeout(async () => {
        await this.loadUnapprovedTransactions()
        if (name) {
          this.isSelect = true
          this.setIsLoading(true)
          let trx = this.unapprovedTransactions.filter(el => el.name === name)
          this.selectedTransaction = {
            value: trx[trx.length - 1],
            label: name
          }
          this.autoSelect = false
        } else {
          this.selectedTransaction = undefined
        }
        this.setIsLoading(false)
      }, 2100)
    },
    async loadTokens () {
      const tokens = await this.getTokens()
      this.optionsCurrencies = tokens.map(token => token.symbol)
    },
    approveConvertion () {
      this.isApproveConvertion = true
      this.transactionConvertion = true
    },
    cancellTransactionConvertion () {
      this.isApproveConvertion = false
      this.transactionConvertion = false
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
.q-custom-mar
  margin-top: 30px
.q-custom-mar-icon
  // margin-top: 10%
</style>
