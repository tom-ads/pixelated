import { Card } from '@/components'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import { Canvas } from '../../Canvas'
import { CanvasControls } from '../../CanvasControls'

export const CanvasCard = (): JSX.Element => {
  const { turnStarted, authUsername, drawerUsername } = useSelector((state: RootState) => ({
    turnStarted: state.game.turn.turnStarted,
    authUsername: state.auth.user?.username,
    drawerUsername: state.game.turn.drawer?.username,
  }))

  return (
    <Card className="flex-grow relative">
      <Canvas disabled={authUsername !== drawerUsername || !turnStarted} />
      {authUsername === drawerUsername && turnStarted && <CanvasControls />}
    </Card>
  )
}
