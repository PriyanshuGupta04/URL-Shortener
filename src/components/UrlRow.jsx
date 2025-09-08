import { useRef } from 'react'

export default function UrlRow({ value, onChange, onRemove, disabled }) {
  const update = (k) => (e) => onChange({ ...value, [k]: e.target.value })
  const inputRef = useRef()
  const handleCopy = () => {
    if (inputRef.current) {
      navigator.clipboard.writeText(value.longUrl)
    }
  }
  return (
    <div className="row">
      <input ref={inputRef} className="input" placeholder="https://example.com/page"
             value={value.longUrl} onChange={update('longUrl')} disabled={disabled} />
      <input className="input" placeholder="validity (mins, default 30)"
             value={value.minutes} onChange={update('minutes')} disabled={disabled} />
      <input className="input" placeholder="preferred shortcode (optional)"
             value={value.customCode} onChange={update('customCode')} disabled={disabled} />
      <button className="icon-btn" title="Copy URL" onClick={handleCopy} disabled={disabled} type="button">
        <span role="img" aria-label="copy">📋</span>
      </button>
      <button className="remove" onClick={onRemove} disabled={disabled} type="button">✕</button>
    </div>
  )
}
