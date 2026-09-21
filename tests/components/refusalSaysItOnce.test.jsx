/** @vitest-environment jsdom */
/**
 * refusalSaysItOnce.test.jsx — ONE CLICK, ONE NOTICE, AND IT NAMES THE RIGHT READER.
 *
 * ── F12: THE MIRROR-IMAGE OF THE SILENT REFUSAL ───────────────────────────────
 * ⛔ NO GATE REFUSES SILENTLY (ODQ §934.24(c)) — and none shouts in the wrong place
 * either. `lastRefusal` is ONE record on the store and every mount renders it, so the
 * 2026-09-20 anonymous walk forked the Black Crag CITY card on /create and measured
 * TWO `role="alert"` nodes carrying byte-identical copy: one above the hero CTA, one
 * above the Founding Worlds strip (REVIEW-P F12, `A-citycard-after-desktop.png`). An
 * assistive reader hears one click announced twice, and one of the two sentences sits
 * over a control they never touched.
 *
 * ── F13: AND THE SENTENCE NAMED SOMETHING THE READER DOES NOT HAVE ────────────
 * The same copy read "A City is past what THIS ACCOUNT forges" to a visitor with no
 * account, one clause before inviting them to make one.
 *
 * ── WHAT IS PROVED HERE, AND IN WHICH REGISTER ────────────────────────────────
 *   DOM      — the two surfaces /create composes are mounted together, the strip's own
 *              card is clicked, and the live regions are counted off the document.
 *   WIRING   — that /create really composes those two is read off GenerateWizard's
 *              source, so the DOM arm cannot pass over a pair the page never renders.
 *   COPY     — the anonymous branch of the tier sentence, derived through `refusalCopy`
 *              and `accountHolderPhrase`, never typed here.
 *   GATE     — the generation lane really measures the tier at BOTH refusal doors,
 *              read off its source, with the matcher driven over doctored text.
 */
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { REFUSAL_REASONS, REFUSAL_SURFACES, refusalOf } from '../../src/lib/refusalReasons.js';
import { refusalCopy } from '../../src/components/primitives/RefusalNotice.jsx';
import { accountHolderPhrase } from '../../src/config/tierFacts.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { codeOnly } from '../helpers/codeOnlySource.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

vi.mock('../../src/components/home/WelcomeBackCard.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/AnonTierTeaser.jsx', () => ({ default: () => null }));
vi.mock('../../src/hooks/useIsMobile.js', () => ({ default: () => false, getIsMobile: () => false }));
vi.mock('../../src/lib/anonGenCounter.js', () => ({
  anonAtCap: () => false, anonFullRemaining: () => 1, anonRerollRemaining: () => 2,
}));
vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  Funnel: { homepageView: vi.fn(), anonGenerationCompleted: vi.fn(), track: vi.fn() },
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));
vi.mock('../../src/lib/staleDeploy.js', () => ({
  recoverFromChunkError: async () => 'none', isChunkLoadError: () => false,
}));

/**
 * ⛔ A REAL ZUSTAND STORE, AND THE ARM IS WORTHLESS WITHOUT ONE. The property here is
 * "TWO SUBSCRIBERS, ONE RECORD", so it lives entirely in the notification: a mocked
 * `useStore` whose `subscribe` returns a no-op re-renders only the component whose own
 * `setState` ran, which is always the surface that was clicked. Measured on 2026-09-20:
 * against such a mock the F12 arms below went GREEN with the cure REMOVED, because the
 * hero never re-rendered at all. The same trap `refusalDoesNotTravel.test.jsx` records,
 * and the same cure — drive the store the app drives.
 */
const useStore = create(immer((set) => ({
  generateSettlement: async () => null,
  updateConfig: () => {},
  setWizardMode: () => {},
  setRandomSliderMode: () => {},
  clearNeighbour: () => {},
  setSettlement: () => {},
  setSelectedSettlementId: () => {},
  clearSelectedSettlementId: () => {},
  setLoadedFromSave: () => {},
  setActiveSaveId: () => {},
  setPurchaseModalOpen: () => {},
  setInstitutionToggles: () => {},
  setCategoryToggles: () => {},
  setGoodsToggles: () => {},
  setServiceToggles: () => {},
  applyCosmeticRename: () => {},
  setSavedSettlements: () => true,
  clearSavedSettlements: () => {},
  isTierAllowed: () => true,
  canCustomizePreGeneration: () => false,
  canUseCustomContent: () => false,
  getCustomContentCount: () => 0,
  canSave: () => false,
  maxSaves: () => 0,
  isElevated: () => false,
  auth: { tier: 'anon', user: null, displayName: null },
  config: { ...DEFAULT_CONFIG },
  settlement: null,
  lastSeed: null,
  savedSettlements: [],
  savedSettlementsLoaded: false,
  selectedSettlementId: null,
  lastRefusal: null,
  clearRefusal: () => set((s) => { s.lastRefusal = null; }),
})));
vi.mock('../../src/store/index.js', () => ({ useStore }));

/**
 * The lane's own behaviour at a gate: record the reason WITH the click that earned it,
 * return null. Written through the real store's `set`, so every subscriber is notified
 * exactly as the shipped lane notifies them.
 */
const refusesWith = (reason, vars = null) => vi.fn(async (_seed, options) => {
  useStore.setState((s) => { s.lastRefusal = refusalOf(reason, vars, options?.at ?? null); });
  return null;
});

const CITY_VARS = { size: 'City', max: 'Town', holder: accountHolderPhrase('anon') };

/**
 * The /create empty state's two store-fed mounts, side by side. Mounting the whole
 * wizard would measure its mode picker and its lazy dossier chunk rather than the
 * property on trial; that these ARE the two /create composes is proved by the WIRING
 * arm below, off the wizard's own source.
 */
async function renderCreateLandingPair() {
  const HomeHero = (await import('../../src/components/HomeHero.jsx')).default;
  const FoundingWorlds = (await import('../../src/components/generate/FoundingWorlds.jsx')).default;
  render(
    <>
      <HomeHero onSignIn={() => {}} onNavigate={() => {}} />
      <FoundingWorlds onNavigate={() => {}} />
    </>,
  );
}

beforeEach(() => {
  useStore.setState((s) => {
    s.lastRefusal = null;
    s.generateSettlement = vi.fn();
    s.auth = { tier: 'anon', user: null, displayName: null };
  });
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe('F12 — one click raises exactly one notice', () => {
  test('forking the city card says it ONCE, on the strip that was clicked', async () => {
    useStore.setState((s) => { s.generateSettlement = refusesWith(REFUSAL_REASONS.TIER, CITY_VARS); });
    await renderCreateLandingPair();
    fireEvent.click((await screen.findAllByRole('button', { name: /fork this sample/i }))[1]);

    const alerts = await screen.findAllByRole('alert');
    expect(alerts, 'one refusal was announced by more than one surface').toHaveLength(1);
    // …and it is the STRIP's, not the hero's: the notice sits inside the section the
    // reader clicked in, which is the whole content of "where the reader clicked".
    expect(
      screen.getByRole('region', { name: /founding worlds/i }).contains(alerts[0]),
      'the one surviving notice is not on the surface that raised it',
    ).toBe(true);
  });

  test('the hero still says its OWN refusal, and still says it once', async () => {
    useStore.setState((s) => { s.generateSettlement = refusesWith(REFUSAL_REASONS.DAILY_CAP); });
    await renderCreateLandingPair();
    fireEvent.click(screen.getByRole('button', { name: /forge a /i }));

    const alerts = await screen.findAllByRole('alert');
    expect(alerts).toHaveLength(1);
    expect(
      screen.getByRole('region', { name: /founding worlds/i }).contains(alerts[0]),
      'the hero\'s own refusal was rendered down on the sample strip',
    ).toBe(false);
  });

  test('CONTROL: an UNKEYED record is still said, by every surface, exactly as before', async () => {
    // The pre-cure behaviour, kept on purpose: a raiser that does not name itself —
    // a route-raised reason, an older caller, a hand-built record — loses nothing.
    // Without this the cure would silence surfaces rather than de-duplicate them.
    useStore.setState((s) => {
      s.generateSettlement = vi.fn(async () => {
        useStore.setState((st) => { st.lastRefusal = refusalOf(REFUSAL_REASONS.TIER, CITY_VARS); });
        return null;
      });
    });
    await renderCreateLandingPair();
    fireEvent.click((await screen.findAllByRole('button', { name: /fork this sample/i }))[1]);

    expect(
      (await screen.findAllByRole('alert')).length,
      'an unkeyed record stopped reaching the surfaces that always rendered it',
    ).toBe(2);
  });
});

describe('F13 — the sentence names whose forge it is talking about', () => {
  test('an account-less visitor is not told about "this account"', () => {
    const said = refusalCopy(REFUSAL_REASONS.TIER, CITY_VARS).body;
    expect(said).toContain('an account-less visit');
    // anchored: `said` is proven on the line above to be the resolved tier sentence
    // with the anonymous phrase in it, so the absence below is the cure rather than
    // an empty string or a dotted key.
    expectAbsentWithAnchor(said, 'this account', 'an account-less visit',
      'the anonymous refusal still names an account the reader does not have');
    // anchored: the anonymous phrase is asserted present two lines up, so the body is a resolved sentence.
    expect(said, 'the sentence left a placeholder at a reader').not.toMatch(/\{[a-z]+\}/i);
  });

  test('an ACCOUNT still reads the sentence it always read', () => {
    const said = refusalCopy(REFUSAL_REASONS.TIER, { size: 'Metropolis', max: 'Town', holder: accountHolderPhrase('free') }).body;
    expect(said).toContain('this account');
  });

  test('the OTHER door says the same true thing (the resolved-roll refusal)', () => {
    const said = refusalCopy(REFUSAL_REASONS.RESOLVED_TIER, { size: 'City', holder: accountHolderPhrase('anon') }).body;
    expect(said).toContain('an account-less visit');
    // anchored: the anonymous phrase is asserted present on the line above, so the body is live.
    expect(said).not.toMatch(/\{[a-z]+\}/i);
  });

  test('an unmeasured raiser resolves to words, never to a placeholder', () => {
    // The default var exists so a hand-built record cannot paint `{holder}` at a reader.
    const said = refusalCopy(REFUSAL_REASONS.TIER, { size: 'City', max: 'Town' }).body;
    expect(said).toContain('this account');
    // anchored: the default phrase is asserted present on the line above, so no placeholder survived.
    expect(said).not.toMatch(/\{[a-z]+\}/i);
  });
});

describe('WIRING — read off the source, because mounting the page would prove less', () => {
  const ROOT = process.cwd();
  const WIZARD = readFileSync(join(ROOT, 'src/components/GenerateWizard.jsx'), 'utf8');
  const LANE = readFileSync(join(ROOT, 'src/store/settlementGenerateAction.js'), 'utf8');

  test('/create really composes the hero and the sample strip together', () => {
    const src = codeOnly(WIZARD);
    expect(src, 'the create landing no longer renders the hero').toMatch(/<WizardEmptyState/);
    expect(src, 'the create landing no longer renders the sample strip').toMatch(/<FoundingWorlds/);
  });

  /**
   * Does the lane measure the tier at BOTH refusal doors? A function so the doctored
   * controls below drive the same matcher the live arm does.
   * @param {string} raw
   */
  function measuresHolder(raw) {
    const src = codeOnly(raw);
    return (src.match(/holder:\s*accountHolderPhrase\(/g) || []).length === 2;
  }

  test('the gate measures the tier at the pre-flight AND the resolved-roll door', () => {
    expect(
      measuresHolder(LANE),
      'a tier refusal is recorded without the measured account phrase, so the sentence '
      + 'falls back to "this account" and F13 is live again at that door',
    ).toBe(true);
  });

  test('GUARD-THE-GUARD: the matcher convicts a door that stops measuring', () => {
    expect(measuresHolder(LANE.replace('holder: accountHolderPhrase(state.auth?.tier),', '')), 'the pre-flight door').toBe(false);
    expect(measuresHolder(LANE.replace('holder: accountHolderPhrase(rolled.auth?.tier),', '')), 'the resolved-roll door').toBe(false);
    // …and it reads CODE, so a commented-out call is not coverage.
    expect(measuresHolder(LANE.replace('holder: accountHolderPhrase(state.auth?.tier),', '// holder: accountHolderPhrase(x),'))).toBe(false);
  });

  test('every surface key the register carries is one the lane can stamp', () => {
    expect(codeOnly(LANE), 'the lane stopped reading the click key').toMatch(/options\?\.at/);
    expect(Object.values(REFUSAL_SURFACES).every((k) => typeof k === 'string' && k.length > 0)).toBe(true);
  });
});
