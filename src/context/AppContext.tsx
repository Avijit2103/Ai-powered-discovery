import React, { createContext, useContext, useState } from 'react'
import type { Benefit, Category } from '../types'
import { classifyNeed, generatePlan, getBenefitsByCategory } from '../services/aiService'

type Screen = 'input' | 'clarify' | 'list' | 'details'

interface AppState {
    needsClarification?: boolean
    clarification?: string
  screen: Screen
  userInput: string
  category: Category
  classifying: boolean
  benefits: Benefit[]
  selected: Benefit | null
  planning: boolean
  plan: string[] | null
  submitInput: (text: string) => Promise<void>
  selectBenefit: (b: Benefit) => Promise<void>
  regenerateClassification: () => Promise<void>
  regeneratePlan: () => Promise<void>
  startOver: () => void
  backToList: () => void
  skipClarification:()=>void
  submitClarification:(note: string)=>void
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [screen, setScreen] = useState<Screen>('input')
    const [needsClarification, setNeedsClarification] = useState(false)
    const [clarification, setClarification] = useState('')
  const [userInput, setUserInput] = useState('')
  const [category, setCategory] = useState<Category>('Unknown')
  const [classifying, setClassifying] = useState(false)
  const [benefits, setBenefits] = useState<Benefit[]>([])
  const [selected, setSelected] = useState<Benefit | null>(null)
  const [plan, setPlan] = useState<string[] | null>(null)
  const [planning, setPlanning] = useState(false)

  async function submitInput(text: string) {
  setUserInput(text)
  setClassifying(true)
  setScreen('list')

  const cat = await classifyNeed(text)

  if (cat === 'Unknown') {
    setClassifying(false)
    setScreen('clarify')        
    return
  }

  setCategory(cat)
  setBenefits(getBenefitsByCategory(cat))
  setClassifying(false)
}

  async function selectBenefit(b: Benefit) {
    setSelected(b)
    setPlan(null)
    setPlanning(true)
    setScreen('details')
    const steps = await generatePlan(b)
    setPlan(steps)
    setPlanning(false)
  }

  async function regenerateClassification() {
  if (!userInput) return
  setClassifying(true)

  const cat = await classifyNeed(userInput)

  if (cat === 'Unknown') {
    setClassifying(false)
    setScreen('clarify')       
    return
  }

  setCategory(cat)
  setBenefits(getBenefitsByCategory(cat))
  setClassifying(false)
}

  async function regeneratePlan() {
    if (!selected) return
    setPlanning(true)
    const steps = await generatePlan(selected)
    setPlan(steps)
    setPlanning(false)
  }

  function startOver() {
    setScreen('input')
    setUserInput('')
    setCategory('Unknown')
    setBenefits([])
    setSelected(null)
    setPlan(null)
    setClassifying(false)
    setPlanning(false)
  }

  function backToList() {
    setScreen('list')
  }

  async function submitClarification(note: string) {
  setClarification(note)
  setClassifying(true)
  const combined = userInput + ' Additional detail: ' + note
  const cat = await classifyNeed(combined)
  if (cat === 'Unknown') {
    setClassifying(false)
    setNeedsClarification(true)
    setScreen('clarify')
    return
  }
  setCategory(cat)
  setBenefits(getBenefitsByCategory(cat))
  setNeedsClarification(false)
  setClassifying(false)
  setScreen('list')
}

function skipClarification() {
  setNeedsClarification(false)
  setCategory('Unknown')
  setBenefits(getBenefitsByCategory('Unknown'))
  setScreen('list')
}
const value: AppState = {
    screen, userInput, category, classifying, benefits, selected, planning, plan, needsClarification, clarification,
    submitInput, selectBenefit, regenerateClassification, regeneratePlan, startOver, backToList,skipClarification,submitClarification
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
