# bglocation-website

Marketing website, framework-aware documentation, pricing, newsletter flows, customer portal, admin panel, and debug utilities for `bglocation` — a production-ready background location SDK for Capacitor and React Native.

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

## What This App Includes

- Public marketing pages: landing, docs, pricing, about, privacy, and terms
- Framework-aware navigation driven by `?framework=capacitor|react-native`
- Customer portal with magic-link authentication and license management
- Admin panel for customers and newsletter subscribers
- Newsletter subscribe / confirm / unsubscribe flows
- AI chat widget backed by `/api/chat`
- Debug HTTP endpoint at `/api/http-test` for location payload testing from mobile test apps or ngrok

## Project Structure

```
bglocation-website/
├── public/
│   └── bglocation-icon.svg   # Shared site logo and browser icon
└── src/
	├── app/
	│   ├── page.tsx          # Landing page
	│   ├── about/            # About page
	│   ├── admin/            # Admin panel (login, verify, dashboard, customers, subscribers)
	│   ├── api/
	│   │   ├── admin/        # Admin API routes
	│   │   ├── chat/         # AI chat endpoint
	│   │   ├── dev/          # Dev-only auth endpoints
	│   │   ├── http-test/    # Debug endpoint for test-app HTTP payloads
	│   │   ├── newsletter/   # Newsletter subscribe / confirm / unsubscribe
	│   │   └── webhooks/     # Lemon Squeezy webhooks
	│   ├── docs/             # Documentation page
	│   ├── newsletter/       # Confirmation / unsubscribe pages
	│   ├── portal/           # Customer portal (login, verify, dashboard)
	│   ├── pricing/          # Pricing page
	│   ├── privacy/          # Privacy policy
	│   └── terms/            # Terms of service
	├── components/
	│   ├── about/            # About page components
	│   ├── chat/             # Chat widget + quick replies
	│   ├── docs/             # Documentation sections
	│   ├── framework/        # Framework provider + switcher
	│   ├── landing/          # Landing page sections
	│   ├── layout/           # Header, footer, shared site logo
	│   ├── pricing/          # Pricing components
	│   └── ui/               # Base UI components
	├── emails/               # React Email templates
	├── generated/            # Prisma client output
	├── lib/
	│   ├── auth.ts           # JWT auth helpers
	│   ├── chat/             # AI chat prompt / formatting helpers
	│   ├── db.ts             # Prisma client
	│   ├── email.ts          # Resend helpers
	│   ├── framework.ts      # Framework option metadata + URL normalization
	│   ├── license.ts        # License formatting / helpers
	│   ├── newsletter/       # Newsletter service helpers
	│   └── utils.ts          # cn() and utility helpers
	└── middleware.ts         # Auth middleware for portal/admin
```

## Framework-Aware Navigation

The public site supports two framework modes:

- `capacitor`
- `react-native`

The active framework is stored in the `framework` query parameter and propagated across internal navigation. The website normalizes malformed, partial, or unknown values to a supported canonical value, so links, docs, pricing, and CTAs stay consistent after refreshes and direct deep links.

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

## Debug and Dev Endpoints

In development, magic link emails are bypassed with direct login endpoints:

| Endpoint | Description |
|----------|-------------|
| `GET /api/dev/login?email=test@bglocation.dev` | Log in to **Customer Portal** as the test customer |
| `GET /api/dev/admin-login?email=admin@bglocation.dev` | Log in to **Admin Panel** as the test admin |

For HTTP request debugging from mobile test apps or ngrok, the website also exposes:

| Endpoint | Description |
|----------|-------------|
| `GET /api/http-test` | Returns the expected payload shapes and endpoint purpose |
| `POST /api/http-test` | Logs the request body, payload shape, location count, and acknowledgement status |

Example request:

```bash
curl -X POST http://localhost:3000/api/http-test \
	-H 'Content-Type: application/json' \
	-d '{
		"location": {
			"latitude": 52.2297,
			"longitude": 21.0122,
			"accuracy": 5,
			"timestamp": 1700000000000
		}
	}'
```

The dev login endpoints set session cookies and redirect to the portal/admin dashboard. They are available only when `NODE_ENV !== 'production'`.

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
| `e2e/navigation.spec.ts` | Header, footer, mobile menu, framework switcher, query canonicalization |
| `e2e/newsletter.spec.ts` | Newsletter forms and confirmation flows |
| `e2e/chat.spec.ts` | AI chat widget interactions |
| `e2e/admin.spec.ts` | Admin panel (auth, dashboard, customers, license management) |
| `e2e/portal.spec.ts` | Customer portal (auth, verify, dashboard, license keys) |

## Path Aliases

```typescript
@/* → ./src/*
```
