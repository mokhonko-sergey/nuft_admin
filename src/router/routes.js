import DashboardLayout from "@/pages/Layout/DashboardLayout.vue";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard.vue";
import UserProfile from "@/pages/UserProfile.vue";
// import TableList from "@/pages/TableList.vue";
// import Typography from "@/pages/Typography.vue";
// import Icons from "@/pages/Icons.vue";
// import Maps from "@/pages/Maps.vue";
// import Notifications from "@/pages/Notifications.vue";
// import UpgradeToPRO from "@/pages/UpgradeToPRO.vue";
// import Upload from "@/pages/Upload.vue";
import MediaFiles from "@/pages/MediaFiles";
import Users from "@/pages/Users/Users";
import News from "@/pages/News";
import { beforeEnter } from "./routerguard";

const userRoutes = [
  {
    path: "dashboard",
    name: "Dashboard",
    component: Dashboard
  },
  {
    path: "news",
    name: "News",
    component: News
  },
  {
    path: "user",
    name: "User Profile",
    component: UserProfile
  },
  {
    path: "mediafiles",
    name: "Media Files",
    component: MediaFiles
  },
  {
    path: "users",
    name: "Users",
    component: Users,
    beforeEnter: beforeEnter
  }
];

const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/",
    component: DashboardLayout,
    redirect: "/dashboard",
    children: userRoutes
  }
];

export default routes;
