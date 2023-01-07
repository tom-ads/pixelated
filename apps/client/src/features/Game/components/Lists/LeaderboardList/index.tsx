import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import { LeaderboardItem } from '../LeaderboardItem'

export const LeaderboardList = (): JSX.Element => {
  const { members } = useSelector((state: RootState) => ({
    members: state.party.members,
  }))

  const data = [
    {
      username: 'PoloBear',
      score: 700,
    },
    {
      username: 'Jesspicatio',
      score: 235,
    },
    {
      username: 'Marley Mans',
      score: 400,
    },
    {
      username: 'Lerow melas',
      score: 400,
    },
    {
      username: 'Bob marley',
      score: 400,
    },
    {
      username: 'Hairy mans',
      score: 645,
    },
  ]

  const sortedMembers = [...(data ?? [])]?.sort((a, b) => b.score - a.score)

  return (
    <ul className="flex flex-col divide-cyan-70 divide-y divide-dashed">
      {sortedMembers?.map((member, idx) => (
        <LeaderboardItem key={member.username} value={{ ...member, position: idx + 1 }} />
      ))}
    </ul>
  )
}
