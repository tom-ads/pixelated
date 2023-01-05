import SocketError from '@/enums/SocketError'
import SocketStatus from '@/enums/SocketStatus'

export interface SocketEmitError {
  type: SocketError
  message: string
}

export interface SocketResponse<T> {
  type: SocketStatus
  result: {
    data: T
    error?: SocketEmitError
  }
}
