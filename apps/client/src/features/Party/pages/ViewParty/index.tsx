import { Button } from '@/components'
import { useStartGameMutation } from '@/features/Game'
import { useGetPartyQuery, useLeavePartyMutation } from '../../api'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import { ChatCard, MembersCard } from '../../components/Cards'
import { Navigate } from 'react-router-dom'

export const ViewPartyPage = (): JSX.Element => {
  const { party, isPlaying } = useSelector((state: RootState) => ({
    party: state.party,
    isPlaying: state.party.isPlaying,
  }))

  const [leaveParty, { isLoading: isLeaving }] = useLeavePartyMutation()

  const [startGame, { isLoading: isStarting }] = useStartGameMutation()

  useGetPartyQuery()

  const handleStartGame = () => {
    if (party.id) {
      startGame(party.id)
    }
  }

  if (!party.isActive) {
    return <Navigate to="/" />
  }

  if (isPlaying) {
    return <Navigate to="/game" />
  }

  return (
    <div>
      <div className="flex flex-wrap justify-between">
        <div>
          <h2 className="text-lg md:text-2xl">Party</h2>
          <h1 className="text-yellow-60 text-2xl md:text-4xl">{party.name}</h1>
        </div>
        <p className="text-lg md:text-2xl mt-4 self-end">
          Code: <span className="text-yellow-60">{party.code}</span>
        </p>
      </div>

      <div className="grid grid-cols-8 gap-3 grid-rows-2 py-12 sm:grid-rows-1 sm:grid-cols-12 md:gap-5 h-[800px] sm:h-[592px] flex-grow">
        <div className="col-span-full sm:col-span-4">
          <MembersCard />
        </div>
        <div className="col-span-full sm:col-start-5 sm:col-span-8 flex">
          <ChatCard />
        </div>
      </div>

      <div className="flex justify-between gap-4 flex-wrap items-center">
        <Button variant="blank" onClick={() => leaveParty()} loading={isLeaving} danger>
          Leave Party
        </Button>
        <Button disabled={isLeaving} loading={isStarting} onClick={handleStartGame}>
          Start Game
        </Button>
      </div>
    </div>
  )
}
