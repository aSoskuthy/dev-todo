import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    workItems: []       
  },
  getters: {
    workItems: (state) => state.workItems
  },
  mutations: {
    setWorkItem: (state, workItem) => state.workItems.push(workItem) 
    
  },
  actions: {
     
  }
})
