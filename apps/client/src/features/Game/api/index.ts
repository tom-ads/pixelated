import { SocketResponse } from '@/api/types/SocketResponse'
import SocketEvent from '@/enums/SocketEvent'
import SocketStatus from '@/enums/SocketStatus'

import Party from '@/types/Models/Party'
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query'
import appApi, { appSockedConnected, appSocket } from 'api'

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
  }),
  overrideExisting: false,
})

export const { useStartGameMutation } = gameEndpoints
