import { RouteRecordRaw } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import NoAuthView from "@/views/NoAuthView.vue";
import ACCESS_ENUM from "@/access/accessEnum";
import component from "*.vue";
import UserLoginView from "@/views/user/UserLoginView.vue";
import UserRegisterView from "@/views/user/UserRegisterView.vue";
import UserLayout from "@/layouts/UserLayout.vue";
import AddProblemView from "@/views/problem/AddProblemView.vue";
import ManageProblemView from "@/views/problem/ManageProblemView.vue";

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
    path: "/add/problem",
    name: "Add Problem",
    component: AddProblemView,
    meta: {
      access: ACCESS_ENUM.ADMIN, // admin / user
    },
  },
  {
    path: "/update/problem",
    name: "Update Problem",
    component: AddProblemView,
    meta: {
      access: ACCESS_ENUM.ADMIN, // admin / user
      hideInMenu: true,
    },
  },
  {
    path: "/manage/problem",
    name: "Manage Problem",
    component: ManageProblemView,
    meta: {
      access: ACCESS_ENUM.ADMIN, // admin / user
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
