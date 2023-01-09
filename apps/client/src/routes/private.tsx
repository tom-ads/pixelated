import { AuthLayout } from '@/components'
import { GameRoutes } from '@/features/Game'
import { PartyRoutes } from '@/features/Party'
import { ProfileRoutes } from '@/features/Profile'
import { RootState } from '@/store'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

const PrivateRoutes = (): JSX.Element => {
  const location = useLocation()
  const navigate = useNavigate()

  const { isActive, isPlaying, partyName, isAuthenticated } = useSelector((state: RootState) => ({
    isActive: state.party.isActive,
    isPlaying: state.party.isPlaying,
    partyName: state.party.name,
    isAuthenticated: state.auth.isAuthenticated,
  }))

  useEffect(() => {
    if (isActive && partyName) {
      navigate(`/party/${partyName}`)
    }

    if (isPlaying) {
      navigate('/game')
    }
  }, [isActive, isPlaying, partyName])

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
      {
        path: '/game/*',
        element: <GameRoutes />,
      },
    ],
  },
]
