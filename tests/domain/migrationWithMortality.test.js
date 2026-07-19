/**
 * migrationWithMortality.test.js — Phase 5.5 mover wave M4: MIGRATION-WITH-MORTALITY.
 *
 * The wave's binding proof (design §4c / §II.3-3 / §II.5-2):
 *   - THE CONSERVATION INVARIANT — Σarrivals + Σdeaths == Σdepartures, EXACT, over a
 *     multi-tick end-to-end dispatch→release loop;
 *   - carrying-capacity tolerance raises origin survival (context-dependent);
 *   - the 4-axis destination weighting + PRNG scatter is deterministic;
 *   - cultureDistance is a deterministic composite AND a LIVE read (never the digest);
 *   - road-death scales with embattlement × season and is BOUNDED (never annihilates);
 *   - the origin-loss proxy is reconciled — no double-count (origin sheds `abs` once);
 *   - congestion pushback prevents a megacity (a hub's pull decays as it fills);
 *   - the scatter-floor forbids the 'concentrated' mode under spatial;
 *   - a multi-year war+famine REGIONAL soak: no megacity / no chain-collapse / no
 *     annihilation / a stable bounded attractor;
 *   - DORMANT (no marker) ⇒ byte-identical (no ledger, no deaths);
 *   - mortality is AGGREGATE-ONLY — a named NPC survives a mortality tick untouched.
 */
import { describe, expect, it } from 'vitest';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';
import { createPRNG } from '../../src/kernel/prng.js';
import {
  planMigration, assertMigrationConservation, carryingCapacityTolerance, originDeathRate,
  roadDeathRate, destinationScore, splitTravellers, enqueueColumns, releaseArrivals,
  migrationActive, MIGRATION_TUNING, SPATIAL_DISTRIBUTION_MODE, FORBIDDEN_DISTRIBUTION_MODE,
} from '../../src/domain/spatial/migration.js';
import { cultureDistance, cultureAffinity, regimeAxes, CULTURE_TUNING, traditionKinship01 } from '../../src/domain/spatial/cultureDistance.js';
import {
  buildCultureVector, dispatchMigrations, releaseMigrationArrivals, originTolerance,
  collectRealizedEmigrationEvents,
} from '../../src/domain/worldPulse/migrationKernel.js';

// ── Fixtures ──────────────────────────────────────────────────────────────────
function digest8() {
  const pack = makeGridPack({ cols: 24, rows: 18 });
  return buildSpatialDigest({ pack, placements: placeSettlements(pack, 8) });
}

/** A minimal snapshot settlement item on a digest id. */
function makeItem(id, { population = 1200, economic = 50, governingName = '', deity = null, storageMonths = 0, tradeConn = null } = {}) {
  return {
    id,
    name: `Town ${id}`,
    settlement: {
      population,
      config: { primaryDeitySnapshot: deity },
      economicState: { prosperity: { tier: 'developing' }, foodSecurity: { storageMonths } },
      powerStructure: { governingName, factions: [] },
    },
    causal: { scores: { economic_capacity: economic, ...(tradeConn == null ? {} : { trade_connectivity: tradeConn }) } },
  };
}

/** A pressure index whose per-(id,kind) score comes from a plain map. */
function makePIndex(map = {}) {
  return { get: (id, kind) => ({ score: (map[`${id}:${kind}`] ?? 0) }) };
}

function baseWorld(digest) {
  return { spatialCanonVersion: 1, spatialDigest: digest, tick: 0 };
}

// ── REALIZED-DEBIT RECONCILIATION: the shed pool releases only when debited ──
describe('M4 — realized-debit reconciliation: proposal-mode emigration must not mint', () => {
  const emig = (id, loss, applyMode) => ({
    candidateType: 'population_emigration',
    targetSaveId: id,
    applyMode,
    metadata: { spatialEmigration: { loss } },
  });

  it('an AUTO-mode emigration flows through (byte-identical to the pre-guard loop)', () => {
    // undefined applyMode (the common case) and explicit 'auto' both pass through.
    const events = collectRealizedEmigrationEvents([emig('s001', 400, undefined), emig('s002', 250, 'auto')]);
    expect(events).toEqual([{ originId: 's001', loss: 400 }, { originId: 's002', loss: 250 }]);
  });

  it('a PROPOSAL-mode emigration is EXCLUDED — its origin was queued, not debited (no mint)', () => {
    // A major emigration under majorChangesRequireProposal is queued as a proposal:
    // applyWorldPulse.js `continue`s before the origin debit. Dispatching its loss would
    // MINT population at the destinations. The guard drops it from the dispatch set.
    // (This is the regression: without the `applyMode === 'proposal'` skip, the pre-guard
    // loop returned this event and the kernel dispatched 400 undebited survivors.)
    expect(collectRealizedEmigrationEvents([emig('s001', 400, 'proposal')])).toEqual([]);
  });

  it('mixes correctly: auto emigrations dispatch, the proposal one is held back', () => {
    const events = collectRealizedEmigrationEvents([
      emig('s001', 400, 'auto'),
      emig('s002', 900, 'proposal'), // queued — must NOT dispatch (would mint 900)
      emig('s003', 120, undefined),
    ]);
    expect(events).toEqual([{ originId: 's001', loss: 400 }, { originId: 's003', loss: 120 }]);
    // The proposal origin contributes ZERO to the dispatched loss — no minted survivors.
    expect(events.reduce((s, e) => s + e.loss, 0)).toBe(520);
  });

  it('ignores non-emigration outcomes and zero/absent/negative shed markers', () => {
    expect(collectRealizedEmigrationEvents([
      { candidateType: 'population_growth', targetSaveId: 's001', metadata: {} },
      emig('s002', 0, 'auto'),        // zero shed ⇒ nothing to dispatch
      { candidateType: 'population_emigration', targetSaveId: 's003' }, // no metadata
      { candidateType: 'population_emigration', targetSaveId: 's004', metadata: { spatialEmigration: { loss: -5 } } },
    ])).toEqual([]);
    expect(collectRealizedEmigrationEvents(null)).toEqual([]);
    expect(collectRealizedEmigrationEvents(undefined)).toEqual([]);
  });

  it('CONSERVATION when wired to dispatchMigrations: the proposal pool never departs', () => {
    // Wire the helper to dispatchMigrations exactly as the kernel does. The proposal
    // event (loss 500) is excluded; dispatched departures == the auto pool only, and the
    // proposal origin never appears in a receipt — so no undebited survivor is minted.
    const digest = digest8();
    const ids = digest.settlementIds;
    const snapshot = { settlements: ids.map((id) => makeItem(id, { population: 1000 })), regionalGraph: { edges: [] } };
    const worldState = baseWorld(digest);
    const outcomesToApply = [
      emig(ids[1], 300, 'auto'),
      emig(ids[2], 500, 'proposal'), // the leak: queued, origin not debited
    ];
    const events = collectRealizedEmigrationEvents(outcomesToApply);
    const dispatch = dispatchMigrations({ events, snapshot, pIndex: makePIndex(), digest, worldState, rng: createPRNG('rd'), season: 'summer', tick: 0 });
    const dispatchedDepartures = dispatch.receipts.reduce((s, r) => s + r.departures, 0);
    expect(dispatchedDepartures).toBe(300);               // ONLY the auto pool departed
    expect(dispatch.receipts.some((r) => r.originId === ids[2])).toBe(false); // proposal origin absent
  });
});

// ── DORMANCY ──────────────────────────────────────────────────────────────────
describe('M4 — DORMANCY: no marker ⇒ no-op, byte-identical', () => {
  it('migrationActive is false without the spatial-canon marker', () => {
    expect(migrationActive(null)).toBe(false);
    expect(migrationActive({})).toBe(false);
    expect(migrationActive({ spatialCanonVersion: 0 })).toBe(false);
    expect(migrationActive({ spatialCanonVersion: 1.5 })).toBe(false);
    expect(migrationActive({ spatialCanonVersion: 'x' })).toBe(false);
    expect(migrationActive({ spatialCanonVersion: 2 })).toBe(true);
  });

  it('dispatchMigrations + releaseMigrationArrivals are no-ops off the marker (no ledger key)', () => {
    const digest = digest8();
    const ws = { spatialDigest: digest, tick: 5 }; // NO spatialCanonVersion
    const snapshot = { settlements: [makeItem('s000'), makeItem('s001')], regionalGraph: { edges: [] } };
    const dispatch = dispatchMigrations({
      events: [{ originId: 's000', loss: 400 }], snapshot, pIndex: makePIndex(),
      digest, worldState: ws, rng: createPRNG('x'), season: null, tick: 5,
    });
    expect(dispatch.changed).toBe(false);
    expect(dispatch.worldState).toBe(ws);
    expect('spatialLedgers' in dispatch.worldState).toBe(false);

    const release = releaseMigrationArrivals({ worldState: ws, localSettlements: new Map(), settlements: snapshot.settlements, tick: 5 });
    expect(release.changed).toBe(false);
    expect(release.worldState).toBe(ws);
  });
});

// ── cultureDistance: composite determinism + LIVE read ───────────────────────
describe('M4 — cultureDistance composite', () => {
  const good = { faithEvil01: 0, faithChaos01: 0, lawfulness01: 0.9, malice01: 0.1, economy01: 0.8, archetype: 'government', governingName: 'Council of A' };
  const evil = { faithEvil01: 1, faithChaos01: 1, lawfulness01: 0.1, malice01: 0.9, economy01: 0.2, archetype: 'criminal', governingName: 'Syndicate of Z' };

  it('is in [0,1], symmetric, and self-distance is 0', () => {
    const d = cultureDistance(good, evil);
    expect(d).toBeGreaterThan(0);
    expect(d).toBeLessThanOrEqual(1);
    expect(cultureDistance(good, evil)).toBeCloseTo(cultureDistance(evil, good), 12);
    expect(cultureDistance(good, good)).toBe(0);
  });

  it('near opposites are far; near-identical are close', () => {
    expect(cultureDistance(good, evil)).toBeGreaterThan(0.6);
    const nearGood = { ...good, economy01: 0.75 };
    expect(cultureDistance(good, nearGood)).toBeLessThan(0.1);
  });

  it('a heavy trade tie CLOSES distance multiplicatively (§II.5-2 term 4), never adds', () => {
    const noTie = cultureDistance(good, evil, { tradeTie01: 0 });
    const heavyTie = cultureDistance(good, evil, { tradeTie01: 1 });
    expect(heavyTie).toBeLessThan(noTie);
    expect(heavyTie).toBeCloseTo(noTie * (1 - CULTURE_TUNING.TRADE_CLOSE), 9);
    // A trade tie NEVER adds distance: identical settlements stay 0 regardless of ties.
    expect(cultureDistance(good, good, { tradeTie01: 0 })).toBe(0);
    expect(cultureDistance(good, good, { tradeTie01: 1 })).toBe(0);
  });

  it('tradition kinship (Wave C §16): shared motifs CLOSE distance multiplicatively, absent ⇒ no change', () => {
    // Two settlements keeping the SAME festival motifs read culturally closer.
    const withMotifs = (v, els) => ({ ...v, traditionElements: els });
    const shared = ['harvest', 'river'];
    const a = withMotifs(good, shared);
    const b = withMotifs(evil, shared);
    const bare = cultureDistance(good, evil);            // no traditionElements ⇒ kinship 0 ⇒ unchanged
    const kin = cultureDistance(a, b);                   // identical motif sets ⇒ kinship 1 ⇒ closer
    expect(kin).toBeLessThan(bare);
    expect(kin).toBeCloseTo(bare * (1 - CULTURE_TUNING.TRAD_CLOSE), 9);
    // BYTE-IDENTITY: an absent motif set on either side closes nothing (traditions dark).
    expect(cultureDistance(a, evil)).toBeCloseTo(bare, 12);
    expect(cultureDistance(good, b)).toBeCloseTo(bare, 12);
    // and it NEVER adds distance — identical settlements stay exactly 0.
    expect(cultureDistance(a, a)).toBe(0);
  });

  it('traditionKinship01 is the Jaccard overlap of the motif-element sets (symmetric, total)', () => {
    expect(traditionKinship01({ traditionElements: ['a', 'b'] }, { traditionElements: ['a', 'b'] })).toBe(1);
    expect(traditionKinship01({ traditionElements: ['a', 'b'] }, { traditionElements: ['c', 'd'] })).toBe(0);
    expect(traditionKinship01({ traditionElements: ['a', 'b', 'c'] }, { traditionElements: ['b', 'c', 'd'] })).toBeCloseTo(2 / 4, 9); // |∩|=2 / |∪|=4
    expect(traditionKinship01({ traditionElements: ['a'] }, { traditionElements: [] })).toBe(0); // absent ⇒ 0
    expect(traditionKinship01(null, { traditionElements: ['a'] })).toBe(0);
    expect(traditionKinship01({ traditionElements: ['a', 'b'] }, { traditionElements: ['b', 'a'] })).toBe(1); // order-free
  });

  it('buildCultureVector reflects the traditions mirror (present ⇒ motif elements; absent ⇒ [])', () => {
    const worldState = baseWorld(digest8());
    const item = makeItem('s000', {});
    // no mirror ⇒ no signal
    expect(buildCultureVector(item, worldState).traditionElements).toEqual([]);
    // a lit mirror ⇒ the active (non-suppressed) motif elements, deduped + sorted
    item.settlement.traditions = [
      { coreMotif: { element: 'river', act: 'feast' }, suppressedBy: null },
      { coreMotif: { element: 'harvest', act: 'fair' }, suppressedBy: null },
      { coreMotif: { element: 'harvest', act: 'procession' }, suppressedBy: null }, // dup element
      { coreMotif: { element: 'stone', act: 'vigil' }, suppressedBy: { overlordId: 'o' } }, // suppressed ⇒ skipped
    ];
    expect(buildCultureVector(item, worldState).traditionElements).toEqual(['harvest', 'river']);
  });

  it('same overlord (governingName) reads closer than rival overlords (governance identity)', () => {
    const a = { ...good, governingName: 'Empire' };
    const b = { ...good, governingName: 'Empire' };
    const c = { ...good, governingName: 'Rival Crown' };
    expect(cultureDistance(a, b)).toBeLessThan(cultureDistance(a, c));
  });

  it('regimeAxes: adjacent legitimacy kinds are closer than opposite (theocracy≈magocracy)', () => {
    const div = regimeAxes('religious');
    const arc = regimeAxes('arcane');
    const pop = regimeAxes('government');
    expect(Math.abs(div.legitimacy01 - arc.legitimacy01)).toBeLessThan(Math.abs(div.legitimacy01 - pop.legitimacy01));
    expect(regimeAxes('nonsense')).toEqual({ concentration01: 0.5, legitimacy01: 0.5, ruleOfLaw01: 0.5 });
  });

  it('cultureAffinity == 1 - cultureDistance', () => {
    expect(cultureAffinity(good, evil)).toBeCloseTo(1 - cultureDistance(good, evil), 12);
  });

  it('is a LIVE read: buildCultureVector reflects CURRENT state, never the frozen digest', () => {
    const worldState = baseWorld(digest8());
    const before = buildCultureVector(makeItem('s000', { governingName: 'Old Crown', economic: 30 }), worldState);
    // A conquest flips the governingName + prosperity drops — the vector MUST change
    // (cultureDistance reads current state, so culture drifts).
    const after = buildCultureVector(makeItem('s000', { governingName: 'New Empire', economic: 70 }), worldState);
    expect(after.governingName).toBe('New Empire');
    expect(after.economy01).not.toBe(before.economy01);
    // The vector reads nothing off worldState.spatialDigest (the frozen geometry) — a
    // different digest yields the SAME vector for the same settlement state.
    const other = buildCultureVector(makeItem('s000', { governingName: 'New Empire', economic: 70 }), { ...worldState, spatialDigest: {} });
    expect(other).toEqual(after);
  });
});

// ── Carrying-capacity tolerance (context-dependent) ──────────────────────────
describe('M4 — carrying-capacity tolerance', () => {
  it('prosperity + connectivity + granary RAISE tolerance', () => {
    const bare = carryingCapacityTolerance({});
    const rich = carryingCapacityTolerance({ prosperity01: 1, connectivity01: 1, granary01: 1 });
    expect(bare).toBeCloseTo(MIGRATION_TUNING.TOL_BASE, 9);
    expect(rich).toBeGreaterThan(bare);
    expect(rich).toBeLessThanOrEqual(1);
  });

  it('higher tolerance ⇒ LOWER origin-death (a provisioned settlement loses fewer of its displaced)', () => {
    expect(originDeathRate(1)).toBeLessThan(originDeathRate(0));
    expect(originDeathRate(1)).toBeCloseTo(MIGRATION_TUNING.ORIGIN_DEATH_MIN, 9);
    expect(originDeathRate(0)).toBeCloseTo(MIGRATION_TUNING.ORIGIN_DEATH_MAX, 9);
    // Bounded: even the poorest origin sheds a MAJORITY as travellers (no annihilation).
    expect(originDeathRate(0)).toBeLessThan(0.5);
  });

  it('originTolerance reads prosperity + connectivity + granary off the live item', () => {
    const poor = originTolerance(makeItem('s000', { economic: 10, storageMonths: 0, tradeConn: 5 }), 0);
    const strong = originTolerance(makeItem('s000', { economic: 95, storageMonths: 24, tradeConn: 95 }), 6);
    expect(strong).toBeGreaterThan(poor);
  });
});

// ── Road death: embattlement × season, BOUNDED ───────────────────────────────
describe('M4 — road death scales with embattlement × season and is BOUNDED', () => {
  it('winter kills more than summer on the same danger', () => {
    expect(roadDeathRate(0.8, 'winter')).toBeGreaterThan(roadDeathRate(0.8, 'summer'));
  });
  it('more embattlement kills more', () => {
    expect(roadDeathRate(0.9, 'summer')).toBeGreaterThan(roadDeathRate(0.1, 'summer'));
  });
  it('is BOUNDED by ROAD_DEATH_MAX at the worst case (rescuable, not annihilated)', () => {
    const worst = roadDeathRate(1, 'winter');
    expect(worst).toBeLessThanOrEqual(MIGRATION_TUNING.ROAD_DEATH_MAX);
    expect(worst).toBeLessThan(1); // a war-zone winter column dies MORE but is never wiped out
    // A peaceful spring road is nearly survivable.
    expect(roadDeathRate(0, 'spring')).toBeLessThan(0.1);
  });
});

// ── The 4-axis destination score + congestion pushback ───────────────────────
describe('M4 — 4-axis destination score + congestion brake', () => {
  const base = { destId: 'd', closeness01: 0.8, cultureAffinity01: 0.7, safety01: 0.9, richness01: 0.9, capacityPressure01: 0, routeDanger01: 0, arrivalTick: 10 };
  it('rewards closeness, culture, safety, and richness', () => {
    const poorEverything = destinationScore({ ...base, closeness01: 0, cultureAffinity01: 0, safety01: 0, richness01: 0 });
    expect(destinationScore(base)).toBeGreaterThan(poorEverything);
  });
  it('CONGESTION PUSHBACK: a saturated hub loses richness pull (its score decays as it fills)', () => {
    const empty = destinationScore({ ...base, capacityPressure01: 0 });
    const full = destinationScore({ ...base, capacityPressure01: 1 });
    expect(full).toBeLessThan(empty);
    // The decay bites the richness axis by up to CONGEST_DECAY.
    expect(empty - full).toBeCloseTo(MIGRATION_TUNING.W_RICH * MIGRATION_TUNING.CONGEST_DECAY * base.richness01, 6);
  });
});

// ── splitTravellers: conservation + scatter-floor (never 'concentrated') ─────
describe('M4 — traveller split: conserves + scatter-floored', () => {
  const dests = ['a', 'b', 'c', 'd'].map((destId, i) => ({ destId, closeness01: 1 - i * 0.2, cultureAffinity01: 0.5, safety01: 0.5, richness01: 0.5, capacityPressure01: 0, routeDanger01: 0, arrivalTick: 1 }));
  const weights = [10, 1, 1, 1]; // 'a' dominates the score

  it('conserves EXACTLY (Σ split == travellers) across many pool sizes', () => {
    const rng = createPRNG('split');
    for (const total of [1, 2, 7, 25, 100, 999]) {
      const split = splitTravellers(total, dests, weights, rng.fork(`t${total}`));
      const sum = split.reduce((s, x) => s + x.travellers, 0);
      expect(sum).toBe(total);
      expect(split.every((x) => x.travellers > 0)).toBe(true);
    }
  });

  it('SCATTER-FLOOR: even a dominant destination never takes 100% (concentrated is forbidden)', () => {
    const split = splitTravellers(1000, dests, weights, createPRNG('scatter'));
    const top = split.find((x) => x.destId === 'a');
    expect(top).toBeTruthy();
    expect(top.travellers).toBeLessThan(1000); // NOT concentrated
    // The other destinations collectively receive at least ~the scatter floor.
    const rest = 1000 - top.travellers;
    expect(rest).toBeGreaterThan(1000 * MIGRATION_TUNING.SCATTER_FLOOR * 0.5);
  });

  it('is deterministic given the same seed, and varies with the seed (scatter is real)', () => {
    const a = splitTravellers(500, dests, weights, createPRNG('seedA'));
    const a2 = splitTravellers(500, dests, weights, createPRNG('seedA'));
    const b = splitTravellers(500, dests, weights, createPRNG('seedB'));
    expect(a).toEqual(a2);
    expect(a).not.toEqual(b);
  });
});

// ── planMigration: the conservation core + the two mortality sinks ───────────
describe('M4 — planMigration: two mortality sinks + EXACT conservation', () => {
  function candidates(ids, { danger = 0 } = {}) {
    return ids.map((destId, i) => ({
      destId, closeness01: 0.9 - i * 0.1, cultureAffinity01: 0.6, safety01: 0.8,
      richness01: 0.6, capacityPressure01: 0.1, routeDanger01: danger, arrivalTick: 10 + i,
    }));
  }

  it('departures == originDeaths + roadDeaths + arrivals, EXACT, and asserts true', () => {
    const plan = planMigration({
      originId: 'o', departures: 1000, tolerance: 0.5,
      candidates: candidates(['a', 'b', 'c']), season: 'summer', rng: createPRNG('plan'),
    });
    expect(plan.originDeaths + plan.roadDeaths + plan.arrivals).toBe(1000);
    expect(plan.mode).toBe(SPATIAL_DISTRIBUTION_MODE);
    expect(assertMigrationConservation(plan)).toBe(true);
    // Both sinks took a real toll; the majority still arrived.
    expect(plan.originDeaths).toBeGreaterThan(0);
    expect(plan.arrivals).toBeGreaterThan(0);
    expect(plan.arrivals).toBeLessThan(1000);
  });

  it('a WAR-ZONE WINTER route kills MORE on the road but still lands survivors', () => {
    const peace = planMigration({ originId: 'o', departures: 1000, tolerance: 0.5, candidates: candidates(['a'], { danger: 0 }), season: 'summer', rng: createPRNG('p') });
    const warWinter = planMigration({ originId: 'o', departures: 1000, tolerance: 0.5, candidates: candidates(['a'], { danger: 1 }), season: 'winter', rng: createPRNG('p') });
    expect(warWinter.roadDeaths).toBeGreaterThan(peace.roadDeaths);
    expect(warWinter.arrivals).toBeGreaterThan(0); // rescuable, not annihilated
    expect(assertMigrationConservation(warWinter)).toBe(true);
  });

  it('an ISOLATED origin (no reachable destination) books the WHOLE pool as origin-loss (still exact)', () => {
    const plan = planMigration({ originId: 'o', departures: 300, tolerance: 0.5, candidates: [], season: null, rng: createPRNG('iso') });
    expect(plan.arrivals).toBe(0);
    expect(plan.originDeaths).toBe(300);
    expect(plan.dispatches).toHaveLength(0);
    expect(assertMigrationConservation(plan)).toBe(true);
  });

  it('assertMigrationConservation REJECTS a tampered/forbidden-mode plan', () => {
    const plan = planMigration({ originId: 'o', departures: 500, tolerance: 0.5, candidates: candidates(['a', 'b']), season: 'summer', rng: createPRNG('t') });
    expect(assertMigrationConservation({ ...plan, mode: FORBIDDEN_DISTRIBUTION_MODE })).toBe(false);
    expect(assertMigrationConservation({ ...plan, arrivals: plan.arrivals + 1 })).toBe(false);
  });

  it('higher tolerance ⇒ fewer origin deaths ⇒ more travellers reach the road', () => {
    const low = planMigration({ originId: 'o', departures: 1000, tolerance: 0.05, candidates: candidates(['a']), season: 'summer', rng: createPRNG('low') });
    const high = planMigration({ originId: 'o', departures: 1000, tolerance: 0.95, candidates: candidates(['a']), season: 'summer', rng: createPRNG('low') });
    expect(high.originDeaths).toBeLessThan(low.originDeaths);
    expect(high.arrivals).toBeGreaterThan(low.arrivals);
  });
});

// ── The in-transit column ledger (transport lag) ─────────────────────────────
describe('M4 — transport-lag column ledger', () => {
  it('enqueues arrivals that release only at/after their arrivalTick', () => {
    const plan = planMigration({
      originId: 'o', departures: 800, tolerance: 0.5,
      candidates: [{ destId: 'a', closeness01: 0.9, cultureAffinity01: 0.6, safety01: 0.8, richness01: 0.6, capacityPressure01: 0, routeDanger01: 0, arrivalTick: 20 }],
      season: null, rng: createPRNG('lag'),
    });
    const ledger = enqueueColumns({}, plan, 10);
    const ws = { spatialCanonVersion: 1, spatialLedgers: { migration: ledger } };
    // Before arrival: nothing releases, ledger unchanged.
    const early = releaseArrivals(ws, 15);
    expect(early.arrivals).toHaveLength(0);
    // At arrival: the survivors land, ledger drains.
    const landed = releaseArrivals(ws, 20);
    expect(landed.arrivals).toHaveLength(1);
    expect(landed.arrivals[0].destId).toBe('a');
    expect(landed.arrivals[0].count).toBe(plan.arrivals);
    expect(landed.next).toBeNull(); // last column drained ⇒ ledger drops
  });
});

// ── END-TO-END CONSERVATION over a multi-tick dispatch→release loop ──────────
describe('M4 — THE CONSERVATION INVARIANT (multi-tick, end-to-end)', () => {
  it('Σarrivals + Σdeaths == Σdepartures, EXACT, over a 60-tick war+famine loop', () => {
    const digest = digest8();
    const ids = digest.settlementIds;
    // A regional snapshot: varied prosperity, one rich hub (s000), governingNames.
    const snapshot = {
      settlements: ids.map((id, i) => makeItem(id, {
        population: 800 + i * 200,
        economic: id === ids[0] ? 90 : 30 + i * 4,
        governingName: id === ids[0] ? 'Empire' : `Free Town ${i}`,
        storageMonths: 2,
      })),
      regionalGraph: { edges: [] },
    };
    const rng = createPRNG('soak');
    // War + famine pressure: high conflict + food deficit everywhere; crime in the hub.
    const pMap = {};
    for (const id of ids) { pMap[`${id}:conflict`] = 0.6; pMap[`${id}:food`] = 0.5; pMap[`${id}:crime`] = 0.2; }
    const pIndex = makePIndex(pMap);

    let worldState = baseWorld(digest);
    const localSettlements = new Map(snapshot.settlements.map((it) => [String(it.id), { ...it.settlement }]));

    let totalDepartures = 0;
    let totalDeaths = 0;
    let totalArrivalsCredited = 0;

    for (let tick = 0; tick < 60; tick++) {
      worldState = { ...worldState, tick };
      // RELEASE (early) — credit arrivals whose tick has come.
      const beforePop = [...localSettlements.values()].reduce((s, x) => s + x.population, 0);
      const release = releaseMigrationArrivals({ worldState, localSettlements, settlements: snapshot.settlements, tick });
      if (release.changed) worldState = release.worldState;
      const afterPop = [...localSettlements.values()].reduce((s, x) => s + x.population, 0);
      totalArrivalsCredited += (afterPop - beforePop);

      // DISPATCH — a couple of origins shed each tick (only in the first 40 ticks so
      // the last 20 ticks let every column arrive).
      if (tick < 40) {
        const events = [
          { originId: ids[1], loss: 120 },
          { originId: ids[3], loss: 90 },
          { originId: ids[5], loss: 70 },
        ];
        const dispatch = dispatchMigrations({ events, snapshot, pIndex, digest, worldState, rng, season: tick % 52 >= 39 ? 'winter' : 'summer', tick });
        if (dispatch.changed) worldState = dispatch.worldState;
        for (const r of dispatch.receipts) {
          totalDepartures += r.departures;
          totalDeaths += r.originDeaths + r.roadDeaths;
        }
      }
    }

    // Drain any stragglers well past the max hop.
    for (let tick = 60; tick < 60 + 60; tick++) {
      worldState = { ...worldState, tick };
      const beforePop = [...localSettlements.values()].reduce((s, x) => s + x.population, 0);
      const release = releaseMigrationArrivals({ worldState, localSettlements, settlements: snapshot.settlements, tick });
      if (release.changed) worldState = release.worldState;
      const afterPop = [...localSettlements.values()].reduce((s, x) => s + x.population, 0);
      totalArrivalsCredited += (afterPop - beforePop);
    }

    // No columns left in transit.
    expect(worldState.spatialLedgers?.migration ?? null).toBeNull();
    // THE INVARIANT — exact to the person.
    expect(totalDepartures).toBeGreaterThan(0);
    expect(totalArrivalsCredited + totalDeaths).toBe(totalDepartures);
  });
});

// ── THE REGIONAL SOAK — no megacity / chain-collapse / annihilation ──────────
describe('M4 — regional soak: bounded, no megacity, no annihilation', () => {
  it('a multi-year war+famine run settles to a STABLE bounded distribution', () => {
    const digest = digest8();
    const ids = digest.settlementIds;
    const snapshot = {
      settlements: ids.map((id, i) => makeItem(id, {
        population: 1500,
        economic: id === ids[0] ? 95 : 35, // s000 is the rich hub (the megacity risk)
        governingName: `Town ${i}`,
        storageMonths: 3,
      })),
      regionalGraph: { edges: [] },
    };
    const localSettlements = new Map(snapshot.settlements.map((it) => [String(it.id), { ...it.settlement }]));
    const rng = createPRNG('regional');
    const pMap = {};
    for (const id of ids) { pMap[`${id}:conflict`] = 0.55; pMap[`${id}:food`] = 0.45; }
    const pIndex = makePIndex(pMap);

    let worldState = baseWorld(digest);
    const YEARS = 6;
    for (let tick = 0; tick < YEARS * 52; tick++) {
      worldState = { ...worldState, tick };
      const release = releaseMigrationArrivals({ worldState, localSettlements, settlements: snapshot.settlements, tick });
      if (release.changed) worldState = release.worldState;

      // Every non-hub sheds a modest excess each season (the famine push); the snapshot
      // reads the CURRENT (mutated) populations so the congestion brake sees hub growth.
      if (tick % 13 === 0) {
        const live = ids.map((id) => ({ ...snapshot.settlements.find((s) => s.id === id), settlement: localSettlements.get(id) }));
        const liveSnapshot = { settlements: live, regionalGraph: { edges: [] } };
        const events = ids.slice(1).map((id) => ({ originId: id, loss: Math.round(localSettlements.get(id).population * 0.06) }))
          .filter((e) => e.loss > 0);
        const season = tick % 52 >= 39 ? 'winter' : 'summer';
        const dispatch = dispatchMigrations({ events, snapshot: liveSnapshot, pIndex, digest, worldState, rng, season, tick });
        if (dispatch.changed) worldState = dispatch.worldState;
        // Apply the origin debits (the aspatial apply pass does this in production).
        for (const e of events) {
          const s = localSettlements.get(e.originId);
          localSettlements.set(e.originId, { ...s, population: Math.max(0, s.population - e.loss) });
        }
      }
    }
    // Drain in-transit.
    for (let tick = YEARS * 52; tick < YEARS * 52 + 60; tick++) {
      worldState = { ...worldState, tick };
      const release = releaseMigrationArrivals({ worldState, localSettlements, settlements: snapshot.settlements, tick });
      if (release.changed) worldState = release.worldState;
    }

    const pops = [...localSettlements.values()].map((s) => s.population);
    const totalStart = 1500 * ids.length;
    const totalEnd = pops.reduce((s, x) => s + x, 0);
    const hubPop = localSettlements.get(ids[0]).population;

    // NO ANNIHILATION: every settlement retains people (a war-zone stream dies more but
    // is never wiped out).
    expect(Math.min(...pops)).toBeGreaterThan(0);
    // NO MEGACITY: the rich hub grows (it pulls migrants) but the congestion brake keeps
    // it from swallowing the region — it stays a bounded multiple of the mean.
    const mean = totalEnd / pops.length;
    expect(hubPop).toBeLessThan(mean * 6);
    // NO WORLD-POP EXPLOSION: deaths + migration only shrink the total (a demographic
    // sink), never mint people.
    expect(totalEnd).toBeLessThanOrEqual(totalStart);
    // BOUNDED: the total didn't collapse to near-zero either (a plausible distribution).
    expect(totalEnd).toBeGreaterThan(totalStart * 0.3);
  });
});

// ── NAMED-NPC SAFETY (owner product-scope boundary) ──────────────────────────
describe('M4 — mortality is AGGREGATE-ONLY: named NPCs are never touched', () => {
  it('a dispatch + release tick moves population COUNTS but leaves npcStates untouched', () => {
    const digest = digest8();
    const ids = digest.settlementIds;
    const namedNpc = { id: 'npc_captain_vale', name: 'Captain Vale', home: ids[1], alive: true };
    const npcStates = { npc_captain_vale: namedNpc };
    const snapshot = {
      settlements: ids.map((id) => makeItem(id, { population: 1000 })),
      regionalGraph: { edges: [] },
    };
    let worldState = { ...baseWorld(digest), npcStates, tick: 3 };

    const dispatch = dispatchMigrations({
      events: [{ originId: ids[1], loss: 500 }], snapshot, pIndex: makePIndex({ [`${ids[1]}:conflict`]: 0.9 }),
      digest, worldState, rng: createPRNG('npc'), season: 'winter', tick: 3,
    });
    if (dispatch.changed) worldState = dispatch.worldState;
    // The mover produced AGGREGATE receipts — deaths are counts, not names.
    const receipt = dispatch.receipts.find((r) => r.originId === ids[1]);
    expect(receipt).toBeTruthy();
    expect(receipt.originDeaths + receipt.roadDeaths).toBeGreaterThan(0);
    // npcStates are byte-identical (the same reference, deep-equal) — no named NPC
    // was killed, removed, or mutated by the mortality tick.
    expect(worldState.npcStates).toBe(npcStates);
    expect(worldState.npcStates.npc_captain_vale).toEqual(namedNpc);
    expect(worldState.npcStates.npc_captain_vale.alive).toBe(true);
    // The dispatch return carries NO npc field anywhere (it moves numbers only).
    expect(JSON.stringify(dispatch.receipts)).not.toContain('npc');
    expect(JSON.stringify(dispatch.receipts)).not.toContain('Vale');

    // Release the arrivals — still no NPC touched.
    const localSettlements = new Map(snapshot.settlements.map((it) => [String(it.id), { ...it.settlement }]));
    for (let t = 3; t < 60; t++) {
      const ws = { ...worldState, tick: t };
      const rel = releaseMigrationArrivals({ worldState: ws, localSettlements, settlements: snapshot.settlements, tick: t });
      if (rel.changed) worldState = { ...rel.worldState, tick: worldState.tick };
    }
    expect(worldState.npcStates.npc_captain_vale).toEqual(namedNpc);
  });
});

// ── REFUGE POSTURE axis (design §4 / E1c — the generosity engine's 5th destination axis) ──
describe('REFUGE POSTURE axis — the generosity coupling on M4 destination choice', () => {
  /** A minimal reachable destination candidate. */
  const cand = (destId, over = {}) => ({
    destId, closeness01: 0.5, cultureAffinity01: 0.5, safety01: 0.7, richness01: 0.6,
    capacityPressure01: 0.2, routeDanger01: 0.1, arrivalTick: 10, ...over,
  });

  it('NO-OP when absent: a candidate with no posture (or refugePosture01: 0) scores IDENTICALLY to before the axis', () => {
    const base = cand('x');                          // no refugePosture01 field at all (the pre-axis shape)
    const withZero = cand('x', { refugePosture01: 0 });
    // Adding the axis at weight 0 is the IDENTITY — this is what keeps every migration
    // golden byte-identical in a world with no refuge postures.
    expect(destinationScore(base)).toBe(destinationScore(withZero));
    // And the axis contributes EXACTLY W_REFUGE·weight on top of the untouched 4-axis score.
    const posture = cand('x', { refugePosture01: 0.8 });
    expect(destinationScore(posture)).toBeCloseTo(
      destinationScore(base) + MIGRATION_TUNING.W_REFUGE * 0.8, 10);
  });

  it('a posture RAISES a destination score monotonically (the host pulls the exodus toward it)', () => {
    expect(destinationScore(cand('x', { refugePosture01: 0.6 })))
      .toBeGreaterThan(destinationScore(cand('x', { refugePosture01: 0 })));
  });

  it('CONSERVATION weight-independence (the HONEST pin): a posture shifts WHERE survivors go, never the SUM', () => {
    // Two otherwise-identical destinations; a refuge posture is opened toward B only. The
    // recipe's literal "identical {originDeaths,roadDeaths,arrivals}" is PROVABLY wrong
    // (roadDeaths is a per-column integer draw on each route's own danger), so we pin the
    // TRUE invariants: departures + originDeaths unchanged, the conservation SUM exact (no
    // minting), and the split shifts toward the posture host.
    const A = cand('aaa', { routeDanger01: 0.1 });
    const B = cand('bbb', { routeDanger01: 0.1 });
    const common = { originId: 'o', departures: 400, tolerance: 0.7, season: 'summer' };
    const noPosture = planMigration({ ...common, candidates: [A, B], rng: createPRNG('refuge') });
    const withPosture = planMigration({
      ...common,
      candidates: [A, { ...B, refugePosture01: 0.9 }],
      rng: createPRNG('refuge'),
    });

    // Both plans conserve EXACTLY (no minting), and the SUM identity holds.
    expect(assertMigrationConservation(noPosture)).toBe(true);
    expect(assertMigrationConservation(withPosture)).toBe(true);

    // The weight-INDEPENDENT terms are byte-identical: departures + originDeaths.
    expect(withPosture.departures).toBe(noPosture.departures);
    expect(withPosture.originDeaths).toBe(noPosture.originDeaths);

    // The SPLIT shifts toward the posture host B (the whole point of the axis).
    const shareOf = (plan, id) => (plan.dispatches.find((d) => d.destId === id)?.travellers || 0);
    expect(shareOf(withPosture, 'bbb')).toBeGreaterThan(shareOf(noPosture, 'bbb'));
  });

  it('the refuge axis alone never breaches conservation across a range of weights', () => {
    for (const w of [0, 0.25, 0.5, 0.75, 1]) {
      const plan = planMigration({
        originId: 'o', departures: 300, tolerance: 0.6, season: 'autumn',
        candidates: [cand('aaa'), cand('bbb', { refugePosture01: w })],
        rng: createPRNG(`w-${w}`),
      });
      expect(assertMigrationConservation(plan)).toBe(true);
    }
  });
});

// ── REFUGE coupling: dispatchMigrations READS the refugePostures ledger (host:origin) ──
describe('REFUGE coupling — dispatchMigrations reads the generosity-written posture ledger', () => {
  const inboundArrivals = (worldState, destId) => {
    const ledger = worldState?.spatialLedgers?.migration || {};
    let sum = 0;
    for (const col of Object.values(ledger)) {
      if (String(col.destId) === String(destId)) sum += Math.max(0, Math.round(Number(col.arrivals) || 0));
    }
    return sum;
  };

  it('a posture keyed "host:origin" pulls the origin\'s exodus toward the host (conservation intact)', () => {
    const digest = digest8();
    const ids = digest.settlementIds;
    const origin = ids[0];
    const host = ids[5]; // a reachable but non-default destination the posture lifts into contention
    const snapshot = { settlements: ids.map((id) => makeItem(id, { population: 1000 })), regionalGraph: { edges: [] } };
    const events = [{ originId: origin, loss: 2000 }];
    const run = (postures) => dispatchMigrations({
      events, snapshot, pIndex: makePIndex(), digest,
      worldState: { ...baseWorld(digest), ...(postures ? { spatialLedgers: { refugePostures: postures } } : {}) },
      rng: createPRNG('refuge-couple'), season: 'summer', tick: 0,
    });
    const none = run(null);
    // The kernel writes the posture keyed 'host:origin' (giver:receiver) — the exact key M4 reads.
    const withP = run({ [`${host}:${origin}`]: { phase: 'open', sinceTick: 0, lastTick: 0, weight01: 0.95 } });

    // The host gathers MORE of the exodus with an open refuge posture toward this origin.
    expect(inboundArrivals(withP.worldState, host)).toBeGreaterThan(inboundArrivals(none.worldState, host));
    // The weight-INDEPENDENT conservation terms hold: departures identical, and no minting.
    const dep = (d) => d.receipts.reduce((s, r) => s + r.departures, 0);
    const oDeaths = (d) => d.receipts.reduce((s, r) => s + r.originDeaths, 0);
    expect(dep(withP)).toBe(dep(none));
    expect(oDeaths(withP)).toBe(oDeaths(none));
  });

  it('a posture keyed the WRONG way (origin:host) does NOT pull (proves the key order is load-bearing)', () => {
    const digest = digest8();
    const ids = digest.settlementIds;
    const origin = ids[0];
    const host = ids[5];
    const snapshot = { settlements: ids.map((id) => makeItem(id, { population: 1000 })), regionalGraph: { edges: [] } };
    const events = [{ originId: origin, loss: 2000 }];
    const run = (postures) => dispatchMigrations({
      events, snapshot, pIndex: makePIndex(), digest,
      worldState: { ...baseWorld(digest), spatialLedgers: { refugePostures: postures } },
      rng: createPRNG('refuge-couple'), season: 'summer', tick: 0,
    });
    const wrongKey = run({ [`${origin}:${host}`]: { phase: 'open', sinceTick: 0, lastTick: 0, weight01: 0.95 } });
    const none = dispatchMigrations({
      events, snapshot, pIndex: makePIndex(), digest, worldState: baseWorld(digest),
      rng: createPRNG('refuge-couple'), season: 'summer', tick: 0,
    });
    // A reversed key never matches destId:originId ⇒ the host's arrivals are unchanged.
    expect(inboundArrivals(wrongKey.worldState, host)).toBe(inboundArrivals(none.worldState, host));
  });
});
