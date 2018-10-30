<template>
  <div class="account">   
    <login v-if="!currentUser" />
    <todo-order v-else />  
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import Login from '@/components/Login'
import TodoOrder from '@/components/TodoOrder'

export default {
data(){
  return {
    isItemBeingEdited: false
  }
},
computed:{
currentUser(){
  return this.$store.getters.currentUser
}
},
components: {
  draggable,
  Login,
  TodoOrder
},

}
</script>

<style>

</style>
