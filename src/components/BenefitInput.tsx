import React, { useState } from 'react'
import { useApp } from '../context/AppContext'

export default function BenefitInput() {
  const { submitInput, classifying } = useApp()
  const [text, setText] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    submitInput(text.trim())
  }

  return (
    <div className="card input-card">
      <form onSubmit={handleSubmit}>
        <label className="muted">Describe your need</label>
        <textarea
          className="input"
          placeholder="I have tooth pain, what can I do?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={classifying}
        />
        <div className="actions">
          <button type="submit" className="primary" disabled={classifying}>Classify and show benefits</button>
          <button type="button" className="ghost" onClick={() => setText('')} disabled={classifying}>Clear</button>
        </div>
        <div className="footer-note">Tip: Avoid personal identifiers. Keep it simple: symptom + context.</div>
      </form>
    </div>
  )
}
