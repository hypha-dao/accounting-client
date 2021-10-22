<template lang="pug">
#main-container.main.q-pa-sm
  q-card.q-pa-sm.full-width
    .row
      .text-h6.q-mr-lg.border {{ $t('pages.tokens.tokens') }}
    TokensCatalogList
</template>

<script>
import TokensCatalogList from './list/tokensCatalogList'

export default {
  name: 'tokens-catalog',
  components: { TokensCatalogList }
}
</script>

<style>

</style>
