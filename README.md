# ⚽ KALASO PREDICTIONS

**Kalaso Predictions** is a modern, motion-powered, mobile-first full-stack football betting tips and predictions web application. Designed for speed, simplicity, and trust, all registered users see the same feed of 100% free researched betting tips, with administrative control isolated in a hidden, role-protected Super Admin dashboard.

---

## 🌟 Key Features

- **Public Landing Page & Motion Banners:**
  - High-impact animated hero banner with real-time accuracy counter.
  - Dynamic ticker marquee for match announcements and warnings.
  - Live preview of today's free predictions and active matches.
  - Multibet odds calculator tool.
  - Prominent 25+ age restriction and responsible gambling policy banners.

- **100% Free Tips Feed:**
  - Full match predictions with league, home/away teams, tip choice, odds, confidence ratings, and analyst notes.
  - Transparent outcome badges (`WON`, `LOST`, `VOID`, `PENDING`).
  - Instant client-side filtering by result, league, and search terms.

- **VIP Packages & Rolling Groups Showcase:**
  - Odd 10 (100k/mo), Odd 4 (80k/mo), Odd 3 (70k/mo), Odd 2 (60k/mo).
  - High Stakers (50k/mo), Katambula Group (150k - 2 mos), All Groups Pass (350k - 3 mos).
  - Direct 1-click WhatsApp subscription activation to manager **Teddy (0745090955)**.

- **Live Matches Tracker:**
  - Real-time score board, match minute ticker, status, and linked tip synchronization.

- **Hidden Super Admin Dashboard (`/super-admin`):**
  - Protected by server-side JWT verification and `SUPER_ADMIN` role checks.
  - **API-Football Autocomplete Search:** Type a team name to auto-populate league, teams, time, date, and score (with fail-soft manual override).
  - 1-Click prediction outcome updater (`WON`, `LOST`, `VOID`, `PENDING`).
  - Live matches publishing and score updates.
  - User management (search, suspend, activate).
  - System audit logs and announcement ticker editor.

- **Official Channels & Socials:**
  - WhatsApp: `+256745090955` (Teddy) & `+256782534994`
  - WhatsApp Channel: `https://whatsapp.com/channel/0029VbBuWfjBqbrHcUdjiE36`
  - TikTok: `https://vt.tiktok.com/ZS4QWXTWs/`

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons, Canvas Confetti |
| **Backend API** | Next.js Serverless Route Handlers, Node.js REST API, JWT Authentication, Bcrypt Password Hashing |
| **Database & ORM** | PostgreSQL (Supabase / Neon / Local), Drizzle ORM, Prisma Schema compatibility |
| **Data Synchronization** | API-Football V3 Provider with modular `SportsDataService` fallback |
| **Deployment** | Vercel (Production Ready), GitHub |

---

## 📦 Database Architecture

The application includes relational PostgreSQL tables:

1. `users`: Stores user accounts, hashed passwords, roles (`USER`, `SUPER_ADMIN`), and status (`ACTIVE`, `SUSPENDED`).
2. `predictions`: All free tips published by Super Admin, including odds, league, confidence, notes, status, and results.
3. `live_matches`: Real-time score tracker optionally linked to predictions.
4. `audit_logs`: Security and administrative action trail (logins, prediction creations, result changes, suspensions).
5. `system_settings`: Key-value configuration for live marquee announcement text and contacts.

---

## 🚀 Getting Started & Local Development

### 1. Prerequisites
- Node.js 18+ or 20+
- PostgreSQL database instance (or Supabase project)

### 2. Clone the Repository
```bash
git clone https://github.com/your-username/kalaso-predictions.git
cd kalaso-predictions
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Set your values in `.env`:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/kalaso_db
JWT_SECRET=your-secure-jwt-secret-key-here
SPORTS_API_KEY=your_api_football_key_optional
```

### 5. Initialize Database & Run Development Server
The application automatically creates required tables and seeds default admin and sample data on startup.
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Default Credentials

- **Super Admin Account:**
  - **Email:** `admin@kalaso.com`
  - **Password:** `admin123`
  - **Portal Route:** `/super-admin` *(Not linked in regular user UI)*

- **Sample User Account:**
  - **Email:** `teddy@kalaso.com`
  - **Password:** `user123`

---

## ☁️ Supabase PostgreSQL Setup Instructions

1. Go to [https://supabase.com](https://supabase.com) and create a new project.
2. Under **Project Settings** > **Database**, locate the **Connection string** section.
3. Copy the **URI** connection string.
4. In your `.env` file (and in Vercel Environment Variables), set:
   ```env
   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres?sslmode=require
   DIRECT_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres?sslmode=require
   ```

---

## ⚡ API-Football (Sports Data) Setup

1. Register at [API-Sports / API-Football](https://v3.football.api-sports.io/).
2. Obtain your free or pro API key.
3. Add it to your server environment:
   ```env
   SPORTS_API_URL=https://v3.football.api-sports.io
   SPORTS_API_KEY=your_api_sports_key
   ```
4. *Note:* If the key is omitted or quota is exceeded, Kalaso Predictions gracefully falls back to the built-in curated provider so that match lookup and prediction creation never fail (fail-soft design).

---

## 🚀 Vercel Deployment Instructions

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "feat: complete Kalaso Predictions fullstack app"
   git push origin main
   ```
2. Log in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your `kalaso-predictions` GitHub repository.
4. Add the following **Environment Variables** in Vercel:
   - `DATABASE_URL` (Supabase Connection string)
   - `JWT_SECRET` (A strong random 32+ character string)
   - `SPORTS_API_KEY` (Your API-Football key, if available)
   - `NODE_ENV=production`
5. Click **Deploy**. Vercel will build the frontend and serverless API endpoints automatically.

---

## ⚠️ Responsible Gambling Statement

> *"These are researched games but not fixed, we just have a high percentage of winning but the game remains, can win or lose. Stake responsibly. These matches have only been researched and given max attention but can win or lose, stake responsibly."*
>
> **Age Limit:** Strictly **25+ years only**. Not for school children.
