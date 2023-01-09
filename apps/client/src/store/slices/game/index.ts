import { TimerType } from '@/enums/TimerType'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type TimerState = {
  type: TimerType
  time: number
}

export interface TurnState {
  turnStarted: boolean
  word: string | null
}

interface GameState {
  guessed: false
  turn: TurnState
  timer: TimerState
}

const initialState: GameState = {
  guessed: false,
  turn: {
    turnStarted: false,
    word: '',
  },
  timer: {
    type: TimerType.PENDING_TIMER,
    time: 0,
  },
}

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    startTurn: (currentState, action: PayloadAction<Omit<TurnState, 'turnStarted'>>) => {
      currentState.turn.word = action.payload.word
      currentState.turn.turnStarted = true
    },

    setTimer: (currentState, action: PayloadAction<TimerState>) => {
      currentState.timer = action.payload
    },

    endTurn: (currentState) => {
      currentState.turn = {
        turnStarted: false,
        word: '',
      }
    },

    resetGame: (currentState) => {
      currentState.guessed = false
      currentState.turn = {
        turnStarted: false,
        word: '',
      }
      currentState.timer = {
        type: TimerType.PENDING_TIMER,
        time: 0,
      }
    },
  },
})

export const { startTurn, endTurn, setTimer, resetGame } = gameSlice.actions
export default gameSlice.reducer
