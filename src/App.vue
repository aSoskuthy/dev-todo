<template>
  <v-app>
  <div id="app"> 
  <v-toolbar color="teal" dark app>  
    <!-- <v-icon color="teal" large> done_all</v-icon> -->
  <v-toolbar-title class="title-text">andrASANA</v-toolbar-title>  
   <v-spacer></v-spacer>
   <v-toolbar-items>
      <v-btn v-for="btn in navigationButtons" 
      v-if="currentUser"
      :key="btn.order"
      @click="btn.navigate(btn.route)"      
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
import { mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  name: 'app',
  data() {
    return {
      navigationButtons: [
      { route: '/', icon: 'playlist_add',  navigate: this.navigate },
      { route: '/history', icon: 'history', navigate: this.navigate },
      { route: '/account', icon: 'settings', navigate: this.navigate },
      { route: '/account', icon: 'exit_to_app', navigate: this.logOut },
      ]
    }
  },
  computed: {   
    ...mapGetters({
      currentUser: 'currentUser'
    })      
  },  
  methods: {
    ...mapActions({
      signOut: 'signOut'
      
    }),
    ...mapMutations({
      clearWorkItem: 'SET_WORK_ITEM'
    }),
    async logOut(route) {  
      await this.signOut()      
      this.navigate(route)
    },   
    navigate(route) {   
      if(route === '/') {
        const emptyItem = { 
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
        }

      this.clearWorkItem(emptyItem)
      }
      this.$router.replace(route)
    }
  }  
  
}
</script>

<style>
.title-text{
  font-family: 'Raleway', sans-serif;
  font-size: 40px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

#app {
  font-family: 'Raleway,', sans-serif;
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
