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
          q-tr(:props="props" @click="selectBalancedTxn(props.row.id)" :class="(selectedIndex == props.row.id) ? 'bg-dark-accent': ''").styled-row.cursor-pointer
            q-td(key="date" :props="props") {{ formattedDate(props.row.date) }}
            q-td(key="amount" :props="props") {{ props.row.amount }}
            q-td(key="memo" :props="props") {{ props.row.memo }}
            q-td(key="approved" :props="props")
              q-icon.icon-sized(:color="(props.row.approved) ? 'positive' : 'negative'" :name="(props.row.approved) ? 'check_circle' : 'remove_circle'")
            q-td(key="balanced" :props="props").flex.justify-center
              span(v-show="props.row.balanced").letter-icon.bg-positive.self-center B
              span(v-show="!props.row.balanced").letter-icon.bg-negative.self-center U
      //- End of table
      //- Data table
      q-table.q-mt-xl(
        :columns="columnsUnbalanced"
        :data="unbalancedTransactions"
        :selected.sync="selected"
        v-if="filter === 'Unbalanced transactions'"
      )
        template(v-slot:body="props")
          q-tr(:props="props" @click="selectUnbalancedTxn(props.row.id)" :class="(selectedIndex == props.row.id) ? 'bg-dark-accent': ''").styled-row.cursor-pointer
            q-td(key="date" :props="props") {{ formattedDate(props.row.date) }}
            q-td(key="memo" :props="props") {{ props.row.memo }}
            q-td(key="from" :props="props") {{ props.row.from }}
            q-td(key="to" :props="props") {{ props.row.to }}
            q-td(key="amount" :props="props") {{ props.row.amount }}
            //- q-td(key="currency" :props="props") {{ props.row.currency }}
      //- End of table
      .q-mt-xl.flex.column
        .row.self-center.q-my-md
          q-btn.q-px-xl.btn-md(color="primary" @click="create = !create")
            q-icon(class="icon-sized" name="note_add")
            span New
        .row.self-center.q-my-md
          q-btn.q-px-xl.btn-md(color="primary" @click="balancedTransactions.splice(selectedIndex, 1)" )
            q-icon(class="icon-sized" name="delete")
            span Delete
      q-dialog(v-model="create")
        CreateTransaction(@created="getUnbalancedTransactions()")
</template>

<script>
import { mapActions } from 'vuex'
import CreateTransaction from './create-transaction'

export default {
  name: 'transaction-list',
  components: {
    CreateTransaction
  },
  data () {
    return {
      create: false,
      selected: [],
      filter: 'Balanced transactions',
      selectedIndex: 0,
      options: [
        'Balanced transactions',
        'Unbalanced transactions'
      ],
      balancedTransactions: [],
      unbalancedTransactions: [],
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
          name: 'memo',
          align: 'center',
          label: 'Memo',
          field: 'memo',
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
          name: 'date',
          align: 'center',
          label: 'Date',
          field: 'date',
          sortable: true,
          headerClasses: 'bg-secondary text-white'
        },
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
        }
      ]
    }
  },
  async created () {
    await this.getBalancedTxns()
    await this.getUnbalancedTxns()
    this.selectBalancedTxn(this.selectedIndex)
  },
  methods: {
    ...mapActions('document', ['getTransactions', 'getUnbalancedTransactions']),
    selectBalancedTxn (index) {
      if (this.balancedTransactions.length > 0) {
        this.selectedIndex = index
        this.$emit('update', this.balancedTransactions[index])
      }
    },
    selectUnbalancedTxn (index) {
      this.selectedIndex = index
      let selectedTxn = this.unbalancedTransactions[index]
      selectedTxn.balanced = false
      this.$emit('update', selectedTxn)
    },
    async getBalancedTxns () {
      try {
        let txns = await this.getTransactions()
        this.balancedTransactions = txns
      } catch (error) {
        console.log(error)
      }
    },
    async getUnbalancedTxns () {
      try {
        let unTxns = await this.getUnbalancedTransactions()
        this.unbalancedTransactions = unTxns
      } catch (error) {
        console.log(error)
      }
    },
    formattedDate (date) {
      var options = { year: 'numeric', month: 'long', day: 'numeric' }
      let newDate = new Date(date)

      return newDate.toLocaleString('en-US', options)
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
