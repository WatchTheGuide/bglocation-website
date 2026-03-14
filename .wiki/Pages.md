# Strony — bglocation-website

## Routing (App Router)

| Ścieżka | Plik | Opis |
|----------|------|------|
| `/` | `src/app/page.tsx` | Landing page — główna strona marketingowa |
| `/docs` | `src/app/docs/page.tsx` | Strona dokumentacji pluginu |
| `/pricing` | `src/app/pricing/page.tsx` | Strona cenowa z planami subskrypcji |

## Layout

- `src/app/layout.tsx` — Root layout (header + footer + children)
- `src/components/layout/header.tsx` — Nagłówek z nawigacją + CTA "Get License"
- `src/components/layout/footer.tsx` — Stopka z linkami

## Landing Page (`/`)

Sekcje (w kolejności od góry):

| Sekcja | Komponent | Opis |
|--------|-----------|------|
| Hero | `hero.tsx` | Nagłówek, opis produktu, CTA buttons, badge Capacitor 8 |
| Features | `features.tsx` | Grid z kluczowymi możliwościami pluginu |
| Comparison | `comparison.tsx` | Porównanie z konkurencją (3 kolumny) |
| Trust Bar | `trust-bar.tsx` | Statystyki zaufania (unit testy, platformy, itp.) |
| Code Example | `code-example.tsx` | Przykład kodu integracji |
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
