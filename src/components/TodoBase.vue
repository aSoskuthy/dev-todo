<template>
<v-container>
    <v-layout>
      <v-flex  md6 offset-md3>    
        <v-card class="pa-2">             
        <v-text-field color="teal" class="custom-height mb-2"
        :disabled="readOnly" 
        v-model="uniqueNumber"                    
        label="Enter PO"
        :append-icon="isValidPO"
        
            outline>
         </v-text-field> 
         <transition name="fade">
        <v-text-field color="teal"  class="custom-height mb-2 mt-3"
        :disabled="readOnly"  
        v-model="description"
        v-if="uniqueNumber"            
        label="Enter description"
        :append-icon="isValidDescription"
            outline>
         </v-text-field> 
         </transition>
         <transition name="fade">
        
        <v-list v-if="description">
         
          <v-chip :class="isBlackOrWhite" :color="areTodosFinished">{{ doneTodos }} / {{ todos.length}}</v-chip>
      
         <v-list-tile   
            v-for="item in todos"
            :key="item.id"                       
          >         
           <v-list-tile-avatar>
              <v-checkbox :disabled="readOnly"  color="teal"  v-model="item.checked"></v-checkbox>
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title  class="mt-1" :class="{ 'done-todo': item.checked }" v-text="item.name"></v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
    </transition>
    <v-btn :disabled="readOnly"   @click="save"   v-if="description && uniqueNumber" dark color="green">
        <v-icon dark>save</v-icon>
    </v-btn>    
    <v-btn :disabled="readOnly"  @click="notesDialog = true"   v-if="description && uniqueNumber" dark color="teal">
      <v-icon v-if="!notesMessage" dark>note_add</v-icon>
      <v-icon v-else dark>edit</v-icon>
    </v-btn>
    <transition name="fade">
    <v-alert v-show="readOnly"
      class="alert-success"
      :disabled="readOnly" 
      color="success"
      icon="check_circle"
      outline
    >
      Item saved successfully
    </v-alert>
    </transition >
    <v-dialog
      v-model="notesDialog"
      max-width="870"
    >
      <v-card>
        <v-card-title class="headline">Enter your notes</v-card-title>

        <v-card-text>
           <v-textarea        
          v-model="notesMessage"          
        ></v-textarea>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="teal"
            flat="flat"
            @click="notesDialog = false"
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
import axios from 'axios'
export default {
props: ['item'],
data() {
    return {   
        id: 0,    
        uniqueNumber: null,
        description: null,        
        notesDialog: false,
        notesMessage: null, 
        todos: [],
        readOnly: false,
        date: null             
    }    
},
computed: {    
    baseTodos() {
        return this.$store.getters.baseTodos
    },
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
        return this.uniqueNumber ? 'done': ''     
    },
    isValidDescription() {
        return this.description ? 'done': ''
    }
},
methods:{    
    clear(){
        this.uniqueNumber = null
        this.description = null
        this.todos = this.baseTodos.map(x => ({...x}))
    },    
    save() {       
      
        let workItem = {
            uniqueNumber: this.uniqueNumber,
            description: this.description,
            todos: this.todos,
            notes: this.notesDialog,
            notesMessage: this.notesMessage,
            date: new Date().toJSON().slice(0,10).replace(/-/g,'/')           
        }        
        this.readOnly = true        
        //saving to database
        setTimeout(()=> {    
                this.$store.commit('setWorkItem', workItem)            
                this.clear()
                this.readOnly = false
        },  300)        
    }    
},
created() {
 
    if(this.item){
        this.uniqueNumber = this.item.uniqueNumber
        this.description = this.item.description
        this.todos = this.item.todos
        this.notesMessage = this.item.notesMessage
        this.date = this.item.date
    }else{
        // copy of an array (without reference) and a copy of every object without one level of references.
        this.todos = this.baseTodos.map(x => ({...x}))
    }
    
}
}
</script>

<style scoped>
.custom-height{
height: 53px;
}
.alert-success {
    border: 2px solid greenyellow;
    border-radius: 5px;
}
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
