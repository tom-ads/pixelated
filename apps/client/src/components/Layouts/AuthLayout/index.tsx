import { Header } from '@/components/Header'
import { Outlet } from 'react-router-dom'

export const AuthLayout = (): JSX.Element => {
  return (
    <div className="private-wrapper">
      <Header />

      <Outlet />
    </div>
  )
}
