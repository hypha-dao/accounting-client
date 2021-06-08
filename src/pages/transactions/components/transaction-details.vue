<template lang="pug">
  q-card( flat ).full-h
    q-card-section
      .text-h6
        | Details
      .details.q-mt-md.q-px-sm.q-gutter-sm
        .text-caption {{ $t('pages.accounts.amount') }}: {{ transaction.amount }}
        //- .text-caption {{ $t('pages.accounts.memo') }}: {{ transaction.memo }}
        .row.justify-between.q-mb-md
            .text-caption {{ $t('pages.accounts.date') }}: {{ formattedDate(transaction.date) }}
            .text-caption.text-right {{ $t('pages.accounts.approved') }}: Icon
              //- q-icon(class="icon-sized " :class="transaction.approved ? 'text-positive' : 'text-negative' "  :name="transaction.approved ? 'check_circle' :  'remove_circle'" )
            .text-caption.text-right {{ $t('pages.accounts.balanced') }}: Icon
        //-       span.letter-icon(v-if="transaction.balanced" class="letter-icon bg-positive") B
        //-       span.letter-icon(v-if="!transaction.balanced" class="letter-icon bg-negative") U
      q-table.q-mt-sm(
        :columns="columns"
        :data="txnComponents"
        )
        template(v-slot:body="props")
          q-tr(:props="props" @click="printTrans(props.row.id)").styled-row
            q-td(key="code" :props="props") {{ props.row.accountCode }}
            q-td(key="type" :props="props") {{ props.row.accountType }}
            q-td(key="memo" :props="props") {{ (props.row.memo != ' ') ? props.row.memo : '*No memo*' }}
            q-td(key="accountPath" :props="props") {{ props.row.accountPath }}
            q-td(key="amount" :props="props") {{ props.row.amount }}
            //- q-td(key="percent" :props="props") {{ componentPercent(props.row.amount) }}
            q-td(key="actions" :props="props")
              .row.justify-between
                q-icon(name="edit" :size="'sm'" color="primary" @click="editComponent(props.row)").cursor-pointer
                q-icon(name="delete" :size="'sm'" color="negative" @click="removeComponent(props.row.id)" ).cursor-pointer
        template(v-slot:bottom-row)
          q-tr.bg-grey-4.text-grey-8.cursor-pointer(@click="componentForm = !componentForm")
            q-td(colspan="100%") Add component...
      hr.q-mt-xl.text-primary
      textarea(style="width:100%" placeholder=" Notes:").q-mt-md
      .q-mt-xl.flex.column
        .row.self-center.q-my-md
          q-btn.bg-primary.text-white.q-px-xl.btn-lg(@click="storeTransaction()")
            q-icon(class="icon-sized" name="save")
            span Save
        .row.self-center.q-my-md
          q-btn.bg-primary.text-white.q-px-xl.btn-lg
            q-icon(class="icon-sized" name="note_add")
            span Aprove transaction
      q-dialog(v-model="componentForm")
        ComponentForm(@add="pushComponent" @save="updateComponent" :txnComponent="txnComponent")

</template>

<script>
import { mapActions } from 'vuex'
import ComponentForm from './component-form'

export default {
  name: 'transaction-list',
  props: {
    transaction: Object
  },
  components: {
    ComponentForm
  },
  data () {
    return {
      componentForm: false,
      txnComponents: [],
      columns: [
        {
          name: 'code',
          align: 'center',
          label: 'Code',
          field: 'accountCode',
          sortable: true,
          headerClasses: 'bg-secondary text-white'
        },
        {
          name: 'type',
          align: 'center',
          label: 'Account type',
          field: 'accountType',
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
          name: 'accountPath',
          align: 'center',
          label: 'Account',
          field: 'accountPath',
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
        // {
        //   name: 'from',
        //   align: 'center',
        //   label: 'From',
        //   field: 'from',
        //   sortable: true,
        //   headerClasses: 'bg-secondary text-white'
        // },
        // {
        //   name: 'to',
        //   align: 'center',
        //   label: 'To',
        //   field: 'to',
        //   sortable: true,
        //   headerClasses: 'bg-secondary text-white'
        // },
        // {
        //   name: 'percent',
        //   align: 'center',
        //   label: 'Percent',
        //   field: 'percent',
        //   sortable: true,
        //   headerClasses: 'bg-secondary text-white'
        // },
        {
          name: 'actions',
          align: 'center',
          label: 'Actions',
          field: 'actions',
          headerStyle: 'min-width: 100px',
          headerClasses: 'bg-secondary text-white'
        }
      ],
      txnComponent: {}
    }
  },
  methods: {
    ...mapActions('document', ['getTransactionById', 'createTxn']),
    printTrans (idx) {
      console.log(this.txnComponents[idx])
    },
    formattedDate (date) {
      var options = { year: 'numeric', month: 'numeric', day: 'numeric' }
      let newDate = new Date(date)
      return newDate.toLocaleString('en-US', options)
    },
    async getTransactionComponents () {
      let response = await this.getTransactionById({ uid: this.transaction.uid })
      this.txnComponents = response
      console.log('txn components', this.txnComponents)
    },
    pushComponent (component) {
      this.componentForm = false
      component.amount = `${component.amount} ${(this.transaction.amount).split(' ')[1]}`
      component.id = this.txnComponents.length
      component.account = component.account.hash
      this.txnComponents.push(component)
    },
    componentPercent (compAmount) {
      console.log('comp amount', compAmount)
      let compAmountWOCurrency = compAmount.split(' ')[0]
      let totalAmount = (this.transaction.amount).split(' ')[0]
      let percent = (100 / totalAmount) * Math.abs(compAmountWOCurrency)

      return percent + '%'
    },
    editComponent (props) {
      console.log(props)
      this.txnComponent = props
      this.componentForm = true
    },
    updateComponent (newVal) {
      this.componentForm = false
      this.txnComponents[newVal.id] = newVal
    },
    removeComponent (id) {
      this.txnComponents.splice(id, 1)
    },
    storeTransaction () {
      let fullTransact = [
        [
          {
            'label': 'content_group_label',
            'value': ['string', 'header']
          },
          {
            'label': 'trx_date',
            'value': ['time_point', this.transaction.date]
          },
          {
            'label': 'trx_ledger',
            'value': ['checksum256', process.env.DGRAPH_BASE_NODE_HASH]
          },
          {
            'label': 'trx_memo',
            'value': ['string', this.transaction.memo]
          }
        ]
      ]

      // Creates an content group for each component. It nead memo, account hash and amount
      this.txnComponents.forEach(comp => {
        fullTransact.push(this.formattedComponent(comp))
      })

      console.log('fullTransact', fullTransact)

      this.createTxn({ contentGroups: fullTransact })
    },
    formattedComponent ({ memo, account, amount }) {
      return [
        {
          'label': 'content_group_label',
          'value': ['string', 'component']
        },
        {
          'label': 'memo',
          'value': ['string', memo]
        },
        {
          'label': 'account',
          'value': ['checksum256', account]
        },
        {
          'label': 'amount',
          'value': ['asset', amount]
        }
      ]
    },
    amountOf (asset) {
      return asset.split(' ')[0]
    },
    currencyOf (asset) {
      return asset.split(' ')[1]
    }
    // At the begining
    // async getAccountPath (idx) {
    //   try {
    //     // We get the account of the component
    //     let account = await this.getAccountPathByHash({ hash: this.txnComponents[idx].account })
    //     this.txnComponents[idx].accountName = account.accountName

    //     /* HARD CODED */
    //     if (account.parentAccount) {
    //       let account2 = await this.getAccountPathByHash({ hash: account.parentAccount })
    //       if (account2.accountName) {
    //         this.txnComponents[idx].accountName = account2.accountName + ' > ' + this.txnComponents[idx].accountName
    //       }
    //       if (account2.parentAccount) {
    //         let account3 = await this.getAccountPathByHash({ hash: account2.parentAccount })
    //         if (account3.accountName) {
    //           this.txnComponents[idx].accountName = account3.accountName + ' > ' + this.txnComponents[idx].accountName
    //         }
    //       }
    //     }
    //   } catch (error) {
    //     console.error(error)
    //   }
    // }
  },
  watch: {
    transaction: async function () {
      this.txnComponents = []
      await this.getTransactionComponents()

      // this.txnComponents.forEach((val, idx) => {
      //   this.getAccountPath(idx)
      // })
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
