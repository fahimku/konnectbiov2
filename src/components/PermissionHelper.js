import AccountUpgrade from "../pages/upgradeAccount/UpgradeAccount";
import Dashboard from "../pages/dashboard/Dashboard";

const validate = (modulePermission) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const userPermissions = userInfo.package?.permission
    ? userInfo.package.permission
    : [];
  const permit = modulePermission.filter((permission) => {
    return userPermissions.indexOf(permission) !== -1;
  });
  return permit.length ? true : false;
};

const categoryCheck = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const userPermissions = userInfo.package?.category_count
    ? userInfo.package?.category_count
    : 0;
  return userPermissions === 0 ? true : false;
};

const checkPermissions = (Component, props) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  let permissions = userInfo.package?.permission || "";
  let componentPermissions = props.permissions || [];

  let permissionFilter = componentPermissions.filter((p) => {
    return permissions.indexOf(p) !== -1;
  });

  if (permissionFilter.length > 0) return Component;
  else if (userInfo.package?.package_id === "Business Plus") {
    return Dashboard;
  } else {
    return AccountUpgrade;
  }
};

const PermissionHelper = {
  validate,
  categoryCheck,
  checkPermissions,
};

export default PermissionHelper;
