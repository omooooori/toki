export const APP_CONFIG = {
  name: 'Toki',
  version: '1.0.0',
  description: 'AI日記アプリ',
} as const;

export const FEATURES = {
  AI_ANALYSIS: true,
  LOCATION_TRACKING: true,
  PHOTO_INTEGRATION: true,
  CALENDAR_INTEGRATION: true,
} as const;

export const UI_CONFIG = {
  MAX_DIARY_LENGTH: 10000,
  MIN_DIARY_LENGTH: 10,
  MAX_PHOTOS_PER_DIARY: 10,
  AUTO_SAVE_INTERVAL: 30000, // 30秒
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'toki_auth_token',
  USER_PREFERENCES: 'toki_user_preferences',
  THEME: 'toki_theme',
} as const; 