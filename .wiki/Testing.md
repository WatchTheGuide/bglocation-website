# Testowanie E2E — bglocation-website

## Framework

- **Playwright** 1.58.2
- Konfiguracja: `playwright.config.ts`

## Struktura testów

```
e2e/
├── fixtures/             # Fixtures Playwright (shared setup, ROUTES)
├── about.spec.ts         # Testy strony About
├── landing.spec.ts       # Testy landing page
├── docs.spec.ts          # Testy docs page
├── pricing.spec.ts       # Testy pricing page
└── navigation.spec.ts   # Testy nawigacji, banner, cross-page
```

## Komendy

```bash
npm run test:e2e       # Uruchom wszystkie testy E2E
npm run test:e2e:ui    # Uruchom Playwright z UI
```

## Wzorzec testów

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should [expected behavior]', async ({ page }) => {
    await page.goto('/');
    
    // Assertions
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('[data-testid="feature"]')).toHaveCount(6);
  });
});
```

## Projekty Playwright

| Projekt | Viewport | Opis |
|---------|----------|------|
| `chromium` | desktop (domyślny) | Testy na desktopowej przeglądarce |
| `mobile` | 375×667 | Testy na mobilnym viewporcie |

Każdy test uruchamiany jest na obu viewportach (237 testów łącznie).

---

## Testy manualne

Nie wszystkie scenariusze można pokryć automatycznie — integracja z Lemon Squeezy (webhook, checkout), wysyłka e-maili (Resend), i cross-browser rendering wymagają weryfikacji manualnej.

### Plan testów manualnych

Pełny plan: `.testing/WEBSITE-MANUAL-TEST-PLAN.md`

- **90 scenariuszy** w 18 sekcjach
- **Widoki**: Desktop (1440×900) + Mobile (375×667)
- **Pokrycie**: 3 epiki (EPIC-019, EPIC-025, EPIC-026)
- **Szacowany czas**: ~6-8h desktop + ~3-4h mobile

### Proces wykonania

1. Skopiuj `.testing/EXECUTION-TEMPLATE.md` do `.testing/runs/YYYY-MM-DD-website-{widok}.md`
2. Wypełnij metadane sesji (przeglądarka, rozdzielczość, środowisko)
3. Skopiuj checklistę ze środka planu testów (sekcja "Checklist wykonania")
4. Realizuj scenariusze — zaznaczaj `[x]` przy pass
5. Przy fail: dokumentuj bug w sekcji "Zgłoszone błędy" raportu
6. Po sesji: wypełnij podsumowanie z metrykami pass/fail/skip

### Kiedy uruchamiać

- Przed deploy'em na produkcję
- Po zmianach w portalu klienta lub admin panelu
- Po zmianach w middleware/bezpieczeństwie
- Po aktualizacji integracji Lemon Squeezy / Resend

## Co testujemy

### Landing Page (`landing.spec.ts`)
- Hero section — badge Capacitor 8, nagłówek h1, CTA buttons (Get License, Read the Docs), `npm install` snippet
- Hero nawigacja — Get License → /pricing, Read the Docs → /docs
- Trust bar — 5 statystyk (300+, 2, 5,000+, 14, <1%)
- Comparison — nagłówki kolumn (Feature, capacitor-bglocation, @transistorsoft)
- Code example — blok z przykładowym kodem
- CTA section — heading, dwa CTA buttons
- SEO — title, meta description

### Docs Page (`docs.spec.ts`)
- Header — nagłówek "Documentation", "Quick Install" z komendą npm
- Doc section cards — 6 kart nawigacyjnych
- Getting Started — 3 kroki (Install, Configure & Start, Stop Tracking)
- Configuration — tabela opcji rdzeniowych (5 opcji), sekcja HTTP Posting
- API Reference — tabela Methods (10), tabela Events (11), Location interface, sekcja Geofencing
- Platform Guides — iOS guide (Info.plist, Background Modes), Android guide (Foreground Service, Two-Step Permission Flow)
- Licensing — Trial Mode info, License Key konfiguracja
- Examples — 3 wzorce (Fleet/Delivery, Fitness/Running, Geofencing POI)
- SEO — title, meta description

### Pricing Page (`pricing.spec.ts`)
- Header — nagłówek, komunikat "no license key needed"
- Pricing cards — 3 plany (Indie $199/yr, Team $299/yr, Enterprise Custom)
- Early adopter prices — $149/yr, $229/yr
- Feature lists — 5 wspólnych cech z checkmarks
- License note — komunikat o ewaluacji
- CTA buttons — Buy License (Indie, Team), Contact Us (Enterprise)
- FAQ — nagłówek, 5+ pytań, rozwijane odpowiedzi
- SEO — title, meta description

### Navigation (`navigation.spec.ts`)
- Announcement Banner — "Coming soon" widoczny na landing, docs, pricing; linki do `/docs` i `/pricing`
- Header desktop — 4 linki nav (Features, Pricing, Docs, About), CTA "Get License"
- Footer — 3 kolumny nagłówków (Product, Documentation, Legal), About link
- Mobile menu — hamburger toggle, linki w menu mobilnym, zamykanie po nawigacji
- Cross-page navigation — home → pricing → docs → home (z obsługą mobile menu)

### About Page (`about.spec.ts`)
- Header — nagłówek "About", podtytuł
- Intro — imię, PMP, PhD, motywacja
- Background — 3 karty (GuideTrackee, Frontend Framework Author, Academic)
- Technical Expertise — 9 badgeów technologicznych
- Certifications — PMP #2115680, Apollo GraphQL
- Contact — Kraków, email, LinkedIn
- SEO — title, meta description

## Ważne wzorce w testach

### Base UI Button + Link

Shadcn Button z `render={<Link>}` renderuje `<a role="button">`. W testach należy używać `getByRole('button')`, NIE `getByRole('link')`.

### CardTitle

Shadcn CardTitle renderuje `<div data-slot="card-title">`, NIE heading. W testach: `locator('[data-slot="card-title"]')`.

### Strict mode

Playwright w strict mode wymaga jednoznacznych selektorów. Dla tekstu pojawiającego się w wielu elementach:
- `.first()` — pierwszy pasujący element
- `{ exact: true }` — dokładne dopasowanie tekstu
- `getByRole('heading', { name: '...' })` — dla nagłówków
- Scoping do sekcji: `page.locator('#section-id').getByText('...')`

### Mobile viewport

Desktop nav (`hidden md:flex`) jest niewidoczna na mobile. Helper `openMenuIfMobile()` sprawdza widoczność hamburgera i otwiera menu przed nawigacją.
