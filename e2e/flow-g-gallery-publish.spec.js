/**
 * e2e/flow-g-gallery-publish.spec.js — Tier 3.7 Flow G (LT37 car 2).
 *
 * GALLERY PUBLISH — the fifth of row 13's named journeys, and the only one that
 * had no spec (`grep -rn "gallery" e2e/*.spec.js` returned 0 at f73bdbf16).
 * Publish was covered only at unit level (tests/components/shareToGalleryReloadSeed,
 * tests/ui/galleryDetailRestore, the P0.7 publishGateWiring pin), so nothing drove
 * the REAL publish control through the REAL gate in a browser.
 *
 * The journey: a signed-in owner opens a saved settlement's detail view, opens
 * the Share to Gallery panel from the Actions rail, and presses Share to gallery.
 * Both arms of the P0.7 publish gate are asserted:
 *   1. BLOCKED — a dossier whose facts contradict (validateDossier's
 *      `impossible_food_math`: a surplus while produced AND needed read zero)
 *      is HARD-BLOCKED: the error copy renders, the publish RPC is never called,
 *      and the surface never reaches the published state.
 *   2. CLEAN — the same journey on a consistent dossier calls publish_settlement
 *      exactly once and the surface flips to the published state (Public badge
 *      plus the copy-link affordance).
 * Arm 1 is the negative control for arm 2: if the gate went inert, arm 1 would
 * see a publish call and the published state.
 *
 * Runs against the CONFIGURED (:5174) server for the same reason as flow-e and
 * flow-f: publishSettlement hard-guards on `isConfigured` (src/lib/gallery.js:58
 * `if (!isConfigured) throw`). Under the default LOCAL server that guard throws
 * before the RPC, so there is nothing for page.route to intercept and the clean
 * arm cannot be observed at all. Every outbound Supabase route is stubbed here;
 * no real network is touched.
 */

import { test, expect } from '@playwright/test';

test.use({ baseURL: 'http://localhost:5174' });

// supabase-js derives its storage key as `sb-<subdomain>-auth-token` from the
// project URL. The configured server uses https://mock.supabase.co → "mock".
const STORAGE_KEY = 'sb-mock-auth-token';
const SAVE_ID = '22222222-2222-4222-8222-222222222222';
const PUBLISHED_SLUG = 'stonebridge-e2e-flowg';

const USER = {
  id: '33333333-3333-4333-8333-333333333333',
  aud: 'authenticated',
  role: 'authenticated',
  email: 'owner@example.test',
  user_metadata: {},
  app_metadata: {},
};

function farFutureSession() {
  const nowSec = Math.floor(Date.now() / 1000);
  return {
    access_token: 'e2e-fake-access-token',
    token_type: 'bearer',
    expires_in: 31_536_000,
    expires_at: nowSec + 31_536_000,
    refresh_token: 'e2e-fake-refresh-token',
    user: USER,
  };
}

/**
 * A settlement complete enough for the detail view to render its dossier.
 * `foodBalance` is the one knob the two arms differ on: CONSISTENT produces a
 * plain surplus with real production and need; CONTRADICTORY reports a surplus
 * while produced AND needed are both zero, which is exactly
 * validateDossier's `impossible_food_math` blocking record
 * (src/domain/validation/consistency.js:57-66).
 */
function settlementData(foodBalance) {
  return {
    id: 'sett.flowg',
    name: 'Stonebridge',
    tier: 'town',
    population: 1800,
    config: { tradeRouteAccess: 'road', culture: 'Mixed', magicLevel: 'low' },
    institutions: [],
    powerStructure: { factions: [], conflicts: [] },
    npcs: [],
    hooks: [],
    economicState: { primaryExports: [], primaryImports: [], activeChains: [], prosperity: 'Moderate' },
    economicViability: { viable: true, summary: 'Viable.', metrics: { foodBalance } },
    activeConditions: [],
    neighbourNetwork: [],
    history: {},
  };
}

const CONSISTENT = { dailyProduction: 2400, dailyNeed: 2200, surplus: 200, deficit: 0, deficitPercent: 0 };
const CONTRADICTORY = { dailyProduction: 0, dailyNeed: 0, surplus: 200, deficit: 0, deficitPercent: 0 };

function savedRow(foodBalance) {
  return {
    id: SAVE_ID,
    name: 'Stonebridge',
    tier: 'town',
    data: settlementData(foodBalance),
    config: { tradeRouteAccess: 'road' },
    toggles: {},
    seed: 'flowg-seed',
    neighbour_links: null,
    ai_data: {},
    gallery_share_narrated: false,
    gallery_share_dm: false,
    gallery_importable: false,
    gallery_member_overrides: null,
    is_public: false,
    public_slug: null,
    visibility: 'public',
    unlisted_slug: null,
    gallery_description: '',
    gallery_title: '',
    gallery_image_url: '',
    gallery_image_alt: '',
    gallery_tags: [],
    // CANONIZED, and it has to be: ShareToGallery soft-gates publish on
    // isCampaignCanonized(campaignState) and saves.js migrateSaveToV2 stamps
    // `{ phase: 'draft', canonizedAt: null }` onto any row that carries no
    // campaign state, so a null here renders the publish button DISABLED behind
    // "Start the World Clock before sharing the dossier publicly" and neither arm
    // of the validateDossier gate below is ever reached. A publishable dossier is
    // a canon one; this row is one.
    campaign_state: {
      phase: 'canon',
      eventLog: [],
      systemState: null,
      locks: {},
      generatedAt: '2026-09-01T00:00:00.000Z',
      editedAt: '2026-09-01T00:00:00.000Z',
      canonizedAt: '2026-09-01T00:00:00.000Z',
      lastExportAt: null,
      narrativeDrift: null,
      exportState: null,
    },
    version_history: [],
    access_state: 'active',
    inactive_reason: null,
    inactive_since: null,
    retention_expires_at: null,
    reactivated_free_at: null,
    created_at: '2026-09-01T00:00:00.000Z',
    updated_at: '2026-09-01T00:00:00.000Z',
  };
}

/**
 * Stub the whole Supabase surface. Routes registered later win in Playwright, so
 * the broad REST safety net goes first. Returns a live counter of publish RPC
 * calls, which is what makes the blocked arm a real negative control rather than
 * an assertion about copy alone.
 */
async function stubSupabase(page, foodBalance) {
  const publishCalls = { count: 0 };

  await page.route('**/rest/v1/**', route =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));

  await page.route('**/auth/v1/**', route =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(USER) }));

  await page.route('**/rest/v1/profiles**', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: USER.id, tier: 'premium', role: 'user',
        display_name: 'Owner', is_founder: false, email: USER.email,
        avatar_url: null, email_notifications: true, model_preference: null,
      }),
    }));

  // The owner's library. A PATCH (updateGalleryMetadata) on the same path must
  // NOT be answered with the row list, so branch on the method.
  await page.route('**/rest/v1/settlements**', route => {
    const method = route.request().method();
    if (method === 'GET') {
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([savedRow(foodBalance)]) });
    }
    return route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
  });

  await page.route('**/rest/v1/rpc/publish_settlement**', route => {
    publishCalls.count += 1;
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(PUBLISHED_SLUG) });
  });

  await page.route('**/functions/v1/**', route =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '{}' }));

  return publishCalls;
}

async function seedSession(page) {
  await page.addInitScript(({ key, session }) => {
    try { localStorage.setItem(key, JSON.stringify(session)); } catch { /* private mode */ }
  }, { key: STORAGE_KEY, session: farFutureSession() });
}

async function openSharePanel(page) {
  await page.goto(`/settlements/${SAVE_ID}`);
  await expect(page.getByText('Stonebridge', { exact: false }).first()).toBeVisible({ timeout: 30_000 });

  // The onboarding coach opens over the dossier on a first visit ("Save it to
  // your library", step 1 of 4). It is a real dialog, so it intercepts the rail
  // clicks below; dismiss it if it is up. Not asserted: whether the coach shows
  // is orthogonal to the publish gate, and pinning it here would make this spec
  // red on an onboarding change that has nothing to do with publishing.
  const coachDone = page.getByRole('button', { name: /got it from here/i });
  if (await coachDone.count()) await coachDone.first().click();

  // The Share verb lives in the Actions rail in READ mode (owner order
  // 2026-07-22; src/components/settlement/NextActionRail.jsx:219-228), and the
  // rail COLLAPSES its tail behind a "Show N more" disclosure — Share is in that
  // tail, so the disclosure must be opened before the verb exists in the DOM.
  const showMore = page.getByRole('button', { name: /Show \d+ more/i });
  if (await showMore.count()) await showMore.first().click();

  const shareVerb = page.getByRole('button', { name: /Share to Gallery/i }).first();
  await expect(shareVerb).toBeVisible({ timeout: 20_000 });
  await shareVerb.click();
  const publish = page.getByRole('button', { name: /^Share to gallery$/ });
  await expect(publish).toBeVisible({ timeout: 20_000 });
  return publish;
}

test.describe('Tier 3.7 Flow G — gallery publish gate', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'mobile-safari', 'desktop-only journey');
    await seedSession(page);
  });

  test('BLOCKED: a contradictory dossier is refused, and publish is never called', async ({ page }) => {
    test.setTimeout(90_000);
    const publishCalls = await stubSupabase(page, CONTRADICTORY);
    const publish = await openSharePanel(page);

    await publish.click();

    // errors.publishBlocked (src/copy/en.js:961).
    await expect(page.getByText(/Can.t publish yet: 1 consistency issue/i)).toBeVisible({ timeout: 15_000 });
    // The gate held: no RPC, and the surface never reached the published state.
    expect(publishCalls.count, 'validateDossier did not block the publish RPC').toBe(0);
    await expect(page.getByText('Public', { exact: true })).toHaveCount(0);
    await expect(page.getByRole('button', { name: /Copy link/i })).toHaveCount(0);
  });

  test('CLEAN: a consistent dossier publishes once and the surface shows the published state', async ({ page }) => {
    test.setTimeout(90_000);
    const publishCalls = await stubSupabase(page, CONSISTENT);
    const publish = await openSharePanel(page);

    await publish.click();

    await expect(page.getByRole('button', { name: /Copy link/i })).toBeVisible({ timeout: 20_000 });
    await expect(page.getByText('Public', { exact: true })).toBeVisible();
    expect(publishCalls.count, 'publish_settlement was not called exactly once').toBe(1);
    // The blocked-arm copy must NOT appear on the clean path.
    await expect(page.getByText(/Can.t publish yet/i)).toHaveCount(0);
  });
});
