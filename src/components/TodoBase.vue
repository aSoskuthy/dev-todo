<template>
<v-container>
    <v-layout>
      <v-flex  md6 offset-md3>    
        <v-card class="pa-2">             
        <v-text-field color="teal"  
        v-model="poNumber"                    
        label="Enter PO"
        :append-icon="isValidPO"
            outline>
         </v-text-field> 
        <v-text-field color="teal"    
        v-model="poDescription"
        v-if="poNumber"            
        label="Enter description"
        :append-icon="isValidDescription"
            outline>
         </v-text-field> 
           <v-list>
         <v-list-tile   
            v-for="item in todos"
            :key="item.id"                       
          >         
           <v-list-tile-avatar>
              <v-checkbox v-model="item.checked" color="teal"  ></v-checkbox>
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title color="teal" class="mt-1" v-text="item.name"></v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
        </v-card>
        </v-flex> 
    </v-layout>    
</v-container>
</template>

<script>
export default {
data() {
    return {       
        poNumber: null,
        poDescription: null,
        todos: [],
        test: false
    }    
},
computed: {    
    isValidPO() {
        return this.poNumber ? 'done': ''     
    },
    isValidDescription() {
        return this.poDescription ? 'done': ''
    }
},
watch: {
    'poNumber'() {
         if(this.poNumber === '') {             
             this.poDescription = null
         }
    }
},
created() {
    let todo = {
        id: 1,
        checked: false,
        name: 'Im a todo'
    }
    this.todos.push(todo)
    
    
}
}
</script>

<style>

</style>
