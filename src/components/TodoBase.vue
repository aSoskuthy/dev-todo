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
         <transition name="fade">
        <v-text-field color="teal"    
        v-model="poDescription"
        v-if="poNumber"            
        label="Enter description"
        :append-icon="isValidDescription"
            outline>
         </v-text-field> 
         </transition>
         <transition name="fade">
        
        <v-list v-if="poDescription">
         
          <v-chip :class="isBlackOrWhite" :color="areTodosFinished">{{ doneTodos }} / {{ todos.length}}</v-chip>
      
         <v-list-tile   
            v-for="item in todos"
            :key="item.id"                       
          >         
           <v-list-tile-avatar>
              <v-checkbox color="teal"  v-model="item.checked"></v-checkbox>
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title  class="mt-1" :class="{ 'done-todo': item.checked }" v-text="item.name"></v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
    </transition>
    <v-btn   v-if="poDescription && poNumber" dark color="teal">
        <v-icon dark>save</v-icon>
    </v-btn>    
    <v-btn   v-if="poDescription && poNumber" dark color="teal">
      <v-icon dark>edit</v-icon>
    </v-btn>
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
        todos: []       
    }    
},
computed: {    
    isBlackOrWhite(){
        return this.doneTodos === this.todos.length ? 'white' : ''
    },
    areTodosFinished(){
          return this.doneTodos === this.todos.length ? 'teal': ''           
    },
    doneTodos() {
        let todos = this.todos.filter((todo)=> (todo.checked))
        return todos.length
    },
    isValidPO() {
        return this.poNumber ? 'done': ''     
    },
    isValidDescription() {
        return this.poDescription ? 'done': ''
    }
},
watch: {
    'poNumber'() {
         if(!this.poNumber) {             
             this.poDescription = null
             this.todos = []
         }else{
             this.fetchTodos()
         }
    }
},
methods:{
    fetchTodos() {
        if(this.todos.length > 0)
            return 

        let todo = {
        id: 1,
        checked: false,
        name: 'JIRA ticket status changed, assigned to developer'
    }
    let todo2 = {
        id: 2,
        checked: false,
        name: 'Feature or Hotfix branch created'
    }
    this.todos.push(todo)
    this.todos.push(todo2)
    }
},
created(){
    this.fetchTodos()
}
}
</script>

<style scoped>
.white{
    color: white;
}
.black {
    color: black;
}
.done-todo {
    text-decoration: line-through;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
