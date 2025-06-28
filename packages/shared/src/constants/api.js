"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.API_HEADERS = exports.HTTP_STATUS = exports.API_TIMEOUT = exports.GRAPHQL_ENDPOINT = exports.API_BASE_URL = void 0;
exports.API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
exports.GRAPHQL_ENDPOINT = `${exports.API_BASE_URL}/graphql`;
exports.API_TIMEOUT = 10000; // 10秒
exports.HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
};
exports.API_HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
};
//# sourceMappingURL=api.js.map