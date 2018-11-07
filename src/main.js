import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css' 
import Vue from 'vue'
import App from '@/App.vue'
import store from '@/store'
import router from '@/router'
import Vuetify from 'vuetify'
import firebase from 'firebase'


Vue.use(Vuetify, {
  iconfont: 'md'
})
Vue.config.productionTip = false

let app

firebase.auth().onAuthStateChanged(() => {
  if(!app) {
    app = new Vue({
      store,
      router,      
      render: h => h(App)
    }).$mount('#app')
  }
})



