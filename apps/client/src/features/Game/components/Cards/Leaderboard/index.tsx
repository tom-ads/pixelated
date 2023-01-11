import { Card } from '@/components'
import { LeaderboardList } from '../../Lists'

export const LeaderboardCard = (): JSX.Element => {
  return (
    <Card>
      <div>
        <div className="flex items-center justify-between flex-grow gap-3 mb-2">
          <h3 className="text-base">Leaderboard</h3>
        </div>
        <LeaderboardList className="h-[205px]" />
      </div>
    </Card>
  )
}
