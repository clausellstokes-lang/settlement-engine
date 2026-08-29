/**
 * @vitest-environment jsdom
 *
 * tests/config/entitlementLadder.enforcement.test.js — THE ENFORCEMENT-SYMBOL
 * WALKER (ODQ §464.2 O-P1, as corrected at §449 and ruled at §471.2/F4).
 *
 * THE FAILURE THIS EXISTS TO CATCH: the pricing table claiming a Cartographer
 * paywall the code does not enforce. Ten rows carried the marker
 * `ruled-2026-07-17`, whose whole meaning was "granted by the ruling, gate not
 * landed". Measured, that sentence was false in BOTH directions — four rows had
 * been enforced all along under a symbol the ladder never named
 * (`viewerCanAuthor`), and two named a capability that is not merely ungated but
 * UNSHIPPED. A marker that can be wrong in both directions is not evidence, so
 * this walker replaces the marker with a resolution: every row that CLAIMS a
 * paywall must name a symbol that, DRIVEN HERE, refuses a free viewer and grants
 * a premium one.
 *
 * THE PREDICATE IS THE PAIR COMPARISON, AND THAT WAS MEASURED BEFORE IT WAS
 * WRITTEN (§471.2/F4). "Claims a paywall" is `row.free !== row.cartographer`,
 * never `row.free !== true`: `all-lenses` and `surveyor-stages` carry EQUAL
 * STRING cells ('all 5 lenses', 'per task'), which the second spelling would
 * convict as paywalls that owe a gate. Executed over all 19 rows at the base
 * commit the two spellings gave 11 and 13; the two extras were exactly those
 * rows. Mutant M6 drives the wrong predicate and the equal-string control below
 * is what convicts it.
 *
 * THE ABSENCE PIN READS VALUES, NOT SOURCE TEXT. A scan of
 * entitlementLadder.js for the retired marker would match that file's own
 * explanatory prose and pass while a live row still carried it — the
 * doc-agreement vacuity class. Every assertion here reads `row.enforcement`.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { createElement } from 'react';
import { readFileSync } from 'node:fs';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { resolve } from 'node:path';

beforeEach(() => { window.localStorage.clear(); window.history.replaceState({}, '', '/'); });
afterEach(() => { cleanup(); window.localStorage.clear(); });

// Network edges stubbed exactly as the pricingPageBands harness stubs them.
vi.mock('../../src/lib/stripe.js', () => ({ startCheckout: vi.fn(), startCustomerPortal: vi.fn() }));
vi.mock('../../src/lib/supabase.js', () => ({ isConfigured: false, supabase: null, withTimeout: (p) => p }));
vi.mock('../../src/lib/founderSeats.js', () => ({ FOUNDER_SEAT_CAP: 30, fetchFounderSeatsRemaining: vi.fn(async () => 17) }));

const storeState = {
  auth: { tier: 'free', isFounder: false, displayName: '' },
  savedSettlements: [],
  lifetimeNarrateCount: 0,
  isElevated: () => false,
};
vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.subscribe = () => () => {};
  useStore.getState = () => storeState;
  return { useStore };
});

import PricingPage from '../../src/components/PricingPage.jsx';
import { ENTITLEMENT_LADDER, DEFERRED_LADDER_ROWS, VIEWING_PAYWALLS_PENDING_514 } from '../../src/config/entitlementLadder.js';
import { TIER_GATE } from '../../src/store/authSlice.js';
import { viewerCanAuthor } from '../../src/lib/viewerAuthority.js';
import { pricingPage } from '../../src/copy/pricingPage.js';

const read = (rel) => readFileSync(resolve(process.cwd(), rel), 'utf-8');

/** Every ladder row, flattened out of its capability group. */
const ROWS = ENTITLEMENT_LADDER.flatMap((group) => group.rows);

/** A row CLAIMS a paywall when its two cells differ. See the header. */
const claims = (row) => row.free !== row.cartographer;

/**
 * THE RESOLVER TABLE. Each entry DRIVES the named symbol and answers one
 * question: does a free viewer get refused and a premium viewer granted? These
 * are executed calls against the real gate, not greps for a spelling.
 */
const RESOLVERS = Object.freeze({
  'TIER_GATE.maxSaves':      () => TIER_GATE.free.maxSaves < TIER_GATE.premium.maxSaves,
  'TIER_GATE.customContent': () => TIER_GATE.free.customContent === false && TIER_GATE.premium.customContent === true,
  'TIER_GATE.neighbour':     () => TIER_GATE.free.neighbour === false && TIER_GATE.premium.neighbour === true,
  'TIER_GATE.mapChains':     () => TIER_GATE.free.mapChains === false && TIER_GATE.premium.mapChains === true,
  'TIER_GATE.export':        () => TIER_GATE.free.export === false && TIER_GATE.premium.export === true,
  'viewerCanAuthor':         () => viewerCanAuthor({ auth: { tier: 'free' } }) === false
                                && viewerCanAuthor({ auth: { tier: 'premium' } }) === true,
});

/**
 * Markers that describe a row's DERIVATION rather than a refusal. A parity row
 * has nothing to refuse, so demanding a resolver of it would be demanding a gate
 * that must not exist.
 */
const PARITY_MARKERS = Object.freeze(new Set([
  'parity', 'constitutional', 'TIER_GATE.free.maxTier', 'TOWN_MAP_STYLE_IDS', 'SURVEYOR_AI_COSTS',
]));

describe('rule A — every row that CLAIMS a paywall names a symbol that RESOLVES', () => {
  it('the claiming and parity sets are what the ruling left behind, and both are non-empty', () => {
    const claiming = ROWS.filter(claims).map((r) => r.id);
    const parity = ROWS.filter((r) => !claims(r)).map((r) => r.id);
    // Printed rather than merely counted: a successor reading a failure needs the
    // membership, not an integer that could match for the wrong reason.
    expect(claiming).toEqual([
      'saves', 'custom-content', 'living-realm', 'map-chains',
      'map-editing', 'dm-pins', 'change-view', 'fog-table', 'export-bundle',
    ]);
    expect(parity).toEqual([
      'every-size', 'gallery-viewing', 'same-engine',
      'map-view', 'provenance-hover', 'all-lenses', 'panorama', 'surveyor-stages',
    ]);
    // GUARD THE GUARD: an empty claiming set would make every arm below vacuous.
    expect(claiming.length).toBeGreaterThan(0);
    expect(parity.length).toBeGreaterThan(0);
  });

  it('each claiming row resolves to "free refused, premium granted" when the symbol is DRIVEN', () => {
    const unresolved = [];
    for (const row of ROWS.filter(claims)) {
      const resolver = RESOLVERS[row.enforcement];
      if (!resolver) { unresolved.push(`${row.id}: enforcement '${row.enforcement}' has no resolver — the row claims a paywall no symbol enforces`); continue; }
      if (resolver() !== true) unresolved.push(`${row.id}: '${row.enforcement}' did not refuse free and grant premium`);
    }
    expect(unresolved, `\n${unresolved.join('\n')}\n`).toEqual([]);
  });

  it('NEGATIVE CONTROL: a planted claiming row on an unresolvable marker is caught', () => {
    const planted = { id: 'planted-claim', free: false, cartographer: true, enforcement: 'ruled-x' };
    expect(claims(planted)).toBe(true);
    expect(RESOLVERS[planted.enforcement]).toBeUndefined();
  });

  it('NEGATIVE CONTROL: an EQUAL-STRING row is not a claim — the predicate is the pair, not `free !== true`', () => {
    const planted = { id: 'planted-parity', free: 'x', cartographer: 'x', enforcement: 'ruled-x' };
    expect(claims(planted)).toBe(false);
    // The wrong predicate (§471.2/F4 M6) would convict this row and the two real
    // equal-string rows with it.
    expect(planted.free !== true).toBe(true);
    const wrongPredicateVictims = ROWS.filter((r) => r.free !== true && !claims(r)).map((r) => r.id);
    expect(wrongPredicateVictims).toEqual(['all-lenses', 'surveyor-stages']);
  });
});

describe('rule B — a parity row demands no gate, and the retired marker is gone', () => {
  it('every non-claiming row carries a parity-class marker and none carries a resolver', () => {
    for (const row of ROWS.filter((r) => !claims(r))) {
      expect(PARITY_MARKERS.has(row.enforcement), `${row.id} is parity but names '${row.enforcement}'`).toBe(true);
    }
  });

  it("every row marked 'parity' has literally equal cells", () => {
    const marked = ROWS.filter((r) => r.enforcement === 'parity');
    expect(marked.map((r) => r.id)).toEqual(['gallery-viewing', 'map-view', 'provenance-hover', 'panorama']);
    for (const row of marked) {
      expect(row.free, `${row.id} free`).toBe(true);
      expect(row.cartographer, `${row.id} cartographer`).toBe(true);
    }
  });

  it('NO row carries the retired ruled-2026-07-17 marker (read off values, never source text)', () => {
    const stale = ROWS.filter((r) => r.enforcement === 'ruled-2026-07-17').map((r) => r.id);
    expect(stale).toEqual([]);
    // Anchored: the same array of markers is proven non-empty and populated, so
    // the emptiness above is a measured absence rather than an empty walk.
    expect(ROWS.map((r) => r.enforcement).filter(Boolean).length).toBe(ROWS.length);
  });
});

describe('rule C — the de-advertised rows left the table as a MOVE, not a deletion', () => {
  it('interiors and v2-redraw are in the deferred ledger and NOT in the ladder', () => {
    expect(DEFERRED_LADDER_ROWS.map((r) => r.id)).toEqual(['interiors', 'v2-redraw']);
    for (const row of DEFERRED_LADDER_ROWS) {
      expect(row.returnsAt).toBe('map activation D3b/P6');
      expect(row.reason.length, `${row.id} needs a written reason`).toBeGreaterThan(20);
    }
    // The anchor is dm-pins: a row that travels the SAME maps-exports group and the
    // same Object.freeze pipeline, so a ladder that emptied or re-keyed reds on the
    // anchor rather than passing the two exclusions vacuously.
    const ladderIds = ROWS.map((r) => r.id);
    expectAbsentWithAnchor(ladderIds, 'interiors', 'dm-pins', 'de-advertised ids leave the ladder');
    expectAbsentWithAnchor(ladderIds, 'v2-redraw', 'dm-pins', 'de-advertised ids leave the ladder');
  });

  it('their display labels STAY in the copy registry so the return is two lines', () => {
    const labels = pricingPage.band4.rows;
    expect(labels.interiors).toBe('Building interiors');
    expect(labels['v2-redraw']).toBe('The v2 map redraw');
  });

  it('the rendered comparison table no longer advertises either capability', () => {
    const { container } = render(createElement(PricingPage));
    const text = container.textContent;
    // The anchor is the DM pins label: it renders through the same comparison-table
    // map, so a page that failed to render reds on the anchor instead of reporting
    // two absences from an empty string.
    const anchor = pricingPage.band4.rows['dm-pins'];
    expectAbsentWithAnchor(text, 'Building interiors', anchor, 'the rendered comparison table');
    expectAbsentWithAnchor(text, 'The v2 map redraw', anchor, 'the rendered comparison table');
  });
});

describe("rules E and F — the owner's AUTHORING axis (ODQ §514.1b)", () => {
  // "Editing the map is paywall gated at all levels of the map. But viewing and
  // interacting with it is not." One axis, and the code already had its predicate:
  // `viewerCanAuthor` is literally the authoring question, which is why §449's
  // correction and this ruling land on the same symbol.
  const PENDING = new Set(VIEWING_PAYWALLS_PENDING_514.map((r) => r.id));

  it('every row declares an axis, and the three-way split is the measured one', () => {
    const byAxis = { viewing: [], authoring: [], account: [] };
    for (const row of ROWS) {
      expect(byAxis[row.axis], `${row.id} declares no known axis (${row.axis})`).toBeDefined();
      byAxis[row.axis].push(row.id);
    }
    expect(byAxis.authoring).toEqual(['custom-content', 'map-editing', 'dm-pins']);
    // Group order, not alphabetical: `map-chains` sits in the simulation group and so
    // precedes every maps-exports row. Written as the measured order rather than a
    // sorted one, because a row silently moving groups is itself worth a red.
    expect(byAxis.viewing).toEqual([
      'gallery-viewing', 'map-chains', 'map-view', 'provenance-hover', 'all-lenses',
      'panorama', 'change-view', 'fog-table',
    ]);
    expect(byAxis.account).toEqual([
      'every-size', 'saves', 'same-engine', 'living-realm', 'export-bundle', 'surveyor-stages',
    ]);
  });

  it('RULE E — every AUTHORING row is gated: it claims, and its symbol resolves', () => {
    const authoring = ROWS.filter((r) => r.axis === 'authoring');
    expect(authoring.length, 'no authoring rows — rule E would be vacuous').toBeGreaterThan(0);
    const free = [];
    for (const row of authoring) {
      if (row.free === row.cartographer) { free.push(`${row.id}: authoring is FREE — the owner's ruling gates editing at every level`); continue; }
      const resolver = RESOLVERS[row.enforcement];
      if (!resolver || resolver() !== true) free.push(`${row.id}: authoring claims a paywall its symbol '${row.enforcement}' does not resolve`);
    }
    expect(free, `\n${free.join('\n')}\n`).toEqual([]);
  });

  it('RULE E POSITIVE CONTROL — a planted FREE-AUTHORING row is caught', () => {
    const planted = { id: 'planted-free-authoring', axis: 'authoring', free: true, cartographer: true, enforcement: 'parity' };
    // Driven through rule E's own predicate rather than described: authoring given
    // away free is the revenue-leak shape, and it must never read as acceptable.
    const verdict = planted.axis === 'authoring' && planted.free === planted.cartographer;
    expect(verdict, 'rule E would not have caught free authoring').toBe(true);
  });

  it('RULE F — a VIEWING row claims no paywall, except the three the ruling has not reached', () => {
    const viewing = ROWS.filter((r) => r.axis === 'viewing');
    expect(viewing.length, 'no viewing rows — rule F would be vacuous').toBeGreaterThan(0);
    const offenders = viewing.filter((r) => claims(r) && !PENDING.has(r.id)).map((r) => r.id);
    expect(offenders, `viewing is free at every level (§514.1b): ${offenders.join(', ')}`).toEqual([]);
  });

  it('the pending ledger is EXACTLY the measured three, each with a written reason', () => {
    // Shrink-only in both directions: an id here with no claiming row is a stale
    // exception, and a claiming viewing row not here reds rule F above.
    const claimingViewing = ROWS.filter((r) => r.axis === 'viewing' && claims(r)).map((r) => r.id);
    expect(claimingViewing).toEqual(['map-chains', 'change-view', 'fog-table']);
    expect(VIEWING_PAYWALLS_PENDING_514.map((r) => r.id)).toEqual(claimingViewing);
    for (const row of VIEWING_PAYWALLS_PENDING_514) {
      expect(row.reason.length, `${row.id} needs a written reason`).toBeGreaterThan(20);
    }
  });

  it('RULE F POSITIVE CONTROL — a planted PAYWALLED-VIEWING row outside the ledger is caught', () => {
    const planted = { id: 'planted-paywalled-viewing', axis: 'viewing', free: false, cartographer: true, enforcement: 'viewerCanAuthor' };
    const caught = planted.axis === 'viewing' && claims(planted) && !PENDING.has(planted.id);
    expect(caught, 'rule F would not have caught a paywalled viewing row').toBe(true);
    // …and the ledger is not a mute button: an id inside it still has to be a real row.
    expect(PENDING.has(planted.id)).toBe(false);
  });

  it('the de-advertised rows carry an axis too, so their return is classified', () => {
    expect(DEFERRED_LADDER_ROWS.map((r) => `${r.id}:${r.axis}`)).toEqual(['interiors:viewing', 'v2-redraw:authoring']);
  });
});

// RULE D — RETIRED BY TE-STRIP-1 (owner ruling, ODQ §725). Rule D tied the
// change-view row's free cell ('latest change only') to the literal
// `const FREE_CHANGE_DEPTH = 1;` in src/components/townMap/SettlementMapNotes.jsx.
// That file left with the legacy settlement map, so the qualifier has no code to be
// honest ABOUT and both arms — the claim and its planted-depth negative control —
// are removed rather than re-pointed at a surviving file that does not carry the
// constant. The change-view ladder ROW itself is untouched: what the CARTOGRAPHER
// tier sells after the map rows leave is STRIP-5 / owner question Q8.
