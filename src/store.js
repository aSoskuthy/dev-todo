import Vue from 'vue'
import Vuex from 'vuex'
import db from '@/firebase'
import firebase from 'firebase'
import { rejects } from 'assert';

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
    workItems: (state) => {
       state.workItems.forEach(item =>{
         Vue.set(item, 'iconFontSize', 24)
       }) 

       return state.workItems
    },
    workItem: (state) => state.workItem,
    userTasks: (state) => state.userTasks,
    currentUser: (state) => state.currentUser,   
    getUserId: (state) => state.currentUser ? state.currentUser.user.uid : null
  },
  mutations: {    
    SET_WORK_ITEM: (state, workItem) => state.workItem = { 
      ...workItem  
    },
    CLEAR_WORK_ITEM: (state) => state.workItem = null,
    UPDATE_WORK_ITEM: (state, workItem) => {
      let itemIndex = state.workItems.findIndex(
        (x) => x.uniqueNumber === workItem.uniqueNumber
      )
      state.workItems[itemIndex] = { ...workItem }
    },
    ADD_WORK_ITEM: (state, workItem) => {
      state.workItems.push(workItem)
    },
    CLEAR_WORK_ITEMS: (state) => state.workItems = [],       
    SET_CURRENT_USER: (state, user) => state.currentUser = user,
    CLEAR_CURRENT_USER: (state) => state.currentUser = null,
    CREATE_TASK: (state, task) => state.userTasks.push(task), 
    CLEAR_TASKS: (state) => state.userTasks = [],
    DELETE_WORK_ITEM: (state, workItem) => {
      state.workItems.splice(state.workItems.findIndex(item =>
        item.uniqueNumber === workItem.uniqueNumber),
        1)
    }
    
  },
  actions: {
    async deleteAllTasks({commit}){
     // to be done...
    },
    async demoSignIn({commit}){
      const user = await firebase.auth().signInWithEmailAndPassword('demo@mutualvision.co.uk','mvdemo').catch(alert)
      commit('SET_CURRENT_USER', user)  
    },
    async deleteWorkItem({commit}, workItem){
      await db.collection('workItems').doc(workItem.id).delete()
      commit('DELETE_WORK_ITEM', workItem)
    },
    async signIn({commit}, credentials) {     
        const user = await firebase.auth().signInWithEmailAndPassword(credentials.email, 
          credentials.password)
          .catch(alert)
        commit('SET_CURRENT_USER', user)                  
    },
    async signOut({commit}){     
      try{
        await firebase.auth().signOut()
        commit('CLEAR_WORK_ITEM')
        commit('CLEAR_WORK_ITEMS')
        commit('CLEAR_TASKS')
        commit('CLEAR_CURRENT_USER')
      }catch(error){
        console.log('Error during logout', error)
      } 
      
    },
    async fetchTasks({commit, state}) {      
      commit('CLEAR_TASKS')      
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
    async updateTaskOrder({commit}, tasks){    
     const batch = db.batch()
     tasks.forEach(task => {
       let ref = db.collection('baseTodos').doc(task.id)
       batch.update(ref, { order: task.order})       
     })     
     try{
       await batch.commit()      
       commit('CLEAR_TASKS')       
       tasks.forEach((task) =>{       
         commit('CREATE_TASK', {
           ...task
         })
       })
     }catch(error){
       console.log('Error updating tasks order', error)
     }     
    },    
    async createTask({commit, state}, task) { 
      const orderOfTask = state.userTasks.length 
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
      commit('CLEAR_WORK_ITEMS') 
      let workItems = await db.collection('workItems').where('userId', '==', userId).get()
      workItems.forEach(item => 
        commit('ADD_WORK_ITEM', {
          ...item.data(),
          id: item.id
        }))
    }
  }
})
