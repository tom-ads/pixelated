import { RootState } from '@/store'
import { PartyStep } from '@/store/slices/game'
import { ReactNode, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { CreatePartyView, JoinPartyView, PartyOptionsView } from '../../components'

type PartyViews = Record<
  PartyStep,
  {
    title: string
    description: string
    view: ReactNode
  }
>

const views: PartyViews = {
  options: {
    title: 'Ready to play?',
    description: 'Join a game or create a party!',
    view: <PartyOptionsView />,
  },
  join: {
    title: 'Join Party',
    description: 'Enter the party code below to join',
    view: <JoinPartyView />,
  },
  create: {
    title: 'Create Party',
    description: 'Setup your party',
    view: <CreatePartyView />,
  },
}

export const PartyOptionPage = (): JSX.Element => {
  const { partyStep } = useSelector((state: RootState) => ({
    partyStep: state.game.partyStep,
  }))

  const activeView = useMemo(() => views[partyStep], [partyStep])

  return (
    <div className="flex items-center justify-center flex-grow py-8">
      <div className="px-4 sm:px-8 sm:max-w-[529px] mx-auto w-full">
        <div className="space-y-2 mb-16">
          <h1 className="text-4xl">{activeView.title}</h1>
          <p className="text-lg text-gray-60">{activeView.description}</p>
        </div>
        {activeView.view}
      </div>
    </div>
  )
}
