import { useEffect, useMemo, useState } from 'react'
import { getAllUrls, getClicks } from '../lib/shortener.js'
import { fmtDate } from '../lib/time.js'

export default function Stats() {
  const [urls, setUrls] = useState([])
  useEffect(() => { setUrls(getAllUrls()) }, [])

  const origin = typeof window !== 'undefined' ? window.location.origin : ''

  return (
    <div className="grid" style={{gap:16}}>
      <div className="card">
        <h2>URL Shortener Statistics</h2>
        <p className="helper">Historical data is stored in your browser (localStorage). Each click records timestamp, referrer and timezone.</p>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Short URL</th>
              <th>Created</th>
              <th>Expires</th>
              <th>Clicks</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {urls.map(u => <Row key={u.code} u={u} origin={origin} />)}
            {urls.length === 0 && (
              <tr><td colSpan="5" className="helper">No data yet. Create a short URL first.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Row({ u, origin }) {
  const [open, setOpen] = useState(false)
  const clicks = useMemo(() => getClicks(u.code), [open, u.code])
  return (
    <>
      <tr>
        <td className="mono"><a href={`/${u.code}`} target="_blank" rel="noreferrer">{origin}/{u.code}</a></td>
        <td>{fmtDate(u.createdAt)}</td>
        <td>{fmtDate(u.expiresAt)}</td>
        <td>{u.clicks}</td>
        <td><button className="btn" onClick={()=>setOpen(!open)}>{open ? 'Hide' : 'View'}</button></td>
      </tr>
      {open && (
        <tr>
          <td colSpan="5">
            <table className="table">
              <thead><tr><th>#</th><th>Timestamp</th><th>Referrer</th><th>Timezone</th></tr></thead>
              <tbody>
                {clicks.map((c, i) => (
                  <tr key={i}>
                    <td>{i+1}</td>
                    <td>{fmtDate(c.ts)}</td>
                    <td className="small mono">{c.referrer || '-'}</td>
                    <td className="small">{c.tz}</td>
                  </tr>
                ))}
                {clicks.length === 0 && <tr><td colSpan="4" className="helper">No clicks yet.</td></tr>}
              </tbody>
            </table>
          </td>
        </tr>
      )}
    </>
  )
}
