# Titan Fitness — Next Steps & Reminders

> Everything below is committed and pushed to `origin/main` unless stated otherwise.

## Current status (2026-08-02)

- ✅ **Phase 9 committed & pushed** (`b59e714`): Black Iron marketing redesign — anime.js text fx, Lenis smooth scroll, GSAP choreography, real blog/hero assets
- ✅ **Vercel prep done** (`cfacbb9`, `0ef4b28`): Prisma serverless `binaryTargets`, deploy checklist in README §4 + PROGRESS.md
- ✅ **Auth fixed** (`70c7bac`): `.env` DB creds (`shahbaz:1234`, local-only) + better-auth admin ban-fields migration
- ✅ Quality gates: typecheck ✓ lint ✓ (0 err / 3 `<img>` warnings) tests 51/51 ✓ build ✓ (133 static pages)

## Before you close / restart the machine

- The **dev server** may still be running on `:3000`. Kill it with:
  ```bash
  fuser -k 3000/tcp
  ```
- Restart later with: `npm run dev` (log at `/tmp/opencode/titan-dev.log`)

## Next steps

1. **Add missing images** (18 total — drop files in place, no code changes; icon fallbacks cover them today):
   - `public/images/gallery/` (10): main-floor, free-weights, power-rack, hiit-studio, boxing-corner, yoga-room, recovery-suite, community-night, challenge-winners, member-of-the-month (`.jpg`)
   - `public/images/transformations/` (8): 4 pairs `weight-loss|muscle-gain|endurance|strength` × `-{before,after}.jpg` (landscape works best)
   - Optional swaps (currently Unsplash placeholders): `trainers/` (4), `programs/` (8), `hero-poster.jpg`
2. **Playwright screenshot sweep** of all marketing pages → verify the new motion layer visually
3. **Deploy to Vercel** (code is ready; steps in README §4 + PROGRESS.md):
   - Hosted Postgres (Neon/Supabase/Vercel) → set `DATABASE_URL`
   - Vercel env vars: `DATABASE_URL`, `BETTER_AUTH_SECRET` (same as local), `BETTER_AUTH_URL`, `NEXT_PUBLIC_APP_URL` = prod domain; optional `OPENAI_API_KEY`, Stripe keys, `RESEND_API_KEY`, VAPID keys, Google OAuth
   - `npx prisma migrate deploy` + `npm run db:seed` against the prod DB (creates admin/member test accounts)
   - Point Stripe webhook at `https://<domain>/api/payments/webhook`
4. **Post-deploy**: add a cron (Vercel cron / GitHub Action) for membership-expiry + dead-push-subscription scanning (none configured yet)

## Key facts to remember

- **Local DB**: `postgresql://shahbaz:1234@localhost:5432/titan_fitness` (the `postgres:postgres` URL in `.env` was wrong and breaks login — do not restore it)
- **Seeded logins** (password `Titan@12345`): `admin@titanfitness.com` (SUPER_ADMIN), `member@titanfitness.com`, `marcus@titanfitness.com`
- **New sign-ups must verify via 6-digit OTP email** — requires a `RESEND_API_KEY` or the email is skipped (console warning)
- **better-auth 1.6.25 admin plugin** REQUIRES `banned`/`banReason`/`banExpires` on `User` + `impersonatedBy` on `Session` (added via migration `20260802101238_add_admin_ban_fields`) — without them, sign-up fails 422. There is no `userBanSchema: false` option in this version.
- **Kill dev server by port**: `fuser -k 3000/tcp` (not `pkill -f "next dev"` — that string matches your own shell command and hangs)
- Git repo: `github.com/Shahbaz2104/Titan-Fitness-` (branch `main`, `gh` CLI not installed — push manually if ever needed)
