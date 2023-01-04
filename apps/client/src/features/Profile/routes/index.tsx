import { Route, Routes } from 'react-router-dom'
import { ProfilePage } from '../pages'

export const ProfileRoutes = (): JSX.Element => {
  return (
    <Routes>
      <Route path="" element={<ProfilePage />} />
    </Routes>
  )
}
