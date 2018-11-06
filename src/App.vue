<template>
  <v-app>
  <div id="app"> 
  <v-toolbar app>  
    <v-icon color="teal" large> done_all</v-icon>
    <v-toolbar-title style="color: teal; font-size: 24px"></v-toolbar-title>  
   <v-spacer></v-spacer>
   <v-toolbar-items>
      <v-btn v-if="currentUser" @click="toChecklist" color="teal" flat><v-icon >check_circle</v-icon></v-btn>    
      <v-btn v-if="currentUser" @click="toHistory" color="teal" flat><v-icon >history</v-icon></v-btn>    
      <v-btn @click="toAccount" color="teal" flat><v-icon >account_circle</v-icon></v-btn>     
      <v-btn v-if="currentUser" @click="signOut" color="teal" flat><v-icon >exit_to_app</v-icon></v-btn>   
    </v-toolbar-items>
  </v-toolbar>
  <v-content>
    <v-container fluid>
      <router-view :key="$route.fullPath"></router-view>
    </v-container>
  </v-content>
  </div>
  </v-app>
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'app',
  methods: {
    toChecklist() {
      this.$router.replace({name: 'editWorkItem'})
    },
    toAccount() {
      this.$router.replace('/account')
    },
    toHistory(){
      this.$router.replace('/history')
    },
    async signOut(){
      await firebase.auth().signOut()
      this.$store.commit('clearCurrentUser')    
      this.$router.replace('/history')
      
    }
  },  
  computed: {   
    currentUser(){
      return this.$store.getters.currentUser
    }
  }  
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
