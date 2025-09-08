import { useEffect, useState } from 'react'

export default function Toast({ kind='ok', message, onClose, timeout=3000 }) {
  const [open, setOpen] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => { setOpen(false); onClose?.() }, timeout)
    return () => clearTimeout(t)
  }, [timeout, onClose])
  if (!open) return null
  return (
    <div className="toast">
      <div className={kind === 'ok' ? 'ok' : 'err'}>{message}</div>
    </div>
  )
}
