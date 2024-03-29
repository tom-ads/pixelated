import { SocketResponse } from '@/api/types/SocketResponse'
import SocketEvent from '@/enums/SocketEvent'
import SocketStatus from '@/enums/SocketStatus'
import { clearMessages } from '@/store/slices/chat'
import { startTurn, resetGame, TimerState, setTimer, endTurn } from '@/store/slices/game'
import { setParty } from '@/store/slices/party'
import Party from '@/types/Models/Party'
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query'
import appApi, { getSocket } from 'api'
import { DrawingStroke } from '../types'
import { SendDrawingRequest } from './types/requests'

const gameEndpoints = appApi.injectEndpoints({
  endpoints: (build) => ({
    startGame: build.mutation<void, string>({
      queryFn: async (data: string) => {
        const appSocket = getSocket()

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
          const appSocket = getSocket()

          appSocket.on(SocketEvent.START_TURN, (response: SocketResponse<Party>) => {
            const drawer = response.result.data.members?.find((member) => member.isDrawer)
            dispatch(startTurn({ word: response.result.data.turnWord, drawer }))
            dispatch(setParty(response.result.data))
            updateCachedData(() => response.result.data)
          })

          appSocket.on(SocketEvent.END_TURN, (response: SocketResponse<Party>) => {
            dispatch(endTurn())
            dispatch(setParty(response.result.data))
            updateCachedData(() => response.result.data)
          })

          appSocket.on(SocketEvent.END_GAME, (response: SocketResponse<Party>) => {
            dispatch(setParty(response.result.data))
            dispatch(clearMessages())
            dispatch(resetGame())
            updateCachedData(() => response.result.data)
          })

          appSocket.on(SocketEvent.GAME_TIMER, (response: SocketResponse<TimerState>) => {
            dispatch(setTimer(response.result.data))
          })

          // Cleanup
          await cacheEntryRemoved
          appSocket.off(SocketEvent.START_TURN)
          appSocket.off(SocketEvent.END_TURN)
          appSocket.off(SocketEvent.END_GAME)
          appSocket.off(SocketEvent.GAME_TIMER)
        } catch {
          console.log('throwing cache')
        }
      },
    }),

    sendDrawing: build.mutation<void, SendDrawingRequest>({
      queryFn: async (data: SendDrawingRequest) => {
        const appSocket = getSocket()

        return new Promise((resolve) => {
          appSocket.emit(SocketEvent.GAME_DRAWING, data)
          resolve({ data: undefined })
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
          const appSocket = getSocket()

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
