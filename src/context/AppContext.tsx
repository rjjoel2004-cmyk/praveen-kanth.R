import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language, Translations } from '../utils/i18n';
import { User } from '../types/quiz';
import { sounds } from '../utils/soundEffects';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  user: User | null;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, pass: string, role?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isMuted: boolean;
  toggleMute: () => boolean;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('quizmaster_lang') as Language;
      if (saved === 'en' || saved === 'ta') return saved;
    }
    return 'en';
  });

  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('quizmaster_user');
      if (savedUser) {
        try {
          return JSON.parse(savedUser);
        } catch {}
      }
    }
    // Default logged-in guest user for seamless instant creation & play!
    return {
      id: 'admin-1',
      email: 'admin@quizmaster.com',
      name: 'System Admin',
      role: 'admin',
      avatar: '👑',
      createdAt: '2026-01-01T00:00:00Z',
    };
  });

  const [isMuted, setIsMuted] = useState<boolean>(() => sounds.getMuted());

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('quizmaster_lang', lang);
    }
    sounds.playClick();
  };

  const toggleMute = () => {
    const next = sounds.toggleMute();
    setIsMuted(next);
    return next;
  };

  const login = async (email: string, pass: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed' };
      }
      setUser(data.user);
      localStorage.setItem('quizmaster_user', JSON.stringify(data.user));
      sounds.playClick();
      return { success: true };
    } catch {
      return { success: false, error: 'Network error or server unreachable' };
    }
  };

  const register = async (name: string, email: string, pass: string, role?: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password: pass, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Registration failed' };
      }
      setUser(data.user);
      localStorage.setItem('quizmaster_user', JSON.stringify(data.user));
      sounds.playClick();
      return { success: true };
    } catch {
      return { success: false, error: 'Network error or server unreachable' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('quizmaster_user');
    sounds.playClick();
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t: translations[language],
        user,
        login,
        register,
        logout,
        isMuted,
        toggleMute,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
