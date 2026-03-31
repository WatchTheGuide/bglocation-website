# Testowanie E2E — bglocation-website

## Framework

- **Playwright** 1.58.2
- Konfiguracja: `playwright.config.ts`

## Struktura testów

```
e2e/
├── fixtures/             # Fixtures Playwright (shared setup, ROUTES)
├── about.spec.ts         # Testy strony About
├── admin.spec.ts         # Testy admin panelu (auth, dashboard, customers)
├── blog.spec.ts          # Testy bloga (listing, post, RSS feed)
├── chat.spec.ts          # Testy AI chatbota
├── cookies.spec.ts       # Testy cookie consent (GDPR)
├── docs.spec.ts          # Testy docs page
├── landing.spec.ts       # Testy landing page
├── navigation.spec.ts    # Testy nawigacji, banner, framework switchera i cross-page
├── newsletter.spec.ts    # Testy newsletter (subscribe, confirm, unsubscribe, admin)
├── portal.spec.ts        # Testy portalu klienta
└── pricing.spec.ts       # Testy pricing page
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

Każdy test uruchamiany jest na obu viewportach.

---

## Testy manualne

Nie wszystkie scenariusze można pokryć automatycznie. Manualnie warto sprawdzać przede wszystkim:

- checkout i webhooki Lemon Squeezy
- wysyłkę maili przez Resend
- rendering i zachowanie SVG logo / favicon w różnych przeglądarkach
- requesty do `/api/http-test` z fizycznych aplikacji testowych lub przez ngrok
- zachowanie framework switchera przy wejściu bezpośrednio na zagnieżdżone URL z query param i anchorami

### Kiedy uruchamiać

- Przed deploy'em na produkcję
- Po zmianach w portalu klienta lub admin panelu
- Po zmianach w middleware/bezpieczeństwie
- Po aktualizacji integracji Lemon Squeezy / Resend
- Po zmianach w routingu `?framework=` lub linkach CTA

## Co testujemy

### Landing Page (`landing.spec.ts`)
- Hero section — badge frameworka, nagłówek h1, CTA buttons (Get License, Read the Docs), `npm install` snippet
- Hero nawigacja — Get License → /pricing, Read the Docs → /docs
- Trust bar — 5 statystyk (300+, 2, 5,000+, 14, <1%)
- Comparison — nagłówki kolumn (Feature, @bglocation/capacitor, @capacitor/geolocation)
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
- Footer — linki produktowe i dokumentacyjne oraz shared logo
- Mobile menu — hamburger toggle, linki w menu mobilnym, zamykanie po nawigacji
- Framework switcher — zmiana frameworka na pierwsze kliknięcie, zachowanie aktualnej ścieżki, poprawne linki w headerze i footerze
- Query canonicalization — niepoprawne lub ucięte `?framework=` są normalizowane do wspieranej wartości
- Cross-page navigation — home → pricing → docs → home (z obsługą mobile menu)

### About Page (`about.spec.ts`)
- Header — nagłówek "About", podtytuł
- Intro — imię, PMP, PhD, motywacja
- Background — 3 karty (GuideTrackee, Frontend Framework Author, Academic)
- Technical Expertise — 9 badgeów technologicznych
- Certifications — PMP #2115680, Apollo GraphQL
- Contact — Kraków, email, LinkedIn
- SEO — title, meta description

### Blog (`blog.spec.ts`)
- Listing — nagłówek "Blog", wyświetlanie kart postów
- Nawigacja — kliknięcie karty prowadzi do `/blog/[slug]`
- Post — content z `.prose`, nagłówki h2, metadata (reading time, autor)
- Back link — link "Back to blog" wraca na listing
- 404 — nieistniejący slug zwraca 404
- RSS Feed — valid RSS 2.0 XML, nagłówki `application/rss+xml`, poprawna struktura (title, items)

### Cookies (`cookies.spec.ts`)
- Cookie banner — widoczność, przyciski akceptacji/odmowy
- Polityka cookies — strona `/cookies` z treścią

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

### Framework-aware assertions

Przy testach framework switchera należy asercje wykonywać na URL oraz widocznym stanie przełącznika. Sam query param jest source of truth, więc test powinien potwierdzać zarówno canonical URL, jak i zachowany kontekst strony.
