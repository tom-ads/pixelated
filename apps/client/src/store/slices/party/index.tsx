import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import Party from '@/types/Models/Party'

interface PartyState extends Partial<Party> {
  isActive: boolean
}

const initialState: PartyState = {
  id: undefined,
  name: undefined,
  code: undefined,
  members: [],
  isActive: false,
}

const partySlice = createSlice({
  name: 'party',
  initialState,
  reducers: {
    setParty: (currentState, action: PayloadAction<Party>) => {
      currentState.id = action.payload.id
      currentState.name = action.payload.name
      currentState.code = action.payload.code
      currentState.isPlaying = action.payload.isPlaying
      currentState.round = action.payload.round
      currentState.turnWord = action.payload.turnWord
      currentState.members = action.payload.members

      currentState.isActive = true
    },

    leaveParty: (currentState) => {
      currentState.id = undefined
      currentState.name = undefined
      currentState.code = undefined
      currentState.isPlaying = false
      currentState.members = []

      currentState.isActive = false
    },
  },
})

export const { setParty, leaveParty } = partySlice.actions
export default partySlice.reducer
