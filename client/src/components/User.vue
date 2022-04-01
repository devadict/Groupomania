<template>
  <v-app>
    <v-main class="no">
          <v-container fluid fill-height>
      <v-flex xs12 sm6 offset-sm3>
      <h1 class="text-center">Bienvenue sur <span class="hi"> Groupomania </span></h1> 
    <div class="placement">
    <component  :is="showWhich"></component>  
    </div>
    
         <v-card
    class="hey mx-auto py-6 px-4 newm"
    max-width="500px"
    outlined
    rounded
  > 
 <v-row justify="center">
   <v-col>
      <h4 >Avez-vous un compte ?</h4> 
    <v-btn small @click="showWhich = 'LoginForm'">Se connecter</v-btn>
   </v-col>
   <v-col>
       <h4>Sinon, inscrivez-vous !</h4>
     <v-btn right small @click="showWhich = 'SignUpForm'">Inscrivez vous !</v-btn>
   </v-col>
 </v-row>
   
 </v-card>
</v-flex>
</v-container>

    </v-main>

  </v-app>
</template>

<script>
import LoginForm from "./LoginForm.vue";
import SignUpForm from "./SignUpForm.vue";
export default {
  components: {
      LoginForm,
      SignUpForm
  },
  data() {
    return {
    showWhich: LoginForm
   }
  },
  
};
</script>

<style scoped>
.newm {
  margin-top: -5em;
}
.hey{
  border: 1px solid #ff4500;
}
.placement {
  max-height: 8em;
}

.hi{
 color: #ff4500;
}
.no {
  overflow: hidden;
  margin-top: -25rem;
}
</style>