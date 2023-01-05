import { CrownIcon } from '@/components/Icons/CrownIcon'
import { PartyMember } from '@/types'

type PlayerStatusItemProps = {
  value: PartyMember
}

export const PlayerStatusItem = ({ value }: PlayerStatusItemProps): JSX.Element => {
  return (
    <li className="flex justify-between">
      <div className="flex items-center gap-3">
        <p className="text-xl">{value.username}</p>
        {value.isOwner && <CrownIcon className="text-yellow-60 w-6" />}
      </div>
    </li>
  )
}
