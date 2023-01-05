import { createSlice } from '@reduxjs/toolkit'

interface GameState {
  isPlaying: boolean
}

const initialState: GameState = {
  isPlaying: false,
}

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {},
})

// export const {} = gameSlice.actions
export default gameSlice.reducer
