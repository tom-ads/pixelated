import { BrushIcon, EraserIcon } from '@/components/Icons'
import { RootState } from '@/store'
import { setCanvasControls } from '@/store/slices/game'
import classNames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'

export const CanvasBrushes = () => {
  const dispatch = useDispatch()

  const brushType = useSelector((state: RootState) => state.game.canvas.brushType)

  return (
    <div className="flex items-center gap-5">
      <button
        type="button"
        onClick={() => dispatch(setCanvasControls({ brushType: 'stroke', colour: 'green' }))}
        className={classNames('flex flex-col items-center gap-[2px]', {
          'text-white': brushType !== 'stroke',
          'text-yellow-60': brushType === 'stroke',
        })}
      >
        <BrushIcon className="w-5" />
        <p className="text-[13px]">Brush</p>
      </button>
      <button
        type="button"
        onClick={() => dispatch(setCanvasControls({ brushType: 'erase', colour: 'white' }))}
        className={classNames('flex flex-col items-center gap-[2px]', {
          'text-white': brushType !== 'erase',
          'text-yellow-60': brushType === 'erase',
        })}
      >
        <EraserIcon className="w-5" />
        <p className="text-[13px]">Eraser</p>
      </button>
    </div>
  )
}
