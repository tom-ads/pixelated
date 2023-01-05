import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import { PlayerStatusItem } from '../PlayerStatusItem'

export const PlayerStatusList = (): JSX.Element => {
  const { members } = useSelector((state: RootState) => ({
    members: state.party.members,
  }))

  return (
    <ul className="flex flex-col divide-cyan-70 space-y-2">
      {members?.map((member) => (
        <PlayerStatusItem key={member.username} value={member} />
      ))}
    </ul>
  )
}
