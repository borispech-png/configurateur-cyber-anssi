// Fix: Replaced incorrect component logic with the correct type definitions. This file should only contain type exports.
export interface ClientInfo {
  name: string;
  type: string;
  size: string;
  sector: string;
  contact: string;
  phone: string;
}

export interface Answers {
  [questionId: string]: number;
}

export interface Question {
  id: string;
  text: string;
  help: string;
  options: string[];
  weight: number;
}

export interface Domain {
  title: string;
  icon: string;
  color: string;
  description: string;
  questions: Question[];
}

export interface Recommendation {
  domain: string;
  domainIcon: string;
  question: string;
  level: 'critique' | 'important';
  priority: number;
  currentState: string;
  targetState: string;
  questionId: string;
}

export interface BudgetItem {
    name: string;
    phase: number;
    cost: number;
    description: string;
    anssiCertified?: boolean;
}

export interface BudgetItems {
    [questionId: string]: BudgetItem;
}

export interface BudgetPhase {
  name: string;
  period: string;
  description: string;
  items: BudgetItem[];
  total: number;
  priority: 'Critique' | 'Important' | 'Recommandé';
}

export interface Benchmark {
    avgMaturity: number;
    topRisks: string[];
    description: string;
}

export interface Benchmarks {
    [sector: string]: Benchmark;
}

export interface AnssiSolution {
  name: string;
  provider: string;
  description?: string;
}

export interface AnssiSolutionCategory {
  domain: string;
  icon: string;
  description: string;
  solutions: AnssiSolution[];
}

export type Theme = 'light' | 'dark';