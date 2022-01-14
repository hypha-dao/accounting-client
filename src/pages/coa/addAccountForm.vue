<template lang="pug">
 #container.q-pa-md.q-gutter-sm
    .text-title1(v-if="!edit") {{$t('pages.coa.addAccount')}}
    .text-title1(v-else) Editing account
    q-form(@submit="onSubmit" ref="form")
      q-checkbox(v-if="!edit" v-model="params.rootAccount" :disable="edit" label="Do you want create a root account?")
      div.cursor-pointer
        q-input.cursor-pointer(
            v-model="labelParentAccount"
            :label="$t('pages.coa.parent')"
            :rules="!params.rootAccount ? [rules.required] : []"
            readonly
            @click="modals.showAllAccounts = true"
            :disable="edit"
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
          :disable="edit"
      )
      //- p {{baseChildrenAccount}}
      q-btn.full-width.q-mb-md(
        :label="$t('pages.coa.deleteAccount')"
        color="negative"
        v-if="edit && canBeDelete"
        @click="deleteAccountWithHash"
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
import { mapActions, mapMutations } from 'vuex'
import { accountPayout } from '~/const/payouts/account-payout.js'

export default {
  name: 'add-account-form',
  components: { CustomTableTree },
  mixins: [validation],
  props: {
    account: Object,
    edit: Boolean
  },
  async beforeMount () {
    if (!this.isNew) {
      this.params.accountName = this.account.accountName
      this.params.parentAccount = await this.getAccountByHash({ hash: this.account.parentHash })
    }
  },
  async mounted () {
    if (this.edit) {
      this.canBeDelete = await this.validateIfAccountHasChildrenOrIsNodeAccount()
    }
  },
  watch: {
    baseChildrenAccount () {
      if (!this.isNew) {
        console.log('children account', this.account.accountCode, this.baseChildrenAccount)
        const childrenAccountCode = this.account.accountCode.replace(this.baseChildrenAccount, '')
        console.log('children account post', childrenAccountCode)
        this.params.accountCode = childrenAccountCode
      }
    },
    'params.parentAccount' (v) {
      console.log('v', v)
      if (v) {
        this.params.rootAccount = false
      }
    },
    async 'params.rootAccount' (v) {
      if (v) {
        this.params.parentAccount = undefined
        await this.$nextTick()
        await this.$refs.form.resetValidation()
      }
    }
  },
  data () {
    return {
      params: {
        parentAccount: undefined,
        accountName: undefined,
        accountCode: undefined,
        rootAccount: true
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
      },
      canBeDelete: false
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
          isEditable = false
        }
        if (!isEditable) {
          newBase += parentAccountCode[i]
        }
      }

      return newBase.split('').reverse().join('')
    }
  },
  methods: {
    ...mapActions('contAccount', ['createAccount', 'updateAccount', 'getAccountByHash', 'deleteAccount', 'getAccountById']),
    ...mapActions('transaction', ['getComponentsByAccountId']),
    ...mapMutations('contAccount', ['setTreeAccounts']),
    async onSubmit () {
      try {
        let accountPayload = JSON.parse(JSON.stringify(accountPayout))
        if (this.params.rootAccount) {
          accountPayload[0].find(el => el.label === 'parent_account').value[1] = process.env.DGRAPH_TRX_LEDGER
        } else {
          accountPayload[0].find(el => el.label === 'parent_account').value[1] = this.params.parentAccount.hash
        }
        accountPayload[0].find(el => el.label === 'account_name').value[1] = this.params.accountName
        accountPayload[0].find(el => el.label === 'account_code').value[1] = `${this.baseChildrenAccount}${this.params.accountCode}`

        const response = (this.isNew) ? await this.createAccount({ accountInfo: accountPayload }) : await this.updateAccount({ accountInfo: accountPayload, accountHash: this.account.hash })

        if (response) {
          this.showSuccessMsg('Account saved successfully')
          this.setTreeAccounts([])
          this.$emit('success')
        }
      } catch (e) {
        console.error(e)
      }
    },
    async validateIfAccountHasChildrenOrIsNodeAccount () {
      try {
        const { data } = await this.getAccountById({ uid: this.account.uid })
        const children = data.account[0]
        if (children.account) return false
        const detailsAccountSelected = await this.getComponentsByAccountId({ uid: this.account.uid })
        if (detailsAccountSelected) return false
        return true
      } catch (e) {
        console.error(e)
      }
    },
    async deleteAccountWithHash () {
      try {
        console.log(this.account)
        const response = await this.deleteAccount({ accountHash: this.account.hash })
        if (response) {
          this.showSuccessMsg('Account deleted successfully')
          this.setTreeAccounts([])
          this.$emit('success')
        }
      } catch (e) {
        console.error(e)
      }
    }
  }
}
</script>

<style lang="sass" scoped>

</style>
