import VueRouter from "vue-router";
import routes from './routes';
import store from '../store';

// configure router
const router =  new VueRouter({
  mode: 'history',
  routes,
  linkExactActiveClass: "nav-item active",
});

router.beforeEach(async (to, from, next) => {
  const { userId, refreshToken, expired } = store.getters.getUser;

  const isExpired = Date.parse(expired) > Date.now();

  // if(!isExpired && expired){
  //   const query = await store.dispatch('updateUserToken', { refreshToken });
  //   if(query.success) {
  //     const { token, refreshToken, expired} = query;
  //     store.commit('', { token, refreshToken, expired });
  //   }
  // }

  (to.name !== 'Login' && !userId && !isExpired) 
    ? next ({ name: "Login" })
    : next();
});

export default router;