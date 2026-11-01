# Titan Fitness — Remaining Work & Handoff

Updated: **2026-11-01** · Phase 10 is committed; remaining work below is still open.

> Short version: demo is working locally; tomorrow is **reseed → screenshot sweep → docs → final gates → deploy**.

## Current status

- Member dashboard and admin panel are demo-ready on local `:3000`.
- Seed is rich and relative-dated: 24 demo members, 32 total users, 87 class schedules, 60 days of attendance/metrics, 8 weeks of workout history, 7 tickets, 7-day meal plan, payments, challenges, referrals, AI usage, audit logs.
- Last verified this session: `format` ✓ · `typecheck` ✓ · `lint` **0 errors / 4 intentional `<img>` warnings** · `tests 56/56` ✓.
- `npm run build` **not yet rerun** after today's late fixes — run it in tomorrow's final gate.
- Phase 10 committed on `main` on 2026-11-01.

## Done this session (2026-10-22)

### Seed / demo data

- Rewrote `prisma/seed.ts` with relative dates (`daysAgo` / `daysFromNow`) so screenshots never go stale; 24 demo members, payments, 60 days of attendance/metrics, workout history, bookings, notifications, tickets, referrals, progress photos, meal plan, AIUsage, audit logs.
- Destructive seed guard: refuses `NODE_ENV=production` unless `SEED_ALLOW_DESTRUCTIVE=true`.
- Seed ran successfully; demo credentials unchanged (`Titan@12345`).

### Auth / shell

- Fixed session drop: better-auth `cookieCache.maxAge` was 5 minutes → now **7 days** (`src/lib/auth.ts`). Keep this value.
- Sidebar defaults open; desktop/mobile toggles separated; nav closes mobile drawer.
- Header streak + unread notifications are now live data, not hardcoded.
- Added `calculateAttendanceStreak` (attendance-based) and attendance **check-out** service + route.
- Demo mode (`src/lib/demo.ts`), demo login buttons, `/register` redirect, error/loading routes, security headers, removed free `/api/payments/activate`.

### Broken flows fixed

- Dashboard: today's workout sets (`setsCompleted`), class titles, `/api/bookings` path, dynamic week strip, hydration-safe greeting, live streak/unread.
- Classes: past classes can no longer be booked (`CLASS_STARTED` 409 + disabled "Class started" button); rebooking after cancel no longer crashes on the booking unique constraint (reuses cancelled row; safe cancel transaction).
- Admin: program `sessionsPerWeek`/`schedule` mapping, challenge reward mapping, password omitted from member detail, member-detail 404 fixed (`enabled` option in `useApiQuery`).
- Admin delete buttons for **programs, coupons, and blog posts** were all silently broken (mutation URL captured empty/stale id) → now call `apiDelete` with the row id.
- Admin blog dates use `publishedAt` (not `createdAt`) and are ordered newest-first.
- Blog is Prisma-backed with static fallback (`src/lib/blog.ts`); guest comments migration `20261022152745_blog_guest_comments`; featured card removed from grid; duplicate H1 stripped.
- `SmartImage` cached-image bug: above-the-fold images stayed at `opacity:0` when `onLoad` fired before hydration → ref checks `img.complete` (blog featured image now visible).
- Hydration fixes: nested `<p>` around `WordReveal` in programs/trainers marketing sections.

### Smoke-tested

- All 13 member routes and 11 admin routes load with no 4xx/5xx (after fixes).
- Booking, cancel, rebook, notifications mark-all-read, ticket reply/status, admin program/coupon/blog create+delete exercised in browser.
- Desktop screenshots: dashboard, admin overview, blog index. Mobile: overview, menu, workouts, nutrition, attendance, membership, payments, challenges.
- **QA artifacts remain in DB until reseed**: blog comment by "QA Reader", admin ticket replies, notifications marked read, some canceled bookings.

## Remaining tasks (in order)

### 1. Reset demo data (must do first)

```bash
npm run db:seed
```

Clears all QA artifacts and restores unread notifications, bookings, and relative dates. Keep `SEED_ALLOW_DESTRUCTIVE` unset locally.

### 2. Finish visual QA / Phase 3 polish

- Review the already-captured mobile screenshots for **leaderboard, referrals, profile, notifications** (captured but not yet inspected).
- Blog detail on mobile: cover image, markdown, comments, guest comment form.
- Admin mobile pass: sidebar, members detail, ticket thread, program/coupon/blog dialogs at 390px.
- Add **confirmation dialogs** before destructive admin deletes (currently one click deletes).
- Accessibility pass: keyboard focus order, dialog labels, icon-button `aria-label`s, contrast, `prefers-reduced-motion`.
- Check remaining `SmartImage` above-the-fold usage on programs/trainers pages after animation settles.

### 3. Authenticated screenshot sweep

- Extend `scripts/screenshot-sweep.mjs` (currently public/auth pages only) to log in as member + admin and capture:
  - `/dashboard`, workouts, nutrition, progress, classes, attendance, membership, payments, leaderboard, challenges, referrals, profile, notifications
  - `/admin`, members, programs, classes, coupons, tickets, blog, challenges, branches, reports, settings
- Save under `artifacts/screenshots/` (or `public/screenshots/`) for README. Run **after** reseed.
- Capture desktop 1440×900 and mobile 390×844; check for horizontal overflow and invisible images.

### 4. Docs

README is stale. Update:

- Next.js **16.4.2** (currently says 16.2.12), tests **56** (says 51), seed/demo details, demo accounts, demo-mode env vars.
- New blog behavior (DB-first + static fallback, guest comments), attendance check-out, seeded data count.
- Add final screenshots + deployment section matching `NEXT-STEPS`/`PROGRESS`.
- Update `PROGRESS.md` with the Phase 10 summary if not already added.
- Update `.env.example` only if a new required variable appeared (none expected).

### 5. Final quality gates

```bash
npm run format
npm run lint          # expect 0 errors, 4 known <img> warnings
npm run typecheck
npm test -- --run     # expect 56/56
npm run build         # must pass; check route count/pages
```

Then do one final browser pass on the production build (`npm run build && npm run start`) if time allows.

### 6. Deploy (Vercel + Neon)

1. Create Neon Postgres, set `DATABASE_URL` (pooled + direct if needed).
2. Vercel env: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_DEMO_MODE=true`, `NEXT_PUBLIC_DEMO_PASSWORD=Titan@12345`, `CRON_SECRET`.
3. Run `npx prisma migrate deploy`; seed once with `SEED_ALLOW_DESTRUCTIVE=true npm run db:seed` (temporary env, then remove/disable).
4. Deploy; verify login with all three demo accounts, blog/comments, booking, admin CRUD, cron `/api/cron/maintenance`.
5. Optional keys: `OPENAI_API_KEY`, Stripe, `RESEND_API_KEY`, VAPID, Google OAuth — all fall back gracefully.

### 7. Known non-blockers

- `npm audit` advisories: `braces`, `deepmerge-ts`, `postcss-selector-parser` — no clean non-breaking fix.
- 4 lint warnings are intentional `<img>` usage in `SmartImage`/transformation gallery.
- Missing real marketing assets: `public/images/gallery/*` (10) and `transformations/*` (8); fallbacks already render.
- Admin classes/branches remain read-only by scope.
- Agent-browser loses cookies when its daemon restarts — that is a test-tool artifact, **not** the app (the app fix is the 7-day cookie cache).

## Before closing / restarting

Stop the dev server by port (never `pkill -f "next dev"` — it matches your own shell):

```bash
fuser -k 3000/tcp
```

Restart with `npm run dev` (log: `/tmp/titan-dev.log`). Log in with the demo buttons.

## Key facts

- Demo logins (password `Titan@12345`): `member@titanfitness.com`, `admin@titanfitness.com`, `marcus@titanfitness.com`.
- Local DB: `postgresql://shahbaz:1234@localhost:5432/titan_fitness`.
- Seed guard: production needs `SEED_ALLOW_DESTRUCTIVE=true` (disposable DB only).
- Better-auth session cookie cache must stay at **7 days**; shorter values cause proxy `getCookieCache` to drop protected routes.
- agent-browser needs `AGENT_BROWSER_ARGS="--no-sandbox"`; sessions used: `titan-qa`, `titan-admin`.
- Repo: `github.com/Shahbaz2104/Titan-Fitness-` (`main`), CI in `.github/workflows/ci.yml`.
