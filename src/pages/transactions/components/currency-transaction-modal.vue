<template lang="pug">
q-dialog(v-model="isEnable" persistent)
  q-card
    q-card-section
      .text-bold.text-subtitle1 {{ $t('pages.transactions.currency_convertion') }}
    q-card-section.text-center
      .text-h5 {{ debitCurrency }}
      .text-caption {{ debitCurrency.split(' ')[1] }}
      q-separator.width-50
      .text-h5 {{ creditCurrency.split(' ')[0] }}
      .text-caption {{ creditCurrency.split(' ')[1] }}
    q-card-section
      .text-body2 {{ $t('pages.transactions.exchange_recorded') }}
    q-card-actions.flex.justify-center
      q-btn(class="q-mr-lg q-px-xl" outline color="primary" :label="$t('common.buttons.cancel')" @click="cancel")
      q-btn(class="text-white q-px-xl" color="primary" :label="$t('common.buttons.confirm')" @click="confirm")
</template>

<script>
export default {
  name: 'Currency-Transaction-Moda',
  props: {
    isEnable: {
      type: Boolean,
      default: false
    },
    components: {
      type: Array,
      require: true
    }
  },
  computed: {
    creditCurrency () {
      const credit = this.components.filter(c => c.type === 'CREDIT')
      const currency = credit[0].currency
      const value = credit.map(c => c.quantity).reduce((previousValue, currentValue) => previousValue + currentValue)
      return `${value} ${currency}`
    },
    debitCurrency () {
      const debit = this.components.filter(c => c.type === 'DEBIT')
      const currency = debit[0].currency
      const value = debit.map(c => c.quantity).reduce((previousValue, currentValue) => previousValue + currentValue)
      return `${value} ${currency}`
    }
  },
  methods: {
    cancel () {
      this.$emit('cancel')
    },
    confirm () {
      this.$emit('confirm')
    }
  }
}
</script>

<style>
.width-50 {
  width: 200px;
  margin: 0 auto;
}
</style>
