<template lang="pug">
q-card.full-width
  q-card-section.row.items-center.q-pb-none
    .text-h6 Create transaction
    q-space
    q-btn(icon="close", flat, round, v-close-popup)
  q-form.q-px-lg.q-py-md(@submit.prevent="createTransaction()")
    q-select.q-my-lg(
      @input="getAvailableSources()"
      v-model="transaction.currency"
      :options="currencyTypes"
      label="Currency"
      outlined
      :rules="[rules.required]",
    )
    q-select.q-my-lg(
      v-model="transaction.source"
      :options="availableSources"
      label="Source"
      outlined
      :rules="[rules.required]",
    )
    q-input.q-my-sm(
      outlined,
      :rules="[rules.required]",
      v-model="transaction.memo",
      label="Memo",
      type="text"
    )
    q-input.q-my-sm(
      outlined,
      :rules="[rules.required]",
      v-model="transaction.quantity",
      label="Quantity",
      type="text"
    )
    q-input.q-my-sm(
      outlined,
      :rules="[rules.required]",
      v-model="transaction.from",
      label="From",
      type="text"
    )
    q-input.q-my-sm(
      outlined,
      :rules="[rules.required]",
      v-model="transaction.to",
      label="To",
      type="text"
    )
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
import { mapActions } from 'vuex'
import { Chains } from '~/const/chains'
import { Sources } from '~/const/sources'

export default {
  name: 'create-transaction',
  mixins: [validation],
  data () {
    return {
      transaction: {
        memo: 'New transaction',
        quantity: '0.5',
        currency: 'BTC',
        from: 'Bitcoin',
        to: 'Etherum',
        source: ''
      },
      currencyTypes: [
        'EOS',
        'ETHERUM',
        'TELOS',
        'BTC'
      ],
      availableSources: []
    }
  },
  created () {
    this.getAvailableSources()
  },
  methods: {
    ...mapActions('document', ['sendTransaction']),
    async createTransaction () {
      let dateNow = new Date()
      dateNow = dateNow.toISOString()

      let fullTransact = [
        [
          {
            label: 'content_group_label',
            value: ['string', 'details']
          },
          {
            label: 'transaction_id',
            value: ['string', '']
          },
          {
            label: 'from',
            value: ['string', this.transaction.from]
          },
          {
            label: 'treasury_id',
            value: ['string', this.transaction.source]
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
            value: ['string', Chains[this.transaction.currency]]
          },
          {
            label: 'source',
            value: ['string', this.transaction.source]
          },
          {
            label: 'cursor',
            value: [
              'string',
              ''
            ]
          }
        ]
      ]
      try {
        await this.sendTransaction({ contentGroups: fullTransact })
        this.$emit('created')
      } catch (error) {
        console.log(error)
      }
    },
    getAvailableSources () {
      this.transaction.source = ''
      this.availableSources = Sources[this.transaction.currency]
    }
  }
}
</script>
