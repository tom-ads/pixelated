import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/dist/query'
import appApi from 'api'
import AuthReducer from './slices/auth'
import GameReducer from './slices/game'
import PartyReducer from './slices/party'

const appReducers = {
  auth: AuthReducer,
  game: GameReducer,
  party: PartyReducer,
}

export const store = configureStore({
  reducer: {
    ...appReducers,
    [appApi.reducerPath]: appApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(appApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>

setupListeners(store.dispatch)
