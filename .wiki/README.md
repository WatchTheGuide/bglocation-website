# Dokumentacja — bglocation-website

Strona marketingowa, dokumentacja framework-aware, pricing, newsletter, portal klienta, panel admina i endpointy pomocnicze dla `bglocation`.

## Spis treści

| Dokument | Opis |
|----------|------|
| [Structure.md](Structure.md) | Aktualna struktura projektu — App Router, API routes, komponenty, `lib/`, assety |
| [Pages.md](Pages.md) | Opis stron publicznych, bloga, portalu, admina oraz endpointów API i routingu `?framework=` |
| [Components.md](Components.md) | Mapa komponentów — blog, framework switcher, chat, layout, landing, pricing, admin |
| [Testing.md](Testing.md) | Strategia testowania E2E, coverage nawigacji i scenariusze framework-aware |
| [Portal.md](Portal.md) | Portal klienta — auth, dashboard, magic link, uruchomienie lokalne |

## Stack technologiczny

| Warstwa | Technologia | Wersja |
|---------|-------------|--------|
| **Framework** | Next.js (App Router) | 16.1.6 |
| **React** | React | 19.2.3 |
| **CSS** | Tailwind CSS | 4 |
| **UI Components** | Shadcn + Base UI | — |
| **Icons** | Lucide React | 0.577.0 |
| **Animations** | tw-animate-css | 1.4.0 |
| **Blog** | gray-matter + unified + rehype-pretty-code | — |
| **Testy E2E** | Playwright | 1.58.2 |
| **Linting** | ESLint | 9 |
| **TypeScript** | TypeScript | 5 |

## Komendy

```bash
npm run dev              # Next.js dev server (port 3000)
npm run build            # Build produkcyjny
npm run start            # Serwer produkcyjny
npm run lint             # ESLint
npm run test:e2e         # Playwright E2E
npm run test:e2e:ui      # Playwright z UI
npm run generate:keypair # Generuj parę kluczy RSA-2048
npm run generate:license # Generuj klucz licencyjny z CLI
```

## Aliasy ścieżek

```typescript
@/* → ./src/*
```
