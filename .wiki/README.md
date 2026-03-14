# Dokumentacja — bglocation-website

Strona marketingowa / dokumentacja / pricing dla pluginu `capacitor-bglocation`.

## Spis treści

| Dokument | Opis |
|----------|------|
| [Structure.md](Structure.md) | Pełna struktura projektu — katalogi, pliki, zależności |
| [Pages.md](Pages.md) | Opis stron (Landing, Docs, Pricing) i ich komponentów |
| [Components.md](Components.md) | Mapa komponentów — UI, landing, pricing, layout |
| [Testing.md](Testing.md) | Strategia testowania E2E (Playwright) |

## Stack technologiczny

| Warstwa | Technologia | Wersja |
|---------|-------------|--------|
| **Framework** | Next.js (App Router) | 16.1.6 |
| **React** | React | 19.2.3 |
| **CSS** | Tailwind CSS | 4 |
| **UI Components** | Shadcn + Base UI | — |
| **Icons** | Lucide React | 0.577.0 |
| **Animations** | tw-animate-css | 1.4.0 |
| **Testy E2E** | Playwright | 1.58.2 |
| **Linting** | ESLint | 9 |
| **TypeScript** | TypeScript | 5 |

## Komendy

```bash
npm run dev            # Next.js dev server (port 3000)
npm run build          # Build produkcyjny
npm run start          # Serwer produkcyjny
npm run lint           # ESLint
npm run test:e2e       # Playwright E2E
npm run test:e2e:ui    # Playwright z UI
```

## Aliasy ścieżek

```typescript
@/* → ./src/*
```
