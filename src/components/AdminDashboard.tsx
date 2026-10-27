import React, { useState, useEffect } from 'react';
import { Quiz, AdminStats, User } from '../types/quiz';
import { useApp } from '../context/AppContext';
import { sounds } from '../utils/soundEffects';
import {
  Users,
  Award,
  Play,
  Trash2,
  Edit,
  History,
  Shield,
  Layers,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock
} from 'lucide-react';

interface AdminDashboardProps {
  onHostQuiz: (quizId: string) => void;
  onEditQuiz: (quiz: Quiz) => void;
  onCreateQuiz: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onHostQuiz,
  onEditQuiz,
  onCreateQuiz,
}) => {
  const { language, t } = useApp();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalQuizzes: 0,
    totalGamesPlayed: 0,
    totalParticipants: 0,
    activeLiveRooms: 0,
  });
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [history, setHistory] = useState<
    Array<{
      id: string;
      pin: string;
      quizTitle: string;
      participantCount: number;
      winnerName: string;
      topScore: number;
      endedAt: string;
    }>
  >([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'quizzes' | 'users' | 'history'>('overview');
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, quizzesRes, histRes, usersRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/quizzes'),
        fetch('/api/admin/history'),
        fetch('/api/admin/users'),
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (quizzesRes.ok) setQuizzes(await quizzesRes.json());
      if (histRes.ok) setHistory(await histRes.json());
      if (usersRes.ok) setUsersList(await usersRes.json());
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleDeleteQuiz = async (quizId: string) => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) return;
    try {
      sounds.playClick();
      const res = await fetch(`/api/quizzes/${quizId}`, { method: 'DELETE' });
      if (res.ok) {
        setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
      }
    } catch (err) {
      console.error('Failed to delete quiz:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-slate-100 p-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222] pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold flex items-center gap-1.5">
            <Shield className="h-4 w-4" /> System Administration
          </span>
          <h1 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-white">
            {t.adminDashboard}
          </h1>
        </div>

        <button
          onClick={onCreateQuiz}
          className="flex items-center gap-1.5 rounded-xl bg-gold-gradient px-4 py-2 text-xs font-bold text-black hover:brightness-110 active:scale-95 transition-all shadow-md shadow-[#D4AF37]/20 self-start sm:self-auto"
        >
          <span>{t.createNewQuiz}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#222] mt-6 pb-2 text-xs font-medium">
        <button
          onClick={() => {
            setActiveTab('overview');
            sounds.playClick();
          }}
          className={`rounded-lg px-3 py-1.5 transition-colors ${
            activeTab === 'overview' ? 'bg-[#222] text-[#D4AF37] font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          {t.adminOverview}
        </button>
        <button
          onClick={() => {
            setActiveTab('quizzes');
            sounds.playClick();
          }}
          className={`rounded-lg px-3 py-1.5 transition-colors ${
            activeTab === 'quizzes' ? 'bg-[#222] text-[#D4AF37] font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          {t.manageQuizzes} ({quizzes.length})
        </button>
        <button
          onClick={() => {
            setActiveTab('users');
            sounds.playClick();
          }}
          className={`rounded-lg px-3 py-1.5 transition-colors ${
            activeTab === 'users' ? 'bg-[#222] text-[#D4AF37] font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          {t.manageUsers} ({usersList.length})
        </button>
        <button
          onClick={() => {
            setActiveTab('history');
            sounds.playClick();
          }}
          className={`rounded-lg px-3 py-1.5 transition-colors ${
            activeTab === 'history' ? 'bg-[#222] text-[#D4AF37] font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          {t.recentSessions} ({history.length})
        </button>
      </div>

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="mt-6 space-y-8">
          {/* 4 Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-[#242424] bg-[#141414] p-5">
              <span className="text-xs text-slate-400 font-semibold">{t.totalQuizzes}</span>
              <p className="mt-2 font-mono text-3xl font-extrabold text-gold-gradient tabular-nums">
                {stats.totalQuizzes}
              </p>
              <span className="text-[11px] text-slate-500 mt-1 block">Active in library</span>
            </div>

            <div className="rounded-2xl border border-[#242424] bg-[#141414] p-5">
              <span className="text-xs text-slate-400 font-semibold">{t.totalGamesPlayed}</span>
              <p className="mt-2 font-mono text-3xl font-extrabold text-white tabular-nums">
                {stats.totalGamesPlayed}
              </p>
              <span className="text-[11px] text-emerald-400 mt-1 block">
                {stats.activeLiveRooms} active live rooms
              </span>
            </div>

            <div className="rounded-2xl border border-[#242424] bg-[#141414] p-5">
              <span className="text-xs text-slate-400 font-semibold">{t.totalParticipants}</span>
              <p className="mt-2 font-mono text-3xl font-extrabold text-[#D4AF37] tabular-nums">
                {stats.totalParticipants}
              </p>
              <span className="text-[11px] text-slate-500 mt-1 block">Joined live rooms</span>
            </div>

            <div className="rounded-2xl border border-[#242424] bg-[#141414] p-5">
              <span className="text-xs text-slate-400 font-semibold">{t.totalUsers}</span>
              <p className="mt-2 font-mono text-3xl font-extrabold text-white tabular-nums">
                {stats.totalUsers}
              </p>
              <span className="text-[11px] text-slate-500 mt-1 block">Registered profiles</span>
            </div>
          </div>

          {/* Quick Actions / Featured Quizzes ready to launch */}
          <div>
            <h2 className="text-base font-bold text-white mb-3">Live Quizzes Ready to Host</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quizzes.slice(0, 3).map((q) => (
                <div
                  key={q.id}
                  className="rounded-2xl border border-[#252525] bg-[#141414] p-4 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">
                      {q.category} · {q.questions.length} Questions
                    </span>
                    <h3 className="text-sm font-bold text-white mt-1">
                      {language === 'ta' && q.titleTa ? q.titleTa : q.title}
                    </h3>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#222] flex items-center justify-between">
                    <span className="text-xs text-slate-400">{q.timesPlayed} sessions played</span>
                    <button
                      onClick={() => onHostQuiz(q.id)}
                      className="flex items-center gap-1.5 rounded-lg bg-gold-gradient px-3 py-1.5 text-xs font-bold text-black hover:brightness-110 active:scale-95"
                    >
                      <Play className="h-3 w-3 fill-current" />
                      <span>{t.hostLive}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. QUIZZES DIRECTORY TAB */}
      {activeTab === 'quizzes' && (
        <div className="mt-6 rounded-2xl border border-[#222] bg-[#141414] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#222] bg-[#181818] text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Title</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Questions</th>
                  <th className="p-3.5">Author</th>
                  <th className="p-3.5">Times Played</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222]">
                {quizzes.map((q) => (
                  <tr key={q.id} className="hover:bg-[#181818] transition-colors">
                    <td className="p-3.5 font-bold text-white">
                      {language === 'ta' && q.titleTa ? q.titleTa : q.title}
                    </td>
                    <td className="p-3.5 text-slate-300 capitalize">{q.category}</td>
                    <td className="p-3.5 text-slate-300 font-mono tabular-nums">{q.questions.length}</td>
                    <td className="p-3.5 text-slate-400">{q.authorName}</td>
                    <td className="p-3.5 text-slate-400 font-mono tabular-nums">{q.timesPlayed}</td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => onHostQuiz(q.id)}
                        className="rounded-lg bg-gold-gradient px-2.5 py-1 text-[11px] font-bold text-black hover:brightness-110"
                      >
                        Host Live
                      </button>
                      <button
                        onClick={() => onEditQuiz(q)}
                        className="rounded-lg border border-[#333] px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:text-white"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteQuiz(q.id)}
                        className="rounded-lg border border-red-500/30 px-2 py-1 text-[11px] text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-3 w-3 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. USERS DIRECTORY TAB */}
      {activeTab === 'users' && (
        <div className="mt-6 rounded-2xl border border-[#222] bg-[#141414] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#222] bg-[#181818] text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">User</th>
                  <th className="p-3.5">Email</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222]">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-[#181818] transition-colors">
                    <td className="p-3.5 flex items-center gap-2 font-bold text-white">
                      <span>{u.avatar}</span>
                      <span>{u.name}</span>
                    </td>
                    <td className="p-3.5 text-slate-300">{u.email}</td>
                    <td className="p-3.5">
                      <span
                        className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          u.role === 'admin'
                            ? 'bg-[#D4AF37]/20 text-[#D4AF37]'
                            : 'bg-slate-700/40 text-slate-300'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. ACTIVITY HISTORY TAB */}
      {activeTab === 'history' && (
        <div className="mt-6 rounded-2xl border border-[#222] bg-[#141414] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#222] bg-[#181818] text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">PIN</th>
                  <th className="p-3.5">Quiz Name</th>
                  <th className="p-3.5">Players</th>
                  <th className="p-3.5">Winner</th>
                  <th className="p-3.5">Winning Score</th>
                  <th className="p-3.5">Ended At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222]">
                {history.map((h) => (
                  <tr key={h.id} className="hover:bg-[#181818] transition-colors">
                    <td className="p-3.5 font-mono font-bold text-[#D4AF37]">{h.pin}</td>
                    <td className="p-3.5 font-bold text-white">{h.quizTitle}</td>
                    <td className="p-3.5 text-slate-300 font-mono tabular-nums">{h.participantCount}</td>
                    <td className="p-3.5 text-emerald-400 font-semibold">{h.winnerName}</td>
                    <td className="p-3.5 text-[#D4AF37] font-mono font-bold tabular-nums">{h.topScore} pts</td>
                    <td className="p-3.5 text-slate-400">{new Date(h.endedAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
