export type Category = 'Dental' | 'OPD' | 'Vision' | 'Mental Health' | 'Unknown'
export interface Benefit { id: string; category: Category; title: string; coverage: string; description: string }
