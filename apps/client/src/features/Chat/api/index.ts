import { SocketResponse } from '@/api/types/SocketResponse'
import SocketError from '@/enums/SocketError'
import SocketEvent from '@/enums/SocketEvent'
import SocketStatus from '@/enums/SocketStatus'
import { appendMessage } from '@/store/slices/chat'
import { Message } from '@/types'
import { BaseQueryApi, FetchBaseQueryError } from '@reduxjs/toolkit/dist/query'
import appApi, { getSocketConnection } from 'api'
import { GetMessagesRequest, SendMessageRequest } from './types/requests'
import { GetMessagesResponse, SendMessageResponse } from './types/response'
import { v4 as uuidv4 } from 'uuid'

const chatEndpoints = appApi.injectEndpoints({
  endpoints: (build) => ({
    sendMessage: build.mutation<SendMessageResponse, SendMessageRequest>({
      queryFn: async (data: SendMessageRequest, api: BaseQueryApi) => {
        const socket = await getSocketConnection()

        return new Promise((resolve) => {
          socket.emit(SocketEvent.SEND_MESSAGE, data, (response: SocketResponse<Message>) => {
            const didError = response.type === SocketStatus.ERROR
            resolve(
              didError
                ? { error: { data: response.result.error } as FetchBaseQueryError }
                : { data: response.result.data },
            )

            let errorMessage: Message | undefined
            if (didError) {
              errorMessage = {
                id: uuidv4(),
                sender: SocketError.MESSAGE_FAILED,
                message: response.result.error?.message ?? '',
              }
            }

            api.dispatch(appendMessage(didError ? (errorMessage as Message) : response.result.data))
          })
        })
      },
    }),

    getMessages: build.query<GetMessagesResponse, GetMessagesRequest>({
      // Set default query function, will ignore baseQuery
      queryFn: () => ({ data: [] }),
      // Handle WS for parties and caching to store
      async onCacheEntryAdded(
        _,
        { cacheDataLoaded, updateCachedData, cacheEntryRemoved, dispatch },
      ) {
        try {
          await cacheDataLoaded

          // Get or open a web socket connection
          const socket = await getSocketConnection()
          // socket.on('connected', (response: SocketResponse<Message[]>) => {
          //   // emit to get all party messages
          // })

          socket.on(SocketEvent.RECEIVE_MESSAGE, (response: SocketResponse<Message>) => {
            dispatch(appendMessage(response.result.data))
            updateCachedData((draft) => [...draft, response.result.data])
          })

          // Cleanup
          await cacheEntryRemoved
          socket.off('connected')
          socket.off(SocketEvent.RECEIVE_MESSAGE)
        } catch {
          console.log('throwing cache')
        }
      },
    }),
  }),
  overrideExisting: false,
})

export const { useSendMessageMutation, useGetMessagesQuery } = chatEndpoints
