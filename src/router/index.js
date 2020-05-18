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
  const { userId, refreshToken, expired } = store.getters.getUser;
  to.name !== "Login" && !userId ? next({ name: "Login" }) : next();
  next();
});

export default router;
