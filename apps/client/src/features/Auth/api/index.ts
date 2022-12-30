import appApi from 'api'
import { RegisterRequest, LoginRequest } from './types/requests'
import { RegisterResponse, LoginResponse, SessionResponse } from './types/response'

const authBasePath = '/auth'

const authEndpoints = appApi.injectEndpoints({
  endpoints: (build) => ({
    register: build.mutation<RegisterResponse, RegisterRequest>({
      query: (body) => ({
        url: `${authBasePath}/register`,
        method: 'POST',
        body,
      }),
    }),
    login: build.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: `${authBasePath}/login`,
        method: 'POST',
        body,
      }),
    }),
    getSession: build.query<SessionResponse, void>({
      query: () => `${authBasePath}/session `,
    }),
  }),
  overrideExisting: false,
})

export const { useRegisterMutation, useLoginMutation, useGetSessionQuery } = authEndpoints
