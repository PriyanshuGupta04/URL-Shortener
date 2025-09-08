import { pushToLocalArray } from './storage.js'

const LOG_KEY = 'am_logs'

export function saveLog(level, event, meta) {
  const entry = {
    id: crypto.randomUUID(),
    ts: Date.now(),
    level, event, meta
  }
  pushToLocalArray(LOG_KEY, entry)
  // No console logging allowed per spec.
  return entry
}

export function getLogs() {
  const raw = localStorage.getItem(LOG_KEY)
  return raw ? JSON.parse(raw) : []
}
