import { CanvasActions } from '../CanvasActions'
import { CanvasBrushes } from '../CanvasBrushes'
import { CanvasPalette } from '../CanvasPalette'

export const CanvasControls = (): JSX.Element => {
  return (
    <div className="absolute shadow-md bg-cyan-90 shadow-cyan-70 px-6 py-5 rounded-lg bottom-0 translate-y-6">
      <div className="w-full flex items-center gap-[100px]">
        <CanvasPalette />
        <div className="flex items-center gap-10">
          <CanvasBrushes />
          <CanvasActions />
        </div>
      </div>
    </div>
  )
}
