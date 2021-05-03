<template lang="pug">
  q-card( flat ).full-height.q-px-md
    q-card-section
      div.text-h6
        | Transactions
      div.row.justify-between.q-gutter-md.q-mt-md
        div.col-5.rounded-field
          q-select(outlined :options="options" label='Filter by account')
            template(v-slot:after)
              q-icon(name="close" style="background-color='blue'").cursor-pointer
        div.col-5
          q-input(outlined :option='options' label='Search')

      div.row.q-mt-lg
        table.col-12.styled-table
          thead
            tr
              th.text-center.q-py-md Date
              th.text-center.q-py-md Amo
              th.text-center.q-py-md Transaction
              th.text-center.q-py-md Approved
              th.text-center.q-py-md Balanced
          tbody
            tr.text-center.justify-center( v-for="transaction in data" :key="transaction.id" :class="(selectedIndex == transaction.id) ? 'selected' : ''" @click="selectTransaction(transaction.id)")
              td.q-py-md {{ transaction.date }}
              td.q-py-md {{ transaction.amo }}
              td.q-py-md {{ transaction.transaction }}
              td.q-py-md
                q-icon(class="icon-sized " :class="transaction.approved ? 'success' : 'failure' "  :name="transaction.approved ? 'check_circle' :  'remove_circle'" )
              td.q-py-md.flex.align-center.justify-center
                  span.letter-icon(v-if="transaction.balanced" class="letter-icon balanced") B
                  span.letter-icon(v-if="!transaction.balanced" class="letter-icon unbalanced") U
      div.q-mt-xl.flex.column
        .row.self-center.q-my-md
          q-btn.primary-color.q-px-xl
            q-icon(class="icon-sized" name="note_add" size="35px")
            span New
        .row.self-center.q-my-md
          q-btn.primary-color.q-px-xl( @click="data.splice(selectedIndex, 1)" )
            q-icon(class="icon-sized" name="delete" size="35px")
            span Delete
</template>

<script>
export default {
  name: 'transaction-list',
  data () {
    return {
      selectedIndex: 0,
      options: [
        'Opt 1',
        'Opt 2',
        'Opt 3',
        'Opt 4'
      ],
      data: [
        {
          id: 0,
          date: '2020 Mar. 5',
          amo: '2 ET',
          transaction: 'Push Campaing',
          approved: false,
          balanced: false
        },
        {
          id: 1,
          date: '2020 Mar. 5',
          amo: '$35',
          transaction: 'Push project 2',
          approved: true,
          balanced: true
        },
        {
          id: 2,
          date: '2020 Mar. 6',
          amo: '$35',
          transaction: 'Push 3',
          approved: true,
          balanced: true
        },
        {
          id: 3,
          date: '2020 Mar. 7',
          amo: '$35',
          transaction: 'Push 31',
          approved: true,
          balanced: true
        },
        {
          id: 4,
          date: '2020 Mar. 8',
          amo: '$35',
          transaction: 'Push 4',
          approved: true,
          balanced: true
        },
        {
          id: 5,
          date: '2020 Mar. 8',
          amo: '$35',
          transaction: 'Push 4',
          approved: false,
          balanced: false
        }
      ],
      columns: [
        {
          name: 'date',
          align: 'center',
          label: 'Date',
          field: 'date',
          sortable: true
        },
        {
          name: 'amo',
          align: 'center',
          label: 'Amo',
          field: 'amo',
          sortable: true
        },
        {
          name: 'transaction',
          align: 'center',
          label: 'Transaction',
          field: 'transaction',
          sortable: true
        },
        {
          name: 'approved',
          align: 'center',
          label: 'Approved',
          field: 'approved',
          sortable: true
        },
        {
          name: 'balanced',
          align: 'center',
          label: 'Balanced',
          field: 'balanced',
          sortable: true
        }
      ]
    }
  },
  created () {
    this.selectTransaction(this.selectedIndex)
  },
  methods: {
    selectTransaction (index) {
      this.selectedIndex = index
      this.$emit('update', this.data[index])
    }
  }
}
</script>

<style scoped lang="scss">

.primary-color {
  background-color: $primary;
  color: white;
  font-weight: bold;
  width: 260px;
}

.full-height {
  height: 100%;
}

.styled-table {
    border-collapse: collapse;
}

.styled-table tbody{
    cursor: pointer;
}

.styled-table thead tr {
    background-color: $secondary;
    color: white;
}

.styled-table tbody tr:nth-of-type(even) {
    background-color: $accent;
}

.styled-table tbody tr:last-of-type {
    border-bottom: 2px solid $primary;
}

.selected {
  background-color: $accentDark !important;
}

.icon-sized {
  font-size: 2rem;
}

.success {
  color: $positive;
}

.failure {
  color: $negative;
}

.balanced {
  background-color: $positive;
}

.unbalanced {
  background-color: $negative;
}

.letter-icon {
  width: 28px;
  height: 28px;
  font-weight: bold;
  border-radius: 50%;
  text-align: center;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
