<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
    <notifications></notifications>

    <side-bar
      title="БТЕК"
      :backgroundImage="require('@/assets/img/sidebar-1.jpg')"
    >
      <mobile-menu slot="content"></mobile-menu>
      <sidebar-link
        :to="route.to"
        v-for="(route, index) in userRoutes"
        :key="`route-${index}`"
      >
        <md-icon>{{ route.icon }}</md-icon>
        <p>{{ route.name }}</p>
      </sidebar-link>
    </side-bar>

    <div class="main-panel">
      <top-navbar></top-navbar>

      <dashboard-content> </dashboard-content>

      <content-footer v-if="!$route.meta.hideFooter"></content-footer>
    </div>
  </div>
</template>
<style lang="scss"></style>
<script>
import TopNavbar from "./TopNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import DashboardContent from "./Content.vue";
import MobileMenu from "@/pages/Layout/MobileMenu.vue";

export default {
  name: "side-menu",
  data: () => ({
    routes: [
      {
        name: "Dashboard",
        to: "/dashboard",
        icon: "dashboard",
        isAdmin: true
      },
      {
        name: "Новини",
        to: "/news",
        icon: "subject",
        isAdmin: true
      },
      {
        name: "Медіа файли",
        to: "/mediafiles",
        icon: "wallpaper",
        isAdmin: true
      },
      {
        name: "Користувачі",
        to: "/users",
        icon: "person"
      }
    ]
  }),
  computed: {
    userRoutes() {
      return this.$store.getters.isAdmin
        ? this.routes
        : this.routes.filter(el => {
            if (el.isAdmin === true) return el;
          });
    }
  },
  components: {
    TopNavbar,
    DashboardContent,
    ContentFooter,
    MobileMenu
  }
};
</script>
