import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { QuizCreator } from './components/QuizCreator';
import { HostLiveScreen } from './components/HostLiveScreen';
import { PlayerLiveScreen } from './components/PlayerLiveScreen';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { Quiz, GameSessionPublic } from './types/quiz';
import { getSocket } from './utils/socket';
import { sounds } from './utils/soundEffects';

type AppView =
  | 'home'
  | 'explore'
  | 'create'
  | 'admin'
  | 'player_join'
  | 'host_live'
  | 'player_live';

function MainContent() {
  const { user } = useApp();
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [hostSession, setHostSession] = useState<GameSessionPublic | null>(null);
  const [playerPin, setPlayerPin] = useState<string>('');
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);

  const socket = getSocket();

  // Host starts a live quiz session
  const handleHostQuiz = (quizId: string) => {
    sounds.playClick();
    socket.emit('host:create_game', { quizId });

    socket.once('host:game_created', (session: GameSessionPublic) => {
      setHostSession(session);
      setCurrentView('host_live');
      sounds.playLeaderboardReveal();
    });
  };

  // User wants to join with PIN
  const handleJoinPin = (pin: string) => {
    sounds.playClick();
    setPlayerPin(pin);
    setCurrentView('player_join');
  };

  const handleCreateQuiz = () => {
    sounds.playClick();
    setEditingQuiz(null);
    setCurrentView('create');
  };

  const handleEditQuiz = (quiz: Quiz) => {
    sounds.playClick();
    setEditingQuiz(quiz);
    setCurrentView('create');
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-slate-100 flex flex-col font-sans">
      {/* Show Navbar on non-live presentation screens */}
      {currentView !== 'host_live' && currentView !== 'player_join' && (
        <Navbar
          currentView={currentView}
          onNavigate={(view) => {
            sounds.playClick();
            setCurrentView(view);
          }}
          onOpenAuth={() => setAuthModalOpen(true)}
        />
      )}

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomeView
            onJoinPin={handleJoinPin}
            onHostQuiz={handleHostQuiz}
            onCreateQuiz={handleCreateQuiz}
            onExplore={() => setCurrentView('explore')}
          />
        )}

        {currentView === 'explore' && (
          <HomeView
            onJoinPin={handleJoinPin}
            onHostQuiz={handleHostQuiz}
            onCreateQuiz={handleCreateQuiz}
            onExplore={() => setCurrentView('explore')}
          />
        )}

        {currentView === 'create' && (
          <QuizCreator
            initialQuiz={editingQuiz}
            onSaveSuccess={(saved) => {
              setCurrentView('home');
            }}
            onCancel={() => setCurrentView('home')}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboard
            onHostQuiz={handleHostQuiz}
            onEditQuiz={handleEditQuiz}
            onCreateQuiz={handleCreateQuiz}
          />
        )}

        {currentView === 'player_join' && (
          <PlayerLiveScreen
            initialPin={playerPin}
            onExit={() => setCurrentView('home')}
          />
        )}

        {currentView === 'host_live' && hostSession && (
          <HostLiveScreen
            initialSession={hostSession}
            onExit={() => {
              setHostSession(null);
              setCurrentView('home');
            }}
          />
        )}
      </main>

      {/* Global Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
