import Vue from 'vue'
import Vuex from 'vuex'
import db from '@/firebase'
import firebase from 'firebase'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentUser: null,      
    workItem: {
      userId: null,
      uniqueNumber: null,
      description: null,
      notesDialog: false,
      notesMessage: null,
      todos: [],
      disableAll: false,
      date: null,
      isUniqueNumberEditable: true,
      isDescriptionEditable: true,      
    },
    workItems: [],
    userTasks: []    
  },
  getters: {
    workItems: (state) => state.workItems,
    baseTodos: (state) => state.userTasks,
    currentUser: (state) => state.currentUser,   
    getUserId: (state) => state.currentUser ? state.currentUser.user.uid : null
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
    DELETE_WORK_ITEMS: (state) => state.workItems = [],
    setTodos: (state, todos) => {      
      state.baseTodos = todos
    },    
    SET_CURRENT_USER: (state, user) => state.currentUser = user,
    DELETE_CURRENT_USER: (state) => state.currentUser = null,
    CREATE_TASK: (state, task) => state.userTasks.push(task), 
    DELETE_TASKS: (state) => state.userTasks = [],
    SET_WORK_ITEM: (state, workItem) => state.workItem = { 
      ...workItem  
    },
    DELETE_WORK_ITEM: (state) => state.workItem = null,
    UPDATE_WORK_ITEM: (state, workItem) => {
      let itemIndex = state.workItems.findIndex(
        (x) => x.uniqueNumber === workItem.uniqueNumber
      )
      state.workItems[itemIndex] = { ...workItem }
    },
    ADD_WORK_ITEM: (state, workItem) => {
      state.workItems.push(workItem)
    }
  },
  actions: {
    async signIn({commit}, credentials) {
      const user = await firebase.auth().signInWithEmailAndPassword(credentials.email, 
        credentials.password)
      commit('SET_CURRENT_USER', user)      
    },
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
    async updateTasksOrder({commit}, tasks){
    console.log('store: updateTaskOrder')
     const batch = db.batch()
     tasks.forEach(task => {
       let ref = db.collection('baseTodos').doc(task.id)
       batch.update(ref, { order: task.order})       
     })     
     try{
       await batch.commit()      
       commit('DELETE_TASKS')
       console.log('store: DELETE_TASKS from updateTasksOrder')
       tasks.forEach((task) =>{
        console.log('store: commiting new task from updateTasksOrder', task)
         commit('CREATE_TASK', {
           ...task
         })
       })
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
    async updateTaskText({}, task){
      try{
        await db.collection('baseTodos').doc(task.id).update({text: task.text})        
      }catch(error){
        console.log('Failed to update task', error)
      }
      
    },    
    async updateWorkItem({commit}, workItem){
      await db.collection('workItems').doc(workItem.id).update(workItem)
      commit('UPDATE_WORK_ITEM', workItem)
    },
    async addWorkItem({commit}, workItem){
      let itemRef = await db.collection('workItems').add(workItem)
        commit('ADD_WORK_ITEM', {
          ...workItem,
          id: itemRef.id
        })
    },
    async saveWorkItem({ dispatch, state }, workItem) {
      let existingWorkItem = state.workItems.find(x => x.uniqueNumber === workItem.uniqueNumber)
      if (existingWorkItem) {
        await dispatch('updateWorkItem', {...workItem, id: existingWorkItem.id})        
      } else {      
        await dispatch('addWorkItem', workItem)
      }
    },
    async fetchWorkItems({ commit }, userId) {     
      commit('DELETE_WORK_ITEMS') 
      let workItems = await db.collection('workItems').where('userId', '==', userId).get()
      workItems.forEach(item => 
        commit('ADD_WORK_ITEM', {
          ...item.data(),
          id: item.id
        }))
      }
  }
})
