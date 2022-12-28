import { MouseEvent, useRef, useState } from 'react'

function App() {
  const [isDrawing, setIsDrawing] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)

  const position = useRef<{ startX: number; startY: number }>({
    startX: 0,
    startY: 0,
  })

  const onMouseDown = (event: MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    const ctx = canvasRef.current?.getContext('2d')
    if (ctx) {
      ctx.beginPath()
      position.current = {
        startX: event.nativeEvent.offsetX,
        startY: event.nativeEvent.offsetY,
      }
    }
  }

  const onMouseMove = (event: MouseEvent<HTMLCanvasElement>) => {
    const ctx = canvasRef.current?.getContext('2d')
    if (ctx && isDrawing) {
      const localX = event.nativeEvent.offsetX
      const localY = event.nativeEvent.offsetY

      ctx.strokeStyle = 'green'
      ctx.moveTo(position.current.startX, position.current.startY)
      ctx.lineTo(localX, localY)
      ctx.stroke()

      position.current = {
        startX: localX,
        startY: localY,
      }
    }
  }

  const onMouseUp = (event: MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(false)
    position.current = {
      startX: event.nativeEvent.offsetX,
      startY: event.nativeEvent.offsetX,
    }
  }

  const onMouseEnter = (event: MouseEvent<HTMLCanvasElement>) => {
    // TODO: solve issue of leaving container, then re-entering drawing a vertical line etc.
    position.current = {
      startX: event.nativeEvent.offsetX,
      startY: event.nativeEvent.offsetX,
    }
  }

  const onMouseLeave = (event: MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(false)
    position.current = {
      startX: event.nativeEvent.offsetX,
      startY: event.nativeEvent.offsetX,
    }
  }

  return (
    <div className="max-w-sm">
      <h1 className="font-chango">Vite + React</h1>
      <canvas
        style={{
          backgroundColor: 'lightGray',
        }}
        ref={canvasRef}
        onMouseEnter={onMouseEnter}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
      />
    </div>
  )
}

export default App
