# Strony — bglocation-website

Opis routingu App Router, sekcji publicznych oraz endpointów API wykorzystywanych przez website, portal, admin i aplikacje testowe.

## Routing publiczny

| Ścieżka | Plik | Opis |
|---------|------|------|
| `/` | `src/app/page.tsx` | Landing page produktu |
| `/about` | `src/app/about/page.tsx` | Strona o twórcy i tle projektu |
| `/docs` | `src/app/docs/page.tsx` | Hub dokumentacji SDK (karty sekcji) |
| `/docs/quick-start` | `src/app/docs/quick-start/page.tsx` | Quick Start — od zera do trackingu |
| `/docs/background-tracking` | `src/app/docs/background-tracking/page.tsx` | Background Location Tracking |
| `/docs/http-posting` | `src/app/docs/http-posting/page.tsx` | HTTP Posting & Offline Buffer |
| `/docs/geofencing` | `src/app/docs/geofencing/page.tsx` | Geofencing Guide |
| `/docs/permissions` | `src/app/docs/permissions/page.tsx` | Permissions & Setup (iOS/Android) |
| `/docs/adaptive-filter` | `src/app/docs/adaptive-filter/page.tsx` | Adaptive Distance Filter |
| `/docs/debug-mode` | `src/app/docs/debug-mode/page.tsx` | Debug Mode |
| `/docs/licensing` | `src/app/docs/licensing/page.tsx` | Licensing & Trial |
| `/docs/platform-differences` | `src/app/docs/platform-differences/page.tsx` | Platform Differences (iOS/Android/Web) |
| `/docs/error-codes` | `src/app/docs/error-codes/page.tsx` | Error Codes Reference |
| `/docs/examples` | `src/app/docs/examples/page.tsx` | Use Case Examples |
| `/docs/troubleshooting` | `src/app/docs/troubleshooting/page.tsx` | Troubleshooting FAQ |
| `/docs/migration` | `src/app/docs/migration/page.tsx` | Migration from capacitor-community |
| `/docs/api-reference` | `src/app/docs/api-reference/page.tsx` | API Reference (metody, eventy, interfejsy) |
| `/pricing` | `src/app/pricing/page.tsx` | Cennik i FAQ |
| `/privacy` | `src/app/privacy/page.tsx` | Polityka prywatności |
| `/terms` | `src/app/terms/page.tsx` | Regulamin licencyjny |
| `/blog` | `src/app/blog/page.tsx` | Lista artykułów blogowych |
| `/blog/[slug]` | `src/app/blog/[slug]/page.tsx` | Pojedynczy post blogowy (GFM Markdown) |
| `/blog/feed.xml` | `src/app/blog/feed.xml/route.ts` | RSS 2.0 feed |
| `/newsletter/confirm` | `src/app/newsletter/confirm/page.tsx` | Potwierdzenie subskrypcji newslettera |
| `/newsletter/unsubscribe` | `src/app/newsletter/unsubscribe/page.tsx` | Wypisanie z newslettera |

## Portal klienta i panel admina

| Ścieżka | Plik | Opis |
|---------|------|------|
| `/portal` | `src/app/portal/page.tsx` | Dashboard klienta z licencjami i kluczami |
| `/portal/login` | `src/app/portal/login/page.tsx` | Formularz logowania magic link |
| `/portal/verify` | `src/app/portal/verify/route.ts` | Weryfikacja tokenu logowania klienta |
| `/admin` | `src/app/admin/page.tsx` | Dashboard administracyjny |
| `/admin/login` | `src/app/admin/login/page.tsx` | Formularz logowania admina |
| `/admin/verify` | `src/app/admin/verify/route.ts` | Weryfikacja tokenu logowania admina |
| `/admin/customers` | `src/app/admin/customers/page.tsx` | Lista klientów |
| `/admin/customers/[id]` | `src/app/admin/customers/[id]/page.tsx` | Szczegóły klienta i licencji |
| `/admin/subscribers` | `src/app/admin/subscribers/page.tsx` | Lista subskrybentów newslettera |

## Endpointy API

| Ścieżka | Plik | Opis |
|---------|------|------|
| `/api/chat` | `src/app/api/chat/route.ts` | Endpoint AI chat widgetu |
| `/api/dev/login` | `src/app/api/dev/login/route.ts` | Dev-only login do portalu klienta |
| `/api/dev/admin-login` | `src/app/api/dev/admin-login/route.ts` | Dev-only login do panelu admina |
| `/api/http-test` | `src/app/api/http-test/route.ts` | Debug endpoint do testowania requestów HTTP z aplikacji testowych |
| `/api/newsletter/subscribe` | `src/app/api/newsletter/subscribe/route.ts` | Zapis na newsletter |
| `/api/newsletter/confirm` | `src/app/api/newsletter/confirm/route.ts` | Potwierdzenie subskrypcji |
| `/api/newsletter/unsubscribe` | `src/app/api/newsletter/unsubscribe/route.ts` | Wypisanie z newslettera |
| `/api/admin/subscribers/[id]` | `src/app/api/admin/subscribers/[id]/route.ts` | Usuwanie subskrybenta przez admina |
| `/api/webhooks/lemon-squeezy` | `src/app/api/webhooks/lemon-squeezy/route.ts` | Webhook zakupowy Lemon Squeezy |

## Routing framework-aware

Publiczne strony `/`, `/docs`, `/pricing` i `/about` wspierają query param `?framework=`.

- Wspierane wartości: `capacitor`, `react-native`
- Source of truth znajduje się w URL, nie w local state ani localStorage
- Przełącznik zachowuje aktualną ścieżkę i anchor przy zmianie frameworka
- Niepoprawne lub ucięte wartości są normalizowane do wspieranej formy kanonicznej

Za tę warstwę odpowiadają `src/components/framework/framework-provider.tsx`, `src/components/framework/framework-switcher.tsx` oraz `src/lib/framework.ts`.

## Layout globalny

- `src/app/layout.tsx` — root layout z `FrameworkProvider`, `AnnouncementBanner`, `Header`, `Footer`, `ChatWidget` i metadata icons ustawionymi na `public/bglocation-icon.svg`
- `src/components/layout/header.tsx` — nawigacja publiczna (Features, Pricing, Docs, Blog, About), `FrameworkSwitcher`, CTA i menu mobilne
- `src/components/layout/footer.tsx` — linki produktowe (w tym Blog i RSS), dokumentacyjne i firmowe
- `src/app/admin/admin-shell.tsx` — layout panelu admina z sidebar navigation i wspólnym logo

## Landing Page (`/`)

Sekcje renderowane kolejno od góry:

| Sekcja | Komponent | Opis |
|--------|-----------|------|
| Announcement Banner | `announcement-banner.tsx` | Globalny banner renderowany w layoucie |
| Hero | `hero.tsx` | Główny komunikat produktu, CTA, wyróżnienie frameworka |
| Trust Bar | `trust-bar.tsx` | Liczby, sygnały zaufania i stabilności |
| Features | `features.tsx` | Zestaw kluczowych możliwości SDK |
| Code Example | `code-example.tsx` | Fragment integracji w kodzie |
| Comparison | `comparison.tsx` | Porównanie z alternatywami |
| CTA Section | `cta-section.tsx` | Końcowe CTA do pricing/docs |

## Docs Page (`/docs`)

Strona dokumentacji z anchor navigation i sekcjami opisującymi instalację, konfigurację, API, platformy, licencjonowanie i przykłady.

| Sekcja | Komponent | Opis |
|--------|-----------|------|
| Intro | `docs/docs-intro.tsx` | Wprowadzenie do SDK i nawigacja po sekcjach |
| Getting Started | `docs/getting-started-section.tsx` | Instalacja i pierwszy start |
| Configuration | `docs/configuration-section.tsx` | `configure()`, HTTP posting, adaptive filter |
| API Reference | `docs/api-reference-section.tsx` | Metody, eventy, `Location`, geofencing |
| Platform Guides | `docs/platform-guides-section.tsx` | Konfiguracja iOS i Android |
| Licensing | `docs/licensing-section.tsx` | Trial mode i klucz licencyjny |
| Examples | `docs/examples-section.tsx` | Przykłady wdrożeń |

## Pricing Page (`/pricing`)

| Sekcja | Komponent | Opis |
|--------|-----------|------|
| Header | inline | Tytuł strony i komunikat o modelu licencji |
| Pricing Cards | `pricing-cards.tsx` | Karty planów i CTA zakupowe |
| FAQ | `pricing-faq.tsx` | Często zadawane pytania |

## About Page (`/about`)

Strona prezentująca twórcę, doświadczenie techniczne, certyfikaty i kontakt, używana również jako warstwa zaufania dla procesów sprzedażowych.

## Blog (`/blog`)

Sekcja blogowa oparta na plikach GFM Markdown w repozytorium (`src/content/posts/*.md`). Bez bazy danych — pliki Markdown dają wersjonowanie i code review.

### Listing (`/blog`)

- Server Component, statycznie generowany
- Wyświetla posty posortowane od najnowszego (tylko `published: true`)
- Każdy post jako `PostCard` z tytułem, opisem, datą, tagami i estimated reading time
- Responsive grid: 1 kolumna (mobile) → 2-3 kolumny (desktop)
- Pusty stan z komunikatem informacyjnym
- RSS feed link w `<head>` (`<link rel="alternate" type="application/rss+xml">`)

### Post (`/blog/[slug]`)

- Server Component z async rendering Markdown
- Pipeline: `remark-parse` → `remark-gfm` → `remark-rehype` → `rehype-pretty-code` (theme: `github-light`) → `rehype-stringify`
- Nagłówek: tytuł, data, autor, tagi, estimated reading time
- Open Graph metadata per post (`generateMetadata` z dynamic params)
- `canonical_url` z frontmatter jako `<link rel="canonical">`
- Link "Back to Blog" z ikoną strzałki
- 404 dla nieistniejących slugów
- `generateStaticParams` dla ISR

### RSS Feed (`/blog/feed.xml`)

- Route Handler zwracający valid RSS 2.0 XML
- Zawiera tytuł, link, opis, datę, autora i kategorie (tagi) dla każdego posta
- `Content-Type: application/rss+xml; charset=utf-8`

### Frontmatter

Każdy post w `src/content/posts/*.md` używa YAML frontmatter:

```yaml
title: "Tytuł posta"
slug: "slug-posta"
description: "Krótki opis"
date: "2026-04-01"
tags: ["capacitor", "react-native"]
published: true
author: "Imię Nazwisko"
cover_image: null
canonical_url: "https://bglocation.dev/blog/slug-posta"
```

## HTTP Test Endpoint (`/api/http-test`)

Endpoint debugowy przyjmuje `GET`, `POST` i `OPTIONS`.

- `GET` zwraca przykładowe payloady i opis przeznaczenia endpointu
- `POST` loguje body requestu, typ payloadu, liczbę lokalizacji oraz status potwierdzenia odbioru
- Obsługiwane są zarówno payloady z pojedynczym `location`, jak i z `locations[]`
- CORS jest konfigurowalny: w produkcji domyślnie brak `Access-Control-Allow-Origin`, chyba że ustawiono `NEXT_PUBLIC_HTTP_TEST_ALLOWED_ORIGIN` (konkretny origin), a endpoint może opcjonalnie wymagać `HTTP_TEST_SECRET`
