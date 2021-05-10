<template lang="pug">
  q-card( flat ).full-h
    q-card-section
      .text-h6
        | Details
      .details.q-mt-md.q-px-sm.q-gutter-sm
        .text-caption {{ $t('pages.accounts.account') }}: {{ transaction.transaction }}
        .text-caption {{ $t('pages.accounts.memo') }}: Memo!!
        .row.justify-between.q-mb-md
            .text-caption {{ $t('pages.accounts.date') }}: {{ formattedDate(transaction.date) }}
            .text-caption.text-right {{ $t('pages.accounts.approved') }}: Icon
              //- q-icon(class="icon-sized " :class="transaction.approved ? 'text-positive' : 'text-negative' "  :name="transaction.approved ? 'check_circle' :  'remove_circle'" )
            .text-caption.text-right {{ $t('pages.accounts.balanced') }}: Icon
        //-       span.letter-icon(v-if="transaction.balanced" class="letter-icon bg-positive") B
        //-       span.letter-icon(v-if="!transaction.balanced" class="letter-icon bg-negative") U
      q-table.q-mt-sm(
        :columns="columns"
        :data="transaction.components"
        )
        template(v-slot:body="props")
          q-tr(:props="props").styled-row
            q-td(key="account" :props="props") {{ props.row.account }}
            q-td(key="amount" :props="props") {{ props.row.amount }}
            q-td(key="percent" :props="props") {{ props.row.percent }}
        template(v-slot:bottom-row)
          q-tr.bg-grey-4.text-grey-8.cursor-pointer(@click="data.push({account:'My account', amount:'30 TLOS', percent:'10%'})")
            q-td(colspan="4") Add component...
      hr.q-mt-xl.text-primary
      textarea(style="width:100%" placeholder=" Notes:").q-mt-md
      .q-mt-xl.flex.column
        .row.self-center.q-my-md
          q-btn.bg-primary.text-white.q-px-xl.btn-lg
            q-icon(class="icon-sized" name="note_add")
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
      data: [],
      columns: [
        {
          name: 'account',
          align: 'center',
          label: 'Account',
          field: 'account',
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
          name: 'percent',
          align: 'center',
          label: 'Percent',
          field: 'percent',
          sortable: true,
          headerClasses: 'bg-secondary text-white'
        }
      ]
    }
  },
  methods: {
    formattedDate (date) {
      var options = { year: 'numeric', month: 'long', day: 'numeric' }
      let newDate = new Date(date)

      return newDate.toLocaleString('en-US', options)
    }
  }
}
</script>

<style scoped lang="scss">
  .bord {
    border: 1px solid black
  }

  .btn-lg {
    width: 320px !important;
  }

  .styled-row:nth-of-type(even) {
    background-color: $accent;
  }

  .icon-sized {
    font-size: 2rem;
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
