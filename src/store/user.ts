// initial state
import { StoreOptions } from "vuex";
import ACCESS_ENUM from "@/access/ACCESS_ENUM";
import { UserControllerService } from "../../generated";

export default {
  namespaced: true,
  // store user status
  state: () => ({
    loginUser: {
      userName: "Not logged in",
      // userRole: ACCESS_ENUM.NOT_LOGIN,
      // userLoginStatus: ACCESS_ENUM.NOT_LOGIN,
    },
  }),

  // method to gather user info/state
  actions: {
    async getLoginUser({ commit, state }, payload) {
      const res = await UserControllerService.getLoginUserUsingGet();
      if (res.code === 0) {
        commit("updateUser", res.data);
      } else {
        commit("updateUser", {
          ...state.loginUser,
          userRole: ACCESS_ENUM.NOT_LOGIN,
        });
      }
    },
  },

  // method to update user status
  mutations: {
    updateUser(state, payload) {
      state.loginUser = payload;
    },
  },
} as StoreOptions<any>;
