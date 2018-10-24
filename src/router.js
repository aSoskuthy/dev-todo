import Vue from 'vue'
import Router from 'vue-router'
import Checklist from './views/Checklist.vue'
import Account from './views/Account.vue'
import History from './views/History.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'checklist',
      component: Checklist,
      props: true
    },
    {
      path: '/account',
      name: 'account',     
      component: Account
    },
    {
      path: '/history',
      name: 'history',     
      component: History
    }
  ]
})
