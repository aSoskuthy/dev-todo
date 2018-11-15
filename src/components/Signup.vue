<template>
<v-card>
    <v-form class="mb-3">
        <v-toolbar dark color="teal">
            <v-toolbar-title>Signup</v-toolbar-title>
        </v-toolbar>
        <v-container>
            <v-flex>                 
                <v-text-field
                    v-model="credentials.email"
                    color="teal"
                    label="Email"
                    
                    outline
            ></v-text-field>
           <v-text-field
                v-model="credentials.password"
                color="teal"
                label="Password"
                
                outline
                type="password"
          ></v-text-field>
          <v-btn @click="signup()" 
          large color="teal" 
          dark
          >Signup</v-btn>                
            </v-flex>
            <v-flex>
                  Already have an account? <router-link :to="'/account'">Login</router-link>
            </v-flex>
        </v-container>
    </v-form>
</v-card>
</template>

<script>
import firebase from 'firebase'
import { mapActions } from 'vuex'
export default {
    data(){
    return {
        credentials:{
            email: '',
            password: ''
        }        
    }
},
methods:{
    ...mapActions({
        login: 'signIn'
    }),
    async signup(){
        await firebase.auth().createUserWithEmailAndPassword(
            this.credentials.email, 
            this.credentials.password).catch(alert)
        await this.login(this.credentials)       
        this.$router.push('/')
    }
}
}
</script>
