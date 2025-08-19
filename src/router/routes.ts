import { RouteRecordRaw } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import AdminView from "@/views/AdminView.vue";
import NoAuthView from "@/views/NoAuthView.vue";
import ACCESS_ENUM from "@/access/accessEnum";
import component from "*.vue";
import UserLoginView from "@/views/user/UserLoginView.vue";
import UserRegisterView from "@/views/user/UserRegisterView.vue";
import UserLayout from "@/layouts/UserLayout.vue";

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/user",
    name: "User",
    meta: {
      hideInMenu: true,
    },
    component: UserLayout,
    children: [
      {
        path: "/user/login",
        name: "User Login",
        component: UserLoginView,
      },
      {
        path: "/user/register",
        name: "User Register",
        component: UserRegisterView,
      },
    ],
  },
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
      access: ACCESS_ENUM.ADMIN, // admin, (user)
    },
  },
  {
    path: "/noAuth",
    name: "No Auth",
    component: NoAuthView,
    meta: {
      hideInMenu: true,
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
];
