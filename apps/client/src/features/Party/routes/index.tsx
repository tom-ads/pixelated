import {
  CreatePartyPage,
  JoinPartyPage,
  PartyOptionPage,
  PartyWrapper,
  ViewPartyPage,
} from '@/features/Party'
import { Route, Routes } from 'react-router-dom'

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
