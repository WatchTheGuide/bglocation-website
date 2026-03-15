# License Portal — bglocation-website

## Przegląd

Portal licencyjny umożliwia klientom logowanie się (magic link), przeglądanie swoich licencji i generowanie kluczy licencyjnych dla bundle ID.

## Routing

| Ścieżka | Plik | Opis |
|----------|------|------|
| `/portal/login` | `src/app/portal/login/page.tsx` | Formularz logowania (magic link) |
| `/portal/verify` | `src/app/portal/verify/page.tsx` | Weryfikacja tokenu magic link |
| `/portal` | `src/app/portal/page.tsx` | Dashboard — licencje i generowanie kluczy |

## Architektura

- **Autentykacja**: Magic link (JWT HS256, 15 min TTL) → sesja cookie (`bgl_session`, 7 dni)
- **Email**: Resend + React Email templates (`src/emails/`)
- **Licencje**: RSA-2048-SHA256, format `BGL1-{payload}.{signature}`
- **Baza danych**: PostgreSQL + Prisma 7 (schema: `prisma/schema.prisma`)
- **Middleware**: Chroni `/portal/*` (oprócz `/portal/login` i `/portal/verify`)

## Uruchomienie lokalne (dev)

### 1. Uruchom bazę danych

```bash
docker compose up -d
```

PostgreSQL będzie dostępny na `localhost:5432`.

### 2. Zastosuj migrację

```bash
npx prisma migrate dev
```

### 3. Załaduj dane testowe

```bash
npx tsx prisma/seed.ts
```

Tworzy konto testowe:
- **Email**: `test@bglocation.dev`
- **Plan**: team (5 bundle ID)

### 4. Skonfiguruj `.env`

Wymagane zmienne dla pełnego testowania:

| Zmienna | Wymagana | Opis |
|---------|----------|------|
| `DATABASE_URL` | ✅ | URL do PostgreSQL |
| `AUTH_SECRET` | ✅ | Secret do JWT (dowolny string) |
| `RSA_PRIVATE_KEY` | ✅ | Klucz prywatny RSA-2048 (PEM) do podpisywania licencji |
| `RESEND_API_KEY` | ❌ | API key Resend — bez niego email będzie pominięty, a link wylogowany w konsoli |
| `NEXT_PUBLIC_BASE_URL` | ✅ | `http://localhost:3000` |

Aby wygenerować klucz RSA do dev:

```bash
npm run generate:keypair
```

Skrypt wydrukuje gotową linię do wklejenia do `.env`:

```
RSA_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEv...\n-----END PRIVATE KEY-----"
```

### 5. Uruchom dev server

```bash
npm run dev
```

### 6. Zaloguj się do portalu

1. Otwórz `http://localhost:3000/portal/login`
2. Wpisz `test@bglocation.dev` i kliknij "Send magic link"
3. **Bez Resend API key**: skopiuj link magic login z logów terminala dev serwera:
   ```
   🔗 [Dev] Magic link for test@bglocation.dev:
   http://localhost:3000/portal/verify?token=eyJhbG...
   ```
4. Otwórz skopiowany link w przeglądarce
5. Zostaniesz przekierowany na dashboard `/portal`

### 7. Testuj generowanie kluczy

Na dashboardzie:
1. Wpisz bundle ID w formacie reverse-domain (np. `com.example.app`)
2. Kliknij "Generate License Key"
3. Klucz pojawi się w tabeli i zostanie skopiowany do schowka

## Baza danych

### Docker Compose

```bash
docker compose up -d      # Start
docker compose down        # Stop
docker compose down -v     # Stop + usuń dane
```

### Prisma

```bash
npx prisma studio          # GUI do przeglądania danych (port 5555)
npx prisma migrate dev      # Zastosuj migracje
npx prisma migrate reset    # Reset bazy + re-seed
npx prisma generate         # Regeneruj klienta po zmianie schema
```

### Schema (główne modele)

- **Customer** — klient (email, plan, maxBundleIds)
- **Order** — zamówienie z Lemon Squeezy
- **License** — klucz licencyjny (bundleId, licenseKey, updatesUntil)

## Pliki portalu

| Plik | Opis |
|------|------|
| `src/app/portal/actions.ts` | Server actions (login, verify, generate key, logout) |
| `src/app/portal/login/page.tsx` | Strona logowania |
| `src/app/portal/login/login-form.tsx` | Formularz magic link |
| `src/app/portal/verify/page.tsx` | Weryfikacja tokenu |
| `src/app/portal/page.tsx` | Dashboard |
| `src/app/portal/dashboard-content.tsx` | Zawartość dashboard (licencje + generowanie) |
| `src/lib/auth.ts` | JWT magic link + sesja |
| `src/lib/db.ts` | Prisma client singleton |
| `src/lib/email.ts` | Wrapper Resend |
| `src/lib/license.ts` | Generowanie kluczy RSA-2048 |
| `src/middleware.ts` | Ochrona routes `/portal/*` |
| `src/emails/magic-link.tsx` | Template email magic link |
| `src/emails/license-key.tsx` | Template email klucz licencyjny |
| `src/emails/welcome.tsx` | Template email powitalny |
| `prisma/schema.prisma` | Schema bazy danych |
| `prisma/seed.ts` | Dane testowe |
| `docker-compose.yml` | Lokalna baza PostgreSQL |
| `scripts/generate-keypair.ts` | Generowanie pary kluczy RSA-2048 (output do `.env`) |
| `scripts/generate-license.ts` | CLI do ręcznego generowania klucza licencyjnego |
