<template lang="pug">
q-card.full-width
  q-card-section.row.items-center.q-pb-none
    .text-h6(v-if="!edit") Add component
    .text-h6(v-if="edit") Edit component
    q-space
    q-btn(icon="close", flat, round, v-close-popup)
  q-form.q-px-lg.q-py-md(@submit.prevent="addComponent()")
    q-scroll-area(style="height: 200px; position: relative" v-show="showTableTree")
      custom-table-tree(@accountChanged="onAccountChanged")
    q-input.q-my-md(
      outlined,
      :rules="[rules.required]",
      v-model="component.account.accountName",
      label="Account",
      type="text"
      v-show="!showTableTree"
      readonly
    )
      template(v-slot:append)
        q-btn.select-account-btn(
          label="Choose an account"
          @click="showTableTree = true"
          color="primary"
          dense
        )
    q-input.q-my-md(
      outlined,
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
import CustomTableTree from '~/pages/accounts/components/custom-table-tree'
import { validation } from '~/mixins/validation'

export default {
  name: 'component-form',
  components: { CustomTableTree },
  mixins: [validation],
  props: {
    txnComponent: Object
  },
  data () {
    return {
      component: {
        id: '',
        account: '',
        accountName: '',
        memo: '',
        amount: ''
      },
      cleanComp: {
        id: '',
        account: '',
        accountName: '',
        memo: '',
        amount: ''
      },
      edit: false,
      showTableTree: false,
      accountSelected: undefined
    }
  },
  created () {
    this.component = this.cleanComp
    if (this.txnComponent.id !== undefined) {
      this.edit = true
      this.component = this.txnComponent
      let composedAmount = (this.txnComponent.amount).split(' ')
      this.component.amount = composedAmount[0]
    }
  },
  methods: {
    onAccountChanged (accountSelected) {
      this.accountSelected = accountSelected
      this.component.account = accountSelected
      this.showTableTree = false
    },
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

<style lang="sass" scoped>
.container-tree
  position: relative !important
  height: 200px !important
.select-account-btn
  position: sticky
  bottom: 10px
  left: 5px
</style>
