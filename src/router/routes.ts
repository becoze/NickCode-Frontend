import { RouteRecordRaw } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import AdminView from "@/views/AdminView.vue";
import NoAuthView from "@/views/NoAuthView.vue";
import ACCESS_ENUM from "@/access/ACCESS_ENUM";

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Problems",
    component: HomeView,
  },
  {
    path: "/admin",
    name: "Admin Only",
    component: AdminView,
    meta: {
      access: ACCESS_ENUM.ADMIN,
    },
  },
  {
    path: "/about",
    name: "About me",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  {
    path: "/noAuth",
    name: "noAuth",
    component: NoAuthView,
    meta: {
      hideInMenu: true,
    },
  },
];
