<template lang="pug">
#main-container.main.q-pa-sm
  .row.q-my-sm.justify-end
      q-btn(
        :label="this.$t('pages.coa.addAccount')"
        color="primary"
        @click="modals.addingAccount = true"
      )
  q-table.sticky-virtscroll-table.t-table(
      :columns="columns"
      :data="coa"
      virtual-scroll
      :rows-per-page-options="[0]"
      :virtual-scroll-item-size="pageSize - 2"
      :virtual-scroll-sticky-size-start="pageSize - 2"
      dense
      ref="table"
  )
  #modals
    q-dialog(
      v-model="modals.addingAccount"
    )
      q-card.responsive-modal
        add-account-form
</template>

<script>
import AddAccountForm from './addAccountForm.vue'
import { mapActions } from 'vuex'

export default {
  name: 'chartOfAccounts',
  components: { AddAccountForm },
  data () {
    return {
      pageSize: 200,
      nextPage: 2,
      coa: [],
      columns: [
        {
          name: 'accountCode',
          align: 'center',
          label: this.$t('pages.coa.accountCode'),
          field: row => `${row.accountCode}`,
          sortable: true,
          headerClasses: 'bg-secondary text-white'
        },
        {
          name: 'parent',
          align: 'left',
          label: this.$t('pages.coa.parent'),
          field: row => row.parent,
          sortable: true,
          headerClasses: 'bg-secondary text-white'
        },
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
          align: 'right',
          label: this.$t('pages.coa.balance'),
          field: row => `${row.balance}`,
          sortable: true,
          headerClasses: 'bg-secondary text-white'
        },
        {
          name: 'actions',
          align: 'center',
          label: this.$t('pages.coa.actions'),
          field: row => row.action,
          sortable: true,
          headerClasses: 'bg-secondary text-white'
        }
      ],
      modals: {
        addingAccount: false
      }
    }
  },
  methods: {
    ...mapActions('contAccount', ['getAllAccounts', 'getAccountById', 'getAccountByCode']),
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
</style>
