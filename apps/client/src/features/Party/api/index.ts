import { SocketResponse } from '@/api/types/SocketResponse'
import SocketEvent from '@/enums/SocketEvent'
import SocketStatus from '@/enums/SocketStatus'
import { leaveParty, setParty } from '@/store/slices/party'
import Party from '@/types/Models/Party'
import { BaseQueryApi, FetchBaseQueryError } from '@reduxjs/toolkit/dist/query'
import appApi, { getSocketConnection } from 'api'
import { CreatePartyRequest, JoinPartyRequest } from './types/requests'
import { CreatePartyResponse, JoinPartyResponse } from './types/response'

const partyEndpoints = appApi.injectEndpoints({
  endpoints: (build) => ({
    createParty: build.mutation<CreatePartyResponse, CreatePartyRequest>({
      queryFn: async (data: CreatePartyRequest, api: BaseQueryApi) => {
        const socket = await getSocketConnection()

        return new Promise((resolve) => {
          socket.emit(SocketEvent.CREATE_PARTY, data, (response: SocketResponse<Party>) => {
            if (response.type === SocketStatus.ERROR) {
              resolve({ error: { data: response.result.error } as FetchBaseQueryError })
              return
            }

            api.dispatch(setParty(response.result.data))
            resolve({ data: response.result.data })
          })
        })
      },
    }),

    joinParty: build.mutation<JoinPartyResponse, JoinPartyRequest>({
      queryFn: async (data: JoinPartyRequest, api: BaseQueryApi) => {
        const socket = await getSocketConnection()
        return new Promise((resolve) => {
          socket.emit(SocketEvent.JOIN_PARTY, data, (response: SocketResponse<Party>) => {
            if (response.type === SocketStatus.ERROR) {
              resolve({ error: { data: response.result.error } as FetchBaseQueryError })
              return
            }

            api.dispatch(setParty(response.result.data))
            resolve({ data: response.result.data })
          })
        })
      },
    }),

    leaveParty: build.mutation<void, void>({
      queryFn: async (_, api: BaseQueryApi) => {
        const socket = await getSocketConnection()

        return new Promise((resolve) => {
          socket.emit(SocketEvent.LEAVE_PARTY, (response: SocketResponse<void>) => {
            if (response.type === SocketStatus.ERROR) {
              resolve({ error: { data: response.result.error } as FetchBaseQueryError })
              return
            }

            api.dispatch(leaveParty())
            resolve({ data: undefined })
          })
        })
      },
    }),

    getParty: build.query<{ party: Party; message: string }, void>({
      // Set default query function, will ignore baseQuery
      queryFn: () => ({ data: { party: { name: '', code: '', members: [] }, message: '' } }),
      // Handle WS for parties and caching to store
      async onCacheEntryAdded(
        _,
        { cacheDataLoaded, updateCachedData, cacheEntryRemoved, dispatch },
      ) {
        try {
          await cacheDataLoaded

          // Get or open a web socket connection
          const socket = await getSocketConnection()

          // Receive party & cache it
          socket.on(
            SocketEvent.USER_JOINED,
            (response: SocketResponse<{ party: Party; message: string }>) => {
              dispatch(setParty(response.result.data.party))
              updateCachedData(() => response.result.data)
            },
          )

          socket.on(
            SocketEvent.USER_LEFT,
            (response: SocketResponse<{ party: Party; message: string }>) => {
              dispatch(setParty(response.result.data.party))
              updateCachedData(() => response.result.data)
            },
          )

          // Cleanup
          await cacheEntryRemoved
          socket.off(SocketEvent.USER_JOINED)
          socket.off(SocketEvent.USER_LEFT)
        } catch {
          console.log('throwing cache')
        }
      },
    }),
  }),
  overrideExisting: false,
})

export const {
  useCreatePartyMutation,
  useLeavePartyMutation,
  useJoinPartyMutation,
  useGetPartyQuery,
} = partyEndpoints
