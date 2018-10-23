import Vue from 'vue'
import Router from 'vue-router'
import Checklist from './views/Checklist.vue'
import Account from './views/Account.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'checklist',
      component: Checklist
    },
    {
      path: '/account',
      name: 'account',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: Account
    }
  ]
})
