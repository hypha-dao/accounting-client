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

export default {
  name: 'chartOfAccounts',
  components: { AddAccountForm },
  data () {
    return {
      pageSize: 20,
      nextPage: 2,
      coa: [],
      columns: [
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
          name: 'accountCode',
          align: 'right',
          label: this.$t('pages.coa.accountCode'),
          field: row => `${row.accountCode}`,
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
  }
}
</script>

<style lang="sass" scoped>
.main
  min-height: 94vh
  display: flex
  flex-direction: column
</style>
