import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Lock, Mail, UserCheck, Sparkles, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { t, login, register, user } = useApp();
  const [tab, setTab] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'user' | 'creator' | 'admin'>('user');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (tab === 'login') {
        const res = await login(email, password);
        if (res.success) {
          onClose();
        } else {
          setError(res.error || 'Failed to login');
        }
      } else if (tab === 'register') {
        const res = await register(name, email, password, role);
        if (res.success) {
          onClose();
        } else {
          setError(res.error || 'Failed to register');
        }
      } else if (tab === 'forgot') {
        setSuccessMsg('Password reset instructions sent to ' + email);
      }
    } finally {
      setLoading(false);
    }
  };

  const fillQuickDemo = (demoRole: 'admin' | 'creator') => {
    if (demoRole === 'admin') {
      setEmail('admin@quizmaster.com');
      setPassword('admin123');
    } else {
      setEmail('creator@quizmaster.com');
      setPassword('creator123');
    }
    setTab('login');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-[#333] bg-[#141414] p-6 shadow-2xl shadow-black">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-gold-gradient text-black">
            <Lock className="h-6 w-6" />
          </div>
          <h2 className="font-display text-xl font-bold text-white">
            {tab === 'login' ? t.login : tab === 'register' ? t.register : 'Reset Password'}
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            {tab === 'login'
              ? 'Access host privileges, saved quizzes, and history'
              : 'Join QUIZ MASTER to create unlimited live competitions'}
          </p>
        </div>

        {/* Quick Demo Credentials Fillers */}
        {tab === 'login' && (
          <div className="mb-4 rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-3 text-xs">
            <p className="font-semibold text-slate-300 flex items-center gap-1.5 mb-2">
              <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" /> Quick 1-Click Demo Login:
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fillQuickDemo('admin')}
                className="flex-1 rounded-lg border border-[#3a3a3a] bg-[#222] py-1.5 text-slate-200 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors"
              >
                👑 Admin Demo
              </button>
              <button
                type="button"
                onClick={() => fillQuickDemo('creator')}
                className="flex-1 rounded-lg border border-[#3a3a3a] bg-[#222] py-1.5 text-slate-200 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors"
              >
                🎓 Creator Demo
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300">
            {successMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'register' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Anandha Kumar"
                className="w-full rounded-lg border border-[#333] bg-[#0E0E0E] px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full rounded-lg border border-[#333] bg-[#0E0E0E] px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-[#D4AF37] focus:outline-none"
              />
              <Mail className="absolute right-3 top-2.5 h-4 w-4 text-slate-500 pointer-events-none" />
            </div>
          </div>

          {tab !== 'forgot' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-[#333] bg-[#0E0E0E] px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          )}

          {tab === 'register' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Account Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'user' | 'creator' | 'admin')}
                className="w-full rounded-lg border border-[#333] bg-[#0E0E0E] px-3 py-2 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
              >
                <option value="user">Competitor / Player</option>
                <option value="creator">Quiz Creator / Educator</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gold-gradient py-2.5 text-xs font-bold text-black transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
          >
            {loading ? t.loading : tab === 'login' ? t.login : tab === 'register' ? t.register : 'Send Reset Link'}
          </button>
        </form>

        {/* Tab Toggle Links */}
        <div className="mt-5 border-t border-[#252525] pt-4 text-center text-xs text-slate-400">
          {tab === 'login' ? (
            <p>
              Dont have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setTab('register');
                  setError(null);
                }}
                className="font-semibold text-[#D4AF37] hover:underline"
              >
                Register now
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => {
                  setTab('login');
                  setError(null);
                }}
                className="font-semibold text-[#D4AF37] hover:underline"
              >
                Sign in here
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
