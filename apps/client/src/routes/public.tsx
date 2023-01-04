import { PublicLayout } from '@/components/Layouts'
import { LoginPage, RegisterPage } from '@/features/Auth'

const PublicRoutes = (): JSX.Element => {
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
