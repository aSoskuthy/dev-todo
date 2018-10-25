import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    workItems: [],
    baseTodos: [
      {
        id: 1,
        checked: false,
        edit: false,
        name: 'JIRA ticket status changed, assigned to developer'
     }, {
      id: 2,
      checked: false,
      edit: false,
      name: 'Feature or Hotfix branch created'
  }
    ]       
  },
  getters: {
    workItems: (state) => state.workItems,
    baseTodos: (state) => state.baseTodos
  },
  mutations: {
    setWorkItem: (state, workItem) => {
      let itemIndex = state.workItems.findIndex((x) => x.uniqueNumber === workItem.uniqueNumber)
      if(itemIndex === -1){
        state.workItems.push(workItem)
      }else{
        state.workItems[itemIndex] = workItem
      }
      
    },
    setTodos: (state, todos) => {
      state.baseTodos = todos
    } 
    
  },
  actions: {
     
  }
})
