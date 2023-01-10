import { canvasColours } from '../../components/Canvas'

export type CanvasControls = {
  lineWidth: number
  colour: ColourKeys
  brushType: 'stroke' | 'erase'
  action: 'undo' | 'reset' | undefined
}

export type ColourKeys = keyof typeof canvasColours
