import { useState } from 'react';

import { authApi } from '@/api';
import type { ApiUser } from '@/api/types';
import { parseApiError, type AppError } from '@/lib/errors';

import type { LoginFormData } from '../schemas/auth.schema';

import { useAuth } from '@/context/auth-context';

interface UseLoginReturn {
  login: (data: LoginFormData) => Promise<ApiUser | null>;
  isLoading: boolean;
  error: AppError | null;
  clearError: () => void;
}

export function useLogin(): UseLoginReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const { setIsAuthenticated } = useAuth();

  const login = async (data: LoginFormData): Promise<ApiUser | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const user = await authApi.login({
        username: data.username,
        password: data.password,
      });
      setIsAuthenticated(true);
      return user;
    } catch (err) {
      const parsed = parseApiError(err);
      setError(parsed);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return { login, isLoading, error, clearError };
}
