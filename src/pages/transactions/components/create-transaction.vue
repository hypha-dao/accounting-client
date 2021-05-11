<template lang="pug">
q-card.full-width
  q-card-section.row.items-center.q-pb-none
    .text-h6 Create transaction
    q-space
    q-btn(icon="close", flat, round, v-close-popup)
  q-form.q-px-lg.q-py-md(@submit.prevent="createTransaction()")
    q-input.q-my-md(
      outlined,
      :rules="[rules.required]",
      v-model="transaction.memo",
      label="Memo",
      type="text"
    )
    q-input.q-my-md(
      outlined,
      :rules="[rules.required]",
      v-model="transaction.currency",
      label="Currency",
      type="text"
    )
    q-input.q-my-md(
      outlined,
      :rules="[rules.required]",
      v-model="transaction.amount",
      label="Amount",
      type="text"
    )
    q-input.q-my-md(
      outlined,
      :rules="[rules.required]",
      v-model="transaction.from",
      label="From",
      type="text"
    )
    q-input.q-my-md(
      outlined,
      :rules="[rules.required]",
      v-model="transaction.to",
      label="To",
      type="text"
    )
    //- q-input(outlined :rules="[rules.required]" v-model="memo" label="Treasury" type="text").q-my-md
    .row.q-gutter-md
      q-btn.col(
        :label="'Cancel'",
        text-color="negative",
        color="white",
        type="submit",
        size="15px",
        flat,
        v-close-popup
      )
      q-btn.col(
        :label="'Create'",
        text-color="white",
        color="primary",
        type="submit",
        size="15px"
      )
</template>

<script>
import { validation } from '~/mixins/validation'
// import { mapActions } from 'vuex'

export default {
  name: 'create-transaction',
  mixins: [validation],
  data () {
    return {
      transaction: {
        memo: '',
        amount: '',
        currency: '',
        from: '',
        to: ''
      }
    }
  },
  methods: {
    // ...mapActions('document', ['sendTransaction']),
    createTransaction () {
      let dateNow = new Date()
      dateNow = dateNow.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      })

      let fullTransact = [
        [
          {
            label: 'content_group_label',
            value: ['string', 'details']
          },
          {
            label: 'transaction_id',
            value: ['string', '2']
          },
          {
            label: 'from',
            value: ['string', this.transaction.from]
          },
          {
            label: 'treasury_id',
            value: ['string', 'btc-treasury-1']
          },
          {
            label: 'to',
            value: ['string', this.transaction.to]
          },
          {
            label: 'quantity',
            value: ['string', this.transaction.quantity]
          },
          {
            label: 'currency',
            value: ['string', this.transaction.currency]
          },
          {
            label: 'timestamp',
            value: ['string', dateNow]
          },
          {
            label: 'usd_value',
            value: ['string', '18000.00']
          },
          {
            label: 'memo',
            value: ['string', this.transaction.memo]
          },
          {
            label: 'chainId',
            value: ['string', 'bip122:000000000019d6689c085ae165831e93']
          },
          {
            label: 'source',
            value: ['string', 'btc-treasury-2']
          },
          {
            label: 'cursor',
            value: [
              'string',
              '87a835a0d11c91ab6abdd75bf7df1e67deada952b448193e1d4ad76c6e585bbb;9'
            ]
          }
        ]
      ]

      console.log('fulltransaction', fullTransact)
      // this.sendTransaction({ contentGroups: fullTransact })
    }
  }
}
</script>

<style>
</style>
