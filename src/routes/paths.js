import Unauthorized from "../components/Unauthorized";

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
  // Auth paths
  login: `${rootPaths.authRoot}/login`,
  signup: `${rootPaths.authRoot}/sign-up`,
  forgot_password: `${rootPaths.authRoot}/forgot-password`,

  home: `${rootPaths.homeRoot}`,

  // Coach paths
  profile: `${rootPaths.coachRoot}/profile`,
  product: `${rootPaths.coachRoot}/product`,
  customer: `${rootPaths.coachRoot}/customer`,
  schedule: `${rootPaths.coachRoot}/schedule`,

  // Admin paths
  statistics: `${rootPaths.adminRoot}/statistics`,
  accounts: `${rootPaths.adminRoot}/accounts`,
  services: `${rootPaths.adminRoot}/services`,
  service_response: `${rootPaths.adminRoot}/service-responses`,

  // Errors paths
  404: `${rootPaths.errorRoot}/404`,
  unauthorized: `/unauthorized`,
};
