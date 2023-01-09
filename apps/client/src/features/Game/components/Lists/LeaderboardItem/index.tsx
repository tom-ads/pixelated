import { CrownIcon } from '@/components/Icons'
import { PartyMember } from '@/types'
import classNames from 'classnames'

type LeaderboardItemProps = {
  value: PartyMember & {
    position: number
  }
}

export const LeaderboardItem = ({ value }: LeaderboardItemProps): JSX.Element => {
  return (
    <li className="flex items-center justify-between text-sm py-[6px] w-full">
      <div className="flex items-center gap-3">
        <p
          className={classNames('w-6', {
            'text-yellow-60': value.position === 1,
            'text-brown-70': value?.position === 2,
            'text-gray-60': value.position === 3,
            'text-white': value.position > 3,
          })}
        >
          #{value.position}
        </p>
        <div className="flex items-center gap-3">
          <p>{value.username}</p>
          {value.isOwner && <CrownIcon className="text-yellow-60 w-6" />}
        </div>
      </div>
      <span className="text-yellow-60">{value.score}</span>
    </li>
  )
}
