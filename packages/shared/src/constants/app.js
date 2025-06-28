"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STORAGE_KEYS = exports.UI_CONFIG = exports.FEATURES = exports.APP_CONFIG = void 0;
exports.APP_CONFIG = {
    name: 'Toki',
    version: '1.0.0',
    description: 'AI日記アプリ',
};
exports.FEATURES = {
    AI_ANALYSIS: true,
    LOCATION_TRACKING: true,
    PHOTO_INTEGRATION: true,
    CALENDAR_INTEGRATION: true,
};
exports.UI_CONFIG = {
    MAX_DIARY_LENGTH: 10000,
    MIN_DIARY_LENGTH: 10,
    MAX_PHOTOS_PER_DIARY: 10,
    AUTO_SAVE_INTERVAL: 30000, // 30秒
};
exports.STORAGE_KEYS = {
    AUTH_TOKEN: 'toki_auth_token',
    USER_PREFERENCES: 'toki_user_preferences',
    THEME: 'toki_theme',
};
//# sourceMappingURL=app.js.map