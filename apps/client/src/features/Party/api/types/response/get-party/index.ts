import { Message } from '@/types'
import Party from '@/types/Models/Party'

type GetPartyResponse = {
  party: Party
  message: Message
}

export default GetPartyResponse
