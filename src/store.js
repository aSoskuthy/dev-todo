import Vue from 'vue'
import Vuex from 'vuex'
import db from '@/firebase'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentUser: null,
    workItems: [],
    baseTodos: []    
  },
  getters: {
    workItems: (state) => state.workItems,
    baseTodos: (state) => state.baseTodos,
    currentUser: (state) => state.currentUser
  },
  mutations: {
    setWorkItem: (state, workItem) => {
      let itemIndex = state.workItems.findIndex((x) => x.uniqueNumber === workItem.uniqueNumber)
      if (itemIndex === -1) {
        state.workItems.push(workItem)
      } else {
        state.workItems[itemIndex] = workItem
      }
    },
    clearWorkItems: (state) => state.workItems = [],
    setTodos: (state, todos) => {
      console.log('setting base todos')
      state.baseTodos = todos
    },
    setCurrentUser: (state, user) => state.currentUser = user,
    clearCurrentUser: (state) => state.currentUser = null

  },
  actions: {
    async deleteTodos(){
     let todos = await db.collection('baseTodos').get()
     todos.forEach((todo)=>{
       db.collection('baseTodos').doc(todo.id).delete()
     })
    },
    async addTodos({commit, dispatch}, todos){
      commit('setTodos', todos)
      await dispatch('deleteTodos')
      todos.forEach(async (todo)=>{
        let ref = await db.collection('baseTodos').add(todo)
        console.log('added: ', ref)
        
      })
      
    },
    async fetchBaseTodos({commit}){
      console.log('called fetchbase todos')
      let todos = []
      let baseTodosQuery = await db.collection('baseTodos').get()
      baseTodosQuery.forEach((s)=> {          
          todos.push({...s.data(), id: s.id})       
      })     
    
      commit('setTodos', todos)
    },
    async saveWorkItem({ commit, state }, workItem) {
      let found = state.workItems.find(x => x.uniqueNumber === workItem.uniqueNumber)
      if (found) {
        await db.collection('workItems').doc(found.id).update(workItem)
      } else {
        let itemRef = await db.collection('workItems').add(workItem)
        commit('setWorkItem', {
          ...workItem,
          id: itemRef.id
        })
      }
    },
    async fetchWorkItems({ commit }, userId) {
      let workItems = await db.collection('workItems').where('userId', '==', userId).get()
      workItems.forEach(item => 
        commit('setWorkItem', {
          ...item.data(),
          id: item.id
        }))
      
      return new Promise((resolve) => resolve())

    }
  }
})
