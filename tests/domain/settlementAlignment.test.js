/**
 * tests/domain/settlementAlignment.test.js — Phase 5.5 W0 Lane A.
 *
 * Pins the DERIVED settlement-alignment substrate (disposition.computeLawfulness
 * / computeMalice, siblings of computeAggressiveness, + the settlementAlignment
 * read-model selector). Four contracts, per the W0 brief:
 *
 *   1. NEUTRALITY — a settlement with NO deity / traits / recognized governance
 *      / legitimacy record / war ledgers reads EXACTLY 0.5 on both axes (the
 *      fidelityNoise neutrality discipline). This is the byte-safety anchor:
 *      no consumer is wired this wave, and when one IS wired, a no-signal
 *      settlement must contribute no phantom alignment.
 *   2. BOUNDED + DETERMINISTIC + TOTAL — property-tested over garbage/sparse
 *      settlement shapes: always a finite 0..1, same input ⇒ same output,
 *      never throws.
 *   3. DIRECTIONAL — a lawful-bureaucratic high-legitimacy temple town reads
 *      high-lawfulness / low-malice; a warlord-run occupied low-legitimacy town
 *      reads the opposite.
 *   4. INPUT ATTRIBUTION — each named input (deity axes, governance band,
 *      legitimacy, authored conscience, war_exhaustion / conquest feeds) moves
 *      its axis in the documented direction; the RNG-rolled npcStates.alignment
 *      never does (the OQ13 authored-only discipline).
 */

import { describe, expect, test } from 'vitest';
import fc from 'fast-check';

import {
  computeLawfulness,
  computeMalice,
  computeAggressiveness,
  ALIGNMENT_TUNING,
} from '../../src/domain/worldPulse/disposition.js';
import { settlementAlignment } from '../../src/domain/worldPulse/settlementAlignment.js';

// ── Fixtures (the disposition.test.js shapes) ────────────────────────────────

function settlement(name, patch = {}) {
  return {
    name,
    tier: patch.tier || 'town',
    population: patch.population || 4000,
    config: {
      tradeRouteAccess: 'road', priorityEconomy: 30, priorityMilitary: 25,
      ...(patch.config || {}),
    },
    institutions: patch.institutions || [],
    economicState: { prosperity: 'Stable', primaryExports: [], primaryImports: [] },
    powerStructure: {
      ...(patch.legitimacy != null
        ? { publicLegitimacy: { score: patch.legitimacy, label: 'Banded' } }
        : {}),
      factions: patch.factions || [],
      conflicts: [],
    },
    npcs: patch.npcs || [],
    activeConditions: [],
  };
}

function item(id, patch = {}) {
  return { id, settlement: settlement(id, patch) };
}

// A settlement with NO signal on any alignment input: no deity, no factions,
// no NPCs, no publicLegitimacy record, empty worldState ledgers.
const noSignal = () => item('blank');
const WS_EMPTY = { dispositionStats: {} };

// The directional pair from the brief.
const templeTown = () => item('temple', {
  factions: [{ faction: 'City Council', category: 'government', power: 75, isGoverning: true }],
  legitimacy: 85,
  npcs: [
    { name: 'High Priest', importance: 'pillar', personality: { dominant: 'principled', flaw: 'honest', modifier: 'merciful' } },
    { name: 'Magistrate', importance: 'key', personality: { dominant: 'fair-minded', flaw: 'compassionate', modifier: 'patient' } },
  ],
  config: { primaryDeitySnapshot: { name: 'The Lawgiver', alignmentAxis: 'good', lawAxis: 'lawful' } },
});

const warlordTown = () => item('warlord', {
  factions: [{ faction: 'Occupation Authority', category: 'occupation', power: 85, isGoverning: true }],
  legitimacy: 15,
  npcs: [
    { name: 'Warlord', importance: 'pillar', personality: { dominant: 'cruel', flaw: 'ruthless', modifier: 'zealous' } },
    { name: 'Enforcer', importance: 'key', personality: { dominant: 'vindictive', flaw: 'corrupt', modifier: 'opportunistic' } },
  ],
  config: { primaryDeitySnapshot: { name: 'The Flayed King', alignmentAxis: 'evil', lawAxis: 'chaotic' } },
});
// The warlord's world: it HOLDS an occupation elsewhere (conquest feed) and
// carries a deep war-exhaustion scar (sustained war-waging).
const warlordWorld = () => ({
  dispositionStats: {},
  warExhaustion: { warlord: 0.7 },
  occupations: { victim: { occupierId: 'warlord', state: 'subjugated', sinceTick: 3 } },
});

// ── 1. Neutrality ─────────────────────────────────────────────────────────────

describe('settlement alignment — the 0.5/0.5 neutrality anchor', () => {
  test('a settlement with NO deity/traits/governance/legitimacy signal reads EXACTLY 0.5/0.5', () => {
    expect(computeLawfulness(noSignal(), WS_EMPTY)).toBe(0.5);
    expect(computeMalice(noSignal(), WS_EMPTY)).toBe(0.5);
  });

  test('the read model bundles the axes verbatim; both alignment axes anchor at 0.5', () => {
    const bundle = settlementAlignment(noSignal(), WS_EMPTY);
    expect(bundle.lawfulness01).toBe(0.5);
    expect(bundle.malice01).toBe(0.5);
    // aggressiveness is carried through VERBATIM from computeAggressiveness.
    // (Its own exact-1.0 anchor needs a CIVIC/GOVERNMENT seat — a faction-LESS
    // settlement reads the OTHER archetype's mild pacific tilt, a pre-existing
    // behavior this wave must not change.)
    expect(bundle.aggressiveness).toBe(computeAggressiveness(noSignal(), WS_EMPTY));
    const civic = item('civic', {
      factions: [{ faction: 'Town Council', category: 'civic', power: 60, isGoverning: true }],
    });
    expect(settlementAlignment(civic, WS_EMPTY).aggressiveness).toBe(1.0);
  });

  test('a NEUTRAL deity reads the same 0.5 midpoint as NO deity (legacy back-compat)', () => {
    const neutralDeity = item('n', {
      config: { primaryDeitySnapshot: { name: 'The Balance', alignmentAxis: 'neutral', lawAxis: 'neutral' } },
    });
    expect(computeLawfulness(neutralDeity, WS_EMPTY)).toBe(0.5);
    expect(computeMalice(neutralDeity, WS_EMPTY)).toBe(0.5);
    // A LEGACY deity with no axes at all is the same midpoint.
    const legacyDeity = item('l', { config: { primaryDeitySnapshot: { name: 'Old One' } } });
    expect(computeLawfulness(legacyDeity, WS_EMPTY)).toBe(0.5);
    expect(computeMalice(legacyDeity, WS_EMPTY)).toBe(0.5);
  });

  test('totally absent inputs (null item / null worldState) read neutral, never throw', () => {
    expect(computeLawfulness(null, null)).toBe(0.5);
    expect(computeMalice(null, null)).toBe(0.5);
    expect(computeLawfulness({}, undefined)).toBe(0.5);
    expect(computeMalice({}, undefined)).toBe(0.5);
    const bundle = settlementAlignment(null, null);
    expect(bundle.lawfulness01).toBe(0.5);
    expect(bundle.malice01).toBe(0.5);
    expect(Number.isFinite(bundle.aggressiveness)).toBe(true);
  });
});

// ── 2. Bounded / deterministic / total (property tests) ──────────────────────

// Garbage-tolerant arbitraries: sparse, malformed, and hostile settlement shapes.
const garbageValue = fc.oneof(
  fc.constant(null), fc.constant(undefined), fc.string(), fc.double({ noNaN: false }),
  fc.integer(), fc.boolean(), fc.constant({}), fc.constant([]),
);

const npcArb = fc.record({
  name: fc.option(fc.string(), { nil: undefined }),
  importance: fc.option(fc.constantFrom('pillar', 'key', 'notable', 'nobody', 42), { nil: undefined }),
  personality: fc.oneof(
    garbageValue,
    fc.string(),
    fc.array(fc.oneof(fc.string(), fc.integer()), { maxLength: 4 }),
    fc.record({
      dominant: fc.option(fc.constantFrom('cruel', 'merciful', 'principled', 'greedy', 'stoic', 'xyzzy'), { nil: undefined }),
      flaw: fc.option(fc.constantFrom('ruthless', 'honest', 'corrupt', ''), { nil: undefined }),
      modifier: fc.option(fc.constantFrom('zealous', 'idealistic', 'pragmatic'), { nil: undefined }),
    }),
  ),
}, { requiredKeys: [] });

const factionArb = fc.record({
  faction: fc.option(fc.string(), { nil: undefined }),
  category: fc.option(fc.constantFrom('government', 'criminal', 'occupation', 'religious', 'weird', ''), { nil: undefined }),
  power: fc.oneof(fc.integer({ min: -50, max: 500 }), garbageValue),
  isGoverning: fc.option(fc.boolean(), { nil: undefined }),
}, { requiredKeys: [] });

const settlementArb = fc.record({
  name: fc.option(fc.string(), { nil: undefined }),
  config: fc.option(fc.record({
    primaryDeitySnapshot: fc.option(fc.record({
      alignmentAxis: fc.option(fc.constantFrom('good', 'evil', 'neutral', 'chartreuse'), { nil: undefined }),
      lawAxis: fc.option(fc.constantFrom('lawful', 'chaotic', 'neutral', 7), { nil: undefined }),
    }, { requiredKeys: [] }), { nil: undefined }),
  }, { requiredKeys: [] }), { nil: undefined }),
  powerStructure: fc.option(fc.record({
    publicLegitimacy: fc.oneof(
      garbageValue,
      fc.record({ score: fc.oneof(fc.integer({ min: -100, max: 300 }), garbageValue) }, { requiredKeys: [] }),
      fc.integer({ min: 0, max: 100 }),
    ),
    factions: fc.oneof(garbageValue, fc.array(factionArb, { maxLength: 3 })),
  }, { requiredKeys: [] }), { nil: undefined }),
  npcs: fc.oneof(garbageValue, fc.array(npcArb, { maxLength: 4 })),
}, { requiredKeys: [] });

const worldStateArb = fc.option(fc.record({
  warExhaustion: fc.oneof(garbageValue, fc.dictionary(fc.string({ maxLength: 3 }), fc.oneof(fc.double({ min: -2, max: 3, noNaN: false }), garbageValue), { maxKeys: 3 })),
  occupations: fc.oneof(garbageValue, fc.dictionary(fc.string({ maxLength: 3 }), fc.oneof(garbageValue, fc.record({ occupierId: fc.string({ maxLength: 3 }) }, { requiredKeys: [] })), { maxKeys: 3 })),
  dispositionStats: fc.oneof(garbageValue, fc.constant({})),
}, { requiredKeys: [] }), { nil: undefined });

const itemArb = fc.oneof(
  fc.constant(null),
  fc.record({ id: fc.option(fc.string({ maxLength: 4 }), { nil: undefined }), settlement: fc.option(settlementArb, { nil: undefined }) }, { requiredKeys: [] }),
  settlementArb, // the bare-settlement calling convention (item || settlement)
);

describe('settlement alignment — bounded, deterministic, total on garbage (property)', () => {
  test('both axes are ALWAYS a finite 0..1, and the same input reads the same value twice', () => {
    fc.assert(
      fc.property(itemArb, worldStateArb, (it, ws) => {
        const law = computeLawfulness(it, ws);
        const mal = computeMalice(it, ws);
        expect(Number.isFinite(law)).toBe(true);
        expect(Number.isFinite(mal)).toBe(true);
        expect(law).toBeGreaterThanOrEqual(0);
        expect(law).toBeLessThanOrEqual(1);
        expect(mal).toBeGreaterThanOrEqual(0);
        expect(mal).toBeLessThanOrEqual(1);
        // Determinism: a second evaluation of the SAME input is identical.
        expect(computeLawfulness(it, ws)).toBe(law);
        expect(computeMalice(it, ws)).toBe(mal);
        // The read model agrees with its parts.
        const bundle = settlementAlignment(it, ws);
        expect(bundle.lawfulness01).toBe(law);
        expect(bundle.malice01).toBe(mal);
        expect(bundle.aggressiveness).toBe(computeAggressiveness(it, ws));
      }),
      { numRuns: 120, seed: 55_0 }, // seeded: the property run itself replays byte-exact
    );
  });
});

// ── 3. Directional fixtures ───────────────────────────────────────────────────

describe('settlement alignment — directional fixtures (the brief pair)', () => {
  test('a lawful-bureaucratic high-legitimacy temple town: HIGH lawfulness, LOW malice', () => {
    const t = templeTown();
    const law = computeLawfulness(t, WS_EMPTY);
    const mal = computeMalice(t, WS_EMPTY);
    expect(law).toBeGreaterThan(0.7);   // government seat + lawful patron + legitimacy 85
    expect(mal).toBeLessThan(0.3);      // good patron + principled/merciful cast
  });

  test('a warlord-run occupied-holdings low-legitimacy town: LOW lawfulness, HIGH malice', () => {
    const w = warlordTown();
    const law = computeLawfulness(w, warlordWorld());
    const mal = computeMalice(w, warlordWorld());
    expect(law).toBeLessThan(0.3);      // occupation seat + chaotic patron + legitimacy 15
    expect(mal).toBeGreaterThan(0.7);   // evil patron + cruel cast + war scar + held conquest
  });

  test('the two towns are strictly ordered on BOTH axes (the contrast is real)', () => {
    const t = templeTown();
    const w = warlordTown();
    expect(computeLawfulness(t, WS_EMPTY)).toBeGreaterThan(computeLawfulness(w, warlordWorld()));
    expect(computeMalice(t, WS_EMPTY)).toBeLessThan(computeMalice(w, warlordWorld()));
  });
});

// ── 4. Input attribution ──────────────────────────────────────────────────────

describe('settlement alignment — each input moves its axis in the documented direction', () => {
  test('deity axes: an evil patron raises malice; a chaotic patron lowers lawfulness', () => {
    const plain = () => item('s');
    const evil = item('s', { config: { primaryDeitySnapshot: { alignmentAxis: 'evil', lawAxis: 'neutral' } } });
    const good = item('s', { config: { primaryDeitySnapshot: { alignmentAxis: 'good', lawAxis: 'neutral' } } });
    expect(computeMalice(evil, WS_EMPTY)).toBeGreaterThan(computeMalice(plain(), WS_EMPTY));
    expect(computeMalice(good, WS_EMPTY)).toBeLessThan(computeMalice(plain(), WS_EMPTY));

    const chaotic = item('s', { config: { primaryDeitySnapshot: { alignmentAxis: 'neutral', lawAxis: 'chaotic' } } });
    const lawful = item('s', { config: { primaryDeitySnapshot: { alignmentAxis: 'neutral', lawAxis: 'lawful' } } });
    expect(computeLawfulness(chaotic, WS_EMPTY)).toBeLessThan(computeLawfulness(plain(), WS_EMPTY));
    expect(computeLawfulness(lawful, WS_EMPTY)).toBeGreaterThan(computeLawfulness(plain(), WS_EMPTY));
    // The evil axis does NOT leak into lawfulness, nor chaos into malice.
    expect(computeLawfulness(evil, WS_EMPTY)).toBe(computeLawfulness(plain(), WS_EMPTY));
    expect(computeMalice(chaotic, WS_EMPTY)).toBe(computeMalice(plain(), WS_EMPTY));
  });

  test('governance band: a criminal seat is lawless+malicious; a government seat is lawful, malice-neutral', () => {
    const gov = item('s', { factions: [{ faction: 'City Council', category: 'government', power: 70, isGoverning: true }] });
    const crim = item('s', { factions: [{ faction: 'Velvet Syndicate', category: 'criminal', power: 70, isGoverning: true }] });
    expect(computeLawfulness(gov, WS_EMPTY)).toBeGreaterThan(0.5);
    expect(computeLawfulness(crim, WS_EMPTY)).toBeLessThan(0.5);
    expect(computeMalice(crim, WS_EMPTY)).toBeGreaterThan(0.5);
    expect(computeMalice(gov, WS_EMPTY)).toBe(0.5); // form alone is not evil
  });

  test('publicLegitimacy: legitimacy above/below 50 moves lawfulness up/down; ABSENT record moves nothing', () => {
    const high = item('s', { legitimacy: 90 });
    const low = item('s', { legitimacy: 10 });
    expect(computeLawfulness(high, WS_EMPTY)).toBeGreaterThan(0.5);
    expect(computeLawfulness(low, WS_EMPTY)).toBeLessThan(0.5);
    expect(computeLawfulness(noSignal(), WS_EMPTY)).toBe(0.5); // present:false ⇒ no phantom signal
    // A legacy bare-number legitimacy still reads (the governanceLedger contract).
    const legacy = { id: 's', settlement: { powerStructure: { publicLegitimacy: 88 } } };
    expect(computeLawfulness(legacy, WS_EMPTY)).toBeGreaterThan(0.5);
  });

  test('authored conscience: TRAIT_ALIGNMENT moves malice; the RNG-rolled npcStates.alignment NEVER does', () => {
    const kind = item('s', { npcs: [{ name: 'Elder', importance: 'pillar', personality: { dominant: 'compassionate', flaw: 'honest', modifier: 'idealistic' } }] });
    const cruel = item('s', { npcs: [{ name: 'Boss', importance: 'pillar', personality: { dominant: 'cruel', flaw: 'deceitful', modifier: 'cynical' } }] });
    expect(computeMalice(kind, WS_EMPTY)).toBeLessThan(0.5);
    expect(computeMalice(cruel, WS_EMPTY)).toBeGreaterThan(0.5);

    // OQ13: npcStates.alignment (write-only, RNG-rolled) is invisible to the read.
    const wsRolled = { ...WS_EMPTY, npcStates: { 'npc.s.0': { npcId: 'npc.s.0', settlementId: 's', alignment: 'corrupted_cruel_tyrant' } } };
    expect(computeMalice(kind, wsRolled)).toBe(computeMalice(kind, WS_EMPTY));
    expect(computeLawfulness(kind, wsRolled)).toBe(computeLawfulness(kind, WS_EMPTY));
  });

  test('recent acts: war_exhaustion and held occupations raise malice; being OCCUPIED drags lawfulness', () => {
    const s = () => item('s');
    const scarred = { dispositionStats: {}, warExhaustion: { s: 0.8 } };
    const conqueror = { dispositionStats: {}, occupations: { other: { occupierId: 's' } } };
    const occupied = { dispositionStats: {}, occupations: { s: { occupierId: 'other' } } };

    expect(computeMalice(s(), scarred)).toBeGreaterThan(computeMalice(s(), WS_EMPTY));
    expect(computeMalice(s(), conqueror)).toBeGreaterThan(computeMalice(s(), WS_EMPTY));
    expect(computeLawfulness(s(), occupied)).toBeLessThan(computeLawfulness(s(), WS_EMPTY));
    // Being occupied is a LAW signal, not a malice signal — the victim is not
    // made evil by its conqueror.
    expect(computeMalice(s(), occupied)).toBe(computeMalice(s(), WS_EMPTY));
    // And HOLDING an occupation does not raise the holder's lawfulness reading.
    expect(computeLawfulness(s(), conqueror)).toBe(computeLawfulness(s(), WS_EMPTY));
  });

  test('the tuning surface is exported and frozen (the wave-A widening reads it)', () => {
    expect(Object.isFrozen(ALIGNMENT_TUNING)).toBe(true);
    expect(ALIGNMENT_TUNING.W_LAW_GOV).toBeGreaterThan(0);
    expect(ALIGNMENT_TUNING.W_MAL_CONSCIENCE).toBeGreaterThan(0);
  });
});
