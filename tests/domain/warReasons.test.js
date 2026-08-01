/**
 * warReasons.test.js — W-PEACE-1 war-side reason pins (DESIGN_PEACE_ENGINE.md §14.1)
 * + THE SYMMETRY LAW (§14.3): counts, shapes, and the mirror walker.
 *
 * Every typed war reason carries a POSITIVE control (the state that should mint
 * it does) and a NEGATIVE control (its absence stays silent) — including the two
 * REGISTRATION SEAMS (treaty_default / corruption_exposed), whose positive
 * controls run the pure scorer on synthetic input because the upstream feeds
 * (treaties ledger / W-DOCTRINE) do not exist yet.
 */

import { describe, it, expect } from 'vitest';

import {
  WAR_REASON_TYPES, PEACE_REASON_TYPES, REASON_MIRRORS, REASON_TUNING,
  reasonPairKey, reasonRecord, foldPairReasons, aggregateReasons01, topReasons,
  peaceCausalActive, warReasonFactor, warReasonsFor, advanceWarReasons,
  scoreGrievance, scoreRevanchism, scoreResourcePressure, scoreTreatyDefault,
  scoreEncirclement, scoreLegitimacyHunger, scoreCorruptionExposed, scoreForeignClash,
} from '../../src/domain/worldPulse/warReasons.js';

// ── THE SYMMETRY LAW (§14.3) ─────────────────────────────────────────────────

describe('the symmetry law — war and peace reasons equally typed, equally receipted', () => {
  it('the reason-type counts match across war/peace', () => {
    expect(WAR_REASON_TYPES.length).toBe(PEACE_REASON_TYPES.length);
    // 7 wave-1 casus + W-CONVERGENCE's foreign_clash↔spheres_understanding + D4's
    // fear_of_dominance↔balance_restored + D7's two reframe casus (ingratitude_debt↔
    // debt_forgiven, dependency_by_design↔bonds_of_commerce) + the two motive-gap
    // closures: opportunism↔hopelessness (the vulture war, §14.1/§14.3) and
    // sacred_claim↔common_rite (the religious casus, §14.1 IDEOLOGY/FAITH).
    expect(WAR_REASON_TYPES.length).toBe(13);
  });

  it('the receipt shapes match across war/peace (the shared record factory)', () => {
    const warRec = reasonRecord({ type: WAR_REASON_TYPES[0], score: 0.5, tick: 3, receipt: 'a war why' });
    const peaceRec = reasonRecord({ type: PEACE_REASON_TYPES[0], score: 0.5, tick: 3, receipt: 'a peace why' });
    expect(Object.keys(warRec).sort()).toEqual(Object.keys(peaceRec).sort());
    expect(Object.keys(warRec).sort()).toEqual(['receipt', 'score', 'sinceTick', 'tick', 'type']);
  });

  it('the §14.3 mirror walker: the table is TOTAL and BIJECTIVE over the catalogs', () => {
    // Totality: every war reason names a mirror.
    expect(Object.keys(REASON_MIRRORS).sort()).toEqual([...WAR_REASON_TYPES].sort());
    // Bijection: the mirrors are exactly the peace catalog, no repeats.
    expect(Object.values(REASON_MIRRORS).sort()).toEqual([...PEACE_REASON_TYPES].sort());
    // A future reason added to either side without re-pairing the table is a
    // design defect this walker catches (the owner's "equally robust", permanent).
  });

  it('catalogs are frozen (no runtime mutation can un-pair the law)', () => {
    expect(Object.isFrozen(WAR_REASON_TYPES)).toBe(true);
    expect(Object.isFrozen(PEACE_REASON_TYPES)).toBe(true);
    expect(Object.isFrozen(REASON_MIRRORS)).toBe(true);
  });

  it('W-CONVERGENCE foreign_clash: positive control mints, negative control is silent', () => {
    expect(WAR_REASON_TYPES).toContain('foreign_clash');
    expect(REASON_MIRRORS.foreign_clash).toBe('spheres_understanding');
    expect(scoreForeignClash({ clash01: 0.6 }).score).toBeGreaterThan(0);
    expect(scoreForeignClash({ clash01: 0.6 }).receipt).toBeTruthy();
    expect(scoreForeignClash({ clash01: 0 }).score).toBe(0);
    expect(scoreForeignClash({ clash01: 0 }).receipt).toBe('');
  });
});

// ── The shared substrate ─────────────────────────────────────────────────────

describe('the shared substrate — fold, aggregate, bounds', () => {
  it('foldPairReasons: sub-threshold scores never materialize; empty folds to null', () => {
    expect(foldPairReasons(null, [{ type: 'grievance', score: 0.01, receipt: 'x' }], 5)).toBeNull();
    expect(foldPairReasons(null, [], 5)).toBeNull();
  });

  it('foldPairReasons: sinceTick survives a refold; a cleared reason drops (decay is inherent)', () => {
    const first = foldPairReasons(null, [{ type: 'grievance', score: 0.5, receipt: 'old wound' }], 3);
    expect(first.reasons.grievance.sinceTick).toBe(3);
    const second = foldPairReasons(first, [
      { type: 'grievance', score: 0.6, receipt: 'older wound' },
      { type: 'encirclement', score: 0.4, receipt: 'ringed' },
    ], 7);
    expect(second.reasons.grievance.sinceTick, 'the standing reason keeps its birth tick').toBe(3);
    expect(second.reasons.grievance.tick).toBe(7);
    expect(second.reasons.encirclement.sinceTick, 'the new reason stamps now').toBe(7);
    const third = foldPairReasons(second, [{ type: 'encirclement', score: 0.4, receipt: 'ringed' }], 9);
    expect(third.reasons.grievance, 'the resolved reason dissolves').toBeUndefined();
    expect(third.reasons.encirclement.sinceTick).toBe(7);
  });

  it('aggregateReasons01 is bounded 0..1 and saturates', () => {
    expect(aggregateReasons01(null)).toBe(0);
    const full = foldPairReasons(null, WAR_REASON_TYPES.map((type) => ({ type, score: 1, receipt: 'max' })), 1);
    expect(aggregateReasons01(full)).toBe(1);
  });

  it('topReasons orders by score desc with a codepoint tiebreak', () => {
    const entry = foldPairReasons(null, [
      { type: 'grievance', score: 0.4, receipt: 'g' },
      { type: 'encirclement', score: 0.9, receipt: 'e' },
      { type: 'revanchism', score: 0.4, receipt: 'r' },
    ], 1);
    expect(topReasons(entry, 2).map((r) => r.type)).toEqual(['encirclement', 'grievance']);
  });
});

// ── The gate ─────────────────────────────────────────────────────────────────

describe('peaceCausalActive — the fail-closed peace-engine gate', () => {
  it('requires BOTH warLayerEnabled and peaceEngineEnabled as explicit booleans', () => {
    expect(peaceCausalActive(null)).toBe(false);
    expect(peaceCausalActive({})).toBe(false);
    expect(peaceCausalActive({ simulationRules: {} })).toBe(false);
    expect(peaceCausalActive({ simulationRules: { warLayerEnabled: true } })).toBe(false);
    expect(peaceCausalActive({ simulationRules: { peaceEngineEnabled: true } })).toBe(false);
    expect(peaceCausalActive({ simulationRules: { warLayerEnabled: true, peaceEngineEnabled: 1 } })).toBe(false);
    expect(peaceCausalActive({ simulationRules: { warLayerEnabled: true, peaceEngineEnabled: 'true' } })).toBe(false);
    expect(peaceCausalActive({ simulationRules: { warLayerEnabled: true, peaceEngineEnabled: true } })).toBe(true);
  });
});

// ── The typed scorers: positive + negative controls ─────────────────────────

describe('war-reason scorers — each typed reason has a positive and a negative control', () => {
  it('grievance: resentment + memory mint it; a clean slate stays silent', () => {
    const hot = scoreGrievance({ resentment: 0.8, memoryScore: 0.4 });
    expect(hot.score).toBeGreaterThan(REASON_TUNING.MIN_SCORE);
    expect(hot.receipt.length).toBeGreaterThan(0);
    expect(scoreGrievance({ resentment: 0, memoryScore: 0 }).score).toBe(0);
    expect(scoreGrievance(null).score).toBe(0);
  });

  it('revanchism: an OLD war wound under a live grudge mints; fresh wounds and dead grudges stay silent', () => {
    const old = scoreRevanchism({ resentment: 0.6, recentIncidents: [{ type: 'war_raid', tick: 2 }] }, 20);
    expect(old.score).toBeGreaterThan(0);
    expect(old.receipt).toMatch(/unforgotten/i);
    // Negative: the wound is too fresh (the grievance lane owns it).
    expect(scoreRevanchism({ resentment: 0.6, recentIncidents: [{ type: 'war_raid', tick: 18 }] }, 20).score).toBe(0);
    // Negative: no live grudge (resentment under the floor).
    expect(scoreRevanchism({ resentment: 0.1, recentIncidents: [{ type: 'war_raid', tick: 2 }] }, 20).score).toBe(0);
    // Negative: old incident of a non-war type.
    expect(scoreRevanchism({ resentment: 0.6, recentIncidents: [{ type: 'trade_dispute', tick: 2 }] }, 20).score).toBe(0);
  });

  it('resource pressure: hunger beside plenty mints; plenty beside hunger stays silent', () => {
    expect(scoreResourcePressure({ own01: 0.8, foe01: 0.1 }).score).toBeGreaterThan(0);
    expect(scoreResourcePressure({ own01: 0.1, foe01: 0.8 }).score).toBe(0);
    expect(scoreResourcePressure({ own01: 0.5, foe01: 0.5 }).score).toBe(0);
  });

  it('treaty_default (REGISTRATION SEAM): a synthetic defaulted treaty mints; the absent feed stays silent', () => {
    const defaulted = scoreTreatyDefault({
      treaties: [{ parties: ['a', 'b'], complianceState: 'defaulted', defaultedBy: 'b', defaultSeverity01: 0.7 }],
      fromId: 'a', toId: 'b',
    });
    expect(defaulted.score).toBeCloseTo(0.7, 5);
    expect(defaulted.receipt).toMatch(/oathbreach/i);
    // Negative: no treaties feed (TODAY'S engine state — the seam is dark).
    expect(scoreTreatyDefault({ treaties: undefined, fromId: 'a', toId: 'b' }).score).toBe(0);
    // Negative: the OTHER party defaulted (my own default is not my casus).
    expect(scoreTreatyDefault({
      treaties: [{ parties: ['a', 'b'], complianceState: 'defaulted', defaultedBy: 'a' }],
      fromId: 'a', toId: 'b',
    }).score).toBe(0);
    // Negative: a compliant treaty.
    expect(scoreTreatyDefault({
      treaties: [{ parties: ['a', 'b'], complianceState: 'honored', defaultedBy: 'b' }],
      fromId: 'a', toId: 'b',
    }).score).toBe(0);
  });

  it('encirclement: a threatening environment with a hostile face mints; peace or friendship stays silent', () => {
    expect(scoreEncirclement({ threat01: 0.6, hostile: true }).score).toBeCloseTo(0.6, 5);
    expect(scoreEncirclement({ threat01: 0.6, hostile: false }).score).toBe(0);
    expect(scoreEncirclement({ threat01: 0, hostile: true }).score).toBe(0);
  });

  it('legitimacy hunger: a contested seat with an enemy to rally against mints; a stable seat stays silent', () => {
    const hungry = scoreLegitimacyHunger({ legitimacyScore: 20, hostile: true });
    expect(hungry.score).toBeGreaterThan(0.4);
    expect(scoreLegitimacyHunger({ legitimacyScore: 70, hostile: true }).score).toBe(0);
    expect(scoreLegitimacyHunger({ legitimacyScore: 20, hostile: false }).score).toBe(0);
  });

  it('corruption_exposed (REGISTRATION SEAM for W-DOCTRINE): a synthetic exposure mints; the absent hook stays silent', () => {
    expect(scoreCorruptionExposed({ exposedCorruption01: 0.7 }).score).toBeCloseTo(0.7, 5);
    expect(scoreCorruptionExposed({ exposedCorruption01: undefined }).score).toBe(0);
    expect(scoreCorruptionExposed({}).score).toBe(0);
  });
});

// ── The mover + the factor ───────────────────────────────────────────────────

const LIT_RULES = { warLayerEnabled: true, peaceEngineEnabled: true };

function litWorld(extra = {}) {
  return {
    simulationRules: { ...LIT_RULES },
    relationshipStates: {
      'edge.a.b': {
        relationshipType: 'hostile', resentment: 0.7, trust: 0.1,
        recentIncidents: [{ type: 'war_raid', tick: 1 }],
      },
    },
    ...extra,
  };
}

const EDGES = [{ id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'hostile' }];

function snapshotFor(items = []) {
  return {
    byId: new Map(items.map((i) => [String(i.id), i])),
    regionalGraph: { edges: EDGES },
  };
}

describe('advanceWarReasons — the mover', () => {
  it('dormant ⇒ identity no-op (same reference, no keys, changed false)', () => {
    const ws = { simulationRules: { warLayerEnabled: true }, relationshipStates: {} };
    const r = advanceWarReasons({ snapshot: snapshotFor(), worldState: ws, graph: { edges: EDGES }, tick: 12 });
    expect(r.worldState).toBe(ws);
    expect(r.changed).toBe(false);
    expect(ws.spatialLedgers).toBeUndefined();
  });

  it('lit ⇒ the aggrieved directed pair accumulates typed, receipted records', () => {
    const ws = litWorld();
    const r = advanceWarReasons({ snapshot: snapshotFor(), worldState: ws, graph: { edges: EDGES }, tick: 12 });
    expect(r.changed).toBe(true);
    const entry = warReasonsFor(r.worldState, 'a', 'b');
    expect(entry).toBeTruthy();
    expect(entry.reasons.grievance.score).toBeGreaterThan(0);
    expect(entry.reasons.grievance.receipt.length).toBeGreaterThan(0);
    // Revanchism: the raid at tick 1 is 11 ticks old under a 0.7 grudge.
    expect(entry.reasons.revanchism.score).toBeGreaterThan(0);
    // The registration seams stay silent (no feeds exist).
    expect(entry.reasons.treaty_default).toBeUndefined();
    expect(entry.reasons.corruption_exposed).toBeUndefined();
  });

  it('lit but clean world ⇒ no ledger materializes (state-derived silence)', () => {
    const ws = {
      simulationRules: { ...LIT_RULES },
      relationshipStates: { 'edge.a.b': { relationshipType: 'trade_partner', resentment: 0, trust: 0.6 } },
    };
    const edges = [{ id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'trade_partner' }];
    const r = advanceWarReasons({ snapshot: { byId: new Map(), regionalGraph: { edges } }, worldState: ws, graph: { edges }, tick: 12 });
    expect(r.changed).toBe(false);
    expect(r.worldState).toBe(ws);
  });

  it('a cleared world REFOLDS the standing ledger away (drop-when-empty end to end)', () => {
    const hot = advanceWarReasons({ snapshot: snapshotFor(), worldState: litWorld(), graph: { edges: EDGES }, tick: 12 });
    expect(warReasonsFor(hot.worldState, 'a', 'b')).toBeTruthy();
    // The grudge heals: same world, resentment and incidents cleared.
    const healedState = {
      ...hot.worldState,
      relationshipStates: { 'edge.a.b': { relationshipType: 'trade_partner', resentment: 0, trust: 0.6, recentIncidents: [] } },
    };
    const healedEdges = [{ id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'trade_partner' }];
    const cold = advanceWarReasons({
      snapshot: { byId: new Map(), regionalGraph: { edges: healedEdges } },
      worldState: healedState, graph: { edges: healedEdges }, tick: 13,
    });
    expect(cold.changed).toBe(true);
    expect(cold.worldState.spatialLedgers?.warReasons, 'the emptied ledger drops entirely').toBeUndefined();
  });

  it('determinism: the same world folds to the same serialized ledger', () => {
    const a = advanceWarReasons({ snapshot: snapshotFor(), worldState: litWorld(), graph: { edges: EDGES }, tick: 12 });
    const b = advanceWarReasons({ snapshot: snapshotFor(), worldState: litWorld(), graph: { edges: EDGES }, tick: 12 });
    expect(JSON.stringify(a.worldState.spatialLedgers.warReasons))
      .toBe(JSON.stringify(b.worldState.spatialLedgers.warReasons));
  });
});

describe('warReasonFactor — bounded, centered on 1.0 (the consumption read)', () => {
  it('is exactly 1.0 when dark, when the ledger is absent, and for an un-cased pair', () => {
    expect(warReasonFactor({ simulationRules: {} }, 'a', 'b')).toBe(1);
    expect(warReasonFactor({ simulationRules: { ...LIT_RULES } }, 'a', 'b')).toBe(1);
    const lit = advanceWarReasons({ snapshot: snapshotFor(), worldState: litWorld(), graph: { edges: EDGES }, tick: 12 });
    expect(warReasonFactor(lit.worldState, 'b', 'a'), 'the un-aggrieved direction may hold its own smaller case or none')
      .toBeGreaterThanOrEqual(1);
    expect(warReasonFactor(lit.worldState, 'x', 'y')).toBe(1);
  });

  it('rises with the case and never exceeds 1 + WAR_FACTOR_W', () => {
    const lit = advanceWarReasons({ snapshot: snapshotFor(), worldState: litWorld(), graph: { edges: EDGES }, tick: 12 });
    const f = warReasonFactor(lit.worldState, 'a', 'b');
    expect(f).toBeGreaterThan(1);
    expect(f).toBeLessThanOrEqual(1 + REASON_TUNING.WAR_FACTOR_W);
  });

  it('reasonPairKey is directional', () => {
    expect(reasonPairKey('a', 'b')).toBe('a>b');
    expect(reasonPairKey('a', 'b')).not.toBe(reasonPairKey('b', 'a'));
  });
});
