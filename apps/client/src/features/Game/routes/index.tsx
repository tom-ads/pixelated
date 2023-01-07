import { Route, Routes } from 'react-router-dom'
import { GamePage } from '../pages'

export const GameRoutes = (): JSX.Element => {
  return (
    <Routes>
      <Route index element={<GamePage />} />
    </Routes>
  )
}
