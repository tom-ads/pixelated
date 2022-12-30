import { Outlet } from 'react-router-dom'

export const PublicLayout = (): JSX.Element => {
  return (
    <div className="public-wrapper grid place-content-center">
      <Outlet />
    </div>
  )
}
