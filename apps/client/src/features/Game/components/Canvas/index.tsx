import { alignOddLineWidth } from '@/helpers/game'
import { RootState } from '@/store'
import { MouseEvent, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

export const canvasColours = {
  red: '#BD2B2B',
  orange: '#FFA336',
  yellow: '#FFEC36',
  green: '#2BBD4B',
  blue: '#2BB4BD',
  purple: '#622BBD',
  pink: '#BD2B82',
}

export const Canvas = (): JSX.Element => {
  const [isDrawing, setIsDrawing] = useState(false)

  const { brushWidth, brushColour } = useSelector((state: RootState) => ({
    brushWidth: state.game.canvas.lineWidth,
    brushColour: state.game.canvas.colour,
  }))

  const canvasRef = useRef<HTMLCanvasElement>(null)

  const prevPos = useRef<{ prevX: number; prevY: number }>({
    prevX: 0,
    prevY: 0,
  })

  const draw = (localX: number, localY: number, dot?: boolean) => {
    if (isDrawing || dot) {
      const ctx = canvasRef.current?.getContext('2d')
      if (ctx) {
        ctx.beginPath()

        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.lineWidth = brushWidth
        ctx.strokeStyle = canvasColours[brushColour]

        // check if draw call is a dot and not a line being drawn from prev x,y
        const moveToX = dot ? localX : prevPos.current.prevX
        const moveToY = dot ? localY : prevPos.current.prevY

        /* 
          Here we specify the moveTo / lineTo of the current stroke. It first
          uses the alignOddLineWidth fn to handle the case of an odd lineWidth
          causing a blur effect due to how its being drawn between pixels. You
          can read more here: 
        */
        ctx.moveTo(alignOddLineWidth(11, moveToX), moveToY)
        ctx.lineTo(alignOddLineWidth(11, localX), localY)
        ctx.stroke()

        // Set current stroke position as previous position
        prevPos.current = {
          prevX: localX,
          prevY: localY,
        }
      }
    }
  }

  const onMouseDown = ({ nativeEvent }: MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    prevPos.current = {
      prevX: nativeEvent.offsetX,
      prevY: nativeEvent.offsetY,
    }
    draw(nativeEvent.offsetX, nativeEvent.offsetY, true)
  }

  const onMouseMove = ({ nativeEvent }: MouseEvent<HTMLCanvasElement>) => {
    draw(nativeEvent.offsetX, nativeEvent.offsetY, false)
  }

  const onMouseUp = ({ nativeEvent }: MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(false)
    prevPos.current = {
      prevX: nativeEvent.offsetX,
      prevY: nativeEvent.offsetY,
    }
  }

  return (
    <canvas
      width={746}
      height={640}
      style={{
        borderRadius: '6px',
        backgroundColor: '#F9F9F9',
      }}
      ref={canvasRef}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      onMouseDown={onMouseDown}
    />
  )
}
