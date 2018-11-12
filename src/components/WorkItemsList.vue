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
     <v-icon
      class="hidden-sm-and-down"
      small 
      v-for="todo in props.item.todos"
      :color="getIconColorGrade(todo)" 
      :key="todo.date">grade</v-icon>       
      {{ getPercentage(props.item.todos)  }} %  
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
           @mouseover="props.item.iconFontSize += fontIncrementSize"
           @mouseleave="props.item.iconFontSize -= fontIncrementSize"
           
           @click="deleteWorkItem(props.item)"
           :style="{ fontSize: props.item.iconFontSize + 'px'}"
           :color="successColor">delete</v-icon>
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
            { text: 'Completion', value: false, sortable: false },
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
     await this.fetchWorkItems(this.currentUser.user.uid)    
     this.loading = false
}
}
</script>

<style>

</style>
