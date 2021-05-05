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
// import { mapActions } from 'vuex'

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
/*   methods: {
    ...mapActions('exRate', ['getExRates']),
    getSelectedTransaction (newValue) {
      this.selectedTransaction = newValue
    },
    async getData () {
      try {
        let response = await this.getExRates()
        console.log(response)
      } catch (error) {
        console.log(error)
      }
    }
  },
  created () {
    this.getData()
  } */
}
</script>

<style scoped lang="scss">
</style>
