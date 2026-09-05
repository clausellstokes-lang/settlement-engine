/**
 * @vitest-environment jsdom
 *
 * tests/ui/frozenExportRightsFloor.test.jsx — AUDIT-2.2's paid-rights floor, as
 * MACHINERY rather than a docblock (lane PDFDRIFT's finding, chair ruling 2026-09-05).
 *
 * THE DEFECT THIS CLOSES. `SettlementCard.jsx` declares the floor in prose:
 *
 *     "Exports the STORED settlement (never the live store, no worldState, no faith
 *      chapter, no reactivation), so it can never resume the simulation — the lapsed-plan
 *      owner gets out exactly what they made."
 *
 * and NOTHING enforced it. Exactly one test in the estate observed
 * `generateSettlementPDF`'s options (`tests/ui/settlementDetailPdfThreading.test.jsx`),
 * and it mounts only `SettlementDetail` — the ACTIVE, premium surface, whose whole
 * subject is threading the live campaign IN. So the two surfaces that must never
 * receive it were unobserved: a change that threaded the live world into the frozen
 * card's export, or the premium faith chapter into an anonymous purchase, would have
 * left the suite green. Both are PAID-SURFACE behaviour in the harmful direction.
 *
 * THE TWO SURFACES, and why they are the whole set:
 *   1. `SettlementCard`'s frozen export (`handleExportFrozen`) — the only export
 *      affordance a PLAN-INACTIVE save has. It is the entitlement floor: a lapsed plan
 *      can always extract what it made, and it may extract NOTHING MORE.
 *   2. `SingleDossierSuccessPage`'s post-checkout download — an ANONYMOUS $2.99 buyer.
 *      They bought one dossier, not the premium Faith & War chapter.
 *
 * ⭐ THE MOUNTS ARE DELIBERATELY "ACTIVE-LOOKING", WHICH IS WHAT MAKES THESE ARMS BITE.
 * The frozen card is mounted with a PREMIUM auth tier, a live campaign that CONTAINS the
 * save, a live `settlement` in the store that differs from the stored one, and non-null
 * `worldState` / `regionalGraph` PROPS — the card genuinely receives those from
 * CampaignFolder. Every ingredient a leak would need is present and in reach. The arms
 * then assert what did NOT cross the seam. Mounted against a bare store they would be
 * vacuous, and each arm carries a positive control so it cannot go vacuous silently: the
 * exporter must have been called, with the STORED settlement, and the negative-space
 * check runs over a DEEP walk of the options bag rather than a handful of named keys.
 *
 * Idioms follow tests/ui/settlementDetailPdfThreading.test.jsx and
 * tests/ui/settlementsPanel.smoke.test.jsx: a mutable store singleton, mocked analytics,
 * and a mocked `generateSettlementPDF` (vi.mock intercepts the components' DYNAMIC
 * imports of it too).
 *
 * ⛔ THIS FILE PINS BEHAVIOUR THAT EXISTS TODAY. It changes nothing. If an arm reds, the
 * question is whether a paid-rights floor was breached — never whether to relax the arm.
 */

import { describe, test, expect, afterEach, beforeEach, vi } from 'vitest';
import { render, cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import { faithChapterVisible } from '../../src/pdf/variants.js';

afterEach(cleanup);

// ── The observed seam. Both surfaces reach the exporter through a DYNAMIC import;
//    vi.mock intercepts those as well as static ones. ───────────────────────────────
const generateSettlementPDF = vi.fn(() => Promise.resolve());
vi.mock('../../src/utils/generateSettlementPDF.js', () => ({
  generateSettlementPDF: (...args) => generateSettlementPDF(...args),
  default: (...args) => generateSettlementPDF(...args),
}));

// Analytics is fire-and-forget on both paths; stub it so no network wiring mounts.
vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  Funnel: { track: vi.fn(), paidAction: vi.fn() },
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));

// ── The store singleton. Everything here is set to the MOST EXPORT-PERMISSIVE state a
//    real session can carry, so nothing in the assertions below is true merely because
//    the fixture was empty. ───────────────────────────────────────────────────────────
const storeState = {};
const LIVE_WORLD_STATE = Object.freeze({
  canonizedAt: '2026-01-01T00:00:00.000Z',
  tick: 42,
  rngSeed: 'live-seed',
  stressors: [],
});
const LIVE_REGIONAL_GRAPH = Object.freeze({
  edges: [{ id: 'edge.frozen-1.other-1', from: 'frozen-1', to: 'other-1', relationshipType: 'rival' }],
  channels: [],
});
const STORED_SETTLEMENT = Object.freeze({
  id: 'frozen-1',
  name: 'Stoneford',
  tier: 'town',
  npcs: [],
  factions: [],
  neighbourNetwork: [],
});
// The LIVE working copy — present, premium, and DIFFERENT. If the frozen path ever
// reached for the store's settlement instead of the save's, this is what would arrive.
const LIVE_SETTLEMENT = Object.freeze({
  ...STORED_SETTLEMENT,
  name: 'Stoneford After Commit',
});

const baseState = () => ({
  // Premium, signed in, elevated — every gate a leak could ride is OPEN.
  auth: { tier: 'premium', user: { id: 'u1' } },
  isElevated: () => true,
  canExport: () => true,
  dossierEntitlements: { 'frozen-1': true },
  settlement: LIVE_SETTLEMENT,
  activeSaveId: 'frozen-1',
  // A live campaign that CONTAINS the frozen save, with a live world on it.
  campaigns: [{
    id: 'c1',
    name: 'The Ember March',
    settlementIds: ['frozen-1', 'other-1'],
    worldState: LIVE_WORLD_STATE,
    regionalGraph: LIVE_REGIONAL_GRAPH,
  }],
  savedSettlements: [
    { id: 'frozen-1', name: 'Stoneford', settlement: STORED_SETTLEMENT },
    { id: 'other-1', name: 'Mossbridge', settlement: { id: 'other-1', name: 'Mossbridge' } },
  ],
  // The card's mutation-block reads (SettlementCard.jsx `mutationBlocks`).
  advanceInFlight: [],
  campaignMutationLocks: [],
  getSettlementDeletionBlock: () => null,
  getCampaignMutationBlock: () => null,
  getCampaignMembershipBlock: () => null,
  setPurchaseModalOpen: vi.fn(),
  markExported: vi.fn(),
});

vi.mock('../../src/store/index.js', () => {
  function useStore(selector) {
    return selector(storeState);
  }
  useStore.subscribe = () => () => {};
  useStore.getState = () => storeState;
  return { useStore };
});

// ── The anonymous-purchase surface's own seams. `vi.mock` is hoisted to the top of the
//    FILE by vitest, so these are declared here rather than inside their describe, where
//    the hoisting would move them anyway and read as if it had not. The frozen-card
//    surface imports none of them. ───────────────────────────────────────────────────
//
// The paid-session verify resolves with the SERVER-PERSISTED settlement, which is the
// branch the real returning flow takes. The literal is inline because a hoisted factory
// may not close over a module-scope binding.
vi.mock('../../src/lib/stripe.js', () => ({
  verifySingleDossierPurchase: vi.fn(() => Promise.resolve({
    settlement: {
      id: 'anon-1', name: 'Harrowgate', tier: 'village', npcs: [], factions: [], neighbourNetwork: [],
    },
  })),
}));
// No local stash: the server copy is the one under test, and a stash fallback would let
// this arm pass on a settlement the server never returned.
vi.mock('../../src/lib/pendingDossier.js', () => ({
  readPendingDossier: () => null,
  readPendingDossierByToken: () => null,
  clearPendingDossier: vi.fn(),
}));
vi.mock('../../src/components/perimeter/CaptchaGate.jsx', () => ({ default: () => null }));
// Flag OFF is the default production path: the mount effect fires the verify
// synchronously instead of waiting out the Turnstile token deadline.
vi.mock('../../src/lib/flags.js', () => ({ flag: () => false }));

beforeEach(() => {
  generateSettlementPDF.mockClear();
  for (const k of Object.keys(storeState)) delete storeState[k];
  Object.assign(storeState, baseState());
});

/**
 * A DEEP walk of the options bag for any value that could only have come from the live
 * world. Named keys alone would miss a rename or a nesting change, which is exactly how
 * a floor written in prose stops holding.
 *
 * @param {unknown} value the options bag
 * @param {Array<{needle: unknown, what: string}>} forbidden values that must not appear
 * @returns {string[]} dotted paths at which a forbidden value was found
 */
function forbiddenPaths(value, forbidden, path = 'options', out = [], seen = new Set()) {
  for (const { needle, what } of forbidden) {
    if (value === needle) out.push(`${path} === ${what}`);
  }
  if (!value || typeof value !== 'object' || seen.has(value)) return out;
  seen.add(value);
  for (const [k, v] of Object.entries(value)) {
    forbiddenPaths(v, forbidden, `${path}.${k}`, out, seen);
  }
  return out;
}

/** Every key name anywhere in the bag, so a live-world payload cannot hide under a rename. */
function allKeys(value, out = new Set(), seen = new Set()) {
  if (!value || typeof value !== 'object' || seen.has(value)) return out;
  seen.add(value);
  if (Array.isArray(value)) {
    for (const v of value) allKeys(v, out, seen);
    return out;
  }
  for (const [k, v] of Object.entries(value)) {
    out.add(k);
    allKeys(v, out, seen);
  }
  return out;
}

const LIVE_WORLD_VALUES = [
  { needle: LIVE_WORLD_STATE, what: 'the live campaign worldState' },
  { needle: LIVE_REGIONAL_GRAPH, what: 'the live regionalGraph' },
  { needle: LIVE_SETTLEMENT, what: "the store's live working settlement" },
];

/** The keys a campaign-resolving export threads (SettlementDetail's shape). None may appear. */
const CAMPAIGN_THREADING_KEYS = ['campaign', 'worldState', 'regionalGraph', 'nameById', 'nameFor', 'settlements'];

describe('AUDIT-2.2 — the frozen card export is a floor, not a doorway', () => {
  async function mountFrozenCardAndExport() {
    const { SettlementCard } = await import('../../src/components/settlements/SettlementCard.jsx');
    const save = {
      id: 'frozen-1',
      name: 'Stoneford',
      // THE ONE THING THAT MAKES THIS CARD FROZEN. `saveAccessState` reads this.
      accessState: 'inactive_plan',
      settlement: STORED_SETTLEMENT,
      campaignState: { phase: 'canon', eventLog: [], locks: {} },
      savedAt: Date.parse('2026-02-01T00:00:00.000Z'),
    };
    render(
      <table>
        <tbody>
          <SettlementCard
            s={save}
            /* A MAP, not a bare object: `getAllModifiers` returns one and the card calls
               `allModifiers.get(s.id)` at two sites. A `{}` throws inside the render, which
               is how this fixture first reported — the mount is a real mount. */
            allModifiers={new Map()}
            onView={() => {}}
            deleteId={null}
            setDeleteId={() => {}}
            deleteConfirmed={() => {}}
            campaigns={storeState.campaigns}
            addToCampaign={() => {}}
            removeFromCampaign={() => {}}
            currentCampaignId="c1"
            regionalCounts={{}}
            onReactivate={() => {}}
            canReactivate
            reactivatingId={null}
            onCanonize={() => {}}
            /* THE CARD REALLY DOES RECEIVE THESE from CampaignFolder — a live world is
               in the component's own hands, one property access from the export. */
            worldState={LIVE_WORLD_STATE}
            regionalGraph={LIVE_REGIONAL_GRAPH}
            nameFor={(id) => String(id)}
            onAdvanceTime={() => {}}
            onCreateCampaign={() => {}}
            onNavigate={() => {}}
            canManageCampaigns
          />
        </tbody>
      </table>,
    );
    // POSITIVE CONTROL: the frozen arm is the one that rendered. If the fixture ever
    // stops being plan-inactive, this button does not exist and the test reds HERE
    // rather than passing an assertion about a payload nobody produced.
    const button = await screen.findByRole('button', { name: /Export PDF/i });
    fireEvent.click(button);
    await waitFor(() => expect(generateSettlementPDF).toHaveBeenCalledTimes(1));
    return generateSettlementPDF.mock.calls[0];
  }

  test('the frozen export sends the STORED settlement and the phase, and nothing else', async () => {
    const [settlementArg, options] = await mountFrozenCardAndExport();

    // The stored blob BY IDENTITY — not the store's live working copy, which is
    // present, premium-owned, and differently named.
    expect(settlementArg).toBe(STORED_SETTLEMENT);
    expect(settlementArg).not.toBe(LIVE_SETTLEMENT);
    expect(settlementArg.name).toBe('Stoneford');

    // The options bag is EXACTLY the phase. An exact-equality pin, not a subset check:
    // a subset check is what let this floor be prose for so long.
    expect(options).toEqual({ phase: 'canon' });
  });

  test('no live world, no campaign resolution and no faith unlock cross the frozen seam', async () => {
    const [, options] = await mountFrozenCardAndExport();

    // BY VALUE IDENTITY, deep — a rename or a re-nesting cannot hide the payload.
    expect(forbiddenPaths(options, LIVE_WORLD_VALUES)).toEqual([]);
    // BY KEY NAME, deep — the campaign-threading shape SettlementDetail sends.
    const keys = allKeys(options);
    expect(CAMPAIGN_THREADING_KEYS.filter((k) => keys.has(k))).toEqual([]);

    // THE FAITH CHAPTER. `faithUnlocked` is absent, which is not `true`; and the gate
    // itself is asked, so this arm survives a change in how absence is read.
    expect(options.faithUnlocked === true).toBe(false);
    expect(faithChapterVisible({
      variant: 'canon_dossier',
      phase: 'canon',
      // The most generous reading available to a leak: pretend a live world arrived.
      hasLiveWorld: true,
      faithUnlocked: options.faithUnlocked,
    })).toBe(false);

    // NON-VACUITY CONTROL: the gate is not simply always false. With the flag the
    // premium surface threads, the SAME call returns true — so the `false` above is the
    // value this export passed, never the instrument refusing everything.
    expect(faithChapterVisible({
      variant: 'canon_dossier',
      phase: 'canon',
      hasLiveWorld: true,
      faithUnlocked: true,
    })).toBe(true);
  });
});

describe('AUDIT-2.2 — the anonymous purchase downloads what it bought, and no more', () => {
  const PURCHASED = Object.freeze({
    id: 'anon-1',
    name: 'Harrowgate',
    tier: 'village',
    npcs: [],
    factions: [],
    neighbourNetwork: [],
  });

  beforeEach(() => {
    // Both params are required or `canAttempt` is false and the page never verifies —
    // which would make every assertion below an assertion about nothing. The positive
    // control inside the test is what proves this landed.
    window.history.replaceState({}, '', '/?checkout=success&product=single_dossier&session_id=cs_test_1&dt=tok_1');
  });

  test('the $2.99 download sends only isAnonymous:false — no live world, no faith chapter', async () => {
    const SingleDossierSuccessPage = (await import('../../src/components/SingleDossierSuccessPage.jsx')).default;
    render(<SingleDossierSuccessPage onSignUp={() => {}} onGenerateAnother={() => {}} />);

    // POSITIVE CONTROL: verification resolved and the auto-download fired. Without
    // this, every negative below would be an assertion about a call nobody made.
    await waitFor(() => expect(generateSettlementPDF).toHaveBeenCalledTimes(1));
    const [settlementArg, options] = generateSettlementPDF.mock.calls[0];

    expect(settlementArg.name).toBe(PURCHASED.name);
    expect(options).toEqual({ isAnonymous: false });

    // Deep key sweep: none of the campaign-threading shape, on a page whose store is
    // the same premium-looking singleton every other arm here uses.
    const keys = allKeys(options);
    expect(CAMPAIGN_THREADING_KEYS.filter((k) => keys.has(k))).toEqual([]);
    expect(forbiddenPaths(options, LIVE_WORLD_VALUES)).toEqual([]);

    expect(options.faithUnlocked === true).toBe(false);
    expect(faithChapterVisible({
      variant: 'canon_dossier',
      phase: 'canon',
      hasLiveWorld: true,
      faithUnlocked: options.faithUnlocked,
    })).toBe(false);
  });
});
