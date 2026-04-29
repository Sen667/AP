# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

**Fripouilles** is a childcare management platform (RAM – Relais Assistants Maternels). The monorepo contains four sub-projects:

| Directory | Stack | Purpose |
|-----------|-------|---------|
| `backend/` | NestJS 11 + Prisma 7 + PostgreSQL | REST API |
| `web/` | Next.js 16 + NextAuth + Tailwind | Web frontend |
| `mobile/` | Android (Kotlin + Jetpack Compose + Ktor) | Mobile app |
| `mission6/` | JavaFX + Maven | Desktop app |

## Commands

### Backend (`cd backend`)

```bash
npm run start:dev        # dev server with watch (port 3000)
npm run build            # compile TypeScript
npm run lint             # ESLint + auto-fix
npm test                 # unit tests (Jest, rootDir: src/)
npm run test:e2e         # e2e tests
npm run test:watch       # watch mode

# Prisma
npx prisma generate      # regenerate client + types after schema changes
npx prisma migrate dev   # apply migrations
npx prisma db seed       # seed from prisma/seed.ts
npx prisma studio        # GUI at port 51212
```

### Web (`cd web`)

```bash
npm run dev     # dev server on port 3001
npm run build   # production build
npm run lint    # ESLint
```

### Mobile (`cd mobile`)

Built with Android Studio. From CLI:

```bash
./gradlew build           # build
./gradlew installDebug    # install on connected device
```

The API URL is injected from `local.properties` as `API_URL` — create this file (gitignored) before building.

### Full stack with Docker (root)

```bash
docker-compose up         # starts db, backend, web, prisma-studio
```

## Architecture

### Backend

Standard NestJS module structure. Each domain has its own directory under `src/` containing `*.module.ts`, `*.controller.ts`, `*.service.ts`, `dto/`, and `*.spec.ts` files.

Domains: `user`, `enfant`, `contrat-garde`, `suivi-garde`, `suivi-journalier`, `paie`, `personne-autorisee`, `parametre-legal`, `ateliers`, `creche`, `pdf`, `admin`.

**Auth flow:** `AuthModule` uses Passport JWT. Guards to know:
- `JwtAuthGuard` — verifies JWT, populates `req.user`
- `RolesGuard` — checks `@Roles(Role.ADMIN, ...)` decorator
- `CombinedAuthGuard` — combines both

Guards and the `@Roles()` / `@User()` decorators live in `src/auth/guards/` and `src/decorators/`.

**Prisma:** `PrismaModule`/`PrismaService` are globally shared. After any schema change, run `npx prisma generate` — types are emitted to `generated/types/` (imported as e.g. `import { Role } from 'generated/types/enums'`).

**Swagger** is available at `/api/doc` in `dev` mode only. All routes are prefixed with `/api` (except `/`, `/health`).

**Three roles:** `ADMIN`, `PARENT`, `ASSISTANT` (enum `Role` in Prisma schema). Users share a base `Utilisateur` model; role-specific data is in `ParentProfil` or `AssistantProfil` via 1-to-1 relations.

Time values (arrivals, departures, workshop start/end) are stored as **integer minutes since midnight** (e.g. `arriveeMinutes`, `debutMinutes`).

### Web

Next.js App Router with route groups:
- `(auth)` — login/register pages (no sidebar)
- `(espace)` — authenticated pages with sidebar
- `(legal)` — legal/terms pages

**Auth:** NextAuth with `CredentialsProvider`. On login, the backend JWT is stored in the NextAuth session. The custom axios instance (`app/lib/axios.instance.ts`) auto-selects base URL (`API_INTERNAL_URL` on the server, `NEXT_PUBLIC_API_URL` in the browser) and injects the Bearer token from the session.

**API layer:** all backend calls go through typed functions in `app/lib/api/*.ts`. Zod schemas live in `app/schemas/`. Types mirroring the Prisma models are in `app/types/models/`.

**UI:** PrimeReact for data tables/complex components, HeroUI + Tailwind for general layout, react-hook-form + Zod for forms.

### Mobile

Jetpack Compose UI, Ktor HTTP client for API calls. Pattern: `controller/` → `service/` (Ktor calls) → `view/screens/`. Navigation graph in `navigation/NavGraph.kt`. Auth token stored via `AuthPreferences` (DataStore).

## Environment variables

### Backend (`.env.local`)
```
NODE_ENV=dev
APP_PORT=3000
DATABASE_URL=postgres://user:password@localhost:5432/database
JWT_SECRET=
```

### Web (`.env.local`)
```
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3001
NEXT_PUBLIC_API_URL=http://localhost:3000/api
API_INTERNAL_URL=http://localhost:3000/api  # http://backend:3000/api inside Docker
```
