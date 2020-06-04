import VueRouter from "vue-router";
import routes from "./routes";
import store from "@/store";

// configure router
const router = new VueRouter({
  mode: "history",
  routes,
  linkExactActiveClass: "nav-item active"
});

router.beforeEach(async (to, from, next) => {
  store.dispatch("checkPersistence");
  const { expired, refreshToken } = store.getters.getUser;
  const isExpiredToken = expired ? expired - Date.now() < 0 : true;

  if (isExpiredToken && refreshToken) {
    await store.dispatch("updateTokens", refreshToken);
  }

  const { token, userId } = store.getters.getUser;
  to.name !== "Login" && !token && !userId ? next({ name: "Login" }) : next();
});

export default router;
