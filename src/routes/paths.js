import Unauthorized from "../components/Unauthorized";

export const rootPaths = {
    root: '',
    homeRoot: '/home',
    authRoot: '/auth',
    errorRoot: '/error',
  };
  
  export default {
    // Public paths
    login: `${rootPaths.authRoot}/login`,
    signup: `${rootPaths.authRoot}/sign-up`,
    forgot_password: `${rootPaths.authRoot}/forgot-password`,

    // Customer/Coach paths
    home: `${rootPaths.homeRoot}`,
    profile:`${rootPaths.homeRoot}/profile`,
    product:`${rootPaths.homeRoot}/product`,

    // Admin paths
    accounts: `${rootPaths.homeRoot}/accounts`,
    statistics: `${rootPaths.homeRoot}/statistics`,
    services: `${rootPaths.homeRoot}/services`,
    service_response: `${rootPaths.homeRoot}/service-response`,

    // Other paths
    404: `${rootPaths.errorRoot}/404`,
    unauthorized: `/unauthorized`
  };
  