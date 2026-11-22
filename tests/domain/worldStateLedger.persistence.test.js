import { describe, expect, test } from 'vitest';
import { readFileSync } from 'node:fs';

import {
  createDefaultWorldState,
  ensureWorldState,
  INTERVAL_WEEKS,
  runWorldStateMigrations,
  WORLD_STATE_SCHEMA_VERSION,
} from '../../src/domain/worldPulse/worldState.js';
import { INTERVAL_WEEKS as INTERVAL_WEEKS_LEAF } from '../../src/domain/worldPulse/intervalWeeks.js';
import {
  CURRENT_TREATY_TICKS_PER_YEAR,
  LEGACY_TREATY_TICKS_PER_YEAR,
  migrateTreatyClockMarkers,
  treatyTicksPerYearOf,
} from '../../src/domain/worldPulse/treatyClock.js';

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
    // 4-4-5 back-compat: the canonical integer weeks derive from the SAME
    // lifted months (legacy writers accumulated 0.25/week ⇒ 9 months = 36
    // weeks) — never 0-reset beside a non-zero months field.
    expect(legacy.calendar.elapsedWeeks).toBe(36);
  });

  // INVARIANT 2: documented default shape for an empty raw.
  test('ensureWorldState({}) yields the schema-versioned default shape', () => {
    const out = ensureWorldState({}, CAMPAIGN);

    expect(out.schemaVersion).toBe(WORLD_STATE_SCHEMA_VERSION);
    expect(out.canonizedAt).toBeNull();
    expect(out.tick).toBe(0);
    expect(out.calendar).toEqual({
      elapsedWeeks: 0,
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

  // INVARIANT 3b (Advance-scaling Stage 3): pausedAdvance is a CONDITIONAL ledger —
  // it round-trips a paused cursor untouched (deep-cloned), and CLEARS to byte-neutral
  // (absent) when null/empty, so a dormant campaign serializes identically to today.
  test('pausedAdvance round-trips when present and is ABSENT (byte-neutral) when cleared', () => {
    const cursor = {
      interval: 'one_year', ticksTotal: 48, ticksDone: 5, atTick: 5, resumeTick: 4,
      autoResolve: false, startedAt: '2026-06-01T00:00:00.000Z',
      pendingMajors: [{ id: 'world_outcome.gov.x.5', candidateType: 'faction_government_challenge' }],
      preSnapshot: { worldState: { tick: 4 }, saves: [{ id: 'a' }] },
    };
    const out = ensureWorldState({ tick: 5, pausedAdvance: cursor }, CAMPAIGN);
    expect(out.pausedAdvance).toEqual(cursor);
    // Deep-cloned: mutating the result never bleeds into the input cursor.
    expect(out.pausedAdvance).not.toBe(cursor);
    out.pausedAdvance.ticksDone = 99;
    expect(cursor.ticksDone).toBe(5);

    // DORMANCY / byte-neutral: a campaign with NO paused advance carries NO key.
    expect(ensureWorldState({}, CAMPAIGN)).not.toHaveProperty('pausedAdvance');
    // Clearing the pause (null) ⇒ the key is OMITTED, not carried as null.
    expect(ensureWorldState({ tick: 5, pausedAdvance: null }, CAMPAIGN)).not.toHaveProperty('pausedAdvance');
    // An empty-object pause likewise normalizes to absent (treated as no pause).
    expect(ensureWorldState({ tick: 5, pausedAdvance: {} }, CAMPAIGN)).not.toHaveProperty('pausedAdvance');

    // Idempotent across the round-trip: re-normalizing keeps the cursor stable.
    const once = ensureWorldState({ tick: 5, pausedAdvance: cursor }, CAMPAIGN);
    expect(ensureWorldState(once, CAMPAIGN)).toEqual(once);
  });

  // INVARIANT 3c (lifecycle-2): factionPairStates is a CONDITIONAL ledger — the D-7c
  // faction-pair trust/resentment ledger (memoryWeave). It must round-trip a populated
  // ledger DEEP-cloned (so an apply→undo restore never aliases live state across ticks),
  // and CLEAR to byte-neutral (absent) when empty — the politicsLedgers/narrativeTempo
  // property. Before it was added to CONDITIONAL_LEDGER_KEYS an empty {} SURVIVED (it
  // rode the shallow spread), breaking dormancy byte-identity.
  test('factionPairStates round-trips deep-cloned and is ABSENT (byte-neutral) when empty', () => {
    const pairs = { 'pair.a.b': { trust: 3, resentment: 1, sinceTick: 4 } };
    const out = ensureWorldState({ tick: 5, factionPairStates: pairs }, CAMPAIGN);
    expect(out.factionPairStates).toEqual(pairs);
    // Deep-cloned: mutating the result never bleeds into the input ledger.
    expect(out.factionPairStates).not.toBe(pairs);
    out.factionPairStates['pair.a.b'].trust = 99;
    expect(pairs['pair.a.b'].trust).toBe(3);

    // DORMANCY / byte-neutral: no faction-pair state ⇒ no key; an empty {} normalizes
    // to absent (parity with politicsLedgers), never carried as an empty object.
    expect(ensureWorldState({}, CAMPAIGN)).not.toHaveProperty('factionPairStates');
    expect(ensureWorldState({ tick: 5, factionPairStates: {} }, CAMPAIGN)).not.toHaveProperty('factionPairStates');

    // Idempotent apply→undo round-trip: re-normalizing a normalized state is byte-exact
    // (the wholesale preWorldState restore leans on this).
    const once = ensureWorldState({ tick: 5, factionPairStates: pairs }, CAMPAIGN);
    expect(ensureWorldState(once, CAMPAIGN)).toEqual(once);
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

  // WR-1: deployment casus is imported through the CLOSED reason taxonomy. The
  // normalizer keeps every other deployment field, orders attacker keys
  // deterministically, and removes an exhausted/invalid optional list rather than
  // persisting an empty artifact. This is a same-schema tolerant read.
  test('deployment casus reasons round-trip cloned, ordered, taxonomy-filtered, and empty-free', () => {
    const deployments = {
      'z-front': {
        targetId: 'b',
        deployedPopulation: 44,
        auxiliary: { cohort: 'oak' },
        attackerPatronRef: 'deity.attacker',
        defenderPatronRef: 'deity.defender',
        casusReasons: [
          {
            type: 'sacred_claim',
            score: 0.8,
            receipt: 'The rival altar stands against ours.',
            atTick: 17,
          },
          { type: 'invented_claim', score: 1, receipt: { reason: 'not in the catalog' } },
        ],
      },
      'a-front': {
        targetId: 'z',
        role: 'siege',
        casusReasons: [{ type: 'fabricated_reason', receipt: { reason: 'drop me' } }],
      },
      'middle-front': { targetId: 'a', role: 'relief', callerOwnedField: { keep: true } },
    };

    const out = ensureWorldState({ deployments }, CAMPAIGN);
    expect(Object.keys(out.deployments)).toEqual(['a-front', 'middle-front', 'z-front']);
    expect(out.deployments['a-front']).toEqual({ targetId: 'z', role: 'siege' });
    expect(out.deployments['middle-front']).toEqual(deployments['middle-front']);
    expect(out.deployments['z-front'].casusReasons).toEqual([
      deployments['z-front'].casusReasons[0],
    ]);
    expect(out.deployments['z-front'].deployedPopulation).toBe(44);
    expect(out.deployments['z-front']).toMatchObject({
      attackerPatronRef: 'deity.attacker',
      defenderPatronRef: 'deity.defender',
    });
    expect(out.deployments['z-front'].auxiliary).toEqual({ cohort: 'oak' });

    // Deep clone, including the retained casus record and unknown auxiliary field:
    // persistence never hands a caller aliases into the loaded save.
    expect(out.deployments).not.toBe(deployments);
    expect(out.deployments['z-front'].casusReasons[0])
      .not.toBe(deployments['z-front'].casusReasons[0]);
    expect(out.deployments['z-front'].auxiliary).not.toBe(deployments['z-front'].auxiliary);

    const reloaded = ensureWorldState(JSON.parse(JSON.stringify(out)), CAMPAIGN);
    expect(reloaded).toEqual(out);
    expect(reloaded.schemaVersion).toBe(WORLD_STATE_SCHEMA_VERSION);
  });

  // INVARIANT 6 (F1): additive ledgers still need no top-level migration. The
  // same-schema treaty-clock migration is an IDENTITY no-op while that nested
  // ledger is absent, so ordinary and dormant saves retain their object identity.
  test('runWorldStateMigrations is an identity no-op when no treaty ledger exists', () => {
    const raw = hotRaw();
    expect(runWorldStateMigrations(raw)).toBe(raw);
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
    expect(out.calendar.elapsedWeeks).toBe(0);
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

  // MIGRATION v2: the pantheon renamed its leading deity "chief" → "patron". A
  // persisted religionStates entry carrying chiefRef/chiefHeld/chiefChallengeTicks
  // is renamed in place; an already-migrated (or deity-free) state is untouched.
  test('worldState v2 migration renames religionStates chiefRef → patronRef (idempotent)', () => {
    const legacy = {
      tick: 3,
      religionStates: {
        a: { deities: { x: { share: 100 } }, chiefRef: 'x', chiefHeld: 0, chiefChallengeTicks: 2, contestedTicks: 1, capacity: 3 },
      },
    };
    const out = runWorldStateMigrations(legacy);
    expect(out.religionStates.a.patronRef).toBe('x');
    expect(out.religionStates.a.patronChallengeTicks).toBe(2);
    expect(out.religionStates.a).not.toHaveProperty('chiefRef');
    expect(out.religionStates.a.contestedTicks).toBe(1);   // unrelated keys preserved
    expect(out.schemaVersion).toBe(2);

    // Idempotent: re-running on already-patron state is a no-op (no chief keys to map).
    expect(runWorldStateMigrations(out)).toEqual(out);
    // Deity-free / no religionStates → passes straight through.
    const bare = { tick: 1 };
    expect(runWorldStateMigrations(bare)).toBe(bare);
  });

  // WR-0c(4): a treaty's duration horizons must keep the clock under which they
  // were minted. Existing unmarked records are historical twelve-tick treaties;
  // current records explicitly carry the engine's fifty-two-week year. This is
  // intentionally a NESTED, SAME-VERSION migration: worldState stays schema v2.
  test('same-version treaty-clock migration stamps only unmarked/invalid persisted treaties', () => {
    const unmarked = {
      parties: ['a', 'b'],
      victorId: 'a',
      loserId: 'b',
      mintedTick: 11,
      paidInstallments: 7,
      missedInstallments: 2,
      terms: [
        { type: 'tribute', expiresTick: 131, nextDueTick: 23, paidCount: 7 },
        { type: 'non_aggression', expiresTick: 251 },
      ],
      complianceState: 'defaulted',
      repudiatedTick: 19,
      breachTick: 19,
      breachExpiresTick: 251,
      receipts: ['kept byte-for-byte'],
    };
    const markedLegacy = {
      parties: ['c', 'd'],
      treatyTicksPerYear: LEGACY_TREATY_TICKS_PER_YEAR,
      paidInstallments: 3,
      terms: [{ type: 'resource_share', expiresTick: 91, nextDueTick: 31 }],
      breachExpiresTick: 91,
    };
    const markedCurrent = {
      parties: ['e', 'f'],
      treatyTicksPerYear: CURRENT_TREATY_TICKS_PER_YEAR,
      paidInstallments: 9,
      terms: [{ type: 'demilitarization', expiresTick: 587 }],
    };
    const invalidMarker = {
      parties: ['g', 'h'],
      treatyTicksPerYear: 0,
      missedInstallments: 4,
      terms: [{ type: 'tribute', expiresTick: 77, nextDueTick: 65 }],
      repudiatedTick: 52,
      breachExpiresTick: 77,
    };
    const raw = {
      schemaVersion: WORLD_STATE_SCHEMA_VERSION,
      tick: 63,
      spatialLedgers: {
        unrelated: { untouched: true },
        treaties: {
          'a>b': unmarked,
          'c>d': markedLegacy,
          'e>f': markedCurrent,
          'g>h': invalidMarker,
        },
      },
    };
    const rawBytes = JSON.stringify(raw);

    const out = runWorldStateMigrations(raw);

    expect(out).not.toBe(raw);
    expect(out.schemaVersion).toBe(2);
    expect(WORLD_STATE_SCHEMA_VERSION).toBe(2);
    expect(out.spatialLedgers.treaties['a>b']).toEqual({
      ...unmarked,
      treatyTicksPerYear: LEGACY_TREATY_TICKS_PER_YEAR,
    });
    expect(out.spatialLedgers.treaties['g>h']).toEqual({
      ...invalidMarker,
      treatyTicksPerYear: LEGACY_TREATY_TICKS_PER_YEAR,
    });

    // Marked records are exact identity no-ops even inside a mixed ledger.
    expect(out.spatialLedgers.treaties['c>d']).toBe(markedLegacy);
    expect(out.spatialLedgers.treaties['e>f']).toBe(markedCurrent);
    // Unrelated ancestors and nested values keep their identities and values.
    expect(out.spatialLedgers.unrelated).toBe(raw.spatialLedgers.unrelated);
    expect(out.spatialLedgers.treaties['a>b'].terms).toBe(unmarked.terms);

    // Counters and every previously-authored expiry / repudiation / breach
    // horizon are facts, not values to scale during marker migration.
    expect(out.spatialLedgers.treaties['a>b']).toMatchObject({
      paidInstallments: 7,
      missedInstallments: 2,
      repudiatedTick: 19,
      breachTick: 19,
      breachExpiresTick: 251,
    });
    expect(out.spatialLedgers.treaties['a>b'].terms).toEqual(unmarked.terms);
    expect(out.spatialLedgers.treaties['g>h']).toMatchObject({
      missedInstallments: 4,
      repudiatedTick: 52,
      breachExpiresTick: 77,
    });
    expect(out.spatialLedgers.treaties['g>h'].terms).toEqual(invalidMarker.terms);

    // The source graph is untouched, including the invalid marker being repaired.
    expect(JSON.stringify(raw)).toBe(rawBytes);
    expect(unmarked).not.toHaveProperty('treatyTicksPerYear'); // anchored: raw bytes above and the migrated marker pin prove source omission
    expect(invalidMarker.treatyTicksPerYear).toBe(0);

    // Apart from the marker itself, serialization of each migrated record is
    // byte-for-byte unchanged (key order included).
    const { treatyTicksPerYear: added, ...unmarkedRest } = out.spatialLedgers.treaties['a>b'];
    expect(added).toBe(LEGACY_TREATY_TICKS_PER_YEAR);
    expect(JSON.stringify(unmarkedRest)).toBe(JSON.stringify(unmarked));
    const { treatyTicksPerYear: repaired, ...invalidRest } = out.spatialLedgers.treaties['g>h'];
    const { treatyTicksPerYear: ignored, ...originalInvalidRest } = invalidMarker;
    expect(repaired).toBe(LEGACY_TREATY_TICKS_PER_YEAR);
    expect(ignored).toBe(0);
    expect(JSON.stringify(invalidRest)).toBe(JSON.stringify(originalInvalidRest));
  });

  test('treaty clock survives JSON reload and reaches an identity fixed point', () => {
    const raw = {
      schemaVersion: 2,
      spatialLedgers: {
        treaties: {
          'old>realm': {
            counter: 6,
            terms: [{ type: 'tribute', expiresTick: 144, nextDueTick: 36 }],
            breachExpiresTick: 144,
          },
          'new>realm': {
            treatyTicksPerYear: CURRENT_TREATY_TICKS_PER_YEAR,
            counter: 2,
            terms: [{ type: 'tribute', expiresTick: 624, nextDueTick: 104 }],
          },
        },
      },
    };

    const loaded = JSON.parse(JSON.stringify(raw));
    const once = runWorldStateMigrations(loaded);
    const reloaded = JSON.parse(JSON.stringify(once));
    const twice = runWorldStateMigrations(reloaded);

    expect(twice).toBe(reloaded);
    expect(JSON.stringify(twice)).toBe(JSON.stringify(once));
    expect(twice.spatialLedgers.treaties['old>realm'].treatyTicksPerYear).toBe(12);
    expect(twice.spatialLedgers.treaties['old>realm'].terms[0]).toEqual({
      type: 'tribute', expiresTick: 144, nextDueTick: 36,
    });
    expect(twice.spatialLedgers.treaties['new>realm'].treatyTicksPerYear).toBe(52);
  });

  test('treaty clock constants and marker reader share the canonical interval leaf', () => {
    expect(INTERVAL_WEEKS).toBe(INTERVAL_WEEKS_LEAF);
    expect(CURRENT_TREATY_TICKS_PER_YEAR).toBe(INTERVAL_WEEKS.one_year);
    expect(LEGACY_TREATY_TICKS_PER_YEAR).toBe(12);
    expect(treatyTicksPerYearOf(undefined)).toBe(12);
    expect(treatyTicksPerYearOf({})).toBe(12);
    expect(treatyTicksPerYearOf({ treatyTicksPerYear: null })).toBe(12);
    expect(treatyTicksPerYearOf({ treatyTicksPerYear: 0 })).toBe(12);
    expect(treatyTicksPerYearOf({ treatyTicksPerYear: 12.5 })).toBe(12);
    expect(treatyTicksPerYearOf({ treatyTicksPerYear: '52' })).toBe(12);
    expect(treatyTicksPerYearOf({ treatyTicksPerYear: 52 })).toBe(52);
    expect(treatyTicksPerYearOf({ treatyTicksPerYear: 104 })).toBe(104);
  });

  test('treaty migration is an identity no-op for marked and treaty-free states', () => {
    const states = [
      { schemaVersion: 2, tick: 1 },
      { schemaVersion: 2, spatialLedgers: {} },
      { schemaVersion: 2, spatialLedgers: { treaties: {} } },
      {
        schemaVersion: 2,
        spatialLedgers: {
          treaties: {
            'a>b': { treatyTicksPerYear: 12, terms: [] },
            'c>d': { treatyTicksPerYear: 52, terms: [] },
          },
        },
      },
    ];
    for (const state of states) {
      expect(migrateTreatyClockMarkers(state)).toBe(state);
      expect(runWorldStateMigrations(state)).toBe(state);
    }
  });

  test('treatyClock remains a dependency-light leaf outside the peace/war graph', () => {
    const treatyClockSource = readFileSync(
      new URL('../../src/domain/worldPulse/treatyClock.js', import.meta.url),
      'utf8',
    );
    const intervalSource = readFileSync(
      new URL('../../src/domain/worldPulse/intervalWeeks.js', import.meta.url),
      'utf8',
    );
    const importsOf = (source) => [...source.matchAll(/\bfrom\s+['"]([^'"]+)['"]/g)].map((match) => match[1]);

    expect(importsOf(intervalSource)).toEqual([]);
    expect(importsOf(treatyClockSource)).toEqual(['./intervalWeeks.js']);
    expect(treatyClockSource).not.toMatch(/peaceTerms|warReasons|treatyEnforcement/); // anchored: exact one-import assertion above proves the leaf was scanned
    expect(treatyClockSource).not.toMatch(/pulseKernel|worldState|distanceRead|store|components|kernel\/math/); // anchored: exact one-import assertion above proves forbidden graph absence
  });
});
