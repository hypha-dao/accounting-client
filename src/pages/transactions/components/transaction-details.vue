<template lang="pug">
  q-card( flat ).full-height.q-px-md
    q-card-section
      div.text-h6
        | Details
      div.row.q-mt-md
        .col-6
          .q-py-sm Transaction: {{ transaction.transaction }}
          .q-py-sm Memo: Amo X
          .q-py-sm Date: {{ transaction.date }}
        .col-6.self-end
          .row.justify-between
            .q-py-sm Aproved:
              q-icon(class="icon-sized " :class="transaction.approved ? 'success' : 'failure' "  :name="transaction.approved ? 'check_circle' :  'remove_circle'" )
            //- THis should be aligned with th other items
            .q-py-sm.flex.row Balanced:
              span.letter-icon(v-if="transaction.balanced" class="letter-icon balanced") B
              span.letter-icon(v-if="!transaction.balanced" class="letter-icon unbalanced") U
      div.row.q-mt-lg
        table.col-12.styled-table
          thead
            tr
              th.text-center.q-py-md No.
              th.text-center.q-py-md Account
              th.text-center.q-py-md Amount
              th.text-center.q-py-md Percent
              th.text-center.q-py-md Edit
              th.text-center.q-py-md Delete
          tbody
            tr.text-center.justify-center( v-for="transaction in data" :key="transaction.id" :class="(selectedIndex == transaction.id) ? 'selected' : ''" @click="selectTransaction(transaction.id)")
              td.q-py-md {{ transaction.no }}
              td.q-py-md {{ transaction.account }}
              td.q-py-md {{ transaction.amount }}
              td.q-py-md {{ transaction.percent }}
              td.q-py-md
                q-icon(name="edit")
              td.q-py-md.flex.align-center.justify-center
                q-icon(name="delete")
            tr.add-element( @click="data.push({no: 22, account:'123LA', amount:'22 TLOS', percent:'20%'})" )
              td.q-py-md.q-px-xl(colspan="6")
                span Add component...
      hr.q-mt-xl.text-primary
      textarea(style="width:100%", rows="6" placeholder=" Notes:").q-mt-md
      .q-mt-xl.flex.column
        .row.self-center.q-my-md
          q-btn.primary-color.q-px-xl
            q-icon(class="icon-sized" name="note_add" size="35px")
            span Aprove transaction
</template>

<script>
export default {
  name: 'transaction-list',
  props: {
    transaction: Object
  },
  data () {
    return {
      data: [
        {
          no: 1,
          account: 'Expenses > Marketing',
          amount: '2 ET',
          percent: '50%'
        },
        {
          no: 2,
          account: 'Expenses > XYZ',
          amount: '-3 ET',
          percent: '52%'
        }
      ]
    }
  }
}
</script>

<style scoped lang="scss">
  .full-height {
    height: 100%;
  }

  .bord {
    border: 1px solid black
  }

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

  .styled-table thead tr {
      background-color: $secondary;
      color: white;
  }

  .styled-table tbody tr:nth-of-type(even) {
      background-color: $accent;
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

  .add-element {
    background-color: $grey;
    color: grey;
  }
</style>
