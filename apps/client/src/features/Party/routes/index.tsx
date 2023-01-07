import { CreatePartyPage, JoinPartyPage, PartyOptionPage, ViewPartyPage } from '../pages'
import { Route, Routes } from 'react-router-dom'
import { PartyWrapper } from '../components'

export const PartyRoutes = (): JSX.Element => {
  return (
    <Routes>
      <Route element={<PartyWrapper />}>
        <Route index element={<PartyOptionPage />} />
        <Route path="/join" element={<JoinPartyPage />} />
        <Route path="/create" element={<CreatePartyPage />} />
      </Route>
      <Route path=":partyName" element={<ViewPartyPage />} />
    </Routes>
  )
}
