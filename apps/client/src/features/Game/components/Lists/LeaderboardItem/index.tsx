import { CrownIcon } from '@/components/Icons'
import { PartyMember } from '@/types'
import classNames from 'classnames'

type LeaderboardItemProps = {
  size?: 'sm' | 'xl'
  value: PartyMember & {
    position: number
  }
}

export const LeaderboardItem = ({ size = 'sm', value }: LeaderboardItemProps): JSX.Element => {
  return (
    <li
      className={classNames('flex items-center justify-between w-full', {
        'text-sm py-[6px]': size === 'sm',
        'text-2xl py-2': size === 'xl',
      })}
    >
      <div
        className={classNames('flex items-center ', {
          'gap-3': size === 'sm',
          'gap-4': size === 'xl',
        })}
      >
        <p
          className={classNames({
            'text-yellow-60': value.position === 1,
            'text-brown-70': value?.position === 2,
            'text-gray-60': value.position === 3,
            'text-white': value.position > 3,

            'w-6': size === 'sm',
            'w-11': size === 'xl',
          })}
        >
          #{value.position}
        </p>
        <div className="flex items-center gap-3">
          <p>{value.username}</p>
          {value.isOwner && <CrownIcon className="text-yellow-60 w-6" />}
        </div>
      </div>
      <span className="text-white">{value.score}</span>
    </li>
  )
}
