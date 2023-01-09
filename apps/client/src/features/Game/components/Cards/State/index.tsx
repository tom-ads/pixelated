import { Card } from '@/components'
import { ClockIcon } from '@/components/Icons'
import { formatTimeInterval } from '@/helpers/timer'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'

const TimerDisplay = () => {
  const timeSeconds = useSelector((state: RootState) => state.game.timer.time)
  const formattedTime = formatTimeInterval(timeSeconds)

  return (
    <div className="flex items-center gap-3 self-end">
      <ClockIcon className="w-10 text-green-50" />
      <span className="text-2xl text-green-50 w-[130px]">{formattedTime}</span>
    </div>
  )
}

export const StateCard = (): JSX.Element => {
  const { round, word } = useSelector((state: RootState) => ({
    round: state.party.round,
    word: state.party.turnWord,
  }))

  return (
    <Card className="px-8 mb-2">
      <div className="flex justify-between">
        <TimerDisplay />

        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center text-2xl">Round {round}/3</div>
          <p className="text-4xl text-yellow-60 text-center">{word ?? 'Waiting'}</p>
        </div>

        <div className="flex self-end">
          <p className="text-2xl text-red-50">give up</p>
        </div>
      </div>
    </Card>
  )
}
