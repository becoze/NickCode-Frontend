import { RouteRecordRaw } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import AdminView from "@/views/AdminView.vue";
import NoAuthView from "@/views/NoAuthView.vue";

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Problem",
    component: HomeView,
  },
  {
    path: "/admin",
    name: "Admin Only",
    component: AdminView,
    meta: {
      access: "admin", // admin, (user)
    },
  },
  {
    path: "/noAuth",
    name: "No Auth",
    component: NoAuthView,
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
];
