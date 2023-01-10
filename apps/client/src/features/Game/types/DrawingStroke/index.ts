export type CanvasAction = 'reset' | undefined

type StrokeStyling = {
  clr: string
  ls: number
}

type StrokePos = {
  pX: number
  pY: number
  lX: number
  lY: number
}

export type DrawingStroke = Partial<StrokePos & StrokeStyling> & {
  pId: string
  act?: CanvasAction
}
