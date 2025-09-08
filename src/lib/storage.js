export function readLocal(key, fallback) {
  const raw = localStorage.getItem(key)
  if (!raw) return fallback
  try { return JSON.parse(raw) } catch { return fallback }
}

export function writeLocal(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function pushToLocalArray(key, value) {
  const arr = readLocal(key, [])
  arr.push(value)
  writeLocal(key, arr)
}

export function removeFromLocalArray(key, predicate) {
  const arr = readLocal(key, [])
  const next = arr.filter(x => !predicate(x))
  writeLocal(key, next)
}
