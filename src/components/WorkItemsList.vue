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
    <tr style="cursor: pointer" 
        @click="getItem(props.item)">
      <td class="text-xs-left">{{ props.item.uniqueNumber }}</td>
      <td class="text-xs-left">{{ props.item.description }}</td>      
      <td class="text-xs-left">
     <v-icon
      class="hidden-sm-and-down"
      small 
      v-for="todo in props.item.todos"
      :color="getIconColorGrade(todo)" 
      :key="todo.date">grade</v-icon>       
      {{ getPercentage(props.item.todos)  }} %  
      </td>
      <td class="text-xs-left">{{props.item.date}}</td>
      <td class="text-xs-left">
          <v-icon v-if="!props.item.notesMessage" 
                :color="defaultColor">note</v-icon>
          <v-icon v-else 
                :color="successColor">note</v-icon>
      </td>
      </tr>
    </template>
  </v-data-table>
</v-card>
</template>

<script>
import db from '@/firebase'
import { mapActions, mapMutations } from 'vuex'

export default {
data(){
    return {
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
    workItems() {
        return this.$store.getters.workItems
    },
    currentUser(){
        return this.$store.getters.currentUser
    }
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
        this.$router.push({name: 'editWorkItem', params: { item: item }})
    },
    getTasksDone(todos){
        if(todos.length > 0) {
             return todos.filter((todo) => todo.checked).length
        }
        return 0
    },   
    ...mapActions({
        fetchWorkItems: 'fetchWorkItems'
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
