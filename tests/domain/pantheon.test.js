import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { describe, expect, test } from 'vitest';

import {
  advancePantheon,
  applyFaithDeltas,
  applyPantheonSeats,
  collectFaithDeltas,
  countSeats,
  createPantheonEntry,
  deityIdOf,
  qualifyingTier,
  ratchetPantheonTiers,
  PANTHEON_TUNING,
} from '../../src/domain/worldPulse/pantheon.js';
import { synthesizePantheonArcs } from '../../src/domain/worldPulse/realmEvents.js';
import { previewCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureWorldState, CONDITIONAL_LEDGER_KEYS } from '../../src/domain/worldPulse/worldState.js';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { normalizeForDormancy } from '../helpers/dormancyOracle.js';
// WF-1c's registration-totality battery (A5) and authoring join (A7). The registry list is
// IMPORTED, not re-typed: A5 and kindPoolFloors.walker.test.js share the ONE roster, so the
// six figures A5 freezes are re-derived from the LIVE sources through the same denominator
// the walker uses (ODQ §356.2 R-6).
import { EXACT_SECTION, SECTION_OF, isExplicitlyRouted } from '../../src/domain/realm/heraldRouting.js';
import { newsVoiceCategory } from '../../src/domain/display/newsVoice.js';
// WF-1f's agreement arm: the estate's ONE shared deity-name floor, read here so A1 asserts
// the arc producer against the resolver itself rather than against a re-declared copy of it.
import { deityDisplayNameFromRef } from '../../src/domain/display/deityNames.js';
import { WHAT_PHRASES } from '../../src/domain/display/settlementRumors.js';
import { KIND_SECTION } from '../../src/domain/display/chroniclersLetter.js';
import { KIND_REGISTRIES } from '../helpers/kindRegistryRoster.js';
import { censusNewsAuthoringSites, debtLedgerRows } from '../lint/newsAuthoringCensus.shared.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// Feature D / R4 — pantheon ledger + lazy tiering. The determinism danger zone.
//
// Tests assert: (1) the pantheon is ABSENT when religion is dormant (byte-identity
// under the dormancy oracle, WITH all religion code present); (2) the ratchet
// accumulates wins/seats and is commutative; (3) lazy tiering with HYSTERESIS — a
// 1-seat swing does NOT flip a tier, a decisive lead DOES; (4) a cascade-containment
// soak — the per-tick change is bounded by the cap and the pantheon CONVERGES with
// no oscillation; (5) realm arcs fire (Ascendancy / Twilight).
// ─────────────────────────────────────────────────────────────────────────────

const NOW = '2026-01-01T00:00:00.000Z';

// ── Snapshot/test helpers ────────────────────────────────────────────────────
function deitySnapshot(name, { rank = 'minor' } = {}) {
  return { _deityRef: `custom:lu_${name.toLowerCase()}`, name, alignmentAxis: 'neutral', temperamentAxis: 'neutral', rankAxis: rank };
}

function settlement(name, patch = {}) {
  return {
    name,
    tier: patch.tier || 'town',
    population: patch.population || 4000,
    config: {
      tradeRouteAccess: 'road', priorityEconomy: 30, priorityMilitary: 25,
      ...(patch.deity ? { primaryDeityRef: patch.deity._deityRef, primaryDeitySnapshot: patch.deity } : {}),
    },
    institutions: patch.institutions || [],
    economicState: { primaryExports: [], primaryImports: [] },
    powerStructure: {
      publicLegitimacy: { score: patch.legitimacy ?? 60, label: 'Stable' },
      factions: patch.factions || [{ faction: 'Council', category: 'civic', power: 60, isGoverning: true }],
      conflicts: [],
    },
    npcs: [],
    activeConditions: patch.activeConditions || [],
  };
}

function save(id, name, patch = {}) {
  return { id, name, phase: 'canon', settlement: settlement(name, patch), campaignState: { phase: 'canon', eventLog: [], locks: {} } };
}

function snapshotForSaves(saves) {
  const campaign = {
    id: 'pantheon-fixture',
    settlementIds: saves.map(s => s.id),
    worldState: { rngSeed: 'pantheon-seed', tick: 4 },
    regionalGraph: ensureRegionalGraph({ edges: [], channels: [] }),
  };
  return buildWorldSnapshot({ campaign, saves, worldState: campaign.worldState });
}

// A synthetic "religion result" with conversion outcomes (mirrors the
// evaluateReligiousContest outcome shape consumed by collectFaithDeltas).
function conversionOutcome(targetSaveId, winnerDeity) {
  return { targetSaveId, deityReembed: { snapshot: winnerDeity, fromSettlementId: 'src' } };
}

// ── 1. deityIdOf + qualifyingTier ────────────────────────────────────────────
describe('pantheon — deityIdOf', () => {
  test('uses _deityRef; falls back to a stable name ref; null for non-deity', () => {
    expect(deityIdOf(deitySnapshot('Vael'))).toBe('custom:lu_vael');
    expect(deityIdOf({ name: 'Anon' })).toBe('deity:Anon');
    expect(deityIdOf(null)).toBe(null);
    expect(deityIdOf({})).toBe(null);
  });
});

describe('pantheon — qualifyingTier (hysteresis margins, current-tier-relative)', () => {
  test('cult promotes only on a decisive seat lead', () => {
    expect(qualifyingTier(1, 'cult')).toBe('cult');
    expect(qualifyingTier(2, 'cult')).toBe('minor');
    expect(qualifyingTier(4, 'cult')).toBe('major');
  });
  test('a minor is STICKY across the hysteresis band (3 seats holds minor, not major)', () => {
    expect(qualifyingTier(3, 'minor')).toBe('minor'); // below MAJOR_PROMOTE 4
    expect(qualifyingTier(4, 'minor')).toBe('major');
    expect(qualifyingTier(1, 'minor')).toBe('cult'); // at/below MINOR_DEMOTE 1
    expect(qualifyingTier(2, 'minor')).toBe('minor');
  });
  test('a major holds down to MAJOR_DEMOTE+1 seats, then falls (no skip of dwell)', () => {
    expect(qualifyingTier(3, 'major')).toBe('major'); // above MAJOR_DEMOTE 2
    expect(qualifyingTier(2, 'major')).toBe('minor');
    expect(qualifyingTier(1, 'major')).toBe('cult'); // hard collapse possible
  });
});

// ── 2. Ratchet + commutativity ───────────────────────────────────────────────
describe('pantheon — ratchet wins/losses (commutative fold)', () => {
  test('applyFaithDeltas accumulates wins + losses per deity', () => {
    const led = applyFaithDeltas({}, [
      { deityId: 'a', outcome: 'win' },
      { deityId: 'a', outcome: 'win' },
      { deityId: 'b', outcome: 'loss' },
    ]);
    expect(led.a).toMatchObject({ wins: 2, losses: 0 });
    expect(led.b).toMatchObject({ wins: 0, losses: 1 });
  });

  test('reversing the delta order yields an identical ledger (commutative)', () => {
    const deltas = [
      { deityId: 'korl', outcome: 'win' },
      { deityId: 'vael', outcome: 'loss' },
      { deityId: 'korl', outcome: 'win' },
      { deityId: 'vael', outcome: 'win' },
    ];
    const fwd = applyFaithDeltas({}, deltas);
    const rev = applyFaithDeltas({}, [...deltas].reverse());
    expect(JSON.stringify(fwd)).toBe(JSON.stringify(rev));
  });

  test('empty deltas are byte-neutral (returns the input ledger)', () => {
    const led = { a: createPantheonEntry() };
    expect(applyFaithDeltas(led, [])).toBe(led);
  });
});

describe('pantheon — collectFaithDeltas from conversion outcomes', () => {
  test('winner banks a win; the displaced PRE-TICK incumbent banks a loss', () => {
    const vael = deitySnapshot('Vael', { rank: 'major' });
    const faded = deitySnapshot('Faded', { rank: 'cult' });
    // C carried Faded before the contest; the contest re-embeds Vael onto C.
    const snapshot = snapshotForSaves([
      save('asrc', 'Asrc', { deity: vael }),
      save('cconv', 'Cconv', { deity: faded }),
    ]);
    const deltas = collectFaithDeltas({ outcomes: [conversionOutcome('cconv', vael)] }, snapshot);
    expect(deltas).toContainEqual({ deityId: 'custom:lu_vael', outcome: 'win' });
    expect(deltas).toContainEqual({ deityId: 'custom:lu_faded', outcome: 'loss' });
  });

  test('an unclaimed seat (no prior deity) yields only a win, no loss', () => {
    const vael = deitySnapshot('Vael', { rank: 'major' });
    const snapshot = snapshotForSaves([
      save('asrc', 'Asrc', { deity: vael }),
      save('cconv', 'Cconv'), // no deity
    ]);
    const deltas = collectFaithDeltas({ outcomes: [conversionOutcome('cconv', vael)] }, snapshot);
    expect(deltas).toEqual([{ deityId: 'custom:lu_vael', outcome: 'win' }]);
  });
});

// ── 3. Seats from the PRE-TICK snapshot ───────────────────────────────────────
describe('pantheon — countSeats (pre-tick aggregation)', () => {
  test('counts settlements carrying each deity, codepoint-stable', () => {
    const vael = deitySnapshot('Vael');
    const korl = deitySnapshot('Korl');
    const snapshot = snapshotForSaves([
      save('a', 'A', { deity: vael }),
      save('b', 'B', { deity: vael }),
      save('c', 'C', { deity: korl }),
      save('d', 'D'), // no deity — not a seat
    ]);
    expect(countSeats(snapshot)).toEqual({ 'custom:lu_vael': 2, 'custom:lu_korl': 1 });
  });

  test('a deity that lost its last seat is set to 0 by applyPantheonSeats', () => {
    const led = { 'custom:lu_vael': { ...createPantheonEntry(), seats: 3, tier: 'minor' } };
    const next = applyPantheonSeats(led, {}); // no seats this tick
    expect(next['custom:lu_vael'].seats).toBe(0);
  });
});

// ── 4. Lazy tiering + HYSTERESIS dwell ────────────────────────────────────────
describe('pantheon — lazy tier with hysteresis dwell', () => {
  test('a 1-seat swing across a boundary does NOT flip a tier within the dwell', () => {
    // A minor deity sits at 3 seats (inside the band) — never qualifies major.
    let led = { d: { ...createPantheonEntry(), tier: 'minor', seats: 3 } };
    for (let i = 0; i < 5; i += 1) {
      led = applyPantheonSeats(led, { d: 3 });
      ({ ledger: led } = ratchetPantheonTiers(led));
      expect(led.d.tier).toBe('minor'); // sticky — no flip on the swing
    }
    // Bump to 4 seats (the decisive lead) — still needs to HOLD past the dwell.
    led = applyPantheonSeats(led, { d: 4 });
    ({ ledger: led } = ratchetPantheonTiers(led));
    // After ONE tick at 4 seats it has not yet matured (TIER_HOLD_TICKS = 2).
    expect(led.d.tier).toBe('minor');
    expect(led.d.tierHeld).toBe(1);
  });

  test('a decisive multi-seat lead DOES promote once the dwell matures', () => {
    let led = { d: { ...createPantheonEntry(), tier: 'minor', seats: 4 } };
    // Hold 4 seats for TIER_HOLD_TICKS ticks → promotion lands.
    for (let i = 0; i < PANTHEON_TUNING.TIER_HOLD_TICKS; i += 1) {
      led = applyPantheonSeats(led, { d: 4 });
      ({ ledger: led } = ratchetPantheonTiers(led));
    }
    expect(led.d.tier).toBe('major');
    expect(led.d.tierHeld).toBe(0); // reset on change
  });

  test('a brief swing that reverts BEFORE the dwell never flips the tier (no oscillation)', () => {
    let led = { d: { ...createPantheonEntry(), tier: 'minor', seats: 3 } };
    // One tick at 4 seats (qualifies major, dwell=1), then back to 3 (resets).
    led = applyPantheonSeats(led, { d: 4 });
    ({ ledger: led } = ratchetPantheonTiers(led));
    expect(led.d.tier).toBe('minor');
    led = applyPantheonSeats(led, { d: 3 });
    ({ ledger: led } = ratchetPantheonTiers(led));
    expect(led.d.tier).toBe('minor');
    expect(led.d.tierHeld).toBe(0); // the brief swing left no residue
  });
});

// ── 5. CASCADE-CONTAINMENT cap + convergence soak ─────────────────────────────
describe('pantheon — cascade containment (bounded per-tick change, convergence)', () => {
  test('at most MAX_TIER_CHANGES_PER_TICK tiers change in any single tick', () => {
    // Five deities all simultaneously cross a tier boundary (a contrived map-wide
    // flip). The cap must bound the per-tick churn; the rest defer.
    const cap = PANTHEON_TUNING.MAX_TIER_CHANGES_PER_TICK;
    let led = {};
    for (const id of ['d1', 'd2', 'd3', 'd4', 'd5']) {
      led[id] = { ...createPantheonEntry(), tier: 'cult', seats: 4 }; // all qualify major
    }
    // Mature the dwell first (hold the decisive lead).
    for (let i = 0; i < PANTHEON_TUNING.TIER_HOLD_TICKS - 1; i += 1) {
      led = applyPantheonSeats(led, { d1: 4, d2: 4, d3: 4, d4: 4, d5: 4 });
      ({ ledger: led } = ratchetPantheonTiers(led));
    }
    // The maturing tick: only `cap` deities may flip.
    led = applyPantheonSeats(led, { d1: 4, d2: 4, d3: 4, d4: 4, d5: 4 });
    const res = ratchetPantheonTiers(led);
    led = res.ledger;
    expect(res.changes.length).toBe(cap);
    const majors = Object.values(led).filter(e => e.tier === 'major').length;
    expect(majors).toBe(cap);
  });

  test('the deferred changes CONVERGE over subsequent ticks (no infinite churn)', () => {
    let led = {};
    for (const id of ['d1', 'd2', 'd3', 'd4', 'd5']) {
      led[id] = { ...createPantheonEntry(), tier: 'cult', seats: 4 };
    }
    const seats = { d1: 4, d2: 4, d3: 4, d4: 4, d5: 4 };
    let totalChanges = 0;
    // Run many ticks; eventually ALL five reach major and the churn stops.
    for (let i = 0; i < 12; i += 1) {
      led = applyPantheonSeats(led, seats);
      const res = ratchetPantheonTiers(led);
      led = res.ledger;
      totalChanges += res.changes.length;
      // Per-tick change is ALWAYS bounded by the cap (never a map-wide flip).
      expect(res.changes.length).toBeLessThanOrEqual(PANTHEON_TUNING.MAX_TIER_CHANGES_PER_TICK);
    }
    // Converged: all five are major, and no more changes fire (steady state).
    expect(Object.values(led).every(e => e.tier === 'major')).toBe(true);
    const steady = ratchetPantheonTiers(led);
    expect(steady.changes.length).toBe(0);
    // Exactly five promotions happened in total — no oscillation re-flipping.
    expect(totalChanges).toBe(5);
  });
});

// ── 6. Realm arcs ─────────────────────────────────────────────────────────────
//
// WF-1c adds the THIRD arc — the realm last-seat beat — and its seven acceptance cases
// live at the foot of this describe.
//
// ⛔ EVERY FIXTURE BELOW WAS RUN AND PRINTED BEFORE ITS ASSERTION WAS WRITTEN, and the
// order is the point rather than a courtesy. `TIER_HOLD_TICKS` is 2 and
// `MAX_TIER_CHANGES_PER_TICK` is 2, so a fixture advanced fewer than two ticks can never
// observe A4's Twilight arm, and a fixture whose creed is not at the cult floor produces
// base == cure and a silently vacuous pin.
//
// ⛔⛔ ONE PIN WAS REFUTED BY RUNNING IT, AND IT IS RECORDED HERE BECAUSE IT WOULD HAVE
// PASSED WHILE ASSERTING NOTHING: the name a beat prints depends on WHICH snapshot the
// arcs are handed. The kernel passes THIS tick's pre-tick snapshot, in which an extinct
// creed already holds no seat, so the name falls back to a tail of the ref. Handing the
// arcs the PRIOR tick's snapshot resolves the name by scan instead and hides the fallback
// completely — measured, both ways, in A1. The fixtures below use the production shape.
//
// ⛔ THE DEITY DOCTRINE BINDS THE FIXTURES TOO: every deity arrives through the doctrine
// path (`config.primaryDeitySnapshot`, what SET_PRIMARY_DEITY writes), never a catalogue
// and never a premade pool. The beats record what BELIEVERS did — a seat kept or not kept
// — and no assertion here says a god died.
describe('pantheon — realm arcs (Ascendancy / Twilight / the last altar)', () => {
  const snapshot = snapshotForSaves([save('a', 'A', { deity: deitySnapshot('Vael', { rank: 'major' }) })]);

  // A deity carrying NO `_deityRef`: `deityIdOf` derives `deity:<Name>` from the name, which
  // is the ref shape whose display name survives the fallback intact. Distinct from
  // `deitySnapshot`, which mints the `custom:<slug>` shape — the two are the whole subject
  // of A1's second arm.
  const bareDeity = (name, rank = 'cult') => ({ name, alignmentAxis: 'neutral', temperamentAxis: 'neutral', rankAxis: rank });
  const PALE = bareDeity('The Pale Warden');
  const HARROW = bareDeity('Harrow');
  const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

  test('a deity reaching major emits an Ascendancy arc', () => {
    const entries = synthesizePantheonArcs({
      changes: [{ deityId: 'custom:lu_vael', from: 'minor', to: 'major' }],
      snapshot, tick: 5, now: NOW,
    });
    expect(entries.length).toBe(1);
    expect(entries[0].headline).toBe('The Ascendancy of Vael');
    expect(entries[0].impactKind).toBe('pantheon_ascendancy');
    expect(entries[0].scope).toBe('realm');
  });

  test('a deity falling to cult emits a Twilight arc', () => {
    const entries = synthesizePantheonArcs({
      changes: [{ deityId: 'custom:lu_vael', from: 'minor', to: 'cult' }],
      snapshot, tick: 5, now: NOW,
    });
    expect(entries.length).toBe(1);
    expect(entries[0].headline).toBe('The Twilight of Vael');
    expect(entries[0].impactKind).toBe('pantheon_twilight');
  });

  test('a minor↔minor drift emits nothing', () => {
    expect(synthesizePantheonArcs({ changes: [{ deityId: 'x', from: 'cult', to: 'minor' }], snapshot, tick: 5 })).toEqual([]);
  });

  test('(W-F7 site #10) realmMult scales the arc salience score; default 1.0 is byte-identical', () => {
    const change = [{ deityId: 'custom:lu_vael', from: 'minor', to: 'major' }];
    const base = synthesizePantheonArcs({ changes: change, snapshot, tick: 5, now: NOW });
    const devout = synthesizePantheonArcs({ changes: change, snapshot, tick: 5, now: NOW, realmMult: 1.325 });
    const secular = synthesizePantheonArcs({ changes: change, snapshot, tick: 5, now: NOW, realmMult: 0.825 });
    // Default (no realmMult) == explicit 1.0 == the pre-W-F7 constant (byte-identity).
    expect(base[0].score).toBe(86);
    expect(synthesizePantheonArcs({ changes: change, snapshot, tick: 5, now: NOW, realmMult: 1 })[0].score).toBe(86);
    // A devout realm ranks the ascendancy higher; a secular realm lower.
    expect(devout[0].score).toBe(Math.round(86 * 1.325));
    expect(secular[0].score).toBe(Math.round(86 * 0.825));
    expect(devout[0].score).toBeGreaterThan(base[0].score);
    expect(secular[0].score).toBeLessThan(base[0].score);
    // Significance stays 'major' — salience reorders, it never floods (E4 envelope intact).
    expect(devout[0].significance).toBe('major');
    expect(secular[0].significance).toBe('major');
    // A bad/absent realmMult is treated as 1.0 (defensive).
    expect(synthesizePantheonArcs({ changes: change, snapshot, tick: 5, now: NOW, realmMult: 0 })[0].score).toBe(86);
    expect(synthesizePantheonArcs({ changes: change, snapshot, tick: 5, now: NOW, realmMult: NaN })[0].score).toBe(86);
  });

  test('A1 the last-seat beat fires ONCE on the crossing tick and names the creed the realm no longer keeps', () => {
    const held = snapshotForSaves([save('a', 'A', { deity: PALE })]);
    const lost = snapshotForSaves([save('a', 'A', { deity: HARROW })]);
    const seated = advancePantheon({ pantheon: {}, snapshot: held, unseating: true });
    expect(seated.changes).toEqual([]); // holding its one seat is not news
    const crossing = advancePantheon({ pantheon: seated.pantheon, snapshot: lost, unseating: true });
    expect(crossing.changes).toEqual([{ deityId: 'deity:The Pale Warden', from: 'cult', to: 'cult', lastSeat: true }]);
    // PRODUCTION SNAPSHOT SHAPE: the kernel hands the arcs THIS tick's pre-tick snapshot,
    // in which the creed already holds no seat anywhere.
    const arcs = synthesizePantheonArcs({ changes: crossing.changes, snapshot: lost, tick: 5, now: NOW });
    expect(arcs.length).toBe(1);
    expect(arcs[0].impactKind).toBe('pantheon_extinction');
    expect(arcs[0].scope).toBe('realm');
    expect(arcs[0].kind).toBe('pantheon');
    expect(arcs[0].headline).toBe('The Last Altar of The Pale Warden');
    expect(arcs[0].settlementIds).toEqual([]); // realm-voiced: it names no town
    // AND IT FIRES ONCE. The following tick, ledger unchanged at zero seats, says nothing
    // further — the pantheon entry persists as the remnant it already is.
    const after = advancePantheon({ pantheon: crossing.pantheon, snapshot: lost, unseating: true });
    expect(after.changes).toEqual([]);
    expect(synthesizePantheonArcs({ changes: after.changes, snapshot: lost, tick: 6, now: NOW })).toEqual([]);
    expect(after.pantheon['deity:The Pale Warden']).toMatchObject({ seats: 0, tier: 'cult', tierHeld: 0 });

    // ── THE CURED FLOOR, RE-RECORDED WITH A DECLARED CAUSE (WF-1c RAISED-B → WF-1f) ──
    // ⭐ THIS PIN'S VALUE MOVED ONCE, DELIBERATELY, AND THIS IS THE RECORD OF IT.
    // WF-1c measured a defect in `deityNameForRef` and pinned it rather than repairing it:
    // the floor kept only the ref's LAST token, so a `custom:<slug>` creed carried by no
    // settlement printed a single word — this arm read 'The Last Altar of Forge' for a creed
    // authored 'Sun of the Deep Forge'. ODQ §326.4 took the cure as WF-1f: the floor is now
    // the estate's shared `deityDisplayNameFromRef`, which renders the WHOLE slug. The shift
    // is DECLARED — live campaigns' arc copy changes for uncarried refs whose colon-tail
    // carries '_' or '-' — and the value below was derived by EXECUTING the cured helper.
    const slug = { _deityRef: 'custom:sun_of_the_deep_forge', name: 'Sun of the Deep Forge', alignmentAxis: 'neutral', temperamentAxis: 'neutral', rankAxis: 'cult' };
    const slugHeld = snapshotForSaves([save('a', 'A', { deity: slug })]);
    const slugSeated = advancePantheon({ pantheon: {}, snapshot: slugHeld, unseating: true });
    const slugCrossing = advancePantheon({ pantheon: slugSeated.pantheon, snapshot: lost, unseating: true });
    const slugArcs = synthesizePantheonArcs({ changes: slugCrossing.changes, snapshot: lost, tick: 5, now: NOW });
    expect(slugArcs[0].headline).toBe('The Last Altar of Sun Of The Deep Forge');
    // The control that proves the arm above is about the FALLBACK and not about the fixture:
    // handed the prior snapshot, where the creed is still carried, the same ref resolves to
    // the AUTHORED name — whose casing the slug destroyed and no floor can recover. The two
    // strings differ by exactly that casing, which is what keeps this a live discriminator:
    // a floor that silently started winning over the scan would red the line below.
    expect(synthesizePantheonArcs({ changes: slugCrossing.changes, snapshot: slugHeld, tick: 5, now: NOW })[0].headline)
      .toBe('The Last Altar of Sun of the Deep Forge');

    // ── AGREEMENT WITH THE ONE SHARED RESOLVER (WF-1f) ───────────────────────────
    // The point of the cure is that `realmEvents.js` stopped carrying a PRIVATE copy of a
    // resolver two other producers already share. This arm keeps the third producer from
    // drifting back: for every ref the snapshot cannot resolve, the beat's own name must be
    // exactly what `deityDisplayNameFromRef` returns. Each ref below is absent from `lost`,
    // so the scan genuinely misses and the floor genuinely runs — asserted, not assumed.
    const floorRefs = ['custom:sun_of_the_deep_forge', 'custom:war_father', 'custom:the-silent-queen', 'converted:aurelion_the_dawnfather', 'deity:Unwritten'];
    for (const ref of floorRefs) {
      const beat = synthesizePantheonArcs({ changes: [{ deityId: ref, from: 'cult', to: 'cult', lastSeat: true }], snapshot: lost, tick: 5, now: NOW })[0];
      const floor = deityDisplayNameFromRef(ref);
      expect(beat.headline, ref).toBe(`The Last Altar of ${floor}`);
      expect(beat.summary.startsWith(`No settlement in the realm still keeps ${floor}'s rite.`), ref).toBe(true);
      expect(beat.reasons[0], ref).toBe(`${floor} holds no seat anywhere in the realm.`);
    }
    // ⛔ NON-VACUITY, TWO WAYS. (1) Four of the five refs carry a '_' or '-' in the tail, so
    // the floor returns MORE than one word — the shape the old tail-pop could never produce;
    // reverting the cure reds this arm on the first of them. (2) The fifth carries neither,
    // so it proves the arm is not merely counting spaces.
    expect(floorRefs.filter((r) => deityDisplayNameFromRef(r).includes(' ')).length).toBe(4);
    expect(deityDisplayNameFromRef('deity:Unwritten')).toBe('Unwritten');
    // And the positive control: where the scan DOES resolve, the authored name wins over the
    // floor, so the two paths stay distinguishable rather than collapsing into one.
    expect(synthesizePantheonArcs({ changes: slugCrossing.changes, snapshot: slugHeld, tick: 5, now: NOW })[0].headline)
      .not.toBe(`The Last Altar of ${deityDisplayNameFromRef('custom:sun_of_the_deep_forge')}`);

    // ⛔ THE CURE REPLACED A FLOOR, NOT A SCAN — AND THIS IS THE ARM THAT SAYS SO (WF-1f).
    // `deityNames.js` also exports `deityNameFromSnapshots`, which reads cultDeitySnapshots
    // as well as the patron. Delegating the WHOLE helper to it would silently widen what the
    // arc producer scans, so the cure deliberately took only the floor. The fixture below is
    // the one world where the two answers differ: a town whose PATRON is Harrow but which
    // still keeps the forge creed as a CULT. The beat must render the floor's casing — the
    // cult snapshot's authored casing appearing here would mean the scan had been widened.
    const cultKeeper = save('a', 'A', { deity: HARROW });
    cultKeeper.settlement.config.cultDeitySnapshots = [slug];
    const cultSnap = snapshotForSaves([cultKeeper]);
    expect(cultSnap.settlements[0].settlement.config.cultDeitySnapshots.length).toBe(1); // the fixture really carries it
    const cultBeat = synthesizePantheonArcs({ changes: [{ deityId: slug._deityRef, from: 'cult', to: 'cult', lastSeat: true }], snapshot: cultSnap, tick: 5, now: NOW })[0];
    expect(cultBeat.headline).toBe('The Last Altar of Sun Of The Deep Forge');
    expect(cultBeat.headline).not.toBe('The Last Altar of Sun of the Deep Forge');
  });

  test('A2 absent, false and lit are byte-separable on a deity-bearing world; only the literal lit drive moves', () => {
    const VAEL = deitySnapshot('Vael', { rank: 'major' });
    const drive = (rules) => previewCampaignWorldPulse({
      campaign: {
        id: 'wf1c-fence', name: 'WF1C Fence', settlementIds: ['s1', 's2', 's3', 's4'],
        worldState: {
          rngSeed: 'wf1c-fence-seed', tick: 4,
          simulationRules: { religionDynamicsEnabled: true, ...rules },
          // Vael matures an Ascendancy in EVERY arm (the non-vacuity control, so no hash
          // below is taken over an empty feed); Pale held its one seat last tick and holds
          // none now.
          pantheon: {
            'custom:lu_vael': { wins: 3, losses: 0, seats: 4, tier: 'minor', tierHeld: 1 },
            'deity:The Pale Warden': { wins: 0, losses: 1, seats: 1, tier: 'cult', tierHeld: 0 },
          },
        },
        regionalGraph: ensureRegionalGraph({ edges: [], channels: [] }),
        wizardNews: { currentTick: 4, entries: [] },
      },
      saves: ['s1', 's2', 's3', 's4'].map((id, i) => save(id, `S${i}`, { deity: VAEL })),
      interval: 'one_month', now: NOW,
    });
    const absent = drive({});
    const dark = drive({ faithUnseatingEnabled: false });
    const lit = drive({ faithUnseatingEnabled: true });
    // NON-VACUITY FIRST: every arm really ran the pantheon fold and really emitted a beat.
    for (const pulse of [absent, dark, lit]) {
      expect((pulse.wizardNews?.entries || []).some(e => e.impactKind === 'pantheon_ascendancy')).toBe(true);
    }
    const news = (p) => JSON.stringify(p.wizardNews?.entries || []);
    expect(news(dark)).toBe(news(absent)); // absent ≡ false, to the byte
    expect(news(lit)).not.toBe(news(absent)); // THE LIT-MUTANT CONTROL: the fence can see
    expect(news(lit)).toContain('pantheon_extinction');
    // The lit arm one line above proves the token is spellable and really reachable in this
    // exact drive, so what follows is a fact about the gate rather than a dead fixture.
    // anchored: the same drive lit contains this token (asserted immediately above).
    expect(news(absent)).not.toContain('pantheon_extinction');
    // The rows are TRANSIENT: the persisted ledger is identical in all three arms.
    expect(JSON.stringify(lit.worldState.pantheon)).toBe(JSON.stringify(absent.worldState.pantheon));
    // THE CONTROL ON THE SALIENCE EXTRACTION: naming the Twilight's two values changed
    // neither of them, and left the Ascendancy's own literals alone.
    const asc = (absent.wizardNews.entries || []).find(e => e.impactKind === 'pantheon_ascendancy');
    expect([asc.score, asc.severity]).toEqual([86, 0.8]);
    const twi = synthesizePantheonArcs({ changes: [{ deityId: 'custom:lu_vael', from: 'minor', to: 'cult' }], snapshot, tick: 5, now: NOW })[0];
    expect([twi.score, twi.severity]).toEqual([84, 0.78]);
    const ext = (lit.wizardNews.entries || []).find(e => e.impactKind === 'pantheon_extinction');
    expect([ext.score, ext.severity]).toEqual([84, 0.78]); // derived from the Twilight, not authored
  });

  test('A3 the counterfactual: the same one-seat transition emits nothing at all at the pre-feature base', () => {
    const held = snapshotForSaves([save('a', 'A', { deity: PALE })]);
    const lost = snapshotForSaves([save('a', 'A', { deity: HARROW })]);
    const seated = advancePantheon({ pantheon: {}, snapshot: held, unseating: true });
    // DARK IS THE PRE-FEATURE BASE, byte-identically: with the key absent the returned
    // `changes` is the tier ratchet's own array, unwidened.
    const base = advancePantheon({ pantheon: seated.pantheon, snapshot: lost });
    expect(base.changes).toEqual([]);
    expect(synthesizePantheonArcs({ changes: base.changes, snapshot: lost, tick: 5, now: NOW })).toEqual([]);
    // AND SPECIFICALLY NO TWILIGHT — the wave is not redundant with a beat that already
    // fires. The reason is the ladder itself: a one-seat deity is ALREADY at the cult floor,
    // so the seat loss crosses no threshold and the tier ratchet has nothing to report.
    expect(qualifyingTier(1, 'cult')).toBe('cult');
    expect(qualifyingTier(0, 'cult')).toBe('cult');
    // The identical transition lit DOES produce a row (asserted two lines below), so the
    // silence here belongs to the base and not to a fixture that never moved a seat.
    const baseFeed = JSON.stringify(synthesizePantheonArcs({ changes: base.changes, snapshot: lost, tick: 5, now: NOW }));
    // anchored: the same transition lit yields exactly one row (asserted on the next line).
    expect(baseFeed).not.toContain('pantheon_twilight');
    expect(advancePantheon({ pantheon: seated.pantheon, snapshot: lost, unseating: true }).changes).toHaveLength(1);
  });

  test('A4 no double obituary: a major creed collapsing to zero is silent, and its Twilight lands alone one tick later', () => {
    const elsewhere = snapshotForSaves([save('s1', 'S1', { deity: bareDeity('Xor') })]);
    const led = { 'deity:Sun': { ...createPantheonEntry(), seats: 4, tier: 'major' } };
    // TICK 1 — the seats vanish here, and the beat must NOT fire: the tier ladder still has
    // somewhere to take this creed, so the Twilight is the one that will speak.
    const t1 = advancePantheon({ pantheon: led, snapshot: elsewhere, unseating: true });
    expect(t1.changes).toEqual([]);
    expect(t1.pantheon['deity:Sun']).toMatchObject({ seats: 0, tier: 'major', tierHeld: 1 });
    // TICK 2 — the dwell matures and the Twilight lands, ALONE. Without the ladder guard the
    // realm would carry an extinction on tick 1 and this Twilight on tick 2: two obituaries,
    // one tick apart, for one event.
    const t2 = advancePantheon({ pantheon: t1.pantheon, snapshot: elsewhere, unseating: true });
    expect(t2.changes).toEqual([{ deityId: 'deity:Sun', from: 'major', to: 'cult' }]);
    const arcs = synthesizePantheonArcs({ changes: t2.changes, snapshot: elsewhere, tick: 2, now: NOW });
    expect(arcs.map(e => e.impactKind)).toEqual(['pantheon_twilight']);
    // THE EXCLUSIVITY INVARIANT, over both ticks: no deity may carry a tier-change row and a
    // last-seat row in the same tick.
    for (const res of [t1, t2]) {
      const tiered = res.changes.filter(c => c.lastSeat !== true).map(c => c.deityId);
      const unseated = res.changes.filter(c => c.lastSeat === true).map(c => c.deityId);
      expect(tiered.filter(id => unseated.includes(id))).toEqual([]);
    }
  });

  test('A5 the registration totality: routed by prefix with NO exact row, and the six kind censuses move only where a registration authorized it', () => {
    expect(isExplicitlyRouted('pantheon_extinction')).toBe(true);
    expect(SECTION_OF('pantheon_extinction')).toBe('faith');
    expect(WHAT_PHRASES.pantheon_extinction).toBe('a faith with no altar left');
    expect(KIND_SECTION.pantheon_extinction).toBe('traditions');
    expect(newsVoiceCategory({ impactKind: 'pantheon_extinction' })).toBe(null);
    // ⛔⛔ THE ANTI-TIDY PIN. Both siblings carry an EXACT_SECTION row and this kind must
    // NOT, because a third routed-but-unregistered pantheon row grows a ceiling asserted
    // shrink-only, which has no lawful growth cure. The two positives make the absence a
    // fact about this kind rather than about the map.
    expect('pantheon_ascendancy' in EXACT_SECTION).toBe(true);
    expect('pantheon_twilight' in EXACT_SECTION).toBe(true);
    expect('pantheon_extinction' in EXACT_SECTION).toBe(false);
    // The six figures kindPoolFloors freezes, re-derived from the LIVE registries.
    // ⛔⛔ THIS LIST WAS A SECOND TRANSCRIPTION of kindPoolFloors.walker.test.js's REGISTRIES,
    // and the fork was the finding: WF-8a's registration moved the shared figures and reddened
    // this pin, which no packet had named, because a hand-copied denominator drifts the moment
    // the original moves. The structural repair is DONE (ODQ §356.2 R-6, TE-HOUSE H5) — both
    // this pin and the walker now read the ONE roster, so a registry that joins or leaves
    // breaks both identically. The six figures below stay literal: they are deliberate freezes,
    // and the repair removed the duplicated LIST, never the freezes.
    const registries = KIND_REGISTRIES;
    const allRows = registries.flatMap(([, rows]) => [...rows]);
    const registered = new Set(allRows.map(r => String(r.kind)));
    const routedTokens = Object.keys(EXACT_SECTION);
    const unvoiced = routedTokens.filter(t => !registered.has(t));
    // ⛔ A DECLARED RE-RECORD OF FOUR FIGURES (WF-8a, ODQ §309.3 / §321.2a / §347.1(2) / §350).
    // WF-1c's claim that its OWN kind takes the prefix door and files no exact row is UNTOUCHED
    // and is asserted three lines above; what moved is the ambient census around it, because
    // WF-8a registers a desk-BEARING kind with a chair-authorized EXACT_SECTION row. The two
    // figures that DID NOT move are the load-bearing ones: `unvoiced` is a shrink-only ceiling
    // and holds at its measured value, and the registered-minus-routed difference holds at
    // eight — which is exactly what a kind that carries a desk is supposed to do, and the
    // opposite of what WF-1c's prefix-routed kind would have done.
    expect(registries.length).toBe(11);
    expect(registries.filter(([, rows]) => rows.length < 5).map(([name]) => name)).toEqual(['INFORMATION', 'FAITH']);
    expect(allRows.length).toBe(113);
    expect(routedTokens.length).toBe(379);
    expect(unvoiced.length).toBe(274);
    expect(allRows.length - routedTokens.filter(t => registered.has(t)).length).toBe(8);
  });

  test('A6 nothing persists: the ledger keeps its five keys, gains no top-level key, and round-trips the remnant', () => {
    const held = snapshotForSaves([save('a', 'A', { deity: PALE })]);
    const lost = snapshotForSaves([save('a', 'A', { deity: HARROW })]);
    const seated = advancePantheon({ pantheon: {}, snapshot: held, unseating: true });
    const crossing = advancePantheon({ pantheon: seated.pantheon, snapshot: lost, unseating: true });
    expect(Object.keys(crossing.pantheon['deity:The Pale Warden'])).toEqual(['wins', 'losses', 'seats', 'tier', 'tierHeld']);
    // The row IS carried on this very tick's `changes`, so what follows is a fact about
    // what persists rather than about a tick on which the beat never fired.
    expect(JSON.stringify(crossing.changes)).toContain('lastSeat');
    // anchored: this exact tick's `changes` carries the flag (asserted on the line above).
    expect(JSON.stringify(crossing.pantheon)).not.toContain('lastSeat');
    // ZERO NEW TOP-LEVEL KEYS — the array's order IS the serialized key order, asserted
    // rather than assumed.
    expect([...CONDITIONAL_LEDGER_KEYS]).toEqual([
      'pantheon', 'religionStates', 'warPosture', 'occupations', 'pausedAdvance',
      'martialReadiness', 'conquestFeeds', 'mercenaryMarket', 'rulesetLog', 'spatialDigest',
      'spatialLedgers', 'narrativeTempo', 'politicsLedgers', 'factionPairStates', 'envoyErrands',
    ]);
    // A zero-seat remnant survives the lifecycle round trip as the ledger entry it already is.
    const remnant = { 'deity:The Pale Warden': { wins: 0, losses: 1, seats: 0, tier: 'cult', tierHeld: 0 } };
    const round = ensureWorldState({ rngSeed: 'wf1c-round', tick: 4, pantheon: remnant }, { id: 'wf1c-round' });
    expect(JSON.stringify(round.pantheon)).toBe(JSON.stringify(remnant));
    // And a field-absent world round-trips without materializing anything.
    expect('pantheon' in ensureWorldState({ rngSeed: 'wf1c-round', tick: 4 }, { id: 'wf1c-round' })).toBe(false);
  });

  test('A7 the wizard-news authoring join: the new site is inside the denominator, clean, and the debt ledger is unmoved', () => {
    const census = censusNewsAuthoringSites(REPO_ROOT, isExplicitlyRouted);
    const debt = debtLedgerRows(census.sites);
    const frozen = JSON.parse(readFileSync(join(REPO_ROOT, 'tests/lint/.wizard-news-authoring-baseline.json'), 'utf8'));
    expect(frozen.entries.length).toBe(19);
    expect(debt.length).toBe(19);
    // A NEW ROW MUST BE FIXED, NEVER BASELINED — the walker's own instruction. This member's
    // file owes none.
    expect(debt.filter(r => r.path === 'src/domain/worldPulse/realmEvents.js')).toEqual([]);
    // THE POSITIVE CONTROL that makes the empty list above mean something: the new authoring
    // site is really IN the census, really routes on its own token, and really carries no issue.
    const mine = census.sites.filter(s => s.path === 'src/domain/worldPulse/realmEvents.js');
    expect(mine.length).toBe(5);
    expect(mine.flatMap(s => s.routeTokens).sort()).toEqual(['pantheon_ascendancy', 'pantheon_extinction', 'pantheon_twilight']);
    expect(mine.flatMap(s => s.issues)).toEqual([]);
    // The exact identity holds: exactly one candidate is excluded as a non-authoring shape.
    expect(census.candidateSites.length).toBe(census.sites.length + 1);
    const byPath = new Map();
    for (const site of census.sites) byPath.set(site.path, [...(byPath.get(site.path) || []), site]);
    expect(byPath.get('src/domain/worldPulse/informationStatecraft.js')?.length).toBe(3);
    expect(byPath.get('src/domain/worldPulse/supplyWebWarfare.js')?.length).toBe(4);
    expect(byPath.get('src/domain/worldPulse/momentum.js')?.length).toBe(1);
    expect(byPath.get('src/store/mapSlice.js')?.length).toBe(1);
  });
});

// ── 7. advancePantheon end-to-end (ratchet + seats + tier) ────────────────────
describe('pantheon — advancePantheon (full per-tick write)', () => {
  test('folds deltas, counts seats, derives tiers; order-independent', () => {
    const vael = deitySnapshot('Vael');
    const korl = deitySnapshot('Korl');
    const snapshot = snapshotForSaves([
      save('a', 'A', { deity: vael }),
      save('b', 'B', { deity: vael }),
      save('c', 'C', { deity: korl }),
    ]);
    const deltas = [
      { deityId: 'custom:lu_vael', outcome: 'win' },
      { deityId: 'custom:lu_korl', outcome: 'loss' },
    ];
    const fwd = advancePantheon({ pantheon: {}, snapshot, faithDeltas: deltas });
    const rev = advancePantheon({ pantheon: {}, snapshot, faithDeltas: [...deltas].reverse() });
    // Seats aggregated from the snapshot; wins/losses ratcheted.
    expect(fwd.pantheon['custom:lu_vael']).toMatchObject({ wins: 1, seats: 2 });
    expect(fwd.pantheon['custom:lu_korl']).toMatchObject({ losses: 1, seats: 1 });
    // Order-independent.
    expect(JSON.stringify(fwd.pantheon)).toBe(JSON.stringify(rev.pantheon));
  });
});

// ── 8. CONDITIONAL materialization at the worldState layer ─────────────────────
describe('pantheon — conditional materialization (ensureWorldState)', () => {
  test('an absent pantheon stays absent (no key materialized)', () => {
    const ws = ensureWorldState({ rngSeed: 's', tick: 1 });
    expect('pantheon' in ws).toBe(false);
  });

  test('an EMPTY pantheon normalizes to absent (no key carried through)', () => {
    const ws = ensureWorldState({ rngSeed: 's', tick: 1, pantheon: {} });
    expect('pantheon' in ws).toBe(false);
  });

  test('a present, non-empty pantheon is deep-cloned (no aliasing)', () => {
    const src = { 'custom:lu_vael': { wins: 2, losses: 0, seats: 2, tier: 'minor', tierHeld: 0 } };
    const ws = ensureWorldState({ rngSeed: 's', tick: 1, pantheon: src });
    expect(ws.pantheon).toEqual(src);
    expect(ws.pantheon).not.toBe(src); // a clone, not the same ref
    expect(ws.pantheon['custom:lu_vael']).not.toBe(src['custom:lu_vael']);
  });
});

// ── 9. FULL-STACK dormancy: the pantheon is absent when religion is dormant ────
describe('pantheon — full-stack dormancy byte-identity (religion code present)', () => {
  function deityFreeCampaign(worldStatePatch = {}) {
    return {
      id: 'pantheon-dormancy', name: 'Pantheon Dormancy',
      settlementIds: ['a', 'b', 'c'],
      worldState: {
        rngSeed: 'pantheon-dormancy-seed', tick: 3,
        stressors: [
          { id: 'world_stressor.famine.a', type: 'famine', severity: 0.72, affectedSettlementIds: ['a'], age: 2 },
          { id: 'world_stressor.market_shock.b', type: 'market_shock', severity: 0.5, affectedSettlementIds: ['b'], age: 1 },
        ],
        ...worldStatePatch,
      },
      regionalGraph: ensureRegionalGraph({
        edges: [
          { id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'trade_partner' },
          { id: 'edge.b.c', from: 'b', to: 'c', relationshipType: 'rival' },
        ],
        channels: [
          { type: 'trade_dependency', from: 'a', to: 'b', status: 'confirmed' },
          { type: 'trade_route', from: 'b', to: 'c', status: 'confirmed' },
        ],
      }),
      wizardNews: { currentTick: 3, entries: [] },
    };
  }
  const dormSaves = () => [save('a', 'Ashford'), save('b', 'Briarwatch'), save('c', 'Crownhold')];

  test('a deity-free pulse with the flag ON carries NO pantheon key (the activation gate short-circuits)', () => {
    const on = previewCampaignWorldPulse({
      campaign: deityFreeCampaign({ simulationRules: { religionDynamicsEnabled: true } }),
      saves: dormSaves(), interval: 'one_month', now: NOW,
    });
    // Anti-vacuity: the pulse did real work.
    expect(on.selected.length).toBeGreaterThan(0);
    // No pantheon key — the F2 activation gate (no embedded deity) short-circuits
    // before the pantheon ratchet can ever materialize the key.
    expect('pantheon' in on.worldState).toBe(false);
  });

  test('the pantheon addition is byte-neutral under the oracle: with the flag ON vs OFF (both deity-free)', () => {
    // Hold the simulationRules constant (the flag itself is real signal); the only
    // delta this test isolates is the R4 pantheon code path. Both pulses run with
    // the SAME rules and NO deity ⇒ the pantheon never materializes ⇒ byte-identical.
    const rules = { simulationRules: { religionDynamicsEnabled: true } };
    const a = previewCampaignWorldPulse({ campaign: deityFreeCampaign(rules), saves: dormSaves(), interval: 'one_month', now: NOW });
    const b = previewCampaignWorldPulse({
      // Same rules; the only difference is a synthetic empty pantheon on input,
      // which the conditional materialization must collapse to absent.
      campaign: deityFreeCampaign({ ...rules, pantheon: {} }),
      saves: dormSaves(), interval: 'one_month', now: NOW,
    });
    expect('pantheon' in a.worldState).toBe(false);
    expect('pantheon' in b.worldState).toBe(false);
    expect(normalizeForDormancy(a.worldState)).toEqual(normalizeForDormancy(b.worldState));
  });
});

// ── 10. INTEGRATION: a conversion ratchets the pantheon through the full pulse ─
describe('pantheon — full-pulse integration (ratchet + materialization)', () => {
  // Two strong major deities at A and B, both linked to a weak deity-free convert
  // C — the contest converts C and the winner banks a seat + a win in the pantheon.
  function contestSaves() {
    return [
      save('asource', 'Asource', { deity: deitySnapshot('Vael', { rank: 'major' }) }),
      save('bsource', 'Bsource', { deity: deitySnapshot('Korl', { rank: 'major' }) }),
      save('cconv', 'Cconv', { legitimacy: 30 }),
    ];
  }
  function contestCampaign() {
    return {
      id: 'pantheon-contest', name: 'Pantheon Contest',
      settlementIds: ['asource', 'bsource', 'cconv'],
      worldState: { rngSeed: 'pantheon-contest-seed', tick: 4, simulationRules: { religionDynamicsEnabled: true } },
      regionalGraph: ensureRegionalGraph({
        edges: [
          { id: 'edge.asource.cconv', from: 'asource', to: 'cconv', relationshipType: 'allied' },
          { id: 'edge.bsource.cconv', from: 'bsource', to: 'cconv', relationshipType: 'trade_partner' },
        ],
      }),
      wizardNews: { currentTick: 4, entries: [] },
    };
  }

  test('the pantheon materializes and the seat-holders are tracked when religion is active', () => {
    const pulse = previewCampaignWorldPulse({ campaign: contestCampaign(), saves: contestSaves(), interval: 'one_month', now: NOW });
    // Religion is active (deities present + flag on) ⇒ the pantheon key exists.
    expect('pantheon' in pulse.worldState).toBe(true);
    const pantheon = pulse.worldState.pantheon;
    // Vael + Korl each hold their home seat (pre-tick aggregation).
    expect(pantheon['custom:lu_vael']?.seats).toBeGreaterThanOrEqual(1);
    expect(pantheon['custom:lu_korl']?.seats).toBeGreaterThanOrEqual(1);
    // Every entry carries the full ledger shape.
    for (const entry of Object.values(pantheon)) {
      expect(entry).toHaveProperty('wins');
      expect(entry).toHaveProperty('seats');
      expect(entry).toHaveProperty('tier');
    }
  });

  test('reversing the saves order yields a byte-identical pantheon (order-independence)', () => {
    const fwd = previewCampaignWorldPulse({ campaign: contestCampaign(), saves: contestSaves(), interval: 'one_month', now: NOW });
    const rev = previewCampaignWorldPulse({ campaign: contestCampaign(), saves: [...contestSaves()].reverse(), interval: 'one_month', now: NOW });
    expect(JSON.stringify(fwd.worldState.pantheon)).toBe(JSON.stringify(rev.worldState.pantheon));
  });

  // A dominant deity (Vael) embedded on FOUR seats — at/above MAJOR_PROMOTE. With a
  // pre-seeded pantheon already at the dwell boundary, the next active pulse matures
  // the promotion and fires "The Ascendancy of Vael" into the news feed.
  test('a deity holding a decisive lead emits an Ascendancy arc through the full pulse', () => {
    const vael = deitySnapshot('Vael', { rank: 'major' });
    const saves = [
      save('s1', 'S1', { deity: vael }),
      save('s2', 'S2', { deity: vael }),
      save('s3', 'S3', { deity: vael }),
      save('s4', 'S4', { deity: vael }),
    ];
    const campaign = {
      id: 'ascendancy', name: 'Ascendancy', settlementIds: saves.map(s => s.id),
      worldState: {
        rngSeed: 'ascendancy-seed', tick: 4,
        simulationRules: { religionDynamicsEnabled: true },
        // Pre-seed Vael as a minor at the dwell boundary (tierHeld already 1, so the
        // NEXT pulse matures the major promotion: seats=4 ≥ MAJOR_PROMOTE).
        pantheon: { 'custom:lu_vael': { wins: 3, losses: 0, seats: 4, tier: 'minor', tierHeld: 1 } },
      },
      regionalGraph: ensureRegionalGraph({ edges: [], channels: [] }),
      wizardNews: { currentTick: 4, entries: [] },
    };
    const pulse = previewCampaignWorldPulse({ campaign, saves, interval: 'one_month', now: NOW });
    expect(pulse.worldState.pantheon['custom:lu_vael'].tier).toBe('major');
    const arc = (pulse.wizardNews?.entries || []).find(e => e.impactKind === 'pantheon_ascendancy');
    expect(arc).toBeTruthy();
    expect(arc.headline).toBe('The Ascendancy of Vael');
  });
});
