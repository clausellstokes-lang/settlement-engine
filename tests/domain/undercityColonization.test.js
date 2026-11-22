/**
 * undercityColonization.test.js — MF-UC4's acceptance: THE UNDERCITY EPOCH LAYER (ODQ §311.3 /
 * §311.4 / §311.8.2(d) / §311.8.3 / §311.8.4; charter draft-UNDERCITY-PLAN.md §4 UC-4, ruled
 * ODQ §441, dispatched §484).
 *
 * EIGHT ARMS, the charter's own closed list, each pinning INTENT rather than a snapshot of a
 * shared namespace: a positive control plus an exclusion, never a `toEqual` over a list a later
 * car of this train must grow (§474).
 *
 * ⭐ THE LIT ARMS DRIVE THE REAL SEAM, NOT A HAND-BUILT RECORD. `undercityHighWaterEnabled: true`
 * is written LITERALLY here (the mechanism-lit coverage walker reads the literal) and fed to the
 * real `ensureFactionStates` over TWO advances, feeding the first advance's own output world back
 * in — a single-advance harness cannot tell a MEMORY from a LEVEL, which is the GR-5A lesson taken
 * rather than re-learned.
 *
 * ⭐ THE DARK PATH IS PINNED AS AN ABSENCE, WITH ITS OWN ANTI-VACUITY CONTROL. Every dark
 * assertion here sits beside the lit reading of the same fixture, so "no fossils" is measured as a
 * dark path rather than as a collapsed derivation.
 */
import { describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { readCorruptionClimate } from '../../src/domain/corruption.js';
import { ensureFactionStates, projectFactionStatesOntoSettlement } from '../../src/domain/worldPulse/factionCompetition.js';
import { TEMPERAMENTS, isJointKind } from '../../src/domain/undercity/jointVocabulary.js';
import { deriveStrataExistence } from '../../src/domain/undercity/strataExistence.js';
import {
  COLONIZED_CEILING_BY_TIER,
  UNDERCITY_TUNING,
  deriveUndercity,
  powerHighWaterOf,
  syndicateStandingOf,
  undercityHighWaterActive,
  withPowerHighWater,
} from '../../src/domain/undercity/colonization.js';
import { expectAbsentWithAnchor, expectPresentThenAbsent } from '../helpers/anchoredNegatives.js';

const SEED = 'uc4-acceptance-2026-08-23';

/** A real generated settlement — the corpus idiom, so every arm reads live estate shapes. */
function world(overrides = {}, seed = SEED) {
  return generateSettlementPipeline({
    settType: 'city', culture: 'germanic', terrainOverride: 'plains',
    tradeRouteAccess: 'road', monsterThreat: 'civilized', ...overrides,
  }, null, { seed, customContent: {} });
}

/** The settlement with its criminal-economic drivers set to a chosen strength. `blackMarketCapture`
 *  is the estate's stored home (0..80) and `compound.criminalEffective` (0..100) outranks it —
 *  exactly corruption.js's precedence, driven here rather than restated. */
function withProfile(s, { capture = null, effective = null } = {}) {
  const sp = { ...(s.economicState?.safetyProfile || s.safetyProfile || {}) };
  if (capture != null) sp.blackMarketCapture = capture;
  if (effective != null) sp.compound = { ...(sp.compound || {}), criminalEffective: effective };
  else delete sp.compound;
  return { ...s, safetyProfile: sp, economicState: { ...(s.economicState || {}), safetyProfile: sp } };
}

/** The settlement with ONE criminal faction at a chosen 0..100 roster power. */
function withSyndicate(s, power) {
  const factions = [{ faction: 'The Ashen Hand', category: 'criminal', power }];
  return { ...s, powerStructure: { ...(s.powerStructure || {}), factions } };
}

/** The settlement with its recorded vertical mark already standing on the roster entry — the shape
 *  the pulse seam projects. Used only where an arm needs a RECESSION without re-driving two ticks. */
function withMark(s, mark) {
  const factions = (s.powerStructure?.factions || []).map((f) => ({ ...f, powerHighWater: mark }));
  return { ...s, powerStructure: { ...(s.powerStructure || {}), factions } };
}

/** One advance through the REAL faction seam. */
function advance(worldState, settlement, tag) {
  const snapshot = { settlements: [{ id: 'uc4', activeConditions: [], settlement }] };
  return ensureFactionStates(worldState, snapshot, createPRNG(`${SEED}:${tag}`).fork('init'));
}

const kindsOf = (u) => u.components.map((c) => c.kind);

describe('MF-UC4 — the undercity epoch layer (colonization and the vertical high-water law)', () => {
  test('A1 · the two-level reading: no criminal drivers means a seeded sheet with no undercity', () => {
    const base = withSyndicate(world(), 0);
    const lively = withProfile(base, { effective: 90 });
    const dead = withProfile(base, { effective: 0, capture: 0 });
    // The SHEET is the first level and belongs to UC-0. It stands on both fixtures, which is what
    // makes the second level's absence a real absence and not a settlement with nothing under it.
    expect(deriveStrataExistence(lively).exists).toBe(true);
    expect(deriveStrataExistence(dead).exists).toBe(true);
    // PRESENT-THEN-ABSENT over the component kinds: the same roster grows an undercity when the
    // criminal economy is there, so the empty reading measures the drivers, not a dead derivation.
    expectPresentThenAbsent(kindsOf(deriveUndercity(lively)), kindsOf(deriveUndercity(dead)), 'colonized_seed', 'A1 two-level reading');
    expect(deriveUndercity(lively).present).toBe(true);
    expect(deriveUndercity(dead).present).toBe(false);
    // anchored: the same `dead` fixture's `lively` twin is asserted present three lines up, so an
    // emptied derivation would red there before this negative could pass vacuously.
    expect(deriveUndercity(dead).components).toEqual([]);
  });

  test('A2 · colonization is monotone in syndicate power, and criminalShare EQUALS corruption.js', () => {
    const s = withProfile(world(), { effective: 55 });
    // MONOTONE NON-DECREASING, driven over the whole standing range through the real deriver.
    let previous = -1;
    const seen = new Set();
    for (let p = 0; p <= 100; p += 10) {
      const u = deriveUndercity(withSyndicate(s, p));
      expect(u.colonizationShare, `standing ${p} fell below standing ${p - 10}`).toBeGreaterThanOrEqual(previous);
      previous = u.colonizationShare;
      seen.add(u.components.filter((c) => c.kind === 'colonized_seed').length);
    }
    // NON-VACUOUS: the sweep really moves the colonized count, so "monotone" is measured on a
    // curve rather than on a flat line that would satisfy the ordering trivially.
    expect(seen.size).toBeGreaterThan(1);
    // ONE TRUTH (§441.3): both precedence branches AND the unset default, each equal to the read
    // corruption.js itself makes for the same profile — never a parallel weighting.
    for (const profile of [{ effective: 70 }, { effective: 12 }, { capture: 64 }, { capture: 8 }, {}]) {
      const fixture = withProfile(world(), profile);
      expect(deriveUndercity(fixture).drivers.criminalShare).toBe(readCorruptionClimate(fixture).crime);
    }
  });

  test('A3 · a receding syndicate leaves fossils on the LIT path, and the dark path says so honestly', () => {
    const risen = withSyndicate(withProfile(world(), { effective: 80 }), 90);
    const fallen = withSyndicate(withProfile(world(), { effective: 80 }), 5);
    // ⭐ THREE ADVANCES through the REAL seam, each one's own output world fed into the next: the
    // MINT, then a pass AT THE PEAK, then the FALL. The middle pass is not padding — the fold
    // records history SINCE LIGHTING, so a state minted in the same pass takes no mark and a
    // two-advance drive would record only the fall. And the third pass is the arm: a fold that
    // merely TRACKS the level answers 0.05 there and leaves no recession to fossilize, so only a
    // MEMORY produces the rows below. The flag literal is what the mechanism-lit walker reads.
    const litRules = { undercityHighWaterEnabled: true };
    let lit = advance({ factionStates: {}, simulationRules: litRules }, risen, 'lit-1');
    lit = advance(lit, risen, 'lit-2');
    lit = advance(lit, fallen, 'lit-3');
    const marks = Object.values(lit.factionStates).map((st) => powerHighWaterOf(st));
    expect(marks.some((m) => m != null && m > 0.5), 'the lit seam recorded a high mark').toBe(true);
    // The mark PROJECTS onto the settlement, which is where the deriver reads it.
    const projected = projectFactionStatesOntoSettlement(fallen, lit.factionStates, 'uc4', { tick: 2 });
    const litUndercity = deriveUndercity(projected);
    expect(litUndercity.drivers.highWater, 'the recorded mark reaches the deriver').not.toBeNull();
    expect(litUndercity.fossils.length, 'a fall from the mark leaves fossils').toBeGreaterThan(0);
    expect(FOSSIL_CAUSES_SEEN(litUndercity)).toContain('THE_SYNDICATE_RECEDED_FROM_ITS_HIGH_WATER');
    // THE DARK PATH, same fixture: no flag, no mark, and the list is EMPTY rather than invented.
    let dark = advance({ factionStates: {}, simulationRules: {} }, risen, 'dark-1');
    dark = advance(dark, risen, 'dark-2');
    const darkProjected = projectFactionStatesOntoSettlement(fallen, dark.factionStates, 'uc4', { tick: 2 });
    const darkUndercity = deriveUndercity(darkProjected);
    expect(undercityHighWaterActive({ simulationRules: {} })).toBe(false);
    expect(darkUndercity.drivers.highWater).toBeNull();
    // anchored: the LIT reading of this identical fixture is asserted non-empty eight lines up,
    // so an emptied fossil derivation reds there before this dark absence could pass vacuously.
    expect(darkUndercity.fossils).toEqual([]);
  });

  test('A4 · inertia: new digging never re-rolls the monotone components of an earlier epoch', () => {
    // UC-2 is NOT BUILT at this base, so the arm pins against its CONTRACT SHAPE as an input
    // (charter §7 F3) — kind, license, anchor by canonical key, extent, abandoned, temperament
    // MONOTONE, surfaceJoins. The LIVE composition is a recorded deferral in the packet.
    const uc2Contract = Object.freeze([Object.freeze({
      kind: 'crypt', license: 'BURIAL_DEMAND', anchor: 'institution.temple', extent: 'chamber',
      abandoned: false, temperament: 'MONOTONE', surfaceJoins: Object.freeze([Object.freeze({ kind: 'stair', anchor: 'church stair' })]),
    })]);
    const before = JSON.stringify(uc2Contract);
    const quiet = deriveUndercity(withSyndicate(withProfile(world(), { effective: 60 }), 10));
    const busy = deriveUndercity(withSyndicate(withProfile(world(), { effective: 95 }), 95));
    // BOTH epochs are LIVE, so the comparison below measures GROWTH rather than the arrival of an
    // undercity where there was none — the distinction a frozen colonization would otherwise hide.
    expect(quiet.present).toBe(true);
    expect(busy.present).toBe(true);
    const dugIn = (u) => u.components.filter((c) => c.kind === 'colonized_seed').length;
    // The earlier epoch's rows are untouched across a colonization that demonstrably GREW.
    expect(dugIn(busy)).toBeGreaterThan(dugIn(quiet));
    expect(JSON.stringify(uc2Contract)).toBe(before);
    // DISJOINT BY TEMPERAMENT, which is what makes "never re-rolls" structural rather than
    // hopeful: every row this car produces is DEMAND_DRIVEN, so no monotone row is ever its output.
    const temperaments = busy.components.map((c) => c.temperament);
    expectAbsentWithAnchor(temperaments, 'MONOTONE', 'DEMAND_DRIVEN', 'A4 inertia');
    // The vocabulary both cars draw from is the one closed list, so the exclusion is real.
    expect(TEMPERAMENTS).toContain('MONOTONE');
    expect(TEMPERAMENTS).toContain('DEMAND_DRIVEN');
  });

  test('A5 · flood and seal SEVER a working without deleting it', () => {
    const dry = withSyndicate(withProfile(world({ terrainOverride: 'plains', tradeRouteAccess: 'road' }), { effective: 95 }), 95);
    const wet = withSyndicate(withProfile(world({ terrainOverride: 'coastal', tradeRouteAccess: 'port' }), { effective: 95 }), 95);
    const dryRows = deriveUndercity(dry).components.filter((c) => c.kind === 'colonized_seed');
    const wetRows = deriveUndercity(wet).components.filter((c) => c.kind === 'colonized_seed');
    expect(dryRows.length).toBeGreaterThan(1);
    expect(wetRows.length).toBeGreaterThan(1);
    // PRESENT-THEN-ABSENT over the STATES: dry ground keeps every working open, waterside ground
    // floods the deepest one — so 'flooded' measures the water table and not a shapeless default.
    expectPresentThenAbsent(wetRows.map((c) => c.state), dryRows.map((c) => c.state), 'flooded', 'A5 flood');
    const drowned = wetRows.filter((c) => c.state === 'flooded');
    expect(drowned.length).toBe(1);
    // SEVER, NEVER DELETE: the row survives with its licence, its front and its anchor intact and
    // loses only its joins, and the open rows still carry theirs (so empty is a severance).
    expect(drowned[0].license).toBe('CRIMINAL_DEMAND_ON_A_SEEDED_SPACE');
    expect(drowned[0].front.kind).toBe('INSTITUTION');
    expect(drowned[0].surfaceJoins).toEqual([]);
    expect(wetRows.filter((c) => c.state === 'open').every((c) => c.surfaceJoins.length === 1)).toBe(true);
    // A SEALED working is the same law on the other consequence: a DATED calamity in the immutable
    // record, reached through the banked ledger projection and never off the raw key.
    const struck = { ...dry, calamityHistory: [{ type: 'plague', year: 212, tick: 9, deaths: 400, k: 2, targets: [] }] };
    const struckRows = deriveUndercity(struck).components.filter((c) => c.kind === 'colonized_seed');
    expectPresentThenAbsent(struckRows.map((c) => c.state), dryRows.map((c) => c.state), 'sealed', 'A5 seal');
    expect(struckRows.length).toBe(dryRows.length);
  });

  test('A6 · dark-flag byte identity: an unlit advance gains no key anywhere', () => {
    const s = withSyndicate(withProfile(world(), { effective: 80 }), 90);
    let absent = advance({ factionStates: {}, simulationRules: {} }, s, 'byte-1');
    absent = advance(absent, s, 'byte-2');
    let explicitlyFalse = advance({ factionStates: {}, simulationRules: { undercityHighWaterEnabled: false } }, s, 'byte-1');
    explicitlyFalse = advance(explicitlyFalse, s, 'byte-2');
    // ABSENT and FALSE are the same world, byte for byte — the strict `=== true` gate's whole claim.
    expect(JSON.stringify(explicitlyFalse.factionStates)).toBe(JSON.stringify(absent.factionStates));
    // The projection materializes NOTHING onto a roster entry that never carried the field, so a
    // dark world's settlement is the settlement it was.
    const darkProjected = projectFactionStatesOntoSettlement(s, absent.factionStates, 'uc4', { tick: 2 });
    expect(JSON.stringify(darkProjected.powerStructure.factions)).toBe(JSON.stringify(s.powerStructure.factions));
    // ANTI-VACUITY: the identical harness LIT does write the key, so the absence above measures the
    // gate rather than a fold that never runs at all.
    let alight = advance({ factionStates: {}, simulationRules: { undercityHighWaterEnabled: true } }, s, 'byte-1');
    alight = advance(alight, s, 'byte-2');
    expectPresentThenAbsent(
      JSON.stringify(alight.factionStates), JSON.stringify(absent.factionStates), 'powerHighWater', 'A6 dark identity',
    );
    // And the fold itself is monotone with no clearer: a lower observation never lowers the mark.
    const held = withPowerHighWater({ factionId: 'f' }, 0.8);
    expect(powerHighWaterOf(withPowerHighWater(held, 0.2))).toBe(0.8);
    expect(powerHighWaterOf(withPowerHighWater(held, 0.9))).toBe(0.9);
    // An UNMARKED record answers null, never zero — "no instrument", not "no recession".
    expect(powerHighWaterOf({ factionId: 'f' })).toBeNull();
  });

  test('A7 · the UNIVERSAL FRONT: every colonized piece names its surface cover', () => {
    const s = withSyndicate(withProfile(world({ settType: 'metropolis' }), { effective: 95 }), 95);
    const u = deriveUndercity(s);
    const colonized = u.components.filter((c) => c.kind === 'colonized_seed');
    expect(colonized.length).toBeGreaterThan(1);
    // ⭐ THE POSITIVE HALF FIRST: a REAL institution really is seated below on a real generated
    // world. Without this the loop's two-branch reading is satisfied by a world where every front
    // collapsed to anonymous fabric — the law's honest half standing in for its whole.
    expect(colonized.filter((c) => c.front.kind === 'INSTITUTION').length).toBeGreaterThan(0);
    for (const row of colonized) {
      expect(['INSTITUTION', 'ANONYMOUS_FABRIC']).toContain(row.front.kind);
      if (row.front.kind === 'INSTITUTION') {
        // A REAL institution seated below: the front's key is one the settlement's OWN strata
        // seeds carry, so nothing clickable is minted (§175.1's truth roster).
        expect(deriveStrataExistence(s).seeds.map((seed) => seed.anchor)).toContain(row.front.anchor);
        expect(row.anchor).toBe(row.front.anchor);
      } else {
        // Anonymous fabric names nothing, which is the honest half of the same law.
        expect(row.front.anchor).toBeNull();
        expect(row.front.name).toBeNull();
      }
      expect(row.temperament).toBe('DEMAND_DRIVEN');
      expect(row.surfaceJoins.every((j) => isJointKind(j.kind))).toBe(true);
    }
    // The ANONYMOUS branch is reachable and correct, driven on a supplied anchorless seed (UC-1's
    // derived-rung shape) because the generated corpus produces only anchored seeds — measured,
    // not assumed: 0 of 420 anonymous fronts in this lane's sweep.
    const anonymous = deriveUndercity(s, {
      strata: { seeds: [{ class: 'sanitation', anchor: null, name: null }] },
    });
    expect(anonymous.components.filter((c) => c.kind === 'colonized_seed')[0].front.kind).toBe('ANONYMOUS_FABRIC');
  });

  test('A8 · G-43: remove the wall and the smugglers tunnel loses its licence', () => {
    const s = withSyndicate(withProfile(world(), { effective: 95 }), 95);
    const walled = { ...s, defenseProfile: { ...(s.defenseProfile || {}), hasWalls: true } };
    const razed = { ...s, defenseProfile: { ...(s.defenseProfile || {}), hasWalls: false, walls: [], institutions: {} } };
    // THE DIRECTIONAL: one fact removed, one row gone, everything else standing.
    expectPresentThenAbsent(kindsOf(deriveUndercity(walled)), kindsOf(deriveUndercity(razed)), 'smugglers_tunnel', 'A8 remove the wall');
    // The colonization itself is UNMOVED — the wall licenses the tunnel and nothing else, so this
    // is a licence loss rather than a collapsed derivation.
    const colonizedOf = (x) => deriveUndercity(x).components.filter((c) => c.kind === 'colonized_seed');
    expect(colonizedOf(razed).length).toBe(colonizedOf(walled).length);
    expect(deriveUndercity(razed).present).toBe(true);
    // THE OTHER HALF OF THE LICENCE is the criminal share, and it is a real conjunction: a walled
    // town below the floor digs no bypass either.
    const timid = withProfile(walled, { effective: 10, capture: 4 });
    expect(readCorruptionClimate(timid).crime).toBeLessThan(UNDERCITY_TUNING.smugglerCriminalFloor);
    expectAbsentWithAnchor(kindsOf(deriveUndercity(walled)), 'nothing_at_all', 'smugglers_tunnel', 'A8 anchor');
    // The walled fixture one line up is asserted to CONTAIN smugglers_tunnel through the same
    // accessor, so the exclusion below measures the criminal-share floor, never an empty list.
    // anchored: the immediately preceding expectAbsentWithAnchor pins smugglers_tunnel PRESENT on the walled twin.
    expect(kindsOf(deriveUndercity(timid))).not.toContain('smugglers_tunnel');
    // The ceiling grammar and the standing reader are live on this fixture, so the arm above is
    // not resting on a settlement the deriver could never have populated.
    expect(COLONIZED_CEILING_BY_TIER.city).toBeGreaterThan(0);
    expect(syndicateStandingOf(walled).length).toBe(1);
  });
});

/** The causes present on a derivation's fossils — a helper so the arm reads as one claim. */
function FOSSIL_CAUSES_SEEN(u) {
  return u.fossils.map((f) => f.cause);
}
