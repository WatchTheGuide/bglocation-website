# Komponenty — bglocation-website

Mapa najważniejszych komponentów renderowanych w publicznej stronie, dokumentacji, portalu klienta i panelu admina.

## UI Components (`src/components/ui/`)

Bazowe komponenty Shadcn / Base UI używane przez sekcje marketingowe i dashboardy.

| Komponent | Plik | Opis |
|-----------|------|------|
| Button | `button.tsx` | Przycisk z wariantami, wspiera `render={<Link />}` dla linków stylizowanych jak button |
| Badge | `badge.tsx` | Badge / tag dla statusów i akcentów |
| Card | `card.tsx` | Zestaw prymitywów kart używany w hero, pricing i dashboardach |
| Accordion | `accordion.tsx` | FAQ i rozwijane sekcje |
| Separator | `separator.tsx` | Wizualny separator między sekcjami |

## Framework Components (`src/components/framework/`)

Komponenty odpowiedzialne za tryb `capacitor` / `react-native` w UI publicznym.

| Komponent | Plik | Opis |
|-----------|------|------|
| Framework Provider | `framework-provider.tsx` | Utrzymuje aktywny framework jako source of truth z URL i generuje framework-aware linki |
| Framework Switcher | `framework-switcher.tsx` | Przełącznik frameworka; renderuje segmented control albo menu zależnie od liczby opcji |

## Layout Components (`src/components/layout/`)

Wspólne komponenty ramowe używane globalnie.

| Komponent | Plik | Opis |
|-----------|------|------|
| Site Logo | `site-logo.tsx` | Wspólny lockup SVG + wordmark, używany w headerze, footerze i panelu admina |
| Header | `header.tsx` | Główna nawigacja, `FrameworkSwitcher`, CTA i menu mobilne |
| Footer | `footer.tsx` | Stopka z linkami produktowymi, dokumentacją, firmą i badge npm |

## Landing Components (`src/components/landing/`)

Sekcje landing page renderowane na `/`.

| Komponent | Plik | Opis |
|-----------|------|------|
| Announcement Banner | `announcement-banner.tsx` | Globalny banner renderowany nad headerem |
| Hero | `hero.tsx` | Sekcja otwierająca z CTA i komunikatem framework-aware |
| Features | `features.tsx` | Grid głównych możliwości SDK |
| Comparison | `comparison.tsx` | Porównanie produktu z alternatywami |
| Trust Bar | `trust-bar.tsx` | Pasek liczb i sygnałów zaufania |
| Code Example | `code-example.tsx` | Przykład integracji w kodzie |
| CTA Section | `cta-section.tsx` | Zamykające CTA do pricing/docs |

## Docs Components (`src/components/docs/`)

Sekcje strony `/docs`, współdzielące treść między frameworkami z wyborem trybu przez query param.

| Komponent | Plik | Opis |
|-----------|------|------|
| Intro | `docs-intro.tsx` | Wprowadzenie do SDK i nawigacja po sekcjach |
| Getting Started | `getting-started-section.tsx` | Instalacja, konfiguracja i start trackingu |
| Configuration | `configuration-section.tsx` | Opcje `configure()`, HTTP posting, adaptive distance filter |
| API Reference | `api-reference-section.tsx` | Metody, eventy, `Location` interface i geofencing |
| Platform Guides | `platform-guides-section.tsx` | Wymagania i setup iOS / Android |
| Licensing | `licensing-section.tsx` | Trial mode, klucz licencyjny, zasady licencjonowania |
| Examples | `examples-section.tsx` | Przykładowe scenariusze integracji |

## Pricing Components (`src/components/pricing/`)

| Komponent | Plik | Opis |
|-----------|------|------|
| Pricing Cards | `pricing-cards.tsx` | Karty planów i CTA zakupowe |
| Pricing FAQ | `pricing-faq.tsx` | FAQ cenowe w formie accordion |

## About Components (`src/components/about/`)

| Komponent | Plik | Opis |
|-----------|------|------|
| About Section | `about-section.tsx` | Profil twórcy, doświadczenie, certyfikaty i kontakt |

## Chat Components (`src/components/chat/`)

| Komponent | Plik | Opis |
|-----------|------|------|
| Chat Widget | `chat-widget.tsx` | Osadzony widget AI do pytań o produkt, pricing i docs |
| Quick Replies | `quick-replies.tsx` | Szybkie podpowiedzi pytań dla widgetu chatu |

## Admin Components (`src/app/admin/`)

W katalogu `src/app/admin/` znajdują się zarówno komponenty routingu App Router, jak i lokalne komponenty dashboardowe.

| Komponent | Plik | Opis |
|-----------|------|------|
| Admin Shell | `admin-shell.tsx` | Sidebar i topbar panelu admina z nawigacją i współdzielonym logo |
| Customer List | `customers/customer-list.tsx` | Lista klientów z filtrowaniem i przejściem do szczegółu |
| Customer Detail | `customers/[id]/customer-detail.tsx` | Widok szczegółowy klienta i licencji |
| Subscriber List | `subscribers/subscriber-list.tsx` | Lista subskrybentów newslettera z filtrami i usuwaniem |
| Login Form | `login/login-form.tsx` | Formularz logowania admina przez magic link |

## Utility

| Moduł | Plik | Opis |
|-------|------|------|
| Classname helper | `src/lib/utils.ts` | Eksportuje `cn()` do łączenia klas Tailwind |
| Framework metadata | `src/lib/framework.ts` | Definicje frameworków, helpery URL i normalizacja `?framework=` |

## Dodawanie nowych komponentów Shadcn

```bash
npx shadcn@latest add [component-name]
```
