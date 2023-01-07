import { Button } from '@/components'
import { ChatCard } from '@/features/Chat'
import { useStartGameMutation } from '@/features/Game'
import { useGetPartyQuery, useLeavePartyMutation } from '@/features/Party'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { PartyMembersCard } from '../../components/Cards'

export const ViewPartyPage = (): JSX.Element => {
  const { party } = useSelector((state: RootState) => ({
    party: state.party,
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
    return <Navigate to="/party" replace />
  }

  if (party.isPlaying) {
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

      <div className="grid grid-cols-8 gap-3 grid-rows-2 py-12 sm:grid-rows-1 sm:grid-cols-12 md:gap-5 h-[592px]">
        <div className="col-span-full sm:col-span-5">
          <PartyMembersCard />
        </div>
        <div className="col-span-full sm:col-start-6 sm:col-span-12">
          <ChatCard />
        </div>
      </div>

      <div className="flex justify-between gap-4 flex-wrap items-center">
        <Button variant="blank" onClick={() => leaveParty()} loading={isLeaving} danger>
          Leave Party
        </Button>
        <Button disabled={isLeaving || isStarting} onClick={handleStartGame}>
          Start Game
        </Button>
      </div>
    </div>
  )
}
