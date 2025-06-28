"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_CODES = exports.API_ENDPOINTS = exports.SENTIMENT_LABELS = exports.MAX_PAGINATION_LIMIT = exports.DEFAULT_PAGINATION_LIMIT = exports.APP_VERSION = exports.APP_NAME = void 0;
exports.APP_NAME = 'Toki';
exports.APP_VERSION = '1.0.0';
exports.DEFAULT_PAGINATION_LIMIT = 20;
exports.MAX_PAGINATION_LIMIT = 100;
exports.SENTIMENT_LABELS = {
    POSITIVE: 'ポジティブ',
    NEUTRAL: 'ニュートラル',
    NEGATIVE: 'ネガティブ',
};
exports.API_ENDPOINTS = {
    GRAPHQL: '/graphql',
    HEALTH: '/health',
};
exports.ERROR_CODES = {
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    NOT_FOUND: 'NOT_FOUND',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    INTERNAL_ERROR: 'INTERNAL_ERROR',
};
//# sourceMappingURL=constants.js.map