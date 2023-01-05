import { Button } from '@/components'
import { useNavigate } from 'react-router-dom'

export const PartyOptionPage = (): JSX.Element => {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center gap-y-11">
      <Button onClick={() => navigate('/party/join')} block>
        Join Party
      </Button>
      <Button onClick={() => navigate('/party/create')} variant="blank">
        Create Party
      </Button>
    </div>
  )
}
