# BAAZ GG

The official platform for Pakistan's leading FGC esports organization.

## Stack
- Next.js 15 (App Router) + React 19
- Tailwind CSS v4
- NestJS backend in `backend/`
- PostgreSQL + Prisma for the custom CMS
- Framer Motion
- start.gg API for live brackets

## Run Frontend
```bash
npm install
cp .env.local.example .env.local
npm run dev
```

## Run Backend
```bash
cd backend
cp .env.example .env
npm install
npm run prisma:migrate
npm run seed
npm run dev
```

For local PostgreSQL setup on Windows, run:

```powershell
cd backend
.\scripts\init-local-postgres.ps1
```

## Structure
- `src/app` - frontend routes
- `src/components` - UI primitives and sections
- `src/lib` - frontend helpers and seed data fixtures
- `backend/src` - NestJS API modules
- `backend/prisma` - database schema, migrations, and seed script
- `backend/uploads` - local uploaded images

## Content Model
- `post` - posts created from templates
- `postTemplate` - approved post templates
- `contentPlacement` - page/slot placement controls
- `event` - past and upcoming tournaments
- `game` - Tekken 7, Tekken 8, KoF XV, etc.
- `player` - competitor profiles
- `sponsor` - brand partners, tiered
- `circuit` - multi-stage seasons (PTL 2026)
- `circuitStage` - individual stages within a circuit
- `pointsStanding` - leaderboard rows
- `stream` - broadcast schedule

The custom CMS API starts empty except for seeded templates and a seeded admin user. Until CMS content is populated, fixtures in `src/lib/seed.ts` keep the public site rendering for development and the pitch demo.
