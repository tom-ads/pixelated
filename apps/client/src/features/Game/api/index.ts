import { SocketResponse } from '@/api/types/SocketResponse'
import SocketEvent from '@/enums/SocketEvent'
import SocketStatus from '@/enums/SocketStatus'
import { startTurn, resetGame, TimerState, setTimer } from '@/store/slices/game'
import { setParty } from '@/store/slices/party'
import Party from '@/types/Models/Party'
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query'
import appApi, { appSockedConnected, appSocket } from 'api'
import { DrawingStroke } from '../types'
import { SendDrawingRequest } from './types/requests'

const gameEndpoints = appApi.injectEndpoints({
  endpoints: (build) => ({
    startGame: build.mutation<void, string>({
      queryFn: async (data: string) => {
        await appSockedConnected

        return new Promise((resolve) => {
          appSocket.emit(SocketEvent.START_GAME, data, (response: SocketResponse<Party>) => {
            if (response.type === SocketStatus.ERROR) {
              resolve({ error: { data: response.result.error } as FetchBaseQueryError })
              return
            }
            resolve({ data: undefined })
          })
        })
      },
    }),

    getGame: build.query<void, void>({
      // Set default query function, will ignore baseQuery
      queryFn: () => ({ data: undefined }),
      async onCacheEntryAdded(
        _,
        { cacheDataLoaded, updateCachedData, cacheEntryRemoved, dispatch },
      ) {
        try {
          await cacheDataLoaded

          // Get or open a web socket connection
          await appSockedConnected

          appSocket.on(SocketEvent.START_TURN, (response: SocketResponse<Party>) => {
            dispatch(startTurn({ word: response.result.data.turnWord }))
            dispatch(setParty(response.result.data))
            updateCachedData(() => response.result.data)
          })

          appSocket.on(SocketEvent.END_GAME, (response: SocketResponse<Party>) => {
            dispatch(setParty(response.result.data))
            dispatch(resetGame())
            updateCachedData(() => response.result.data)
          })

          appSocket.on(SocketEvent.GAME_TIMER, (response: SocketResponse<TimerState>) => {
            dispatch(setTimer(response.result.data))
          })

          // Cleanup
          await cacheEntryRemoved
          appSocket.off(SocketEvent.START_TURN)
        } catch {
          console.log('throwing cache')
        }
      },
    }),

    sendDrawing: build.mutation<void, SendDrawingRequest>({
      queryFn: async (data: SendDrawingRequest) => {
        await appSockedConnected

        return new Promise((resolve) => {
          appSocket.emit(SocketEvent.GAME_DRAWING, data, (response: SocketResponse<void>) => {
            if (response.type === SocketStatus.ERROR) {
              resolve({ error: { data: response.result.error } as FetchBaseQueryError })
              return
            }
            console.log('logging')
            resolve({ data: undefined })
          })
        })
      },
    }),

    getDrawing: build.query<DrawingStroke, void>({
      // Set default query function, will ignore baseQuery
      queryFn: () => ({ data: {} as DrawingStroke }),
      async onCacheEntryAdded(_, { cacheDataLoaded, updateCachedData, cacheEntryRemoved }) {
        try {
          await cacheDataLoaded

          // Get or open a web socket connection
          await appSockedConnected

          appSocket.on(SocketEvent.GAME_DRAWING, (response: SocketResponse<DrawingStroke>) => {
            updateCachedData(() => response.result.data)
          })

          // Cleanup
          await cacheEntryRemoved
          appSocket.off(SocketEvent.GAME_DRAWING)
        } catch {
          console.log('throwing cache')
        }
      },
    }),
  }),
  overrideExisting: false,
})

export const { useStartGameMutation, useGetGameQuery, useSendDrawingMutation, useGetDrawingQuery } =
  gameEndpoints
