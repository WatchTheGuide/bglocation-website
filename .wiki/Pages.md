# Strony — bglocation-website

## Routing (App Router)

| Ścieżka | Plik | Opis |
|----------|------|------|
| `/` | `src/app/page.tsx` | Landing page — główna strona marketingowa |
| `/about` | `src/app/about/page.tsx` | Strona o twórcy (profil, certyfikaty, kontakt) |
| `/docs` | `src/app/docs/page.tsx` | Strona dokumentacji pluginu |
| `/pricing` | `src/app/pricing/page.tsx` | Strona cenowa z planami subskrypcji |
| `/portal/login` | `src/app/portal/login/page.tsx` | Formularz logowania magic link |
| `/portal/verify` | `src/app/portal/verify/page.tsx` | Weryfikacja tokenu magic link |
| `/portal` | `src/app/portal/page.tsx` | Dashboard — licencje i generowanie kluczy |
| `/privacy` | `src/app/privacy/page.tsx` | Polityka prywatności (GDPR Art. 13) |
| `/terms` | `src/app/terms/page.tsx` | Regulamin usługi (perpetual license) |
| `/api/webhooks/lemon-squeezy` | `src/app/api/webhooks/lemon-squeezy/route.ts` | Webhook handler Lemon Squeezy (dynamic) |
| `/api/newsletter/subscribe` | `src/app/api/newsletter/subscribe/route.ts` | Zapis na newsletter (POST) — honeypot, rate limit, double opt-in |
| `/api/newsletter/confirm` | `src/app/api/newsletter/confirm/route.ts` | Potwierdzenie subskrypcji (POST) — token + expiry check |
| `/api/newsletter/unsubscribe` | `src/app/api/newsletter/unsubscribe/route.ts` | Wypisanie z newslettera (POST) — token bez expiry, RFC 8058 |
| `/api/admin/subscribers/[id]` | `src/app/api/admin/subscribers/[id]/route.ts` | Usunięcie subskrybenta (DELETE) — GDPR Art. 17 |

## Layout

- `src/app/layout.tsx` — Root layout (AnnouncementBanner + header + footer + children + Lemon Squeezy script)
- `src/components/layout/header.tsx` — Nagłówek z nawigacją (Features, Pricing, Docs, About) + CTA "Get License"
- `src/components/layout/footer.tsx` — Stopka z linkami

## Landing Page (`/`)

Sekcje (w kolejności od góry):

| Sekcja | Komponent | Opis |
|--------|-----------|------|
| Announcement Banner | `announcement-banner.tsx` | Banner "Coming soon" (globalny — w layout, nie w page) |
| Hero | `hero.tsx` | Nagłówek, opis produktu, CTA buttons, badge Capacitor 8 |
| Trust Bar | `trust-bar.tsx` | Statystyki zaufania (unit testy, platformy, itp.) |
| Features | `features.tsx` | Grid z kluczowymi możliwościami pluginu |
| Code Example | `code-example.tsx` | Przykład kodu integracji |
| Comparison | `comparison.tsx` | Porównanie z konkurencją (3 kolumny) |
| CTA Section | `cta-section.tsx` | Call-to-action z przyciskami |

## Docs Page (`/docs`)

Pełna strona dokumentacji pluginu. Na górze grid kart z anchor linkami do sekcji, poniżej 6 rozbudowanych sekcji oddzielonych separatorami.

### Karty nawigacyjne

Grid 6 kart z ikonami i opisami — każda prowadzi do odpowiedniej sekcji via `#anchor`:

| Karta | Anchor | Opis |
|-------|--------|------|
| Getting Started | `#getting-started` | Instalacja i szybki start |
| Configuration | `#configuration` | Opcje configure(), HTTP, adaptive filter |
| API Reference | `#api-reference` | Metody, eventy, interfejsy |
| Platform Guides | `#platform-guides` | Konfiguracja iOS i Android |
| Licensing | `#licensing` | Trial mode, klucz licencyjny, RSA |
| Examples | `#examples` | Wzorce integracji (fleet, fitness, geofencing) |

### Sekcje dokumentacji

| Sekcja | Komponent | Opis |
|--------|-----------|------|
| Getting Started | `docs/getting-started.tsx` | 3 kroki: Install → Configure & Start → Stop |
| Configuration | `docs/configuration.tsx` | Tabela opcji, HTTP posting, adaptive filter, Android notification |
| API Reference | `docs/api-reference.tsx` | 10 metod, 11 eventów, Location interface, Geofencing API |
| Platform Guides | `docs/platform-guides.tsx` | iOS (Info.plist, Background Modes, SLC) + Android (permissions, Foreground Service, battery) |
| Licensing | `docs/licensing.tsx` | Trial mode (30 min + 1h cooldown), klucz w capacitor.config.ts, RSA-2048 |
| Examples | `docs/examples.tsx` | Fleet/Delivery, Fitness/Running, Geofencing POI |

## About Page (`/about`)

Strona profilu twórcy — wymagana przez platformy płatności (Stripe/LS) do spełnienia KYC/compliance.

| Sekcja | Opis |
|--------|------|
| Header | Tytuł "About" + podtytuł (centered, max-w-6xl — unifikacja z docs/pricing) |
| Intro | Imię, PMP, PhD, motywacja |
| Background | 3 karty: GuideTrackee (co-founder), Spry Framework (internal framework), Academic (PhD Math) |
| Technical Expertise | 9 badges technologicznych |
| Certifications | PMP #2115680, Apollo Graph Developer Professional |
| Contact | Kraków, email, LinkedIn |

**Komponent:** `src/components/about/about-section.tsx`

## Pricing Page (`/pricing`)

| Sekcja | Komponent | Opis |
|--------|-----------|------|
| Header | (inline) | Tytuł + komunikat "no license key needed" |
| Pricing Cards | `pricing-cards.tsx` | Plany: Indie, Team, Enterprise |
| FAQ | `pricing-faq.tsx` | Często zadawane pytania (accordion) |

### Plany cenowe

| Plan | Cena | Audience |
|------|------|----------|
| **Indie** | Niższa cena | Solo developers |
| **Team** | Średnia cena | Małe zespoły |
| **Enterprise** | Kontakt | Duże organizacje |

## Privacy Policy (`/privacy`)

Polityka prywatności zgodna z GDPR Art. 13 — 9 sekcji:

| Sekcja | Opis |
|--------|------|
| Data Controller | Szymon Walczak, Kraków |
| What We Sell | Software product, perpetual licenses |
| What Data We Collect | Purchase data (via LS), newsletter (consent + IP), portal (magic link), AI chat (via OpenAI) |
| Data Retention | Pending 7d, unsubscribed 30d, active until unsub, customer per regulations |
| Third-Party Processors | Lemon Squeezy, Resend, Vercel, OpenAI, Neon — tabela z lokalizacjami |
| Your Rights | GDPR Art. 15-21, prawo do wycofania zgody |
| Cookies | Tylko essential (session, admin session) |
| Changes | Powiadomienie subskrybentów newslettera |
| Contact | hello@bglocation.dev |

## Terms of Service (`/terms`)

Regulamin usługi — 13 sekcji dotyczących sprzedaży pluginu (software product, nie SaaS):

| Sekcja | Opis |
|--------|------|
| Overview | Software product, nie SaaS |
| License | ELv2, perpetual, tiers: Indie (1 app), Team (5), Factory (20), Enterprise (unlimited) |
| Purchase | Lemon Squeezy MoR, ceny netto |
| Refund Policy | Brak automatycznych refundów, case-by-case |
| Trial Mode | 30 min + 1h cooldown |
| IP | Własność intelektualna Szymon Walczak |
| Your Data | Plugin nie przetwarza danych lokalizacyjnych end-userów |
| Support | hello@bglocation.dev, best-effort |
| Disclaimer | As is |
| Liability | Max = kwota licencji |
| Governing Law | Polska / Kraków |
