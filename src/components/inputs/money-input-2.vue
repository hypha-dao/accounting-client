<template lang="pug">
q-field(
  :label="label"
  v-bind:value="value"
  @input=" e => updateModel(e)"
  :rules="rules"
  :readonly="readonly"
  :disable="disable"
  :color="color"
  :borderless="borderless"
  :dense="dense"
)
  template(v-slot:control='{ id, floatingLabel, value, emitValue }')
    currency-input.q-field__input.c_input(:id="id" v-model="value.value" class="q-field__input left" :locale="locale" :currency="currency" :allowNegative="allowNegative" :precision="precision" @change="emitValue")
</template>

<script>
import { CurrencyInput } from 'vue-currency-input'
export default {
  components: { CurrencyInput },
  props: {
    value: {
      type: Object,
      default: () => ({ value: 0, display: 0 })
    },
    label: { type: String },
    readonly: {},
    disable: {},
    color: {},
    rules: { type: Array },
    borderless: { type: Boolean },
    dense: { type: Boolean },
    locale: {
      type: String,
      default: 'en'
    },
    currency: {
      type: [String, Object],
      default: () => null
    },
    allowNegative: {
      type: Boolean,
      default: false
    },
    precision: {
      type: [Object, undefined],
      default: () => ({ min: 0, max: 20 })
    }
  },
  methods: {
    async updateModel (e) {
      this.$emit('input', { value: e })
    }
  }
}
</script>
