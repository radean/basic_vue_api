<template>
  <v-app
    id="inspire"
    dark
  >
    <v-toolbar class="transper" dense fixed clipped-left app dark>
      <v-toolbar-title style="width: 300px" class="ml-0 pl-3">
        <v-toolbar-side-icon v-if="notLogin" @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        {{ appinfo.name }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items v-if="notLogin">
        <v-btn icon pulse><v-icon>notifications</v-icon></v-btn>
        <v-btn icon pulse><v-icon>message</v-icon></v-btn>
        <v-btn pulse flat v-on:click="helpDialog = !helpDialog">help</v-btn>
        <v-btn pulse flat v-on:click="onSignOut" >LOGOUT</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <!--<main>-->
      <v-content>
        <v-container>
          <transition name="fade">
            <!--Content goes here-->
            <router-view></router-view>
          </transition>
        </v-container>
      </v-content>
    <!--</main>-->
    <!--DIALOGS-->
    <!--Bug Report Dialog-->
    <v-dialog v-model="bugReportDialog" persistent>
      <!--<v-btn color="primary" dark slot="activator">Open Dialog</v-btn>-->
      <v-card>
        <v-card-title class="headline">BUG REPORTING</v-card-title>
        <v-card-text>Email: help@vdm.com.pk<br>Phone #: (021)-85432156</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat @click.native="bugReportDialog = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--HELP DIALOG-->
    <v-dialog v-model="helpDialog" persistent>
      <!--<v-btn color="primary" dark slot="activator">Open Dialog</v-btn>-->
      <v-card>
        <v-card-title class="headline">Help & Contact</v-card-title>
        <v-card-text>Email: help@vdm.com.pk<br>Phone #: (021)-85432156</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat @click.native="helpDialog = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--Loading Dialog-->
    <v-dialog v-model="appLoadingStats.mainLoading" persistent >
      <!--<v-btn color="primary" dark slot="activator">Open Dialog</v-btn>-->
      <v-card dark>
        <v-card-title class="headline">Please Wait </v-card-title>
        <v-card-text>if this query taking more than 30 seconds contact VDM.</v-card-text>
        <v-container>
          <v-layout row wrap center>
            <v-flex xs2 offset-xs5>
              <v-progress-circular indeterminate v-bind:size="50" color="amber"></v-progress-circular>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>


    <!--Messages-->
    <!--Snackers-->
    <v-snackbar
      v-model="successFlag"
      :top="true"
      class="green"
      dark
    >
      {{ successMsg }}
      <v-btn flat color="white" @click.native="successFlag = false">Close</v-btn>
    </v-snackbar>

    <!--Errors-->
    <!--B.A Sign in Error-->
    <v-dialog v-model="appError" persistent >
      <!--<v-btn color="primary" dark slot="activator">Open Dialog</v-btn>-->
      <v-card>
        <v-card-title class="headline">Authorization Error</v-card-title>
        <v-card-text>Please double check your Username and Password.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" flat>Wait 5 seconds</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--Footer-->
    <v-footer class="pa-3 transper" fixed dark>
      <div>{{ appinfo.fullname }} - version - {{ appinfo.version }}</div>
      <v-spacer></v-spacer>
      <div class="transperr"> VDM™ {{ new Date().getFullYear() }} | {{ appinfo.company }}</div>
    </v-footer>

  </v-app>
</template>

<script>
export default {
  data () {
    return {
//      Settings
      drawer: false,
      notLogin: false,
//      User Details
      currentDate: null,
      userDetail: {
        name: '',
        title: '',
        picture: './static/img/app/placeholder.jpg',
      },
//      Dialogs
      bugReportDialog: false,
      helpDialog: false,
//      Toasts
    }
  },
  watch: {
    user(value){
      if (value){
        this.notLogin = true;
      }else if(!value){
        this.notLogin = false;
      }
    },
    // userInfo (value){
    //   if (value !== null && value !== undefined) {
    //     switch (this.userInfo.role) {

    //       default:
    //         this.notLogin = false;
    //         break;

    //       case "Administrator":
    //         this.notLogin = true;
    //         this.$router.push('/');
    //         break;

    //       case "Client":
    //         this.notLogin = true;
    //         this.$router.push('/merc');
    //         break;
    //     }
    //   }
    //   else if(value == null ) {
    //       console.log('user info Error')
    //       this.$router.push('/login')
    //   }
    // }
  },
  created(){
    // this.$store.dispatch('userSession');
    // let user = this.$store.getters.user;
    // if (user === null) {
    //   console.log('created user Error')
    //   this.$router.push('/login')
    // };
    // setTimeout(() => {
    //   this.$http.get('https://api.timezonedb.com/v2/list-time-zone?key=QNVJJL9QLWE4&format=json&country=PK').then(response => {
    //     let date = new Date((response.body.zones[0].timestamp * 1000) - response.body.zones[0].gmtOffset * 1000);
    //     let day = ("0" + date.getDate()).slice(-2);
    //     let month = date.getMonth() + 1;
    //     this.currentDate = month + '-' + day;
    //   }).catch(() => {
    //     let date = new Date();
    //     let day = ("0" + date.getDate()).slice(-2);
    //     let month = date.getMonth() + 1;
    //     this.currentDate = month + '-' + day;
    //   });
    //   this.setUpUser();
    //   console.log('done')
    // }, 6000)
  },
  computed: {
      userInfo(){
        return this.$store.getters.userInfo;
      },
      appinfo(){
        return this.$store.getters.appinfo
      },
      // appError(){
      //   let error = this.$store.getters.userError
      //   if (error) {
      //     setTimeout(() => {
      //       this.$router.push('/login')
      //     }, 4000)
      //   }
      //   return error
      // },
      user (){
        return this.$store.getters.user
      },
      appLoadingStats(){
        return this.$store.getters.mainLoading
      },
      successMsg(){
        return this.$store.getters.successMsg
      },
      successFlag(){
        return this.$store.getters.successFlag
      }
  },
  methods:{
    // onSignOut(){
    //   this.$store.dispatch('userSignOut');
    //   this.$router.push('/login')
    //   document.location.reload(true);
    // },
    // setUpUser(){
    //   this.userDetail.name = this.userInfo.name;
    // }
  }
}
</script>

<style>
  /*importing Font*/
  @import url('https://fonts.googleapis.com/css?family=Noto+Sans');
  /*Applying Font*/
  body {
    font-family: 'Noto Sans', sans-serif;
    user-select: none;
  }
  ::-webkit-scrollbar-button{ display: none; height: 8px; border-radius: 0px; background-color: #4a4a4a; } ::-webkit-scrollbar-button:hover{ background-color: #414141; } ::-webkit-scrollbar-thumb{ background-color: #c7c7c7; border-radius: 4px; } ::-webkit-scrollbar-thumb:hover{ background-color: #CCC; border-radius: 4px; } ::-webkit-scrollbar-track{ background-color: #737373; } ::-webkit-scrollbar-track:hover{ background-color: #000000; } ::-webkit-scrollbar{ width: 12px; }

  /*-webkit-scrollbar-button{ display: none; height: 13px; border-radius: 0px; background-color: #4a4a4a; } -webkit-scrollbar-button:hover{ background-color: #414141; } -webkit-scrollbar-thumb{ background-color: #c7c7c7; border-radius: 8px; } -webkit-scrollbar-thumb:hover{ background-color: #CCC; border-radius: 8px; } -webkit-scrollbar-track{ background-color: #737373; } -webkit-scrollbar-track:hover{ background-color: #000000; } -webkit-scrollbar{ width: 4px; }*/

  #inspire{
    font-family: 'Noto Sans', sans-serif;
    background: #000046;  /* fallback for old browsers */
    background: -webkit-linear-gradient(to right, #1CB5E0, #000046);  /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to right, #1CB5E0, #000046); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

  }
  .gradientHead{
    background: #0575E6;  /* fallback for old browsers */
    background: -webkit-linear-gradient(to right, #021B79, #0575E6);  /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to right, #021B79, #0575E6); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  }
  .gradientDialog{
    background: #000428;  /* fallback for old browsers */
    background: -webkit-linear-gradient(to right, #004e92, #000428);  /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to right, #004e92, #000428); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  }
  .transper {
    background-color: rgba(60,60,60,0.4);
    color: white;
  }

  #app {
    /*font-family: 'Barlow', sans-serif;*/
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 0px;
  }

  .input-group__details:after {
    background-color: rgba(255, 255, 255, 0.32) !important;
  }

  a {color: inherit !important;}

  form {
    margin: 0px; padding: 0px; width: 100%;
  }

  .fade-enter-active, .fade-leave-active {
    transition-property: opacity;
    transition-duration: .25s;
  }

  .fade-enter-active {
    transition-delay: .25s;
  }

  .fade-enter, .fade-leave-active {
    opacity: 0
  }
</style>
