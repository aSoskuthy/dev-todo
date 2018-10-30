<template>
<v-card>
    <v-form v-if="!currentUser" class="mb-3">
        <v-toolbar dark color="teal">
            <v-toolbar-title>Login</v-toolbar-title>
        </v-toolbar>
        <v-container>
            <v-flex>                 
                <v-text-field
                    v-model="email"
                    color="teal"
                    label="Outline"
                    placeholder="Email"
                    outline
            ></v-text-field>
           <v-text-field
                v-model="password"
                color="teal"
                label="Outline"
                placeholder="Password"
                outline
                type="password"
          ></v-text-field>
          <v-btn @click="login" large color="teal" dark>login</v-btn>
            </v-flex>
        </v-container>
    </v-form>
</v-card>
</template>

<script>
import firebase from 'firebase'

export default {
data(){
    return {
        email: '',
        password: ''
    }
},
computed:{
    currentUser() {
        return this.$store.getters.currentUser
    }
},
methods: {
    login(){        
        firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(
        (user) => {      
            this.$store.commit('setCurrentUser', user)
            this.$router.push('/')
        },
        (err) => {            
            alert('Ooops. ' + err.message)
        })
    }
}

}
</script>

<style>

</style>
