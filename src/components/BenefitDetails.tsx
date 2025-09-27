import React from 'react'
import { useApp } from '../context/AppContext'
import Loader from './Loader'

export default function BenefitDetails() {
  const { selected, plan, planning, backToList, regeneratePlan } = useApp()
  if (!selected) return null

  return (
    <div className="content">
      <div className="breadcrumb">Step 4 · Action plan</div>

      <div className="row" style={{ justifyContent: 'space-between', display:'flex', alignItems:'center' }}>
        <div>
          <div><span className="chip">{selected.category}</span></div>
          <h2 style={{ margin: '8px 0 6px' }}>{selected.title}</h2>
          <div className="muted">{selected.coverage}</div>
        </div>
        <div className="row">
          <button className="ghost" onClick={backToList}>Back</button>
          <button onClick={regeneratePlan} disabled={planning}>Regenerate</button>
        </div>
      </div>

      <p className="spaced">{selected.description}</p>
      <div className="divider" />

      {planning ? (
        <Loader label="Generating your 3-step plan…" />
      ) : (
        <ol>
          {plan?.map((s, i) => <li key={i} style={{ margin: '8px 0' }}>{s}</li>)}
        </ol>
      )}

      <div className="footer-note">Data shown is mock. Replace aiService with your LLM client and real benefit API.</div>
    </div>
  )
}
