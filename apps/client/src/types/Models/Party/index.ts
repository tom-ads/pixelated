export type PartyMember = {
  username: string
  score: number
  isOwner: boolean
}

type Party = {
  id: string
  name: string
  code: string
  members: PartyMember[]
}

export default Party
