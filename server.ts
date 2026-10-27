import express, { Request, Response } from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { INITIAL_QUIZZES } from './src/data/initialQuizzes.ts';
import { Quiz, Player, GameStatus, AdminStats } from './src/types/quiz.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-Memory Database with Pre-seeded Content
interface UserRecord {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: 'admin' | 'creator' | 'user';
  avatar: string;
  createdAt: string;
}

const users: Map<string, UserRecord> = new Map([
  [
    'admin@quizmaster.com',
    {
      id: 'admin-1',
      email: 'admin@quizmaster.com',
      name: 'System Administrator',
      passwordHash: 'admin123',
      role: 'admin',
      avatar: '👑',
      createdAt: '2026-01-01T00:00:00Z',
    },
  ],
  [
    'creator@quizmaster.com',
    {
      id: 'creator-1',
      email: 'creator@quizmaster.com',
      name: 'Professor Karthik',
      passwordHash: 'creator123',
      role: 'creator',
      avatar: '🎓',
      createdAt: '2026-02-15T00:00:00Z',
    },
  ],
]);

const quizzes: Map<string, Quiz> = new Map();
INITIAL_QUIZZES.forEach((q) => quizzes.set(q.id, q));

interface InternalPlayerAnswer {
  playerId: string;
  questionIndex: number;
  selectedOptionIds: string[];
  isCorrect: boolean;
  pointsEarned: number;
  speedBonus: number;
  totalQuestionPoints: number;
  responseTimeMs: number;
}

interface InternalGameSession {
  id: string;
  pin: string;
  quizId: string;
  quiz: Quiz;
  hostSocketId: string;
  status: GameStatus;
  currentQuestionIndex: number;
  questionStartTime: number;
  questionTimeLimit: number;
  questionTimerRef?: NodeJS.Timeout;
  players: Map<string, Player>; // playerId -> Player
  answers: Map<number, Map<string, InternalPlayerAnswer>>; // questionIndex -> (playerId -> Answer)
  maxPlayers: number;
  createdAt: number;
}

const activeSessions: Map<string, InternalGameSession> = new Map(); // pin -> session
const completedGameAudit: Array<{
  id: string;
  pin: string;
  quizTitle: string;
  participantCount: number;
  winnerName: string;
  topScore: number;
  endedAt: string;
}> = [
  {
    id: 'game-prev-1',
    pin: '782914',
    quizTitle: 'Grand General Knowledge Championship',
    participantCount: 38,
    winnerName: 'Sundar Pichai',
    topScore: 4850,
    endedAt: '2026-03-26T18:40:00Z',
  },
  {
    id: 'game-prev-2',
    pin: '449102',
    quizTitle: 'The Great Bible Quiz & Ancient Wisdom',
    participantCount: 42,
    winnerName: 'Esther Rani',
    topScore: 3950,
    endedAt: '2026-03-27T10:15:00Z',
  },
];

let totalHistoricalParticipants = 295;
let totalHistoricalGames = 28;

function generateUniquePin(): string {
  let pin = '';
  do {
    pin = Math.floor(100000 + Math.random() * 900000).toString();
  } while (activeSessions.has(pin));
  return pin;
}

function getSanitizedSession(session: InternalGameSession) {
  const currentQ = session.quiz.questions[session.currentQuestionIndex];
  const isQuestionOver =
    session.status === 'question_ended' ||
    session.status === 'leaderboard' ||
    session.status === 'finished';

  // Option submission distribution counts
  const optionCounts: Record<string, number> = {};
  if (currentQ) {
    currentQ.options.forEach((opt) => {
      optionCounts[opt.id] = 0;
    });
    const qAnswers = session.answers.get(session.currentQuestionIndex);
    if (qAnswers) {
      qAnswers.forEach((ans) => {
        ans.selectedOptionIds.forEach((optId) => {
          optionCounts[optId] = (optionCounts[optId] || 0) + 1;
        });
      });
    }
  }

  const playersList = Array.from(session.players.values()).sort(
    (a, b) => b.score - a.score
  );
  playersList.forEach((p, idx) => {
    p.rank = idx + 1;
  });

  return {
    id: session.id,
    pin: session.pin,
    quizId: session.quizId,
    quizTitle: session.quiz.title,
    quizTitleTa: session.quiz.titleTa,
    quizCategory: session.quiz.category,
    status: session.status,
    currentQuestionIndex: session.currentQuestionIndex,
    totalQuestions: session.quiz.questions.length,
    questionStartTime: session.questionStartTime,
    questionTimeLimit: session.questionTimeLimit,
    players: playersList,
    playerCount: session.players.size,
    maxPlayers: session.maxPlayers,
    optionCounts,
    currentQuestion: currentQ
      ? {
          id: currentQ.id,
          text: currentQ.text,
          textTa: currentQ.textTa,
          type: currentQ.type,
          timeLimit: currentQ.timeLimit,
          points: currentQ.points,
          imageUrl: currentQ.imageUrl,
          explanation: isQuestionOver ? currentQ.explanation : undefined,
          explanationTa: isQuestionOver ? currentQ.explanationTa : undefined,
          options: currentQ.options.map((opt) => ({
            id: opt.id,
            text: opt.text,
            textTa: opt.textTa,
          })),
        }
      : undefined,
    revealedCorrectOptionIds: isQuestionOver && currentQ
      ? currentQ.options.filter((o) => o.isCorrect).map((o) => o.id)
      : undefined,
    topWinners: session.status === 'finished' ? playersList.slice(0, 3) : undefined,
  };
}

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
    transports: ['websocket', 'polling'],
  });

  app.use(express.json());

  // ----------------------------------------------------------------
  // REST API Endpoints
  // ----------------------------------------------------------------

  // Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', service: 'QUIZ MASTER', timestamp: new Date().toISOString() });
  });

  // Admin Stats
  app.get('/api/admin/stats', (_req: Request, res: Response) => {
    const stats: AdminStats = {
      totalUsers: users.size,
      totalQuizzes: quizzes.size,
      totalGamesPlayed: totalHistoricalGames + activeSessions.size,
      totalParticipants: totalHistoricalParticipants,
      activeLiveRooms: activeSessions.size,
    };
    res.json(stats);
  });

  // Admin Game Audit History
  app.get('/api/admin/history', (_req: Request, res: Response) => {
    res.json(completedGameAudit);
  });

  // Admin User List
  app.get('/api/admin/users', (_req: Request, res: Response) => {
    const userList = Array.from(users.values()).map(({ passwordHash, ...rest }) => rest);
    res.json(userList);
  });

  // Auth: Login
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = users.get(email.toLowerCase().trim());
    if (!user || user.passwordHash !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const { passwordHash, ...safeUser } = user;
    return res.json({ user: safeUser, token: `fake-jwt-${user.id}` });
  });

  // Auth: Register
  app.post('/api/auth/register', (req: Request, res: Response) => {
    const { email, password, name, role } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password and name are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    if (users.has(normalizedEmail)) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    const avatars = ['⚡', '👑', '🚀', '🌟', '🎯', '🦁', '🦉', '💎'];
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];

    const newUser: UserRecord = {
      id: `user-${Date.now()}`,
      email: normalizedEmail,
      name: name.trim(),
      passwordHash: password,
      role: role === 'admin' ? 'admin' : role === 'creator' ? 'creator' : 'user',
      avatar: randomAvatar,
      createdAt: new Date().toISOString(),
    };

    users.set(normalizedEmail, newUser);
    const { passwordHash, ...safeUser } = newUser;
    return res.status(201).json({ user: safeUser, token: `fake-jwt-${newUser.id}` });
  });

  // Quizzes: List
  app.get('/api/quizzes', (_req: Request, res: Response) => {
    const list = Array.from(quizzes.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    res.json(list);
  });

  // Quizzes: Get Single
  app.get('/api/quizzes/:id', (req: Request, res: Response) => {
    const quiz = quizzes.get(req.params.id);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    res.json(quiz);
  });

  // Quizzes: Create
  app.post('/api/quizzes', (req: Request, res: Response) => {
    const { title, titleTa, description, descriptionTa, category, questions, authorName, createdBy, coverImage } =
      req.body;

    if (!title || !questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: 'Title and at least one question are required' });
    }

    const newQuiz: Quiz = {
      id: `quiz-${Date.now()}`,
      title,
      titleTa: titleTa || title,
      description: description || '',
      descriptionTa: descriptionTa || '',
      category: category || 'generalKnowledge',
      coverImage: coverImage || '/src/assets/images/quiz_stage_arena_1793097861150.jpg',
      questions,
      createdBy: createdBy || 'admin-1',
      authorName: authorName || 'Quiz Creator',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPublished: true,
      timesPlayed: 0,
    };

    quizzes.set(newQuiz.id, newQuiz);
    return res.status(201).json(newQuiz);
  });

  // Quizzes: Update
  app.put('/api/quizzes/:id', (req: Request, res: Response) => {
    const existing = quizzes.get(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const updated: Quiz = {
      ...existing,
      ...req.body,
      id: existing.id,
      updatedAt: new Date().toISOString(),
    };

    quizzes.set(updated.id, updated);
    return res.json(updated);
  });

  // Quizzes: Delete
  app.delete('/api/quizzes/:id', (req: Request, res: Response) => {
    if (!quizzes.has(req.params.id)) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    quizzes.delete(req.params.id);
    return res.json({ success: true, message: 'Quiz removed successfully' });
  });

  // ----------------------------------------------------------------
  // Real-Time Multiplayer Socket.IO Core
  // ----------------------------------------------------------------

  io.on('connection', (socket: Socket) => {
    // 1. Host creates a live game room
    socket.on('host:create_game', ({ quizId }: { quizId: string }) => {
      const quiz = quizzes.get(quizId);
      if (!quiz) {
        return socket.emit('error', { message: 'Quiz not found' });
      }

      const pin = generateUniquePin();
      const session: InternalGameSession = {
        id: `sess-${Date.now()}`,
        pin,
        quizId,
        quiz,
        hostSocketId: socket.id,
        status: 'lobby',
        currentQuestionIndex: -1,
        questionStartTime: 0,
        questionTimeLimit: 20,
        players: new Map(),
        answers: new Map(),
        maxPlayers: 50,
        createdAt: Date.now(),
      };

      activeSessions.set(pin, session);
      socket.join(pin);
      socket.join(`host:${pin}`);

      quiz.timesPlayed += 1;
      totalHistoricalGames += 1;

      socket.emit('host:game_created', getSanitizedSession(session));
    });

    // 2. Player joins game with PIN
    socket.on(
      'player:join',
      ({ pin, name, avatar, playerId }: { pin: string; name: string; avatar: string; playerId?: string }) => {
        const session = activeSessions.get(pin.trim());
        if (!session) {
          return socket.emit('player:join_error', { message: 'invalidPin' });
        }

        if (session.status !== 'lobby') {
          return socket.emit('player:join_error', { message: 'gameAlreadyStarted' });
        }

        if (session.players.size >= session.maxPlayers) {
          return socket.emit('player:join_error', { message: 'roomFull' });
        }

        const effectiveId = playerId || `p-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const player: Player = {
          id: effectiveId,
          socketId: socket.id,
          name: (name || 'Player').slice(0, 20),
          avatar: avatar || '⚡',
          score: 0,
          correctCount: 0,
          answersCount: 0,
          streak: 0,
          lastResponseTimeMs: 0,
          isConnected: true,
        };

        session.players.set(effectiveId, player);
        totalHistoricalParticipants += 1;

        socket.join(pin);
        socket.join(`player:${pin}`);

        // Notify player of successful join
        socket.emit('player:joined', {
          player,
          session: getSanitizedSession(session),
        });

        // Broadcast updated room state to all in lobby
        io.to(pin).emit('game:updated', getSanitizedSession(session));
      }
    );

    // 3. Host starts quiz
    socket.on('host:start_quiz', ({ pin }: { pin: string }) => {
      const session = activeSessions.get(pin);
      if (!session || session.hostSocketId !== socket.id) return;

      if (session.quiz.questions.length === 0) {
        return socket.emit('error', { message: 'No questions in this quiz' });
      }

      session.currentQuestionIndex = 0;
      const question = session.quiz.questions[0];
      session.status = 'question_active';
      session.questionStartTime = Date.now();
      session.questionTimeLimit = question.timeLimit;
      session.answers.set(0, new Map());

      io.to(pin).emit('game:question_started', getSanitizedSession(session));
    });

    // 4. Player submits answer
    socket.on(
      'player:submit_answer',
      ({
        pin,
        playerId,
        questionIndex,
        selectedOptionIds,
      }: {
        pin: string;
        playerId: string;
        questionIndex: number;
        selectedOptionIds: string[];
      }) => {
        const session = activeSessions.get(pin);
        if (!session || session.status !== 'question_active') return;
        if (session.currentQuestionIndex !== questionIndex) return;

        const player = session.players.get(playerId);
        if (!player) return;

        // Check for duplicate submission
        let qAnswers = session.answers.get(questionIndex);
        if (!qAnswers) {
          qAnswers = new Map();
          session.answers.set(questionIndex, qAnswers);
        }

        if (qAnswers.has(playerId)) {
          return; // Already submitted
        }

        const now = Date.now();
        const responseTimeMs = Math.max(100, now - session.questionStartTime);
        const currentQ = session.quiz.questions[questionIndex];

        // Evaluate answer correctness
        const correctIds = currentQ.options.filter((o) => o.isCorrect).map((o) => o.id);
        let isCorrect = false;

        if (currentQ.type === 'multiSelect') {
          // All correct must be selected, no incorrect selected
          const selSet = new Set(selectedOptionIds);
          const corSet = new Set(correctIds);
          isCorrect = selSet.size === corSet.size && [...selSet].every((id) => corSet.has(id));
        } else {
          isCorrect =
            selectedOptionIds.length === 1 && correctIds.includes(selectedOptionIds[0]);
        }

        // Calculate score with speed bonus
        let pointsEarned = 0;
        let speedBonus = 0;
        const totalDurationMs = currentQ.timeLimit * 1000;

        if (isCorrect) {
          const basePoints = currentQ.points || 1000;
          const timeLeftRatio = Math.max(0, (totalDurationMs - responseTimeMs) / totalDurationMs);
          // Speed bonus: up to 50% extra points for instant answer
          speedBonus = Math.round(basePoints * 0.5 * timeLeftRatio);
          const streakMultiplier = 1 + Math.min(player.streak * 0.1, 0.5); // up to 50% bonus for streaks
          pointsEarned = Math.round((basePoints + speedBonus) * streakMultiplier);

          player.score += pointsEarned;
          player.correctCount += 1;
          player.streak += 1;
        } else {
          player.streak = 0;
        }

        player.answersCount += 1;
        player.lastResponseTimeMs = responseTimeMs;

        const answerRecord: InternalPlayerAnswer = {
          playerId,
          questionIndex,
          selectedOptionIds,
          isCorrect,
          pointsEarned,
          speedBonus,
          totalQuestionPoints: pointsEarned,
          responseTimeMs,
        };

        qAnswers.set(playerId, answerRecord);

        // Acknowledge submission to the player
        socket.emit('player:answer_recorded', {
          answerRecord,
          currentScore: player.score,
          streak: player.streak,
        });

        // Broadcast progress update to host (answers received count)
        io.to(pin).emit('game:answer_received', {
          totalAnswers: qAnswers.size,
          totalPlayers: session.players.size,
          session: getSanitizedSession(session),
        });

        // If all players have answered, auto-transition to question_ended
        if (qAnswers.size >= session.players.size && session.players.size > 0) {
          session.status = 'question_ended';
          io.to(pin).emit('game:question_ended', getSanitizedSession(session));
        }
      }
    );

    // 5. Host forces end of question / timer expires
    socket.on('host:end_question', ({ pin }: { pin: string }) => {
      const session = activeSessions.get(pin);
      if (!session || session.hostSocketId !== socket.id) return;

      session.status = 'question_ended';
      io.to(pin).emit('game:question_ended', getSanitizedSession(session));
    });

    // 6. Host shows leaderboard
    socket.on('host:show_leaderboard', ({ pin }: { pin: string }) => {
      const session = activeSessions.get(pin);
      if (!session || session.hostSocketId !== socket.id) return;

      session.status = 'leaderboard';
      io.to(pin).emit('game:leaderboard', getSanitizedSession(session));
    });

    // 7. Host advances to next question
    socket.on('host:next_question', ({ pin }: { pin: string }) => {
      const session = activeSessions.get(pin);
      if (!session || session.hostSocketId !== socket.id) return;

      const nextIndex = session.currentQuestionIndex + 1;
      if (nextIndex < session.quiz.questions.length) {
        session.currentQuestionIndex = nextIndex;
        session.status = 'question_active';
        const question = session.quiz.questions[nextIndex];
        session.questionStartTime = Date.now();
        session.questionTimeLimit = question.timeLimit;
        session.answers.set(nextIndex, new Map());

        io.to(pin).emit('game:question_started', getSanitizedSession(session));
      } else {
        // All questions completed! Trigger championship podium
        session.status = 'finished';
        const topList = Array.from(session.players.values()).sort(
          (a, b) => b.score - a.score
        );

        // Record into audit log
        completedGameAudit.unshift({
          id: session.id,
          pin: session.pin,
          quizTitle: session.quiz.title,
          participantCount: session.players.size,
          winnerName: topList[0]?.name || 'Nobody',
          topScore: topList[0]?.score || 0,
          endedAt: new Date().toISOString(),
        });

        io.to(pin).emit('game:finished', getSanitizedSession(session));
      }
    });

    // Disconnect handling
    socket.on('disconnect', () => {
      activeSessions.forEach((session, pin) => {
        // If host disconnected, keep session alive for 5 minutes for reconnection
        // If player disconnected, mark isConnected false
        session.players.forEach((p) => {
          if (p.socketId === socket.id) {
            p.isConnected = false;
            io.to(pin).emit('game:player_disconnected', {
              playerId: p.id,
              name: p.name,
            });
          }
        });
      });
    });
  });

  // ----------------------------------------------------------------
  // Vite Integration (Dev Mode & Production)
  // ----------------------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  const PORT = 3000;
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`QUIZ MASTER Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting QUIZ MASTER server:', err);
  process.exit(1);
});
