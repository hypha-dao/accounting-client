<template lang="pug">
#main-container.main.q-pa-sm
  q-card.q-pa-sm.full-width
    #container.q-pa-sm
      .flex.justify-end.q-mb-sm
        q-btn(outline size="sm" label="Convert to HUSD" color="secondary" @click="onSelectedConvert")
      //- q-table.sticky-virtscroll-table.accountTable.t-table(
      //-     :columns="columns"
      //-     :data="coa"
      //-     virtual-scroll
      //-     :rows-per-page-options="[0]"
      //-     :virtual-scroll-item-size="pageSize - 2"
      //-     :virtual-scroll-sticky-size-start="pageSize - 2"
      //-     dense
      //-     ref="table"
      //-     :filter="search"
      //- )
      //-   template(v-slot:top-right)
      //-     q-input(
      //-       v-model="search"
      //-       label="Search"
      //-     )
      //-       template(v-slot:append)
      //-         q-icon(name="search")
      //-   template(v-slot:body-cell-balance="props")
      //-     q-td(:props="props")
      //-       .row.q-gutter-sm
      //-         div(v-for="b in props.row.balance")
      //-           .balanceLabel {{b}}
      //-   template(v-slot:body-cell-actions="props")
      //-     q-td(:props="props")
      //-       q-btn(icon="edit" round size="xs" color="positive" @click="onClickEditAccount(props.row)")
      coa-table-tree(@onClickEditAccount="v => onClickEditAccount(v)" @selectedAccount="onSelectedAccount" :exchanges="exchanges")
      #transaction-components
        //- p {{ selectedDetailsAccount }}
        //- p {{ detailsAccountSelected }}
        components-table(:components="detailsAccountSelected")
      .row.q-my-sm.justify-start
          q-btn(
            :label="this.$t('pages.coa.addAccount')"
            color="primary"
            @click="onClickAddAccount"
          )
      #modals
        q-dialog(
          v-model="modals.openedAccountForm"
        )
          q-card.responsive-modal
            add-account-form(:account="selectedAccount" @success="onSuccessAdded")
        q-dialog(
          v-model="modals.openCurrenciesSelector"
        )
          q-card.responsive-modal
            currencies-selector(@convert="convertValues")
</template>

<script>
import AddAccountForm from './addAccountForm.vue'
import CoaTableTree from './components/COATableTree'
import CurrenciesSelector from './components/currenciesSelectors'
import ComponentsTable from './components/componentsTable'

import { mapActions } from 'vuex'

export default {
  name: 'chartOfAccounts',
  components: { AddAccountForm, CoaTableTree, CurrenciesSelector, ComponentsTable },
  data () {
    return {
      pageSize: 200,
      nextPage: 2,
      coa: [],
      search: undefined,
      selectedAccount: undefined,
      selectedDetailsAccount: undefined,
      detailsAccountSelected: undefined,
      columns: [
        {
          name: 'accountCode',
          align: 'center',
          label: this.$t('pages.coa.accountCode'),
          field: row => `${row.accountCode}`,
          sortable: true,
          headerClasses: 'bg-secondary text-white'
        },
        // {
        //   name: 'parent',
        //   align: 'left',
        //   label: this.$t('pages.coa.parent'),
        //   field: row => row.parent,
        //   sortable: true,
        //   headerClasses: 'bg-secondary text-white'
        // },
        {
          name: 'accountName',
          align: 'left',
          label: this.$t('pages.coa.accountName'),
          field: row => row.accountName,
          sortable: true,
          headerClasses: 'bg-secondary text-white'
        },
        {
          name: 'balance',
          align: 'center',
          label: this.$t('pages.coa.balance'),
          field: row => row.balance,
          // sortable: true,
          headerClasses: 'bg-secondary text-white'
        },
        {
          name: 'actions',
          align: 'center',
          label: this.$t('pages.coa.actions'),
          field: row => row.action,
          // sortable: true,
          headerClasses: 'bg-secondary text-white'
        }
      ],
      modals: {
        openedAccountForm: false,
        openCurrenciesSelector: false
      },
      exchanges: undefined
    }
  },
  methods: {
    ...mapActions('contAccount', ['getAllAccounts', 'getAccountById', 'getAccountByCode']),
    ...mapActions('transaction', ['getTransactionById', 'getComponentsByAccountId']),
    async onSelectedAccount (account) {
      this.selectedDetailsAccount = account
      this.detailsAccountSelected = await this.getComponentsByAccountId({ uid: this.selectedDetailsAccount.uid })
    },
    async getAccounts () {
      let accs = await this.getAllAccounts({ first: 10, offset: 0 })
      // console.log(accs)
      this.coa = accs.rows
      // accs = accs.map((acc, i) => {
      //   const contents = acc.content_groups[0].contents
      //   return {
      //     parentAccount: '000000',
      //     accountName: contents.find(el => el.label === 'account_name').value,
      //     accountCode: contents.find(el => el.label === 'account_code').value
      //   }
      // })
      // console.log(accs)
    },
    onClickEditAccount (account) {
      console.log('onClickEditAccount', account)
      this.selectedAccount = account
      this.modals.openedAccountForm = true
    },
    onClickAddAccount () {
      this.selectedAccount = undefined
      this.modals.openedAccountForm = true
    },
    onSuccessAdded () {
      this.selectedAccount = undefined
      this.modals.openedAccountForm = false
      setTimeout(() => {
        this.getAccounts()
      }, 2000)
    },
    onSelectedConvert () {
      this.modals.openCurrenciesSelector = true
    },
    convertValues (currencies) {
      this.modals.openCurrenciesSelector = false
      this.exchanges = currencies
    }
  },
  created () {
    this.getAccounts()
  }
}
</script>

<style lang="sass" scoped>
.main
  min-height: 94vh
  display: flex
  flex-direction: column
.accountTable
  height: 70vh
.balanceLabel
  background: #e2f1f8
  min-width: 70px
  border-radius: 3px
  padding: 3px
  padding-left: 10px
  padding-right: 10px
</style>
