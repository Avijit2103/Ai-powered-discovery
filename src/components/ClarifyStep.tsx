import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import Loader from './Loader'

export default function ClarifyStep() {
  const { classifying, submitClarification, skipClarification } = useApp()
  const [detail, setDetail] = useState('')

  const hints = [
    'Where exactly? (tooth/gum/head/eye/chest/etc.)',
    'How long has it been? (hours/days/weeks)',
    'Any diagnosis or prior treatment? (yes/no)'
  ]

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!detail.trim()) return
    submitClarification(detail.trim())
  }

  return (
    <div className="content">
      <div className="breadcrumb">Step 2 · Need more details</div>
      <div className="card input-card">
        <div style={{ marginBottom: 8 }}>
          Tell us a bit more so we can classify correctly.
        </div>
        <ul className="muted" style={{ marginTop: 0 }}>
          {hints.map((h, i) => <li key={i}>{h}</li>)}
        </ul>
        <form onSubmit={onSubmit}>
          <textarea
            className="input"
            placeholder="e.g., Pain is on the left molar, started last night, no prior dental history"
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            disabled={classifying}
          />
          <div className="actions">
            <button type="submit" className="primary" disabled={classifying || !detail.trim()}>Reclassify</button>
            <button type="button" className="ghost" onClick={skipClarification} disabled={classifying}>Skip</button>
          </div>
        </form>
      </div>
      {classifying && (
        <div style={{ marginTop: 12 }}>
          <Loader label="Reclassifying with your details…" />
        </div>
      )}
    </div>
  )
}
