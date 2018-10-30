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
        hide-actions
        class="elevation-1" 
        :loading="loading"
        :headers="headers"
        :items="items"   
        :search="search"
    
  >
    <template slot="items" slot-scope="props">
    <tr style="cursor: pointer" @click="getItem(props.item)">
      <td class="text-xs-left">{{ props.item.uniqueNumber }}</td>
      <td class="text-xs-left">{{ props.item.description }}</td>      
      <td class="text-xs-left">
     <v-icon color="teal" 
      small 
      v-for="n in getNumberOfTodos(props.item.todos)" :key="n">grade</v-icon> 
      {{  getNumberOfTodos(props.item.todos) / props.item.todos.length  * 100 }} %  
      </td>
      <td class="text-xs-left">{{props.item.date}}</td>
      <td class="text-xs-left"><v-icon v-if="!props.item.notesMessage" color="grey">note</v-icon>
                            <v-icon v-else color="teal">note</v-icon></td>
      </tr>
    </template>
  </v-data-table>
</v-card>
</template>

<script>
import db from '@/firebase'

export default {
data(){
    return {
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
    items() {
        return this.$store.getters.workItems
    },
    currentUser(){
        return this.$store.getters.currentUser
    }
},
methods: {
    getItem(item){
        this.$router.push({name: 'checklist', params: { item: item }})
    },
    getNumberOfTodos(todos){
        if(todos.length > 0) {
             return todos.filter((todo) => todo.checked).length
        }
        return 0
    },    
    async fetchWorkItems(){
        this.loading = true        
        await this.$store.dispatch('fetchWorkItems', this.currentUser.user.uid)
        this.loading = false  
    }
},
created() {
     this.fetchWorkItems()    
}
}
</script>

<style>

</style>
