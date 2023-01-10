import { alignOddLineWidth } from '@/helpers/game'
import { RootState } from '@/store'
import { MouseEvent, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useGetDrawingQuery, useSendDrawingMutation } from '../../api'
import { ColourKeys } from '../../types'

export const canvasColours = {
  red: '#BD2B2B',
  orange: '#FFA336',
  yellow: '#FFEC36',
  green: '#2BBD4B',
  blue: '#2BB4BD',
  purple: '#622BBD',
  pink: '#BD2B82',
  white: '#F9F9F9',
}

/* 
  Note: Canvas does not handle different device screens or
  changing canvas width/heights, this effects how the drawers
  strokes are to their mouse position.
*/
export const Canvas = (): JSX.Element => {
  const [isDrawing, setIsDrawing] = useState(false)

  const { partyId, brushWidth, brushColour } = useSelector((state: RootState) => ({
    partyId: state.party.id,
    brushWidth: state.game.canvas.lineWidth,
    brushColour: state.game.canvas.colour,
  }))

  const [sendDrawing] = useSendDrawingMutation()
  const { data: drawPath } = useGetDrawingQuery()

  const canvasRef = useRef<HTMLCanvasElement>(null)

  const prevPos = useRef<{ prevX: number; prevY: number }>({
    prevX: 0,
    prevY: 0,
  })

  const drawStroke = (
    prevX: number,
    prevY: number,
    localX: number,
    localY: number,
    colour?: ColourKeys,
  ) => {
    const ctx = canvasRef.current?.getContext('2d')
    if (ctx) {
      ctx.beginPath()

      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.lineWidth = brushWidth
      ctx.strokeStyle = canvasColours[colour ?? brushColour]

      /*
        Here we specify the moveTo / lineTo of the current stroke. It first
        uses the alignOddLineWidth fn to handle the case of an odd lineWidth
        causing a blur effect due to how its being drawn between pixels. You
        can read more here: 
        https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Applying_styles_and_colors#a_linewidth_example
      */
      ctx.moveTo(alignOddLineWidth(11, prevX), prevY)
      ctx.lineTo(alignOddLineWidth(11, localX), localY)
      ctx.stroke()
    }
  }

  const broadcastStroke = (localX: number, localY: number, dot?: boolean) => {
    if (isDrawing || dot) {
      const prevX = dot ? localX : prevPos.current.prevX
      const prevY = dot ? localY : prevPos.current.prevY
      drawStroke(prevX, prevY, localX, localY)

      if (partyId) {
        sendDrawing({
          pId: partyId,
          pX: prevX,
          pY: prevY,
          lX: localX,
          lY: localY,
          clr: brushColour,
          ls: brushWidth,
        })
      }

      prevPos.current = {
        prevX: localX,
        prevY: localY,
      }
    }
  }

  useEffect(() => {
    if (drawPath) {
      drawStroke(drawPath.pX, drawPath.pY, drawPath.lX, drawPath.lY, drawPath.clr as ColourKeys)
    }
  }, [drawPath])

  const onMouseDown = ({ nativeEvent }: MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    broadcastStroke(nativeEvent.offsetX, nativeEvent.offsetY, true)
  }

  const onMouseMove = ({ nativeEvent }: MouseEvent<HTMLCanvasElement>) => {
    broadcastStroke(nativeEvent.offsetX, nativeEvent.offsetY, false)
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
