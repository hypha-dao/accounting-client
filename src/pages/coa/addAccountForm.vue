<template lang="pug">
 #container.q-pa-md.q-gutter-sm
    .text-title1 {{$t('pages.coa.addAccount')}}
    q-form(@submit="onSubmit")
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
          :rules="[rules.required, customRules.accountCode]"
          :prefix="baseChildrenAccount"
          type="number"
      )
      //- p {{baseChildrenAccount}}
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
      },
      customRules: {
        accountCode: val => {
          const realCode = this.baseChildrenAccount + val
          if (realCode.length !== 8) {
            return 'The account code must have 8 digits'
          }

          if (!this.params.parentAccount) return
          if (Number.parseInt(realCode) <= Number.parseInt(this.params.parentAccount.accountCode)) {
            return "The children's account code must be bigger than parent's account code."
          }
          return true
        }
      }
    }
  },
  computed: {
    labelParentAccount () {
      return this.params.parentAccount ? `${this.params.parentAccount.accountCode} - ${this.params.parentAccount.accountName}` : undefined
    },
    isNew () {
      return !this.account
    },
    baseChildrenAccount () {
      let newBase = ''
      let isEditable = true
      if (!this.params.parentAccount) return newBase
      const parentAccountCode = this.params.parentAccount.accountCode.split('')
      for (let i = parentAccountCode.length; i--; i !== 0) {
        if (Number.parseInt(parentAccountCode[i]) !== 0) {
          // debugger
          isEditable = false
        }
        if (!isEditable) {
          // console.log(i, parentAccountCode[i])
          newBase += parentAccountCode[i]
        }
      }

      return newBase.split('').reverse().join('')
    }
  },
  methods: {
    ...mapActions('contAccount', ['createAccount']),
    async onSubmit () {
      try {
        let accountPayload = JSON.parse(JSON.stringify(accountPayout))
        accountPayload[0].find(el => el.label === 'parent_account').value[1] = this.params.parentAccount.hash
        accountPayload[0].find(el => el.label === 'account_name').value[1] = this.params.accountName
        accountPayload[0].find(el => el.label === 'account_code').value[1] = `${this.baseChildrenAccount}${this.params.accountCode}`

        console.log(accountPayload)
        // console.log(accountPayout)
        const r = await this.createAccount({ accountInfo: accountPayload })
        console.log('response r', r)
        console.log('OnSubmit!')
        this.showSuccessMsg('Account added successfully')
        this.$emit('success')
      } catch (e) {

      }
    }
  }
}
</script>

<style lang="sass" scoped>

</style>
