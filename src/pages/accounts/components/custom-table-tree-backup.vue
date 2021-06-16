<template lang='pug'>
#container
  div
    //- vue-ads-table-tree(
    //-   :columns='columns',
    //-   :rows='rows',
    //-   :page='page',
    //-   @filter-change='filterChanged',
    //-   @page-change='pageChanged',
    //-   :call-children="loadChildren"
    //-   :call-rows="loadChildren"
    //- )
    vue-ads-table-tree(
      :columns='columns',
      :rows='accountsTree',
      :page='page',
      :call-children="loadChildren"
      :call-rows="loadChildren"
      @filter-change='filterChanged',
      @page-change='pageChanged',
    )
      template(slot="top")
        div
      template.container-btn.cursor-pointer.flex(slot='accountName' slot-scope='props' @click="selectAccount(props.row)")
        .main-column(@click="selectAccount(props.row)")
          .row(:class="(props.row.isSelectable) ? 'selectableRow' : undefined")
            q-icon.q-mr-sm(name="account_balance", size="20px")
            q-radio.q-mr-sm( v-if="props.row.isSelectable" dense v-model="accountSelected" :val="props.row")
            p {{ props.row.accountName }}
      //- template.container-btn(slot='action' slot-scope='props')
      //-   .row.justify-center
      //-     //- q-btn(round color="cyan-6" icon="info" size="xs" @click="doAction(props.row)")
      //-     q-btn(color="secondary", :label="$t('common.buttons.actions')", icon-right="expand_more")
            //- q-menu(
            //-   transition-show="jump-down"
            //-   transition-hide="jump-up"
            //- )
            //-   q-list(style="min-width: 100px")
            //-     q-item(v-if="props.row.balanceValue.amount === 0 || props.row.numChildren > 0" clickable, v-close-popup, @click="$emit('createAccount', props.row)")
            //-       q-item-section {{$t('pages.accounting.createAccount')}}
            //-     q-item(clickable, v-close-popup, @click="$emit('editAccount', props.row)")
            //-       q-item-section {{$t('pages.accounting.editAccount')}}
            //-     q-item(v-if="props.row.numChildren === 0" clickable, v-close-popup, @click="$emit('newTransaction', props.row)")
            //-       q-item-section {{$t('pages.accounting.newTransaction')}}
            //-     q-item(v-if="" clickable, v-close-popup, @click="$emit('viewTransactions', props.row)")
            //-       q-item-section {{$t('pages.accounting.viewTransactions')}}
            //-     q-item(v-if="props.row.numChildren === 0 && props.row.balanceValue.amount === 0 && props.row.parentId !== 0" clickable, v-close-popup, @click="$emit('deleteAccount', props.row)")
            //-       q-item-section {{$t('notifications.actions.accounts.deleteaccnt.title')}}
          //- a(:href='`https://www.google.com/search?q=${props.row.firstName}+${props.row.lastName}`' target='_blank')
          //-   | {{ props.row.firstName }}
      //- template(slot="_1", slot-scope='props')
      //-   div.custom-row(props) {{ props.row[props.column.property] }}

</template>

<script>
// import RowItemTableTree from '~/pages/projects/read/components/row-item-table-tree'
// import { EventBus } from '~/boot/event-bus'

// CHANGE THIS LINE TO REFER FROM OTHER SOURCE
import VueAdsTableTree from 'vue-ads-table-tree'
// import VueAdsTableTree from '../../../vendor/vue-ads-table-tree-develop/src/index'
// import VueAdsTableTree from '~/vue-ads-table-tree-developing/src'

// import VueAdsPagination, { VueAdsPageButton } from 'vue-ads-pagination'
// import VueAdsPagination, { VueAdsPageButton } from 'vue-ads-pagination'
import '~/../node_modules/@fortawesome/fontawesome-free/css/all.css'
import './custom-table-tree-style.css'
// import '~/../node_modules/vue-ads-table-tree/dist/vue-ads-table-tree.css'

// import { VueAdsPageButton } from 'vue-ads-pagination'
// import VueAdsTableTree2 from 'vue-ads-table-tree'
// const VueAdsPagination = window['vue-ads-pagination']
// const VueAdsPageButton = window['vue-ads-pagination']
import { mapActions, mapState } from 'vuex'
export default {
  name: 'custom-table-tree',
  components: {
    VueAdsTableTree
    // VueAdsPagination,
    // VueAdsPageButton
  },
  mounted (v) {
    this.loadAccounts()
    // this.loadRows()
    console.log('accounts by project', this.accountList)

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
      this.$emit('accountChanged', v)
    }
  },
  computed: {
    // ...mapState('accounting', ['accountList'])
    // ...mapGetters('accounting', ['accountListFormatted'])
    rows2 () {
      if (!this.accounts || !this.accounts.accounts) return undefined
      return this.accounts.accounts.map(account => {
        const content = account.content_groups[0].contents
        return {
          accountName: content.find(v => v.label === 'account_name').value,
          parentAccount: content.find(v => v.label === 'parent_account').value,
          hash: account.hash,
          uid: account.uid,
          _hasChildren: true,
          _children: []
        }
      })
    }
  },
  methods: {
    ...mapActions('contAccount', ['getChartOfAccounts', 'getAccountById']),
    ...mapState('contAccount', ['components']),
    selectAccount (account) {
      if (account.account) {
        this.accountSelected = account
      }
    },
    async loadAccounts () {
      console.log('loadAccounts')
      this.accounts = await this.getChartOfAccounts()
      if (!this.accounts || !this.accounts.accounts) return undefined
      this.accountsTree = this.accounts.accounts.map(account => {
        const content = account.content_groups[0].contents
        let amount = this.getComponentsOfAccount(account.hash)
        return {
          accountName: content.find(v => v.label === 'account_name').value,
          // parentAccount: content.find(v => v.label === 'parent_account').value,
          hash: account.hash,
          uid: account.uid,
          _id: account.uid,
          _hasChildren: true,
          amount
        }
      })
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
      return accounts.map(account => {
        const content = account.content_groups[0].contents
        return {
          accountName: content.find(v => v.label === 'account_name').value,
          // parentAccount: content.find(v => v.label === 'parent_account').value,
          parentAccount: account.ownedby.hash,
          hash: account.hash,
          uid: account.uid,
          _hasChildren: !!account.account,
          _id: account.uid,
          isSelectable: !account.account
        }
      })
    },
    async loadChildren (e) {
      const children = await this.getAccountById({ uid: e.uid })
      const childrenFormatted = await this.setUpAccountChildren(children)
      console.log('loadChildren', childrenFormatted)
      return childrenFormatted
    },
    filterChanged (filter) {
      this.filter = filter
    },
    pageChanged (page) {
      this.page = page
    },
    openRow (row) {
      console.log('row selected')
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
      childrenOpened: [],
      page: 0,
      filter: '',
      columns: [
        {
          property: 'accountName',
          title: 'Account Name',
          direction: null,
          filterable: false
        },
        {
          property: 'uid',
          title: 'Id',
          direction: null,
          filterable: true,
          collapseIcon: false
        }
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
</style>
