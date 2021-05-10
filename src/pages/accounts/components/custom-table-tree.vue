<template lang='pug'>
#container
  div
    vue-ads-table-tree(
      :columns='columns',
      :rows='rows',
      :page='page',
      @filter-change='filterChanged',
      @page-change='pageChanged',
      :call-children="loadChildren"
      :call-rows="loadChildren"
    )
      template(slot="top")
        div
      template.container-btn(slot='accountName' slot-scope='props')
        .main-column
          .row(@dblclick="openRow(props.row)")
            q-icon.q-mr-sm(name="account_balance", size="20px")
            p {{ props.row.accountName }}
      template.container-btn(slot='balance' slot-scope='props')
        p.text-right {{ props.row.balance }}
      template.container-btn(slot='action' slot-scope='props')
        .row.justify-center
          //- q-btn(round color="cyan-6" icon="info" size="xs" @click="doAction(props.row)")
          q-btn(color="secondary", :label="$t('common.buttons.actions')", icon-right="expand_more")
            q-menu(
              transition-show="jump-down"
              transition-hide="jump-up"
            )
              q-list(style="min-width: 100px")
                q-item(v-if="props.row.balanceValue.amount === 0 || props.row.numChildren > 0" clickable, v-close-popup, @click="$emit('createAccount', props.row)")
                  q-item-section {{$t('pages.accounting.createAccount')}}
                q-item(clickable, v-close-popup, @click="$emit('editAccount', props.row)")
                  q-item-section {{$t('pages.accounting.editAccount')}}
                q-item(v-if="props.row.numChildren === 0" clickable, v-close-popup, @click="$emit('newTransaction', props.row)")
                  q-item-section {{$t('pages.accounting.newTransaction')}}
                q-item(v-if="" clickable, v-close-popup, @click="$emit('viewTransactions', props.row)")
                  q-item-section {{$t('pages.accounting.viewTransactions')}}
                q-item(v-if="props.row.numChildren === 0 && props.row.balanceValue.amount === 0 && props.row.parentId !== 0" clickable, v-close-popup, @click="$emit('deleteAccount', props.row)")
                  q-item-section {{$t('notifications.actions.accounts.deleteaccnt.title')}}
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
import { mapState } from 'vuex'
export default {
  name: 'custom-table-tree',
  components: {
    VueAdsTableTree
    // VueAdsPagination,
    // VueAdsPageButton
  },
  mounted (v) {
    this.loadRows()
    console.log('accounts by project', this.accountList)

    this.$store.$EventBus.$on('accounts-updated', () => {
      console.log('Event bus listened')
      this.childrenOpened = []
      this.findChildrenOpened(this.rows)
      this.loadRows()
    })
  },
  beforeDestroy () {
    this.$store.$EventBus.$off('accounts-updated')
  },
  computed: {
    ...mapState('accounting', ['accountList'])
    // ...mapGetters('accounting', ['accountListFormatted'])
  },
  methods: {
    findChildrenOpened (parent) {
      parent.forEach(children => {
        if (children._showChildren === true) {
          this.childrenOpened.push(children)
          this.findChildrenOpened(children._children)
        }
      })
    },
    loadRows () {
      const accountsFormatted = []
      // For each root account
      this.accountList.forEach(account => {
        // Format all accounts
        const newAccount = this.setUpAccount(account)
        // If is a root
        if ((account.numChildren > 0 && !account.parent) || (account.numChildren === 0 && !account.parent)) {
          console.log('Account Added')
          accountsFormatted.push(newAccount)
        }
      })

      this.rows = accountsFormatted
      console.log('Rows:', this.rows)
    },
    sleep (ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    },
    loadChildren (e) {
      // console.log('loadChildren', e)
      const newChildren = []
      const _children = this.accountList.filter(el => el.parentId === e._id)
      _children.forEach(children => {
        newChildren.push(this.setUpAccount(children))
      })
      return newChildren
    },
    setUpAccount (account) {
      // console.log('setUpAccount', account)
      const newAccount = {
        _id: account.accountId,
        projectId: account.projectId,
        accountName: account.accountName,
        accountSubtype: account.accountSubtype,
        increaseBalance: account.increaseBalance,
        decreaseBalance: account.decreaseBalance,
        accountSymbol: account.accountSymbol,
        numChildren: account.numChildren,
        balance: account.balance.formatToMoney(),
        balanceValue: account.balance,
        parentId: account.parentId,
        description: account.description,
        accountCategory: account.accountCategory,
        budget: account.budget
      }

      if (account.numChildren > 0) {
        newAccount['_hasChildren'] = true
        const statusChildrenSaved = this.childrenOpened.find(accountOpened => accountOpened._id === account.accountId)

        if (statusChildrenSaved && statusChildrenSaved._children) {
          // newAccount['_children'] = statusChildrenSaved._children
          const newChildren = this.loadChildren(newAccount)
          // console.log('loadChildrenSaved', newChildren)
          newAccount['_children'] = newChildren
          newAccount['_showChildren'] = true
        }
      }

      return newAccount
    },
    filterChanged (filter) {
      this.filter = filter
    },
    pageChanged (page) {
      this.page = page
    },
    openRow (row) {
      this.$emit('rowSelected', row)
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
          filterable: true,
          collapseIcon: false
        },
        {
          property: 'description',
          title: 'Description',
          direction: null,
          filterable: false
        },
        {
          property: 'balance',
          title: 'Balance',
          direction: null,
          filterable: false
        },
        {
          property: 'action'
        }
      ],
      rows: []
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
</style>
