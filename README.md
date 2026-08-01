# Titan Fitness — AI Gym Management Platform

A full-stack gym management platform with AI-powered coaching, built with **Next.js 16**, **React 19**, **TypeScript**, **Tailwind CSS v4**, **Prisma**, **PostgreSQL**, and **better-auth**.

Titan Fitness covers the complete member journey — marketing site, authentication (email + OTP), a 16-page member dashboard, a full admin panel (11 pages), real LLM-powered AI coach/workout generator/nutritionist (with rule-based fallback), Stripe checkout, gamification (points, badges, streaks, leaderboard, challenges), and referrals.

---

## ✨ Features

### Marketing site
- Landing page with animated hero, stats counter, testimonials, transformation gallery, pricing, FAQ
- Programs & trainers (dynamic SSG pages with seed data)
- Blog (posts, comments, likes, bookmarks, categories), gallery, contact
- Legal pages: Terms, Privacy, Refund Policy
- PWA assets (manifest, icons, og-image)

### Auth (`better-auth`)
- Email + password sign-up/sign-in, **email verification via 6-digit OTP** (hashed, 5-min expiry, 3 attempts)
- Password reset two ways: **magic link (JWT)** or **OTP code**
- Google OAuth (needs keys), session cookie cache, admin plugin (roles: `MEMBER` / `ADMIN` / `SUPER_ADMIN`)

### Member dashboard — 16 pages (`/dashboard/*`)
Overview · Workouts (sessions, PRs, exercise library) · Nutrition (meals, water, macros) · Notifications · Classes (booking, waitlist) · Attendance (check-in) · Membership · Payments · Leaderboard · Challenges · Referrals · Profile · Progress (weight chart, measurements) · AI Chat · AI Workout Generator · AI Nutritionist

### Admin panel — 11 pages (`/admin/*`, role-guarded)
Overview (stats) · Reports (revenue + attendance charts) · Members (search, edit) · Programs · Classes · Coupons · Tickets (reply/status) · Blog Posts · Challenges · Branches · Settings

### AI features (`/dashboard/ai/*`)
- **AI Coach chat** — member profile injected into the prompt
- **Workout Generator** — structured output picked from the real 44-exercise DB library, resolves names back to real IDs so plans can be saved
- **AI Nutritionist** — 7-day meal plan with macros
- Provider: OpenAI via AI SDK v7 (`@ai-sdk/openai`), model `gpt-4o-mini` by default (`AI_MODEL` env), cost tracked per request
- **Automatic fallback** to built-in rule-based generators when no API key or the LLM call fails
- All usage logged to `AIUsage` (model, tokens, cost, duration, status)

### Payments
- **Stripe Checkout** (real) with coupon discounts and webhook (`/api/payments/webhook`)
- **Mock mode** — instant membership activation when Stripe keys are missing (app fully works without keys)
- Coupons, payment history, referrals (points rewarded)

### Gamification
Points (dashboard ring), badges (12+ achievements), streaks, check-in streaks, weekly leaderboard, challenges (joinable, progress bars)

---

## 🧱 Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16.2.12 (App Router, Turbopack) |
| UI | React 19, TypeScript, Tailwind CSS v4 |
| Animations | framer-motion 12 |
| Forms/validation | react-hook-form + zod |
| Data | Prisma 6.16 + PostgreSQL 16 |
| Auth | better-auth 1.6 (email+password, email OTP plugin, admin plugin) |
| AI | AI SDK v7 + `@ai-sdk/openai` |
| Payments | Stripe SDK 22 |
| State | Zustand (scalar selectors only!) + TanStack Query |
| Emails | Resend (REST) |
| Testing | Vitest (18 tests), Playwright (manual UI checks) |
| CI | GitHub Actions workflow included |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ and npm
- PostgreSQL 16 running locally

### 1. Install & configure
```bash
npm install
cp .env.example .env    # fill in values (see below)
npx prisma migrate deploy
npm run db:seed         # seed data + test accounts
```

### 2. Environment variables (`.env`)
```env
DATABASE_URL="postgresql://shahbaz:1234@localhost:5432/titan_fitness"
BETTER_AUTH_SECRET="your-secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# AI (optional — without it, rule-based fallbacks are used)
OPENAI_API_KEY="sk-..."
AI_MODEL="gpt-4o-mini"

# Stripe (optional — without it, mock instant-activation checkout)
STRIPE_SECRET_KEY="sk_live_...  or  sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_..."
STRIPE_WEBHOOK_SECRET="whsec_..."   # from: stripe listen --forward-to localhost:3000/api/payments/webhook

# Email (optional — OTP/link emails are skipped with a console warning)
RESEND_API_KEY="re_..."

# Optional: Google OAuth, Cloudinary
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

### 3. Run
```bash
npm run dev          # http://localhost:3000
npm run build && npm run start   # production
```

### Test accounts (seed, password `Titan@12345`)
| Role | Email |
|---|---|
| Super Admin | `admin@titanfitness.com` |
| Member | `member@titanfitness.com` |
| Member | `marcus@titanfitness.com` |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/            # login, register, verify-email (OTP), forgot/reset password
│   ├── (marketing)/       # home, programs, trainers, blog, pricing, FAQ, contact, legal
│   ├── (dashboard)/       # 16 member pages (dashboard/*)
│   ├── admin/             # 11 admin pages (role-guarded)
│   └── api/               # ~95 route handlers
│       ├── auth/          # better-auth handler, /api/auth/me
│       ├── ai/            # chat, workout-generator, nutritionist
│       ├── admin/         # stats, members, programs, classes, coupons, tickets, blog, challenges, branches, settings, reports
│       ├── payments/      # plans, checkout, webhook, membership, history, referrals, coupons
│       └── ...            # workouts, classes, bookings, attendance, nutrition, content, search, me/*
├── components/
│   ├── ui/                # design system (button, card, input, select, badges, skeleton…)
│   ├── layout/            # navbar (marketing), dashboard/admin layouts, footer
│   ├── dashboard/         # page components (16)
│   ├── admin/             # page components (12)
│   └── marketing/         # landing sections
├── lib/
│   ├── api.ts             # ApiError, requireUser/requireRole/requireAdmin, rate limit, audit
│   ├── auth.ts            # better-auth config (OTP plugin)
│   ├── auth-client.ts     # client auth
│   ├── api-client.ts      # typed fetch + React Query hooks
│   ├── ai.ts              # OpenAI factory, cost estimator
│   ├── stripe.ts          # Stripe factory + webhook secret
│   ├── email.ts           # Resend templates (link + OTP)
│   └── validators/        # zod schemas per domain
├── services/              # business logic (12 files, one per domain)
│   ├── ai.ts              # LLM + fallback chat/generator/nutritionist
│   ├── payments.ts        # checkout, webhook handler, membership activation
│   └── ...                # members, workouts, nutrition, bookings, attendance, gamification, notifications, content, search, admin
├── stores/ui-store.ts     # zustand (use SCALAR selectors — see gotchas)
├── hooks/use-user.ts      # auth session hook
└── proxy.ts               # middleware: cookie-cache/proxy fix
prisma/
├── schema.prisma          # 56 models
└── migrations/
```

---

## 🔐 Key Flows

### OTP email verification
1. Sign up → OTP email sent automatically (`sendOnSignUp` + plugin override)
2. `/verify-email` — enter email → "Send Verification Code" → 6-digit box → verify
3. `verifyEmail` returns a session token → user lands on dashboard
4. Fallback: magic-link (`?token=`) still handled on the same page

### Password reset (two options)
- **Link**: forgot-password → "Send Reset Link" (JWT magic link, 1h)
- **OTP**: forgot-password → "Send Reset Code" → `/reset-password?email=…` → code + new password

### Stripe checkout
1. Member clicks a plan → `POST /api/payments/checkout`
2. Stripe mode: `{ mode: "stripe", url }` → redirect to Stripe Hosted Checkout
3. Webhook `checkout.session.completed` → membership activated + payment marked SUCCEEDED (idempotent)
4. Return URL shows success banner: `/dashboard/membership?checkout=success`
5. Mock mode (no keys): membership activates instantly, frontend never notices

### AI plan generation
- Workout generator: LLM picks exercises **only from the DB library** (prompt-listed), names are re-resolved to real `exerciseId`s → "Save plan" always works
- Everything logs to `AIUsage`; no key → rule-based output with identical shape

---

## 🧪 Testing & Quality

```bash
npm run typecheck     # tsc --noEmit
npm run lint          # eslint .
npm test              # vitest (18 tests)
npm run build         # production build (128 static pages)
```

Playwright is installed as a devDependency for browser UI sweeps:
```bash
npx playwright install chromium
```

CI: `.github/workflows/ci.yml` (typecheck + lint + tests on push/PR).

---

## ⚠️ Known Gotchas (documented pain)

- **Zustand**: never return a new object/array from a selector — `useUIStore((s) => [a, b])` caused an infinite re-render that blanked **every marketing page** ("Maximum update depth exceeded"). Use one scalar selector per field.
- **framer-motion v12**: memoize `variants` objects (`useMemo`) and multi-value `useTransform` callbacks (`useCallback`) — recreating them per render can loop.
- **better-auth + emailOTP plugin** breaks `session.user` additional-fields type inference → `/api/auth/me` casts to an explicit interface (runtime unaffected).
- **better-auth client OTP methods** are `authClient.emailOtp.sendVerificationOtp / verifyEmail / requestPasswordReset / resetPassword` (path prefix stripped + camelCase).
- **Stripe SDK v22**: don't pass `apiVersion` (types reject it; SDK pins its own).
- **AI route fallback**: never trust provider calls — every LLM path is wrapped in try/catch with rule-based fallback so the app never breaks without keys.
- **Rate limiting** uses `rateLimitByUser(userId, limit, windowMs)` — 3 args.
- **Prisma enums** differ from intuition: `AIStatus` = SUCCESS/FAILED/RATE_LIMITED; `PaymentMethod` has no STRIPE (use `CARD`); `TicketStatus` = OPEN/IN_PROGRESS/RESOLVED/CLOSED.

---

## 📈 Roadmap / Status

| Phase | Status |
|---|---|
| 0 — Foundation (env, DB, auth, seed, PWA, tests, CI) | ✅ `59e1236` |
| 1 — Services + API routes (~95) | ✅ `0b9dbdd` |
| 2 — User dashboard (16 pages) | ✅ `8234d9b` |
| 3 — Admin panel (11 pages) | ✅ `629deb4` |
| 4 — AI features (LLM + fallback) | ✅ `8e0399c` |
| 5 — Stripe checkout + webhook, OTP auth | ✅ (uncommitted) |
| 5b — Web push notifications | ⬜ (next: VAPID + service worker + `PushSubscription` model) |
| 6 — PWA/SEO/security audit | ⬜ |
| 7 — Tests + CI expansion | ⬜ (CI present) |
| 8 — Final audit, GitHub push | ⬜ (needs `gh` CLI) |

Live status is tracked in [`PROGRESS.md`](./PROGRESS.md) — read the top section first; it always documents the current uncommitted state and the next step.

---

## 📄 License

Private project. All rights reserved.
