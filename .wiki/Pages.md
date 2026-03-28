# Strony — bglocation-website

Opis routingu App Router, sekcji publicznych oraz endpointów API wykorzystywanych przez website, portal, admin i aplikacje testowe.

## Routing publiczny

| Ścieżka | Plik | Opis |
|---------|------|------|
| `/` | `src/app/page.tsx` | Landing page produktu |
| `/about` | `src/app/about/page.tsx` | Strona o twórcy i tle projektu |
| `/docs` | `src/app/docs/page.tsx` | Publiczna dokumentacja SDK |
| `/pricing` | `src/app/pricing/page.tsx` | Cennik i FAQ |
| `/privacy` | `src/app/privacy/page.tsx` | Polityka prywatności |
| `/terms` | `src/app/terms/page.tsx` | Regulamin licencyjny |
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
- `src/components/layout/header.tsx` — nawigacja publiczna, `FrameworkSwitcher`, CTA i menu mobilne
- `src/components/layout/footer.tsx` — linki produktowe, dokumentacyjne i firmowe
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
| Getting Started | `docs/getting-started.tsx` | Instalacja i pierwszy start |
| Configuration | `docs/configuration.tsx` | `configure()`, HTTP posting, adaptive filter |
| API Reference | `docs/api-reference.tsx` | Metody, eventy, `Location`, geofencing |
| Platform Guides | `docs/platform-guides.tsx` | Konfiguracja iOS i Android |
| Licensing | `docs/licensing.tsx` | Trial mode i klucz licencyjny |
| Examples | `docs/examples.tsx` | Przykłady wdrożeń |

## Pricing Page (`/pricing`)

| Sekcja | Komponent | Opis |
|--------|-----------|------|
| Header | inline | Tytuł strony i komunikat o modelu licencji |
| Pricing Cards | `pricing-cards.tsx` | Karty planów i CTA zakupowe |
| FAQ | `pricing-faq.tsx` | Często zadawane pytania |

## About Page (`/about`)

Strona prezentująca twórcę, doświadczenie techniczne, certyfikaty i kontakt, używana również jako warstwa zaufania dla procesów sprzedażowych.

## HTTP Test Endpoint (`/api/http-test`)

Endpoint debugowy przyjmuje `GET`, `POST` i `OPTIONS`.

- `GET` zwraca przykładowe payloady i opis przeznaczenia endpointu
- `POST` loguje body requestu, typ payloadu, liczbę lokalizacji oraz status potwierdzenia odbioru
- Obsługiwane są zarówno payloady z pojedynczym `location`, jak i z `locations[]`
- CORS jest otwarty, żeby uprościć użycie przez ngrok i aplikacje testowe
