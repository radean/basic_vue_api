<template>
  <v-container text-xs-center>
    <v-layout row wrap>
      <v-flex xs12 md12>
        <v-avatar :tile="false" :size="'128px'" class="grey lighten-4 ma-1">
          <img class="bordered" src="../../assets/placeholder.jpg" alt="avatar">
        </v-avatar>
      </v-flex>
      <form @submit.prevent="onSubmit">
      <!--username-->
      <v-flex xs10 md4 offset-md4>
        <v-text-field
          name="useremail"
          label="USERNAME"
          autocomplete="username"
          v-model="useremail"
        ></v-text-field>
      </v-flex>
      <!--password-->
      <v-flex xs10 md4 offset-md4 >
        <v-text-field
          name="userPassword"
          label="PASSWORD"
          autocomplete="current-password"
          min="6"
          v-model="userpass"
          type="password"
        ></v-text-field>
      </v-flex>
      <!--submission-->
      <v-flex xs12>
        <v-btn color="green" :disabled="!formIsValid" type="submit"> SUBMIT <v-icon right>send</v-icon></v-btn>
      </v-flex>
      <!--Registration -->
      <v-flex xs12>
        <v-btn small color="blue" to="Registration">Registration</v-btn>
      </v-flex>
    </form>
    </v-layout>
  </v-container>
</template>


  <script>
  //  importing Temps
  export default {
    data () {
      return {
//      userInfo
        useremail: '',
        userpass: '',
      }
    },
    created(){
//      this.$store.dispatch('userSession');
    },
    computed:{
      formIsValid(){
        return this.username !== '' && this.userpass !== ''
      }
    },
    methods:{
        onSubmit() {
          this.$store.dispatch('userSignIn', {email: this.useremail, password: this.userpass}).then(() => {
              this.$router.push('/Landing')
          })
        }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
