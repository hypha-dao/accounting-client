<template lang="pug">
q-card.responsive-modal.custom-modal
  #container.q-pa-md.q-gutter-sm
    .text-subtitle1.text-weight-thinDrag and drop a token on the list to change its position in the table
    q-markup-table(separator="cell" dense).scroll
      thead
        tr
          th(class="bg-secondary text-uppercase")
            span(class="text-bold text-caption") Position
          th(class="bg-secondary text-uppercase no-border")
            span(class="text-bold text-caption") Token
      draggable(v-model="tokens" tag="tbody")
        tr.drag.cursor-pointer(v-for="[index, token] in Object.entries(tokens)" :key="token.tempHash")
          td(class="col-2")
            .row.items-center
              q-icon.q-mr-sm(
                name="drag_handle"
                size="md"
                color="grey-8"
              )
              .text.no-padding {{ Number(index) + 1 }}
          td
            .text {{ token.symbol }}
          q-tooltip(:delay="1000" :offset="[10, 10]") Drag to sort
    .row.justify-center.q-mt-lg
      .col
        q-btn.full-width.q-my-auto(label="Save" color="primary" @click="onSelectedSave")
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
<style lang="sass" scoped>
.buttons
  margin-top: 35px
.drag
  transition: all 1.5s
.custom-modal
  max-height: 600px
</style>
