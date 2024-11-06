import router from "@/router";
import store from "@/store";
import ACCESS_ENUM from "@/access/ACCESS_ENUM";
import checkAccess from "@/access/checkAccess";

router.beforeEach(async (to, from, next) => {
  console.log("User login state", store.state.user.loginUser);
  const loginUser = store.state.user.loginUser;
  const accessRequirement =
    (to.meta?.access as string) ?? ACCESS_ENUM.NOT_LOGIN;
  // Keep user logged in
  if (!loginUser || !loginUser.userRole) {
    await store.dispatch("user/getLoginUser");
  }
  // Actions when user attempt to access authorized page
  if (accessRequirement !== ACCESS_ENUM.NOT_LOGIN) {
    // Redirect user to login page when No-Login-User attempt to access authorized page
    if (
      !loginUser ||
      !loginUser.userRole ||
      loginUser.userRole === ACCESS_ENUM.NOT_LOGIN
    ) {
      next(`/user/login?redirection=${to.fullPath}`);
      return;
    }
    // Redirect user to login page when No-Auth-User attempt to access authorized page
    if (!checkAccess(loginUser, accessRequirement)) {
      next(`/noAuth`);
      return;
    }
  }

  next();
});
