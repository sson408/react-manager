import { createBrowserRouter, Navigate } from 'react-router-dom'
import Login from '../views/login/Login'
import Error404 from '../views/404'
import Error403 from '../views/403'
import WelcomePage from '../views/welcome/welcome'
import Layout from '../layout/layoutIndex'

const router = [
  {
    path: '/',
    element: <Navigate to='/welcome' />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    element: <Layout />,
    children: [
      {
        path: '/welcome',
        element: <WelcomePage />
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to='/404' />
  },
  {
    path: '/404',
    element: <Error404 />
  },
  {
    path: '/403',
    element: <Error403 />
  }
]

// eslint-disable-next-line react-refresh/only-export-components
export default createBrowserRouter(router)
