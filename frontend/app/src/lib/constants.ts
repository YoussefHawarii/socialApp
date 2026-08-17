export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export const STORAGE_KEYS = {
  accessToken: 'access_token',
  refreshToken: 'refresh_token',
} as const;

export const roles = {
  superAdmin: 'superAdmin',
  admin: 'admin',
  user: 'user',
} as const;

export type Role = (typeof roles)[keyof typeof roles];
