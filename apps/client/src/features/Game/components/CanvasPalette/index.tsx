import { RootState } from '@/store'
import { setCanvasControls } from '@/store/slices/game'
import classNames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { ColourKeys } from '../../types'
import { canvasColours } from '../Canvas'

export const CanvasPalette = (): JSX.Element => {
  const dispatch = useDispatch()

  const { selectedColour } = useSelector((state: RootState) => ({
    selectedColour: state.game.canvas.colour,
  }))

  return (
    <div className="flex gap-6">
      {Object.keys(canvasColours)?.map((colour) => (
        <button
          key={colour}
          type="button"
          onClick={() => dispatch(setCanvasControls({ colour: colour as ColourKeys }))}
          className={classNames(
            'w-7 h-7 rounded-full ring ring-offset-[3px] ring-offset-cyan-70 transition-all',
            {
              'ring-transparent': selectedColour !== colour,
              'ring-yellow-60': selectedColour === colour,
            },
          )}
          style={{ backgroundColor: canvasColours[colour as ColourKeys] }}
        />
      ))}
    </div>
  )
}
