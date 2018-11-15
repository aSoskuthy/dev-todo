<template>
<v-card>
    <v-card-title>
        <v-icon color="teal" large>history</v-icon>     
    <v-spacer></v-spacer>
     <v-text-field
        color="teal"
        v-model="search"
        append-icon="search"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
      </v-card-title>
     <v-data-table     
        class="elevation-1" 
        :loading="loading"
        :headers="headers"
        :items="workItems"   
        :search="search"   
  >
    <template slot="items" slot-scope="props">
    <tr style="cursor: pointer" >
      <td @click="getItem(props.item)" class="text-xs-left">{{ props.item.uniqueNumber }}</td>
      <td @click="getItem(props.item)" class="text-xs-left">{{ props.item.description }}</td>      
      <td @click="getItem(props.item)" class="text-xs-left">
     <!-- <v-icon
      class="hidden-sm-and-down"
      small 
      v-for="todo in props.item.todos"
      :color="getIconColorGrade(todo)" 
      :key="todo.date">grade</v-icon>        -->
      <v-tooltip left>{{props.item.progress}}%
       <v-progress-linear slot="activator" :color="colorBars(props.item.progress)"
       
        v-model="props.item.progress"></v-progress-linear></v-tooltip>
        <!-- <v-progress-circular
      :value="getPercentage(props.item.todos)"
      color="teal"
      :width="3"
      size="36"
      style="font-size: 10px"
    >{{getPercentage(props.item.todos)}}</v-progress-circular> -->
    
      </td>
      <td @click="getItem(props.item)" class="text-xs-left">{{props.item.date}}</td>
      <td class="text-xs-left">  
    <v-tooltip v-if="props.item.notesMessage" left>
        {{ props.item.notesMessage }}
      <v-icon 
      slot="activator"                      
      :color="successColor">note</v-icon>        
        </v-tooltip>
        <v-icon :color="defaultColor" v-else>note</v-icon>
          <v-icon 
           class="delete-icon"
           @click="deleteWorkItem(props.item)" 
           :mouseover="color=successColor"         
           :color="defaultColor">delete</v-icon>
      </td>
      </tr>
    </template>
  </v-data-table>
</v-card>
</template>

<script>
import db from '@/firebase'
import Vue from 'vue'
import { mapActions, mapMutations, mapGetters } from 'vuex'

export default {
data(){
    return {
         defaultFontSize: 24,
         fontIncrementSize: 8,
         successColor:'teal',
         defaultColor: 'grey',
         loading: true,
         search: null,
         headers: [
            { text: 'PO Number', value:'uniqueNumber',  align: 'left', sortable: true },
            { text: 'Description', value: 'description', sortable: true },
            { text: 'Completion', value: 'progress', sortable: true },
            { text: 'Date', value: 'date', sortable: true },
            { text: 'Notes', sortable: false }                   
         
        ],
    }
},
computed: {
    ...mapGetters({
        workItems: 'workItems',
        currentUser: 'currentUser'
    }),   

},
methods: {   
    colorBars(progress){
    let color
      if(progress <= 25){
        color = "red"
      }else if(progress < 50){
        color = "orange"
      }else if(progress <= 75) {
        color = "blue"
      }else{
        color = "teal"
      }
      return color
    },
    calculateProgress(userTasks) {
      if(userTasks.length > 0) {
             const finishedTasks = this.getTasksDone(userTasks)
             return Math.round(
               this.getPercentage(
                 finishedTasks, userTasks.length)
                 ) 
        }       
    },    
    getPercentage(tasks){
        return Math.round(this.getTasksDone(tasks) / tasks.length  * 100) 
    },
    getIconColorGrade(todo){
        return todo.checked ? this.successColor : this.defaultColor
    },
    getItem(item){
        this.commitWorkItem(item)
        this.$router.push('/')
    },
    getTasksDone(todos){
        if(todos.length > 0) {
             return todos.filter((todo) => todo.checked).length
        }
        return 0
    },   
    ...mapActions({
        fetchWorkItems: 'fetchWorkItems',
        deleteWorkItem: 'deleteWorkItem'
    }),
    ...mapMutations({
        commitWorkItem: 'SET_WORK_ITEM'
    })     
},
async created() {
     this.loading = true
     console.log('started fetch in created')
     await this.fetchWorkItems()    
      console.log('finished fetch in created')
     this.loading = false
}
}
</script>

<style>
.delete-icon:hover{
    color: teal !important;
}
</style>
