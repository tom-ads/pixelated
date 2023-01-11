import { Divider } from '@/components'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import { LeaderboardList } from '../Lists'
import { Transition } from '@headlessui/react'

export const Leaderboard = (): JSX.Element => {
  const { turnWord, turnStarted } = useSelector((state: RootState) => ({
    turnWord: state.party.turnWord,
    turnStarted: state.game.turn.turnStarted,
  }))

  return (
    <Transition
      show={!turnStarted && !!turnWord}
      enter="transition-opacity duration-75"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-150"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="absolute inset-0 bg-purple-90 rounded-md m-5 py-16 px-4">
        <div className="flex flex-col items-center w-full mx-auto max-w-[580px]">
          <p className="text-red-50 text-3xl">Times up!</p>
          <div className="w-24">
            <Divider />
          </div>
          <p className="text-4xl text-center">
            The word was: <span className="text-yellow-60">{turnWord}</span>
          </p>

          <div className="py-14 w-full">
            <LeaderboardList size="xl" />
          </div>
        </div>
      </div>
    </Transition>
  )
}
