<template lang="pug">
  q-card( flat ).full-h
    q-card-section
      .text-h6
        | Transactions
      .row.justify-between.q-gutter-md.q-my-lg
        .col-5.rounded-field
          q-select(v-model="filter" outlined :options="options" label='Filter by account')
        .col-5
          q-input(outlined label='Search' type="search" )
            template(v-slot:append)
              q-icon(name="search")
      //- Data table
      q-table.q-mt-xl(
        :columns="columnsBalanced"
        :data="balancedTransactions"
        :selected.sync="selected"
        v-if="filter === 'Balanced transactions'"
      )
        template(v-slot:body="props")
          q-tr(:props="props" @click="selectTransaction(props.row.id)" :class="(selectedIndex == props.row.id) ? 'bg-dark-accent': ''").styled-row.cursor-pointer
            q-td(key="date" :props="props") {{ formattedDate(props.row.date) }}
            q-td(key="amount" :props="props") {{ props.row.amount }}
            q-td(key="transaction" :props="props") {{ props.row.transaction }}
            q-td(key="approved" :props="props")
              q-icon.icon-sized(:color="(props.row.approved) ? 'positive' : 'negative'" :name="(props.row.approved) ? 'check_circle' : 'remove_circle'")
            q-td(key="balanced" :props="props")
              span(v-show="props.row.balanced").letter-icon.bg-positive B
              span(v-show="!props.row.balanced").letter-icon.bg-negative U
      //- End of table
      //- Data table
      q-table.q-mt-xl(
        :columns="columnsUnbalanced"
        :data="unbalancedTransactions"
        :selected.sync="selected"
        v-if="filter === 'Unbalanced transactions'"
      )
        template(v-slot:body="props")
          q-tr(:props="props" @click="selectTransaction(props.row.id)" :class="(selectedIndex == props.row.id) ? 'bg-dark-accent': ''").styled-row.cursor-pointer
            q-td(key="memo" :props="props") {{ props.row.memo }}
            q-td(key="from" :props="props") {{ props.row.from }}
            q-td(key="to" :props="props") {{ props.row.to }}
            q-td(key="amount" :props="props") {{ props.row.amount }}
            q-td(key="currency" :props="props") {{ props.row.currency }}
      //- End of table
      .q-mt-xl.flex.column
        .row.self-center.q-my-md
          q-btn.q-px-xl.btn-md(color="primary" @click="createTxn()")
            q-icon(class="icon-sized" name="note_add")
            span New
        .row.self-center.q-my-md
          q-btn.q-px-xl.btn-md(color="primary" @click="balancedTransactions.splice(selectedIndex, 1)" )
            q-icon(class="icon-sized" name="delete")
            span Delete
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'transaction-list',
  data () {
    return {
      selected: [],
      filter: 'Balanced transactions',
      selectedIndex: 0,
      options: [
        'Balanced transactions',
        'Unbalanced transactions'
      ],
      balancedTransactions: [{
        date: '2022/04/16',
        amount: '200.0',
        transaction: 'New trans',
        approved: true,
        balanced: true
      }],
      unbalancedTransactions: [{
        from: 'our-account',
        to: 'foreing-account',
        amount: '0.02',
        currency: 'BTC',
        memo: 'Getting BTC'
      }],
      columnsBalanced: [
        {
          name: 'date',
          align: 'center',
          label: 'Date',
          field: 'date',
          sortable: true,
          headerClasses: 'bg-secondary text-white'
        },
        {
          name: 'amount',
          align: 'center',
          label: 'Amount',
          field: 'amount',
          sortable: true,
          headerClasses: 'bg-secondary text-white'
        },
        {
          name: 'transaction',
          align: 'center',
          label: 'Transaction',
          field: 'transaction',
          sortable: true,
          headerClasses: 'bg-secondary text-white'
        },
        {
          name: 'approved',
          align: 'center',
          label: 'Approved',
          field: 'approved',
          sortable: true,
          headerClasses: 'bg-secondary text-white'
        },
        {
          name: 'balanced',
          align: 'center',
          label: 'Balanced',
          field: 'balanced',
          sortable: true,
          headerClasses: 'bg-secondary text-white'
        }
      ],
      columnsUnbalanced: [
        {
          name: 'memo',
          align: 'center',
          label: 'Memo',
          field: 'memo',
          sortable: true,
          headerClasses: 'bg-secondary text-white'
        },
        {
          name: 'from',
          align: 'center',
          label: 'From',
          field: 'from',
          sortable: true,
          headerClasses: 'bg-secondary text-white'
        },
        {
          name: 'to',
          align: 'center',
          label: 'To',
          field: 'to',
          sortable: true,
          headerClasses: 'bg-secondary text-white'
        },
        {
          name: 'amount',
          align: 'center',
          label: 'Amount',
          field: 'amount',
          sortable: true,
          headerClasses: 'bg-secondary text-white'
        },
        {
          name: 'currency',
          align: 'center',
          label: 'Currency',
          field: 'currency',
          sortable: true,
          headerClasses: 'bg-secondary text-white'
        }
      ]
    }
  },
  async created () {
    // await this.getBalancedTxns()
    // await this.getUnbalancedTxns()
    this.selectTransaction(this.selectedIndex)
  },
  methods: {
    ...mapActions('document', ['getTransactions', 'getUnbalancedTransactions']),
    selectTransaction (index) {
      console.log('updated')
      this.selectedIndex = index
      this.$emit('update', this.balancedTransactions[index])
    },
    async getBalancedTxns () {
      try {
        let trns = await this.getTransactions()
        console.log('trns', trns)
        this.balancedTransactions = trns
      } catch (error) {
        console.log(error)
      }
    },
    async getUnbalancedTxns () {
      try {
        let trns = await this.getUnbalancedTransactions()
        console.log('untrns', trns)
        this.unbalancedTransactions = trns
      } catch (error) {
        console.log(error)
      }
    },
    formattedDate (date) {
      var options = { year: 'numeric', month: 'long', day: 'numeric' }
      let newDate = new Date(date)

      return newDate.toLocaleString('en-US', options)
    },
    createTxn () {
      this.$emit('create')
    }
  }
}
</script>

<style scoped lang="scss">

.btn-md {
  size: 35px;
  width: 210px;
}

.bg-dark-accent {
  background-color: $accentDark !important;
}

.styled-row:nth-of-type(even) {
    background-color: $accent;
}

.icon-sized {
  font-size: 1.5rem;
}

.letter-icon {
  width: 20px;
  height: 20px;
  font-weight: bold;
  border-radius: 50%;
  text-align: center;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
