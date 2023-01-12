import { Outlet } from 'react-router-dom'

export const PublicLayout = (): JSX.Element => {
  return (
    <div className="public-wrapper flex justify-center items-center">
      <Outlet />
    </div>
  )
}
