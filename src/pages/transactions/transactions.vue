<template lang="pug">
  #main-container
    .row.q-pa-md.q-gutter-md
      .col
        TransactionsList(@update="getSelectedTransaction" @create="create = !create")
      .col
        TransactionsDetails(:transaction="selectedTransaction")
    //- q-btn(color="primary" text-color="white" label="Create transaction" @click="create = !create")
</template>

<script>
import TransactionsList from './components/transaction-list'
import TransactionsDetails from './components/transaction-details'
import CreateTransaction from './components/create-transaction'

export default {
  name: 'home',
  components: {
    TransactionsList,
    TransactionsDetails,
    CreateTransaction
  },
  data () {
    return {
      selectedTransaction: {}
    }
  },
  methods: {
    getSelectedTransaction (selectedTxn) {
      this.selectedTransaction = selectedTxn
    }
  }
}
</script>

<style scoped lang="scss">
</style>
