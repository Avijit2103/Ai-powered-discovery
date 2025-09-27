# 🏥 AI-Powered Benefits Discovery Flow

This project demonstrates a **multi-screen employee benefits discovery flow**.  
Employees can describe a health need in natural language, and the system intelligently classifies the need and provides a clear, actionable plan to utilize relevant company benefits.

---

## 🚀 1. Project Setup & Demo

This application is built using **React, Vite, and TypeScript**.

### Steps to run locally:
```bash
# Clone the repository
git clone <repo-url>
cd <repo-folder>

# Install dependencies
npm install

# Start the development server
npm run dev
# or
npm start
```

By default, the app runs on [http://localhost:5173](http://localhost:5173) (or the port specified by Vite).

---

## 🖼️ 2. What You’ll See (Application Flow)

The application guides the user through **four distinct screens**:

### Screen 1 – Input
- **Description**: Free-text entry field for describing health needs.  
- **Key Feature**: Friendly placeholder: *"I have tooth pain, what can I do?"*

### Screen 2 – Classification
- **Description**: Processes input and maps it to a benefit category.  
- **Key Feature**: Displays a **Lottie animation** during processing.  
- If input is vague → routes to the **Clarify screen** (Unknown).

### Screen 3 – Benefit Cards
- **Description**: Displays a curated list of relevant benefits.  
- **Key Feature**: Shows **2–4 mock benefit cards** with title, coverage summary, and description.

### Screen 4 – Action Plan
- **Description**: Provides specific instructions to use the selected benefit.  
- **Key Feature**: Exactly **3 imperative steps**. Includes a **Regenerate** option.

---

## ⚙️ 3. Tech & Decisions

- **Framework**: React + Vite + TypeScript  
- **State Management**: React Context (for global state, avoids prop drilling)  
- **Styling**: CSS variables with Dark/Light theme toggle (persisted in `localStorage`)  
- **Loading UI**: [lottie-react](https://github.com/Gamote/lottie-react) animations  
- **Data Source**: Benefits loaded from **mock JSON** (no backend)  
- **AI Simulation**: Local keyword + fuzzy matching logic (instead of LLM)  
- **Unknown Handling**: Clarify screen → collects extra details → reclassifies  

---

## 🧠 4. Local Classification (Simulated AI)

Since this is a front-end demo, **classification uses local matching logic**.

### Categories & Keywords
- **Dental**: teeth, gums, dentist, cavity, root canal, braces, crown, scaling  
- **Vision**: eyes, glasses/specs/eyewear, contacts, eye test, optician, LASIK  
- **Mental Health**: therapy, counselling, anxiety, depression, stress, insomnia  
- **OPD**: doctor/clinic, common illnesses, minor injuries, tests, prescriptions  

### Method
- **Normalization**: Input is normalized & tokenized  
- **Weighted Matching**: Uses keyword bags (synonyms, plurals, stems)  
- **Fuzzy Tolerance**: Damerau–Levenshtein distance ≤ 1 (handles typos, e.g. *teepy → therapy*)  
- **Unknown Rules**:  
  - Low confidence (`bestScore <= 0.9`)  
  - Ambiguous (`|best - second| < 0.6`)  
  → routes to **Unknown / Clarify screen**  

🔧 Thresholds are configurable in `src/services/aiService.ts`.

---

## ✅ 5. 3-Step Action Plans

Generated using **category-specific templates**.  

- **Format**: Always **3 short steps**, each starting with a verb (*Call, Book, Review, etc.*)  
- **Regenerate**: Cycles through predefined templates  
- **Unknown Plan**: Step 1 asks a clarifying question, Steps 2–3 are generic  

---

## 🧪 6. How to Verify (Manual QA Scenarios)

| Scenario | Input | Expected Flow |
|----------|-------|---------------|
| **Dental** | "Tooth pain since last night" | Dental → Dental cards → 3-step plan |
| **Vision** | "Need new glasses or contacts" | Vision → Vision cards |
| **Mental Health** | "Feeling anxious and not sleeping" | Mental Health → MH cards |
| **OPD** | "Fever and cough, need a doctor" | OPD → OPD cards |
| **Unknown** | "Not feeling well" | Unknown → Clarify → "My teeth hurt" → Dental |

### Theme
- Toggle **Dark/Light mode** → persists after refresh  

### UX
- Click **Regenerate** on Action Plan → steps rotate  

---

## ⚠️ 7. Known Issues / Improvements

- **Limitation**: Keyword approach may misclassify multi-intent sentences  
  - 💡 Improvement: Integrate **LLM API** for semantic classification  
- **Fuzzy Tolerance**: Currently strict (≤ 1)  
  - 💡 Improvement: Increase tolerance (watch for false positives)  
- **Clarify Screen**: Uses free text  
  - 💡 Improvement: Use structured UI (chips, selectors) for better reclassification  

---

## 📜 License

MIT License © 2025
