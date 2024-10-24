// initial state
import { StoreOptions } from "vuex";
import ACCESS_ENUM from "@/access/ACCESS_ENUM";

export default {
  namespaced: true,
  // store user status
  state: () => ({
    loginUser: {
      userName: "Please Login",
      userRole: ACCESS_ENUM.NOT_LOGIN,
      userLoginStatus: ACCESS_ENUM.NOT_LOGIN,
    },
  }),

  // method to gather user info/state
  actions: {
    getLoginUser({ commit, state }, payload) {
      commit("updateUser", payload);
    },
  },

  // method to update user status
  mutations: {
    updateUser(state, payload) {
      state.loginUser = payload;
    },
  },
} as StoreOptions<any>;
