<template>
     <v-data-table
    :headers="headers"
    :items="items"   
    class="elevation-1"
   
    
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
      <td class="text-xs-left"><v-icon v-if="props.item.notes_message" color="teal">note</v-icon></td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
export default {
data(){
    return {
         headers: [
            {text: 'PO Number',  align: 'left', sortable: true },
            { text: 'Description', sortable: true },
            { text: 'Completion', sortable: false },
            { text: 'Date', sortable: true },
            { text: 'Notes', sortable: false }
          
         
        ],
    }
},
computed: {
    items() {
        return this.$store.getters.workItems
    }
},
methods: {
    getItem(item){
        this.$router.push({name: 'checklist', params: { item: item }})
    },
    getNumberOfTodos(todos){
        return todos.filter((todo) => todo.checked).length
    }
},

}
</script>

<style>

</style>
