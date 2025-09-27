import React from 'react'
import { useApp } from '../context/AppContext'
import Loader from './Loader'

export default function BenefitList() {
  const { category, benefits, classifying, regenerateClassification, selectBenefit } = useApp()

  return (
    <div className="content">
      <div className="row" style={{ justifyContent: 'space-between', display:'flex', alignItems:'center' }}>
        <div>
          <div className="breadcrumb">Step 2 · Classification</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="chip">Category</span>
            {classifying ? <Loader label="Classifying..." /> : <strong>{category}</strong>}
          </div>
        </div>
        <div>
          <button onClick={regenerateClassification} disabled={classifying}>Regenerate</button>
        </div>
      </div>

      <div className="divider" />

      <div className="breadcrumb">Step 3 · Suggested benefits</div>
      <div className="benefits-grid">
        {benefits.map(b => (
          <div key={b.id} className="card benefit-card" onClick={() => selectBenefit(b)}>
            <div><span className="chip">{b.category}</span></div>
            <h3 style={{ margin: '8px 0 6px' }}>{b.title}</h3>
            <div className="muted">{b.coverage}</div>
            <p className="spaced" style={{ marginBottom: 0 }}>{b.description}</p>
          </div>
        ))}
        {!benefits.length && !classifying && (
          <div className="muted">No benefits found for this category.</div>
        )}
      </div>
    </div>
  )
}
