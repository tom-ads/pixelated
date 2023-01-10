import { BinIcon, RotateArrowIcon } from '@/components/Icons'
import { setCanvasControls } from '@/store/slices/game'
import { useDispatch } from 'react-redux'

export const CanvasActions = () => {
  const dispatch = useDispatch()

  return (
    <div className="flex items-center gap-5">
      <button
        type="button"
        onClick={() => dispatch(setCanvasControls({ action: 'undo' }))}
        className="flex flex-col items-center gap-[2px] transition-colors active:text-yellow-60 hover:text-yellow-80"
      >
        <RotateArrowIcon className="w-5" />
        <p className="text-[13px]">Undo</p>
      </button>
      <button
        type="button"
        onClick={() => dispatch(setCanvasControls({ action: 'reset' }))}
        className="flex flex-col items-center gap-[2px] transition-colors active:text-yellow-60 hover:text-yellow-80"
      >
        <BinIcon className="w-5" />
        <p className="text-[13px]">Clear</p>
      </button>
    </div>
  )
}
