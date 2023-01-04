export type PartyMember = {
  username: string
  score: number
  isOwner: boolean
}

type Party = {
  name: string
  code: string
  members: PartyMember[]
}

export default Party
