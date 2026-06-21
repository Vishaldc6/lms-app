// Axios API client with interceptors for auth token management.
import axios from 'axios';

import { API_BASE_URL, API_TIMEOUT } from '@/lib/constants';
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from '@/lib/storage/token-storage';

import type { ApiResponse, RefreshTokenResponse } from './types';

// Create Axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptors
// Before every request, grab the access token and attach it to the header.
apiClient.interceptors.request.use(async (config) => {
  const token = await getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response Interceptor
// If a request fails with 401, try refreshing the token and retry once.
// If refresh also fails, clear tokens (force logout).
apiClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._hasRetried) {
      originalRequest._hasRetried = true;

      try {
        const refreshToken = await getRefreshToken();

        if (!refreshToken) {
          await clearTokens();
          return Promise.reject(error);
        }

        const { data } = await axios.post<ApiResponse<RefreshTokenResponse>>(
          `${API_BASE_URL}/api/v1/users/refresh-token`,
          { refreshToken },
        );

        await setTokens(data.data.accessToken, data.data.refreshToken);

        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return apiClient(originalRequest);
      } catch {
        // Refresh failed — both tokens are expired, force logout
        await clearTokens();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);
