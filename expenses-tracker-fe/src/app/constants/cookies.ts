import type { Duration } from 'date-fns';



export const COOKIE_KEYS = {
  LANGUAGE: 'language',
} as const;

export const COOKIE_EXPIRATION: Duration = {
  days: 30
};
