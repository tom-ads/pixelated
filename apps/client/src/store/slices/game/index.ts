import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface GameState {
  isPlaying: boolean
  isDrawer: boolean
}

const initialState: GameState = {
  isPlaying: false,
  isDrawer: false,
}

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    startGame: (currentState, action: PayloadAction<GameState>) => {
      currentState.isPlaying = action.payload.isPlaying
      currentState.isDrawer = action.payload.isDrawer
    },
  },
})

export const { startGame } = gameSlice.actions
export default gameSlice.reducer
