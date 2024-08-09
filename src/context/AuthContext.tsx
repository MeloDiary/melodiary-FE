// AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (accessToken: string, userId: number) => void;
  logout: () => void;
  userId: number | null;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('userId');

    if (accessToken && userId) {
      setIsAuthenticated(true);
      setUserId(Number(userId));
    }
  }, []);

  const login = (accessToken: string, userId: number) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('userId', userId.toString());
    setIsAuthenticated(true);
    setUserId(userId);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId');
    setIsAuthenticated(false);
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, userId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// 추가: loader 함수 정의 및 내보내기
export const tokenLoader = async () => {
  const accessToken = localStorage.getItem('accessToken');
  const userId = localStorage.getItem('userId');

  if (accessToken && userId) {
    return {
      isAuthenticated: true,
      userId: Number(userId),
    };
  } else {
    return {
      isAuthenticated: false,
      userId: null,
    };
  }
};
