import { describe, expect, test } from 'vitest';

import {
  createDefaultWorldState,
  ensureWorldState,
  runWorldStateMigrations,
  WORLD_STATE_SCHEMA_VERSION,
} from '../../src/domain/worldPulse/worldState.js';

// F0 STRUCTURAL ORACLE (persistence seam): pins that ensureWorldState is a SAFE,
// IDEMPOTENT, NON-ALIASING normalizer — the property the whole save/load pipeline
// leans on. This file is the tripwire for two not-yet-built phases:
//
//   * F1 will add additive worldState ledgers (dispositionStats:{}, deployments:{})
//     and R4 a conditional `pantheon`. Those ledgers ride through persistence ONLY
//     because ensureWorldState spreads `...cloneObject(raw)` BEFORE re-applying the
//     known keys, so any unknown key survives a round-trip untouched. The moment a
//     future refactor turns ensureWorldState into a strict allow-list, those ledgers
//     would be silently dropped on the next save — and these tests would catch it.
//   * The "dormant-until-deity" religion layer requires a campaign with NO deity to
//     stay byte-identical after empty ledgers are introduced. Idempotency +
//     unknown-key preservation here are the structural prerequisites for that.
//
// We pin CURRENT behavior against UNMODIFIED source. In particular we pin ONLY the
// top-level non-aliasing that cloneArray/cloneObject (SHALLOW copies) actually give
// today; deep non-aliasing is a KNOWN limitation that F1's deepClone will close, so
// we deliberately do NOT assert it (see the NON-ALIASING test).

const CAMPAIGN = { id: 'persist-pin', name: 'Persist Pin' };

// A documented "hot" raw: populated stressors + a custom rngSeed + future ledgers.
// Used as the anti-vacuity fixture — if normalization ever flattens these, the
// round-trip assertion below changes and the test fails loudly.
function hotRaw() {
  return {
    schemaVersion: WORLD_STATE_SCHEMA_VERSION,
    rngSeed: 'custom-seed:dormant-deity',
    tick: 7,
    calendar: { elapsedMonths: 6, month: 7, year: 1, season: 'autumn' },
    volatility: 'turbulent',
    stressors: [
      { id: 'world_stressor.famine.a', type: 'famine', severity: 0.72, age: 2, affectedSettlementIds: ['a'] },
      { id: 'world_stressor.market_shock.b', type: 'market_shock', severity: 0.5, age: 1, affectedSettlementIds: ['b'] },
    ],
    relationshipStates: { 'edge.a.b': { label: 'rival', score: 12 } },
    proposals: [{ id: 'world_proposal.x', status: 'pending' }],
    // Future additive ledgers (F1/R4) — must survive untouched.
    dispositionStats: { 'edge.a.b': { trust: -3 } },
    deployments: { 'a->b': { troops: 40 } },
    pantheon: { patron: null },
  };
}

describe('worldState ledger persistence — ensureWorldState normalize/round-trip', () => {
  // INVARIANT 1: a save round-trip is stable — re-normalizing a normalized state
  // is a no-op. If this drifts, every persisted campaign mutates on each load.
  test('ensureWorldState is idempotent across empty / partial / full / legacy-keyless raws', () => {
    const raws = {
      empty: {},
      partial: { tick: 4, calendar: { month: 5 }, rngSeed: 'partial-seed' },
      full: hotRaw(),
      // legacy-keyless: an old save that stored elapsedMonths at the TOP level and
      // had no calendar object — exercises the finite(raw?.elapsedMonths) fallback.
      legacyKeyless: { elapsedMonths: 9, volatility: 'calm', stressors: [] },
    };

    for (const [label, raw] of Object.entries(raws)) {
      const once = ensureWorldState(raw, CAMPAIGN);
      const twice = ensureWorldState(once, CAMPAIGN);
      expect(twice, `idempotency failed for raw: ${label}`).toEqual(once);
    }

    // Anti-vacuity: the legacy-keyless top-level elapsedMonths must actually be
    // lifted into the calendar (proves the fallback path was exercised, not skipped).
    const legacy = ensureWorldState(raws.legacyKeyless, CAMPAIGN);
    expect(legacy.calendar.elapsedMonths).toBe(9);
  });

  // INVARIANT 2: documented default shape for an empty raw.
  test('ensureWorldState({}) yields the schema-versioned default shape', () => {
    const out = ensureWorldState({}, CAMPAIGN);

    expect(out.schemaVersion).toBe(WORLD_STATE_SCHEMA_VERSION);
    expect(out.canonizedAt).toBeNull();
    expect(out.tick).toBe(0);
    expect(out.calendar).toEqual({
      elapsedMonths: 0,
      month: 1,
      year: 1,
      season: 'spring',
    });
    expect(out.volatility).toBe('normal');
    // Empty collections — the documented "nothing has happened yet" baseline.
    expect(out.stressors).toEqual([]);
    expect(out.relationshipStates).toEqual({});
    expect(out.npcStates).toEqual({});
    expect(out.factionStates).toEqual({});
    expect(out.proposals).toEqual([]);
    expect(out.pulseHistory).toEqual([]);
    expect(out.settlementTickStates).toEqual({});
    expect(out.pendingEvents).toEqual([]);

    // The default carries a fully-normalized simulationRules (anti-vacuity: a real
    // object with a named preset, not an empty stub).
    expect(out.simulationRules).toBeTypeOf('object');
    expect(out.simulationRules.schemaVersion).toBeTypeOf('number');
    expect(out.simulationRules.presetId).toBe(createDefaultWorldState(CAMPAIGN).simulationRules.presetId);
  });

  // INVARIANT 3: forward-compat — unknown keys survive via `...cloneObject(raw)`.
  // This is the LOAD-BEARING guarantee for F1/R4 ledgers: ensureWorldState must NOT
  // strip keys it doesn't recognize, or future additive ledgers silently vanish on
  // the first save after this code runs.
  test('unknown future-ledger keys (dispositionStats/deployments/pantheon) survive normalization', () => {
    const minimal = { tick: 1 };
    const out = ensureWorldState(
      { ...minimal, dispositionStats: { x: 1 }, deployments: {}, pantheon: { patron: 'forgotten' } },
      CAMPAIGN,
    );

    expect(out.dispositionStats).toEqual({ x: 1 });
    expect(out.deployments).toEqual({});
    expect(out.pantheon).toEqual({ patron: 'forgotten' });

    // Anti-vacuity: prove the spread also kept a known field, AND that an absent
    // ledger is NOT fabricated (the default shape adds no `pantheon`).
    expect(out.tick).toBe(1);
    expect(ensureWorldState({}, CAMPAIGN)).not.toHaveProperty('pantheon');
  });

  // INVARIANT 4: TOP-LEVEL non-aliasing for the KNOWN collections. cloneArray/
  // cloneObject are SHALLOW, so mutating the returned known collections (push/assign
  // at the top level) must NOT reach back into the input raw. Deep (nested-object)
  // non-aliasing is a KNOWN shallow-clone limitation — F1's deepClone closes it. We
  // deliberately pin ONLY the top-level guarantee here; asserting deep non-aliasing
  // now would FAIL against unmodified code, which is F1's job to make true, not F0's.
  test('mutating returned known collections does not mutate the input raw (top-level)', () => {
    const raw = hotRaw();
    const out = ensureWorldState(raw, CAMPAIGN);

    out.stressors.push({ id: 'world_stressor.injected' });
    out.proposals.push({ id: 'world_proposal.injected' });
    out.relationshipStates['edge.injected'] = { label: 'ally' };

    // Input raw's KNOWN collections are untouched at the top level — these pass
    // through cloneArray/cloneObject, so the returned containers are fresh.
    expect(raw.stressors).toHaveLength(2);
    expect(raw.proposals).toHaveLength(1);
    expect(Object.keys(raw.relationshipStates)).toEqual(['edge.a.b']);

    // The known array's elements are fresh top-level objects, not shared references.
    expect(out.stressors[0]).not.toBe(raw.stressors[0]);
    expect(out.relationshipStates).not.toBe(raw.relationshipStates);
    expect(out.stressors).not.toBe(raw.stressors);
  });

  // INVARIANT 4b (F1 + R4 LANDED): dispositionStats and deployments are DEEP-cloned
  // in ensureWorldState (not the shallow `...cloneObject(raw)` spread), so the
  // returned ledgers are FRESH structures — mutating them never bleeds into raw,
  // and a pre-tick snapshot can no longer alias live ledger state across ticks.
  // This is the intentional flip of the former shallow-aliasing gap. R4 extends the
  // SAME guarantee to `pantheon`: a PRESENT, non-empty pantheon is now deep-cloned
  // (conditionally materialized), so it likewise no longer aliases — the flip the
  // F1 test pinned as a visible follow-on is realized here.
  test('dispositionStats/deployments AND a present pantheon are deep-cloned (non-aliasing)', () => {
    const raw = hotRaw();
    const out = ensureWorldState(raw, CAMPAIGN);

    // F1: the additive ledgers are fresh top-level structures, deeply cloned.
    expect(out.dispositionStats).not.toBe(raw.dispositionStats);
    expect(out.deployments).not.toBe(raw.deployments);
    expect(out.dispositionStats['edge.a.b']).not.toBe(raw.dispositionStats['edge.a.b']);

    // Values are preserved (deep-equal) — only identity differs.
    expect(out.dispositionStats).toEqual(raw.dispositionStats);
    expect(out.deployments).toEqual(raw.deployments);

    // Mutating the returned ledger does NOT bleed into raw (the bug F1 closed).
    out.dispositionStats['edge.injected'] = { trust: 99 };
    expect(Object.keys(raw.dispositionStats)).toEqual(['edge.a.b']);

    // R4: a PRESENT, non-empty `pantheon` is now DEEP-cloned too (no longer the F1
    // shallow alias) — values preserved, identity fresh, mutation isolated.
    expect(out.pantheon).not.toBe(raw.pantheon);
    expect(out.pantheon).toEqual(raw.pantheon);
    out.pantheon.injected = { seats: 99 };
    expect(Object.prototype.hasOwnProperty.call(raw.pantheon, 'injected')).toBe(false);
  });

  // INVARIANT 6 (F1): the worldState migration chain exists and is an IDENTITY
  // no-op today — additive ledgers need no migration (an absent key normalizes to
  // its empty default). ensureWorldState routes rawInput through it before the
  // spread, so the first future BREAKING shape registers a visible, ordered step
  // rather than an ad-hoc inline coercion.
  test('runWorldStateMigrations is an identity no-op today (chain empty)', () => {
    const raw = hotRaw();
    expect(runWorldStateMigrations(raw)).toEqual(raw);
    // Defensive: non-object input yields an empty base, never throws.
    expect(runWorldStateMigrations(null)).toEqual({});
    expect(runWorldStateMigrations(undefined)).toEqual({});
  });

  // INVARIANT 5: clamping/fallback rules.
  test('clamps negative tick, sub-1 month, and bogus volatility; season preserved-or-defaulted', () => {
    const out = ensureWorldState(
      { tick: -5, calendar: { month: -3, year: 0, elapsedMonths: -2, season: 'harvest_moon' }, volatility: 'bananas' },
      CAMPAIGN,
    );

    expect(out.tick).toBe(0);
    expect(out.calendar.month).toBe(1);
    expect(out.calendar.year).toBe(1);
    expect(out.calendar.elapsedMonths).toBe(0);
    expect(out.volatility).toBe('normal');
    // Unknown-but-truthy season is PRESERVED (the code only falls back on falsy).
    expect(out.calendar.season).toBe('harvest_moon');

    // Falsy season DOES fall back to the seeded default.
    const emptySeason = ensureWorldState({ calendar: { season: '' } }, CAMPAIGN);
    expect(emptySeason.calendar.season).toBe('spring');

    // A valid volatility is kept as-is (anti-vacuity for the allow-list branch).
    expect(ensureWorldState({ volatility: 'calm' }, CAMPAIGN).volatility).toBe('calm');
  });

  // ANTI-VACUITY round-trip: a populated stressors array + custom rngSeed survive a
  // save/load (normalize) cycle UNCHANGED. This is the concrete "hot fixture rides
  // through persistence intact" pin the future ledgers depend on.
  test('populated stressors and custom rngSeed survive the round-trip unchanged', () => {
    const raw = hotRaw();
    const out = ensureWorldState(raw, CAMPAIGN);

    expect(out.rngSeed).toBe('custom-seed:dormant-deity');
    expect(out.stressors).toEqual(raw.stressors);
    expect(out.stressors).toHaveLength(2);
    // Custom seed is NOT clobbered by the campaign-derived default seed.
    expect(out.rngSeed).not.toBe(createDefaultWorldState(CAMPAIGN).rngSeed);

    // The whole hot state is byte-stable across a second normalize pass.
    expect(ensureWorldState(out, CAMPAIGN)).toEqual(out);
  });
});
