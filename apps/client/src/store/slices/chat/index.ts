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
    appendMessage: (currentState, action: PayloadAction<Message>) => {
      currentState.messages = [...currentState.messages, action.payload]
    },
  },
})

export const { appendMessage } = partySlice.actions
export default partySlice.reducer