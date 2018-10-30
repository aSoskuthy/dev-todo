import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css' 
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vuetify from 'vuetify'
import firebase from 'firebase'
import { config }  from './firebase'

Vue.use(Vuetify, {
  iconfont: 'md'
})
Vue.config.productionTip = false

let app

firebase.auth().onAuthStateChanged((user) => {
  if(!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
})



