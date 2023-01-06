import { transformResponse } from '@/helpers/query'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { io, Socket } from 'socket.io-client'

export let appSocket: Socket
export const appSockedConnected = new Promise<void>((resolve) => {
  if (!appSocket) {
    appSocket = io(import.meta.env.VITE_PIXELATED_API_BASE_URL, {
      withCredentials: true,
    }).connect()
  }
  appSocket?.on('connect', () => {
    resolve()
  })
})

/* 
  Certain web browsers treat SameSite: Strict and subdomains as
  cross-origins when using localhost. So, we need to set the subdoamin
  into the request URL.
*/
const baseUrl = (): string => {
  const apiBaseUrl = import.meta.env.VITE_PIXELATED_API_BASE_URL
  if (!apiBaseUrl) {
    throw new Error('[API] The PIXELATED_API_BASE_URL env must be set')
  }
  return apiBaseUrl
}

const rootQuery = fetchBaseQuery({
  baseUrl: baseUrl(),
  credentials: 'include',
})

const appApi = createApi({
  reducerPath: 'pixelatedApi',
  tagTypes: ['Party'],
  async baseQuery(...args) {
    const result = await rootQuery(...args)
    if (result.data) {
      // Ensure received data is camelCase
      result.data = transformResponse(result.data)
    }
    return result
  },
  // Endpoints are injected from their given domain
  endpoints: () => ({}),
})

export default appApi
