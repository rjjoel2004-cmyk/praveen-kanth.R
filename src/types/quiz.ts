/**
 * Type definitions for QUIZ MASTER.
 */

export type QuestionType = 'mcq' | 'trueFalse' | 'multiSelect' | 'image';

export type QuizCategory =
  | 'generalKnowledge'
  | 'bibleQuiz'
  | 'educational'
  | 'scienceTech'
  | 'custom';

export interface QuestionOption {
  id: string;
  text: string;
  textTa?: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  text: string;
  textTa?: string;
  type: QuestionType;
  timeLimit: number; // in seconds, e.g. 15, 20, 30
  points: number; // default 1000
  imageUrl?: string;
  options: QuestionOption[];
  explanation?: string;
  explanationTa?: string;
}

export interface Quiz {
  id: string;
  title: string;
  titleTa?: string;
  description: string;
  descriptionTa?: string;
  category: QuizCategory;
  coverImage?: string;
  questions: Question[];
  createdBy: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
  timesPlayed: number;
}

export interface Player {
  id: string;
  socketId?: string;
  name: string;
  avatar: string; // Emoji
  score: number;
  correctCount: number;
  answersCount: number;
  streak: number;
  lastResponseTimeMs: number;
  isConnected: boolean;
  rank?: number;
}

export interface PlayerAnswerSubmission {
  playerId: string;
  questionIndex: number;
  selectedOptionIds: string[];
  submissionTimeMs: number; // timestamp when submitted
}

export interface PlayerAnswerResult {
  playerId: string;
  questionIndex: number;
  isCorrect: boolean;
  pointsEarned: number;
  speedBonus: number;
  totalQuestionPoints: number;
  selectedOptionIds: string[];
  responseTimeSec: number;
}

export type GameStatus =
  | 'lobby'
  | 'question_active'
  | 'question_ended'
  | 'leaderboard'
  | 'finished';

export interface GameSessionPublic {
  id: string;
  pin: string;
  quizId: string;
  quizTitle: string;
  quizTitleTa?: string;
  quizCategory: QuizCategory;
  status: GameStatus;
  currentQuestionIndex: number;
  totalQuestions: number;
  currentQuestion?: {
    id: string;
    text: string;
    textTa?: string;
    type: QuestionType;
    timeLimit: number;
    points: number;
    imageUrl?: string;
    explanation?: string;
    explanationTa?: string;
    options: Array<{ id: string; text: string; textTa?: string }>;
    // correct answers are omitted on active question for security!
  };
  revealedCorrectOptionIds?: string[];
  optionCounts?: Record<string, number>;
  questionStartTime: number;
  questionTimeLimit: number;
  players: Player[];
  playerCount: number;
  maxPlayers: number;
  topWinners?: Player[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'creator' | 'user';
  avatar: string;
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  totalQuizzes: number;
  totalGamesPlayed: number;
  totalParticipants: number;
  activeLiveRooms: number;
}
