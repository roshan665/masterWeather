import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, UserRole, Permission, AuthCredentials, AuthContextType } from '../types';
import { DEMO_USERS, getDemoUserByRole, getDemoUserByUsername, getDemoUserById } from '../data/mockUsers';

const AUTH_STORAGE_KEY = 'panchayatmausam_auth_session_v1';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.user) return parsed.user;
      }
    } catch {
      // ignore
    }
    // Default logged in as demo farmer
    return DEMO_USERS[0];
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(
          AUTH_STORAGE_KEY,
          JSON.stringify({
            user,
            token: user.token,
            savedAt: new Date().toISOString(),
          })
        );
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch {
      // ignore
    }
  }, [user]);

  const login = async (credentials: AuthCredentials): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 400)); // Simulate FastAPI network roundtrip

    const foundUser = getDemoUserByUsername(credentials.username);
    if (!foundUser) {
      setIsLoading(false);
      return {
        success: false,
        error: `User "${credentials.username}" not found. Try demo usernames: farmer, officer, admin, researcher`,
      };
    }

    // In demo mode, accept any password or 'demo123'
    const updatedUser = {
      ...foundUser,
      lastLoginAt: new Date().toISOString(),
      token: `mock_jwt_${foundUser.role}_${Date.now()}`,
    };

    setUser(updatedUser);
    setIsLoading(false);
    return { success: true };
  };

  const loginAsDemoUser = (role: UserRole) => {
    const demoUser = getDemoUserByRole(role);
    const updatedUser = {
      ...demoUser,
      lastLoginAt: new Date().toISOString(),
      token: `mock_jwt_${role}_${Date.now()}`,
    };
    setUser(updatedUser);
  };

  const switchDemoUser = (userId: string) => {
    const targetUser = getDemoUserById(userId);
    if (targetUser) {
      setUser({
        ...targetUser,
        lastLoginAt: new Date().toISOString(),
      });
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    if (user.role === 'admin') return true; // Admins have all permissions
    return user.permissions.includes(permission);
  };

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    return user.role === roles;
  };

  const role: UserRole = user?.role || 'farmer';
  const token: string | null = user?.token || null;
  const isAuthenticated = Boolean(user && user.token);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        token,
        isAuthenticated,
        isLoading,
        login,
        loginAsDemoUser,
        logout,
        hasPermission,
        hasRole,
        switchDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
