import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { addClick, findByCode } from '../lib/shortener.js'
import { useLogger } from '../context/LoggerContext.jsx'

export default function Redirect() {
  const { code } = useParams()
  const nav = useNavigate()
  const [status, setStatus] = useState('Redirecting...')
  const logger = useLogger()

  useEffect(() => {
    const item = findByCode(code || '')
    if (!item) {
      setStatus('Short URL not found'); logger.warn('redirect_not_found', { code })
      const t = setTimeout(()=>nav('/404', { replace: true }), 1000)
      return () => clearTimeout(t)
    }
    if (Date.now() > item.expiresAt) {
      setStatus('This short link has expired.'); logger.info('redirect_expired', { code })
      return
    }
    // Record click
    const click = {
      ts: Date.now(),
      referrer: document.referrer || '',
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown'
    }
    addClick(item.code, click)
    logger.info('redirect_click', { code: item.code })
    // Perform redirect
    window.location.replace(item.longUrl)
  }, [code, nav, logger])

  return (
    <div className="card" style={{maxWidth:700, margin:'60px auto'}}>
      <h2>{status}</h2>
      <p className="helper">If you are not redirected automatically, <a href="/" >return home</a>.</p>
    </div>
  )
}
