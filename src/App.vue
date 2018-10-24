<template>
  <v-app>
  <div id="app"> 
  <v-toolbar app>
   <v-toolbar-title><v-icon color="teal" large>done_all</v-icon></v-toolbar-title>
   <v-spacer></v-spacer>
   <v-toolbar-items>
      <v-btn @click="toChecklist" color="teal" flat><v-icon >check_circle</v-icon></v-btn>    
      <v-btn @click="toHistory" color="teal" flat><v-icon >history</v-icon></v-btn>    
      <v-btn @click="toAccount" color="teal" flat><v-icon >account_circle</v-icon></v-btn>     
    </v-toolbar-items>
  </v-toolbar>
  <v-content>
    <v-container fluid>
      <router-view></router-view>
    </v-container>
  </v-content>
  </div>
  </v-app>
</template>

<script>
export default {
  name: 'app',
  methods: {
    toChecklist() {
      this.$router.push('/')
    },
    toAccount() {
      this.$router.push('/account')
    },
    toHistory(){
      this.$router.push('/history')
    }
  }
}
</script>

<style>
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
