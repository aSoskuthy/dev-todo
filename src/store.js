import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    workItems: [],
    todos: []       
  },
  getters: {
    workItems: (state) => state.workItems,
    todos: (state) => state.todos
  },
  mutations: {
    setWorkItem: (state, workItem) => {
      let item = state.workItems.find((item) => item.uniqueNumber === workItem.uniqueNumber)
      if(item){
        state.workItems.splice(state.workItems.indexOf(item), 1)
      }   
      state.workItems.push(workItem) 
    },
    setTodos: (state, todos) => {
      state.todos = todos
    } 
    
  },
  actions: {
     
  }
})
