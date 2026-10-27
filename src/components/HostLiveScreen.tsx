import React, { useState, useEffect, useRef } from 'react';
import { GameSessionPublic, Player } from '../types/quiz';
import { getSocket } from '../utils/socket';
import { useApp } from '../context/AppContext';
import { sounds } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import {
  Users,
  Copy,
  Check,
  Play,
  ArrowRight,
  Trophy,
  Award,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  RotateCcw,
  Home,
  Crown
} from 'lucide-react';

interface HostLiveScreenProps {
  initialSession: GameSessionPublic;
  onExit: () => void;
}

export const HostLiveScreen: React.FC<HostLiveScreenProps> = ({ initialSession, onExit }) => {
  const { language, t } = useApp();
  const [session, setSession] = useState<GameSessionPublic>(initialSession);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(initialSession.questionTimeLimit || 20);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const socket = getSocket();

  // Socket event listeners for Host
  useEffect(() => {
    const handleGameUpdated = (updatedSession: GameSessionPublic) => {
      setSession((prev) => {
        // If a new player joined, play chime
        if (updatedSession.playerCount > prev.playerCount) {
          sounds.playPlayerJoin();
        }
        return updatedSession;
      });
    };

    const handleQuestionStarted = (updatedSession: GameSessionPublic) => {
      setSession(updatedSession);
      setTimeLeft(updatedSession.questionTimeLimit);
      sounds.playQuestionStart();
    };

    const handleAnswerReceived = ({ session: updatedSession }: { session: GameSessionPublic }) => {
      setSession(updatedSession);
    };

    const handleQuestionEnded = (updatedSession: GameSessionPublic) => {
      setSession(updatedSession);
      sounds.playLeaderboardReveal();
    };

    const handleLeaderboard = (updatedSession: GameSessionPublic) => {
      setSession(updatedSession);
      sounds.playLeaderboardReveal();
    };

    const handleFinished = (updatedSession: GameSessionPublic) => {
      setSession(updatedSession);
      sounds.playVictoryFanfare();
      // Blast celebratory confetti
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#FFF1B8', '#AA820A', '#FFFFFF'],
      });
    };

    socket.on('game:updated', handleGameUpdated);
    socket.on('game:question_started', handleQuestionStarted);
    socket.on('game:answer_received', handleAnswerReceived);
    socket.on('game:question_ended', handleQuestionEnded);
    socket.on('game:leaderboard', handleLeaderboard);
    socket.on('game:finished', handleFinished);

    return () => {
      socket.off('game:updated', handleGameUpdated);
      socket.off('game:question_started', handleQuestionStarted);
      socket.off('game:answer_received', handleAnswerReceived);
      socket.off('game:question_ended', handleQuestionEnded);
      socket.off('game:leaderboard', handleLeaderboard);
      socket.off('game:finished', handleFinished);
    };
  }, [socket]);

  // Question countdown tick interval
  useEffect(() => {
    if (session.status !== 'question_active') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    // Calculate actual elapsed from start timestamp
    const updateCountdown = () => {
      const elapsedSec = Math.floor((Date.now() - session.questionStartTime) / 1000);
      const remaining = Math.max(0, session.questionTimeLimit - elapsedSec);
      setTimeLeft(remaining);

      if (remaining <= 5 && remaining > 0) {
        sounds.playUrgentTick();
      } else if (remaining > 5) {
        sounds.playTick();
      }

      if (remaining === 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        // Automatically request server to end question
        socket.emit('host:end_question', { pin: session.pin });
      }
    };

    updateCountdown();
    timerRef.current = setInterval(updateCountdown, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [session.status, session.questionStartTime, session.questionTimeLimit, session.pin, socket]);

  const copyPin = () => {
    navigator.clipboard.writeText(session.pin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartQuiz = () => {
    socket.emit('host:start_quiz', { pin: session.pin });
  };

  const handleEndQuestionEarly = () => {
    socket.emit('host:end_question', { pin: session.pin });
  };

  const handleShowLeaderboard = () => {
    socket.emit('host:show_leaderboard', { pin: session.pin });
  };

  const handleNextQuestion = () => {
    socket.emit('host:next_question', { pin: session.pin });
  };

  // Shape markers config for AhaSlides presentation
  const optionShapes = [
    { label: '▲', bg: 'bg-rose-950/40 border-rose-600/60 text-rose-300', fillBg: 'bg-rose-600', icon: '▲' },
    { label: '◆', bg: 'bg-blue-950/40 border-blue-600/60 text-blue-300', fillBg: 'bg-blue-600', icon: '◆' },
    { label: '●', bg: 'bg-amber-950/40 border-amber-600/60 text-amber-300', fillBg: 'bg-amber-500', icon: '●' },
    { label: '■', bg: 'bg-emerald-950/40 border-emerald-600/60 text-emerald-300', fillBg: 'bg-emerald-600', icon: '■' },
  ];

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-slate-100 flex flex-col font-sans select-none">
      {/* Host Top Navigation Bar */}
      <header className="h-16 border-b border-[#252525] bg-[#121212] px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-gradient text-black font-bold text-sm">
            QM
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <span>{language === 'ta' && session.quizTitleTa ? session.quizTitleTa : session.quizTitle}</span>
              <span className="text-[11px] font-normal text-slate-400">· Live Host Mode</span>
            </h1>
          </div>
        </div>

        {/* PIN Badge & Player Count */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-lg border border-[#D4AF37]/40 bg-[#1A1A1A] px-3 py-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{t.gamePin}:</span>
            <span className="font-mono text-base font-black tracking-widest text-[#D4AF37]">{session.pin}</span>
            <button
              onClick={copyPin}
              className="text-slate-400 hover:text-white transition-colors"
              title="Copy PIN"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>

          <div className="flex items-center gap-1.5 rounded-lg border border-[#2a2a2a] bg-[#161616] px-3 py-1 text-xs text-slate-300">
            <Users className="h-3.5 w-3.5 text-[#D4AF37]" />
            <span className="font-bold text-white">{session.playerCount}</span>
            <span className="text-slate-500">/ {session.maxPlayers}</span>
          </div>

          <button
            onClick={onExit}
            className="rounded-lg border border-[#333] px-3 py-1 text-xs font-medium text-slate-400 hover:bg-[#222] hover:text-white transition-colors"
          >
            {t.backToHome}
          </button>
        </div>
      </header>

      {/* Main Screen Content Deck */}
      <main className="flex-1 flex flex-col justify-center p-6 max-w-7xl w-full mx-auto">
        {/* ---------------- 1. LOBBY VIEW ---------------- */}
        {session.status === 'lobby' && (
          <div className="flex-1 flex flex-col justify-between py-8">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold">
                AhaSlides-Style Live Competition
              </span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-display">
                {language === 'ta' ? 'வீரர்கள் இணைய காத்திருக்கிறது' : 'Join on your phone or device'}
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Go to <span className="font-semibold text-white">QUIZ MASTER</span> and enter Game PIN:
              </p>

              {/* Huge PIN Display Card */}
              <div className="mt-6 inline-flex flex-col items-center justify-center rounded-2xl border-2 border-[#D4AF37]/50 bg-[#141414] px-10 py-6 shadow-2xl shadow-[#D4AF37]/10">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">{t.gamePin}</span>
                <span className="font-mono text-5xl sm:text-6xl font-black tracking-widest text-gold-gradient">
                  {session.pin}
                </span>
                <div className="mt-4 flex items-center gap-3">
                  <button
                    onClick={copyPin}
                    className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-[#D4AF37] transition-colors"
                  >
                    {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                    <span>{copied ? t.inviteCopied : t.copyInviteLink}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Live Joined Players Grid */}
            <div className="mt-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                  <Users className="h-4 w-4 text-[#D4AF37]" />
                  <span>{t.playersJoined} ({session.playerCount})</span>
                </h3>
                <span className="text-xs text-slate-500">{t.maxPlayersNotice}</span>
              </div>

              {session.playerCount === 0 ? (
                <div className="rounded-xl border border-dashed border-[#333] p-12 text-center text-slate-500">
                  <p className="text-sm font-medium">{t.waitingForHost}</p>
                  <p className="text-xs mt-1 text-slate-600">Open another tab as a player to test live competition!</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-64 overflow-y-auto p-1">
                  {session.players.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center gap-2.5 rounded-xl border border-[#2a2a2a] bg-[#161616] px-3 py-2.5 shadow-sm transition-all animate-in zoom-in-95 duration-200"
                    >
                      <span className="text-xl">{p.avatar}</span>
                      <span className="text-xs font-semibold text-slate-200 truncate">{p.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Launch Game Button */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleStartQuiz}
                disabled={session.playerCount === 0}
                className="flex items-center gap-2.5 rounded-xl bg-gold-gradient px-8 py-3.5 text-sm font-bold text-black transition-all hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-xl shadow-[#D4AF37]/20"
              >
                <Play className="h-4 w-4 fill-current" />
                <span>{t.startGame}</span>
              </button>
            </div>
          </div>
        )}

        {/* ---------------- 2. QUESTION ACTIVE VIEW ---------------- */}
        {session.status === 'question_active' && session.currentQuestion && (
          <div className="flex-1 flex flex-col justify-between py-4">
            {/* Question Progress Header */}
            <div className="flex items-center justify-between border-b border-[#222] pb-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                <span className="text-[#D4AF37]">
                  {t.question} {session.currentQuestionIndex + 1} {t.of} {session.totalQuestions}
                </span>
                <span>·</span>
                <span>{session.currentQuestion.points} {t.points}</span>
              </div>

              {/* Countdown Timer Display */}
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full border-2 font-mono text-xl font-black ${
                    timeLeft <= 5
                      ? 'border-rose-500 bg-rose-500/10 text-rose-400 animate-pulse'
                      : 'border-[#D4AF37] bg-[#D4AF37]/10 text-gold-gradient'
                  }`}
                >
                  {timeLeft}
                </div>
                <div className="text-right">
                  <p className="text-[11px] uppercase tracking-wider text-slate-400">{t.timeRemaining}</p>
                  <p className="text-xs font-bold text-slate-200">{timeLeft} {t.seconds}</p>
                </div>
              </div>
            </div>

            {/* Question Prompt */}
            <div className="my-6 text-center">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-snug">
                {language === 'ta' && session.currentQuestion.textTa
                  ? session.currentQuestion.textTa
                  : session.currentQuestion.text}
              </h2>
              {/* Optional English subtitle if in Tamil mode */}
              {language === 'ta' && session.currentQuestion.textTa && (
                <p className="mt-2 text-sm text-slate-400">{session.currentQuestion.text}</p>
              )}

              {/* Question Image if provided */}
              {session.currentQuestion.imageUrl && (
                <div className="mt-4 mx-auto max-w-md overflow-hidden rounded-xl border border-[#2a2a2a] bg-[#111]">
                  <img
                    src={session.currentQuestion.imageUrl}
                    alt="Question visual"
                    className="h-44 w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}
            </div>

            {/* 4 Answer Options (AhaSlides Geometric Shapes) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {session.currentQuestion.options.map((opt, idx) => {
                const shape = optionShapes[idx % optionShapes.length];
                return (
                  <div
                    key={opt.id}
                    className={`flex items-center gap-4 rounded-xl border p-4 transition-all ${shape.bg}`}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-black/40 font-bold text-lg">
                      {shape.icon}
                    </div>
                    <span className="text-base font-semibold text-white">
                      {language === 'ta' && opt.textTa ? opt.textTa : opt.text}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Bottom Bar: Answer count & Early end button */}
            <div className="mt-6 flex items-center justify-between border-t border-[#222] pt-4">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Users className="h-4 w-4 text-[#D4AF37]" />
                <span>
                  {Object.values(session.optionCounts || {}).reduce((a, b) => a + b, 0)} of {session.playerCount}{' '}
                  {t.answersReceived}
                </span>
              </div>

              <button
                onClick={handleEndQuestionEarly}
                className="flex items-center gap-1.5 rounded-lg border border-[#333] bg-[#161616] px-4 py-2 text-xs font-semibold text-slate-200 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors"
              >
                <span>{t.showCorrectAnswer}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ---------------- 3. QUESTION ENDED VIEW (RESULTS & HISTOGRAM) ---------------- */}
        {session.status === 'question_ended' && session.currentQuestion && (
          <div className="flex-1 flex flex-col justify-between py-4">
            <div className="text-center mb-4">
              <span className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold">
                Question Results & Evaluation
              </span>
              <h2 className="mt-1 text-xl sm:text-2xl font-bold text-white">
                {language === 'ta' && session.currentQuestion.textTa
                  ? session.currentQuestion.textTa
                  : session.currentQuestion.text}
              </h2>
            </div>

            {/* Answer Histogram Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-auto">
              {session.currentQuestion.options.map((opt, idx) => {
                const shape = optionShapes[idx % optionShapes.length];
                const isCorrect = session.revealedCorrectOptionIds?.includes(opt.id);
                const count = session.optionCounts?.[opt.id] || 0;
                const totalAnswers = Math.max(1, Object.values(session.optionCounts || {}).reduce((a, b) => a + b, 0));
                const percentage = Math.round((count / totalAnswers) * 100);

                return (
                  <div
                    key={opt.id}
                    className={`relative overflow-hidden rounded-xl border p-4 transition-all ${
                      isCorrect
                        ? 'border-emerald-500 bg-emerald-950/30 ring-1 ring-emerald-500/50'
                        : 'border-[#222] bg-[#141414] opacity-75'
                    }`}
                  >
                    {/* Background Progress Bar */}
                    <div
                      className={`absolute bottom-0 left-0 top-0 opacity-15 transition-all duration-700 ${
                        isCorrect ? 'bg-emerald-500' : 'bg-slate-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />

                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                            isCorrect ? 'bg-emerald-500 text-black' : 'bg-black/50 text-slate-300'
                          }`}
                        >
                          {shape.icon}
                        </div>
                        <div>
                          <p className={`text-sm font-semibold ${isCorrect ? 'text-emerald-300 font-bold' : 'text-slate-200'}`}>
                            {language === 'ta' && opt.textTa ? opt.textTa : opt.text}
                          </p>
                          {isCorrect && (
                            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 mt-0.5">
                              <CheckCircle2 className="h-3 w-3" /> Correct Answer
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Vote Count & Percentage */}
                      <div className="text-right">
                        <span className="font-mono text-base font-bold text-white tabular-nums">{count}</span>
                        <span className="block text-[11px] text-slate-400">{percentage}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Explanation Note */}
            {session.currentQuestion.explanation && (
              <div className="mt-4 rounded-xl border border-[#2a2a2a] bg-[#161616] p-4 text-xs text-slate-300">
                <span className="font-bold text-[#D4AF37] block mb-1">Knowledge Insight:</span>
                <p>
                  {language === 'ta' && session.currentQuestion.explanationTa
                    ? session.currentQuestion.explanationTa
                    : session.currentQuestion.explanation}
                </p>
              </div>
            )}

            {/* Next Action */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleShowLeaderboard}
                className="flex items-center gap-2 rounded-xl bg-gold-gradient px-6 py-2.5 text-xs font-bold text-black transition-all hover:brightness-110 active:scale-95"
              >
                <span>{t.showLeaderboard}</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* ---------------- 4. LEADERBOARD VIEW ---------------- */}
        {session.status === 'leaderboard' && (
          <div className="flex-1 flex flex-col justify-between py-4">
            <div className="text-center mb-6">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gold-gradient text-black mb-2 shadow-lg shadow-[#D4AF37]/20">
                <Trophy className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-black tracking-tight text-white font-display">{t.leaderboard}</h2>
              <p className="text-xs text-slate-400 mt-1">
                Question {session.currentQuestionIndex + 1} of {session.totalQuestions} Standings
              </p>
            </div>

            {/* Standings Table */}
            <div className="max-w-2xl w-full mx-auto space-y-2.5 max-h-80 overflow-y-auto px-1">
              {session.players.map((p, idx) => (
                <div
                  key={p.id}
                  className={`flex items-center justify-between rounded-xl border px-4 py-3 transition-all animate-in slide-in-from-bottom-2 ${
                    idx === 0
                      ? 'border-[#D4AF37] bg-gold-subtle shadow-md shadow-[#D4AF37]/10'
                      : idx === 1
                      ? 'border-slate-400/40 bg-[#181818]'
                      : idx === 2
                      ? 'border-amber-700/40 bg-[#161616]'
                      : 'border-[#242424] bg-[#121212]'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-lg font-mono text-xs font-bold ${
                        idx === 0
                          ? 'bg-[#D4AF37] text-black'
                          : idx === 1
                          ? 'bg-slate-300 text-black'
                          : idx === 2
                          ? 'bg-amber-700 text-white'
                          : 'bg-[#222] text-slate-400'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="text-2xl">{p.avatar}</span>
                    <div>
                      <p className="text-sm font-bold text-white truncate max-w-[200px]">{p.name}</p>
                      {p.streak > 1 && (
                        <span className="text-[10px] font-semibold text-[#D4AF37]">
                          🔥 {p.streak} Streak!
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-base font-extrabold text-[#D4AF37] tabular-nums">
                      {p.score}
                    </span>
                    <span className="text-[11px] text-slate-400 block">{t.points}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Next Question or Finish Button */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleNextQuestion}
                className="flex items-center gap-2 rounded-xl bg-gold-gradient px-8 py-3.5 text-sm font-bold text-black transition-all hover:brightness-110 active:scale-95 shadow-xl shadow-[#D4AF37]/20"
              >
                <span>
                  {session.currentQuestionIndex + 1 < session.totalQuestions ? t.nextQuestion : t.endQuiz}
                </span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* ---------------- 5. FINISHED & CHAMPIONSHIP PODIUM ---------------- */}
        {session.status === 'finished' && (
          <div className="flex-1 flex flex-col justify-between py-6 text-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] flex items-center justify-center gap-1.5">
                <Sparkles className="h-4 w-4" /> QUIZ MASTER CHAMPIONSHIP PODIUM
              </span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-black text-white font-display">
                {t.finalPodium}
              </h2>
            </div>

            {/* 3-Tier Podium */}
            <div className="my-8 flex items-end justify-center gap-4 max-w-xl mx-auto w-full px-2">
              {/* 2nd Place Silver */}
              {session.topWinners?.[1] && (
                <div className="flex-1 flex flex-col items-center">
                  <span className="text-3xl mb-1">{session.topWinners[1].avatar}</span>
                  <p className="text-xs font-bold text-slate-200 truncate max-w-[100px]">
                    {session.topWinners[1].name}
                  </p>
                  <p className="font-mono text-xs font-bold text-slate-400 tabular-nums">
                    {session.topWinners[1].score} pts
                  </p>
                  <div className="mt-2 w-full rounded-t-xl border border-slate-600 bg-gradient-to-t from-slate-800 to-slate-700 py-6 text-center shadow-lg">
                    <span className="font-mono text-2xl font-black text-slate-200">2</span>
                    <span className="block text-[10px] text-slate-400 font-semibold uppercase mt-0.5">Silver</span>
                  </div>
                </div>
              )}

              {/* 1st Place Gold Champion */}
              {session.topWinners?.[0] && (
                <div className="flex-1 flex flex-col items-center relative -top-4">
                  <Crown className="h-7 w-7 text-[#D4AF37] animate-bounce mb-1" />
                  <span className="text-4xl mb-1">{session.topWinners[0].avatar}</span>
                  <p className="text-sm font-black text-white truncate max-w-[120px]">
                    {session.topWinners[0].name}
                  </p>
                  <p className="font-mono text-sm font-black text-[#D4AF37] tabular-nums">
                    {session.topWinners[0].score} pts
                  </p>
                  <div className="mt-2 w-full rounded-t-xl border-2 border-[#D4AF37] bg-gradient-to-t from-[#8E6D10] to-[#D4AF37] py-10 text-center shadow-2xl shadow-[#D4AF37]/30">
                    <span className="font-mono text-3xl font-black text-black">1</span>
                    <span className="block text-[11px] text-black font-extrabold uppercase mt-1">Champion</span>
                  </div>
                </div>
              )}

              {/* 3rd Place Bronze */}
              {session.topWinners?.[2] && (
                <div className="flex-1 flex flex-col items-center">
                  <span className="text-3xl mb-1">{session.topWinners[2].avatar}</span>
                  <p className="text-xs font-bold text-slate-200 truncate max-w-[100px]">
                    {session.topWinners[2].name}
                  </p>
                  <p className="font-mono text-xs font-bold text-amber-600 tabular-nums">
                    {session.topWinners[2].score} pts
                  </p>
                  <div className="mt-2 w-full rounded-t-xl border border-amber-800 bg-gradient-to-t from-amber-950 to-amber-900 py-4 text-center shadow-lg">
                    <span className="font-mono text-xl font-black text-amber-400">3</span>
                    <span className="block text-[10px] text-amber-400/80 font-semibold uppercase mt-0.5">Bronze</span>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={onExit}
                className="flex items-center gap-2 rounded-xl bg-gold-gradient px-6 py-3 text-xs font-bold text-black transition-all hover:brightness-110 active:scale-95 shadow-lg shadow-[#D4AF37]/20"
              >
                <Home className="h-4 w-4" />
                <span>{t.backToHome}</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
