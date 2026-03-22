# Komponenty — bglocation-website

## Mapa komponentów

### UI Components (`src/components/ui/`)

Bazowe komponenty Shadcn — nie modyfikować bezpośrednio, dodawać nowe przez CLI:

| Komponent | Plik | Opis |
|-----------|------|------|
| Button | `button.tsx` | Przycisk z wariantami (default, outline, ghost, link) |
| Badge | `badge.tsx` | Badge / tag |
| Card | `card.tsx` | Karta z CardHeader, CardTitle, CardDescription, CardContent, CardFooter |
| Accordion | `accordion.tsx` | Rozwijane sekcje (FAQ) |
| Separator | `separator.tsx` | Linia oddzielająca |

### Landing Components (`src/components/landing/`)

| Komponent | Plik | Opis |
|-----------|------|------|
| Announcement Banner | `announcement-banner.tsx` | Banner "Coming soon" — globalny (renderowany w layout) |
| Hero | `hero.tsx` | Sekcja hero z tytułem, opisem, CTA, badge |
| Features | `features.tsx` | Grid z feature cards |
| Comparison | `comparison.tsx` | Tabela/kolumny porównania z konkurencją |
| Trust Bar | `trust-bar.tsx` | Pasek ze statystykami |
| Code Example | `code-example.tsx` | Blok z przykładem kodu |
| CTA Section | `cta-section.tsx` | Sekcja call-to-action |
| Newsletter CTA | `newsletter-cta.tsx` | Sekcja "Get notified" na landing page — email + platforma + consent |

### Newsletter Components (`src/components/newsletter/`)

| Komponent | Plik | Opis |
|-----------|------|------|
| Footer Form | `footer-form.tsx` | Formularz newsletter w footerze — email + consent + honeypot |

### Pricing Components (`src/components/pricing/`)

| Komponent | Plik | Opis |
|-----------|------|------|
| Pricing Cards | `pricing-cards.tsx` | Karty planów (Indie, Team, Enterprise) |
| Pricing FAQ | `pricing-faq.tsx` | FAQ w formie accordion |

### Docs Components (`src/components/docs/`)

Sekcje dokumentacji pluginu — renderowane jako bloki na stronie `/docs`:

| Komponent | Plik | Opis |
|-----------|------|------|
| Getting Started | `getting-started.tsx` | Instalacja, konfiguracja, start/stop tracking |
| Configuration | `configuration.tsx` | Opcje configure(), HTTP POST, adaptive distance filter |
| API Reference | `api-reference.tsx` | Tabele metod i eventów, Location interface, Geofencing API |
| Platform Guides | `platform-guides.tsx` | Setup iOS (Info.plist, background modes) + Android (permissions, foreground service) |
| Licensing | `licensing.tsx` | Trial mode, klucz licencyjny, walidacja RSA-2048 |
| Examples | `examples.tsx` | Wzorce integracji: fleet, fitness, geofencing |

### Layout Components (`src/components/layout/`)

| Komponent | Plik | Opis |
|-----------|------|------|
| Header | `header.tsx` | Nawigacja (Features, Pricing, Docs, About) + CTA button |
| Footer | `footer.tsx` | Stopka z linkami |

### About Components (`src/components/about/`)

| Komponent | Plik | Opis |
|-----------|------|------|
| About Section | `about-section.tsx` | Profil twórcy: intro, background (3 karty), expertise (9 badges), certyfikaty, kontakt |

### Admin Components (`src/app/admin/`)

| Komponent | Plik | Opis |
|-----------|------|------|
| Subscriber List | `subscribers/subscriber-list.tsx` | Tabela subskrybentów z filtrami (status, platforma), wyszukiwaniem, paginacją i usuwaniem (GDPR Art. 17) |

## Dodawanie nowych komponentów Shadcn

```bash
npx shadcn@latest add [component-name]
```

## Utility

- `src/lib/utils.ts` — eksportuje `cn()` — helper do łączenia klas Tailwind:

```typescript
import { cn } from '@/lib/utils';
// cn('px-4', condition && 'bg-blue-500') → "px-4 bg-blue-500"
```
