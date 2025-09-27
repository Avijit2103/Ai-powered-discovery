import React from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import BenefitInput from './components/BenefitInput'
import BenefitList from './components/BenefitList'
import ClarifyStep from './components/ClarifyStep'
import BenefitDetails from './components/BenefitDetails'
import { useApp } from './context/AppContext'

export default function App() {
  const { screen } = useApp()

  return (
    <div className="app">
      <Header />
      <div className="appgrid">
        <Sidebar />
        {screen === 'input' && (
          <div className="content">
            <BenefitInput />
            <div className="footer-note" style={{ marginTop: 12 }}>
              Example inputs: “Tooth pain since last night”, “Feeling anxious and can’t sleep”, “Need new glasses”
            </div>
          </div>
        )}
        {screen === 'clarify' && <ClarifyStep />}
          {screen === 'list' && <BenefitList />}
        {screen === 'details' && <BenefitDetails />}
      </div>
    </div>
  )
}
