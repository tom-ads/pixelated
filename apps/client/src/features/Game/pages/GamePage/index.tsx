import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { CanvasCard, ChatCard, LeaderboardCard, StateCard } from '../../components'

export const GamePage = (): JSX.Element => {
  const { isPlaying } = useSelector((state: RootState) => ({
    isPlaying: state.party.isPlaying,
  }))

  if (!isPlaying) {
    return <Navigate to="/party" />
  }

  //   <div className="grid grid-cols-8 gap-3 py-12 sm:grid-rows-1 sm:grid-cols-12 md:gap-5 h-[800px] sm:h-[592px] flex-grow">
  //   <div className="col-span-full sm:col-span-4">{/* <MembersCard /> */}</div>
  //   <div className="col-span-full sm:col-start-5 sm:col-span-8 flex">
  //     <ChatCard />
  //   </div>
  // </div>

  return (
    <div>
      <div className="grid grid-cols-8 gap-3 py-12 sm:grid-cols-12 md:gap-5 h-[928px]">
        <div className="col-span-6 md:col-span-8 gap-3 md:gap-5 flex flex-col">
          <StateCard />

          <CanvasCard />
        </div>

        <div className="col-start-7 col-span-8 md:col-start-9 md:col-span-4 flex flex-col gap-3 md:gap-5">
          <LeaderboardCard />

          <ChatCard />
        </div>
      </div>
    </div>
  )
}
