import Vue from 'vue'
import Router from 'vue-router'
import Checklist from './views/Checklist.vue'
import Account from './views/Account.vue'
import History from './views/History.vue'
import firebase from 'firebase'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '*',
      redirect: '/account'
    },
    {
      path: '/',
      name: 'checklist',
      component: Checklist,
      props: true,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/account',
      name: 'account',     
      component: Account
    },
    {
      path: '/history',
      name: 'history',     
      component: History,
      meta: {
        requiresAuth: true
      }
    }
  ]
})

router.beforeEach((to, from, next) =>{

let currentUser = firebase.auth().currentUser
let requiresAuth = to.matched.some(record => record.meta.requiresAuth)


if(requiresAuth && !currentUser) 
  next('account')
else
  next()
  
})

export default router