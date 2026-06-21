import { apiClient } from './client';
import type {
  ApiResponse,
  ApiUser,
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
} from './types';

import { clearTokens, setTokens } from '@/lib/storage/token-storage';

// Register: returns only user data (no tokens). User must login after.
export async function register(payload: RegisterPayload): Promise<ApiUser> {
  const { data } = await apiClient.post<ApiResponse<RegisterResponse>>(
    '/api/v1/users/register',
    payload,
  );

  return data.data.user;
}

// Login: returns user + tokens. We save tokens to SecureStore.
export async function login(payload: LoginPayload): Promise<ApiUser> {
  const { data } = await apiClient.post<ApiResponse<LoginResponse>>(
    '/api/v1/users/login',
    payload,
  );

  await setTokens(data.data.accessToken, data.data.refreshToken);
  return data.data.user;
}

// Get Current User
export async function getCurrentUser(): Promise<ApiUser> {
  const { data } = await apiClient.get<ApiResponse<ApiUser>>(
    '/api/v1/users/current-user',
  );

  return data.data;
}

// Update Avatar
export async function updateAvatar(
  imageUri: string,
  mimeType: string,
  fileName: string,
): Promise<ApiUser> {
  const formData = new FormData();
  formData.append('avatar', {
    uri: imageUri,
    name: fileName || 'avatar.jpg',
    type: mimeType || 'image/jpeg',
  } as any);

  const { data } = await apiClient.patch<ApiResponse<ApiUser>>(
    '/api/v1/users/avatar',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  return data.data;
}

// Logout
export async function logout(): Promise<void> {
  try {
    await apiClient.post('/api/v1/users/logout');
  } finally {
    await clearTokens();
  }
}
