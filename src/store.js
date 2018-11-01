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
    currentUser: (state) => state.currentUser,   
    getUserId: (state) => state.currentUser.user.uid
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
      state.baseTodos = todos
    },    
    setCurrentUser: (state, user) => state.currentUser = user,
    clearCurrentUser: (state) => state.currentUser = null,
    CREATE_TASK: (state, task) => state.baseTodos.push(task),
    DELETE_TASKS: (state) => state.baseTodos = [] 
   
  },
  actions: {
    async fetchTasks({commit, state}) {      
      commit('DELETE_TASKS')
      let tasksRef = await db.collection('baseTodos')
        .where('userId', '==', state.currentUser.user.uid)
        .get()      
      tasksRef.forEach((t)=> {     
          commit('CREATE_TASK', {
            ...t.data(),
            id: t.id
          })  
        })        
      
    },
    async updateTasksOrder(tasks){
     const batch = db.batch()
     tasks.forEach(task => {
       let ref = db.collection('baseTodos').doc(task.id)
       batch.update(ref, { order: task.order})       
     })     
     try{
      await batch.commit()      
     }catch(error){
       console.log('Error updating tasks', error)
     }     
    },    
    async createTask({commit, state}, task) { 
      const orderOfTask = state.baseTodos.length 
      const newTask = { 
        ...task, 
        order: orderOfTask 
      }  
      try {
        const taskRef = await db.collection('baseTodos').add(newTask)
        newTask.id = taskRef.id
        commit('CREATE_TASK', newTask)  
      }catch(error){
        console.log('Failed to create task', error)
      }    
    },
    async updateTaskText({commit}, task){
      try{
        await db.collection('baseTodos').doc(task.id).update({text: task.text})        
      }catch(error){
        console.log('Failed to update task', error)
      }
      
    },
    async fetchBaseTodos({commit}){      
      let todos = []
      let baseTodosQuery = await db.collection('baseTodos').get()
      baseTodosQuery.forEach(
        (s)=> {          
          todos.push(
            { ...s.data(),
               id: s.id}
          )       
      })    
    
      commit('setTodos', todos)
    },
    async updateWorkItem({commit}, workItem){
      await db.collection('workItems').doc(workItem.id).update(workItem)
      commit('setWorkItem', {
        ...workItem
      })
    },
    async addWorkItem({commit}, workItem){
      let itemRef = await db.collection('workItems').add(workItem)
        commit('setWorkItem', {
          ...workItem,
          id: itemRef.id
        })
    },
    async saveWorkItem({ commit, dispatch, state }, workItem) {
      let existingWorkItem = state.workItems.find(x => x.uniqueNumber === workItem.uniqueNumber)
      if (existingWorkItem) {
        await dispatch('updateWorkItem', {...workItem, id: existingWorkItem.id})        
      } else {      
        await dispatch('addWorkItem', workItem)
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
