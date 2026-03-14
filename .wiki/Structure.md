# Struktura projektu — bglocation-website

## Drzewo plików

```
bglocation-website/
├── package.json              # Zależności i skrypty
├── next.config.ts            # Konfiguracja Next.js
├── tsconfig.json             # TypeScript (strict, ES2017, alias @/*)
├── postcss.config.mjs        # Tailwind PostCSS
├── eslint.config.mjs         # ESLint 9
├── components.json           # Konfiguracja Shadcn UI
├── playwright.config.ts      # Konfiguracja Playwright E2E
├── public/                   # Pliki statyczne
├── e2e/                      # Testy E2E
│   ├── fixtures/             # Fixtures Playwright
│   ├── landing.spec.ts       # Testy landing page
│   ├── docs.spec.ts          # Testy docs page
│   ├── pricing.spec.ts       # Testy pricing page
│   └── navigation.spec.ts   # Testy nawigacji cross-page
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Landing page (/)
│   │   ├── globals.css       # Style globalne (Tailwind imports)
│   │   ├── favicon.ico       # Favicon
│   │   ├── robots.ts         # SEO — robots.txt
│   │   ├── sitemap.ts        # SEO — sitemap.xml
│   │   ├── docs/
│   │   │   └── page.tsx      # Strona dokumentacji (/docs)
│   │   └── pricing/
│   │       └── page.tsx      # Strona cenowa (/pricing)
│   ├── components/
│   │   ├── ui/               # Shadcn UI components
│   │   │   ├── button.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── card.tsx
│   │   │   ├── accordion.tsx
│   │   │   └── separator.tsx
│   │   ├── landing/          # Komponenty landing page
│   │   │   ├── hero.tsx
│   │   │   ├── features.tsx
│   │   │   ├── comparison.tsx
│   │   │   ├── trust-bar.tsx
│   │   │   ├── code-example.tsx
│   │   │   └── cta-section.tsx
│   │   ├── docs/             # Sekcje dokumentacji
│   │   │   ├── getting-started.tsx
│   │   │   ├── configuration.tsx
│   │   │   ├── api-reference.tsx
│   │   │   ├── platform-guides.tsx
│   │   │   ├── licensing.tsx
│   │   │   └── examples.tsx
│   │   ├── pricing/          # Komponenty pricing page
│   │   │   ├── pricing-cards.tsx
│   │   │   └── pricing-faq.tsx
│   │   └── layout/           # Komponenty layout (header, footer)
│   │       ├── header.tsx
│   │       └── footer.tsx
│   └── lib/
│       └── utils.ts          # Tailwind merge utility (cn())
├── playwright-report/        # Raporty Playwright (gitignored)
└── test-results/             # Wyniki testów (gitignored)
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
| `@fontsource/ibm-plex-mono` | ^5.2.8 | IBM Plex Mono font (code blocks) |

## Zależności deweloperskie

| Pakiet | Cel |
|--------|-----|
| `@playwright/test` | Testy E2E |
| `@tailwindcss/postcss` | Tailwind CSS PostCSS plugin |
| `eslint` + `eslint-config-next` | Linting |
| `tailwindcss` | CSS framework |
| `typescript` | Type checking |
