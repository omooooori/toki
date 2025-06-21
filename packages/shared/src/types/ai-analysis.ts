export enum Sentiment {
  POSITIVE = 'POSITIVE',
  NEUTRAL = 'NEUTRAL',
  NEGATIVE = 'NEGATIVE'
}

export interface AIAnalysis {
  id: string;
  diaryId: string;
  sentiment: Sentiment;
  topics: string[];
  summary?: string;
  suggestions: string[];
  createdAt: Date;
}

export interface CreateAIAnalysisInput {
  diaryId: string;
  content: string;
} 