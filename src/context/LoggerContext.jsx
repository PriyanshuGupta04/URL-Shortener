import React, { createContext, useContext, useMemo, useRef } from 'react'
import { saveLog } from '../lib/logger.js'

const LoggerContext = createContext(null)

export function LoggerProvider({ children }) {
  const isMounted = useRef(true)

  const logger = useMemo(() => ({
    info: (event, meta={}) => saveLog('info', event, meta),
    warn: (event, meta={}) => saveLog('warn', event, meta),
    error: (event, meta={}) => saveLog('error', event, meta),
  }), [])

  return <LoggerContext.Provider value={logger}>{children}</LoggerContext.Provider>
}

export function useLogger() {
  const ctx = useContext(LoggerContext)
  if (!ctx) throw new Error('useLogger must be used within LoggerProvider')
  return ctx
}
