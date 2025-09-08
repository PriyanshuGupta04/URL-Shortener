export function fmtDate(ts) {
  return new Date(ts).toLocaleString()
}

export function minutesFromNow(mins) {
  return Date.now() + mins * 60 * 1000
}

export function isExpired(ts) {
  return Date.now() > ts
}

export function timeLeft(ts) {
  const ms = ts - Date.now()
  if (ms <= 0) return 'expired'
  const m = Math.floor(ms/60000)
  const s = Math.floor((ms%60000)/1000)
  return `${m}m ${s}s`
}
