# Struktura projektu — bglocation-website

Aktualna mapa katalogów dla strony publicznej, portalu, panelu admina, endpointów API i warstwy framework-aware.

## Drzewo plików

```
bglocation-website/
├── package.json                 # Zależności i skrypty
├── next.config.ts               # Konfiguracja Next.js
├── tsconfig.json                # TypeScript + alias @/*
├── postcss.config.mjs           # Tailwind PostCSS
├── eslint.config.mjs            # ESLint 9
├── components.json              # Konfiguracja Shadcn UI
├── playwright.config.ts         # Konfiguracja Playwright E2E
├── prisma/                      # Schema, migracje, seed
├── public/
│   └── bglocation-icon.svg      # Główne logo / ikona przeglądarki
├── e2e/
│   ├── fixtures/                # Shared helpers i ROUTES
│   ├── about.spec.ts            # Testy About
│   ├── admin.spec.ts            # Testy panelu admina
│   ├── blog.spec.ts             # Testy bloga (listing, post, RSS)
│   ├── chat.spec.ts             # Testy chatu AI
│   ├── cookies.spec.ts          # Testy cookie consent (GDPR)
│   ├── docs.spec.ts             # Testy docs page
│   ├── landing.spec.ts          # Testy landing page
│   ├── navigation.spec.ts       # Testy nagłówka, stopki i framework switchera
│   ├── newsletter.spec.ts       # Testy newslettera
│   ├── portal.spec.ts           # Testy portalu klienta
│   └── pricing.spec.ts          # Testy pricing page
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout + metadata icons + FrameworkProvider + ChatWidget
│   │   ├── page.tsx             # Landing page
│   │   ├── globals.css          # Style globalne
│   │   ├── favicon.ico          # Favicon fallback
│   │   ├── robots.ts            # robots.txt
│   │   ├── sitemap.ts           # sitemap.xml
│   │   ├── about/
│   │   ├── admin/
│   │   │   ├── admin-shell.tsx  # Sidebar/topbar panelu admina
│   │   │   ├── customers/       # Lista + szczegóły klientów
│   │   │   ├── login/           # Login admina
│   │   │   ├── subscribers/     # Lista subskrybentów
│   │   │   └── verify/          # Weryfikacja tokenu admina
│   │   ├── api/
│   │   │   ├── admin/           # Admin API
│   │   │   ├── chat/            # AI chat endpoint
│   │   │   ├── dev/             # Dev login endpoints
│   │   │   ├── http-test/       # Debug endpoint dla payloadów lokalizacji
│   │   │   ├── newsletter/      # Newsletter API
│   │   │   └── webhooks/        # Lemon Squeezy webhook
│   │   ├── blog/
│   │   │   ├── page.tsx         # Listing postów blogowych
│   │   │   ├── [slug]/
│   │   │   │   └── page.tsx     # Pojedynczy post (GFM Markdown)
│   │   │   └── feed.xml/
│   │   │       └── route.ts     # RSS 2.0 feed
│   │   ├── cookies/             # Polityka cookies (GDPR)
│   │   ├── docs/
│   │   │   ├── layout.tsx       # Shared layout: sidebar + breadcrumbs + prev/next
│   │   │   ├── page.tsx         # /docs — hub z kartami sekcji
│   │   │   ├── quick-start/     # /docs/quick-start
│   │   │   ├── background-tracking/  # /docs/background-tracking
│   │   │   ├── http-posting/    # /docs/http-posting
│   │   │   ├── geofencing/      # /docs/geofencing
│   │   │   ├── permissions/     # /docs/permissions
│   │   │   ├── adaptive-filter/ # /docs/adaptive-filter
│   │   │   ├── debug-mode/      # /docs/debug-mode
│   │   │   ├── licensing/       # /docs/licensing
│   │   │   ├── platform-differences/  # /docs/platform-differences
│   │   │   ├── error-codes/     # /docs/error-codes
│   │   │   ├── examples/        # /docs/examples
│   │   │   ├── troubleshooting/ # /docs/troubleshooting
│   │   │   ├── migration/       # /docs/migration
│   │   │   └── api-reference/   # /docs/api-reference
│   │   ├── newsletter/          # Confirm / unsubscribe pages
│   │   ├── portal/              # Portal klienta
│   │   ├── pricing/
│   │   ├── privacy/
│   │   └── terms/
│   ├── components/
│   │   ├── about/               # About page sections
│   │   ├── blog/                # Post card + post layout
│   │   ├── chat/                # Chat widget + quick replies
│   │   ├── docs/                # Sekcje dokumentacji (14 podstron + sidebar + breadcrumbs + prev/next + hub)
│   │   ├── framework/           # Provider + switcher frameworka
│   │   ├── landing/             # Sekcje landing page
│   │   ├── layout/              # Header, footer, site logo, cookie banner
│   │   ├── pricing/             # Pricing cards + FAQ
│   │   └── ui/                  # Bazowe komponenty UI
│   ├── emails/                  # React Email templates
│   ├── generated/               # Wygenerowany Prisma client
│   ├── lib/
│   │   ├── auth.ts              # Auth helpery JWT / sesje
│   │   ├── chat/                # Helpery promptów i message formatting
│   │   ├── db.ts                # Prisma client singleton
│   │   ├── email.ts             # Wysyłka maili
│   │   ├── framework.ts         # Metadane frameworków + normalizacja query param
│   │   ├── http-test/           # Rate limiter i file logger dla /api/http-test
│   │   ├── license.ts           # Helpery licencyjne
│   │   ├── markdown.tsx         # Async Markdown renderer (unified + rehype-pretty-code)
│   │   ├── newsletter/          # Logika newslettera (rate limiter, cleanup)
│   │   ├── posts.ts             # Parsowanie postów blogowych (frontmatter, reading time)
│   │   └── utils.ts             # `cn()` i drobne helpery
│   ├── content/
│   │   └── posts/               # Pliki GFM Markdown z frontmatter (źródło bloga)
│   └── middleware.ts            # Ochrona tras portal/admin
├── playwright-report/           # Raporty Playwright (gitignored)
└── test-results/                # Wyniki testów (gitignored)
```

## Zależności produkcyjne

| Pakiet | Wersja | Cel |
|--------|--------|-----|
| `next` | 16.1.6 | Framework |
| `react` | 19.2.3 | UI library |
| `react-dom` | 19.2.3 | React DOM renderer |
| `@base-ui/react` | ^1.3.0 | Base UI components |
| `shadcn` | ^4.0.6 | UI component system |
| `tailwind-merge` | ^3.5.0 | Intelligent class merging |
| `clsx` | ^2.1.1 | Conditional class names |
| `class-variance-authority` | ^0.7.1 | Variant-based component styling |
| `lucide-react` | ^0.577.0 | Icon library |
| `tw-animate-css` | ^1.4.0 | CSS animations for Tailwind |
| `@fontsource/ibm-plex-sans` | ^5.2.8 | IBM Plex Sans font |
| `@fontsource/ibm-plex-mono` | ^5.2.7 | IBM Plex Mono font (code blocks) |
| `gray-matter` | ^4.0.3 | Parsowanie YAML frontmatter z plików Markdown |
| `unified` | ^11 | Pipeline przetwarzania Markdown |
| `remark-parse` | ^11 | Parser Markdown (remark) |
| `remark-gfm` | ^4 | Rozszerzenia GFM (tabele, listy zadań, strikethrough) |
| `remark-rehype` | ^11 | Konwersja Markdown AST → HTML AST |
| `rehype-pretty-code` | ^0.14 | Syntax highlighting (shiki, theme: github-light) |
| `rehype-stringify` | ^10 | Serializacja HTML AST do stringa |

## Moduły o największym znaczeniu

| Moduł | Lokalizacja | Rola |
|-------|-------------|------|
| Framework routing | `src/components/framework/` + `src/lib/framework.ts` | Framework-aware navigation, canonicalizacja `?framework=` |
| Branding | `src/components/layout/site-logo.tsx` + `public/bglocation-icon.svg` | Wspólne logo serwisu i ikona metadata |
| Portal / admin auth | `src/lib/auth.ts`, `src/app/portal/`, `src/app/admin/`, `src/middleware.ts` | Sesje, linki magiczne, ochrona tras |
| HTTP debug | `src/app/api/http-test/route.ts` | Odbiór i logowanie payloadów lokalizacyjnych z test app |
| AI chat | `src/app/api/chat/route.ts`, `src/components/chat/`, `src/lib/chat/` | Chat widget i backend odpowiedzi |

## Zależności deweloperskie

| Pakiet | Cel |
|--------|-----|
| `@playwright/test` | Testy E2E |
| `@tailwindcss/postcss` | Tailwind CSS PostCSS plugin |
| `eslint` + `eslint-config-next` | Linting |
| `tailwindcss` | CSS framework |
| `typescript` | Type checking |
