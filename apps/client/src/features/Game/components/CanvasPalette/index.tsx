import { RootState } from '@/store'
import { setCanvasControls } from '@/store/slices/game'
import classNames from 'classnames'
import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ColourKeys } from '../../types'
import { canvasColours } from '../Canvas'

export const CanvasPalette = (): JSX.Element => {
  const dispatch = useDispatch()

  const { selectedColour, brushType } = useSelector((state: RootState) => ({
    selectedColour: state.game.canvas.colour,
    brushType: state.game.canvas.brushType,
  }))

  const palette = useMemo(
    () => Object.keys(canvasColours).filter((colour) => colour !== 'white'),
    [selectedColour],
  )

  return (
    <div className="flex gap-6">
      {palette?.map((colour) => (
        <button
          key={colour}
          type="button"
          disabled={brushType === 'erase'}
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
