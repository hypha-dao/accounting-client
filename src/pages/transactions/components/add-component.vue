<template lang="pug">
q-card.full-width
  q-card-section.row.items-center.q-pb-none
    .text-h6 Add component
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
      v-model="component.currency",
      label="Currency",
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
        :label="'Create'",
        text-color="white",
        color="primary",
        type="submit",
        size="15px"
      )
</template>

<script>
import { validation } from '~/mixins/validation'

export default {
  name: 'create-transaction',
  mixins: [validation],
  data () {
    return {
      component: {
        account: '',
        currency: '',
        amount: ''
      }
    }
  },
  methods: {
    addComponent () {
      this.$emit('add', this.component)
    }
  }
}
</script>

<style>
</style>
