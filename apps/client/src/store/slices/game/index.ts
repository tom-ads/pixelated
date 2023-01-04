import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import Party from '@/types/Models/Party'

export type PartyStep = 'options' | 'join' | 'create'

interface GameState {
  party: Partial<Party>
  partyStep: PartyStep
}

const initialState: GameState = {
  party: {
    name: undefined,
    code: undefined,
    members: [],
  },
  partyStep: 'options',
}

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setParty: (currentState, action: PayloadAction<Party>) => {
      currentState.party = action.payload
    },

    setPartyStep: (currentState, action: PayloadAction<PartyStep>) => {
      currentState.partyStep = action.payload
    },
  },
})

export const { setPartyStep, setParty } = gameSlice.actions
export default gameSlice.reducer
