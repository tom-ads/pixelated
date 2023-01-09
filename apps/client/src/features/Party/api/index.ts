import { SocketResponse } from '@/api/types/SocketResponse'
import SocketEvent from '@/enums/SocketEvent'
import SocketStatus from '@/enums/SocketStatus'
import { appendMessage, clearMessages, setMessages } from '@/store/slices/chat'
import { leaveParty, setParty, startGame } from '@/store/slices/party'
import { Message } from '@/types'
import Party from '@/types/Models/Party'
import { BaseQueryApi, FetchBaseQueryError } from '@reduxjs/toolkit/dist/query'
import appApi, { appSockedConnected, appSocket } from 'api'
import { CreatePartyRequest, JoinPartyRequest } from './types/requests'
import { CreatePartyResponse, GetPartyResponse, JoinPartyResponse } from './types/response'

const partyEndpoints = appApi.injectEndpoints({
  endpoints: (build) => ({
    createParty: build.mutation<CreatePartyResponse, CreatePartyRequest>({
      queryFn: async (data: CreatePartyRequest, api: BaseQueryApi) => {
        await appSockedConnected

        return new Promise((resolve) => {
          appSocket.emit(SocketEvent.CREATE_PARTY, data, (response: SocketResponse<Party>) => {
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
        await appSockedConnected

        return new Promise((resolve) => {
          appSocket.emit(
            SocketEvent.JOIN_PARTY,
            data,
            (response: SocketResponse<JoinPartyResponse>) => {
              if (response.type === SocketStatus.ERROR) {
                resolve({ error: { data: response.result.error } as FetchBaseQueryError })
                return
              }

              api.dispatch(setParty(response.result.data.party))
              api.dispatch(setMessages(response.result.data.messages))
              resolve({ data: response.result.data })
            },
          )
        })
      },
    }),

    leaveParty: build.mutation<void, void>({
      queryFn: async (_, api: BaseQueryApi) => {
        await appSockedConnected

        return new Promise((resolve) => {
          appSocket.emit(SocketEvent.LEAVE_PARTY, (response: SocketResponse<void>) => {
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

    getParty: build.query<GetPartyResponse, void>({
      // Set default query function, will ignore baseQuery
      queryFn: () => ({ data: {} as GetPartyResponse }),
      // Handle WS for parties and caching to store
      async onCacheEntryAdded(
        _,
        { cacheDataLoaded, updateCachedData, cacheEntryRemoved, dispatch },
      ) {
        try {
          await cacheDataLoaded

          // Get or open a web socket connection
          await appSockedConnected

          // Receive party & cache it
          appSocket.on(SocketEvent.USER_JOINED, (response: SocketResponse<GetPartyResponse>) => {
            dispatch(setParty(response.result.data.party))
            dispatch(appendMessage(response.result.data.message))
            updateCachedData(() => response.result.data)
          })

          appSocket.on(SocketEvent.USER_LEFT, (response: SocketResponse<GetPartyResponse>) => {
            dispatch(setParty(response.result.data.party))
            dispatch(appendMessage(response.result.data.message))
            updateCachedData(() => response.result.data)
          })

          appSocket.on(
            SocketEvent.USER_RECONNECTED,
            (response: SocketResponse<{ party: Party; messages: Message[] }>) => {
              dispatch(setParty(response.result.data.party))
              dispatch(setMessages(response.result.data.messages))
              updateCachedData(() => ({
                party: response.result.data.party,
                message: { id: '', sender: '', message: '' },
              }))
            },
          )

          appSocket.on(SocketEvent.START_GAME, () => {
            dispatch(startGame())
            dispatch(clearMessages())
          })

          // Cleanup
          await cacheEntryRemoved
          appSocket.off(SocketEvent.USER_JOINED)
          appSocket.off(SocketEvent.USER_LEFT)
          appSocket.off(SocketEvent.USER_RECONNECTED)
          appSocket.off(SocketEvent.START_GAME)
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
