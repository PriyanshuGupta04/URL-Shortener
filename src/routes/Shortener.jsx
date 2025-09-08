import { useMemo, useState } from 'react'
import UrlRow from '../components/UrlRow.jsx'
import Toast from '../components/Toast.jsx'
import { isValidUrl, parseMinutes } from '../lib/validator.js'
import { createShort } from '../lib/shortener.js'
import { minutesFromNow } from '../lib/time.js'
import { useLogger } from '../context/LoggerContext.jsx'

function emptyRow() { return { longUrl: '', minutes: '', customCode: '' } }

export default function Shortener() {
  const [rows, setRows] = useState([emptyRow()])
  const [busy, setBusy] = useState(false)
  const [toast, setToast] = useState(null)
  const [results, setResults] = useState([])
  const logger = useLogger()

  const canAdd = rows.length < 5

  function addRow() { if (canAdd) setRows([...rows, emptyRow()]) }
  function removeRow(i) { setRows(rows.filter((_, idx) => idx !== i)) }
  function updateRow(i, v) {
    const next = rows.slice(); next[i] = v; setRows(next)
  }

  const validateRow = (r) => {
    if (!r.longUrl || !isValidUrl(r.longUrl)) return 'Provide a valid http/https URL'
    const mins = parseMinutes(r.minutes, 30)
    if (mins <= 0) return 'Validity should be a positive integer (minutes)'
    if (r.customCode && !/^[a-z0-9]+$/i.test(r.customCode)) return 'Shortcode must be alphanumeric'
    if (r.customCode && r.customCode.length > 20) return 'Shortcode too long (max 20)'
    return null
  }

  async function onSubmit(e) {
    e.preventDefault()
    setBusy(true)
    setResults([])
    try {
      const created = []
      for (const r of rows) {
        const err = validateRow(r)
        if (err) {
          setToast({ kind: 'err', message: err }); logger.warn('validation_error', { err, row: r })
          continue
        }
        const minutes = parseMinutes(r.minutes, 30)
        const res = createShort({ longUrl: r.longUrl.trim(), minutes, customCode: r.customCode.trim() || undefined })
        if (!res.ok) { setToast({ kind: 'err', message: res.error }); logger.warn('create_collision_or_invalid', { error: res.error }); continue }
        created.push(res.data)
        logger.info('short_created', { code: res.data.code, longUrl: res.data.longUrl, expiresAt: res.data.expiresAt })
      }
      setResults(created)
      if (created.length) setToast({ kind: 'ok', message: `Created ${created.length} short URL(s)` })
    } catch (err) {
      setToast({ kind: 'err', message: 'Unexpected error while creating links' })
      logger.error('unexpected_create_error', { message: String(err) })
    } finally {
      setBusy(false)
    }
  }

  const origin = typeof window !== 'undefined' ? window.location.origin : ''

  return (
    <div className="grid" style={{gap:16}}>
      <div className="card">
        <h2>Create Short URLs</h2>
        <p className="helper">You can add up to 5 URLs at once. Default validity is 30 minutes if left empty.</p>
        <div className="hr"></div>
        <form onSubmit={onSubmit} className="grid">
          <div className="grid" style={{gap:10}}>
            {rows.map((r, i) => (
              <UrlRow key={i} value={r} onChange={v=>updateRow(i,v)} onRemove={()=>removeRow(i)} disabled={busy} />
            ))}
          </div>
          <div className="stack">
            <button type="button" className="btn" onClick={addRow} disabled={!canAdd || busy}>+ Add URL</button>
            <span className="helper">{rows.length}/5</span>
            <div style={{flex:1}}></div>
            <button type="submit" className="btn" disabled={busy}>Shorten</button>
          </div>
        </form>
      </div>

      {results.length > 0 && (
        <div className="card">
          <h3>Results</h3>
          <table className="table">
            <thead><tr><th>Short</th><th>Destination</th><th>Expires</th><th></th></tr></thead>
            <tbody>
              {results.map(r => (
                <tr key={r.code}>
                  <td className="mono">
                    <a href={`/${r.code}`} target="_blank" rel="noreferrer">{origin}/{r.code}</a>
                  </td>
                  <td className="small mono">{r.longUrl}</td>
                  <td className="small">{new Date(r.expiresAt).toLocaleString()}</td>
                  <td style={{whiteSpace:'nowrap'}}>
                    <button
                      className="icon-btn"
                      title="Copy short URL"
                      type="button"
                      onClick={() => navigator.clipboard.writeText(`${origin}/${r.code}`)}
                    >
                      <span role="img" aria-label="copy">📋</span>
                    </button>
                    <a
                      className="icon-btn"
                      title="Open short URL"
                      href={`/${r.code}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{textDecoration:'none', marginLeft:4}}
                    >
                      <span role="img" aria-label="visit">🔗</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {toast && <Toast kind={toast.kind} message={toast.message} onClose={()=>setToast(null)} />}
    </div>
  )
}
