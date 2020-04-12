import VueRouter from "vue-router";
import routes from './routes';
import store from '../store';

// configure router
const router =  new VueRouter({
  mode: 'history',
  routes,
  linkExactActiveClass: "nav-item active",
});

router.beforeEach((to, from, next) => {
  store.dispatch('checkUserToken')
    .then(result => {
      if (to.name !== 'Login' && !result) next({ name: 'Login' });
      else if (to.name === 'Login' && result) next({name: from.name});
      else next();
    }).catch((err) => {
      console.log(err);
      next({ name: 'Login' });
    })
});

export default router;