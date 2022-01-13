<template lang='pug'>
#container-tree.full-width
    //- q-input.full-width(
    //-   v-model="filter"
    //-   label="Filter by Account Code"
    //-   autofocus
    //- )
    vue-ads-table-tree.full-width.scroll(
      :columns='columns',
      :rows='treeAccountsTemp',
      :page='page',
      :call-children="loadChildren"
      :call-rows="loadChildren"
      :call-temp-rows="callTempRows"
      @filter-change='filterChanged',
      @page-change='pageChanged',
      :filter="filter"
      :classes="tableTreeClasses"
      selectable
      @selection-change="selectAccount"
    )
      template(slot="top")
        div
      template.container-btn.cursor-pointer.flex.selectedRow(slot='accountName' slot-scope='props' @click="selectAccount([props.row])")
        .main-column(@click="selectAccount([props.row])")
          .row(@click="selectAccount([props.row])" :class="(props.row.isSelectable || allSelecteable) ? 'selectableRow' : undefined")
            //- q-icon.q-mr-sm(v-if="!props.row.isSelectable" name="account_balance", size="20px")
            //- q-radio.q-mr-sm(v-if="props.row.isSelectable || allSelecteable" dense v-model="accountSelected" :val="props.row")
            p {{ props.row.accountName }}
      //- template.cursor-pointer.flex(slot='BTC' slot-scope='props')
      //-   .row.justify-end(@click="selectAccount(props.row)" :class="(props.row === accountSelected) ? 'selectedRow' : ''")
      //-       p {{ props.row.BTC }}
      //- template.cursor-pointer.flex(slot='BTC' slot-scope='props')
      //-   .row.justify-end(@click="selectAccount(props.row)" :class="(props.row === accountSelected) ? 'selectedRow' : ''")
      //-       p {{ props.row.BTC }}
      //- template.cursor-pointer.flex(slot='ETH' slot-scope='props')
      //-   .row.justify-end.cursor-pointer
      //-       p {{ props.row.ETH }}
      //- template.cursor-pointer.flex(slot='EOS' slot-scope='props')
      //-   .row.justify-end.cursor-pointer
      //-       p {{ props.row.EOS }}
      //- template.cursor-pointer.flex(slot='TLOS' slot-scope='props')
      //-   .row.justify-end.cursor-pointer
      //-       p {{ props.row.TLOS }}
      //- template.cursor-pointer.flex(slot='HUSD' slot-scope='props')
      //-   .row.justify-end.cursor-pointer
      //-       p {{ props.row.HUSD }}
      //- template.cursor-pointer.flex(slot='SEEDS' slot-scope='props')
      //-   .row.justify-end.cursor-pointer
      //-       p {{ props.row.SEEDS }}
      //- template.cursor-pointer.flex(slot='HYPHA' slot-scope='props')
      //-   .row.justify-end.cursor-pointer
      //-       p {{ props.row.HYPHA }}
      template(v-if="exchanges").cursor-pointer.flex(slot='USD' slot-scope='props')
        .row.justify-end
            p {{ props.row.USD }}
      template.container-btn.cursor-pointer.flex(slot='actions' slot-scope='props')
        .row.justify-center
          q-icon.animated-icon(
              name="edit"
              v-ripple
              size="sm"
              color="positive"
              @click="onEditAccount(props.row)"
          )
</template>

<script>
import VueAdsTableTree from 'vue-ads-table-tree'
import '~/../node_modules/@fortawesome/fontawesome-free/css/all.css'
import '~/pages/accounts/components/custom-table-tree-style.css'
import { mapActions, mapState } from 'vuex'
export default {
  name: 'coa-table-tree',
  components: {
    VueAdsTableTree
    // VueAdsPagination,
    // VueAdsPageButton
  },
  props: {
    value: {},
    allSelecteable: Boolean,
    exchanges: {
      type: Array,
      default: () => undefined
    }
  },
  async mounted (v) {
    // console.log('account on mounted', this.value)
    this.getTokenWithUserSort()
    console.log(this.allSelecteable)
    await this.loadAccounts()
    this.tokens = await this.getTokens()
    this.setUpColumns()

    this.addColumnOnTable()
    this.addStyleForExchangeColumn()
    // if (this.treeAccounts.length === 0) {
    // } else {
    //   this.treeAccountsTemp = Array.from(this.treeAccounts)
    // }
    // this.loadRows()
    // console.log('accounts by project', this.accountList)

    // this.$store.$EventBus.$on('accounts-updated', () => {
    //   console.log('Event bus listened')
    //   this.childrenOpened = []
    //   this.findChildrenOpened(this.rows)
    //   this.loadRows()
    // })
  },
  beforeDestroy () {
    // this.$store.$EventBus.$off('accounts-updated')
  },
  watch: {
    accountSelected (v) {
      this.$emit('selectedAccount', v)
      // this.$emit('input', v)
    },
    exchanges () {
      console.log(this.exchanges)
      this.loadAccounts()
      this.addColumnOnTable()
      this.addStyleForExchangeColumn()
    },
    tokensWithUserSort () {
      this.setUpColumns()
      this.addColumnOnTable()
      this.addStyleForExchangeColumn()
    }
  },
  computed: {
    ...mapState('contAccount', ['treeAccounts']),
    ...mapState('tokens', ['tokensWithUserExange', 'tokensWithUserSort']),
    keyFromSyles () {
      let key = ''
      if (!this.exchanges) return ''
      const tokens = this.exchanges.map(v => v.name)
      this.columns.forEach((c, index) => {
        if (tokens.includes(c.title)) {
          key = `${key}${index},`
        }
      })
      return key.slice(0, key.length - 1)
    }
  },
  methods: {
    ...mapActions('contAccount', ['getChartOfAccounts', 'getAccountById', 'getAccountByCode']),
    ...mapState('contAccount', ['components']),
    ...mapActions('tokens', ['getTokens', 'getTokenWithUserSort']),
    setUpColumns () {
      this.columns = this.columns.slice(0, 2)
      let tokensColumns
      if (!this.tokensWithUserSort) {
        tokensColumns = this.tokens.map(token => {
          return {
            property: token.symbol,
            title: token.symbol,
            direction: null,
            filterable: true,
            collapseIcon: false
          }
        })
      } else {
        tokensColumns = this.tokensWithUserSort.map(token => {
          return {
            property: token.symbol,
            title: token.symbol,
            direction: null,
            filterable: true,
            collapseIcon: false
          }
        })
      }

      tokensColumns.push({
        property: 'actions',
        title: 'Actions',
        filterable: false,
        sortable: false,
        sort: false,
        direction: 'right',
        collapseIcon: false
      })
      // this.columns.push(tokensColumns)
      this.columns = this.columns.concat(tokensColumns)
    },
    onEditAccount (row) {
      // accountCode
      // accountName
      // hash
      // parentHash
      const account = {
        uid: row.uid,
        accountCode: row.accountCode,
        accountName: row.accountName,
        hash: row.hash,
        parentHash: row.parentHash
      }
      console.log(account)
      this.$emit('onClickEditAccount', account)
    },
    // ...mapMutations('contAccount', ['setTreeAccounts']),
    async callTempRows (filter) {
      try {
        // console.log('callTempRows', filter)
        const children = await this.getAccountByCode({ code: filter })
        // console.log('tempRowsGot', children)
        if (!children) {
          // console.log('return callTempRows')
          return undefined
        }
        const childrenFormatted = await this.setUpAccountChildrenTemp(children)

        const tempRows = {
          rows: childrenFormatted,
          total: childrenFormatted.length
        }
        // console.log('tempRows', tempRows)
        return tempRows
      } catch (e) {
        return {
          rows: [],
          total: 0
        }
      }
    },
    selectAccount (account) {
      console.log('selectedAccount', account)
      if (account[0]) {
        this.accountSelected = account[0]
      } else {
        this.accountSelected = undefined
      }
      // if (account.account) {
      //   console.log('selectedAccount', account)
      // }
    },
    async loadAccounts () {
      console.log('loadAccounts', this.columns)
      this.accounts = await this.getChartOfAccounts()
      if (!this.accounts || !this.accounts.accounts) return undefined
      const result = this.accounts.accounts.map(account => {
        const content = account.content_groups[0].contents
        let amount = this.getComponentsOfAccount(account.hash)
        // console.log('loadAccounts', content)
        const accountv = account.accountv[0].content_groups[0].contents
        const balances = account.balances[0].content_groups[0].contents
        const parentHash = account.ownedby[0].hash

        // Get Balances
        const BTC = balances.find(v => v.label === 'global_BTC')
        const ETH = balances.find(v => v.label === 'global_ETH')
        const EOS = balances.find(v => v.label === 'global_EOS')
        const TLOS = balances.find(v => v.label === 'global_TLOS')
        const HUSD = balances.find(v => v.label === 'global_HUSD')
        const SEEDS = balances.find(v => v.label === 'global_SEEDS')
        const HYPHA = balances.find(v => v.label === 'global_HYPHA')
        let usdInfo = {}
        if (this.exchanges) {
          let usd = 0
          balances.forEach((balance, index) => {
            const token = this.exchanges?.find(v => balance.label.includes('global_' + v.name))
            console.log(token)
            if (token) {
              const balanceValue = balance ? balance.value.replace(/[^\d.-]/g, '') : 0
              usd = (Number(balanceValue) * token.exchange) + Number(usd)
            }
          })
          const usdExchange = this.formatAmount(usd)
          usdInfo['exchange'] = usdExchange > 0 ? `$${usdExchange}` : `-$${usdExchange * -1}`
        }

        console.log('loadAccounts balances', balances)
        return {
          accountName: accountv.find(v => v.label === 'account_name').value,
          // parentAccount: content.find(v => v.label === 'parent_account').value,
          hash: account.hash,
          uid: account.uid,
          _id: account.uid,
          _hasChildren: !!account.account,
          isSelectable: !account.account,
          _selectable: !account.account,
          accountCode: content.find(v => v.label === 'account_code').value,
          typeTag: content.find(v => v.label === 'account_tag_type').value,
          BTC: this.formatAmount(BTC ? BTC.value.replace(/[^\d.-]/g, '') : '0'),
          ETH: this.formatAmount(ETH ? ETH.value.replace(/[^\d.-]/g, '') : '0'),
          EOS: this.formatAmount(EOS ? EOS.value.replace(/[^\d.-]/g, '') : '0'),
          TLOS: this.formatAmount(TLOS ? TLOS.value.replace(/[^\d.-]/g, '') : '0'),
          HUSD: this.formatAmount(HUSD ? HUSD.value.replace(/[^\d.-]/g, '') : '0'),
          SEEDS: this.formatAmount(SEEDS ? SEEDS.value.replace(/[^\d.-]/g, '') : '0 '),
          HYPHA: this.formatAmount(HYPHA ? HYPHA.value.replace(/[^\d.-]/g, '') : '0 '),
          parentHash,
          ...usdInfo,
          //   ETH: balances.find(v => v.label === 'global_ETH').value || 0,
          amount
        }
      })
      //   this.setTreeAccounts(Object.create(result))
      this.treeAccountsTemp = result
    },
    findChildrenOpened (parent) {
      parent.forEach(children => {
        if (children._showChildren === true) {
          this.childrenOpened.push(children)
          this.findChildrenOpened(children._children)
        }
      })
    },
    sleep (ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    },
    async setUpAccountChildren (children) {
      // console.log('original children', children)
      const accounts = children.data.account[0].account
      // console.log('children acc', accounts)

      if (!accounts) return
      return accounts.map(account => {
        const content = account.content_groups[0].contents
        const accountv = account.accountv[0].content_groups[0].contents
        const balances = account.balances[0].content_groups[0].contents
        const parentHash = account.ownedby[0].hash

        // Get Balances
        const BTC = balances.find(v => v.label === 'global_BTC')
        const ETH = balances.find(v => v.label === 'global_ETH')
        const EOS = balances.find(v => v.label === 'global_EOS')
        const TLOS = balances.find(v => v.label === 'global_TLOS')
        const HUSD = balances.find(v => v.label === 'global_HUSD')
        const SEEDS = balances.find(v => v.label === 'global_SEEDS')
        const HYPHA = balances.find(v => v.label === 'global_HYPHA')

        let usdInfo = {}
        if (this.exchanges) {
          let usd = 0
          balances.forEach(balance => {
            const token = this.exchanges?.find(v => balance.label.includes('global_' + v.name))
            if (token) {
              const balanceValue = balance ? balance.value.replace(/[^\d.-]/g, '') : 0
              usd = (Number(balanceValue) * token.exchange) + Number(usd)
            } else {
              console.log(balance, accountv.find(v => v.label === 'account_name').value)
            }
          })
          usdInfo['exchange'] = this.formatAmount(usd)
        }
        console.log(!!account.account, account.account, !account.account, accountv.find(v => v.label === 'account_name').value)

        return {
          accountName: accountv.find(v => v.label === 'account_name').value,
          // parentAccount: content.find(v => v.label === 'parent_account').value,
          parentAccount: account.ownedby[0].hash,
          hash: account.hash,
          uid: account.uid,
          _hasChildren: !!account.account,
          isSelectable: !account.account,
          _selectable: !account.account,
          _id: account.uid,
          typeTag: content.find(v => v.label === 'account_tag_type').value,
          accountCode: content.find(v => v.label === 'account_code').value,
          BTC: BTC ? BTC.value.replace(/[^\d.-]/g, '') : '0',
          ETH: ETH ? ETH.value.replace(/[^\d.-]/g, '') : '0',
          EOS: EOS ? EOS.value.replace(/[^\d.-]/g, '') : '0',
          TLOS: TLOS ? TLOS.value.replace(/[^\d.-]/g, '') : '0',
          HUSD: HUSD ? HUSD.value.replace(/[^\d.-]/g, '') : '0',
          SEEDS: SEEDS ? SEEDS.value.replace(/[^\d.-]/g, '') : '0 ',
          HYPHA: HYPHA ? HYPHA.value.replace(/[^\d.-]/g, '') : '0 ',
          parentHash,
          ...usdInfo
          // _meta: { visibleChildren: !!account.account }
        }
      })
    },
    async setUpAccountChildrenTemp (children) {
      // console.log('original children', children)
      const account = children.value
      // console.log('children acc', account)
      // const content = account.content_groups[0].contents
      return [
        {
          ...account,
          _id: account.uid,
          typeTag: account.typeTag,
          isSelectable: !account._hasChildren,
          _hasChildren: false,
          _meta: { groupParent: 1, visibleChildren: true }
        }
      ]
      // return {
      //   accountName: account.accountName,
      //   parentAccount: account.ownedby.hash,
      //   hash: account.hash,
      //   uid: account.uid,
      //   _id: account.uid,
      //   _hasChildren: false,
      //   isSelectable: !account.account,
      //   typeTag: content.find(v => v.label === 'account_tag_type').value,
      //   accountCode: content.find(v => v.label === 'account_code').value,
      //   _meta: { visibleChildren: true, groupParent: 1 }
      // }
      // return accounts.map(account => {
      //   const content = account.content_groups[0].contents
      //   return {
      //     accountName: content.find(v => v.label === 'account_name').value,
      //     parentAccount: account.ownedby.hash,
      //     hash: account.hash,
      //     uid: account.uid,
      //     _id: account.uid,
      //     _hasChildren: false,
      //     isSelectable: !account.account,
      //     typeTag: content.find(v => v.label === 'account_tag_type').value,
      //     accountCode: content.find(v => v.label === 'account_code').value,
      //     _meta: { visibleChildren: true, groupParent: 1 }
      //   }
      // })
    },
    async loadChildren (e) {
      try {
        const children = await this.getAccountById({ uid: e.uid })
        // console.log('loadChildren response', e.uid, children)
        console.log(children)
        const childrenFormatted = await this.setUpAccountChildren(children)
        console.log(childrenFormatted, 'Formato de los hijos')
        // console.log('loadChildren', childrenFormatted)
        return childrenFormatted
      } catch (e) {
        console.warn('children not loaded')
      }
    },
    filterChanged (filter) {
      this.filter = filter
    },
    pageChanged (page) {
      this.page = page
    },
    openRow (row) {
      // console.log('row selected')
      this.$emit('rowSelected', row)
    },
    async getComponentsOfAccount (hash) {
      let comps = await this.components()
      let ownComps = comps.filter(v => v.accountHash === hash)

      return ownComps.reduce((acc, curr) => {
        return acc + curr
      }, 0)
    },
    addColumnOnTable () {
      if (this.exchanges?.length === 0) {
        this.columns = this.columns.filter(c => !c.property.includes('exchange'))
        return
      }
      let column = this.columns.find(c => c.property.includes('exchange'))
      if (column && this.exchanges.length === 0) {
        this.columns = this.columns.filter(c => !c.property.includes('exchange'))
        return
      }
      if (column) {
        this.columns = this.columns.filter(c => !c.property.includes('exchange'))
        column = undefined
      }
      if (!column && this.exchanges?.length > 0) {
        const n = this.columns.findIndex(c => c.property === 'accountCode')
        console.log(n, 'Este es el index')
        this.columns.splice(n + 1, 0, {
          property: 'exchange',
          title: 'USD (Converted)',
          direction: null,
          filterable: true,
          collapseIcon: false
        })
        console.log(this.columns, 'Columnas')
      }
    },
    addStyleForExchangeColumn () {
      if ((!this.exchanges || this.exchanges.length === 0) && this.tokensColumns !== '') {
        delete this.tableTreeClasses[this.tokensColumns]
        delete this.tableTreeClasses['0/2']
        this.tableTreeClasses = JSON.parse(JSON.stringify(this.tableTreeClasses))
        return
      }
      if (this.keyFromSyles === '') return
      const key = '0/' + this.keyFromSyles
      if (key === this.tokensColumns) return
      if (this.tableTreeClasses[this.tokensColumns]) {
        delete this.tableTreeClasses[this.tokensColumns]
        delete this.tableTreeClasses['0/2']
      }
      this.tokensColumns = key
      const newObj = {
        '0/2': {
          'text-positive': true
        }
      }
      newObj[key] = {
        'text-positive': true
      }
      this.tableTreeClasses = { ...this.tableTreeClasses, ...newObj }
      console.log(this.tableTreeClasses, 'Styles')
    }
  },
  data () {
    return {
      tableTreeClasses: {
        table: {
          'vue-ads-border': true,
          'vue-ads-w-full': true
        },
        info: {
          'vue-ads-text-center': true,
          'vue-ads-py-6': true,
          'vue-ads-text-sm': true,
          'vue-ads-border-t': true
        },
        group: {
          'vue-ads-font-bold': true,
          'vue-ads-border-b': true,
          'vue-ads-italic': true
        },
        selected: {
          'vue-ads-bg-selected': true
        },
        'all/': {
          'hover:vue-ads-bg-gray-200': true
        },
        'all/all': {
          'vue-ads-px-4': true,
          'vue-ads-py-2': true,
          'vue-ads-text-sm': true,
          'cursor-pointer': true
        },
        'even/': {
          'vue-ads-bg-gray-100': true
        },
        'odd/': {
          'vue-ads-bg-white': true
        },
        '0/': {
          'vue-ads-bg-gray-100': false,
          'hover:vue-ads-bg-gray-200': false
        },
        '0/all': {
          'vue-ads-px-4': true,
          'vue-ads-py-2': true,
          'vue-ads-text-left': true
        },
        '0_-1/': {
          'vue-ads-border-b': true
        },
        '/0_-1': {
          'vue-ads-border-r': true
        },
        'all/2_-1': {
          'text-right': true
        }
      },
      treeAccountsTemp: [],
      childrenOpened: [],
      page: 0,
      filter: '',
      columns: [
        {
          property: 'accountName',
          title: 'Account Name',
          direction: null,
          filterable: true
        },
        {
          property: 'accountCode',
          title: 'Code',
          direction: null,
          filterable: true,
          collapseIcon: false
        }
        // {
        //   property: 'BTC',
        //   title: 'BTC',
        //   filterable: true,
        //   collapseIcon: false
        // },
        // {
        //   property: 'ETH',
        //   title: 'ETH',
        //   filterable: true,
        //   collapseIcon: false
        // },
        // {
        //   property: 'EOS',
        //   title: 'EOS',
        //   direction: null,
        //   filterable: true,
        //   collapseIcon: false
        // },
        // {
        //   property: 'TLOS',
        //   title: 'TLOS',
        //   direction: null,
        //   filterable: true,
        //   collapseIcon: false
        // },
        // {
        //   property: 'HUSD',
        //   title: 'HUSD',
        //   direction: null,
        //   filterable: true,
        //   collapseIcon: false
        // },
        // {
        //   property: 'SEEDS',
        //   title: 'SEEDS',
        //   direction: null,
        //   filterable: true,
        //   collapseIcon: false
        // },
        // {
        //   property: 'HYPHA',
        //   title: 'HYPHA',
        //   direction: null,
        //   filterable: true,
        //   collapseIcon: false
        // },
        // {
        //   property: 'actions',
        //   title: 'Actions',
        //   filterable: false,
        //   sortable: false,
        //   sort: false,
        //   direction: 'right',
        //   collapseIcon: false
        // }
        // {
        //   property: 'typeTag',
        //   title: 'Type',
        //   direction: null,
        //   filterable: true,
        //   collapseIcon: false
        // }
      ],
      rows: [],
      accounts: undefined,
      accountsTree: undefined,
      accountSelected: undefined,
      tokens: undefined,
      tokensColumns: ''
    }
  }
}
</script>

<style lang="sass" scoped>
.container-btn
  background-color: red !important
  padding: 20px !important
.main-column
  display: inline-block
  cursor: pointer
  vertical-align: middle
.custom-row
  display: inline-block
.custom-row:hover
  background-color: red
.selectableRow
  cursor: pointer
table
  background-color: green !important
  padding: 100px !important
#container-tree
  min-width: 100px
  max-width: 2000px
</style>
