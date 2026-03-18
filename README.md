# bglocation-website

Marketing website, documentation, customer portal, and admin panel for [capacitor-bglocation](https://github.com/WatchTheGuide/bglocation-website) — a production-ready background location tracking plugin for Capacitor 8.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind 4, Shadcn UI |
| Database | PostgreSQL 16 (Docker Compose) + Prisma 7 |
| Auth | JWT HS256 (jose) + magic link emails |
| Email | Resend + React Email |
| E2E Tests | Playwright |
| Linting | ESLint 9 |

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── about/                # About page
│   ├── docs/                 # Documentation page
│   ├── pricing/              # Pricing page
│   ├── portal/               # Customer portal (login, verify, dashboard)
│   ├── admin/                # Admin panel (login, verify, dashboard, customers)
│   └── api/
│       ├── dev/              # Dev-only auth endpoints
│       └── webhooks/         # Lemon Squeezy webhooks
├── components/
│   ├── ui/                   # Shadcn UI components
│   ├── landing/              # Landing page sections
│   ├── pricing/              # Pricing components
│   └── layout/               # Header, footer
├── emails/                   # React Email templates
├── lib/
│   ├── auth.ts               # JWT auth (portal + admin)
│   └── db.ts                 # Prisma client
└── middleware.ts              # Auth middleware (portal + admin routes)
```

## Prerequisites

- Node.js 20+
- Docker (for PostgreSQL)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the database

```bash
docker compose up -d
```

### 3. Run migrations and seed

```bash
npx prisma migrate dev
npm run db:seed
```

### 4. Set environment variables

Create a `.env` file:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/bglocation?schema=public"
JWT_SECRET="dev-secret-change-me"
RESEND_API_KEY="re_..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 5. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Dev Login Endpoints

In development, magic link emails are bypassed with direct login endpoints:

| Endpoint | Description |
|----------|-------------|
| `GET /api/dev/login?email=test@bglocation.dev` | Log in to **Customer Portal** as the test customer |
| `GET /api/dev/admin-login?email=admin@bglocation.dev` | Log in to **Admin Panel** as the test admin |

These endpoints set session cookies and redirect to the portal/admin dashboard. They are available only when `NODE_ENV !== 'production'`.

**Seeded test accounts:**

- Customer: `test@bglocation.dev` (team plan, 5 slots)
- Admin: `admin@bglocation.dev`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server (port 3000) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run test:e2e` | Playwright E2E tests |
| `npm run test:e2e:ui` | Playwright with UI mode |
| `npm run db:seed` | Seed database |
| `npm run db:reset` | Reset database (migrate reset + seed) |
| `npm run generate:keypair` | Generate RSA keypair for license signing |
| `npm run generate:license` | Generate a license key |

## E2E Tests

Tests require the dev server and database to be running:

```bash
npm run dev &
npm run test:e2e
```

Test specs:

| File | Coverage |
|------|----------|
| `e2e/landing.spec.ts` | Landing page (hero, features, comparison, CTA) |
| `e2e/pricing.spec.ts` | Pricing cards, FAQ, SEO |
| `e2e/docs.spec.ts` | Documentation page |
| `e2e/about.spec.ts` | About page |
| `e2e/navigation.spec.ts` | Header, footer, mobile menu |
| `e2e/admin.spec.ts` | Admin panel (auth, dashboard, customers, license management) |
| `e2e/portal.spec.ts` | Customer portal (auth, verify, dashboard, license keys) |

## Path Aliases

```typescript
@/* → ./src/*
```
