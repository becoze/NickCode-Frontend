import router from "@/router";
import store from "@/store";
import ACCESS_ENUM from "@/access/accessEnum";
import checkAccess from "@/access/checkAccesss";
import message from "@arco-design/web-vue/es/message";

router.beforeEach(async (to, from, next) => {
  const loginUser = store.state.user.loginUser;
  /**
   * Keep use logged in
   * userRole will only exist when user logged in before
   */
  if (!loginUser || !loginUser.userRole) {
    await store.dispatch("user/getLoginUser");
  }

  /**
   * Manages user pages accessibility based on pages permissions.
   */
  const pagePermission = (to.meta?.access as string) ?? ACCESS_ENUM.NOT_LOGIN;
  // Check if the page requires login
  if (pagePermission !== ACCESS_ENUM.NOT_LOGIN) {
    // Redirect to login page if the user is not logged in or lacks of permission/role
    if (
      !loginUser ||
      !loginUser.userRole ||
      loginUser.userRole === ACCESS_ENUM.NOT_LOGIN
    ) {
      message.warning("Please log in to access this page.");
      next(`/user/login?redirect=${to.fullPath}`);
      return;
    }
    // Redirect to a "No Authorization" page if the user lacks of permissions
    if (!checkAccess(loginUser, pagePermission)) {
      next("/noAuth");
      return;
    }
  }
  // Navigate to the destination page when pass all checks
  next();
});
