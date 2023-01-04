import { AuthLayout } from '@/components'
import { PartyRoutes } from '@/features/Game'
import { ProfileRoutes } from '@/features/Profile'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'

const PrivateRoutes = (): JSX.Element => {
  const location = useLocation()

  const { isAuthenticated } = useSelector((state: RootState) => ({
    isAuthenticated: state.auth.isAuthenticated,
  }))

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} />
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
      {
        path: '/party/*',
        element: <PartyRoutes />,
      },
    ],
  },
]