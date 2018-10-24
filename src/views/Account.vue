<template>
  <div class="account">   

<v-card>
        <v-toolbar color="teal" dark>        
          <v-toolbar-title>Drag to change order</v-toolbar-title>
        </v-toolbar>

        <v-list>
        <draggable :options="{'disabled': isItemBeingEdited}" v-model="todos" @start="drag=true" @end="drag=false">
          <v-list-tile style="cursor: pointer" 
            v-for="item in todos"
            :key="item.title"
            avatar           
          >
            <v-list-tile-action>
              {{ todos.indexOf(item) + 1}}. 
            </v-list-tile-action>

            <v-list-tile-content v-if="!item.edit">
              <v-list-tile-title   v-text="item.name"></v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-content v-if="item.edit">
              <v-text-field style="width: 100%" color="teal" v-model="item.name"   small 
             ></v-text-field>
            </v-list-tile-content>


            <v-list-tile-avatar >
              <v-icon @click="item.edit = true, isItemBeingEdited = true"  color="teal"  v-if="!item.edit">edit</v-icon>
              <v-icon @click="item.edit = false, isItemBeingEdited = false" color="teal" v-else>save</v-icon>
            </v-list-tile-avatar>
          </v-list-tile>
        </draggable>
        </v-list>
      </v-card>


  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
data(){
  return {
    isItemBeingEdited: false
  }
},
computed:{
  todos: {
        get() {
            return this.$store.getters.todos
        },
        set(value) {
            this.$store.commit('setTodos', value)
        }
}
},
components: {
  draggable
},

}
</script>

<style>

</style>
