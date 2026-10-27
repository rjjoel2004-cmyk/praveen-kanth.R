import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Crown, Volume2, VolumeX, Globe, User, LogOut, Shield, PlusCircle, Gamepad2 } from 'lucide-react';

interface NavbarProps {
  currentView: 'home' | 'create' | 'explore' | 'admin' | 'player_join' | 'host_live' | 'player_live';
  onNavigate: (view: 'home' | 'create' | 'explore' | 'admin' | 'player_join') => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onOpenAuth }) => {
  const { language, setLanguage, t, user, logout, isMuted, toggleMute } = useApp();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#252525] bg-[#0B0B0B]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => onNavigate('home')}
          className="group flex items-center gap-2.5 text-left transition-transform active:scale-95"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-gradient shadow-md shadow-[#D4AF37]/20">
            <Crown className="h-5 w-5 text-black" />
          </div>
          <span className="font-display text-xl font-black tracking-tight text-white group-hover:text-[#D4AF37] transition-colors whitespace-nowrap shrink-0">
            {t.brandName}
          </span>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => onNavigate('home')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-[#D4AF37] ${
              currentView === 'home' ? 'text-[#D4AF37] font-semibold' : ''
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate('explore')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-[#D4AF37] ${
              currentView === 'explore' ? 'text-[#D4AF37] font-semibold' : ''
            }`}
          >
            {t.exploreQuizzes}
          </button>
          <button
            onClick={() => onNavigate('create')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-[#D4AF37] ${
              currentView === 'create' ? 'text-[#D4AF37] font-semibold' : ''
            }`}
          >
            {t.createQuiz}
          </button>
          {user?.role === 'admin' && (
            <button
              onClick={() => onNavigate('admin')}
              className={`whitespace-nowrap shrink-0 transition-colors hover:text-[#D4AF37] ${
                currentView === 'admin' ? 'text-[#D4AF37] font-semibold' : ''
              }`}
            >
              {t.adminDashboard}
            </button>
          )}
        </nav>

        {/* Zone 3: Controls & Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
            className="flex items-center gap-1.5 rounded-lg border border-[#333333] bg-[#141414] px-2.5 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:border-[#D4AF37] hover:text-[#D4AF37]"
            title="Switch Language / மொழியை மாற்றுக"
          >
            <Globe className="h-3.5 w-3.5 text-[#D4AF37]" />
            <span className="whitespace-nowrap">{language === 'en' ? 'தமிழ்' : 'English'}</span>
          </button>

          {/* Audio Mute/Unmute */}
          <button
            onClick={toggleMute}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#333333] bg-[#141414] text-slate-300 transition-colors hover:border-[#D4AF37] hover:text-[#D4AF37]"
            title={isMuted ? t.soundOff : t.soundOn}
            aria-label="Toggle Sound"
          >
            {isMuted ? <VolumeX className="h-4 w-4 text-red-400" /> : <Volume2 className="h-4 w-4 text-[#D4AF37]" />}
          </button>

          {/* User Account / Profile */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 rounded-lg border border-[#333333] bg-[#141414] px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:border-[#D4AF37]"
              >
                <span className="text-sm">{user.avatar}</span>
                <span className="hidden sm:inline max-w-[100px] truncate">{user.name}</span>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-[#333333] bg-[#141414] p-1.5 shadow-xl shadow-black/80 z-50">
                  <div className="px-3 py-2 border-b border-[#252525]">
                    <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    <span className="inline-block mt-1 text-[10px] text-[#D4AF37] uppercase tracking-wider font-bold">
                      {user.role}
                    </span>
                  </div>
                  {user.role === 'admin' && (
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onNavigate('admin');
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-300 hover:bg-[#202020] hover:text-white"
                    >
                      <Shield className="h-3.5 w-3.5 text-[#D4AF37]" />
                      <span>{t.adminDashboard}</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onNavigate('create');
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-300 hover:bg-[#202020] hover:text-white"
                  >
                    <PlusCircle className="h-3.5 w-3.5 text-[#D4AF37]" />
                    <span>{t.createNewQuiz}</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>{t.logout}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 rounded-lg border border-[#333333] bg-[#141414] px-3 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:border-[#D4AF37] hover:text-[#D4AF37]"
            >
              <User className="h-3.5 w-3.5" />
              <span>{t.login}</span>
            </button>
          )}

          {/* Primary Action Button: Join Live Quiz */}
          <button
            onClick={() => onNavigate('player_join')}
            className="flex items-center gap-1.5 rounded-lg bg-gold-gradient px-4 py-2 text-xs font-bold text-black transition-all hover:brightness-110 active:scale-95 shadow-md shadow-[#D4AF37]/20 whitespace-nowrap shrink-0"
          >
            <Gamepad2 className="h-4 w-4" />
            <span>{t.joinLiveQuiz}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
