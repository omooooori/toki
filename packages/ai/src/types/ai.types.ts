import { Location, Photo } from '@toki/shared';

export interface DiaryGenerationInput {
  location?: Location;
  photos?: Photo[];
  calendarEvents?: CalendarEvent[];
  userMood?: string;
  timestamp: Date;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
}

export interface DiaryGenerationResult {
  content: string;
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  topics: string[];
  summary: string;
  suggestions: string[];
}

export interface AIAnalysisResult {
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  topics: string[];
  summary: string;
  suggestions: string[];
  keywords: string[];
}

export interface AIServiceConfig {
  apiKey: string;
  model: string;
  maxTokens?: number;
  temperature?: number;
} 