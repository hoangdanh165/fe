import { lazy, Suspense } from "react";
import { Outlet, createBrowserRouter } from "react-router-dom";
import PrivateRoute from '../components/PrivateRoute';
import PageLoader from "../components/loading/PageLoader";
import Splash from "../components/loading/Splash";
import { rootPaths } from "./paths";
import paths from "./paths";
import Unauthorized from "../components/Unauthorized";
import Root from "../pages/Root";
import CheckLogin from "../components/CheckLogin";
import ServiceManagement from "../pages/ServiceManagement";

const App = lazy(() => import("../App"));
const AuthLayout = lazy(() => import("../layouts/auth-layout"));
const MainLayoutAdmin = lazy(() => import("../layouts/main-layout-admin"))
const MainLayoutCustomer = lazy(() => import("../layouts/main-layout-customer"));
const Login = lazy(() => import("../pages/Login"));
const Home = lazy(() => import("../pages/Home"));
const SignUp = lazy(() => import("../pages/SignUp"));
const NotFound = lazy(() => import("../pages/error/NotFound"));
const AccountManagement = lazy(() => import("../pages/AccountManagement"));
const UserProfile = lazy(() => import("../pages/UserProfile"));
const ProductList = lazy(() => import("../pages/ProductList"));
const ForgotPassword = lazy(() => import("../pages/ForgotPassword"));
const Statistic = lazy(() => import("../pages/Statistic"))

const PersistLogin = lazy(() => import('../components/PersistLogin'))
const HomeRedirect = lazy(() => import('../components/HomeRedirect'))


const createMainLayoutAdminRoutes = () => (
  <MainLayoutAdmin>
    <Suspense fallback={<PageLoader />}>
      <Outlet />
    </Suspense>
  </MainLayoutAdmin>
);

const createMainLayoutCustomerRoutes = () => (
  <MainLayoutCustomer>
    <Suspense fallback={<PageLoader />}>
      <Outlet />
    </Suspense>
  </MainLayoutCustomer>
);

const createAuthLayoutRoutes = () => (
  <AuthLayout>
    <Suspense fallback={<PageLoader />}>
      <Outlet />
    </Suspense>
  </AuthLayout>
);
const routes = [
  {
    path: "/",
    element: (
      <Suspense fallback={<Splash />}>
        <App />
      </Suspense>
    ),
    children: [
      {
        path: rootPaths.homeRoot,
        element: (
          <PersistLogin>
            {createMainLayoutAdminRoutes()}
          </PersistLogin>
        ),

        children: [

          {
            path: paths.accounts,
            element: (
                <PrivateRoute allowedRoles={['admin']}>
                  <AccountManagement />
                </PrivateRoute>          
            ),

          },
          {
            path: paths.services,
            element: (
                <PrivateRoute allowedRoles={['admin']}>
                  <ServiceManagement />
                </PrivateRoute>          
            ),

          },

          {
            path: paths.statistics,
            element: (
                <PrivateRoute allowedRoles={['admin']}>
                  <Statistic />
                </PrivateRoute>          
            ),

          },
          {
            path: paths.profile,
            element: (
              <PrivateRoute allowedRoles={['customer']}>
                <UserProfile />
              </PrivateRoute>          
            ),
          },

          {
            path: paths.product,
            element: (
              <PrivateRoute allowedRoles={['customer']}>
                <ProductList />
              </PrivateRoute>          
            ),
          },
          
        ],
      },

      {
        path: rootPaths.root,
        element: (
          <PersistLogin>
            <Root />
          </PersistLogin>
        )
      },
      
      {
        path: rootPaths.authRoot,
        element: createAuthLayoutRoutes(),
        children: [
          {
            path: paths.login,
            element: <Login />,
            
          },
          {
            path: paths.signup,
            element: <SignUp />,
          },
          {
            path: paths.forgot_password,
            element: <ForgotPassword />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
];

const options = {
  basename: "",
};

const router = createBrowserRouter(routes, options);

export default router;
