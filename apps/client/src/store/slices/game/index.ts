import { TimerType } from '@/enums/TimerType'
import { CanvasControls } from '@/features/Game'
import { PartyMember } from '@/types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type TimerState = {
  type: TimerType
  time: number
}

export interface TurnState {
  drawer?: PartyMember
  turnStarted: boolean
  word: string | null
}

interface GameState {
  guessed: false
  turn: TurnState
  timer: TimerState
  canvas: CanvasControls
}

const initialState: GameState = {
  guessed: false,
  turn: {
    drawer: undefined,
    turnStarted: false,
    word: '',
  },
  timer: {
    type: TimerType.PENDING_TIMER,
    time: 0,
  },
  canvas: {
    lineWidth: 10,
    colour: 'green',
    brushType: 'stroke',
    action: undefined,
  },
}

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    startTurn: (currentState, action: PayloadAction<Omit<TurnState, 'turnStarted'>>) => {
      currentState.turn.drawer = action.payload.drawer
      currentState.turn.word = action.payload.word
      currentState.turn.turnStarted = true
    },

    endTurn: (currentState) => {
      currentState.turn = {
        drawer: undefined,
        turnStarted: false,
        word: '',
      }
    },

    setCanvasControls: (currentState, action: PayloadAction<Partial<CanvasControls>>) => {
      currentState.canvas = Object.assign({ ...currentState.canvas }, action.payload)
    },

    setTimer: (currentState, action: PayloadAction<TimerState>) => {
      currentState.timer = action.payload
    },

    resetGame: (currentState) => {
      currentState.guessed = false
      currentState.turn = {
        drawer: undefined,
        turnStarted: false,
        word: '',
      }
      currentState.timer = {
        type: TimerType.PENDING_TIMER,
        time: 0,
      }
      currentState.canvas = {
        lineWidth: 10,
        colour: 'blue',
        brushType: 'stroke',
        action: undefined,
      }
    },
  },
})

export const { startTurn, setCanvasControls, endTurn, setTimer, resetGame } = gameSlice.actions
export default gameSlice.reducer
