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
 * ⚰ THOSE FIGURES ARE THE §471 MEASUREMENT AND ARE KEPT AS HISTORY, NOT REFRESHED
 * — they record why the predicate is what it is, and re-stating them against a
 * later tree would destroy the evidence while looking like an update. What the
 * walker asserts is always re-measured; what it explains is dated. At TE-STRIP-5
 * (§725/§726) the ladder holds NINE rows, not nineteen, and `all-lenses` is one of
 * the eight the legacy-map strip removed — so `surveyor-stages` is now the ONLY
 * equal-string row, and it alone carries the equal-string control. One row is
 * enough for the control to convict M6 (the planted row supplies the second), but
 * a successor deleting the surveyor row would make it vacuous, which is exactly
 * why the victim list below is asserted by MEMBERSHIP rather than by count.
 *
 * ⚰ WHAT TE-STRIP-5 TRIMMED HERE, AND WHY THIS FILE WAS TRIMMED RATHER THAN DELETED
 * (§725/§726, charter §11.2 STRIP-5). The owner's strip removed eight ladder rows and
 * this walker's frozen membership lists named every one of them, so the lists were
 * re-recorded and the arms that had no subject left were removed. The FILE stays,
 * because what it guards is not the map: rules A/B/E/F still drive the five surviving
 * CLAIMING rows — saves, custom content, the living Realm, map chains and the export
 * bundle — against the real gate. That is the CARTOGRAPHER tier's whole paid spine
 * (§726 Q8), and deleting its only executable guard because a different set of rows
 * left would have removed a paid-surface guard the ruling never touched.
 *   `viewerCanAuthor` LEFT THE RESOLVER TABLE, and it is not a weakening: all four
 * rows that named it were map-authoring rows and left with the map. The symbol itself
 * is LIVE and still gates four non-map authoring surfaces — it is simply no longer a
 * ladder enforcement marker, and a resolver for a marker no row names is dead weight
 * that would make the table read as though the ladder still enforced it.
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
// §524.5 / D-EXPORT-1: what the PAID export row actually promises. `variants.js` is a
// zero-import data leaf, so reading it here adds no weight to this walker's closure.
import { PDF_VARIANTS } from '../../src/pdf/variants.js';
import { TIER_GATE } from '../../src/store/authSlice.js';
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
});

/**
 * Markers that describe a row's DERIVATION rather than a refusal. A parity row
 * has nothing to refuse, so demanding a resolver of it would be demanding a gate
 * that must not exist.
 */
const PARITY_MARKERS = Object.freeze(new Set([
  // 'TOWN_MAP_STYLE_IDS' left with the `all-lenses` row at §725/§726: it was the
  // DERIVATION source for the advertised lens count, and both the count (LENS_COUNT)
  // and the row it fed are gone.
  'parity', 'constitutional', 'TIER_GATE.free.maxTier', 'SURVEYOR_AI_COSTS',
]));

describe('rule A — every row that CLAIMS a paywall names a symbol that RESOLVES', () => {
  it('the claiming and parity sets are what the ruling left behind, and both are non-empty', () => {
    const claiming = ROWS.filter(claims).map((r) => r.id);
    const parity = ROWS.filter((r) => !claims(r)).map((r) => r.id);
    // Printed rather than merely counted: a successor reading a failure needs the
    // membership, not an integer that could match for the wrong reason.
    // ⚰ RE-RECORDED AT TE-STRIP-5 (§725/§726). Claiming lost the four map-authoring
    // rows (map-editing, dm-pins, change-view, fog-table) and is now the CARTOGRAPHER
    // tier's whole paid spine; parity lost the four map display rows (map-view,
    // provenance-hover, all-lenses, panorama). Nothing was added on either side, and
    // no surviving row changed cells — a removal moves memberships, never values.
    expect(claiming).toEqual([
      'saves', 'custom-content', 'living-realm', 'map-chains', 'export-bundle',
    ]);
    expect(parity).toEqual([
      'every-size', 'gallery-viewing', 'same-engine', 'surveyor-stages',
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
    // ⚰ `all-lenses` left at §725/§726, so the real equal-string set is now this one row.
    // Asserted by MEMBERSHIP, never by count: a successor who removed the last such row
    // would leave the wrong predicate with no real victim to convict and this control
    // would pass on an empty walk — which is the vacuity the header warns about.
    expect(wrongPredicateVictims).toEqual(['surveyor-stages']);
    expect(wrongPredicateVictims.length,
      'no equal-string row survives — the wrong-predicate control has no real victim')
      .toBeGreaterThan(0);
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
    // ⚰ Three of the four 'parity'-marked rows (map-view, provenance-hover, panorama)
    // were settlement-map display rows and left at §725/§726. `gallery-viewing` is a
    // LIVE gallery feature, not a map row, which is why it is the survivor.
    expect(marked.map((r) => r.id)).toEqual(['gallery-viewing']);
    expect(marked.length, "no row is marked 'parity' — the cell-equality loop below is vacuous")
      .toBeGreaterThan(0);
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

describe('rule C — the de-advertised row left the table as a MOVE, not a deletion', () => {
  // ⚰ THE ANCHOR MOVED FROM `dm-pins` TO `export-bundle` AT TE-STRIP-5 (§725/§726), in
  // all three places it is used, in this one act. dm-pins was chosen because it travelled
  // the SAME maps-exports group and the same Object.freeze pipeline as the excluded ids;
  // it was itself one of the eight rows the strip removed, so an anchor pointing at it
  // would red honestly and for the wrong reason. `export-bundle` is the surviving member
  // of that same group and pipeline, so the anchor's PROPERTY — a live row that reds when
  // the ladder empties or re-keys, rather than letting an exclusion pass vacuously — is
  // preserved exactly, which is what makes this a re-point and not a weakening.
  const LADDER_ANCHOR = 'export-bundle';

  it('interiors is in the deferred ledger and NOT in the ladder', () => {
    // ⚰ v2-redraw left this ledger OUTRIGHT at §725/§726 — its subject was inside the
    // legacy-map strip, so unlike interiors it has no capability to return to. The
    // ledger is asserted whole, so its removal is a recorded change and not a silent one.
    expect(DEFERRED_LADDER_ROWS.map((r) => r.id)).toEqual(['interiors']);
    expect(DEFERRED_LADDER_ROWS.length, 'the deferred ledger emptied — the arms below go vacuous')
      .toBeGreaterThan(0);
    for (const row of DEFERRED_LADDER_ROWS) {
      // ⚠ KNOWN-STALE AND PINNED VERBATIM ON PURPOSE. The 'map activation D3b/P6'
      // programme was struck by the same ruling that ordered the strip, and interiors
      // STAY at launch reading the retained substrate — so this address is stale in
      // substance. Re-pointing it is a paid-surface wording call outside STRIP-5's brief
      // (census §D4) and is a paired two-line edit: the row in entitlementLadder.js and
      // this pin. Left deliberately, recorded in both places, not overlooked.
      expect(row.returnsAt).toBe('map activation D3b/P6');
      expect(row.reason.length, `${row.id} needs a written reason`).toBeGreaterThan(20);
    }
    const ladderIds = ROWS.map((r) => r.id);
    expectAbsentWithAnchor(ladderIds, 'interiors', LADDER_ANCHOR, 'de-advertised ids leave the ladder');
    // …and the row the strip removed outright must not come back either, held to the
    // same anchored standard so its absence is measured rather than merely untested.
    expectAbsentWithAnchor(ladderIds, 'v2-redraw', LADDER_ANCHOR, 'the removed redraw id stays out of the ladder');
  });

  it('its display label STAYS in the copy registry so the return is two lines', () => {
    const labels = pricingPage.band4.rows;
    expect(labels.interiors).toBe('Building interiors');
    // ⚰ …and v2-redraw's label left the registry WITH its row, which is the difference
    // between a de-advertisement (label kept, return is two lines) and a removal.
    expect(labels['v2-redraw']).toBeUndefined();
  });

  it('the rendered comparison table no longer advertises either capability', () => {
    const { container } = render(createElement(PricingPage));
    const text = container.textContent;
    // The anchor is the export-bundle label: it renders through the same comparison-table
    // map, so a page that failed to render reds on the anchor instead of reporting
    // two absences from an empty string.
    const anchor = pricingPage.band4.rows[LADDER_ANCHOR];
    expect(anchor, 'the anchor label is missing from the copy registry — the arms below are vacuous')
      .toBeTruthy();
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
    // ⚰ AUTHORING IS ONE ROW AFTER §725/§726, and that is the whole point of the ruling
    // rather than a gap: map-editing and dm-pins were the settlement map's authoring
    // affordances and left with it, leaving custom content as the tier's authoring sale.
    // Rule E below guards its own non-emptiness, so the shrink cannot go vacuous.
    expect(byAxis.authoring).toEqual(['custom-content']);
    // Group order, not alphabetical: `map-chains` sits in the simulation group and so
    // precedes every maps-exports row. Written as the measured order rather than a
    // sorted one, because a row silently moving groups is itself worth a red.
    // ⚰ Six of the eight viewing rows left at §725/§726 — the four map display rows plus
    // change-view and fog-table. Both survivors are non-settlement-map surfaces: the
    // gallery, and the REALM map's supply-chain layer.
    expect(byAxis.viewing).toEqual(['gallery-viewing', 'map-chains']);
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
    // ⚰ THE MEASURED THREE BECAME THE MEASURED ONE AT §725/§726, BY MOOTING AND NOT BY
    // RULING. change-view and fog-table were §514.1b's two other open owner items; the
    // strip removed their SUBJECTS (the map's notes-depth cap and its fog panel), so
    // their rows left and their questions dissolved with them. `map-chains` survives
    // because it is a REALM-surface layer, and it remains the ledger's one live question.
    expect(claimingViewing).toEqual(['map-chains']);
    expect(VIEWING_PAYWALLS_PENDING_514.map((r) => r.id)).toEqual(claimingViewing);
    // GUARD THE GUARD: an empty ledger would make the equality above hold between two
    // empty arrays while rule F's exception set silently disappeared.
    expect(claimingViewing.length, 'the pending ledger emptied — this equality is vacuous')
      .toBeGreaterThan(0);
    for (const row of VIEWING_PAYWALLS_PENDING_514) {
      expect(row.reason.length, `${row.id} needs a written reason`).toBeGreaterThan(20);
    }
  });

  it('RULE F POSITIVE CONTROL — a planted PAYWALLED-VIEWING row outside the ledger is caught', () => {
    // ⚰ The planted marker was 'viewerCanAuthor' until §725/§726 retired it from the
    // resolver table. It is re-pointed at a LIVE resolver deliberately: a planted row
    // naming an unresolvable marker would be convicted by rule A first, and this control
    // exists to prove rule F catches a row that is otherwise perfectly well-formed.
    const planted = { id: 'planted-paywalled-viewing', axis: 'viewing', free: false, cartographer: true, enforcement: 'TIER_GATE.mapChains' };
    expect(RESOLVERS[planted.enforcement], 'the planted marker must RESOLVE, or rule A convicts it first')
      .toBeDefined();
    const caught = planted.axis === 'viewing' && claims(planted) && !PENDING.has(planted.id);
    expect(caught, 'rule F would not have caught a paywalled viewing row').toBe(true);
    // …and the ledger is not a mute button: an id inside it still has to be a real row.
    expect(PENDING.has(planted.id)).toBe(false);
  });

  it('the de-advertised row carries an axis too, so its return is classified', () => {
    expect(DEFERRED_LADDER_ROWS.map((r) => `${r.id}:${r.axis}`)).toEqual(['interiors:viewing']);
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
//
// ⚰ Q8 IS NOW ANSWERED, AND THE CHANGE-VIEW ROW IS GONE TOO (owner, ODQ §726; charter
// §11.3). The tier's spine — unlimited saves, custom content, the living Realm, map
// chains and the export bundle — predates the settlement map and survives untouched;
// the four map-authoring rows and the four lens/parity display rows were removed at
// TE-STRIP-5, along with LENS_COUNT and its townMapStyles import. So rule D's subject
// is doubly gone: first its constant, then its row. This note is kept rather than
// deleted because it is the record of WHY arms left this file across two waves, and a
// successor who finds nine ladder rows here needs to reconstruct that from the file
// itself rather than from a ledger they may not have.

// ─────────────────────────────────────────────────────────────────────────────
// §524.5 / D-EXPORT-1 — WHAT THE PAID EXPORT ROW PROMISES.
//
// §524.5 asked WEB-8b for an enforcement arm proving two things: that the export
// gate HOLDS, and that the map plate is inside the dossier variants that claim it —
// each with a positive control. HALF OF THAT IS ALREADY BUILT: rule A above drives
// `export-bundle` through `TIER_GATE.export` and its planted-row control convicts an
// unresolvable claim, so the gate half needs no second spelling. What follows is the
// OTHER half in its DE-ESCALATED form, and the de-escalation is a measurement.
//
// D-EXPORT-1 AS RECORDED: `hasDrawableMap` self-gated the plate, so any settlement
// whose map could not be built shipped a paid PDF with no map plate — harmless while
// the plate used the landed townMap model, and the exact seam the cartography stage
// would land on. THE HAZARD'S HABITAT IS NOW GONE: the map left the PDF with the
// legacy-map strip, and no variant declares a map chapter at all. So there is no
// mapless paid dossier to ship, because there is no paid dossier that promises a map.
//
// ⛔ AND THAT IS EXACTLY WHY THIS ARM EXISTS RATHER THAN A NOTE. The map module is
// coming back. The moment a variant starts claiming a plate, this arm reds — and the
// person wiring it has to bring the buildability guarantee with them in the same act
// instead of rediscovering D-EXPORT-1 from a paid PDF with a hole in it.
// ─────────────────────────────────────────────────────────────────────────────
describe('§524.5 / D-EXPORT-1 — the paid export promises no map, and cannot start promising one silently', () => {
  /** A chapter key that would put a drawn map inside a variant. */
  const MAP_CHAPTER = /map|plate|cartograph|atlas/i;
  const mapChaptersOf = (spec) => Object.entries(spec.chapters ?? {})
    .filter(([key, value]) => MAP_CHAPTER.test(key) && value !== false)
    .map(([key]) => key);

  it('the export row is STILL the gated one, named rather than left to set membership', () => {
    // Rule A asserts the claiming SET; this names the member §524.5 is about, so a
    // future re-record of that list cannot drop the export gate quietly.
    const row = ROWS.find((r) => r.id === 'export-bundle');
    expect(row, 'the export-bundle ladder row has left the table').toBeTruthy();
    expect(claims(row), 'export-bundle stopped claiming a paywall').toBe(true);
    expect(row.enforcement).toBe('TIER_GATE.export');
    expect(RESOLVERS[row.enforcement](), 'TIER_GATE.export no longer refuses free and grants premium').toBe(true);
  });

  it('NO pdf variant declares a map chapter — the mapless-paid-dossier seam has no subject', () => {
    const claimed = [];
    for (const [variant, spec] of Object.entries(PDF_VARIANTS)) {
      for (const chapter of mapChaptersOf(spec)) claimed.push(`${variant}.${chapter}`);
    }
    expect(claimed,
      'a PDF variant now claims a map chapter. D-EXPORT-1 says a settlement whose map '
      + 'cannot be built would ship a PAID dossier with a hole where the plate should be. '
      + 'Land the buildability guarantee in the SAME act as the plate — do not delete this arm.',
    ).toEqual([]);
    // GUARD THE GUARD: the detector is not vacuous. It sees a planted plate, and it
    // does not see a variant that merely turns one off.
    expect(mapChaptersOf({ chapters: { cover: true, townMapPlate: true } })).toEqual(['townMapPlate']);
    expect(mapChaptersOf({ chapters: { cover: true, townMapPlate: false } })).toEqual([]);
    // …and it is reading REAL variants rather than an empty object: every shipped
    // variant carries chapters, so the emptiness above is a measurement.
    for (const [variant, spec] of Object.entries(PDF_VARIANTS)) {
      expect(Object.keys(spec.chapters ?? {}).length, `${variant} has no chapters at all`).toBeGreaterThan(0);
    }
    expect(Object.keys(PDF_VARIANTS).length).toBeGreaterThan(1);
  });

  it('the four shipped variants are the ones the paid row sells, and canon_dossier is the fullest', () => {
    // The anchor for the arm above: if the variant table were replaced wholesale the
    // map census would pass over something else entirely, so the table is named.
    expect(Object.keys(PDF_VARIANTS).sort())
      .toEqual(['campaign_state', 'canon_dossier', 'draft_brief', 'timeline_packet']);
    const on = (v) => Object.values(PDF_VARIANTS[v].chapters).filter((c) => c !== false).length;
    expect(on('canon_dossier')).toBeGreaterThan(on('timeline_packet'));
  });
});
