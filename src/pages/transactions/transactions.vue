<template lang="pug">
  div.row.q-pa-md.q-gutter-md.main-cont
    div.col
      TransactionsList(@update="getSelectedTransaction")
    div.col
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
/* This value should be calculated with 100vh - height of header */
 .main-cont {
   /* height: 96.5vh; */
   height: calc(100vh - 35px);
   background-color: $grey;
 }
</style>
