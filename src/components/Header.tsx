import React from 'react'
import { useTheme } from '../context/ThemeContext'

export default function Header() {
  const { theme, toggle } = useTheme()
  return (
    <header className="appbar">
      <div className="brand">
        <div className="logo" />
        <div>
          <h2 className="title">Benefits Discovery</h2>
          <div className="muted">Type a need. We’ll classify it and guide your next steps.</div>
        </div>
      </div>
      <div className="toolbar">
        <button className="toggle" onClick={toggle}>
          {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </div>
    </header>
   )
}
