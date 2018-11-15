<template>
  <div class="account">   
    <login v-if="!currentUser && $route.name !== 'signup'" />
    <tasks-list v-if="currentUser" />  
    <signup v-if="$route.name === 'signup'" />
  </div>
</template>

<script>
import Login from '@/components/Login'
import TasksList from '@/components/TasksList'
import Signup from '@/components/Signup'

export default {
computed:{
  currentUser(){
    return this.$store.getters.currentUser
  }
},
components: {  
  Login,
  Signup,
  TasksList
},
created(){
  console.log(this.$route.name)
}
}
</script>

<style>

</style>
