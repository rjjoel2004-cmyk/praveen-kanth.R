import React, { useState, useEffect } from 'react';
import { Quiz } from '../types/quiz';
import { useApp } from '../context/AppContext';
import { sounds } from '../utils/soundEffects';
import {
  Play,
  Gamepad2,
  PlusCircle,
  Users,
  Trophy,
  Zap,
  Shield,
  Sparkles,
  BookOpen,
  ArrowRight,
  Clock,
  CheckCircle2,
  Check
} from 'lucide-react';

interface HomeViewProps {
  onJoinPin: (pin: string) => void;
  onHostQuiz: (quizId: string) => void;
  onCreateQuiz: () => void;
  onExplore: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onJoinPin,
  onHostQuiz,
  onCreateQuiz,
  onExplore,
}) => {
  const { language, t } = useApp();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [pinInput, setPinInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/quizzes')
      .then((res) => res.json())
      .then((data) => setQuizzes(data))
      .catch((err) => console.error('Error loading quizzes:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleQuickJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim()) {
      sounds.playClick();
      onJoinPin(pinInput.trim());
    }
  };

  const filteredQuizzes = quizzes.filter((q) => {
    if (selectedCategory === 'all') return true;
    return q.category === selectedCategory;
  });

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-slate-100 font-sans">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden border-b border-[#1f1f1f] bg-gradient-to-b from-[#141414] via-[#0B0B0B] to-[#0B0B0B] py-16 sm:py-24">
        {/* Subtle Gold Ambient Radial Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#D4AF37]/10 blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Subtle Golden Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-4 py-1.5 text-xs font-semibold text-[#D4AF37] mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AhaSlides-Style Live Multiplayer Quiz Arena · 50 Players Capacity</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-tight">
            <span className="text-gold-gradient block">{t.heroHeadline}</span>
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed">
            {t.heroSubtitle}
          </p>

          {/* Dual Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onCreateQuiz}
              className="flex items-center gap-2 rounded-xl bg-gold-gradient px-8 py-3.5 text-sm font-bold text-black transition-all hover:brightness-110 active:scale-95 shadow-xl shadow-[#D4AF37]/25 w-full sm:w-auto justify-center"
            >
              <PlusCircle className="h-4 w-4" />
              <span>{t.createQuiz}</span>
            </button>

            <button
              onClick={() => onJoinPin('')}
              className="flex items-center gap-2 rounded-xl border border-[#333] bg-[#141414] px-8 py-3.5 text-sm font-bold text-white transition-all hover:border-[#D4AF37] hover:text-[#D4AF37] active:scale-95 w-full sm:w-auto justify-center"
            >
              <Gamepad2 className="h-4 w-4 text-[#D4AF37]" />
              <span>{t.joinLiveQuiz}</span>
            </button>
          </div>

          {/* Quick PIN Entry Bar */}
          <div className="mt-10 max-w-md mx-auto rounded-2xl border border-[#2a2a2a] bg-[#161616]/90 p-2 shadow-2xl backdrop-blur-md">
            <form onSubmit={handleQuickJoin} className="flex items-center gap-2">
              <input
                type="text"
                maxLength={6}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                placeholder={t.enterGamePin}
                className="flex-1 rounded-xl bg-[#0E0E0E] px-4 py-2.5 text-center font-mono text-lg font-black tracking-widest text-[#D4AF37] placeholder-slate-600 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!pinInput.trim()}
                className="rounded-xl bg-gold-gradient px-5 py-2.5 text-xs font-bold text-black transition-all hover:brightness-110 active:scale-95 disabled:opacity-40"
              >
                Join
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 2. EXPLORE FEATURED QUIZZES SHOWCASE */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#222] pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
              Instant Live Competitions
            </span>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl font-black text-white">
              {t.exploreQuizzes}
            </h2>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`rounded-lg px-3 py-1.5 transition-colors whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-gold-gradient text-black font-bold'
                  : 'bg-[#161616] text-slate-400 hover:text-white'
              }`}
            >
              All Categories
            </button>
            <button
              onClick={() => setSelectedCategory('generalKnowledge')}
              className={`rounded-lg px-3 py-1.5 transition-colors whitespace-nowrap ${
                selectedCategory === 'generalKnowledge'
                  ? 'bg-gold-gradient text-black font-bold'
                  : 'bg-[#161616] text-slate-400 hover:text-white'
              }`}
            >
              {t.generalKnowledge}
            </button>
            <button
              onClick={() => setSelectedCategory('bibleQuiz')}
              className={`rounded-lg px-3 py-1.5 transition-colors whitespace-nowrap ${
                selectedCategory === 'bibleQuiz'
                  ? 'bg-gold-gradient text-black font-bold'
                  : 'bg-[#161616] text-slate-400 hover:text-white'
              }`}
            >
              {t.bibleQuiz}
            </button>
            <button
              onClick={() => setSelectedCategory('scienceTech')}
              className={`rounded-lg px-3 py-1.5 transition-colors whitespace-nowrap ${
                selectedCategory === 'scienceTech'
                  ? 'bg-gold-gradient text-black font-bold'
                  : 'bg-[#161616] text-slate-400 hover:text-white'
              }`}
            >
              {t.scienceTech}
            </button>
          </div>
        </div>

        {/* Quizzes Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[#242424] bg-[#141414] transition-all hover:border-[#D4AF37]/50 hover:shadow-xl hover:shadow-[#D4AF37]/10"
            >
              <div>
                {/* Cover Image */}
                <div className="relative h-44 w-full overflow-hidden bg-[#1c1c1c]">
                  <img
                    src={quiz.coverImage || '/src/assets/images/quiz_stage_arena_1793097861150.jpg'}
                    alt={quiz.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <span className="rounded-md bg-black/70 px-2 py-0.5 text-[11px] font-semibold text-[#D4AF37] backdrop-blur-sm">
                      {quiz.questions.length} Questions
                    </span>
                    <span className="rounded-md bg-black/70 px-2 py-0.5 text-[11px] font-semibold text-slate-300 backdrop-blur-sm capitalize">
                      {quiz.category}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-display text-lg font-bold text-white group-hover:text-[#D4AF37] transition-colors leading-snug">
                    {language === 'ta' && quiz.titleTa ? quiz.titleTa : quiz.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-400 line-clamp-2">
                    {language === 'ta' && quiz.descriptionTa ? quiz.descriptionTa : quiz.description}
                  </p>
                </div>
              </div>

              {/* Card Footer / Host Button */}
              <div className="flex items-center justify-between border-t border-[#222] p-4 bg-[#111]">
                <div className="text-[11px] text-slate-400">
                  <span>By {quiz.authorName}</span>
                </div>

                <button
                  onClick={() => onHostQuiz(quiz.id)}
                  className="flex items-center gap-1.5 rounded-xl bg-gold-gradient px-4 py-2 text-xs font-bold text-black transition-all hover:brightness-110 active:scale-95 shadow-md shadow-[#D4AF37]/20"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>{t.hostLive}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. PLATFORM FEATURES SECTION */}
      <section className="border-t border-[#1f1f1f] bg-[#0E0E0E] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold">
              Production Capabilities
            </span>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-white">
              Why QUIZ MASTER Excels
            </h2>
            <p className="mt-3 text-sm text-slate-400">
              Engineered with modern WebSockets, instant Web Audio synthesis, and multi-language capability.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-[#242424] bg-[#141414] p-6 hover:border-[#D4AF37]/40 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-white">50 Players Per Live Room</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Connect whole classrooms, congregations, or corporate teams in real time using 6-digit game PINs.
              </p>
            </div>

            <div className="rounded-2xl border border-[#242424] bg-[#141414] p-6 hover:border-[#D4AF37]/40 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] mb-4">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-white">Speed Bonus & Streak Multipliers</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Server-validated submission timers award extra bonus points to fast responders, creating thrilling competition.
              </p>
            </div>

            <div className="rounded-2xl border border-[#242424] bg-[#141414] p-6 hover:border-[#D4AF37]/40 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] mb-4">
                <Trophy className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-white">Tamil & English Dual Support</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Complete bilingual interface with high-legibility Unicode Tamil fonts, ensuring everyone can participate naturally.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS SECTION */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold">Simple 3-Step Flow</span>
          <h2 className="mt-1 font-display text-3xl font-extrabold text-white">{t.howItWorks}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="rounded-2xl border border-[#222] bg-[#141414] p-8">
            <span className="font-mono text-3xl font-black text-gold-gradient">01</span>
            <h3 className="mt-3 text-base font-bold text-white">Select or Create Quiz</h3>
            <p className="mt-2 text-xs text-slate-400">
              Pick from our pre-loaded library or craft your custom questions with images and time limits.
            </p>
          </div>

          <div className="rounded-2xl border border-[#222] bg-[#141414] p-8">
            <span className="font-mono text-3xl font-black text-gold-gradient">02</span>
            <h3 className="mt-3 text-base font-bold text-white">Share 6-Digit PIN</h3>
            <p className="mt-2 text-xs text-slate-400">
              Host launches the screen on projector or monitor. Players join instantly on phones or tablets.
            </p>
          </div>

          <div className="rounded-2xl border border-[#222] bg-[#141414] p-8">
            <span className="font-mono text-3xl font-black text-gold-gradient">03</span>
            <h3 className="mt-3 text-base font-bold text-white">Crown the Champion</h3>
            <p className="mt-2 text-xs text-slate-400">
              Advance through questions, reveal live histograms, and celebrate with a 3-tier championship podium.
            </p>
          </div>
        </div>
      </section>

      {/* 5. PRICING / TIERS */}
      <section className="border-t border-[#1f1f1f] bg-[#0E0E0E] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold">Flexible Plans</span>
            <h2 className="mt-1 font-display text-3xl font-extrabold text-white">{t.pricing}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-[#252525] bg-[#141414] p-6 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Community</span>
                <p className="mt-2 font-mono text-3xl font-black text-white">Free</p>
                <p className="mt-1 text-xs text-slate-400">Perfect for friends & casual family game nights.</p>
                <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#D4AF37]" /> Up to 50 players per room
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#D4AF37]" /> Unlimited quizzes & questions
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#D4AF37]" /> Tamil & English localization
                  </li>
                </ul>
              </div>
              <button
                onClick={onCreateQuiz}
                className="mt-8 w-full rounded-xl border border-[#333] bg-[#1c1c1c] py-2.5 text-xs font-bold text-white hover:border-[#D4AF37] transition-colors"
              >
                Get Started
              </button>
            </div>

            <div className="rounded-2xl border-2 border-[#D4AF37] bg-gold-subtle p-6 flex flex-col justify-between relative shadow-xl shadow-[#D4AF37]/10">
              <div className="absolute -top-3 right-6 rounded-full bg-gold-gradient px-3 py-0.5 text-[10px] font-black uppercase text-black">
                Most Popular
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">Pro Educator</span>
                <p className="mt-2 font-mono text-3xl font-black text-white">$12 <span className="text-xs font-normal text-slate-400">/ mo</span></p>
                <p className="mt-1 text-xs text-slate-300">For schools, colleges & church congregations.</p>
                <ul className="mt-6 space-y-2.5 text-xs text-slate-200">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#D4AF37]" /> All Free features included
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#D4AF37]" /> Custom image uploads & audio themes
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#D4AF37]" /> Detailed exportable participant reports
                  </li>
                </ul>
              </div>
              <button
                onClick={onCreateQuiz}
                className="mt-8 w-full rounded-xl bg-gold-gradient py-2.5 text-xs font-bold text-black hover:brightness-110 active:scale-95 transition-all shadow-md shadow-[#D4AF37]/20"
              >
                Start Pro Studio
              </button>
            </div>

            <div className="rounded-2xl border border-[#252525] bg-[#141414] p-6 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Enterprise</span>
                <p className="mt-2 font-mono text-3xl font-black text-white">$49 <span className="text-xs font-normal text-slate-400">/ mo</span></p>
                <p className="mt-1 text-xs text-slate-400">For large scale corporate townhalls & broadcast events.</p>
                <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#D4AF37]" /> Dedicated high-capacity servers
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#D4AF37]" /> Custom corporate branding & watermarks
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#D4AF37]" /> 24/7 Priority engineering SLA
                  </li>
                </ul>
              </div>
              <button
                onClick={onCreateQuiz}
                className="mt-8 w-full rounded-xl border border-[#333] bg-[#1c1c1c] py-2.5 text-xs font-bold text-white hover:border-[#D4AF37] transition-colors"
              >
                Contact Team
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#1f1f1f] bg-[#0A0A0A] py-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gold-gradient text-black font-bold text-xs">
              QM
            </span>
            <span className="font-display font-bold text-white">{t.brandName}</span>
            <span className="text-slate-600">·</span>
            <span>{t.tagline}</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => onExplore()} className="hover:text-white transition-colors">
              {t.exploreQuizzes}
            </button>
            <button onClick={() => onCreateQuiz()} className="hover:text-white transition-colors">
              {t.createQuiz}
            </button>
            <span className="text-slate-600">© 2026 QUIZ MASTER Inc.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
