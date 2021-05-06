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
  },
  async created () {
    // console.log(this.$store)
    try {
      let { data } = await this.$store.$graphQLApi.getNodes()
      console.log(data)
    } catch (error) {
      console.log('error', error)
    }
  }
}
</script>

<style scoped lang="scss">
</style>
