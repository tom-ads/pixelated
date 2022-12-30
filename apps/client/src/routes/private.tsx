import { AuthLayout } from '@/components'
import { ProfileRoutes } from '@/features/Profile'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const PrivateRoutes = (): JSX.Element => {
  const { isAuthenticated } = useSelector((state: RootState) => ({
    isAuthenticated: state.auth.isAuthenticated,
  }))

  if (!isAuthenticated) {
    return <Navigate to="/" />
  }

  return <AuthLayout />
}

export const privateRoutes = [
  {
    element: <PrivateRoutes />,
    children: [
      {
        path: '/profile/*',
        element: <ProfileRoutes />,
      },
    ],
  },
]
