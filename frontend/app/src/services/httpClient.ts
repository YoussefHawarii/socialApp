import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '@/lib/constants';
import { authStore } from '@/store/auth.store';

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

httpClient.interceptors.request.use((config) => {
  const { accessToken } = authStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

interface RetriableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Serializes concurrent 401s onto a single in-flight refresh call so we don't
// fire the refresh endpoint once per failed request.
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const { refreshToken } = authStore.getState();
  if (!refreshToken) return null;

  if (!refreshPromise) {
    refreshPromise = axios
      .get<{ success: boolean; access_token: string }>(`${API_BASE_URL}/auth/refresh_token`, {
        data: { refresh_token: refreshToken },
      })
      .then((res) => {
        const { access_token } = res.data;
        authStore.getState().setTokens(access_token);
        return access_token;
      })
      .catch(() => {
        authStore.getState().clearTokens();
        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableConfig | undefined;
    const isRefreshCall = originalRequest?.url?.includes('/auth/refresh_token');

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !isRefreshCall) {
      originalRequest._retry = true;
      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return httpClient(originalRequest);
      }
    }

    return Promise.reject(error);
  },
);
