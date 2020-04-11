import Vue from "vue";
import VueRouter from "vue-router";
import * as firebase from 'firebase/app';

import App from "./App";

// router setup
import router from "./router";

//vuex
import store from './store';

// Plugins
import GlobalComponents from "./globalComponents";
import GlobalDirectives from "./globalDirectives";
import Notifications from "./components/NotificationPlugin";

// MaterialDashboard plugin
import MaterialDashboard from "./material-dashboard";

import Chartist from "chartist";


Vue.prototype.$Chartist = Chartist;
Vue.use(VueRouter);
Vue.use(MaterialDashboard);
Vue.use(GlobalComponents);
Vue.use(GlobalDirectives);
Vue.use(Notifications);

const eventBus = new Vue();
export {
  eventBus
};

/* eslint-disable no-new */
new Vue({
  el: "#app",
  render: h => h(App),
  router,
  store,
  data: {
    Chartist: Chartist
  },
  created(){
    firebase.initializeApp({
      apiKey: "AIzaSyDPVe9o2n2NxVSKQdg7-zNjLNWyxHwCTQc",
      authDomain: "nuft-kebop.firebaseapp.com",
      databaseURL: "https://nuft-kebop.firebaseio.com",
      projectId: "nuft-kebop",
      storageBucket: "nuft-kebop.appspot.com",
      messagingSenderId: "499892726361",
      appId: "1:499892726361:web:a9f6dac27cd68c71505f48",
      measurementId: "G-EVX31NC9VL"
    });
  }
});
