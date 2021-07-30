<template lang="pug">
 #container.q-pa-md.q-gutter-sm
    .text-title1 {{$t('pages.coa.addAccount')}}
    q-btn(
        :label="$t('pages.coa.chooseParent')"
        @click="modals.showAllAccounts = true"
    )
    p {{ labelParentAccount }}
    q-dialog(v-model="modals.showAllAccounts" position="top")
        q-card.q-pa-md(style="min-width: 800px")
            custom-table-tree(v-model="params.parentAccount")
    q-input(
        v-model="params.accountName"
        :label="$t('pages.coa.accountName')"
    )
    q-input(
        v-model="params.accountCode"
        :label="$t('pages.coa.accountCode')"
    )
    q-btn(
        :label="$t('pages.coa.saveAccount')"
    )
</template>

<script>
import CustomTableTree from '~/pages/accounts/components/custom-table-tree'
export default {
  name: 'add-account-form',
  components: { CustomTableTree },
  data () {
    return {
      params: {
        parentAccount: undefined,
        accountName: undefined,
        accountCode: undefined
      },
      modals: {
        showAllAccounts: false
      }
    }
  },
  computed: {
    labelParentAccount () {
      return this.params.parentAccount ? this.params.parentAccount.accountName : 'You must choose a parent account'
    }
  }
}
</script>

<style lang="sass" scoped>

</style>
