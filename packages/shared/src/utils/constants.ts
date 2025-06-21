export const APP_NAME = 'Toki';
export const APP_VERSION = '1.0.0';

export const DEFAULT_PAGINATION_LIMIT = 20;
export const MAX_PAGINATION_LIMIT = 100;

export const SENTIMENT_LABELS = {
  POSITIVE: 'ポジティブ',
  NEUTRAL: 'ニュートラル',
  NEGATIVE: 'ネガティブ',
} as const;

export const API_ENDPOINTS = {
  GRAPHQL: '/graphql',
  HEALTH: '/health',
} as const;

export const ERROR_CODES = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const; 