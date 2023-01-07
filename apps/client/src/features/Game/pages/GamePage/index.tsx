import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { CanvasCard, ChatCard, LeaderboardCard } from '../../components'

export const GamePage = (): JSX.Element => {
  const { isPlaying } = useSelector((state: RootState) => ({
    isPlaying: state.party.isPlaying,
  }))

  if (!isPlaying) {
    return <Navigate to="/party" />
  }

  return (
    <div className="grid grid-cols-8 md:grid-cols-12 gap-3 md:gap-5 max-h-[812px] flex-grow">
      <div className="col-span-6 md:col-span-8">
        <CanvasCard />
      </div>

      <div className="col-start-7 col-span-8 md:col-start-9 md:col-span-4 flex flex-col flex-grow gap-5">
        <LeaderboardCard />

        <div className="flex-grow flex">
          <ChatCard />
        </div>
      </div>
    </div>
  )
}
