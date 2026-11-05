export type TabType = 'overview' | 'balance' | 'tasks' | 'journal' | 'coach';

export interface BalanceScores {
  work: number;
  health: number;
  focus: number;
  mind: number;
  creativity: number;
  rest: number;
}

export interface TaskItem {
  id: string;
  title: string;
  category: string;
  energy: 'High' | 'Medium' | 'Low';
  durationMinutes: number;
  completed: boolean;
  createdAt: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  energyLevel: number;
  mood: string;
  reflection: string;
  aiFeedback?: string;
}

export interface EquilibriumAnalysis {
  overallScore: number;
  equilibriumStatus: string;
  keyInsight: string;
  recommendations: string[];
  aiCoachNote: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
