<template>
  <div class="account">   
    <login v-if="!currentUser" />
    <tasks v-else />  
  </div>
</template>

<script>
import Login from '@/components/Login'
import Tasks from '@/components/Tasks'

export default {
computed:{
  currentUser(){
    return this.$store.getters.currentUser
  }
},
components: {  
  Login,
  Tasks
},

}
</script>

<style>

</style>
