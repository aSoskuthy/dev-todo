<template>
  <v-app>
  <div id="app"> 
  <v-toolbar app>
   <v-toolbar-title>DevCycle</v-toolbar-title>
   <v-spacer></v-spacer>
   <v-toolbar-items>
      <v-btn @click="toChecklist" flat>Checklist</v-btn>
      <v-btn @click="toAccount" flat>Account</v-btn>     
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
