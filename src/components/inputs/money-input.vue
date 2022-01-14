<template lang="pug">
q-field(
  v-if="value && value.display != null"
  v-bind:value="value.display"
  @input=" e => updateModel(e)"
  :label="label"
  :prefix="prefix"
  :suffix="customSuffix"
  :rules="rules"
  :readonly="readonly"
  :disable="disable"
  :bg-color="bgColor"
  :borderless="borderless"
  :dense="dense"
)
  template(v-slot:control='{ id, floatingLabel, value, emitValue }')
    money.q-field__input.c_input(:id="id" class="q-field__input left" :value="value" :readonly="readonly" @input="emitValue" v-bind="moneyFormat" v-show="floatingLabel")
</template>

<script>
import { VMoney, Money } from 'v-money'
export default {
  name: 'money-input',
  directives: { money: VMoney },
  components: { Money },
  props: {
    value: {},
    asset: {},
    type: { type: String },
    prefix: { type: String },
    suffix: { type: String },
    label: { type: String },
    readonly: {},
    disable: {},
    bgColor: {},
    rules: { type: Array },
    borderless: { type: Boolean },
    dense: { type: Boolean }
  },
  data () {
    return {
      string: '',
      last: '',
      moneyFormat: {
        decimal: '.',
        thousands: ',',
        masked: true,
        precision: 2
      }
    }
  },
  watch: {
    value (e) {
      // if (this.last === this.value) return
      // this.last = this.value
      // console.log('CUSTOM MONET OPTION 5', this.value)
      if (!isNaN(parseFloat(this.value))) {
        // console.log('CUSTOM MONET OPTION 6')
        this.$emit('input', { display: this.value, value: parseFloat(this.value) })
      } else if (!this.value || this.value.display == null) {
        this.$emit('input', { display: '0', value: 0 })
        console.log('CUSTOM MONET OPTION 7', this.value)
      }
    }
  },
  mounted () {
    // const model = {
    //   display: this.format(this.value.display),
    //   value: this.value.display
    // }
    // this.$emit('input', model)
    if (!isNaN(parseFloat(this.value))) {
      // console.log('CUSTOM MONET OPTION 1')
      this.$emit('input', { display: this.value, value: parseFloat(this.value) })
    } else if (!this.value || this.value.display == null) {
      this.$emit('input', { display: '0', value: 0 })
      // console.log('CUSTOM MONET OPTION 2')
    }

    // console.log('CUSTOM MONET OPTION 3')
    if (this.asset && this.asset.precision) {
      // console.log('CUSTOM MONET OPTION 4')
      // this.moneyFormat.precision = this.asset.precision
    }
  },
  updated () {
    // console.log('Updated', this.value)
  },
  computed: {
    customSuffix () {
      let suffix = this.suffix ? this.suffix : ''
      if (this.asset && this.asset.symbol) {
        suffix = this.asset.symbol
      }
      return suffix
    }
  },
  methods: {
    async updateModel (e) {
      const input = e
      this.string = this.unformat(input)
      if (this.last === e) return
      this.last = e
      const mValue = this.asset ? this.asset.setAmount(parseFloat(this.string)) : parseFloat(this.string)
      const model = {
        display: e,
        value: mValue
      }
      this.$emit('input', model)
    },
    unformat (number) {
      let unformat = number.replace(/,/g, '')
      return unformat
    }
  }
}
</script>

<style lang="sass" scoped>
input:focus, textarea:focus, select:focus
  outline: none
.c_input
  background-color: inherit
  flex: 1
  border: none
</style>
