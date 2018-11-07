<template>
  <v-app>
  <div id="app"> 
  <v-toolbar app>  
    <v-icon color="teal" large> done_all</v-icon>
    <v-toolbar-title></v-toolbar-title>  
   <v-spacer></v-spacer>
   <v-toolbar-items>
      <v-btn v-for="btn in navigationButtons" 
      v-if="currentUser"
      :key="btn.order"
      @click="btn.navigate(btn.route)"
      color="teal"
      flat
      ><v-icon>{{ btn.icon }}</v-icon>
      </v-btn>
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
import { mapMutations, mapGetters } from 'vuex'

export default {
  name: 'app',
  data() {
    return {
      navigationButtons: [
      { route: '/', icon: 'check_circle', order: 0, navigate: this.navigate },
      { route: '/history', icon: 'history', order: 1, navigate: this.navigate },
      { route: '/account', icon: 'account_circle', order: 2, navigate: this.navigate },
      { route: '/account', icon: 'exit_to_app', order: 3, navigate: this.signOut },
      ]
    }
  },
  methods: {
    navigate(route) {   
      this.$router.replace(route)
    }, 
    async signOut(route) {      
      this.clearWorkItem()
      this.clearWorkItems()
      this.clearTasks()
      this.clearUser()

      await firebase.auth().signOut()       
      this.navigate(route)
    },
    ...mapMutations({
      clearWorkItem: 'DELETE_WORK_ITEM',
      clearWorkItems: 'DELETE_WORK_ITEMS',
      clearUser: 'DELETE_CURRENT_USER',
      clearTasks: 'DELETE_TASKS'
    }),
  },  
  computed: {   
    ...mapGetters({
      currentUser: 'currentUser'
    })   
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
