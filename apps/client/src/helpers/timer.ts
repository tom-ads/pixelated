export function formatTimeInterval(timeSeconds: number) {
  if (!timeSeconds || isNaN(timeSeconds) || typeof timeSeconds !== 'number') {
    return '--:--'
  }

  const minutes = Math.floor(timeSeconds / 60)
  const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes

  const seconds = timeSeconds % 60
  const paddedSeconds = seconds < 10 ? `0${seconds}` : seconds

  return `${paddedMinutes}:${paddedSeconds}`
}
