<template lang="pug">
  q-card( flat ).full-h
    q-card-section
      .text-h6
        | Transactions
      .row.justify-between.q-gutter-md.q-my-lg
        .col-5.rounded-field
          q-select(v-model="filter" outlined :options="options" label='Filter by account' @input="selectFirstOfArray()")
        .col-5
          q-input(outlined label='Search' type="search" )
            template(v-slot:append)
              q-icon(name="search")
      //- Data table
      q-table.q-mt-xl(
        :columns="columns"
        :data="transactions"
        :selected.sync="selected"
      )
        template(v-slot:body="props")
          q-tr(:props="props" @click="selectTxn(props.row.id)" :class="(selectedIndex == props.row.id) ? 'bg-dark-accent': ''").styled-row.cursor-pointer
            q-td(key="date" :props="props") {{ formattedDate(props.row.date) }}
            q-td(key="amount" :props="props") {{ props.row.amount }}
            q-td(key="memo" :props="props") {{ props.row.memo }}
            q-td(key="approved" :props="props")
              q-icon(:name="props.row.approved ? 'check' : 'remove_circle'" size="25px")
            q-td(key="balanced" :props="props").flex.justify-center {{ props.row.balanced }}
      //- End of table

      //- Data table
      //- q-table.q-mt-xl(
      //-   :columns="columnsUnbalanced"
      //-   :data="unbalancedTransactions"
      //-   :selected.sync="selected"
      //-   v-if="filter === 'Unbalanced transactions'"
      //- )
      //-   template(v-slot:body="props")
      //-     q-tr(:props="props" @click="selectUnbalancedTxn(props.row.id)" :class="(selectedIndex == props.row.id) ? 'bg-dark-accent': ''").styled-row.cursor-pointer
      //-       q-td(key="date" :props="props") {{ formattedDate(props.row.date) }}
      //-       q-td(key="amount" :props="props") {{ props.row.amount }}
      //-       q-td(key="memo" :props="props") {{ props.row.memo }}
      //-       q-td(key="from" :props="props") {{ props.row.from }}
      //-       q-td(key="to" :props="props") {{ props.row.to }}
      //- End of table
      .q-mt-xl.flex.column
        .row.self-center.q-my-md
          q-btn.q-px-xl.btn-md(color="primary" @click="create = !create")
            q-icon(class="icon-sized" name="note_add")
            span New
        .row.self-center.q-my-md
          q-btn.q-px-xl.btn-md(color="primary" @click="transactions.splice(selectedIndex, 1)" )
            q-icon(class="icon-sized" name="delete")
            span Delete
      q-dialog(v-model="create")
        CreateTransaction(@created="getTransactions()")
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
      transactions: [],
      columns: [
        {
          name: 'date',
          align: 'center',
          label: 'Date',
          field: row => row.date,
          sortable: true,
          headerClasses: 'bg-secondary text-white'
        },
        // {
        //   name: 'amount',
        //   align: 'center',
        //   label: 'Amount',
        //   field: row => row.currency + ' ' + row.quantity,
        //   sortable: true,
        //   headerClasses: 'bg-secondary text-white'
        // },
        {
          name: 'memo',
          align: 'center',
          label: 'Memo',
          field: row => row.memo,
          sortable: true,
          headerClasses: 'bg-secondary text-white'
        },
        {
          name: 'approved',
          align: 'center',
          label: 'Approved',
          field: row => row.approved,
          sortable: true,
          headerClasses: 'bg-secondary text-white'
        }
        // {
        //   name: 'from',
        //   align: 'center',
        //   label: 'From',
        //   field: row => row.from,
        //   sortable: true,
        //   headerClasses: 'bg-secondary text-white'
        // },
        // {
        //   name: 'to',
        //   align: 'center',
        //   label: 'To',
        //   field: row => row.to,
        //   sortable: true,
        //   headerClasses: 'bg-secondary text-white'
        // }
      ]
    }
  },
  async created () {
    await this.getTxns()
    // await this.getBalancedTxns()
    // await this.getUnbalancedTxns()
    this.selectTxn(this.selectedIndex)
  },
  methods: {
    ...mapActions('transaction', ['getTransactions', 'getEvents', 'getTransactionById']),
    ...mapActions('event', ['getEvents']),
    selectTxn (index) {
      if (this.transactions.length > 0) {
        this.selectedIndex = index
        this.$emit('update', this.transactions[index])
      }
    },
    // selectUnbalancedTxn (index) {
    //   this.selectedIndex = index
    //   let selectedTxn = this.unbalancedTransactions[index]
    //   // selectedTxn.balanced = false
    //   this.$emit('update', selectedTxn)
    // },
    async getTxns () {
      try {
        let txns = await this.getEvents()
        let txns2 = await this.getTransactions()
        let txn = await this.getTransactionById({ uid: '0x79ef' })
        console.log('events', txns)
        console.log('transax', txns2)
        console.log('by id', txn)
        this.transactions = txns
      } catch (error) {
        console.log(error)
      }
    },
    // async getUnbalancedTxns () {
    //   try {
    //     let unTxns = await this.getUnbalancedTransactions()
    //     this.unbalancedTransactions = unTxns
    //   } catch (error) {
    //     console.log(error)
    //   }
    // },
    formattedDate (date) {
      var options = { year: 'numeric', month: 'long', day: 'numeric' }
      let newDate = new Date(date)
      return newDate.toLocaleString('en-US', options)
    },
    selectFirstOfArray () {
      this.transactions(0)
      // if (this.filter === 'Unbalanced transactions') {
      //   this.selectUnbalancedTxn(0)
      // }

      // if (this.filter === 'Balanced transactions') {
      //   this.selectBalancedTxn(0)
      // }
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
