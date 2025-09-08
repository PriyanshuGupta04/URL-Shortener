export function isValidUrl(u) {
  try {
    const url = new URL(u)
    return !!(url.protocol === 'http:' || url.protocol === 'https:')
  } catch {
    return false
  }
}

export function isAlnum(str) {
  return /^[a-z0-9]+$/i.test(str)
}

export function parseMinutes(v, fallback=30) {
  if (v === '' || v === null || v === undefined) return fallback
  const n = Number(v)
  if (!Number.isFinite(n) || n <= 0) return fallback
  return Math.round(n)
}
