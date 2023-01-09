import { Card } from '@/components'
import { alignOddLineWidth } from '@/helpers/game'
import { MouseEvent, useRef, useState } from 'react'

export const CanvasCard = (): JSX.Element => {
  const [isDrawing, setIsDrawing] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)

  const prevPos = useRef<{ prevX: number; prevY: number }>({
    prevX: 0,
    prevY: 0,
  })

  const onMouseDown = (event: MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    const ctx = canvasRef.current?.getContext('2d')
    if (ctx) {
      ctx.beginPath()
      prevPos.current = {
        prevX: event.nativeEvent.offsetX,
        prevY: event.nativeEvent.offsetY,
      }
    }
  }

  const onMouseMove = (event: MouseEvent<HTMLCanvasElement>) => {
    const ctx = canvasRef.current?.getContext('2d')
    if (ctx && isDrawing) {
      const localX = event.nativeEvent.offsetX
      const localY = event.nativeEvent.offsetY
      ctx.lineWidth = 11
      ctx.strokeStyle = 'green'
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      ctx.moveTo(alignOddLineWidth(11, prevPos.current.prevX), prevPos.current.prevY)
      ctx.lineTo(alignOddLineWidth(11, localX), localY)
      ctx.stroke()

      prevPos.current = {
        prevX: localX,
        prevY: localY,
      }
    }
  }

  const onMouseUp = (event: MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(false)
    prevPos.current = {
      prevX: event.nativeEvent.offsetX,
      prevY: event.nativeEvent.offsetY,
    }
  }

  return (
    <Card className="flex-grow">
      <canvas
        width={746}
        height={640}
        style={{
          borderRadius: '6px',
          backgroundColor: 'lightGray',
        }}
        ref={canvasRef}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        onMouseDown={onMouseDown}
      />
    </Card>
  )
}
