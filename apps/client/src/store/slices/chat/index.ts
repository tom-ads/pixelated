import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Message } from '@/types'

interface ChatState {
  messages: Message[]
}

const initialState: ChatState = {
  messages: [],
}

const partySlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setMessages: (currentState, action: PayloadAction<Message[]>) => {
      currentState.messages = action.payload
    },

    appendMessage: (currentState, action: PayloadAction<Message>) => {
      currentState.messages = [...currentState.messages, action.payload]
    },

    clearMessages: (currentState) => {
      currentState.messages = []
    },
  },
})

export const { setMessages, appendMessage, clearMessages } = partySlice.actions
export default partySlice.reducer
