import "babel-polyfill";
import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css' 
import Vue from 'vue'
import App from '@/App.vue'
import store from '@/store'
import router from '@/router'
import Vuetify from 'vuetify'
import firebase from 'firebase'
import "iterators-polyfill";

// Polyfill Math.cbrt
if (!Math.cbrt) {
  Math.cbrt = function(x) {
    var y = Math.pow(Math.abs(x), 1/3);
    return x < 0 ? -y : y;
  };
}

// Polyfill Object.values
const valuesPolyfill = function values (object) {
  return Object.keys(object).map(key => object[key]);
};

const values = Object.values || valuesPolyfill;

//Polyfill String.includes
if (!String.prototype.includes) {
  String.prototype.includes = function(search, start) {
    if (typeof start !== 'number') {
      start = 0;
    }

    if (start + search.length > this.length) {
      return false;
    } else {
      return this.indexOf(search, start) !== -1;
    }
  };
}
// End of Polyfills

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



