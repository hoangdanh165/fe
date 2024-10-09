import { lazy, Suspense } from 'react';
import { Outlet, createBrowserRouter } from 'react-router-dom';

import PageLoader from '../components/loading/PageLoader';
import Splash from '../components/loading/Splash';
import { rootPaths } from './paths';
import paths from './paths';

const App = lazy(() => import('../App'));

const AuthLayout = lazy(() => import('../layouts/auth-layout'));
const MainLayout = lazy(() => import('../layouts/main-layout'))

const Login = lazy(() => import('../pages/Login'));
const Home = lazy(() => import('../pages/Home'));
const SignUp = lazy(() => import('../pages/SignUp'));
const ErrorPage = lazy(() => import('../pages/error/ErrorPage'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const routes = [
  {
    path: '/',
    element: (
      <Suspense fallback={<Splash />}>
        <App />
      </Suspense>
    ),
    children: [
      {
        path: paths.home,
        element: (
          <MainLayout>
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </MainLayout>
        ),
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
        ],
      },
      {
        path: rootPaths.authRoot,
        element: (
          <AuthLayout>
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </AuthLayout>
        ),
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
    path: '*',
    element: <ErrorPage />,
  },
];

const options = {
  basename: '',
};

const router = createBrowserRouter(routes, options);

export default router;
