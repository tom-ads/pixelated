import { Card } from '@/components'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'

export const StateCard = (): JSX.Element => {
  const { isPlaying } = useSelector((state: RootState) => ({
    isPlaying: state.party.isPlaying,
  }))

  return (
    <Card className="px-8">
      <div className="flex justify-between">
        <p>1:30</p>
        <p>- - - - -</p>
        <p>give up</p>
      </div>
    </Card>
  )
}
