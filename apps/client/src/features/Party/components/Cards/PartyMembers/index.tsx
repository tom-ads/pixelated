import { Card, Divider } from '@/components'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import { PlayerStatusList } from '../../Lists/PlayerStatusList'

export const PartyMembersCard = () => {
  const { members } = useSelector((state: RootState) => ({
    members: state.party.members,
  }))

  return (
    <Card className="min-h-full">
      <div>
        <div className="flex items-center justify-between flex-grow gap-3">
          <h3 className=" text-lg md:text-2xl">Players</h3>
          <span className="hidden sm:block sm:text-base md:text-xl">
            ({members?.length ?? 1}/6)
          </span>
        </div>
        <Divider />
        <PlayerStatusList />
      </div>
    </Card>
  )
}
