import { PublicLayout } from '@/components/Layouts'
import { LoginPage, RegisterPage } from '@/features/Auth'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const PublicRoutes = (): JSX.Element => {
  const { isAuthenticated } = useSelector((state: RootState) => ({
    isAuthenticated: state.auth.isAuthenticated,
  }))

  if (isAuthenticated) {
    return <Navigate to="/profile" />
  }

  return <PublicLayout />
}

export const publicRoutes = [
  {
    element: <PublicRoutes />,
    children: [
      {
        path: '/',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
    ],
  },
]
