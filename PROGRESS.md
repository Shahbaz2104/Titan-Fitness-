# Titan Fitness — Build Progress

Updated: 2026-08-01 (night session 6 — Phase 7 tests+CI done, **UNCOMMITTED**)

## ⚠️ CRITICAL — CURRENT STATE (read this first)

- **Phase 7 (tests + CI expansion) COMPLETE, uncommitted.** What changed:
  - `tests/validators.test.ts` (NEW, 22 tests) — payment/workout/member/booking/nutrition zod schemas
  - `tests/ai.test.ts` (NEW, 8 tests) — `estimateCostUsd` pricing table, `hasAiKey` edge cases
  - **Test count: 21 → 51, all passing**
  - **CI fix**: `prettier-plugin-tailwindcss` was missing from devDeps → CI `format:check` would have failed; also ran `npm run format` over the whole repo (146 files reformatted — mechanical, no logic changes)
  - Fixed 1 lint error surfaced by formatting (`membership-dashboard.tsx` unescaped `'` → `&apos;`)
- **Verified**: tsc ✓, eslint ✓ (full repo), 51/51 tests ✓, prettier --check ✓ (whole repo), build ✓ (133 static pages), prod server restarted (PID 89936), 6 sampled pages render OK
- **Note**: `npm run start` logs a warning "next start does not work with output: standalone — use node .next/standalone/server.js" but works fine; switch to `node .next/standalone/server.js` for true standalone runs
- **Next step: commit Phase 7**, then Phase 8 (final audit + GitHub push, needs `gh` CLI or manual push)

## Phase Status Overview

| Phase | Description                                                                         | Status                                                                     |
| ----- | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| 0     | Foundation (git, env, DB, migration, seed, legal pages, PWA, tests, CI, auth fixes) | ✅ Done (commit `59e1236`)                                                 |
| 1     | Services + API routes (82 routes)                                                   | ✅ Done (commit `0b9dbdd`)                                                 |
| 2     | User dashboard (16 pages)                                                           | ✅ Done (commit `8234d9b`)                                                 |
| 3     | Admin panel                                                                         | ✅ Done (commit `629deb4`)                                                 |
| 4     | AI features (real LLM wiring)                                                       | ✅ Done (commit `8e0399c`)                                                 |
| 5     | Stripe, gamification UI, notifications                                              | ✅ Done (Stripe+OTP `267b5fb`, web push `223d3d6`)                         |
| 6 | PWA, SEO, security | ✅ Done (commit `aba5724`) |
| 7 | Tests + CI | ✅ Built — **UNCOMMITTED** (51 tests, prettier fix, CI green) |
| 8     | Final audit, README, GitHub push                                                    | ⬜ (README not yet written)                                                |

## Phase 5 — Stripe + OTP Auth (UNCOMMITTED)

### Stripe checkout (real, with mock fallback)

- `createCheckoutSession(userId, { planId, branchId, couponCode })`:
  - **Stripe mode** (`sk_…` key set): creates Stripe Checkout Session (line item from plan, on-the-fly `stripe.coupons.create` for discounts, `metadata` = userId/planId/branchId/couponId/originalAmount/finalAmount, success_url `/dashboard/membership?checkout=success&session_id=…`, cancel_url `/dashboard/membership?checkout=cancelled`), Payment row with `stripeSessionId`; returns `{ mode: "stripe", url, payment, plan, discount }`
  - **Mock mode** (no key): creates Payment, calls `activateMembership` instantly (preserves old UX), returns `{ mode: "mock", …, membership }` — frontend redirects only in stripe mode
- `handleStripeWebhook(event)`: `checkout.session.completed` (payment_status paid) → find payment by `stripeSessionId` (skip if already SUCCEEDED = idempotent) → `activateMembership(method: "CARD")` → upsert payment SUCCEEDED w/ `stripePaymentIntentId`, `receiptUrl`; `checkout.session.expired` → mark PENDING payments FAILED
- Webhook route: raw `req.text()` + `constructEvent` (no `req.json()`!), 503 when Stripe/webhook secret missing, 400 bad signature
- Stripe SDK v22 pinned its own API version (don't pass `apiVersion` — types break)
- `PaymentMethod` enum has NO STRIPE value → use `"CARD"` + `stripeSessionId` fields (already in schema from Phase 0)

### OTP email verification + password reset (better-auth emailOTP plugin v1.6.25)

- Server: `emailOTP({ sendVerificationOTP → sendOtpEmail, otpLength: 6, expiresIn: 300, storeOTP: "hashed", sendVerificationOnSignUp: true, overrideDefaultEmailVerification: true, resendStrategy: "rotate", allowedAttempts: 3 })`
- Routes (auto-mounted under `/api/auth/email-otp/*`): send-verification-otp, check-verification-otp, verify-email, sign-in/email-otp, request-password-reset, reset-password, forget-password/email-otp, change-email, request-email-change, get-verification-otp (dev tool)
- **Client method naming gotcha**: paths lose the `email-otp/` prefix when camelCased → `authClient.emailOtp.sendVerificationOtp`, `.verifyEmail`, `.requestPasswordReset`, `.resetPassword`, `.checkVerificationOtp`, `.signInEmailOtp` (NOT `emailOTP.verifyEmailOTP` etc.)
- OTP stored hashed in `Verification` table (identifier `email-verification-otp-<email>`), verified E2E: send → 200, wrong code → `INVALID_OTP`, no Resend key → console warn (email skipped, flow still works)
- **Type gotcha**: adding the emailOTP plugin breaks better-auth's `session.user` additional-fields inference (fitnessGoal/heightCm/etc. vanish from the type) → `src/app/api/auth/me/route.ts` now casts to explicit `MeUser` interface (runtime unaffected)
- UI: verify-email page now OTP-first (6-digit input, resend), forgot-password offers BOTH reset link and OTP code, reset-password auto-detects OTP mode via `?email=` param vs `?token=`

### Critical bug found during UI check (pre-existing since Phase 0!)

- **Zustand array selector** in `src/components/layout/navbar.tsx:27`: `useUIStore((s) => [s.mobileNavOpen, s.setMobileNavOpen])` returns a NEW array each render → `useSyncExternalStore` infinite re-render → React #185 "Maximum update depth exceeded" → **every marketing page rendered "This page couldn't load"** (home/pricing/terms/about/blog… — login/dashboard fine because they don't render Navbar). Fix: two scalar selectors. Rule: **never return new object/array from a zustand selector**.
- Also hardened: `Reveal` variants → `useMemo`; `TiltCard` multi-input `useTransform` callback → `useCallback` (framer-motion v12 pitfalls)
- Note: `(auth)/layout.tsx` shows a decorative "Today's Workout / Leg Day" card by design (not a bug)

## Phase 4 — AI Features (committed `8e0399c`)

### How it works

- `src/lib/ai.ts`: `getAiModel()` returns OpenAI model (via `@ai-sdk/openai` `createOpenAI`) only when `OPENAI_API_KEY` is set (≥10 chars, not placeholder); `AI_MODEL_ID` from `AI_MODEL` env (default `gpt-4o-mini`); cost per 1M tokens table (gpt-4o-mini $0.15/$0.60, gpt-4o $2.5/$10, gpt-4.1 $2/$8, gpt-4 $30/$60, o-series $2/$8)
- `src/services/ai.ts`:
  - `aiChat(userId, message)` — `generateText` with fitness-coach system prompt + member profile (height/weight/goal/experience) injected; rule-based keyword fallback (6 topics)
  - `generateWorkoutPlan(userId, input)` — `generateObject` with zod schema; prompt includes the full 44-exercise DB library and instructs EXACT name matching; output names resolved back to real `exerciseId`s (DB name lookup, falls back to first library exercise) so plan SAVE to `/api/workouts/plans` always works (exerciseId is required there); rule-based day-split fallback
  - `generateMealPlan(userId, input)` — `generateObject` 7-day schema (mealType BREAKFAST/LUNCH/DINNER/SNACK, macros); returns daily average calories/protein; rule-based template fallback
  - All paths log `aIUsage` (feature CHATBOT/WORKOUT_GENERATOR/NUTRITIONIST, model id or "rule-based", tokensIn/Out, cost Decimal, durationMs, status SUCCESS/FAILED) — logging failures swallowed (never breaks requests)
  - LLM errors caught → silently fall back to rule-based (verified with fake key)
- Routes kept zod schemas + `withRateLimit` (chat 30/min, generators 10/min); response shapes unchanged → zero frontend changes

### Verified (2026-08-01 night)

- `npx tsc --noEmit` clean, eslint clean, 18/18 tests, `npm run build` clean
- Live (dev server, member session, NO key): chat → rule reply, workout generator → 4-day plan with real exerciseIds, nutritionist → 7-day plan
- Fake key `sk-fakekey…` via tsx script: all 3 services fall back to rule-based without crashing
- Prisma AIUsage enums: `AIStatus` = SUCCESS/FAILED/RATE_LIMITED (no ERROR), `AIFeature` = WORKOUT_GENERATOR/NUTRITIONIST/CHATBOT/BMI/RECOVERY

## Phase 3 — Admin Panel (committed `629deb4`)

### Structure

- **Layout**: `src/app/admin/layout.tsx` (server, metadata noIndex) → `src/components/admin/admin-layout.tsx` (client, 367 lines)
  - Role guard: waits for `useUser()`, redirects to /login if signed out, blocks non-ADMIN/SUPER_ADMIN with "Access denied" screen
  - Sidebar (desktop + mobile with framer-motion), grouped nav: Main (Overview, Reports), Management (Members, Programs, Classes), Commerce (Coupons), Support (Tickets), Content (Blog Posts, Challenges), System (Branches, Settings)
  - Sticky header w/ tickets shortcut + dashboard link, sign-out via `authClient.signOut()`
- **Pages**: all 11 are 5-line server shells delegating to a client component in `src/components/admin/`:
  - `/admin` → overview-admin.tsx (175 ln) — 8 StatCards from `/api/admin/stats`, "Needs attention" (expiring memberships, open tickets), quick actions
  - `/admin/reports` → reports-admin.tsx (249 ln) — revenue + attendance charts (uses `/api/admin/reports/revenue|attendance?days=`)
  - `/admin/members` → members-admin.tsx (330 ln) — search, status filter, list w/ detail view (member detail query key `adminMemberDetail`), edit via PATCH
  - `/admin/programs` → programs-admin.tsx (316 ln) — list + create form (name, category, description, imageUrl)
  - `/admin/classes` → classes-admin.tsx (139 ln) — class management
  - `/admin/coupons` → coupons-admin.tsx (283 ln) — list + create (code, type PERCENTAGE/FIXED, value, maxUses), delete
  - `/admin/tickets` → tickets-admin.tsx (234 ln) — ticket list + reply composer (`POST /api/admin/tickets/[ticketId]/reply`), status change
  - `/admin/blog` → blog-admin.tsx (277 ln) — post list + create form (title, excerpt, content, tags, coverImage, category) — uses new `GET /api/posts/categories`
  - `/admin/challenges` → challenges-admin.tsx (270 ln) — list + create (title, description, durationDays, reward)
  - `/admin/branches` → branches-admin.tsx (115 ln) — branch list
  - `/admin/settings` → settings-admin.tsx (130 ln) — site settings form (PATCH /api/admin/settings)
- **New public route**: `GET /api/posts/categories` → `getBlogCategories()` in services/content (used by blog admin form)
- **New QUERY_KEYS** in `src/lib/constants.ts`: `adminMemberDetail`, `adminPrograms`, `adminClasses`, `adminSettings`, `adminTickets`, `adminCoupons`, `adminBranches`, `adminBlogPosts`, `adminChallenges`

### Verified (2026-08-01 night)

- `npx tsc --noEmit` clean, `eslint .` clean, 18/18 tests, `npm run build` clean (admin pages in build output)
- Live smoke via dev server on :3000 (Postgres up):
  - All 12 admin API routes → **401 without auth** (correct)
  - Login as admin@titanfitness.com → all admin routes return **200 with data** (stats, members, programs, settings, tickets, coupons, branches, blog-posts, challenges, revenue + attendance reports)
  - `/api/posts/categories` → 200 (public)
- No TODO/FIXME/stub markers in admin components — all use `useApiQuery`/`useApiMutation`

## Phase 2 — User Dashboard (16 pages, committed)

### Foundation (first commit `fa71c1f`)

- `src/lib/api-client.ts` — apiGet/apiPost/apiPatch/apiDelete, ApiClientError, `useApiQuery` (queryKey typed `readonly unknown[]`), `useApiMutation`
- `src/components/dashboard/page-header.tsx` — shared DashboardPageHeader
- AI stub routes (rule-based, logged to `aIUsage` — note Prisma camelCasing!): `/api/ai/chat` (keyword rules), `/api/ai/workout-generator` (day-split from exercise DB), `/api/ai/nutritionist` (7-day meal plan from templates)
- `DELETE /api/me/calories/[id]` route + `deleteCalorieLog` service
- **Critical fix**: `src/proxy.ts` — `getCookieCache` in production looked for `__Secure-better-auth.session_data` while the server wrote the unprefixed cookie over plain HTTP → every dashboard visit looped back to /login. Fixed with `isSecure: request.nextUrl.protocol === "https:"`. Dashboard was completely unreachable in production builds before this.

### Pages (all wired to live APIs via useApiQuery)

- `/dashboard` (overview) — hero (today's workout via `/api/workouts/today`), points ring, check-in ring, stat cards (stats, attendance, rank), today's exercises, upcoming bookings, week strip, water quick-add, membership card
- `/dashboard/workouts` — stats, active session (start → log sets/reps/weight → complete with duration/calories → points+PRs), recent sessions, PRs
- `/dashboard/nutrition` — macro cards, meals log/add/delete, water tracker (+250/+500), meal plans (AI badge, day-by-day), monthly stats
- `/dashboard/notifications` — list with type icons, mark-read on click, mark-all-read, empty state
- `/dashboard/classes` — date strip (7 days), type filter tabs, book/waitlist/cancel, upcoming bookings
- `/dashboard/attendance` — stats (total/month/streak), 7-day strip, check-in/check-out (uses profile branchId, method MANUAL), history
- `/dashboard/membership` — current membership card (days left, auto-renew), plans grid with features, activate
- `/dashboard/payments` — totals, history list with status badges
- `/dashboard/leaderboard` — my rank banner, podium, full list
- `/dashboard/challenges` — my challenges (progress bars), open challenges (join)
- `/dashboard/referrals` — code + copy link, stats, referral list
- `/dashboard/profile` — avatar/points/rank/BMI, editable details form (keyed remount instead of setState-in-effect), badges grid
- `/dashboard/progress` — stats, body-weight bar chart, measurement log + history, PRs
- `/dashboard/ai/chat`, `/dashboard/ai/workout-generator`, `/dashboard/ai/nutritionist` — chat UI, generator form → day cards → save to plans, nutritionist form → 7-day plan → save as meal plan

### Service/validator extensions for Phase 2

- `workoutPlanSchema` + `createPlan` now accept nested `days[].exercises` (AI plans save with structure)
- `mealPlanSchema` now accepts optional `days[].meals` (AI meal plans persist)
- `getTodayWorkout` plan query now selects `exercise.id` (needed for session completion logs FK)
- `ProgressRing` gained optional `displayValue`

### React Query gotcha (found in smoke test)

- Two `useApiQuery` calls sharing ONE `QUERY_KEYS` value collide in the cache — second endpoint's data overwrites the first (e.g. membership "current" vs "plans" crashed with `(g ?? []).map is not a function`). Rule: same endpoint URL may share a key; different endpoints must use distinct keys (`[...KEY, "sub"]`).

### Verified (this session)

- tsc clean, eslint clean, 18/18 tests, production build clean
- Browser smoke (Playwright): login → all 16 dashboard pages render without page errors; AI chat reply, workout generator, and nutritionist all return results
- Note: an old `next dev` server squatting on :3000 served stale chunks (500s) — killed before final prod test

## What's Done (Phases 0–1)

### Environment / Stack

- Next.js 16.2.12, React 19, TypeScript, Tailwind v4, Prisma 6.16.2
- PostgreSQL 16 local (`postgresql://shahbaz:1234@localhost:5432/titan_fitness`), migration `20260731201838_init` applied
- better-auth configured (server `src/lib/auth.ts` + client `src/lib/auth-client.ts`), real `BETTER_AUTH_SECRET` in `.env`
- git repo on branch `main` (user Shahbaz2104 / shahbaz21042005@gmail.com)
- gh CLI NOT installed → GitHub push must be done by user or after installing gh
- Docker NOT installed → local Postgres used

### Phase 0 (committed)

- Removed junk `src/{app` dir
- Legal pages: `/terms`, `/privacy`, `/refund-policy` via `src/components/marketing/legal-page.tsx`
- PWA assets in `public/` (manifest, icons 192/512, favicon, og-image, apple-icon)
- Blog fixes: `generateStaticParams` via `getPosts()`, awaited `params` in `generateMetadata`
- Vitest setup: `vitest.config.ts`, `tests/setup.ts`, 2 test files, 18 tests passing
- CI: `.github/workflows/ci.yml`
- Auth pages split into server `page.tsx` + client `*-form.tsx` (Next 16 limitation)
- `eslint .` used (Next 16 removed `next lint`); `tsx` installed as devDep

### Phase 1 — Services (all typecheck clean)

- `src/lib/api.ts` — ApiError, jsonOk/jsonError, getSessionUser, requireUser, requireRole, requireAdmin, withRateLimit, auditLog, getIp, **parseBody** (zod helper, added this session)
- `src/lib/validators/*.ts` — zod schemas: member, workout, nutrition, booking, content, payment, admin + index barrel
- `src/services/members.ts` — profile get/update, body metrics (auto BMI), water logs (accumulates per day), calorie logs, progress photos
- `src/services/notifications.ts` — create/get/unread/mark read, membership expiry scanner
- `src/services/gamification.ts` — points, badge awarding, streaks, leaderboard, challenges + progress
- `src/services/workouts.ts` — exercise library, favorites, custom exercises, plans CRUD, sessions start/complete (points+PRs), history, PRs, stats, today view
- `src/services/bookings.ts` — class list/detail, book/cancel/reschedule, waitlist, my bookings, check-in
- `src/services/attendance.ts` — check-in (QR), history, stats, checked-in-today
- `src/services/nutrition.ts` — meal plans CRUD, daily nutrition logs (uses `CalorieLog`), stats
- `src/services/payments.ts` — plans, active membership, payment history, coupon validation, membership order/activation, referrals
- `src/services/content.ts` — blog posts/comments/likes/bookmarks, FAQs, testimonials, gallery, contact
- `src/services/search.ts` — global search (programs/posts/classes/exercises)
- `src/services/admin.ts` — members CRUD, dashboard stats, revenue/attendance reports, programs, classes, settings, tickets, coupons, branches, blog posts, challenges

### Phase 1 — API Routes (82 total, this session)

- **Auth/me**: `GET/PATCH /api/me/profile`, `GET/POST /api/me/body-metrics`, `/api/me/water`, `/api/me/calories`, `GET/POST /api/me/progress-photos` + `DELETE /api/me/progress-photos/[photoId]`
- **Notifications**: `GET /api/me/notifications` (+unreadCount), `GET /api/me/notifications/unread-count`, `POST /api/me/notifications/[id]/read`, `POST /api/me/notifications/read-all`
- **Gamification**: `GET /api/me/points`, `/api/me/badges`, `/api/me/leaderboard`, `GET /api/me/challenges`, `POST /api/me/challenges/[challengeId]/join`
- **Workouts**: `GET /api/workouts/exercises` (category/search), `GET /api/workouts/exercises/[exerciseId]`, `GET/POST /api/workouts/exercises/[exerciseId]/favorite`, `POST /api/workouts/exercises/custom`, `GET/POST /api/workouts/plans`, `GET/DELETE /api/workouts/plans/[planId]`, `GET/POST /api/workouts/sessions`, `POST /api/workouts/sessions/[sessionId]/complete`, `GET /api/workouts/prs`, `/api/workouts/stats`, `/api/workouts/today`
- **Classes/bookings**: `GET /api/classes` (branch/type/date/page), `GET /api/classes/[classId]`, `POST /api/classes/[classId]/book|waitlist|check-in`, `GET /api/bookings`, `POST /api/bookings/[bookingId]/cancel|reschedule`
- **Attendance**: `POST /api/attendance/check-in`, `GET /api/attendance` (history), `/api/attendance/stats`, `/api/attendance/today`
- **Nutrition**: `GET/POST /api/nutrition/plans`, `GET/DELETE /api/nutrition/plans/[planId]`, `GET /api/nutrition/logs?date=`, `/api/nutrition/stats`
- **Payments**: `GET /api/payments/plans|membership|history|referrals`, `POST /api/payments/checkout|activate|referrals/apply`, `POST /api/payments/coupons/validate`
- **Content**: `GET /api/posts` (page/category/search), `GET /api/posts/[slug]` (+related), `GET/POST /api/posts/[slug]/comments`, `POST /api/posts/[slug]/like|bookmark`, `GET /api/posts/bookmarks`, `GET /api/content/faqs`, `GET/POST /api/content/testimonials`, `GET /api/content/gallery`, `GET/POST /api/search`
- **Admin** (SUPER_ADMIN/ADMIN only): `GET /api/admin/stats`, `GET /api/admin/reports/revenue|attendance?days=`, `GET /api/admin/members` + `GET/PATCH /api/admin/members/[memberId]`, `GET/POST /api/admin/programs` + `PATCH/DELETE /api/admin/programs/[programId]`, `GET /api/admin/classes`, `GET/PATCH /api/admin/settings`, `GET /api/admin/tickets`, `POST /api/admin/tickets/[ticketId]/reply`, `PATCH /api/admin/tickets/[ticketId]/status`, `GET/POST /api/admin/coupons` + `DELETE /api/admin/coupons/[couponId]`, `GET /api/admin/branches`, `GET/POST /api/admin/blog-posts` + `DELETE /api/admin/blog-posts/[postId]`, `GET/POST /api/admin/challenges`

### Bugs fixed this session

- **Login broken**: seed stored passwords in `User.password` but better-auth reads credentials from `Account` (providerId="credential") → added `createUserWithCredentials()` helper in seed (user + Account row); `Setting` missing from truncate list (P2002 on reseed)
- **Seed classes always in the past** (Mon–Fri only) → now scheduled today + next 7 days
- **`/api/me/points` P2002 race** — `getOrCreatePoints` + `getMyRank` ran in parallel upsert → route now uses `getMyRank` only
- **`/api/admin/branches` 500** — `Branch._count` has no `trainers` relation → `users: true, classes: true`
- zod v4 gotcha: `.default()` keeps output optional → routes map defaults explicitly (`?? 8`, `?? "SNACK"`, etc.)
- Admin blog POST: `slug` now optional (service auto-slugifies)

### Verified (this session)

- `npx tsc --noEmit` clean, eslint clean, 18/18 tests, `npm run build` clean
- Live smoke-tested via dev server + curl: login (member+admin), profile, points, water, calories, body metrics, exercises, classes list/book/duplicate-409/reschedule/cancel/waitlist/check-in, attendance check-in, nutrition logs/plans, workout session start/complete (points + badge + PR awarded), payments checkout/coupon validate, referrals, blog like/bookmark/comments, testimonials, progress photos, search, admin stats/members/reports/programs/tickets/coupons/branches/settings/challenges/blog, 403 for member hitting admin routes

## Schema Gotchas (learned)

- No `NutritionLog` model → use `CalorieLog` (fields: date, mealType, foodName, calories, protein, carbs, fat, portion, imageUrl)
- No `MemberProfile` model → profile fields live on `User` (heightCm, weightKg, bodyFatPct, fitnessGoal, experience…)
- `User.memberships` (plural) is the relation name, not `membership`
- `BlogLike`/`BlogBookmark` unique key: `postId_userId`
- `Testimonial`: `status` (ContentStatus), no `isApproved`/`isActive`; fields: content, rating, programId, imageUrl, isFeatured, position
- `FAQ`: `isActive` not `isPublished`
- `GalleryImage`: `status` (ContentStatus), no `isActive`/`sortOrder`
- `TicketMessage`: `senderId` + `senderRole` (no `authorId`)
- `TicketStatus`: OPEN / IN_PROGRESS / RESOLVED / CLOSED (no REPLIED)
- `Referral`: `referredUserId` (unique), relation `referredUser`, `redeemedAt` (not rewardedAt); also has `code` field
- `Notification.data` needs `Prisma.InputJsonValue` cast
- `rateLimitByUser(userId, limit, windowMs)` — 3 args (no key)
- User select has no `isVerified` (it's `emailVerified`)
- Enum casts: string→enum values need `as never`/explicit cast (MealType, PhotoStage, GoalType, NotificationType…)

## Verified

- `npx tsc --noEmit` clean (after `rm -f tsconfig.tsbuildinfo`)
- Lint, tests (18/18), build all pass as of Phase 0

## Key Credentials / Config

- DB: `DATABASE_URL="postgresql://shahbaz:1234@localhost:5432/titan_fitness"` (PGPASSWORD=1234)
- Seed logins (password `Titan@12345`): `admin@titanfitness.com`, `member@titanfitness.com`, `marcus@titanfitness.com`
- Stripe / AI / Cloudinary keys still blank in `.env`

## Blockers

- **Web push uncommitted** — commit it (command in handoff below)
- GitHub push: needs `gh` CLI or manual push
- Marketing images: user supplies later (`public/images/programs/*.jpg` etc.)
- Admin branches page is read-only (no create/edit branch form yet) — check `branches-admin.tsx` if user wants branch CRUD
- Admin classes page has no create/update class form — only listing (check `classes-admin.tsx`)
- Real AI requires user's `OPENAI_API_KEY` in `.env` (currently empty placeholder) — LLM path untested live until key added
- Real Stripe requires `STRIPE_SECRET_KEY`/`STRIPE_WEBHOOK_SECRET` in `.env` (empty placeholders) — checkout falls back to mock (instant activation). To test webhook locally: `stripe listen --forward-to localhost:3000/api/payments/webhook`
- Email requires `RESEND_API_KEY` (empty) — OTP/link emails skipped with console warning; flows still work
- Web push: VAPID keys ARE set (real, generated) — push works on localhost; browser-level `Notification` permission is user-controlled; real delivery needs a reachable HTTPS origin (localhost is fine for dev)
- Playwright installed as devDep (`npm i -D playwright` + `npx playwright install chromium`) for UI checks

## Session Handoff (2026-08-01 night, session 6)
1. **Commit Phase 7**: `git add -A && git commit -m "feat: Phase 7 — 30 new tests (validators, AI pricing), fix CI format check, format whole repo"`
2. Then Phase 8: final audit + GitHub push (gh CLI missing — may need manual `git remote add origin` + push)

## Session Handoff (2026-08-01 night, session 5)

1. **Commit Phase 6**: `git add -A && git commit -m "feat: Phase 6 — robots.txt, sitemap.xml, security headers, apple-icon"`
2. Then Phase 7: tests + CI expansion (more Vitest coverage: services validators, payments logic, auth helpers)
3. Final: Phase 8 README polish + GitHub push (gh CLI missing)

## Session Handoff (2026-08-01 night, session 4)

1. ✅ Committed web push (`223d3d6`) — Phase 5 fully done
2. **Phase 6 next**: PWA/SEO/security audit (manifest/meta already in place from Phase 0 — audit + gaps: OG tags on dynamic pages, security headers, PWA install criteria, sitemap/robots)
3. Final: Phase 8 README polish + GitHub push (gh CLI missing)
