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
    template(v-slot:top-right)
      q-input(filled v-model="date" dense mask="date" label="Date" color="secondary")
        template(v-slot:append)
         q-icon(name="event" class="cursor-pointer")
          q-popup-proxy(ref="qDateProxy" transition-show="scale" transition-hide="scale")
            q-date(v-model="date" today-btn)
              div(class="row items-center justify-end")
                q-btn(v-close-popup label="Close" color="primary" flat)
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
          min="0"
        )
  .flex.justify-center.q-mt-lg
    q-btn.q-my-auto(label="Convert" color="primary" @click="onSelectedConvert")
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import TimeUtil from '../../../utils/TimeUtil'

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
          label: 'USD Exchange Rate',
          align: 'left',
          sortable: false
        }
      ],
      date: undefined,
      dateNow: undefined
    }
  },
  async mounted () {
    if (!this.exchangeDate) {
      const date = new Date(Date.now())
      this.date = TimeUtil.formatDateForDatePicker(date)
      this.dateNow = TimeUtil.formatDateForDatePicker(date)
      this.loadTokens()
      return
    }
    this.date = this.exchangeDate
    if (this.tokensWithUserExange) {
      this.currencies = JSON.parse(JSON.stringify(this.tokensWithUserExange))
      return
    }
    await this.loadTokenByDate()
  },
  computed: {
    ...mapState('tokens', ['tokensWithExchange', 'tokensWithUserExange', 'exchangeDate']),
    validExchangeValues () {
      return this.currencies.find(v => v.exchange < 0)
    }
  },
  watch: {
    date () {
      if (this.date !== this.dateNow) this.loadTokenByDate()
    }
  },
  methods: {
    ...mapActions('tokens', ['getTokens', 'getExchangeRateForDateAndToken']),
    ...mapMutations('tokens', ['setTokensWithUserExange', 'setExchangeDate']),
    async loadTokens () {
      if (this.tokensWithUserExange) {
        this.currencies = JSON.parse(JSON.stringify(this.tokensWithUserExange))
        return
      }
      const userTokens = await this.getTokens()
      this.currencies = userTokens.map(token => {
        const { price, id } = this.tokensWithExchange.find(t => t.symbol === token.symbol.toLowerCase()) || 0

        return {
          id,
          name: token.symbol,
          isSelected: false,
          exchange: price || 0
        }
      })
    },
    onSelectedConvert () {
      if (!this.currencies) return
      if (this.validExchangeValues) {
        this.showErrorMsg(this.$t('pages.tokens.exchange_rate_invalid'))
        return
      }
      this.setTokensWithUserExange(this.currencies)
      this.setExchangeDate(this.date)
      const selected = this.currencies.filter(curr => curr.isSelected === true)
      this.$emit('convert', selected)
    },
    async loadTokenByDate () {
      if (!this.date) return
      if (this.date === this.dateNow) {
        this.loadTokens()
        return
      }
      const [year, month, day] = this.date.split('/')
      const date = `${day}-${month}-${year}`
      for (const [index, token] of this.currencies.entries()) {
        if (token.id) {
          const exchange = await this.getExchangeRateForDateAndToken({ token: token.id, date: date })
          this.currencies[index].exchange = exchange
        }
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.sticky-virtscroll-table
  max-height: 700px
  height: 400px
</style>
