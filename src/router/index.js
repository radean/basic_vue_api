import Vue from 'vue'
import Router from 'vue-router'
// Components
import Welcome from '../components/AppMain/Welcome.vue'
import Create from '../components/AppMain/Create.vue'
import Login from '../components/Auth/Login.vue'

Vue.use(Router);

export const routes = [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      name: 'Home',
      component: Welcome
    },
    {
      path: '/create',
      name: 'Create',
      component: Create
    }
];
