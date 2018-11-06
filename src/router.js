import Vue from 'vue'
import Router from 'vue-router'
import WorkItemView from '@/views/WorkItemView'
import AccountView from '@/views/AccountView'
import WorkItemsView from '@/views/WorkItemsView'
import store from '@/store'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '*',
      redirect: '/account'
    },
    {
      path: '/',
      name: 'editWorkItem',
      component: WorkItemView,
      props: true,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/account',
      name: 'account',     
      component: AccountView
    },
    {
      path: '/history',
      name: 'history',     
      component: WorkItemsView,
      meta: {
        requiresAuth: true
      }
    }
  ]
})

router.beforeEach((to, from, next) =>{

let currentUser = store.getters.currentUser
let requiresAuth = to.matched.some(record => record.meta.requiresAuth)

if(requiresAuth && !currentUser) 
  next('account')
else
  next()
  
})

export default router