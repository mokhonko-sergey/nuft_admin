import store from "@/store";

const beforeEnter = (to, from, next) => {
  const isAdmin = store.getters.isAdmin;
  isAdmin ? next() : next(from);
};

export { beforeEnter };
