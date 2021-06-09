<template lang="pug">
#main-container.main
  #cont1.q-pa-sm
    event-list
  #cont2.q-pa-sm
    transaction-view
    //- TransactionsList
  //- .row
  //-   event-list
</template>

<script>
import EventList from './components/event-list'
import TransactionView from './components/transaction-view'
export default {
  name: 'transaction2',
  components: { EventList, TransactionView }
}
</script>

<style lang="sass" scoped>
.main
  min-height: 94vh
  display: flex
  flex-direction: column
#cont1
  // background: green
  // flex: 1
  // display: flex
  // flex-direction: column
#cont2
  // background: blue
  // flex: 1
  // display: flex
</style>
