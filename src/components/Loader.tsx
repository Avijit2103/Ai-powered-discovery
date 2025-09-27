import React from 'react'
import Lottie from 'lottie-react'
import animation from '../lottie/loading.json'   // now inside src/

export default function Loader({ label = 'Loading…' }: { label?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 44, height: 44 }}>
        <Lottie animationData={animation} loop autoplay style={{ width: '100%', height: '100%' }} />
      </div>
      <span className="muted">{label}</span>
    </div>
  )
}