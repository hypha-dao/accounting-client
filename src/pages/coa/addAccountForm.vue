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
              custom-table-tree(v-model="params.parentAccount")
</template>

<script>
import CustomTableTree from '~/pages/accounts/components/custom-table-tree'
import { validation } from '~/mixins/validation'
import { mapActions } from 'vuex'
export default {
  name: 'add-account-form',
  components: { CustomTableTree },
  mixins: [validation],
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
      return this.params.parentAccount ? this.params.parentAccount.accountName : undefined
    }
  },
  methods: {
    ...mapActions('contAccount', ['createAccount']),
    async onSubmit () {
      try {
        const r = await this.createAccount({ })
        console.log('response r', r)
      } catch (e) {

      }
      console.log('OnSubmit!')
    }
  }
}
</script>

<style lang="sass" scoped>

</style>
