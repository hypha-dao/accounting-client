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
        to="/profiles/myProfile"
        clickable
        v-ripple
      )
        q-item-section(avatar)
          q-icon(name="app:my-profile")
        q-item-section {{ $t('menu.myProfile') }}
      q-item(
        v-if="isAuthenticated"
        to="/profiles/chat"
        clickable
        v-ripple
      )
        q-item-section(avatar)
          q-icon(name="app:chats")
        q-item-section {{ $t('menu.chats') }}
</template>

<style lang="stylus">

</style>
