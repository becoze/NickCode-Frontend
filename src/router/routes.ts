import { RouteRecordRaw } from "vue-router";
import NoAuthView from "@/views/NoAuthView.vue";
import ACCESS_ENUM from "@/access/accessEnum";
import UserLoginView from "@/views/user/UserLoginView.vue";
import UserRegisterView from "@/views/user/UserRegisterView.vue";
import UserLayout from "@/layouts/UserLayout.vue";
import AddProblemView from "@/views/problem/AddProblemView.vue";
import ManageProblemView from "@/views/problem/ManageProblemView.vue";
import ProblemsView from "@/views/problem/ProblemsView.vue";
import ProblemSubmitView from "@/views/problem/ProblemSubmitView.vue";
import ViewProblemsView from "@/views/problem/ViewProblemsView.vue";

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
    path: "/problems",
    name: "Problems",
    component: ProblemsView,
  },
  {
    path: "/problem_submit",
    name: "My Submission",
    component: ProblemSubmitView,
    meta: {
      access: [ACCESS_ENUM.ADMIN, ACCESS_ENUM.USER], // admin / user
    },
  },
  {
    path: "/view/problem/:id",
    name: "View Problem",
    component: ViewProblemsView,
    props: true,
    meta: {
      access: [ACCESS_ENUM.ADMIN, ACCESS_ENUM.USER], // admin / user
      hideInMenu: true,
    },
  },
  {
    path: "/add/problem",
    name: "Add Problem",
    component: AddProblemView,
    meta: {
      access: [ACCESS_ENUM.ADMIN, ACCESS_ENUM.USER], // admin / user
    },
  },
  {
    path: "/update/problem",
    name: "Update Problem",
    component: AddProblemView,
    meta: {
      access: [ACCESS_ENUM.ADMIN, ACCESS_ENUM.USER], // admin / user
      hideInMenu: true,
    },
  },
  {
    path: "/manage/problem",
    name: "Manage Problem",
    component: ManageProblemView,
    meta: {
      access: ACCESS_ENUM.ADMIN, // admin only
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
    name: "To GitHub",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
];
