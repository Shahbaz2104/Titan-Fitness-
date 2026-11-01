#!/usr/bin/env node
/**
 * Visual QA sweep for the public marketing, auth, member and admin surfaces.
 *
 * Usage:
 *   npm run dev            # in another terminal
 *   npm run qa:screenshots
 *
 * Env:
 *   BASE_URL  override the app URL (default http://localhost:3000)
 *   QA_ONLY   comma-separated route names to capture (optional)
 */
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const BASE_URL = (process.env.BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const OUT_DIR = path.resolve("artifacts/screenshots");
const REPORT_PATH = path.resolve("artifacts/screenshot-report.json");

const ROUTES = [
  { name: "home", path: "/" },
  { name: "about", path: "/about" },
  { name: "programs", path: "/programs" },
  { name: "program-weight-loss", path: "/programs/weight-loss" },
  { name: "program-bodybuilding", path: "/programs/bodybuilding" },
  { name: "trainers", path: "/trainers" },
  { name: "trainer-marcus-cole", path: "/trainers/marcus-cole" },
  { name: "pricing", path: "/pricing" },
  { name: "gallery", path: "/gallery" },
  { name: "blog", path: "/blog" },
  { name: "blog-post-fat-loss", path: "/blog/10-science-backed-habits-for-sustainable-fat-loss" },
  { name: "contact", path: "/contact" },
  { name: "faq", path: "/faq" },
  { name: "bmi", path: "/bmi" },
  { name: "terms", path: "/terms" },
  { name: "privacy", path: "/privacy" },
  { name: "refund-policy", path: "/refund-policy" },
  { name: "login", path: "/login" },
  { name: "register", path: "/register" },
  { name: "verify-email", path: "/verify-email" },
  { name: "forgot-password", path: "/forgot-password" },
  { name: "reset-password", path: "/reset-password" },
  { name: "member-dashboard", path: "/dashboard", auth: "member" },
  { name: "member-workouts", path: "/dashboard/workouts", auth: "member" },
  { name: "member-nutrition", path: "/dashboard/nutrition", auth: "member" },
  { name: "member-progress", path: "/dashboard/progress", auth: "member" },
  { name: "member-classes", path: "/dashboard/classes", auth: "member" },
  { name: "member-attendance", path: "/dashboard/attendance", auth: "member" },
  { name: "member-membership", path: "/dashboard/membership", auth: "member" },
  { name: "member-payments", path: "/dashboard/payments", auth: "member" },
  { name: "member-leaderboard", path: "/dashboard/leaderboard", auth: "member" },
  { name: "member-challenges", path: "/dashboard/challenges", auth: "member" },
  { name: "member-referrals", path: "/dashboard/referrals", auth: "member" },
  { name: "member-profile", path: "/dashboard/profile", auth: "member" },
  { name: "member-notifications", path: "/dashboard/notifications", auth: "member" },
  { name: "member-ai-chat", path: "/dashboard/ai/chat", auth: "member" },
  { name: "member-ai-workout-generator", path: "/dashboard/ai/workout-generator", auth: "member" },
  { name: "member-ai-nutritionist", path: "/dashboard/ai/nutritionist", auth: "member" },
  { name: "admin-overview", path: "/admin", auth: "admin" },
  { name: "admin-members", path: "/admin/members", auth: "admin" },
  { name: "admin-programs", path: "/admin/programs", auth: "admin" },
  { name: "admin-classes", path: "/admin/classes", auth: "admin" },
  { name: "admin-coupons", path: "/admin/coupons", auth: "admin" },
  { name: "admin-tickets", path: "/admin/tickets", auth: "admin" },
  { name: "admin-blog", path: "/admin/blog", auth: "admin" },
  { name: "admin-challenges", path: "/admin/challenges", auth: "admin" },
  { name: "admin-branches", path: "/admin/branches", auth: "admin" },
  { name: "admin-reports", path: "/admin/reports", auth: "admin" },
  { name: "admin-settings", path: "/admin/settings", auth: "admin" },
];

const DEMO_PASSWORD = process.env.DEMO_PASSWORD ?? "Titan@12345";
const ACCOUNTS = {
  member: { email: "member@titanfitness.com", password: DEMO_PASSWORD },
  admin: { email: "admin@titanfitness.com", password: DEMO_PASSWORD },
};

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900, isMobile: false, hasTouch: false },
  { name: "mobile", width: 390, height: 844, isMobile: true, hasTouch: true },
];

const only = process.env.QA_ONLY
  ? new Set(
      process.env.QA_ONLY.split(",")
        .map((value) => value.trim())
        .filter(Boolean)
    )
  : null;

const selectedRoutes = only ? ROUTES.filter((route) => only.has(route.name)) : ROUTES;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function settle(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
  await delay(900);
}

async function waitForLoadedContent(page) {
  await page
    .waitForFunction(() => !document.querySelector(".animate-pulse"), { timeout: 30_000 })
    .catch(() => {});
  await delay(600);
}

async function scrollThrough(page) {
  await page.evaluate(async () => {
    const step = Math.max(320, Math.round(window.innerHeight * 0.7));
    let previous = -1;

    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 180));
      const current = window.scrollY;
      if (current === previous) break;
      previous = current;
    }

    window.scrollTo(0, document.documentElement.scrollHeight);
    await new Promise((resolve) => setTimeout(resolve, 350));
    window.scrollTo(0, 0);
    await new Promise((resolve) => setTimeout(resolve, 600));
  });
}

async function collectMetrics(page) {
  return page.evaluate(() => {
    const root = document.documentElement;
    const brokenImages = Array.from(document.images)
      .filter((image) => image.complete && image.naturalWidth === 0)
      .map((image) => image.currentSrc || image.src)
      .filter(Boolean);

    return {
      title: document.title,
      scrollWidth: root.scrollWidth,
      clientWidth: root.clientWidth,
      horizontalOverflow: root.scrollWidth > root.clientWidth + 1,
      brokenImages: Array.from(new Set(brokenImages)),
      imageCount: document.images.length,
    };
  });
}

async function signIn(browser, role) {
  const account = ACCOUNTS[role];
  if (!account) throw new Error(`Unknown auth role: ${role}`);

  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  try {
    await page.goto(`${BASE_URL}/login`, { waitUntil: "load", timeout: 90_000 });
    await page.fill("#email", account.email);
    await page.fill("#password", account.password);
    await Promise.all([
      page.waitForURL((url) => !url.pathname.startsWith("/login"), { timeout: 45_000 }),
      page.getByRole("button", { name: "Sign In", exact: true }).click(),
    ]);
    await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
    console.log(`  ✓ signed in as ${role}`);
    return await context.storageState();
  } finally {
    await context.close();
  }
}

async function capture(browser, route, viewport, report, storageState) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    isMobile: viewport.isMobile,
    hasTouch: viewport.hasTouch,
    deviceScaleFactor: 1,
    reducedMotion: "no-preference",
    storageState,
  });
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  const failedRequests = [];

  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("requestfailed", (request) => {
    const failure = request.failure();
    if (failure?.errorText !== "net::ERR_ABORTED") {
      failedRequests.push(
        `${request.method()} ${request.url()} — ${failure?.errorText ?? "failed"}`
      );
    }
  });

  const url = `${BASE_URL}${route.path}`;
  const label = `${route.name}-${viewport.name}`;
  const startedAt = Date.now();

  try {
    await page.goto(url, { waitUntil: "load", timeout: 90_000 });
    if (route.auth) {
      await page.waitForLoadState("networkidle", { timeout: 20_000 }).catch(() => {});
      await waitForLoadedContent(page);
    }
    await settle(page);
    await scrollThrough(page);
    for (let attempt = 0; attempt < 3; attempt++) {
      await page.evaluate(() => {
        document.documentElement.style.scrollBehavior = "auto";
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      });
      await delay(1_200);
      const scrollY = await page.evaluate(() => window.scrollY);
      if (scrollY <= 1) break;
    }
    const metrics = await collectMetrics(page);

    const file = path.join(OUT_DIR, `${label}.png`);
    await page.screenshot({
      path: file,
      fullPage: true,
      timeout: 60_000,
      animations: "disabled",
    });

    report.push({
      label,
      url,
      viewport,
      screenshot: path.relative(process.cwd(), file),
      durationMs: Date.now() - startedAt,
      ...metrics,
      consoleErrors,
      pageErrors,
      failedRequests,
    });
    console.log(
      `  ✓ ${label} (${metrics.scrollWidth}×${metrics.scrollWidth > metrics.clientWidth ? "overflow!" : "ok"})`
    );
  } catch (error) {
    report.push({
      label,
      url,
      viewport,
      error: error instanceof Error ? error.message : String(error),
      consoleErrors,
      pageErrors,
      failedRequests,
    });
    console.error(`  ✗ ${label}: ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    await context.close();
  }
}

async function captureReducedMotion(browser, report) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  try {
    await page.goto(BASE_URL, { waitUntil: "load", timeout: 90_000 });
    await settle(page);
    const metrics = await collectMetrics(page);
    const file = path.join(OUT_DIR, "home-reduced-motion-desktop.png");
    await page.screenshot({ path: file, fullPage: true, timeout: 60_000 });
    report.push({
      label: "home-reduced-motion-desktop",
      url: BASE_URL,
      viewport: { name: "desktop", width: 1440, height: 900 },
      reducedMotion: true,
      screenshot: path.relative(process.cwd(), file),
      ...metrics,
      pageErrors,
    });
    console.log("  ✓ home-reduced-motion-desktop");
  } catch (error) {
    report.push({
      label: "home-reduced-motion-desktop",
      error: error instanceof Error ? error.message : String(error),
      pageErrors,
    });
    console.error(`  ✗ home-reduced-motion-desktop: ${error}`);
  } finally {
    await context.close();
  }
}

async function launchBrowser() {
  const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE;
  if (executablePath) return chromium.launch({ executablePath });

  try {
    return await chromium.launch({ channel: "chrome" });
  } catch {
    return chromium.launch();
  }
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const report = [];
  const browser = await launchBrowser();
  const storageStates = {};

  try {
    const roles = new Set(selectedRoutes.map((route) => route.auth).filter(Boolean));
    for (const role of roles) {
      storageStates[role] = await signIn(browser, role);
    }

    for (const route of selectedRoutes) {
      for (const viewport of VIEWPORTS) {
        await capture(browser, route, viewport, report, storageStates[route.auth]);
      }
    }

    if (!only || only.has("home")) {
      await captureReducedMotion(browser, report);
    }
  } finally {
    await browser.close();
  }

  await writeFile(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`);

  const failures = report.filter((entry) => entry.error);
  const overflow = report.filter((entry) => entry.horizontalOverflow);
  const broken = report.filter((entry) => entry.brokenImages?.length);
  const errors = report.filter(
    (entry) =>
      entry.consoleErrors?.length || entry.pageErrors?.length || entry.failedRequests?.length
  );

  console.log(
    `\nCaptured ${report.length - failures.length}/${report.length} screenshots → ${OUT_DIR}`
  );
  console.log(`Report → ${REPORT_PATH}`);

  if (overflow.length)
    console.log(
      `\nHorizontal overflow (${overflow.length}): ${overflow.map((e) => e.label).join(", ")}`
    );
  if (broken.length)
    console.log(`\nBroken images (${broken.length}): ${broken.map((e) => e.label).join(", ")}`);
  if (errors.length)
    console.log(
      `\nConsole/request errors (${errors.length}): ${errors.map((e) => e.label).join(", ")}`
    );
  if (failures.length)
    console.log(
      `\nFailed captures (${failures.length}): ${failures.map((e) => e.label).join(", ")}`
    );

  if (failures.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
