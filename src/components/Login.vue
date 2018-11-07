<template>
<v-card>
    <v-form v-if="!currentUser" class="mb-3">
        <v-toolbar dark color="teal">
            <v-toolbar-title>Login</v-toolbar-title>
        </v-toolbar>
        <v-container>
            <v-flex>                 
                <v-text-field
                    v-model="credentials.email"
                    color="teal"
                    label="Outline"
                    placeholder="Email"
                    outline
            ></v-text-field>
           <v-text-field
                v-model="credentials.password"
                color="teal"
                label="Outline"
                placeholder="Password"
                outline
                type="password"
          ></v-text-field>
          <v-btn @click="login" 
          large color="teal" 
          dark
          >login</v-btn>
            </v-flex>
        </v-container>
    </v-form>
</v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
data(){
    return {
        credentials:{
            email: '',
            password: ''
        }        
    }
},
computed:{
    ...mapGetters({
        currentUser: 'currentUser'
    }),    
},
methods: {
    ...mapActions({
        signIn: 'signIn'
    }),
    async login() { 
        await this.signIn(this.credentials)      
        this.$router.push('/history')                    
    }
}

}
</script>

<style>

</style>
