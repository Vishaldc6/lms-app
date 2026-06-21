import axios, { type AxiosError } from 'axios';

import type { ApiResponse } from '@/api/types';

// Error type narrowing
export interface AppError {
  code:
    | 'NETWORK_ERROR'
    | 'TIMEOUT'
    | 'UNAUTHORIZED'
    | 'FORBIDDEN'
    | 'NOT_FOUND'
    | 'CONFLICT'
    | 'VALIDATION'
    | 'RATE_LIMITED'
    | 'SERVER_ERROR'
    | 'UNKNOWN';
  message: string;
  status?: number;
}

export function parseApiError(error: unknown): AppError {
  if (axios.isAxiosError(error)) {
    return parseAxiosError(error);
  }

  if (error instanceof Error) {
    return { code: 'UNKNOWN', message: error.message };
  }

  return { code: 'UNKNOWN', message: 'An unexpected error occurred.' };
}

function parseAxiosError(error: AxiosError<ApiResponse<unknown>>): AppError {
  if (!error.response) {
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return {
        code: 'TIMEOUT',
        message: 'Request timed out. Please check your connection and try again.',
      };
    }
    return {
      code: 'NETWORK_ERROR',
      message: 'No internet connection. Please check your network settings.',
    };
  }

  const { status, data } = error.response;
  const serverMessage = data?.message;

  switch (status) {
    case 401:
      return {
        code: 'UNAUTHORIZED',
        message: serverMessage ?? 'Invalid credentials. Please try again.',
        status,
      };
    case 403:
      return {
        code: 'FORBIDDEN',
        message: serverMessage ?? 'You do not have permission to perform this action.',
        status,
      };
    case 404:
      return {
        code: 'NOT_FOUND',
        message: serverMessage ?? 'The requested resource was not found.',
        status,
      };
    case 409:
      return {
        code: 'CONFLICT',
        message: serverMessage ?? 'This resource already exists.',
        status,
      };
    case 422:
      return {
        code: 'VALIDATION',
        message: serverMessage ?? 'Please check your input and try again.',
        status,
      };
    case 429:
      return {
        code: 'RATE_LIMITED',
        message: 'Too many requests. Please wait a moment and try again.',
        status,
      };
    default:
      if (status >= 500) {
        return {
          code: 'SERVER_ERROR',
          message: serverMessage ?? 'Something went wrong on our end. Please try again later.',
          status,
        };
      }
      return {
        code: 'UNKNOWN',
        message: serverMessage ?? 'An unexpected error occurred.',
        status,
      };
  }
}
