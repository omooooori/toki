export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

export const GRAPHQL_ENDPOINT = `${API_BASE_URL}/graphql`;

export const API_TIMEOUT = 10000; // 10秒

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const API_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
} as const; 