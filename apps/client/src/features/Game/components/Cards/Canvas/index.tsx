import { Card } from '@/components'
import { Canvas } from '../../Canvas'
import { CanvasControls } from '../../CanvasControls'

export const CanvasCard = (): JSX.Element => {
  return (
    <Card className="flex-grow relative">
      <Canvas />
      <CanvasControls />
    </Card>
  )
}
