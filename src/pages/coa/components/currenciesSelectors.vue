<template lang="pug">
#container.q-pa-md.q-gutter-sm
  q-table.sticky-virtscroll-table(
    :columns="columns"
    row-key="name"
    :data="currencies"
    virtual-scroll
    :rows-per-page-options="[0]"
    hide-bottom
  )
    template(v-slot:header="props")
      q-tr(:props="props")
        q-th(
          v-for="col in props.cols"
          :key="col.name"
          :props="props"
          class="bg-secondary text-uppercase"
        )
          span(class="text-bold text-caption") {{ col.label }}
    template(v-slot:body-cell-token="props")
      q-td(:props="props")
        q-checkbox(size="xs" :label="props.row.name" v-model="props.row.isSelected")
    template(v-slot:body-cell-exchange="props")
      q-td(:props="props")
        q-input(
          prefix="$"
          type="number"
          borderless
          v-model="props.row.exchange"
        )
  .flex.justify-center.q-mt-lg
    q-btn.q-my-auto(label="Convert" color="primary" @click="onSelectedConvert")
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'currenciesSelector',
  data () {
    return {
      currencies: undefined,
      columns: [
        {
          name: 'token',
          label: 'Token',
          align: 'left',
          field: row => row.name,
          sortable: true,
          require: true
        },
        {
          name: 'exchange',
          label: 'HUSD Exchange Rate',
          align: 'left',
          sortable: false
        }
      ]
    }
  },
  async mounted () {
    await this.loadTokens()
  },
  methods: {
    ...mapActions('tokens', ['getTokens']),
    async loadTokens () {
      const tokens = await this.getTokens()
      this.currencies = tokens.map(token => {
        console.log(token)
        return {
          name: token.symbol,
          isSelected: false,
          exchange: 0
        }
      })
    },
    onSelectedConvert () {
      if (!this.currencies) return
      const selected = this.currencies.filter(curr => curr.isSelected === true)
      this.$emit('convert', selected)
    }
  }
}
</script>

<style lang="sass" scoped>
.scroll
  max-height: 500px
</style>
