export function formatDurationLabel(totalMinutes) {
  var minutes = Number(totalMinutes)
  if (!Number.isFinite(minutes) || minutes <= 0) return '—'
  var hours = Math.floor(minutes / 60)
  var mins = minutes % 60
  if (hours <= 0) return `${mins} min`
  return `${String(hours).padStart(2, '0')} h ${String(mins).padStart(2, '0')}`
}

export function splitDuration(totalMinutes) {
  var minutes = Number(totalMinutes)
  if (!Number.isFinite(minutes) || minutes < 0) {
    return { hours: 0, minutes: 0 }
  }
  return {
    hours: Math.floor(minutes / 60),
    minutes: minutes % 60,
  }
}

export function combineDuration(hours, minutes) {
  var h = Math.max(0, Number(hours) || 0)
  var m = Math.max(0, Number(minutes) || 0)
  return h * 60 + m
}
