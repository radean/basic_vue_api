// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Vuetify from 'vuetify'
import VueResource from 'vue-resource'
import * as firebase from 'firebase'
import VueRouter from 'vue-router';
import { store } from './store/store'
import { routes } from './router';
import lodash from 'lodash';
// FirebaseApp.initializeApp(options);





// Vue Usage
Vue.use(Vuetify);
Vue.use(lodash);
Vue.use(VueResource);
Vue.use(VueRouter);



// Setting HTTP
// Vue.http.headers.common['Content-Type'] = 'application/json';
// Vue.http.headers.common['Authorization'] = 'key=AIzaSyDOUy35eMYN7woRgGdiRw0ypeShbHMDxgM';

Vue.config.productionTip = false;

// Registring Routes
const router = new VueRouter({
  routes,
  mode: 'history'
});


import('../node_modules/vuetify/dist/vuetify.min.css');

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App },
  created (){
    var firebaseConfig = {
      apiKey: "AIzaSyDgVzKdDr24zsQvJ6KS2ngf-sfDpcwJS3k",
      authDomain: "testapi-69d9f.firebaseapp.com",
      databaseURL: "https://testapi-69d9f.firebaseio.com",
      projectId: "testapi-69d9f",
      storageBucket: "testapi-69d9f.appspot.com",
      messagingSenderId: "453639137818",
      appId: "1:453639137818:web:51887fdc0160730e2fffa3"
    };
    firebase.initializeApp(firebaseConfig);
  }
});
