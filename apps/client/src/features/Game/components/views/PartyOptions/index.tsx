import { Button } from '@/components'
import { setPartyStep } from '@/store/slices/game'
import { useDispatch } from 'react-redux'

export const PartyOptionsView = (): JSX.Element => {
  const dispatch = useDispatch()

  return (
    <div className="flex flex-col gap-y-11">
      <Button onClick={() => dispatch(setPartyStep('join'))}>Join Party</Button>
      <Button onClick={() => dispatch(setPartyStep('create'))} variant="blank">
        Create Party
      </Button>
    </div>
  )
}
