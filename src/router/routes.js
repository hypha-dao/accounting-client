const routes = [
  { path: '/', component: () => import('pages/index.vue'), meta: { layout: 'empty', guest: true } },
  { path: '/login', component: () => import('pages/login/login.vue'), meta: { layout: 'guest', title: 'pages.login.title', guest: true } },
  // { path: '/home', component: () => import('pages/home/home.vue'), name: 'home' },
  // { path: '/dashboard', component: () => import('pages/home/dashboard.vue'), name: 'dashboard' },
  { path: '/transactions', component: () => import('pages/transactions/transactions.vue'), name: 'transactions' },
  { path: '/chart-accounts', component: () => import('pages/accounts/chartAccounts.vue'), name: 'chartAccounts' }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/404.vue'),
    meta: { layout: 'empty' }
  })
}

export default routes
