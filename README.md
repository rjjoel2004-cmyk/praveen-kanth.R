# QUIZ MASTER — AhaSlides-Style Live Multiplayer Quiz Platform

A high-performance, real-time interactive quiz platform built with **React, TypeScript, Express, Socket.IO, and Tailwind CSS**, featuring a premium **Black & Gold (#0B0B0B / #D4AF37)** theme, complete **Tamil & English bilingual support**, and low-latency multiplayer rooms supporting up to 50 players simultaneously.

---

## Key Features

1. **Live Multiplayer Arena (Socket.IO)**
   - Host generates a unique 6-digit game PIN (e.g. `849201`).
   - Players join instantly from mobile or desktop using the PIN.
   - Live lobby grid showing connected players and custom avatar emojis.
   - Maximum capacity of 50 competitors per room.
   - Real-time countdown timer with urgent tick sound cues when $\le 5$ seconds remain.
   - Authoritative server-side answer evaluation and speed bonus calculations (up to 50% extra points for fastest submissions + streak multipliers).
   - Live histogram bar distribution showing player vote counts per option.
   - Real-time leaderboard rankings between questions.
   - 3-tier championship podium with celebratory confetti and victory fanfares.

2. **Bilingual Localization (Tamil & English)**
   - Complete Tamil and English language switching available across all menus, buttons, questions, options, host presentation screens, player controls, and admin dashboards.
   - Unicode Tamil typography using `Noto Sans Tamil`.

3. **Audio Effects (Web Audio API Synthesizer)**
   - Zero-dependency, low-latency audio synthesizer built on the HTML5 Web Audio API:
     - Player join chime
     - Question launch fanfares
     - Countdown timer ticks & hurry-up tempo
     - Correct answer harmonious chord
     - Incorrect answer buzzer
     - Suspenseful leaderboard drum roll
     - Final championship victory fanfare
   - Toggleable mute control.

4. **Quiz Creator Studio**
   - Unlimited quiz creation and editing.
   - Rich question formats: Multiple Choice (MCQ), True/False, Multiple Select, and Image-based questions.
   - Configurable question timers (10s, 15s, 20s, 30s, 60s) and points (500 to 2000 pts).
   - Question image preview and interactive studio test preview before going live.

5. **Admin & Analytics Dashboard**
   - Live metrics: Total users, quizzes in library, games played, total participants, and active rooms.
   - Quiz management (View, Host Live, Edit, Delete).
   - User directory and role privileges (`admin`, `creator`, `user`).
   - Game session audit history recording winner names and scores.

6. **Authentication**
   - User registration and login with profile avatars.
   - Pre-configured 1-click demo accounts:
     - **Admin**: `admin@quizmaster.com` / `admin123`
     - **Creator**: `creator@quizmaster.com` / `creator123`

---

## Tech Stack & Architecture

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Canvas Confetti.
- **Backend**: Node.js, Express, Socket.IO.
- **Development Tooling**: Vite with `server.ts` middleware mode (`tsx server.ts`).

---

## Installation & Setup

### Prerequisites
- Node.js 20+
- npm 10+

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
The server will boot on `http://0.0.0.0:3000` with both Express API routes, Socket.IO WebSocket endpoints, and the Vite React app served unified on port 3000.

### 3. Build for Production
```bash
npm run build
```

### 4. Run Production Server
```bash
npm run start
```

---

## Database Schema (PostgreSQL / Supabase Compatible)

```sql
-- 1. Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'creator', 'user')),
  avatar VARCHAR(10) DEFAULT '⚡',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Quizzes Table
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  title_ta VARCHAR(255),
  description TEXT,
  description_ta TEXT,
  category VARCHAR(50) DEFAULT 'generalKnowledge',
  cover_image TEXT,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  author_name VARCHAR(100),
  times_played INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Questions Table
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  prompt TEXT NOT NULL,
  prompt_ta TEXT,
  question_type VARCHAR(20) DEFAULT 'mcq',
  time_limit INTEGER DEFAULT 20,
  points INTEGER DEFAULT 1000,
  image_url TEXT,
  explanation TEXT,
  explanation_ta TEXT
);

-- 4. Options Table
CREATE TABLE question_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  option_text_ta TEXT,
  is_correct BOOLEAN DEFAULT false
);

-- 5. Game Sessions Table
CREATE TABLE game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pin VARCHAR(6) UNIQUE NOT NULL,
  quiz_id UUID REFERENCES quizzes(id),
  host_user_id UUID REFERENCES users(id),
  status VARCHAR(30) DEFAULT 'lobby',
  participant_count INTEGER DEFAULT 0,
  winner_name VARCHAR(100),
  top_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  ended_at TIMESTAMP WITH TIME ZONE
);
```
