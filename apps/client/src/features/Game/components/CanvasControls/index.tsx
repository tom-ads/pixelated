import { CanvasPalette } from '../CanvasPalette'

export const CanvasControls = (): JSX.Element => {
  return (
    <div className="absolute shadow-md bg-cyan-90 shadow-cyan-70 px-6 py-5 rounded-lg bottom-0 translate-y-6 translate-x-1/2">
      <CanvasPalette />
    </div>
  )
}
