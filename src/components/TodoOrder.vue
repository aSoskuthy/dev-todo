<template>
<v-card>
        <v-toolbar color="teal" dark>        
          <v-toolbar-title>Change order or description</v-toolbar-title>
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
              <v-icon @click="save(item), shouldPauseDraggable = false" color="teal" v-else>save</v-icon>
            </v-list-tile-avatar>
          </v-list-tile>
          <v-list-tile @mouseover="pauseDraggable">
            <v-list-tile-action>
              {{ todos.length + 1 }}.
            </v-list-tile-action>
             <v-list-tile-content>
                           <v-text-field style="width: 100%" color="teal"  small v-model="todo.text"
             ></v-text-field>
            </v-list-tile-content>    
             <v-list-tile-avatar >      
              <v-icon v-if="!todo.text" color="grey">save</v-icon>        
              <v-icon v-else @click="add()" color="teal">save</v-icon>
            </v-list-tile-avatar>      
          </v-list-tile>
        </draggable>
        </v-list>      
      </v-card>
</template>

<script>
import draggable from 'vuedraggable'
import Login from '@/components/Login'
import { mapActions } from 'vuex';

export default {
data(){
  return {    
    shouldPauseDraggable: true,
    todo: {
      text: '',
      checked: false,
      edit: false,
      order: 0
    }
  }
},
computed:{
  todos: {
        get() {
            return this.$store.getters.baseTodos.sort((a,b) => a.order - b.order)
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
  async reOrderTasks(tasks){    
    for(let i = 0; i <= tasks.length-1; i++)
    {
      tasks[i].order = i
    }

    await this.updateTasks(tasks)   
  },
  pauseDraggable() {
    this.shouldPauseDraggable = true
  },
  startDraggable() {    
    this.shouldPauseDraggable = false
  },
  async add() {
    const newTodo = {...this.todo}
    await this.createTask(newTodo)
    this.todo.text = ''
  },
  async updateTask(item){
    try{
      item.edit = false
      await this.updateTask(item)
    }catch(error){
      console.log(error)
    }    
      
  },
  ...mapActions({
    fetchTodos: 'fetchBaseTodos',
    updateTask: 'updateTaskText',
    createTask: 'createTask',
    updateTasks: 'updateTasksOrder'
  })
},
created(){
  try{
    this.fetchTodos()
  }catch(error){
    console.log(error)
  }
  
}

}
</script>

<style>

</style>