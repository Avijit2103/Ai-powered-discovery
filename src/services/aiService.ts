import type { Category, Benefit } from '../types'
import benefits from '../data/benefits.json'

function norm(t: string) {
  return t.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim()
}
function tokens(t: string) {
  return norm(t).split(' ').filter(Boolean)
}

// Damerau–Levenshtein distance (tiny, enough for typos tolerance)
function editDistance(a: string, b: string) {
  const al = a.length, bl = b.length
  const dp: number[][] = Array.from({ length: al + 2 }, () => Array(bl + 2).fill(0))
  const INF = al + bl
  dp[0][0] = INF
  for (let i = 0; i <= al; i++) { dp[i + 1][1] = i; dp[i + 1][0] = INF }
  for (let j = 0; j <= bl; j++) { dp[1][j + 1] = j; dp[0][j + 1] = INF }
  const da: Record<string, number> = {}
  for (let i = 1; i <= al; i++) {
    let db = 0
    for (let j = 1; j <= bl; j++) {
      const i1 = da[b[j - 1]] || 0
      const j1 = db
      let cost = 1
      if (a[i - 1] === b[j - 1]) { cost = 0; db = j }
      dp[i + 1][j + 1] = Math.min(
        dp[i][j] + cost,             // subst
        dp[i + 1][j] + 1,            // ins
        dp[i][j + 1] + 1,            // del
        dp[i1][j1] + (i - i1 - 1) + 1 + (j - j1 - 1) // transposition
      )
    }
    da[a[i - 1]] = i
  }
  return dp[al + 1][bl + 1]
}

type KW = { k: string; w?: number }
type Bag = Record<Exclude<Category, 'Unknown'>, KW[]>

const BAGS: Bag = {
  'Vision': [
    { k:'eye' }, { k:'eyes' }, { k:'vision' }, { k:'sight' },
    { k:'optician' }, { k:'optometrist' }, { k:'ophthalm' },
    { k:'glasses' }, { k:'spectacles' }, { k:'specs' }, { k:'eyewear' },
    { k:'lens' }, { k:'lenses' }, { k:'contact lens', w:2 }, { k:'contacts' },
    { k:'blurry' }, { k:'blurred' }, { k:'dry eye', w:2 }, { k:'red eye', w:2 }, { k:'pink eye', w:2 },
    { k:'eye test', w:2 }, { k:'eye exam', w:2 }, { k:'refraction' },
    { k:'prescription update', w:2 },
    { k:'lasik' }, { k:'cataract' }
  ],
  'Dental': [
    { k:'tooth' }, { k:'teeth' }, { k:'toothache' }, { k:'molar' }, { k:'wisdom tooth', w:2 },
    { k:'gum' }, { k:'gingiv' }, { k:'periodont' }, { k:'bleeding gums', w:2 }, { k:'sensitivity' },
    { k:'cavity' }, { k:'caries' }, { k:'decay' }, { k:'root canal', w:2 }, { k:'rct' },
    { k:'crown' }, { k:'bridge' }, { k:'braces' }, { k:'orthodont' },
    { k:'extraction' }, { k:'filling' }, { k:'scaling' }, { k:'cleaning' },
    { k:'mouth ulcer', w:2 }, { k:'jaw pain', w:2 },
    { k:'dentist' }, { k:'dental' }, { k:'oral clinic', w:2 }
  ],
  'Mental Health': [
    { k:'mental' }, { k:'therapy' }, { k:'therapist' }, { k:'counselor' }, { k:'counsellor' }, { k:'counselling' },
    { k:'psychologist' }, { k:'psychiatrist' }, { k:'psych' },
    { k:'stress' }, { k:'anxiety' }, { k:'panic' }, { k:'depress' }, { k:'depression' },
    { k:'insomnia' }, { k:'sleep issues', w:2 }, { k:'burnout' }, { k:'grief' }, { k:'trauma' },
    { k:'ptsd' }, { k:'mood' }, { k:'mindfulness' }, { k:'wellbeing' }
  ],
  'OPD': [
    { k:'doctor' }, { k:'gp' }, { k:'physician' }, { k:'clinic' }, { k:'hospital' }, { k:'appointment' },
    { k:'opd' }, { k:'checkup' }, { k:'follow up', w:2 }, { k:'prescription' },
    { k:'fever' }, { k:'cold' }, { k:'cough' }, { k:'flu' }, { k:'sore throat', w:2 }, { k:'throat pain', w:2 },
    { k:'runny nose', w:2 }, { k:'infection' },
    { k:'headache' }, { k:'migraine' }, { k:'stomach ache', w:2 }, { k:'abdominal pain', w:2 },
    { k:'gastric' }, { k:'acidity' }, { k:'vomit' }, { k:'vomiting' }, { k:'diarrhea' }, { k:'diarrhoea' },
    { k:'back pain', w:2 }, { k:'body ache', w:2 }, { k:'fatigue' },
    { k:'injury' }, { k:'sprain' }, { k:'strain' }, { k:'bruise' }, { k:'cut' }, { k:'wound' }, { k:'bite' }, { k:'burn' },
    { k:'derma' }, { k:'skin rash', w:2 }, { k:'allergy' }, { k:'ent' }, { k:'ear pain', w:2 }, { k:'orthopedic' }, { k:'physio' },
    { k:'blood test', w:2 }, { k:'lab test', w:2 }, { k:'pathology' },
    { k:'x-ray' }, { k:'xray' }, { k:'ultrasound' }, { k:'vaccination' }, { k:'vaccine' }
  ]
}

// --------- SCORER ---------
function scoreBag(input: string, bag: KW[]) {
  const T = tokens(input)
  const text = ' ' + norm(input) + ' ' 
  let s = 0

  for (const { k, w } of bag) {
    const kw = k.toLowerCase()
    const weight = w ?? (kw.includes(' ') ? 2 : 1)

    if (kw.includes(' ')) {
      if (text.includes(' ' + kw + ' ')) { s += weight; continue }
    } else {
      if (T.includes(kw)) { s += weight; continue }
      if (kw.length >= 4 && T.some(t => t.startsWith(kw))) { s += weight * 0.8; continue }
      // 4) fuzzy match (edit distance ≤ 1) for typos like "glases", "denstist"
      if (kw.length >= 4 && T.some(t => Math.abs(t.length - kw.length) <= 1 && editDistance(t, kw) <= 1)) {
        s += weight * 0.6; continue
      }
    }
  }
  return s
}

function classifyLocal(input: string): Category {
  const cats = Object.keys(BAGS) as Array<keyof typeof BAGS>
  const scores = cats.map(c => [c, scoreBag(input, BAGS[c])] as const).sort((a,b)=>b[1]-a[1])
  const [bestCat, bestScore] = scores[0]
  const secondScore = scores[1]?.[1] ?? 0

  if (bestScore <= 0.9) return 'Unknown'
  if (Math.abs(bestScore - secondScore) < 0.6) return 'Unknown'
  return bestCat as Category
}

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms))

export async function classifyNeed(userInput: string): Promise<Category> {
  
  await sleep(600)
  return classifyLocal(userInput)
}

export function getBenefitsByCategory(category: Category): Benefit[] {
  const items: Benefit[] = (benefits as any).items
  if (category === 'Unknown') return items.slice(0, 3)
  return items.filter(b => b.category === category).slice(0, 4)
}

const PLAN_TEMPLATES: Record<Exclude<Category,'Unknown'>, string[][]> = {
  'Dental': [
    [
      "Book a network dentist from the portal",
      "Carry your employee ID and policy e-card",
      "Submit the e-claim or use cashless at the clinic"
    ],
    [
      "Schedule a dental consult (in-network preferred)",
      "Get the treatment plan and estimate approved if needed",
      "Upload bill and prescription for reimbursement"
    ]
  ],
  'Vision': [
    [
      "Choose a partnered optician or clinic",
      "Complete eye test and upload the prescription",
      "Claim frames/lenses within the annual limit via the portal"
    ],
    [
      "Search the portal for network optical stores",
      "Buy frames/lenses per prescription and keep the invoice",
      "Submit the claim online with invoice and Rx"
    ]
  ],
  'Mental Health': [
    [
      "Schedule a confidential session with an in-network therapist",
      "Complete the intake form in the portal",
      "Attend the session and track follow-ups in the app"
    ],
    [
      "Pick an EAP partner therapist",
      "Book a slot and confirm coverage (no copay if applicable)",
      "Join the session and save the visit summary"
    ]
  ],
  'OPD': [
    [
      "Find a nearby network clinic/doctor",
      "Use cashless or keep bills if out-of-network",
      "Upload prescription and invoice to get reimbursed"
    ],
    [
      "Book a general physician visit from the portal",
      "Take your e-card and photo ID to the clinic",
      "Submit consultation bill and Rx for OPD claim"
    ]
  ]
}

let planIndex = 0
export async function generatePlan(selected: Benefit): Promise<string[]> {
  await sleep(500)
  if (selected.category === 'Unknown') {
    return [
      "What symptoms, duration, and any prior diagnosis?",
      "Meanwhile, open the portal to check your e-card and coverage limits",
      "If urgent, call the helpline for triage"
    ]
  }
  const variants = PLAN_TEMPLATES[selected.category as Exclude<Category,'Unknown'>]
  const idx = planIndex++ % variants.length
  return variants[idx]
}