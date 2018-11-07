<template>
<v-container>
    <v-layout>
      <v-flex  md6 offset-md3>    
        <v-card class="pa-2">             
            <v-text-field color="teal" class="custom-height mb-4"
            :disabled="disableAll || !isUniqueNumberEditable" 
            v-model="uniqueNumber"
            counter="5"
            maxlength="5"      
                        
            label="Enter PO"
            :append-icon="isValidPO"        
            outline>
         </v-text-field> 
         <transition name="fade">
            <v-text-field color="teal"  class="custom-height mb-4 mt-5"
            :disabled="disableAll || !isDescriptionEditable"  
            v-model="description"
            counter="50"
            maxlength="50"
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
                    <v-checkbox :disabled="disableAll"  color="teal"  v-model="item.checked"></v-checkbox>
                </v-list-tile-avatar>
                <v-list-tile-content>
                <v-list-tile-title  class="mt-1" :class="{ 'done-todo': item.checked }" v-text="item.text"></v-list-tile-title>
                </v-list-tile-content>
                </v-list-tile>
            </v-list>
         </transition>
    <v-btn :disabled="disableAll"   @click="save"   v-if="description && uniqueNumber" dark color="green">
        <v-icon dark>save</v-icon>
    </v-btn>    
    <v-btn :disabled="disableAll"  @click="notesDialog = true"   v-if="description && uniqueNumber" dark color="teal">
      <v-icon v-if="!notesMessage" dark>note_add</v-icon>
      <v-icon v-else dark>edit</v-icon>
    </v-btn>
    <transition name="fade">
    <v-alert v-show="disableAll"
      class="alert-success"
      :disabled="disableAll" 
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
import db from '@/firebase'
import {mapActions} from 'vuex'

export default {
  props: ["item"],
  data() {
    return {
      userId: null,
      uniqueNumber: null,
      description: null,
      notesDialog: false,
      notesMessage: null,
      todos: [],
      disableAll: false,
      date: null,
      isUniqueNumberEditable: true,
      isDescriptionEditable: true
    };
  },  
  computed: {
    baseTodos() {
      return this.$store.getters.userTasks.sort((a,b) => a-b);
    },
    isBlackOrWhite() {
      return this.doneTodos === this.todos.length ? "white" : ""
    },
    areTodosFinished() {
      return this.doneTodos === this.todos.length ? "teal" : ""
    },
    doneTodos() {
      return this.todos.filter(todo => todo.checked).length;
    },
    isValidPO() {
      return this.uniqueNumber ? "done" : ""
    },
    isValidDescription() {
      return this.description ? "done" : ""
    },
    currentUser(){
        return this.$store.getters.currentUser
    }
  },   
  methods: {
    ...mapActions({
      fetchTasks: 'fetchTasks',
      fetchWorkItems: 'fetchWorkItems',
      saveWorkItem: 'saveWorkItem'
    }),
    resetWorkItem() {
      this.uniqueNumber = null;
      this.description = null;
      this.todos = this.baseTodos.map(x => ({ ...x }));
    },
    async save() { 
      this.disableAll = true;       
      const workItem = {
            userId: this.currentUser.user.uid,
            uniqueNumber: this.uniqueNumber,
            description: this.description,
            todos: this.todos,
            notes: this.notesDialog,
            notesMessage: this.notesMessage,
            date: new Date()
                .toJSON()
                .slice(0, 10)
                .replace(/-/g, "/")
      }
          
      await this.saveWorkItem(workItem)                  
      this.resetWorkItem()
      this.disableAll = false           
    },
    loadExistingWorkItem(workItem){
      this.uniqueNumber = workItem.uniqueNumber
      this.description = workItem.description
      this.todos = workItem.todos
      this.notesMessage = workItem.notesMessage
      this.date = workItem.date
      this.isUniqueNumberEditable = false
      this.isDescriptionEditable = false
  }
  },  
  async created() {
    if (this.item) {
      this.loadExistingWorkItem(this.item)      
    } else {      
      const todos = this.baseTodos.map(x => ({ ...x }));
      this.todos = todos;
      this.isUniqueNumberEditable = true
      this.isDescriptionEditable = true
    }
  }
};
</script>

<style scoped>
.custom-height {
  height: 53px;
}
.alert-success {
  border: 2px solid greenyellow;
  border-radius: 5px;
}
.white {
  color: white;
}
.black {
  color: black;
}
.done-todo {
  text-decoration: line-through;
}

</style>
