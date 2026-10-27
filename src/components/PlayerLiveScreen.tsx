import React, { useState, useEffect } from 'react';
import { GameSessionPublic, Player, PlayerAnswerSubmission, PlayerAnswerResult } from '../types/quiz';
import { getSocket } from '../utils/socket';
import { useApp } from '../context/AppContext';
import { sounds } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import {
  Gamepad2,
  CheckCircle2,
  XCircle,
  Clock,
  Flame,
  Trophy,
  ArrowRight,
  Home,
  Check,
  AlertCircle
} from 'lucide-react';

interface PlayerLiveScreenProps {
  initialPin?: string;
  onExit: () => void;
}

const AVATAR_OPTIONS = ['🦁', '🚀', '⚡', '🦉', '💎', '🎯', '👑', '🔥', '🌟', '🦄', '🐯', '🦅'];

export const PlayerLiveScreen: React.FC<PlayerLiveScreenProps> = ({ initialPin = '', onExit }) => {
  const { language, t } = useApp();
  const socket = getSocket();

  // Join state
  const [pin, setPin] = useState(initialPin);
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0]);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [isJoined, setIsJoined] = useState(false);

  // Live game state
  const [session, setSession] = useState<GameSessionPublic | null>(null);
  const [myPlayer, setMyPlayer] = useState<Player | null>(null);
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [lastResult, setLastResult] = useState<PlayerAnswerResult | null>(null);
  const [timeLeft, setTimeLeft] = useState(20);

  // AhaSlides Shape Buttons config
  const optionShapes = [
    { label: '▲', bg: 'bg-rose-600 hover:bg-rose-500 active:scale-95 text-white', icon: '▲' },
    { label: '◆', bg: 'bg-blue-600 hover:bg-blue-500 active:scale-95 text-white', icon: '◆' },
    { label: '●', bg: 'bg-amber-500 hover:bg-amber-400 active:scale-95 text-black', icon: '●' },
    { label: '■', bg: 'bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white', icon: '■' },
  ];

  // Socket event handlers for Player
  useEffect(() => {
    const handleJoinError = ({ message }: { message: string }) => {
      if (message === 'invalidPin') setJoinError(t.invalidPin);
      else if (message === 'roomFull') setJoinError(t.roomFull);
      else if (message === 'gameAlreadyStarted') setJoinError(t.gameAlreadyStarted);
      else setJoinError(message);
    };

    const handleJoined = ({ player, session: joinedSession }: { player: Player; session: GameSessionPublic }) => {
      setMyPlayer(player);
      setSession(joinedSession);
      setIsJoined(true);
      setJoinError(null);
      sounds.playPlayerJoin();
    };

    const handleGameUpdated = (updatedSession: GameSessionPublic) => {
      setSession(updatedSession);
      if (myPlayer) {
        const currentMe = updatedSession.players.find((p) => p.id === myPlayer.id);
        if (currentMe) setMyPlayer(currentMe);
      }
    };

    const handleQuestionStarted = (updatedSession: GameSessionPublic) => {
      setSession(updatedSession);
      setSelectedOptionIds([]);
      setIsAnswerSubmitted(false);
      setLastResult(null);
      setTimeLeft(updatedSession.questionTimeLimit);
      sounds.playQuestionStart();
    };

    const handleAnswerRecorded = ({
      answerRecord,
      currentScore,
      streak,
    }: {
      answerRecord: PlayerAnswerResult;
      currentScore: number;
      streak: number;
    }) => {
      setLastResult(answerRecord);
      setMyPlayer((prev) => (prev ? { ...prev, score: currentScore, streak } : null));
      if (answerRecord.isCorrect) {
        sounds.playCorrect();
      } else {
        sounds.playIncorrect();
      }
    };

    const handleQuestionEnded = (updatedSession: GameSessionPublic) => {
      setSession(updatedSession);
      if (myPlayer) {
        const currentMe = updatedSession.players.find((p) => p.id === myPlayer.id);
        if (currentMe) setMyPlayer(currentMe);
      }
    };

    const handleLeaderboard = (updatedSession: GameSessionPublic) => {
      setSession(updatedSession);
      if (myPlayer) {
        const currentMe = updatedSession.players.find((p) => p.id === myPlayer.id);
        if (currentMe) setMyPlayer(currentMe);
      }
    };

    const handleFinished = (updatedSession: GameSessionPublic) => {
      setSession(updatedSession);
      if (myPlayer) {
        const currentMe = updatedSession.players.find((p) => p.id === myPlayer.id);
        if (currentMe) setMyPlayer(currentMe);

        if (currentMe && currentMe.rank && currentMe.rank <= 3) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      }
    };

    socket.on('player:join_error', handleJoinError);
    socket.on('player:joined', handleJoined);
    socket.on('game:updated', handleGameUpdated);
    socket.on('game:question_started', handleQuestionStarted);
    socket.on('player:answer_recorded', handleAnswerRecorded);
    socket.on('game:question_ended', handleQuestionEnded);
    socket.on('game:leaderboard', handleLeaderboard);
    socket.on('game:finished', handleFinished);

    return () => {
      socket.off('player:join_error', handleJoinError);
      socket.off('player:joined', handleJoined);
      socket.off('game:updated', handleGameUpdated);
      socket.off('game:question_started', handleQuestionStarted);
      socket.off('player:answer_recorded', handleAnswerRecorded);
      socket.off('game:question_ended', handleQuestionEnded);
      socket.off('game:leaderboard', handleLeaderboard);
      socket.off('game:finished', handleFinished);
    };
  }, [socket, myPlayer, t]);

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin || !name) {
      setJoinError('Please enter both Game PIN and Nickname');
      return;
    }
    setJoinError(null);
    socket.emit('player:join', {
      pin: pin.trim(),
      name: name.trim(),
      avatar: selectedAvatar,
    });
  };

  const handleSelectOption = (optionId: string) => {
    if (isAnswerSubmitted || session?.status !== 'question_active') return;

    const isMulti = session?.currentQuestion?.type === 'multiSelect';
    let newSelections: string[];

    if (isMulti) {
      if (selectedOptionIds.includes(optionId)) {
        newSelections = selectedOptionIds.filter((id) => id !== optionId);
      } else {
        newSelections = [...selectedOptionIds, optionId];
      }
      setSelectedOptionIds(newSelections);
      sounds.playClick();
    } else {
      // Single select locks in immediately
      newSelections = [optionId];
      setSelectedOptionIds(newSelections);
      setIsAnswerSubmitted(true);
      sounds.playClick();

      socket.emit('player:submit_answer', {
        pin: session.pin,
        playerId: myPlayer?.id,
        questionIndex: session.currentQuestionIndex,
        selectedOptionIds: newSelections,
      });
    }
  };

  const handleMultiSubmit = () => {
    if (isAnswerSubmitted || !session || selectedOptionIds.length === 0) return;
    setIsAnswerSubmitted(true);
    sounds.playClick();

    socket.emit('player:submit_answer', {
      pin: session.pin,
      playerId: myPlayer?.id,
      questionIndex: session.currentQuestionIndex,
      selectedOptionIds,
    });
  };

  // ---------------- VIEW 1: JOIN FORM ----------------
  if (!isJoined || !session) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] text-slate-100 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-sm rounded-2xl border border-[#2a2a2a] bg-[#141414] p-6 shadow-2xl shadow-black">
          <div className="text-center mb-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gold-gradient text-black mb-2 shadow-lg shadow-[#D4AF37]/20">
              <Gamepad2 className="h-6 w-6" />
            </div>
            <h1 className="font-display text-2xl font-black text-white">{t.joinLiveQuiz}</h1>
            <p className="text-xs text-slate-400 mt-1">{t.enterGamePin}</p>
          </div>

          {joinError && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
              <span>{joinError}</span>
            </div>
          )}

          <form onSubmit={handleJoinSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">{t.enterGamePin}</label>
              <input
                type="text"
                required
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                placeholder={t.gamePinPlaceholder}
                className="w-full rounded-xl border border-[#333] bg-[#0E0E0E] px-4 py-3 text-center font-mono text-2xl font-black tracking-widest text-[#D4AF37] placeholder-slate-600 focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">{t.enterYourName}</label>
              <input
                type="text"
                required
                maxLength={20}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.namePlaceholder}
                className="w-full rounded-xl border border-[#333] bg-[#0E0E0E] px-4 py-2.5 text-sm font-semibold text-white placeholder-slate-600 focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            {/* Avatar Picker */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">{t.chooseAvatar}</label>
              <div className="grid grid-cols-6 gap-2">
                {AVATAR_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      setSelectedAvatar(emoji);
                      sounds.playClick();
                    }}
                    className={`flex h-10 items-center justify-center rounded-lg border text-lg transition-all ${
                      selectedAvatar === emoji
                        ? 'border-[#D4AF37] bg-gold-subtle scale-110 shadow-sm'
                        : 'border-[#2a2a2a] bg-[#161616] hover:border-slate-500'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-gold-gradient py-3 text-sm font-bold text-black transition-all hover:brightness-110 active:scale-95 shadow-lg shadow-[#D4AF37]/20"
            >
              {t.joinGameButton}
            </button>
          </form>

          <button
            onClick={onExit}
            className="mt-4 w-full text-center text-xs text-slate-500 hover:text-slate-300"
          >
            {t.backToHome}
          </button>
        </div>
      </div>
    );
  }

  // ---------------- VIEW 2: WAITING IN LOBBY ----------------
  if (session.status === 'lobby') {
    return (
      <div className="min-h-screen bg-[#0B0B0B] text-slate-100 flex flex-col justify-between p-6 max-w-md mx-auto">
        <header className="text-center pt-8">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-[#D4AF37] bg-gold-subtle text-4xl shadow-xl shadow-[#D4AF37]/20 mb-3 animate-pulse">
            {myPlayer?.avatar}
          </div>
          <h1 className="font-display text-2xl font-extrabold text-white">{myPlayer?.name}</h1>
          <p className="text-xs text-emerald-400 font-semibold mt-1 flex items-center justify-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" /> {t.youAreIn}
          </p>
        </header>

        <div className="rounded-2xl border border-[#2a2a2a] bg-[#141414] p-6 text-center shadow-xl">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37]">
            {language === 'ta' && session.quizTitleTa ? session.quizTitleTa : session.quizTitle}
          </span>
          <p className="mt-3 text-sm text-slate-300 font-medium">{t.waitingForHost}</p>
          <p className="mt-1 text-xs text-slate-500">{t.seeNameOnScreen}</p>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
            <span className="h-2 w-2 rounded-full bg-[#D4AF37] animate-ping" />
            <span>Room PIN: {session.pin}</span>
          </div>
        </div>

        <footer className="pb-4 text-center">
          <button onClick={onExit} className="text-xs text-slate-500 hover:text-slate-300">
            {t.backToHome}
          </button>
        </footer>
      </div>
    );
  }

  // ---------------- VIEW 3: QUESTION ACTIVE (ANSWER BUTTONS) ----------------
  if (session.status === 'question_active' && session.currentQuestion) {
    const isMulti = session.currentQuestion.type === 'multiSelect';

    return (
      <div className="min-h-screen bg-[#0B0B0B] text-slate-100 flex flex-col justify-between p-4 max-w-lg mx-auto">
        {/* Top Status Banner */}
        <div className="flex items-center justify-between border-b border-[#252525] pb-3 pt-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">{myPlayer?.avatar}</span>
            <div>
              <p className="text-xs font-bold text-white truncate max-w-[120px]">{myPlayer?.name}</p>
              <p className="font-mono text-[11px] text-[#D4AF37] font-semibold">{myPlayer?.score} pts</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-semibold text-slate-400">
              {t.question} {session.currentQuestionIndex + 1} / {session.totalQuestions}
            </span>
          </div>
        </div>

        {/* Question Prompt on Mobile Screen */}
        <div className="my-4 text-center">
          <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">
            {language === 'ta' && session.currentQuestion.textTa
              ? session.currentQuestion.textTa
              : session.currentQuestion.text}
          </h2>
          {isMulti && (
            <p className="mt-1 text-xs text-[#D4AF37] font-semibold">
              Select all options that apply, then tap Submit!
            </p>
          )}
        </div>

        {/* Answer Buttons Grid */}
        {!isAnswerSubmitted ? (
          <div className="space-y-3 my-auto">
            {session.currentQuestion.options.map((opt, idx) => {
              const shape = optionShapes[idx % optionShapes.length];
              const isSelected = selectedOptionIds.includes(opt.id);

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  className={`w-full flex items-center justify-between rounded-2xl p-4 text-left font-bold transition-all shadow-lg active:scale-95 ${
                    isSelected
                      ? 'ring-4 ring-white bg-[#D4AF37] text-black'
                      : shape.bg
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black/30 text-lg">
                      {shape.icon}
                    </span>
                    <span className="text-base">
                      {language === 'ta' && opt.textTa ? opt.textTa : opt.text}
                    </span>
                  </div>
                  {isSelected && <Check className="h-6 w-6 shrink-0" />}
                </button>
              );
            })}

            {isMulti && selectedOptionIds.length > 0 && (
              <button
                onClick={handleMultiSubmit}
                className="mt-4 w-full rounded-xl bg-gold-gradient py-3.5 text-sm font-bold text-black transition-all hover:brightness-110 active:scale-95 shadow-xl shadow-[#D4AF37]/30"
              >
                Submit Answers ({selectedOptionIds.length} Selected)
              </button>
            )}
          </div>
        ) : (
          /* Answer Locked In Screen */
          <div className="my-auto rounded-2xl border border-[#2a2a2a] bg-[#141414] p-8 text-center shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gold-gradient text-black mb-3 shadow-lg shadow-[#D4AF37]/20 animate-pulse">
              <Check className="h-8 w-8 stroke-[3]" />
            </div>
            <h3 className="font-display text-xl font-black text-white">{t.answerSubmitted}</h3>
            <p className="mt-2 text-xs text-slate-400">{t.waitingForOtherPlayers}</p>
          </div>
        )}

        <footer className="pt-3 text-center text-xs text-slate-500">
          {t.tapToAnswer}
        </footer>
      </div>
    );
  }

  // ---------------- VIEW 4: QUESTION ENDED / FEEDBACK ----------------
  if (session.status === 'question_ended' || session.status === 'leaderboard') {
    const isCorrect = lastResult?.isCorrect;

    return (
      <div className="min-h-screen bg-[#0B0B0B] text-slate-100 flex flex-col justify-between p-6 max-w-md mx-auto">
        <header className="text-center pt-4">
          <span className="text-xs uppercase tracking-wider text-slate-400">
            {t.question} {session.currentQuestionIndex + 1} Feedback
          </span>
        </header>

        {/* Feedback Card */}
        <div
          className={`my-auto rounded-3xl border-2 p-8 text-center shadow-2xl transition-all ${
            isCorrect
              ? 'border-emerald-500 bg-emerald-950/40 shadow-emerald-900/30'
              : 'border-rose-500 bg-rose-950/40 shadow-rose-900/30'
          }`}
        >
          <div
            className={`mx-auto flex h-20 w-20 items-center justify-center rounded-2xl mb-4 ${
              isCorrect ? 'bg-emerald-500 text-black' : 'bg-rose-600 text-white'
            }`}
          >
            {isCorrect ? <CheckCircle2 className="h-10 w-10" /> : <XCircle className="h-10 w-10" />}
          </div>

          <h2 className="font-display text-2xl font-black text-white">
            {isCorrect ? t.correct : t.incorrect}
          </h2>

          {isCorrect && lastResult && (
            <div className="mt-4 space-y-1">
              <p className="font-mono text-3xl font-black text-[#D4AF37] tabular-nums">
                +{lastResult.pointsEarned} pts
              </p>
              {lastResult.speedBonus > 0 && (
                <p className="text-xs text-emerald-400 font-semibold">
                  ⚡ +{lastResult.speedBonus} {t.streakBonus}
                </p>
              )}
            </div>
          )}

          {/* Current Score & Rank */}
          <div className="mt-6 flex items-center justify-around border-t border-white/10 pt-4">
            <div>
              <span className="text-[11px] text-slate-400 block">{t.totalScore}</span>
              <span className="font-mono text-lg font-bold text-white tabular-nums">
                {myPlayer?.score || 0}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">{t.currentRank}</span>
              <span className="font-mono text-lg font-bold text-[#D4AF37] tabular-nums">
                #{myPlayer?.rank || '-'}
              </span>
            </div>
          </div>
        </div>

        <footer className="text-center text-xs text-slate-500 pb-2">
          {t.seeNameOnScreen}
        </footer>
      </div>
    );
  }

  // ---------------- VIEW 5: FINISHED / FINAL PODIUM ----------------
  if (session.status === 'finished') {
    const isTopThree = myPlayer?.rank && myPlayer.rank <= 3;

    return (
      <div className="min-h-screen bg-[#0B0B0B] text-slate-100 flex flex-col justify-between p-6 max-w-md mx-auto text-center">
        <header className="pt-6">
          <span className="text-xs uppercase tracking-wider text-[#D4AF37] font-bold">
            QUIZ MASTER FINALE
          </span>
          <h1 className="mt-1 font-display text-2xl font-black text-white">{t.finalPodium}</h1>
        </header>

        <div className="my-auto rounded-3xl border border-[#2a2a2a] bg-[#141414] p-8 shadow-2xl">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gold-gradient text-4xl mb-3 shadow-xl shadow-[#D4AF37]/30">
            {myPlayer?.avatar}
          </div>
          <h2 className="font-display text-xl font-bold text-white">{myPlayer?.name}</h2>

          <div className="mt-4 inline-block rounded-xl border border-[#D4AF37]/50 bg-[#1e1e1e] px-6 py-3">
            <span className="text-xs text-slate-400 block">{t.currentRank}</span>
            <span className="font-mono text-3xl font-black text-gold-gradient tabular-nums">
              #{myPlayer?.rank || 1}
            </span>
          </div>

          <div className="mt-4">
            <p className="font-mono text-lg font-bold text-white tabular-nums">
              {myPlayer?.score || 0} {t.points}
            </p>
          </div>

          {isTopThree && (
            <div className="mt-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs text-emerald-300 font-bold">
              🎉 Congratulations! You achieved a Top 3 Podium finish!
            </div>
          )}
        </div>

        <footer className="pb-4">
          <button
            onClick={onExit}
            className="w-full rounded-xl bg-gold-gradient py-3 text-sm font-bold text-black transition-all hover:brightness-110 active:scale-95 shadow-lg shadow-[#D4AF37]/20"
          >
            {t.backToHome}
          </button>
        </footer>
      </div>
    );
  }

  return null;
};
