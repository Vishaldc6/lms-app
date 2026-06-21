import { useState } from 'react';

import { authApi } from '@/api';
import { parseApiError, type AppError } from '@/lib/errors';

import type { RegisterFormData } from '../schemas/auth.schema';

interface UseRegisterReturn {
  register: (data: RegisterFormData) => Promise<boolean>;
  isLoading: boolean;
  error: AppError | null;
  clearError: () => void;
}

export function useRegister(): UseRegisterReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(null);

  const register = async (data: RegisterFormData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await authApi.register({
        username: data.username,
        email: data.email,
        password: data.password,
      });
      return true;
    } catch (err) {
      const parsed = parseApiError(err);
      setError(parsed);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return { register, isLoading, error, clearError };
}
