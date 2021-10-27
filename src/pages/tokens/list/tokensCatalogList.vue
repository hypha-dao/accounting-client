<template lang="pug">
q-card.q-pa-sm.full-width
  #container
    q-table.sticky-virtscroll-table.q-mt-sm.t-table(
        :columns="columns"
        :data="tokens"
        virtual-scroll
        :rows-per-page-options="[0]"
        :virtual-scroll-item-size="pageSize - 2"
        :virtual-scroll-sticky-size-start="pageSize - 3"
        dense
    )
      template(v-slot:body-cell-symbol="props")
        q-td.short-input
          q-input.short-input(v-if="editingRow === props.row.hash" autofocus v-model="props.row.symbol" dense :label="$t('pages.tokens.symbol')" color="secondary")
          .text-cell.short-input(v-else) {{ props.row.symbol }}
      //- template(v-slot:body-cell-precision="props")
        q-td.short-input
          q-input.short-input(v-if="editingRow === props.row.hash" autofocus v-model="props.row.precision" dense :label="$t('pages.tokens.precision')" color="secondary")
          .text-cell.short-input(v-else) {{ props.row.precision }}
      template(v-slot:body-cell-actions="props")
        q-td.q-gutter-xs.text-right
          //- q-btn(v-if="editingRow !== props.row.hash" icon="edit" round size="xs" color="positive" @click="onClickEditRow(props.row)")
          q-btn(v-if="editingRow === props.row.hash" icon="save" round size="xs" color="primary" @click="onClickSaveRow(props.row)")
          q-btn(v-if="addingToken && editingRow === props.row.hash" icon="close" round size="xs" color="negative" @click="onClickCancelAdding(props.row)")
          q-btn(v-if="editingRow === false" icon="delete" round size="xs" color="negative" @click="onClickRemoveRow(props.row)")
      template(v-slot:bottom v-if="!addingToken")
        q-tr
          q-btn.full-width(style="font-size: 12px" no-caps icon="add" size="sm" :label="$t('pages.tokens.addToken')" @click="onClickAddRow")
      template(v-slot:no-data v-if="!addingToken")
        q-tr
          q-btn.full-width(style="font-size: 12px" no-caps icon="add" size="sm" :label="$t('pages.tokens.addToken')" @click="onClickAddRow")
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'tokens-list',
  data () {
    return {
      addingToken: false,
      editingRow: false,
      pageSize: 20,
      nextPage: 2,
      tokens: [],
      columns: [
        {
          name: 'symbol',
          align: 'left',
          label: this.$t('pages.tokens.symbol'),
          field: row => row.name,
          sortable: true,
          headerClasses: 'bg-secondary text-white'
        },
        // {
        //   name: 'precision',
        //   align: 'left',
        //   label: this.$t('pages.tokens.precision'),
        //   field: row => row.precision,
        //   sortable: true,
        //   headerClasses: 'bg-secondary text-white'
        // },
        {
          name: 'actions',
          align: 'center',
          label: this.$t('pages.transactions.actions'),
          field: row => row.actions,
          sortable: true,
          headerClasses: 'bg-secondary text-white'
        }
      ]
    }
  },
  async mounted () {
    this.tokens = await this.getTokens()
  },
  methods: {
    ...mapActions('tokens', ['addToken', 'removeToken', 'getTokens']),
    onClickAddRow () {
      if (!this.addingToken) {
        this.addingToken = true
        const tempHash = [...Array(8)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')
        this.tokens.push({
          hash: tempHash,
          precision: 4,
          symbol: ''
        })
        this.editingRow = tempHash
      }
    },
    onClickEditRow (row) {
      if (this.editingRow !== false) {
        if (!this.onClickSaveRow(row)) {
          return
        }
      }
      this.editingRow = row.hash
    },
    async onClickSaveRow (row) {
      if (!this.validateRow(row)) {
        this.showErrorMsg(this.$t('forms.errors.allComponentFilled'))
        return
      }
      try {
        const transaction = await this.addToken({ symbol: `${row.precision},${row.symbol}` })
        if (!transaction) return
        console.log(transaction)
        this.editingRow = false
        this.addingToken = false
      } catch (error) {
        this.onClickRemoveRow(row)
        this.showErrorMsg('Error to add token')
      }
    },
    onClickCancelAdding (row) {
      this.editingRow = false
      this.addingToken = false
      this.tokens = this.tokens.filter(v => row !== v)
    },
    async onClickRemoveRow (row) {
      try {
        const transaction = await this.removeToken({ symbol: `${row.precision},${row.symbol}` })
        console.log(transaction)
        this.tokens = this.tokens.filter(v => row !== v)
      } catch (error) {
        this.showErrorMsg('Error to remove token')
      }
    },
    validateRow (row) {
      const dataToValidate = ['symbol', 'precision']
      console.log(!dataToValidate.some(key => row[key] === undefined || row[key] === ''))
      return !dataToValidate.some(key => row[key] === undefined || row[key] === '')
    }
  }
}
</script>

<style lang="sass" scoped>
.t-table
  height: 35vh
</style>
