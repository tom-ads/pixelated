import { Route, Routes } from 'react-router-dom'
import { PartyOptionPage, PartyPage } from '../pages'

export const PartyRoutes = (): JSX.Element => {
  return (
    <Routes>
      <Route index element={<PartyOptionPage />} />
      <Route path=":partyName" element={<PartyPage />} />
    </Routes>
  )
}
