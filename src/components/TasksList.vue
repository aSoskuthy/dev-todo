<template>
<v-card>   
        <v-toolbar color="teal" dark>        
          <v-toolbar-title>Drag to change order, or click <v-icon  dark>edit</v-icon> description</v-toolbar-title>
        <v-spacer /><v-tooltip @click="deleteAll" left>Delete All <v-icon slot="activator">layers_clear</v-icon></v-tooltip>
        </v-toolbar>       
        <v-list>
        <draggable :options="{'disabled': shouldPauseDraggable}" v-model="todos" @start="drag=true" @end="drag=false">
          <v-list-tile @mouseover="startDraggable" style="cursor: pointer" 
            v-for="item in todos"
            :key="item.title"
            avatar           
          >
            <v-list-tile-action>
              {{ todos.indexOf(item) + 1}}. 
            </v-list-tile-action>

            <v-list-tile-content v-if="!item.edit">
              <v-list-tile-title   v-text="item.text"></v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-content v-if="item.edit">
              <v-text-field style="width: 100%" color="teal" v-model="item.text"   small 
             ></v-text-field>
            </v-list-tile-content>


            <v-list-tile-avatar >
              <v-icon @click="item.edit = true, shouldPauseDraggable = true"  color="teal"  v-if="!item.edit">edit</v-icon>
              <v-icon @click="updateTask(item), shouldPauseDraggable = false" color="teal" v-else>save</v-icon>
            </v-list-tile-avatar>
          </v-list-tile>
          <v-list-tile @mouseover="pauseDraggable">
            <v-list-tile-action>
              {{ todos.length + 1 }}.
            </v-list-tile-action>
             <v-list-tile-content>
                           <v-text-field style="width: 100%" color="teal"  small v-model="task.text"
             ></v-text-field>
            </v-list-tile-content>    
             <v-list-tile-avatar >      
              <v-icon v-if="!task.text" color="grey">save</v-icon>        
              <v-icon v-else @click="newTask()" color="teal">save</v-icon>
            </v-list-tile-avatar>      
          </v-list-tile>
        </draggable>
        </v-list>      
      </v-card>
</template>

<script>
import draggable from 'vuedraggable'
import Login from '@/components/Login'
import { mapActions, mapGetters } from 'vuex';

export default {
data(){
  return {    
    shouldPauseDraggable: true,   
    task: {
      text: '',
      checked: false,
      edit: false,
      order: 0
    }
  }
},
computed:{  
  ...mapGetters({
    userId: 'getUserId'
  }),
  todos: {
        get() {
            return this.$store.getters.userTasks.sort((a,b) => a.order - b.order)
        },
        set(value) {       
              this.reOrderTasks(value)                       
        }
  }
},
components: {
  draggable  
},
methods:{ 
  pauseDraggable() {
    this.shouldPauseDraggable = true
  },
  startDraggable() {    
    this.shouldPauseDraggable = false
  },
  async reOrderTasks(tasks){    
    for(let i = 0; i <= tasks.length-1; i++)
    {
      tasks[i].order = i
    }
    
    await this.updateTaskOrder(tasks)   
  },
  async newTask() {
    const newTask = {
      ...this.task,
      userId: this.userId
    }
    await this.createTask(newTask)
    this.task.text = ''
  },
  async updateTask(item){    
    item.edit = false
    await this.updateTaskText(item)          
  },
  ...mapActions({
    fetchTasks: 'fetchTasks',
    updateTaskText: 'updateTaskText',
    createTask: 'createTask',
    updateTaskOrder: 'updateTaskOrder',
    deleteAll: 'deleteAllTasks'    
  })
},
async created(){
  await this.fetchTasks()
}
}
</script>

<style>

</style>