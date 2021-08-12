<script>
import { mapGetters } from 'vuex'

export default {
  name: 'left-menu-authenticated',
  computed: {
    ...mapGetters('accounts', ['isAuthenticated'])
  }
}
</script>

<template lang="pug">
  q-scroll-area.fit
    q-list
      q-item(
        v-if="isAuthenticated"
        to="/transactions"
        clickable
        v-ripple
      )
        q-item-section(avatar)
          q-icon(name="app:transaction")
        q-item-section {{ $t('menu.transactions') }}
      //- q-item(
      //-   v-if="isAuthenticated"
      //-   to="/transactions"
      //-   clickable
      //-   v-ripple
      //- )
      //-   q-item-section(avatar)
      //-     q-icon(name="app:my-profile")
      //-   q-item-section {{ $t('menu.transactions') }}
      q-item(
        v-if="isAuthenticated"
        to="/chart-accounts"
        clickable
        v-ripple
      )
        q-item-section(avatar)
          q-icon(name="app:coa")
        q-item-section {{ $t('menu.chartOfAccounts') }}
</template>

<style lang="stylus">

</style>
