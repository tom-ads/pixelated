import { Button } from '@/components'
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

  const { data } = useGetPartyQuery()

  if (!party.isActive) {
    return <Navigate to="/party" replace />
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

      <div className="py-12 grid grid-cols-6 md:grid-cols-12 min-h-[500px] grid-row-1">
        <div className="col-start-1 col-span-2 md:col-span-4">
          <PartyMembersCard />
        </div>
      </div>

      <div className="flex justify-between gap-4 flex-wrap items-center">
        <Button variant="blank" onClick={() => leaveParty()} loading={isLeaving} danger>
          Leave Party
        </Button>
        <Button disabled={isLeaving}>Start Game</Button>
      </div>
    </div>
  )
}
