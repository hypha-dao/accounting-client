const routes = [
  { path: '/', component: () => import('pages/index.vue'), meta: { layout: 'empty', guest: true } },
  { path: '/login', component: () => import('pages/login/login.vue'), meta: { layout: 'guest', title: 'pages.login.title', guest: true } },
  { path: '/home', component: () => import('pages/home/home.vue'), name: 'home' },
  { path: '/dashboard', component: () => import('pages/home/dashboard.vue'), name: 'dashboard' }
  // PPP
  // { path: '/profiles/myProfile/add', component: () => import('pages/profiles/add/sign-up.vue'), meta: { needBackendLogin: true }, name: 'userRegister' },
  // { path: '/profiles/myProfile/verify/:type', component: () => import('pages/profiles/add/verify-user.vue'), meta: { needBackendLogin: true }, name: 'verifyComm' },
  // { path: '/profiles/chat/messages', component: () => import('pages/chats/list/chat.vue'), meta: { needVerifyComm: true, needBackendLogin: true }, name: 'chat' },
  // { path: '/profiles/chat', component: () => import('pages/chats/list/chat-list.vue'), meta: { needVerifyComm: true, needBackendLogin: true } },
  // { path: '/profiles/contacts', component: () => import('pages/profiles/list/contact-list.vue'), meta: { needVerifyComm: true, needBackendLogin: true } },
  // { path: '/profiles/registerApp', component: () => import('pages/apps/add/register-app.vue'), meta: { needVerifyComm: true, needBackendLogin: true }, name: 'registerApp' },
  // { path: '/profiles/appList', component: () => import('pages/apps/list/app-list.vue'), meta: { needVerifyComm: true, needBackendLogin: true } },
  // { path: '/profiles/myProfile', component: () => import('pages/profiles/read/my-profile.vue'), meta: { needBackendLogin: true }, name: 'myProfile' },
  // { path: '/profiles/contacts/profileDetail', component: () => import('pages/profiles/read/profile-detail.vue'), meta: { needVerifyComm: true, needBackendLogin: true }, name: 'profileDetail' },
  // { path: '/profiles/add/profileLogin', component: () => import('pages/profiles/read/profile-login.vue'), name: 'profileLogin' }
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
