import { canvasColours } from '../../components/Canvas'
import { CanvasAction } from '../DrawingStroke'

export type CanvasControls = {
  lineWidth: number
  colour: ColourKeys
  brushType: 'stroke' | 'erase'
  action: CanvasAction
}

export type ColourKeys = keyof typeof canvasColours
