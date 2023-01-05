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
      queryFn: (data: CreatePartyRequest, api: BaseQueryApi) => {
        const socket = getSocketConnection()
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
      queryFn: (data: JoinPartyRequest, api: BaseQueryApi) => {
        const socket = getSocketConnection()
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
      queryFn: (_, api: BaseQueryApi) => {
        const socket = getSocketConnection()
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
  }),
  overrideExisting: false,
})

export const { useCreatePartyMutation, useLeavePartyMutation, useJoinPartyMutation } =
  partyEndpoints
