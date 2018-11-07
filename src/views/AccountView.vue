<template>
  <div class="account">   
    <login v-if="!currentUser" />
    <tasks-list v-else />  
  </div>
</template>

<script>
import Login from '@/components/Login'
import TasksList from '@/components/TasksList'

export default {
computed:{
  currentUser(){
    return this.$store.getters.currentUser
  }
},
components: {  
  Login,
  TasksList
},

}
</script>

<style>

</style>
