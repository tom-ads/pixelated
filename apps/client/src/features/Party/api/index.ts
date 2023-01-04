import { leaveParty, setParty } from '@/store/slices/party'
import Party from '@/types/Models/Party'
import { BaseQueryApi } from '@reduxjs/toolkit/dist/query'
import appApi, { getSocketConnection } from 'api'
import { CreatePartyRequest } from './types/requests'
import { CreatePartyResponse } from './types/response'

const partyEndpoints = appApi.injectEndpoints({
  endpoints: (build) => ({
    createParty: build.mutation<CreatePartyResponse, CreatePartyRequest>({
      queryFn: (data: CreatePartyRequest, api: BaseQueryApi) => {
        const socket = getSocketConnection()
        return new Promise((resolve) => {
          socket.emit('create-party', data, (response: CreatePartyResponse) => {
            api.dispatch(setParty(response))
            resolve({ data: response })
          })
        })
      },
    }),

    leaveParty: build.mutation<void, void>({
      queryFn: (_, api: BaseQueryApi) => {
        const socket = getSocketConnection()
        return new Promise((resolve) => {
          socket.emit('leave-party', _, () => {
            api.dispatch(leaveParty())
            resolve({ data: undefined })
          })
        })
      },
    }),

    getParty: build.query<Party, void>({
      // Set default query function, will ignore baseQuery
      queryFn: () => ({ data: { name: '', code: '', members: [] } }),
      // Handle WS for parties and caching to store
      async onCacheEntryAdded(id, { cacheDataLoaded, updateCachedData, cacheEntryRemoved }) {
        try {
          await cacheDataLoaded

          // Get or open a web socket connection
          const socket = getSocketConnection()

          // Attempt to get a party
          socket.emit('get-party')

          // Receive party & cache it
          socket.on('user-party', (response: Party) => {
            updateCachedData(() => response)
          })

          // Cleanup
          await cacheEntryRemoved
          socket.off('connected')
          socket.off('get-party')
          socket.off('user-party')
        } catch {
          console.log('throwing cache')
        }
      },
    }),
  }),
  overrideExisting: false,
})

export const { useCreatePartyMutation, useLeavePartyMutation, useGetPartyQuery } = partyEndpoints
