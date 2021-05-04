<template lang="pug">
  q-card( flat ).full-height
    q-card-section
      .text-h6
        | Transactions
      .row.justify-between.q-gutter-md.q-my-lg
        .col-5.rounded-field
          q-select(value="Opt 1" outlined :options="options" label='Filter by account')
            template(v-slot:after)
              q-icon(name="close" style="background-color='blue'").cursor-pointer
        .col-5
          q-input(outlined :option='options' label='Search')
      //- Data table
      q-table.q-mt-xl(:columns="columns" :data="data" row-key="id" )
      .q-mt-xl.flex.column
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
          name: 'id',
          align: 'center',
          label: 'ID',
          field: 'id',
          sortable: true
        },
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
      console.log('updated')
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
