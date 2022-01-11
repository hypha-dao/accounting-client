<template lang='pug'>
#container-tree.full-width
    q-input.full-width(
      v-model="filter"
      label="Filter by Account Code"
      autofocus
    )
    vue-ads-table-tree.full-width(
      :columns='columns',
      :rows='treeAccountsTemp',
      :page='page',
      :call-children="loadChildren"
      :call-rows="loadChildren"
      :call-temp-rows="callTempRows"
      @filter-change='filterChanged',
      @page-change='pageChanged',
      :filter="filter"
    )
      template(slot="top")
        div
      template.container-btn.cursor-pointer.flex(slot='accountName' slot-scope='props' @click="selectAccount(props.row)")
        .main-column(@click="selectAccount(props.row)")
          .row(:class="(props.row.isSelectable || allSelecteable) ? 'selectableRow' : undefined")
            //- q-icon.q-mr-sm(name="account_balance", size="20px")
            q-radio.q-mr-sm(v-if="props.row.isSelectable || allSelecteable" dense v-model="accountSelected" :val="props.row")
            p {{ props.row.accountName }}
          //- .row
          //-   q-icon.q-mr-sm(name="account_balance", size="20px")
          //-   q-radio.q-mr-sm(dense v-model="accountSelected" :val="props.row")
          //-   p {{ props.row.accountName }}
</template>

<script>
import VueAdsTableTree from 'vue-ads-table-tree'
import '~/../node_modules/@fortawesome/fontawesome-free/css/all.css'
import './custom-table-tree-style.css'
import { mapActions, mapState, mapMutations } from 'vuex'
export default {
  name: 'custom-table-tree',
  components: {
    VueAdsTableTree
    // VueAdsPagination,
    // VueAdsPageButton
  },
  props: {
    value: {},
    allSelecteable: Boolean
  },
  mounted (v) {
    // console.log('account on mounted', this.value)
    if (this.treeAccounts.length === 0) {
      this.loadAccounts()
    } else {
      this.treeAccountsTemp = Array.from(this.treeAccounts)
    }
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
      this.$emit('input', v)
      this.$emit('account-selected')
    }
  },
  computed: {
    ...mapState('contAccount', ['treeAccounts'])
  },
  methods: {
    ...mapActions('contAccount', ['getChartOfAccounts', 'getAccountById', 'getAccountByCode']),
    ...mapState('contAccount', ['components']),
    ...mapMutations('contAccount', ['setTreeAccounts']),
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
      if (account.account) {
        this.accountSelected = account
      }
    },
    async loadAccounts () {
      // console.log('loadAccounts')
      this.accounts = await this.getChartOfAccounts()
      if (!this.accounts || !this.accounts.accounts) return undefined
      const result = this.accounts.accounts.map(account => {
        const content = account.content_groups[0].contents
        let amount = this.getComponentsOfAccount(account.hash)
        console.log('loadAccounts', content)
        const accountv = account.accountv[0].content_groups[0].contents
        return {
          accountName: accountv.find(v => v.label === 'account_name').value,
          // parentAccount: content.find(v => v.label === 'parent_account').value,
          hash: account.hash,
          uid: account.uid,
          _id: account.uid,
          _hasChildren: !!account.account,
          accountCode: content.find(v => v.label === 'account_code').value,
          typeTag: content.find(v => v.label === 'account_tag_type').value,
          amount
        }
      })
      this.setTreeAccounts(Object.create(result))
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
        return {
          accountName: accountv.find(v => v.label === 'account_name').value,
          // parentAccount: content.find(v => v.label === 'parent_account').value,
          parentAccount: account.ownedby[0].hash,
          hash: account.hash,
          uid: account.uid,
          _hasChildren: !!account.account,
          _id: account.uid,
          isSelectable: !account.account,
          typeTag: content.find(v => v.label === 'account_tag_type').value,
          accountCode: content.find(v => v.label === 'account_code').value
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
    }
  },
  data () {
    return {
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
      accountSelected: undefined
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
#container-tree
  min-width: 100px
  max-width: 2000px
</style>
