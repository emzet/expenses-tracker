export const AUTH_ENDPOINTS_PREFIX = 'user' as const;

export const AUTH_ENDPOINTS = {
  LOGIN: 'signin',
  LOGOUT: 'logout',
  REGISTER: 'signup',
  REFRESH: 'refresh'
} as const;
