<template lang="pug">
 #container.q-pa-md.q-gutter-sm
    .text-title1 {{$t('pages.coa.addAccount')}}
    q-form(@submit="onSubmit")
      //- q-btn(
      //-     :label="$t('pages.coa.chooseParent')"
      //-     @click="modals.showAllAccounts = true"
      //-     type="button"
      //- )
      //- p {{ labelParentAccount }}
      div.cursor-pointer
        q-input.cursor-pointer(
            v-model="labelParentAccount"
            :label="$t('pages.coa.parent')"
            :rules="[rules.required]"
            readonly
            @click="modals.showAllAccounts = true"
        )
      q-input(
          v-model="params.accountName"
          :label="$t('pages.coa.accountName')"
          :rules="[rules.required]"
      )
      q-input(
          v-model="params.accountCode"
          :label="$t('pages.coa.accountCode')"
          :rules="[rules.required]"
      )
      q-btn.full-width(
        :label="$t('pages.coa.saveAccount')"
        type="submit"
        color="primary"
      )
    #modals
      q-dialog(v-model="modals.showAllAccounts" position="top")
          q-card.q-pa-md(style="min-width: 800px")
              custom-table-tree(v-model="params.parentAccount" :allSelecteable="true")
</template>

<script>
import CustomTableTree from '~/pages/accounts/components/custom-table-tree'
import { validation } from '~/mixins/validation'
import { mapActions } from 'vuex'
import { accountPayout } from '~/const/payouts/account-payout.js'

export default {
  name: 'add-account-form',
  components: { CustomTableTree },
  mixins: [validation],
  props: {
    account: Object
  },
  beforeMount () {
    if (!this.isNew) {
      this.params.accountName = this.account.accountName
      this.params.accountCode = this.account.accountCode
      // this.params.parentAccount = this.account.parent
    }
  },
  data () {
    return {
      params: {
        parentAccount: undefined,
        accountName: undefined,
        accountCode: undefined
      },
      modals: {
        showAllAccounts: false
      }
    }
  },
  computed: {
    labelParentAccount () {
      return this.params.parentAccount ? `${this.params.parentAccount.accountCode.toString().slice(0, 1)}-${this.params.parentAccount.accountCode}  ${this.params.parentAccount.accountName}` : undefined
    },
    isNew () {
      return !this.account
    }
  },
  methods: {
    ...mapActions('contAccount', ['createAccount']),
    async onSubmit () {
      let accountPayload = JSON.parse(JSON.stringify(accountPayout))
      accountPayload[0].find(el => el.label === 'parent_account').value[1] = this.params.parentAccount.hash
      accountPayload[0].find(el => el.label === 'account_name').value[1] = this.params.accountName
      accountPayload[0].find(el => el.label === 'account_code').value[1] = this.params.accountCode

      console.log(accountPayload)
      try {
        // console.log(accountPayout)
        const r = await this.createAccount({ accountInfo: accountPayload })
        console.log('response r', r)
      } catch (e) {

      }
      console.log('OnSubmit!')
      this.showSuccessMsg('Account added successfully')
      this.$emit('success')
    }
  }
}
</script>

<style lang="sass" scoped>

</style>
