import { lazy, Suspense } from "react";
import { Outlet, createBrowserRouter } from "react-router-dom";
import PrivateRoute from '../components/PrivateRoute';
import PageLoader from "../components/loading/PageLoader";
import Splash from "../components/loading/Splash";
import { rootPaths } from "./paths";
import paths from "./paths";

const App = lazy(() => import("../App"));
const AuthLayout = lazy(() => import("../layouts/auth-layout"));
const MainLayout = lazy(() => import("../layouts/main-layout"));
const Login = lazy(() => import("../pages/Login"));
const Home = lazy(() => import("../pages/Home"));
const SignUp = lazy(() => import("../pages/SignUp"));
const ErrorPage = lazy(() => import("../pages/error/ErrorPage"));
const AdminDashboard = lazy(() => import("../pages/AdminDashboard"));
const UserProfile = lazy(() => import("../pages/UserProfile"));
const ProductList = lazy(() => import("../pages/ProductList"));

const PersistLogin = lazy(() => import('../components/PersistLogin'))


const createMainLayoutRoutes = () => (
  <MainLayout>
    <Suspense fallback={<PageLoader />}>
      <Outlet />
    </Suspense>
  </MainLayout>
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
        path: paths.home,
        element: createMainLayoutRoutes(),
        children: [
          {
            index: true,
            element: <Home />,
          },
          {
            path: paths.dashboard,
            element: (
              <PersistLogin>
                <PrivateRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </PrivateRoute>
              </PersistLogin>
              
            ),

          },
          {
            index: true, /* đường dẫn mặc định cho customer/coach */ 
            element: (
              <PersistLogin>
                <PrivateRoute allowedRoles={['customer', 'coach', 'admin', 'sale']}> 
                    
                </PrivateRoute>
              </PersistLogin>
              
            ),
          },

          {
            path: paths.profile,
            element: <UserProfile />,
          },
          {
            path: paths.product,
            element: <ProductList />,
          },
        ],
      },
      {
        path: '',
        element: (
          <PrivateRoute allowedRoles={['admin']}>
            
          </PrivateRoute>
        ),
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
        ],
      },
    ],
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
];

const options = {
  basename: "",
};

const router = createBrowserRouter(routes, options);

export default router;
