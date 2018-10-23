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
    <v-btn  @click="addWorkItem"   v-if="poDescription && poNumber" dark color="teal">
        <v-icon dark>save</v-icon>
    </v-btn>    
    <v-btn @click="notes = true"   v-if="poDescription && poNumber" dark color="teal">
      <v-icon dark>note_add</v-icon>
    </v-btn>
    <v-dialog
      v-model="notes"
      max-width="870"
    >
      <v-card>
        <v-card-title class="headline">Enter your notes</v-card-title>

        <v-card-text>
           <v-textarea        
          v-model="notes_message"          
        ></v-textarea>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="teal"
            flat="flat"
            @click="notes = false"
          >
            Close
          </v-btn>         
        </v-card-actions>
      </v-card>
    </v-dialog>
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
        notes: false,
        notes_message: null,
        status: 'active'       
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
        return this.todos.filter((todo)=> (todo.checked)).length       
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
    addWorkItem() {
        let workItem = {
            poNumber: this.poNumber,
            poDescription: this.poDescription,
            todos: this.todos,
            notes: this.notes,
            notes_message: this.notes_message            
        }

        this.$store.commit('setWorkItem', workItem)
    },
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
