export type PartyMember = {
  username: string
  score: number
  rounds: number
  isDrawer: boolean
  isOwner: boolean
}

type Party = {
  id: string
  name: string
  code: string
  round: number
  turnWord: string | null
  isPlaying: boolean
  members: PartyMember[]
}

export default Party
