export default {
  common: {
    appName: 'Telos Communities',
    buttons: {
      cancel: 'Cancel',
      continue: 'Continue',
      create: 'Create',
      logout: 'Logout',
      mint: 'Mint',
      register: 'Register',
      save: 'Save',
      confirm: 'Confirm'
    },
    defaultTitle: 'Title'
  },
  forms: {
    errors: {
      accountFormat: 'The account can contain lowercase characters only, numbers from 1 to 5 or a dot (.)',
      accountFormatBasic: 'The account must contain 12 lowercase characters only and number from 1 to 5',
      accountLength: 'The account must contain at most 12 characters',
      accountNotAvailable: 'The account "{account}" already exists',
      accountNotExists: 'The account "{account}" does not exist',
      copyKey: 'Copy the key to a safe place',
      dateFuture: 'The date must be in the future',
      greaterOrEqualThan: 'The value must be greater than than or equal to {value}',
      integer: 'Please type an integer',
      phoneFormat: 'Please type a valid phone',
      positiveInteger: 'The value must be greater than 0',
      required: 'This field is required',
      token: 'The field must contain between 2 and 6 characters',
      tokenDecimals: 'The decimals must be between 2 and 9'
    }
  },
  menu: {
    transfer: 'Transfer',
    example: 'Example Dashboard',
    transactions: 'Transactions',
    chartOfAccounts: 'Chart of Accounts'
  },
  pages: {
    index: {
      buttons: {
        createAccount: 'Create account',
        login: 'Login with Telos'
      }
    },
    general: {
      search: 'Search',
      confirmActions: 'Do you want confirm this action?',
      noAccountsFound: 'No accounts found'
    },
    login: {
      getApp: 'Download the app',
      title: 'Select your wallet',
      selectAccount: 'Please select an account'
    },
    accounts: {
      details: 'Details',
      account: 'Account',
      memo: 'Memo',
      date: 'Date',
      approved: 'Approved',
      balanced: 'Balanced',
      transaction: 'Transaction',
      amount: 'Amount',
      percent: 'Percent',
      filterCategory: 'Filter Category',
      newAccount: 'New Account'
    },
    transactions: {
      transaction: 'Transaction',
      transactions: 'Transactions',
      or: 'Or',
      memo: 'Memo',
      date: 'Date',
      approved: 'Approved',
      balanced: 'Balanced',
      account: 'Account',
      from: 'From',
      to: 'To',
      amount: 'Amount',
      currency: 'Currency',
      action: 'Action',
      actions: 'Actions',
      selectTransaction: 'Select Transaction',
      approve: 'Approve',
      notes: 'Notes',
      save: 'Save',
      chooseTransaction: 'Choose Transaction',
      newTransaction: 'New Transaction',
      deleteTransaction: 'Delete transaction',
      type: 'Type',
      delete: 'Delete'
    },
    events: {
      events: 'Events',
      from: 'From',
      to: 'To',
      amount: 'Amount',
      memo: 'Memo',
      date: 'Date',
      actions: 'Actions'
    }
  }
}
