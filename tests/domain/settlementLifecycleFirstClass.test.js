/**
 * settlementLifecycleFirstClass.test.js — W-LIFECYCLE Stage 2: the FIRST-CLASS LANE
 * pins (docs/DESIGN_SETTLEMENT_LIFECYCLE.md §2 + §4).
 *
 *   • NO-SUDDEN-DEATH — the death draw NEVER arms before the extended terminal
 *     dwell; a settlement that recovers clears its dwell.
 *   • THE SCARCITY PIN (owner law verbatim) — relic_ruin IFF the monotone
 *     peakTier ≥ city, read LIVE at the writer; everything lesser leaves an
 *     abandoned site.
 *   • THE FATES PIN — terminal death resolves ZERO named-NPC fates: the roster
 *     count is invariant, each record gains only a dispersal stamp.
 *   • CONSERVATION — the death outcome's spatial shed marker rides the M4
 *     realized-debit path (collectRealizedEmigrationEvents; proposal-mode
 *     excluded); the aspatial path credits ≤ the origin debit (the 45%
 *     reconciliation); a resettlement's deltas sum to EXACTLY ZERO.
 *   • AUTHORITY — campaign-altering (deriveDecisionTier 'major'), proposal-gated
 *     on majorChangesRequireProposal, forced to proposal under dm_only.
 *   • GEOMETRY SURVIVES DEATH — a full-pulse die-and-resettle never touches the
 *     frozen digest (same reference), and the remnant keeps its id/cell.
 *   • CATCH-UP INTEGRITY — the decline dwell is a tick STAMP.
 *   • FORCE ≡ ORGANIC substrate — the writer self-re-verifies (stale no-ops).
 */
import { describe, expect, it } from 'vitest';

import { createPRNG } from '../../src/kernel/prng.js';
import { SETTLEMENT_LIFECYCLE_TUNING } from '../../src/domain/worldPulse/settlementLifecycleKernel.js';
import {
  evaluateSettlementLifecycle,
  applySettlementLifecycleOutcomeToSettlement,
  remnantGradeOf,
  lifecycleStatusOf,
} from '../../src/domain/worldPulse/settlementLifecycleFirstClass.js';
import { collectRealizedEmigrationEvents } from '../../src/domain/worldPulse/migrationKernel.js';
import { deriveDecisionTier } from '../../src/domain/worldPulse/decisionTier.js';
import { reapplyEventConditions } from '../../src/domain/conditionPromotion.js';

const T = SETTLEMENT_LIFECYCLE_TUNING;

// ── Fixtures ───────────────────────────────────────────────────────────────────
function thorp(id, { population = 20, peakTier, lifecycleStatus, diedAt, npcs = [], institutions = [] } = {}) {
  return {
    name: `${id}-name`, tier: 'thorp', population, culture: 'germanic',
    ...(lifecycleStatus ? { lifecycleStatus } : {}),
    config: {
      terrainType: 'plains', tradeRouteAccess: 'road', tier: 'thorp', settType: 'thorp',
      nearbyResources: ['grain_fields'],
      ...(peakTier ? { peakTier } : {}),
      ...(lifecycleStatus ? { lifecycleStatus } : {}),
      ...(diedAt != null ? { lifecycleDiedAtTick: diedAt } : {}),
    },
    _config: { tier: 'thorp' },
    economicState: { prosperity: 'Struggling' },
    powerStructure: { publicLegitimacy: { score: 20 }, factions: [], conflicts: [] },
    activeConditions: [],
    populationHistory: [],
    npcs,
    institutions,
  };
}
const donorTown = (id) => ({
  name: `${id}-name`, tier: 'town', population: 3000, culture: 'germanic',
  config: { terrainType: 'plains', tradeRouteAccess: 'road', tier: 'town', settType: 'town' },
  economicState: { prosperity: 'Prosperous' },
  powerStructure: { publicLegitimacy: { score: 55 }, factions: [], conflicts: [] },
  activeConditions: [], populationHistory: [], npcs: [], institutions: [],
});

function makeSnapshot(settlements) {
  const items = Object.entries(settlements).map(([id, s]) => ({ id, name: s.name, settlement: s }));
  return {
    settlements: items,
    byId: new Map(items.map((it) => [String(it.id), it])),
    regionalGraph: { edges: items.length > 1 ? [{ from: items[0].id, to: items[1].id, relationshipType: 'trade_partner' }] : [] },
  };
}

// High pressures everywhere ⇒ support collapses (deep decline).
const collapsedPIndex = { get: () => ({ score: 1 }) };
const calmPIndex = { get: () => ({ score: 0 }) };

function makeWorldState({ tick = 500, lit = true, tickStates = null, proposals = null } = {}) {
  return {
    tick,
    simulationRules: lit ? { settlementLifecycleEnabled: true, majorChangesRequireProposal: false } : {},
    ...(tickStates ? { settlementTickStates: tickStates } : {}),
    ...(proposals ? { proposals } : {}),
  };
}

const evalOnce = (worldState, snapshot, pIndex, ctx = {}) =>
  evaluateSettlementLifecycle(worldState, snapshot, pIndex, {
    tick: worldState.tick, simulationRules: worldState.simulationRules,
    rng: createPRNG('fc-test'), ...ctx,
  });

// ── DORMANCY + PURITY ──────────────────────────────────────────────────────────
describe('evaluator dormancy + purity', () => {
  it('dark ⇒ SAME worldState reference, zero candidates', () => {
    const snapshot = makeSnapshot({ a: thorp('a') });
    const worldState = makeWorldState({ lit: false });
    const out = evaluateSettlementLifecycle(worldState, snapshot, collapsedPIndex, { tick: 500 });
    expect(out.worldState).toBe(worldState);
    expect(out.candidates).toEqual([]);
  });

  it('lit ⇒ never mutates its deep-frozen inputs', () => {
    const deepFreeze = (o) => {
      if (o && typeof o === 'object' && !Object.isFrozen(o)) {
        Object.freeze(o);
        for (const v of Object.values(o)) deepFreeze(v);
      }
      return o;
    };
    const snapshot = makeSnapshot({ a: thorp('a') });
    const worldState = makeWorldState({ tickStates: { a: { settlementLifecycle: { declineSince: 100 } } } });
    deepFreeze(snapshot); deepFreeze(worldState);
    const out = evalOnce(worldState, snapshot, collapsedPIndex);
    expect(out.worldState).not.toBe(worldState);
  });
});

// ── NO-SUDDEN-DEATH + THE DWELL ────────────────────────────────────────────────
describe('terminal decline (no-sudden-death; the dwell is a tick stamp)', () => {
  it('a freshly-declining thorp stamps declineSince but emits NO death candidate', () => {
    const snapshot = makeSnapshot({ a: thorp('a') });
    const out = evalOnce(makeWorldState(), snapshot, collapsedPIndex);
    expect(out.candidates).toEqual([]);
    expect(out.worldState.settlementTickStates.a.settlementLifecycle.declineSince).toBe(500);
  });

  it('the death candidate arms ONLY once the dwell is met (and the stamp survives a catch-up jump)', () => {
    const snapshot = makeSnapshot({ a: thorp('a') });
    // Stamped long ago; the evaluated tick jumped far past it (the M10b collapse).
    const worldState = makeWorldState({
      tick: 500, tickStates: { a: { settlementLifecycle: { declineSince: 500 - T.TERMINAL_DWELL - 10 } } },
    });
    const out = evalOnce(worldState, snapshot, collapsedPIndex);
    expect(out.candidates.length).toBe(1);
    const cand = out.candidates[0];
    expect(cand.candidateType).toBe('settlement_terminal_death');
    expect(cand.metadata.dwell).toBeGreaterThanOrEqual(T.TERMINAL_DWELL);
    expect(cand.probability).toBeLessThan(0.2); // E0-classed very rare — the draw stays small
  });

  it('a dwell one tick SHORT of the wall emits nothing (the boundary is exact)', () => {
    const snapshot = makeSnapshot({ a: thorp('a') });
    const worldState = makeWorldState({
      tick: 500, tickStates: { a: { settlementLifecycle: { declineSince: 500 - T.TERMINAL_DWELL + 1 } } },
    });
    expect(evalOnce(worldState, snapshot, collapsedPIndex).candidates).toEqual([]);
  });

  it('recovery clears the dwell: a thorp whose support returns drops the stamp; a promoted settlement drops it too', () => {
    const snapshot = makeSnapshot({ a: thorp('a', { population: 40 }) });
    const worldState = makeWorldState({ tickStates: { a: { settlementLifecycle: { declineSince: 100 } } } });
    const calm = evalOnce(worldState, snapshot, calmPIndex);
    expect(calm.worldState.settlementTickStates.a?.settlementLifecycle).toBeUndefined();

    const hamletSnap = makeSnapshot({ a: { ...thorp('a', { population: 200 }), tier: 'hamlet' } });
    const up = evalOnce(worldState, hamletSnap, collapsedPIndex);
    expect(up.worldState.settlementTickStates.a?.settlementLifecycle).toBeUndefined();
  });

  it('one pending lifecycle proposal per settlement (no duplicate candidates)', () => {
    const snapshot = makeSnapshot({ a: thorp('a') });
    const worldState = makeWorldState({
      tickStates: { a: { settlementLifecycle: { declineSince: 100 } } },
      proposals: [{ status: 'pending', outcome: { lifecyclePatch: { kind: 'terminal_death', saveId: 'a' } } }],
    });
    expect(evalOnce(worldState, snapshot, collapsedPIndex).candidates).toEqual([]);
  });
});

// ── AUTHORITY (campaign-altering, proposal-gated) ─────────────────────────────
describe('authority routing (the blockade_declared registration pattern)', () => {
  const armedWorld = (rules) => ({
    tick: 500,
    simulationRules: { settlementLifecycleEnabled: true, ...rules },
    settlementTickStates: { a: { settlementLifecycle: { declineSince: 500 - T.TERMINAL_DWELL - 10 } } },
  });

  it('honors majorChangesRequireProposal (the tier_change precedent)', () => {
    const snapshot = makeSnapshot({ a: thorp('a') });
    const on = evalOnce(armedWorld({ majorChangesRequireProposal: true }), snapshot, collapsedPIndex);
    expect(on.candidates[0].applyMode).toBe('proposal');
    const off = evalOnce(armedWorld({ majorChangesRequireProposal: false }), snapshot, collapsedPIndex);
    expect(off.candidates[0].applyMode).toBe('auto');
  });

  it('dm_only forces proposal via authorityFor', () => {
    const snapshot = makeSnapshot({ a: thorp('a') });
    const out = evalOnce(armedWorld({ majorChangesRequireProposal: false, politicalAutonomy: 'dm_only' }), snapshot, collapsedPIndex);
    expect(out.candidates[0].applyMode).toBe('proposal');
  });

  it('deriveDecisionTier classifies a terminal death as MAJOR (deferMajors pauses on it)', () => {
    expect(deriveDecisionTier({ candidateType: 'settlement_terminal_death', severity: 0.8 })).toBe('major');
  });
});

// ── CONSERVATION AT DEATH ──────────────────────────────────────────────────────
describe('conservation at the death edge', () => {
  const armed = (tick = 500) => ({
    tick,
    simulationRules: { settlementLifecycleEnabled: true, majorChangesRequireProposal: false },
    settlementTickStates: { a: { settlementLifecycle: { declineSince: tick - T.TERMINAL_DWELL - 10 } } },
  });

  it('SPATIAL: the shed marker equals the full residual and rides the M4 realized-debit collect', () => {
    const snapshot = makeSnapshot({ a: thorp('a', { population: 24 }), b: donorTown('b') });
    const out = evalOnce(armed(), snapshot, collapsedPIndex, { spatialActive: true });
    const cand = out.candidates[0];
    expect(cand.metadata.spatialEmigration).toEqual({ loss: 24 });
    expect(cand.populationDeltas).toEqual([
      expect.objectContaining({ saveId: 'a', delta: -24 }),
    ]);
    // The realized-debit collect picks it up at auto…
    expect(collectRealizedEmigrationEvents([cand])).toEqual([{ originId: 'a', loss: 24 }]);
    // …and NEVER for a queued proposal (dispatching would MINT people).
    expect(collectRealizedEmigrationEvents([{ ...cand, applyMode: 'proposal' }])).toEqual([]);
  });

  it('ASPATIAL: credits are the 45% reconciliation and never exceed the origin debit', () => {
    const snapshot = makeSnapshot({ a: thorp('a', { population: 40 }), b: donorTown('b') });
    const out = evalOnce(armed(), snapshot, collapsedPIndex, { spatialActive: false });
    const cand = out.candidates[0];
    expect(cand.metadata.spatialEmigration).toBeUndefined();
    const debit = cand.populationDeltas.find((d) => d.saveId === 'a');
    expect(debit.delta).toBe(-40);
    const credits = cand.populationDeltas.filter((d) => d.delta > 0).reduce((s, d) => s + d.delta, 0);
    expect(credits).toBeLessThanOrEqual(Math.round(40 * T.ASPATIAL_MIGRANT_FRACTION));
  });
});

// ── THE WRITER: death ──────────────────────────────────────────────────────────
describe('the death writer (scarcity + fates + geometry status)', () => {
  const deathOutcome = (tick = 600) => ({
    id: 'outcome.death.a',
    targetSaveId: 'a',
    candidateType: 'settlement_terminal_death',
    lifecyclePatch: { kind: 'terminal_death', saveId: 'a' },
    metadata: { tick },
  });

  it('THE SCARCITY PIN: peakTier ≥ city ⇒ relic_ruin; anything less ⇒ abandoned_site (live read at the writer)', () => {
    expect(remnantGradeOf(thorp('a', { peakTier: 'city' }))).toBe('relic_ruin');
    expect(remnantGradeOf(thorp('a', { peakTier: 'metropolis' }))).toBe('relic_ruin');
    expect(remnantGradeOf(thorp('a', { peakTier: 'town' }))).toBe('abandoned_site');
    expect(remnantGradeOf(thorp('a', { peakTier: 'hamlet' }))).toBe('abandoned_site');
    // Absent-tolerated backfill = the current tier: a never-stamped thorp is a
    // newborn at the bottom rung — abandoned site, never a relic ruin.
    expect(remnantGradeOf(thorp('a'))).toBe('abandoned_site');

    const fallen = applySettlementLifecycleOutcomeToSettlement(thorp('a', { peakTier: 'city' }), deathOutcome());
    expect(lifecycleStatusOf(fallen)).toBe('relic_ruin');
    const lesser = applySettlementLifecycleOutcomeToSettlement(thorp('a', { peakTier: 'village' }), deathOutcome());
    expect(lifecycleStatusOf(lesser)).toBe('abandoned_site');
  });

  it('THE FATES PIN: the npc roster count is INVARIANT; records gain only dispersal stamps, never a fate', () => {
    const npcs = [
      { id: 'n1', name: 'Mera of the Well', role: 'elder' },
      { id: 'n2', name: 'Tobbin Ashhand', role: 'smith' },
    ];
    const s = thorp('a', { peakTier: 'city', npcs });
    const dead = applySettlementLifecycleOutcomeToSettlement(s, deathOutcome());
    expect(dead.npcs.length).toBe(2);
    for (const npc of dead.npcs) {
      expect(npc.dispersed).toBe(true);
      expect(npc.dispersalNote).toContain('fate unresolved');
      expect('dead' in npc).toBe(false);
      expect('fate' in npc).toBe(false);
      expect('killed' in npc).toBe(false);
    }
    // Dispersal prose only — the chronicle carries the wagons line.
    const evt = (dead.history.historicalEvents || []).find((e) => e.campaignEra);
    expect(evt.description).toContain('left with the wagons');
    expect(evt.description).toContain('fates unresolved');
  });

  it('death is a STATUS: population 0, institutions deactivated-not-erased, conditions cleared, stamps dual-written', () => {
    const s = thorp('a', {
      peakTier: 'city', population: 18,
      institutions: [{ name: 'Old Mill', category: 'industry', status: 'active' }],
    });
    s.activeConditions = [{ id: 'c1', archetype: 'famine', label: 'Famine', severity: 0.6, affectedSystems: [] }];
    const dead = applySettlementLifecycleOutcomeToSettlement(s, deathOutcome(700));
    expect(dead.population).toBe(0);
    expect(dead.activeConditions).toEqual([]);
    expect(dead.institutions.length).toBe(1);
    expect(dead.institutions[0].status).toBe('removed');
    expect(dead.institutions[0].worldPulseFate).toBe('abandoned_with_the_settlement');
    expect(dead.lifecycleStatus).toBe('relic_ruin');
    expect(dead.config.lifecycleStatus).toBe('relic_ruin');
    expect(dead._config.lifecycleStatus).toBe('relic_ruin');   // regen-surviving
    expect(dead.config.lifecycleDiedAtTick).toBe(700);
    expect(dead.config.peakTier).toBe('city');                 // the peak is frozen history
    expect(dead.lifecycleHistory.at(-1)).toMatchObject({ event: 'terminal_death', grade: 'relic_ruin' });
  });

  it('r2 economy-upswing-6: terminal death clears the config.eventConditions projection (+ _config twin) so regen re-promotes NOTHING', () => {
    // A dying thorp still carrying an EVENT-sourced crisis (plague) whose projection lives in
    // config.eventConditions / _config.eventConditions — the record a full regeneration replays.
    const plague = {
      id: 'condition.plague.event', archetype: 'plague', label: 'Plague', severity: 0.7,
      affectedSystems: ['population'], causes: [{ source: 'event', eventType: 'APPLY_STRESSOR' }],
    };
    const s = thorp('a', { peakTier: 'city', population: 14 });
    s.activeConditions = [plague];
    s.config = { ...s.config, eventConditions: [plague] };
    s._config = { ...s._config, eventConditions: [plague] };

    // NEGATIVE CONTROL (non-vacuity): the regen replay WOULD resurrect the crisis on a bare
    // remnant if the projection were left standing — clearing activeConditions alone is not enough.
    const remnantWithStaleRecord = { ...s, activeConditions: [], lifecycleStatus: 'relic_ruin' };
    const resurrected = reapplyEventConditions(remnantWithStaleRecord);
    expect(resurrected.activeConditions.some((c) => c.archetype === 'plague'),
      'CONTROL: a stale eventConditions record re-promotes the plague on regen').toBe(true);

    // THE FIX: the death writer syncs the projection to the now-empty activeConditions.
    const dead = applySettlementLifecycleOutcomeToSettlement(s, deathOutcome(800));
    expect(dead.activeConditions).toEqual([]);
    expect(dead.config.eventConditions, 'config.eventConditions cleared').toEqual([]);
    expect(dead._config.eventConditions, 'the _config twin cleared (regen reads _config first)').toEqual([]);

    // DIE → REGEN → ZERO: replaying the projection on the dead remnant re-promotes nothing.
    const regenerated = reapplyEventConditions(dead);
    expect(regenerated.activeConditions, 'a dead remnant carries zero conditions after regen').toEqual([]);
  });

  it('r2 economy-upswing-6: a death with NO event-condition record stays byte-identical (no eventConditions key minted)', () => {
    // The common case: the sync is a strict no-op — it must not add an eventConditions key where
    // none existed, or it would perturb every ordinary death.
    const s = thorp('a', { peakTier: 'city', population: 12 });
    s.activeConditions = [{ id: 'c1', archetype: 'famine', label: 'Famine', severity: 0.5, affectedSystems: [] }];
    const dead = applySettlementLifecycleOutcomeToSettlement(s, deathOutcome(810));
    expect(dead.activeConditions).toEqual([]);
    expect('eventConditions' in dead.config, 'no eventConditions key minted on a plain death').toBe(false);
    expect('eventConditions' in dead._config).toBe(false);
  });

  it('self-contained re-verify: a stale death no-ops (recovered settlement / already-remnant)', () => {
    const recovered = { ...thorp('a', { peakTier: 'city', population: 200 }), tier: 'hamlet' };
    expect(applySettlementLifecycleOutcomeToSettlement(recovered, deathOutcome())).toBe(recovered);
    const remnant = thorp('a', { peakTier: 'city', lifecycleStatus: 'relic_ruin' });
    expect(applySettlementLifecycleOutcomeToSettlement(remnant, deathOutcome())).toBe(remnant);
  });
});

// ── RESETTLEMENT ───────────────────────────────────────────────────────────────
describe('resettlement (the privileged birth site)', () => {
  it('a remnant past its fallow emits a conserved candidate: deltas sum to EXACTLY zero', () => {
    const snapshot = makeSnapshot({
      a: thorp('a', { population: 0, peakTier: 'city', lifecycleStatus: 'relic_ruin', diedAt: 100 }),
      b: donorTown('b'), c: donorTown('c'),
    });
    const out = evalOnce(makeWorldState({ tick: 100 + T.RESETTLE_MIN_FALLOW + 5 }), snapshot, calmPIndex);
    expect(out.candidates.length).toBe(1);
    const cand = out.candidates[0];
    expect(cand.candidateType).toBe('settlement_resettled');
    // CONSERVATION: every settler credited to the old cell is a receipted debit
    // from a living donor — Σ == 0, exact.
    const sum = cand.populationDeltas.reduce((s, d) => s + d.delta, 0);
    expect(sum).toBe(0);
    const credit = cand.populationDeltas.find((d) => d.saveId === 'a');
    expect(credit.delta).toBeGreaterThanOrEqual(T.RESETTLE_SEED_MIN);
    // The relic ruin's name HALF-RETURNS.
    expect(cand.lifecyclePatch.name).toBe('New a-name');
  });

  it('the fallow dwell gates rebirth (no candidate before RESETTLE_MIN_FALLOW)', () => {
    const snapshot = makeSnapshot({
      a: thorp('a', { population: 0, peakTier: 'city', lifecycleStatus: 'relic_ruin', diedAt: 100 }),
      b: donorTown('b'),
    });
    const out = evalOnce(makeWorldState({ tick: 100 + T.RESETTLE_MIN_FALLOW - 2 }), snapshot, calmPIndex);
    expect(out.candidates).toEqual([]);
  });

  it('no willing settlers (no donor large enough) ⇒ no rebirth', () => {
    const snapshot = makeSnapshot({
      a: thorp('a', { population: 0, lifecycleStatus: 'abandoned_site', diedAt: 100 }),
      b: thorp('b', { population: 40 }), // far below the donor floor
    });
    const out = evalOnce(makeWorldState({ tick: 400 }), snapshot, calmPIndex);
    expect(out.candidates.filter((c) => c.candidateType === 'settlement_resettled')).toEqual([]);
  });

  it('the rebirth writer: status clears, tier restarts at thorp, peakTier RESTARTS, the name dual-writes', () => {
    const remnant = thorp('a', { population: 24, peakTier: 'city', lifecycleStatus: 'relic_ruin', diedAt: 100 });
    const reborn = applySettlementLifecycleOutcomeToSettlement(remnant, {
      id: 'outcome.resettle.a', targetSaveId: 'a',
      lifecyclePatch: { kind: 'resettle', saveId: 'a', name: 'New a-name' },
      metadata: { tick: 400 },
    });
    expect(lifecycleStatusOf(reborn)).toBe('');
    expect(reborn.tier).toBe('thorp');
    expect(reborn.name).toBe('New a-name');
    expect(reborn.config.customName).toBe('New a-name');       // regen keeps the new name
    expect(reborn._config.customName).toBe('New a-name');
    expect(reborn.config.peakTier).toBe('thorp');              // glory aspired to, not inherited
    expect(reborn._config.peakTier).toBe('thorp');
    expect(reborn.config.lifecycleDiedAtTick).toBeUndefined();
    expect(reborn.lifecycleHistory.at(-1)).toMatchObject({ event: 'resettled', fromGrade: 'relic_ruin', formerName: 'a-name' });
    const evt = (reborn.history.historicalEvents || []).find((e) => e.campaignEra);
    expect(evt.name).toContain('Raised on the Old Stones');
  });

  it('a stale rebirth no-ops (the site is alive again)', () => {
    const alive = thorp('a', { population: 30 });
    expect(applySettlementLifecycleOutcomeToSettlement(alive, {
      lifecyclePatch: { kind: 'resettle', saveId: 'a', name: 'X' }, metadata: { tick: 1 },
    })).toBe(alive);
  });
});

// ── GEOMETRY SURVIVES DEATH (full-pulse, spatial) ──────────────────────────────
describe('geometry survives death (the digest is untouched across a die-and-resettle cycle)', () => {
  it('a lit spatial pulse with a dying thorp never rewrites spatialDigest (same reference)', async () => {
    const { simulateCampaignWorldPulse } = await import('../../src/domain/worldPulse/index.js');
    const { ensureRegionalGraph } = await import('../../src/domain/region/index.js');
    const { buildSpatialDigest } = await import('../../src/domain/spatial/index.js');
    const { makeGridPack, placeSettlements } = await import('../fixtures/spatialPackFixtures.js');

    const pack = makeGridPack({ cols: 24, rows: 18 });
    const placed = placeSettlements(pack, 2);
    const digest = buildSpatialDigest({ pack, placements: [{ id: 'a', cellId: placed[0].cellId }, { id: 'b', cellId: placed[1].cellId }] });
    // A genuinely dying thorp: under the population floor, famine-stricken,
    // subsistence-poor, once a city (the scarcity law's relic case). Seed 'geo-5'
    // is empirically deterministic: the death draw fires on the first pulse.
    const dying = thorp('a', { population: 6, peakTier: 'city' });
    dying.economicState = { prosperity: 'Subsistence' };
    dying.activeConditions = [{ id: 'c1', archetype: 'famine', label: 'Famine', severity: 0.8, affectedSystems: ['food_security'] }];
    const saves = [
      { id: 'a', name: 'Ash', phase: 'canon', settlement: dying, campaignState: { phase: 'canon', eventLog: [], locks: {} } },
      { id: 'b', name: 'Brim', phase: 'canon', settlement: donorTown('b'), campaignState: { phase: 'canon', eventLog: [], locks: {} } },
    ];
    let campaign = {
      id: 'lc-geo', name: 'Geometry', settlementIds: ['a', 'b'],
      worldState: {
        rngSeed: 'geo-5', tick: 500,
        simulationRules: { settlementLifecycleEnabled: true, majorChangesRequireProposal: false, warLayerEnabled: false },
        calendar: { elapsedWeeks: 500, year: 10 }, stressors: [],
        spatialCanonVersion: 1, spatialDigest: digest,
        settlementTickStates: { a: { settlementLifecycle: { declineSince: 500 - T.TERMINAL_DWELL - 26 } } },
      },
      regionalGraph: ensureRegionalGraph({ edges: [{ id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'trade_partner' }] }),
      wizardNews: { currentTick: 500, entries: [] },
    };
    let currentSaves = saves;
    let sawDeath = false;
    // Keep pulsing PAST the death: the remnant must ride quietly (no crash, no
    // digest churn) with its cell intact.
    for (let t = 0; t < 12; t += 1) {
      const r = simulateCampaignWorldPulse({ campaign, saves: currentSaves, interval: 'one_month', now: '2026-01-01T00:00:00.000Z' });
      // THE GEOMETRY PIN: the frozen digest is the SAME OBJECT after every tick.
      expect(r.worldState.spatialDigest).toBe(digest);
      const updates = new Map((r.settlementUpdates || []).map((u) => [String(u.saveId), u.settlement]));
      currentSaves = currentSaves.map((s) => (updates.has(s.id) ? { ...s, settlement: updates.get(s.id) } : s));
      campaign = { ...campaign, worldState: r.worldState, regionalGraph: r.regionalGraph || campaign.regionalGraph };
      const a = currentSaves.find((s) => s.id === 'a').settlement;
      if (lifecycleStatusOf(a)) sawDeath = true;
    }
    expect(sawDeath, 'the thorp died within the window (anti-vacuity)').toBe(true);
    const a = currentSaves.find((s) => s.id === 'a').settlement;
    // Death is a STATUS: the save survives, the cell survives, the grade is the
    // scarcity law's (peakTier city ⇒ relic ruin).
    expect(lifecycleStatusOf(a)).toBe('relic_ruin');
    expect(a.population).toBe(0);
  }, 60_000);
});
