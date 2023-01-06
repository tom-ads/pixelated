import { Message } from '@/types'
import Party from '@/types/Models/Party'

type JoinPartyResponse = {
  party: Party
  messages: Message[]
  message: string
}

export default JoinPartyResponse
