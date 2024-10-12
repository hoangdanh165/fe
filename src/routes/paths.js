import Unauthorized from "../components/Unauthorized";

export const rootPaths = {
    root: '',
    homeRoot: '/home',
    authRoot: '/auth',
    errorRoot: '/error',
  };
  
  export default {
    login: `${rootPaths.authRoot}/login`,
    signup: `${rootPaths.authRoot}/sign-up`,
    forgot_password: `${rootPaths.authRoot}/forgot-password`,
    home: `${rootPaths.homeRoot}`,
    dashboard: `${rootPaths.homeRoot}/dashboard`,
    profile:`${rootPaths.homeRoot}/profile`,
    product:`${rootPaths.homeRoot}/product`,
    404: `${rootPaths.errorRoot}/404`,
    unauthorized: `/unauthorized`
  };
  