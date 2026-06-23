import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAccessToken, setTokens, clearTokens } from '@/lib/storage/token-storage';
import { clearBookmarks } from '@/lib/storage/bookmark-storage';
import { authApi } from '@/api';
import type { ApiUser } from '@/api/types';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: ApiUser | null;
  login: (accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  updateUser: (user: ApiUser) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<ApiUser | null>(null);

  const fetchUser = async () => {
    try {
      const userData = await authApi.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch current user details:', error);
    }
  };

  useEffect(() => {
    async function checkAuth() {
      try {
        const token = await getAccessToken();
        const authed = !!token;
        setIsAuthenticated(authed);
        if (authed) {
          await fetchUser();
        }
      } catch (error) {
        console.error('Failed to check auth status:', error);
      } finally {
        setIsLoading(false);
      }
    }
    checkAuth();
  }, []);
  
  useEffect(() => {
    if (isAuthenticated && !user) {
      fetchUser();
    } else if (!isAuthenticated) {
      setUser(null);
    }
  }, [isAuthenticated]);

  const login = async (accessToken: string, refreshToken: string) => {
    await setTokens(accessToken, refreshToken);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      console.warn('Logout API call failed, clearing tokens locally anyway:', e);
    } finally {
      await clearTokens();
      await clearBookmarks();
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const updateUser = (newUser: ApiUser) => {
    setUser(newUser);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        login,
        logout,
        setIsAuthenticated,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
