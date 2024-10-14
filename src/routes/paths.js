export const rootPaths = {
  root: "",
  homeRoot: "/home",
  authRoot: "/auth",
  errorRoot: "/error",
  adminRoot: "/admin",
  coachRoot: "/coach",
  saleRoot: "/sale",
};

export default {
  login: `${rootPaths.authRoot}/login`,
  signup: `${rootPaths.authRoot}/sign-up`,
  forgot_password: `${rootPaths.authRoot}/forgot-password`,
  home: `${rootPaths.homeRoot}`,
  dashboard: `${rootPaths.adminRoot}/dashboard`,
  profile: `${rootPaths.coachRoot}/profile`,
  product: `${rootPaths.coachRoot}/product`,
  customer: `${rootPaths.coachRoot}/customer`,
  404: `${rootPaths.errorRoot}/404`,
  unauthorized: `/unauthorized`,
};
