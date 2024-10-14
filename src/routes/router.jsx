import { lazy, Suspense } from "react";
import { Outlet, createBrowserRouter, Navigate } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";
import PageLoader from "../components/loading/PageLoader";
import Splash from "../components/loading/Splash";
import { rootPaths } from "./paths";
import paths from "./paths";
import Root from "../pages/Root";
import ServiceManagement from "../pages/ServiceManagement";

const App = lazy(() => import("../App"));

// Layouts
const AuthLayout = lazy(() => import("../layouts/auth-layout"));
const MainLayoutAdmin = lazy(() => import("../layouts/main-layout-admin"))
const MainLayoutCoach = lazy(() => import("../layouts/main-layout"));

// Auth pages
const Login = lazy(() => import("../pages/Login"));
const SignUp = lazy(() => import("../pages/SignUp"));
const ForgotPassword = lazy(() => import("../pages/ForgotPassword"));

// Error pages
const NotFound = lazy(() => import("../pages/error/NotFound"));
const Unauthorized = lazy(() => import("../components/Unauthorized")); 


// Admin pages
const AccountManagement = lazy(() => import("../pages/AccountManagement"));
const Statistic = lazy(() => import("../pages/Statistic"))
const ServiceResponse = lazy(() => import("../pages/ServiceResponse"))

// Coach pages
const UserProfile = lazy(() => import("../pages/UserProfile"));
const ProductList = lazy(() => import("../pages/ProductList"));
const CoachDashboard = lazy(() => import("../pages/CoachDashboard"));

// Other components
const PersistLogin = lazy(() => import("../components/PersistLogin"));


const createMainLayoutAdminRoutes = () => (
  <MainLayoutAdmin>
    <Suspense fallback={<PageLoader />}>
      <Outlet />
    </Suspense>
  </MainLayoutAdmin>
);

const createMainLayoutCoachRoutes = () => (
  <MainLayoutCoach>
    <Suspense fallback={<PageLoader />}>
      <Outlet />
    </Suspense>
  </MainLayoutCoach>
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
        path: rootPaths.adminRoot,
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
              <PrivateRoute allowedRoles={["admin"]}>
                <ServiceManagement />
              </PrivateRoute>
            ),
          },
          {
            path: paths.statistics,
            element: (
              <PrivateRoute allowedRoles={["admin"]}>
                <Statistic />
              </PrivateRoute>
            ),
          },
          {
            path: paths.service_response,
            element: (
              <PrivateRoute allowedRoles={["admin"]}>
                <ServiceResponse />
              </PrivateRoute>
            ),
          },
          
        ],
       
      },
      {
        paths: rootPaths.coachRoot,
        element: <PersistLogin>{createMainLayoutCoachRoutes()}</PersistLogin>,
        children:[
          {
            path: paths.profile,
            element: (
              <PrivateRoute allowedRoles={["coach"]}>
              <UserProfile />
            </PrivateRoute>
          )
        },
        {
          path: paths.product,
          element: (
            <PrivateRoute allowedRoles={["coach"]}>
              <ProductList />
            </PrivateRoute>
          )
        },
        {
          path: paths.customer,
          element: (
            <PrivateRoute allowedRoles={["coach"]}>
              <CoachDashboard />
            </PrivateRoute>
          )
        }
      ]
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
