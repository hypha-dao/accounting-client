<template lang="pug">
  q-card( flat ).full-h
    q-card-section
      .text-h6
        | Transactions
      .row.justify-between.q-gutter-md.q-my-lg
        .col-5.rounded-field
          q-select(value="Opt 1" outlined :options="options" label='Filter by account')
            //- template(v-slot:after)
            //-   q-icon(name="close" style="background-color='blue'").cursor-pointer
        .col-5
          q-input(outlined :option='options' label='Search')
            //- template(v-slot:after)
            //- q-icon(name="close").cursor-pointer
      //- Data table
      q-table.q-mt-xl(
        :columns="columns"
        :data="data"
        se
        :selected.sync="selected"
      )
        template(v-slot:body="props")
          q-tr(:props="props" @click="selectTransaction(props.row.id)" :class="(selectedIndex == props.row.id) ? 'bg-dark-accent': ''").styled-row
            q-td(key="id" :props="props") {{ props.row.id }}
            q-td(key="date" :props="props") {{ props.row.date }}
            q-td(key="amo" :props="props") {{ props.row.amo }}
            q-td(key="transaction" :props="props") {{ props.row.transaction }}
            q-td(key="approved" :props="props")
              q-icon.icon-sized(:color="(props.row.approved) ? 'positive' : 'negative'" :name="(props.row.approved) ? 'check_circle' : 'remove_circle'")
            q-td(key="balanced" :props="props")
              span(v-show="props.row.balanced").letter-icon.bg-positive B
              span(v-show="!props.row.balanced").letter-icon.bg-negative U
      //- End of table
      .q-mt-xl.flex.column
        .row.self-center.q-my-md
          q-btn.q-px-xl.btn-md(color="primary")
            q-icon(class="icon-sized" name="note_add")
            span New
        .row.self-center.q-my-md
          q-btn.q-px-xl.btn-md(color="primary" @click="data.splice(selectedIndex, 1)" )
            q-icon(class="icon-sized" name="delete")
            span Delete
</template>

<script>
export default {
  name: 'transaction-list',
  data () {
    return {
      selected: [],
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
          sortable: true,
          headerClasses: 'bg-secondary text-white'
        },
        {
          name: 'date',
          align: 'center',
          label: 'Date',
          field: 'date',
          sortable: true,
          headerClasses: 'bg-secondary text-white'
        },
        {
          name: 'amo',
          align: 'center',
          label: 'Amo',
          field: 'amo',
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
