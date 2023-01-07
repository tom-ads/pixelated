import { ChatCard } from '@/features/Chat'
import { GameBoardCard, GameLeaderboardCard } from '../../components'

export const GamePage = (): JSX.Element => {
  return (
    <div className="grid grid-cols-8 md:grid-cols-12 gap-3 md:gap-5">
      <div className="col-span-6 md:col-span-8">
        <GameBoardCard />
      </div>

      <div className="col-start-7 col-span-8 md:col-start-9 md:col-span-12">
        <GameLeaderboardCard />

        <ChatCard />
      </div>
    </div>
  )
}
