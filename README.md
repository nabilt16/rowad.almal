# Rowad AlMal (رواد المال)

Arabic financial literacy education platform for children (Grades 4-6) in Israel.

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | Vite + React + TypeScript           |
| Backend    | Node.js + Express + TypeScript      |
| Database   | PostgreSQL + Prisma ORM             |
| Auth       | JWT + bcrypt                        |
| State      | Zustand                             |
| Validation | Zod (shared schemas)                |
| API Client | Axios + React Query                 |
| Monorepo   | npm workspaces (`shared/`, `server/`, `client/`) |

## Content

- **3 grades** (4, 5, 6) — 15 units — 58 lessons
- **32 badges** with rule-based unlocking
- **52 glossary terms** (Grades 5-6, Arabic + Hebrew)
- **57 teacher guide lesson plans**
- **15+ interactive activity types**
- **Three Buckets** savings system (Spend / Save / Give)

## Prerequisites

- **Node.js** >= 18
- **Docker** (for PostgreSQL)
- **npm** >= 9 (ships with Node 18+)

## First-Time Setup

### 1. Clone and install dependencies

```bash
git clone <repo-url> rowad.almal
cd rowad.almal
npm install
```

### 2. Start PostgreSQL

```bash
docker-compose up -d
```

This starts a PostgreSQL 16 container on port 5432 with:
- User: `rowad`
- Password: `rowad123`
- Database: `rowad_almal`

Verify it's running:

```bash
docker ps
# Should show rowad-postgres container
```

### 3. Configure environment

The server `.env` file is pre-configured for local development. If you need to change anything:

```bash
# server/.env is already created with these defaults:
DATABASE_URL="postgresql://rowad:rowad123@localhost:5432/rowad_almal?schema=public"
JWT_SECRET="dev-secret-change-in-production"
JWT_EXPIRES_IN="7d"
PORT=3001
NODE_ENV=development
ADMIN_EMAIL="admin@rowad.almal"
ADMIN_PASSWORD="admin123"
```

To start fresh or customize, copy from the example:

```bash
cp .env.example server/.env
```

### 4. Extract content from HTML reference files

This parses the 3 original HTML files and produces structured JSON:

```bash
npx tsx scripts/extract-content.ts
```

Expected output:
```
Grade 4: 5 units, 19 lessons, 8 badges
Grade 5: 5 units, 19 lessons, 12 badges, 23 glossary terms
Grade 6: 5 units, 20 lessons, 12 badges, 29 glossary terms
```

Optionally validate the extraction:

```bash
npx tsx scripts/validate-content.ts
```

### 5. Build the shared package

The shared package must be built before the server can import it:

```bash
npm run build -w shared
```

### 6. Generate Prisma client and run migrations

```bash
cd server
npx prisma generate
npx prisma migrate dev --name init
```

This creates all 17 database tables (User, Grade, Unit, Lesson, Badge, etc.).

### 7. Seed the database

```bash
npx tsx prisma/seed.ts
```

This loads into the database:
- **Admin user** — `admin@rowad.almal` / `admin123`
- **3 grades**, **15 units**, **58 lessons** with full content
- **32 badges** with requirement rules
- **52 glossary terms** (Grades 5-6)
- **57 teacher guide lessons**

Go back to the project root:

```bash
cd ..
```

### 8. Start the development servers

```bash
npm run dev
```

This starts both servers concurrently:
- **Backend** — http://localhost:3001
- **Frontend** — http://localhost:5173

Open http://localhost:5173 in your browser.

## Default Accounts

| Role    | Email               | Password   |
|---------|---------------------|------------|
| Admin   | admin@rowad.almal   | admin123   |

Register a new account through the UI to create a student account.

## Quick Setup (copy-paste)

```bash
# Full setup in one go (run from project root)
npm install
docker-compose up -d
npx tsx scripts/extract-content.ts
npm run build -w shared
cd server
npx prisma generate
npx prisma migrate dev --name init
npx tsx prisma/seed.ts
cd ..
npm run dev
```

## Project Structure

```
rowad.almal/
├── package.json                 # npm workspaces root
├── docker-compose.yml           # PostgreSQL for dev
├── reference-files/             # Original HTML files (3 grades)
├── scripts/
│   ├── extract-content.ts       # HTML → JSON extraction
│   ├── validate-content.ts      # Content validation
│   └── output/                  # Extracted JSON files
├── shared/                      # Shared types, validators, constants
│   └── src/
│       ├── types/               # TypeScript interfaces
│       ├── validators/          # Zod schemas
│       └── constants/           # Activity types, grade config, badge rules
├── server/                      # Express backend
│   ├── prisma/
│   │   ├── schema.prisma        # Database schema (17 tables)
│   │   └── seed.ts              # Database seeder
│   └── src/
│       ├── app.ts               # Express app entry point
│       ├── middleware/           # auth, validate, errorHandler
│       ├── routes/              # REST API routes
│       ├── services/            # Business logic
│       └── utils/               # jwt, password, personalize
└── client/                      # Vite + React frontend
    └── src/
        ├── api/                 # Axios API modules
        ├── stores/              # Zustand stores
        ├── hooks/               # Custom React hooks
        ├── components/
        │   ├── layout/          # AppShell, Header, NavBar
        │   ├── lessons/         # LessonBanner, StoryCard, ConceptCard, QuizCard
        │   ├── activities/      # 8 activity type components
        │   ├── progress/        # ProgressPanel, BadgeGrid
        │   ├── buckets/         # BucketsSetup, BucketsTracker, BucketCard
        │   ├── onboarding/      # OnboardingOverlay, ProfileDisplay
        │   ├── glossary/        # GlossaryPanel, TermCard
        │   ├── guide/           # TeacherGuide, GuideLessonCard
        │   └── shared/          # ProtectedRoute, LoadingSpinner, ErrorBoundary
        ├── pages/               # Route pages
        ├── styles/              # Global CSS
        └── utils/               # audio, confetti, personalize
```

## API Endpoints

### Auth
```
POST /api/auth/register    { email, password, name }
POST /api/auth/login       { email, password }
GET  /api/auth/me          (authenticated)
```

### Content
```
GET  /api/grades
GET  /api/grades/:number
GET  /api/grades/:number/units/:unitNum/lessons
GET  /api/lessons/:id
```

### Progress
```
GET  /api/progress/grade/:number
POST /api/progress/lesson/:id/quiz
POST /api/progress/lesson/:id/activity
GET  /api/progress/badges/:gradeNumber
```

### Buckets
```
GET    /api/buckets
POST   /api/buckets/setup
POST   /api/buckets/income
POST   /api/buckets/use
DELETE /api/buckets
```

### Profile, Glossary, Guide, Admin
```
GET/PUT /api/profile
GET     /api/glossary/:gradeNumber
GET     /api/guide/:gradeNumber
GET     /api/admin/users          (admin only)
GET     /api/admin/stats          (admin only)
```

## Common Commands

```bash
# Development
npm run dev                      # Start server + client
npm run build                    # Production build (shared → server → client)

# Database
cd server
npx prisma migrate dev --name <name>   # Create migration
npx prisma studio                       # Open DB browser
npx tsx prisma/seed.ts                  # Re-seed data
npx prisma migrate reset --force        # Drop all tables and re-migrate

# Content
npx tsx scripts/extract-content.ts      # Re-extract from HTML
npx tsx scripts/validate-content.ts     # Validate extracted content

# Type checking
npm run build -w shared          # Build shared types
cd server && npx tsc --noEmit    # Check server
cd client && npx tsc --noEmit    # Check client
```

## Resetting Everything

To start completely fresh:

```bash
docker-compose down -v           # Delete database volume
docker-compose up -d             # Fresh database
cd server
npx prisma migrate dev --name init
npx tsx prisma/seed.ts
cd ..
npm run dev
```

## Parent Dashboard

Access at `/parent` after logging in. Protected by a 4-digit PIN (default: **1234**). Shows the child's progress across all grades, earned badges, and savings status.

## Notes

- All UI text is in Arabic with RTL layout
- Glossary terms include Hebrew translations
- Currency is Israeli Shekel (₪)
- The personalization engine replaces story character names with the student's real name and adjusts Arabic verb gender conjugation (24 patterns)
