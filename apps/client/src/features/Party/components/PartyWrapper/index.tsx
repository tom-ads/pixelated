import { PartyStep } from '@/store/slices/game'
import { useMemo } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

type PartyViews = Record<
  string,
  {
    title: string
    description: string
  }
>

const views: PartyViews = {
  '/party': {
    title: 'Ready to play?',
    description: 'Join a game or create a party!',
  },
  '/party/join': {
    title: 'Join Party',
    description: 'Enter the party code below to join',
  },
  '/party/create': {
    title: 'Create Party',
    description: 'Setup your party',
  },
}

export const PartyWrapper = (): JSX.Element => {
  const location = useLocation()

  const activeView = useMemo(() => views[location.pathname as PartyStep], [location.pathname])

  return (
    <div className="flex items-center justify-center flex-grow py-8">
      <div className="px-4 sm:px-8 sm:max-w-[529px] mx-auto w-full">
        <div className="space-y-2 mb-16">
          <h1 className="text-4xl">{activeView?.title}</h1>
          <p className="text-lg text-gray-60">{activeView?.description}</p>
        </div>

        <Outlet />
      </div>
    </div>
  )
}
