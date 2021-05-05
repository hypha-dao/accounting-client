<template lang="pug">
#main-container
  .row.q-pa-md.q-gutter-md
    .col
      q-card.full-h.q-pa-sm
        custom-table-tree
    .col
      q-card.full-h.q-pa-sm
        account-detail
</template>

<script>
import CustomTableTree from '~/pages/accounts/components/custom-table-tree'
import AccountDetail from '~/pages/accounts/read/account-detail'

export default {
  name: 'chartAccounts',
  components: { CustomTableTree, AccountDetail }
}
</script>

<style lang="sass" scoped>
</style>
