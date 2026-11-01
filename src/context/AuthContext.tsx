import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserNotification } from '../types';
import { 
  apiGetMe, 
  apiLogin, 
  apiRegister, 
  apiUpdateProfile, 
  apiChangePassword, 
  apiForgotPassword, 
  apiResetPassword,
  apiGetNotifications,
  apiMarkNotificationsRead
} from '../services/api';

export interface IntendedAction {
  targetTab?: string;
  actionType?: 'buy_course' | 'buy_product' | 'view_course' | 'ai_tool' | 'download';
  payload?: any;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAdmin: boolean;
  notifications: UserNotification[];
  unreadNotificationsCount: number;
  login: (email: string, pass: string, rememberMe?: boolean) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    phone?: string;
    country?: string;
    password: string;
    confirmPassword?: string;
    acceptTerms?: boolean;
  }) => Promise<void>;
  logout: () => void;
  updateProfile: (data: { name?: string; phone?: string; country?: string; avatar?: string }) => Promise<void>;
  changePassword: (oldPass: string, newPass: string, confirmPass?: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string; resetCode?: string }>;
  resetPassword: (email: string, code: string, newPass: string, confirmPass?: string) => Promise<void>;
  markNotificationsAsRead: () => Promise<void>;
  refreshUser: () => Promise<void>;
  intendedAction: IntendedAction | null;
  setIntendedAction: (action: IntendedAction | null) => void;
  requireAuth: (action?: IntendedAction) => boolean;
  isAuthModalOpen: boolean;
  openAuthModal: (initialView?: 'login' | 'register' | 'forgot_password' | 'gateway', action?: IntendedAction) => void;
  closeAuthModal: () => void;
  authModalView: 'login' | 'register' | 'forgot_password' | 'gateway';
  setAuthModalView: (view: 'login' | 'register' | 'forgot_password' | 'gateway') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('lobby_token'));
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  
  // Intended action storage for Auth Guard
  const [intendedAction, setIntendedAction] = useState<IntendedAction | null>(null);
  
  // Auth Modal State (integrated centrally)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<'login' | 'register' | 'forgot_password' | 'gateway'>('gateway');

  const refreshUser = async () => {
    if (!token) {
      setUser(null);
      setNotifications([]);
      return;
    }
    try {
      const u = await apiGetMe();
      if (u) {
        setUser(u);
        setNotifications(u.notifications || []);
      } else {
        logout();
      }
    } catch (err: any) {
      console.error('Erreur refreshUser', err);
      logout();
    }
  };

  useEffect(() => {
    async function initUser() {
      if (token) {
        await refreshUser();
      }
      setLoading(false);
    }
    initUser();
  }, [token]);

  const login = async (email: string, pass: string, rememberMe: boolean = true) => {
    const data = await apiLogin({ email, password: pass });
    if (rememberMe) {
      localStorage.setItem('lobby_token', data.token);
    } else {
      sessionStorage.setItem('lobby_token', data.token);
      localStorage.setItem('lobby_token', data.token);
    }
    setToken(data.token);
    setUser(data.user);
    setNotifications(data.user.notifications || []);
  };

  const register = async (data: {
    name: string;
    email: string;
    phone?: string;
    country?: string;
    password: string;
    confirmPassword?: string;
    acceptTerms?: boolean;
  }) => {
    const res = await apiRegister(data);
    localStorage.setItem('lobby_token', res.token);
    setToken(res.token);
    setUser(res.user);
    setNotifications(res.user.notifications || []);
  };

  const logout = () => {
    localStorage.removeItem('lobby_token');
    sessionStorage.removeItem('lobby_token');
    setToken(null);
    setUser(null);
    setNotifications([]);
    setIntendedAction(null);
  };

  const updateProfile = async (data: { name?: string; phone?: string; country?: string; avatar?: string }) => {
    const res = await apiUpdateProfile(data);
    setUser(res.user);
  };

  const changePassword = async (oldPass: string, newPass: string, confirmPass?: string) => {
    await apiChangePassword({ oldPassword: oldPass, newPassword: newPass, confirmPassword: confirmPass });
  };

  const forgotPassword = async (email: string) => {
    return await apiForgotPassword(email);
  };

  const resetPassword = async (email: string, code: string, newPass: string, confirmPass?: string) => {
    await apiResetPassword({ email, resetCode: code, newPassword: newPass, confirmPassword: confirmPass });
  };

  const markNotificationsAsRead = async () => {
    await apiMarkNotificationsRead();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const openAuthModal = (view: 'login' | 'register' | 'forgot_password' | 'gateway' = 'gateway', action?: IntendedAction) => {
    if (action) {
      setIntendedAction(action);
    }
    setAuthModalView(view);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // Auth Guard helper: returns true if authenticated, or opens modal with intent and returns false
  const requireAuth = (action?: IntendedAction): boolean => {
    if (user && user.status !== 'suspended') {
      return true;
    }
    openAuthModal('gateway', action);
    return false;
  };

  const isAdmin = user?.role === 'admin';
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAdmin,
        notifications,
        unreadNotificationsCount,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        forgotPassword,
        resetPassword,
        markNotificationsAsRead,
        refreshUser,
        intendedAction,
        setIntendedAction,
        requireAuth,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        authModalView,
        setAuthModalView,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
