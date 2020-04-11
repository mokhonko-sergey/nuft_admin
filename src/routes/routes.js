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
import MediaFiles from '@/pages/MediaFiles';

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
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: Dashboard
      },
      {
        path: "user",
        name: "User Profile",
        component: UserProfile
      },
      // {
      //   path: "table",
      //   name: "Table List",
      //   component: TableList
      // },
      // {
      //   path: "typography",
      //   name: "Typography",
      //   component: Typography
      // },
      // {
      //   path: "maps",
      //   name: "Maps",
      //   meta: {
      //     hideFooter: true
      //   },
      //   component: Maps
      // },
      // {
      //   path: "notifications",
      //   name: "Notifications",
      //   component: Notifications
      // },
      {
        path: "mediafiles",
        name: "Media Files",
        component: MediaFiles
      },
    ]
  }
];

export default routes;
