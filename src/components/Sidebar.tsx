import React from 'react'
import { useApp } from '../context/AppContext'

export default function Sidebar() {
  const { screen, startOver } = useApp()

  const steps = [
    { id: 'input', label: 'Describe your need' },
    { id: 'list', label: 'Classification & benefits' },
    { id: 'details', label: '3‑step action plan' }
  ] as const

  return (
    <aside className="sidebar">
      <div className="muted" style={{ marginBottom: 8 }}>Flow</div>
      <div style={{ display: 'grid', gap: 8 }}>
        {steps.map((s, idx) => (
          <div key={s.id} className={"step " + (screen === s.id ? 'active' : '')}>
            <div className="num">{idx+1}</div>
            <div>{s.label}</div>
          </div>
        ))}
      </div>
      <div className="divider" />
      <button className="ghost" onClick={startOver}>Start over</button>
    </aside>
  )
}
