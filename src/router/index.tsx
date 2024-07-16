import { createBrowserRouter, Navigate } from 'react-router-dom'
import Login from '../views/login/Login'
import Error404 from '../views/404'
import Error403 from '../views/403'

const router = [
  {
    path: '/login',
    element: <Login />
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

export default createBrowserRouter(router)
