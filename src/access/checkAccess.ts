import ACCESS_ENUM from "@/access/ACCESS_ENUM";

/**
 * Pairing access between access route and user
 * @param loginUser current user
 * @param requiredPermissions permission of route/other user accessing; default can access without login
 * @return boolean
 */
const checkAccess = (
  loginUser: any,
  requiredPermissions = ACCESS_ENUM.NOT_LOGIN
) => {
  // gather permission of current user
  const userPermissions = loginUser?.userRole ?? ACCESS_ENUM.NOT_LOGIN;
  if (requiredPermissions === ACCESS_ENUM.NOT_LOGIN) {
    return true;
  }

  /**
   *  require user login to access
   */
  if (requiredPermissions === ACCESS_ENUM.USER) {
    if (userPermissions !== ACCESS_ENUM.NOT_LOGIN) {
      return false;
    }
  }

  /**
   * require admin permission to access
   */
  if (requiredPermissions === ACCESS_ENUM.ADMIN) {
    if (userPermissions !== ACCESS_ENUM.ADMIN) {
      return false;
    }
  }

  return true;
};

export default checkAccess;
