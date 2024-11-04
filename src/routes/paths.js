export const rootPaths = {
  root: "",
  homeRoot: "/home",
  authRoot: "/auth",
  errorRoot: "/error",
  adminRoot: "/admin",
  coachRoot: "/coach",
  saleRoot: "/sale",
  customerRoot: "/customer",
};

export default {
  // Auth paths
  login: `${rootPaths.authRoot}/login`,
  signup: `${rootPaths.authRoot}/sign-up`,
  forgot_password: `${rootPaths.authRoot}/forgot-password`,

  // Coach paths
  profile: `${rootPaths.coachRoot}/profile`,
  product: `${rootPaths.coachRoot}/product`,
  customer: `${rootPaths.coachRoot}/customer`,
  schedule: `${rootPaths.coachRoot}/schedule`,
  training_plans: `${rootPaths.coachRoot}/training-plans`,

  // Customer paths
  // customer_profile: `${rootPaths.customerRoot}/profile`,
  // schedule: `${rootPaths.customerRoot}/schedule`,

  // Admin paths
  statistics: `${rootPaths.adminRoot}/statistics`,
  accounts: `${rootPaths.adminRoot}/accounts`,
  services: `${rootPaths.adminRoot}/services`,
  service_response: `${rootPaths.adminRoot}/service-responses`,
  coachs: `${rootPaths.adminRoot}/coachs`,

  // Sale paths
  sale_home:`${rootPaths.saleRoot}/`,
  sale_contracts:`${rootPaths.saleRoot}/contracts`,

  // Errors paths
  404: `${rootPaths.errorRoot}/404`,
  unauthorized: `/unauthorized`,
};
