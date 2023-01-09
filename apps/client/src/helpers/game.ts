export function alignOddLineWidth(lineWidth: number, coord: number): number {
  if (lineWidth % 2 === 0) {
    return coord + 0.5
  }

  return coord
}
