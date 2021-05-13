<template lang="pug">
q-card.full-width
  q-card-section.row.items-center.q-pb-none
    .text-h6(v-if="!edit") Add component
    .text-h6(v-if="edit") Edit component
    q-space
    q-btn(icon="close", flat, round, v-close-popup)
  q-form.q-px-lg.q-py-md(@submit.prevent="addComponent()")
    q-input.q-my-md(
      outlined,
      :rules="[rules.required]",
      v-model="component.account",
      label="Account",
      type="text"
    )
    q-input.q-my-md(
      outlined,
      :rules="[rules.required]",
      v-model="component.memo",
      label="Memo",
      type="text"
    )
    q-input.q-my-md(
      outlined,
      :rules="[rules.required]",
      v-model="component.amount",
      label="Amount",
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
        :label="edit ? 'Save': 'Create'",
        text-color="white",
        color="primary",
        type="submit",
        size="15px"
      )
</template>

<script>
import { validation } from '~/mixins/validation'

export default {
  name: 'component-form',
  mixins: [validation],
  props: {
    txnComponent: Object
  },
  data () {
    return {
      component: {
        id: '',
        account: '',
        memo: '',
        // currency: '',
        amount: ''
      },
      cleanComp: {
        id: '',
        account: '',
        memo: '',
        amount: ''
      },
      edit: false
    }
  },
  created () {
    this.component = this.cleanComp
    if (this.txnComponent.id !== undefined) {
      this.edit = true
      this.component = this.txnComponent
      let composedAmount = (this.txnComponent.amount).split(' ')
      this.component.amount = composedAmount[0]
      // this.component.currency = composedAmount[1]
    }
  },
  methods: {
    addComponent () {
      if (this.edit) {
        this.$emit('save', this.component)
      } else {
        this.$emit('add', this.component)
      }
    }
  }
}
</script>

<style>
</style>
