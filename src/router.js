import Vue from 'vue'
import Router from 'vue-router'
import WorkItemCreate from '@/components/work_item/Create'
import WorkItemEdit from '@/components/work_item/Edit'
import WorkItemList from '@/components/work_item/List'
import AccountView from '@/views/AccountView'
import store from '@/store'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '*',
      redirect: '/account'
    },
    {
      path: '/',
      name: 'create',
      component: WorkItemCreate,      
      meta: {
        requiresAuth: true
      }
    },
     {
      path: '/edit/:uniqueNumber',
      name: 'edit',
      component: WorkItemEdit,
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
      component: WorkItemList,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/signup',
      name: 'signup',
      component: AccountView
    }
  ]
})

router.beforeEach((to, from, next) =>{

const currentUser = store.getters.currentUser
const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

if(requiresAuth && !currentUser) 
  next('account')
else
  next()
  
})

export default router