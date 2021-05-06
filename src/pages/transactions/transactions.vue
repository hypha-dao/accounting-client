<template lang="pug">
  #main-container
    .row.q-pa-md.q-gutter-md
      .col
        TransactionsList(@update="getSelectedTransaction")
      .col
        TransactionsDetails(:transaction="selectedTransaction")
</template>

<script>
import TransactionsList from './components/transaction-list'
import TransactionsDetails from './components/transaction-details'

export default {
  name: 'home',
  components: {
    TransactionsList,
    TransactionsDetails
  },
  data () {
    return {
      selectedTransaction: {}
    }
  },
  methods: {
    getSelectedTransaction (newValue) {
      this.selectedTransaction = newValue
    }
  }
}
</script>

<style scoped lang="scss">
</style>
