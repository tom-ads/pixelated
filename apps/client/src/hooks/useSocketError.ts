import { SocketEmitError } from '@/api/types/SocketResponse'
import { SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query'
import { useEffect, useState } from 'react'

export interface UseSocketErrorControls {
  clearError: () => void
}

export type UseSocketErrorReturn = [SocketEmitError | undefined, UseSocketErrorControls]

function useSocketError(socketError?: FetchBaseQueryError | SerializedError): UseSocketErrorReturn {
  const [error, setError] = useState<SocketEmitError | undefined>(undefined)

  useEffect(() => {
    if (!!socketError && 'data' in socketError) {
      setError(socketError.data as SocketEmitError)
    }
  }, [socketError])

  const clearError = () => {
    setError(undefined)
  }

  return [error, { clearError }]
}

export default useSocketError
