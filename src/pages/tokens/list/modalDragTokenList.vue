<template lang="pug">
q-card.responsive-modal
  #container.q-pa-md.q-gutter-sm
    q-markup-table(separator="cell").scroll
      thead
        tr
          th(class="bg-secondary text-uppercase")
            span(class="text-bold text-caption") Position
          th(class="bg-secondary text-uppercase no-border")
            span(class="text-bold text-caption") Token
      draggable(v-model="tokens" tag="tbody")
        tr(v-for="[index, token] in Object.entries(tokens)" :key="token.tempHash")
          td(class="col-2")
            .text {{ Number(index) + 1 }}
          td
            .text {{ token.symbol }}
    .flex.justify-center.q-mt-lg
      q-btn.q-my-auto(label="Save" color="primary" @click="onSelectedSave")
</template>

<script>
import { mapActions, mapState } from 'vuex'
import draggable from 'vuedraggable'

export default {
  name: 'modal-drag-token-list',
  display: 'Table',
  order: 8,
  components: {
    draggable
  },
  data () {
    return {
      tokens: []
    }
  },
  async created () {
    if (!this.tokensWithUserSort) {
      this.getTokenWithUserSort()
    }
    await this.getUserTokens()
  },
  computed: {
    ...mapState('tokens', ['tokensWithUserSort'])
  },
  methods: {
    ...mapActions('tokens', ['getTokens', 'saveTokenWithUserSort', 'getTokenWithUserSort']),
    async getUserTokens () {
      if (!this.tokensWithUserSort) {
        this.tokens = await this.getTokens()
        return
      }
      this.tokens = JSON.parse(JSON.stringify(this.tokensWithUserSort))
    },
    onSelectedSave () {
      this.saveTokenWithUserSort(this.tokens)
      this.$emit('close')
    }
  }
}
</script>
<style scoped>
.buttons {
  margin-top: 35px;
}
</style>
