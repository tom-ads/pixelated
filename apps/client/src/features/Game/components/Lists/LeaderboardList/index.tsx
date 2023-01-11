import { RootState } from '@/store'
import classNames from 'classnames'
import { useSelector } from 'react-redux'
import { LeaderboardItem } from '../LeaderboardItem'

type LeaderboardListProps = {
  size?: 'sm' | 'xl'
  className?: string
}

export const LeaderboardList = ({ size, className }: LeaderboardListProps): JSX.Element => {
  const { members } = useSelector((state: RootState) => ({
    members: state.party.members,
  }))

  const sortedMembers = [...(members ?? [])]?.sort((a, b) => b.score - a.score)

  return (
    <ul className={classNames('divide-cyan-70 divide-y divide-dashed', className)}>
      {sortedMembers?.map((member, idx) => (
        <LeaderboardItem
          key={member.username}
          size={size}
          value={{ ...member, position: idx + 1 }}
        />
      ))}
    </ul>
  )
}
