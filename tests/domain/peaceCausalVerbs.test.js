/**
 * peaceCausalVerbs.test.js — W-PEACE-1 Tier 3: the forceable verbs
 * (DECLARE_CASUS / SUE_FOR_PEACE class) under the COUNTERPART CRITERION.
 *
 * The verbs ship as PURE, GATED worldState mutations (the same-function core a
 * W-COMPOSER-2 manifest entry wraps verbatim — see the module headers for why
 * they are NOT settlement-scoped manifest entries this wave: the applyEvent
 * pipeline has no worldState channel and realm verbs are the coverage walker's
 * documented W-COMPOSER-2 deferral). The counterpart discipline pinned here:
 *   - PREVIEW ≡ APPLY: pure + deterministic — same input, deep-equal output,
 *     for grants AND refusals.
 *   - VETO-CHANNEL COMPLIANCE: every refusal carries a typed code, every code
 *     has DM-facing prose, and the gate-dark refusal fires before any read.
 *   - DIAL CLAMP (clampAtCommit): the decree severity is clamped into
 *     [MIN_SCORE, 1] at commit — no ghost records, no out-of-bounds scores.
 *   - END-TO-END EXECUTION: a decree-minted casus moves the same consumption
 *     factor the accumulated ones do; a decree recall is resolved by the war
 *     layer's own withdrawal path (the stamp contract cannot silently drift).
 */

import { describe, it, expect } from 'vitest';

import {
  declareCasus, CASUS_VETO_PROSE, warReasonsFor, warReasonFactor, REASON_TUNING,
  WAR_REASON_TYPES, DECLARABLE_WAR_REASON_TYPES, advanceWarReasons,
} from '../../src/domain/worldPulse/warReasons.js';
import { sueForPeaceOrder, PEACE_VETO_PROSE } from '../../src/domain/worldPulse/peaceReasons.js';
import { evaluateWarLayer } from '../../src/domain/worldPulse/warDeployment.js';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { createPRNG } from '../../src/kernel/prng.js';

const LIT_RULES = { warLayerEnabled: true, peaceEngineEnabled: true };
const litWorld = (extra = {}) => ({ simulationRules: { ...LIT_RULES }, ...extra });

describe('DECLARE_CASUS — the war-side forceable verb', () => {
  it('gate dark ⇒ typed refusal BEFORE any state read (dormancy absolute)', () => {
    const r = declareCasus({ simulationRules: { warLayerEnabled: true } }, { fromId: 'a', toId: 'b', type: 'grievance' });
    expect(r).toEqual({ ok: false, code: 'casus_gate_dark', detail: 'peace-engine gate absent' });
  });

  it('unknown reason type and self-target refuse with typed codes', () => {
    expect(declareCasus(litWorld(), { fromId: 'a', toId: 'b', type: 'vibes' }))
      .toEqual({ ok: false, code: 'casus_unknown_type', detail: 'vibes' });
    expect(declareCasus(litWorld(), { fromId: 'a', toId: 'a', type: 'grievance' }))
      .toEqual({ ok: false, code: 'casus_self', detail: 'a' });
  });

  it('engine-derived lineage cannot be manufactured by the generic decree verb', () => {
    expect(WAR_REASON_TYPES).toContain('lineage_claim');
    expect(DECLARABLE_WAR_REASON_TYPES).not.toContain('lineage_claim');
    expect(declareCasus(litWorld(), { fromId: 'a', toId: 'b', type: 'lineage_claim' }))
      .toEqual({ ok: false, code: 'casus_engine_derived', detail: 'lineage_claim' });
  });

  it('a lit decree mints the typed, receipted record and the consumption factor rises', () => {
    const r = declareCasus(litWorld(), { fromId: 'a', toId: 'b', type: 'grievance', severity01: 0.8, tick: 5 });
    expect(r.ok).toBe(true);
    const entry = warReasonsFor(r.worldState, 'a', 'b');
    expect(entry.reasons.grievance.score).toBeCloseTo(0.8, 5);
    expect(entry.reasons.grievance.sinceTick).toBe(5);
    expect(entry.reasons.grievance.receipt).toMatch(/decree/i);
    expect(warReasonFactor(r.worldState, 'a', 'b')).toBeGreaterThan(1);
    expect(warReasonsFor(r.worldState, 'b', 'a'), 'the decree is directional').toBeNull();
  });

  it('DIAL CLAMP (clampAtCommit): severity clamps into [MIN_SCORE, 1] — no ghosts, no overshoot', () => {
    const low = declareCasus(litWorld(), { fromId: 'a', toId: 'b', type: 'grievance', severity01: 0.001, tick: 1 });
    expect(warReasonsFor(low.worldState, 'a', 'b').reasons.grievance.score).toBeCloseTo(REASON_TUNING.MIN_SCORE, 5);
    const high = declareCasus(litWorld(), { fromId: 'a', toId: 'b', type: 'grievance', severity01: 9, tick: 1 });
    expect(warReasonsFor(high.worldState, 'a', 'b').reasons.grievance.score).toBe(1);
  });

  it('a renewal preserves sinceTick (the decree renews, never re-births)', () => {
    const first = declareCasus(litWorld(), { fromId: 'a', toId: 'b', type: 'revanchism', severity01: 0.5, tick: 3 });
    const second = declareCasus(first.worldState, { fromId: 'a', toId: 'b', type: 'revanchism', severity01: 0.9, tick: 9 });
    const rec = warReasonsFor(second.worldState, 'a', 'b').reasons.revanchism;
    expect(rec.sinceTick).toBe(3);
    expect(rec.tick).toBe(9);
    expect(rec.score).toBeCloseTo(0.9, 5);
  });

  it('PREVIEW ≡ APPLY: pure and deterministic for grants and refusals alike', () => {
    const ws = litWorld();
    const args = { fromId: 'a', toId: 'b', type: 'encirclement', severity01: 0.7, tick: 4 };
    const preview = declareCasus(ws, args);
    const apply = declareCasus(ws, args);
    expect(preview).toEqual(apply);
    expect(ws.spatialLedgers, 'the input worldState is never mutated').toBeUndefined();
    const refusal1 = declareCasus(ws, { fromId: 'a', toId: 'a', type: 'grievance' });
    const refusal2 = declareCasus(ws, { fromId: 'a', toId: 'a', type: 'grievance' });
    expect(refusal1).toEqual(refusal2);
  });

  it('VETO-CHANNEL COMPLIANCE: every refusal code carries DM-facing prose, and no prose is stale', () => {
    const raised = ['casus_gate_dark', 'casus_unknown_type', 'casus_engine_derived', 'casus_self'];
    expect(Object.keys(CASUS_VETO_PROSE).sort()).toEqual([...raised].sort());
    for (const code of raised) {
      expect(CASUS_VETO_PROSE[code].length).toBeGreaterThan(20);
    }
  });

  it('every authorable reason is decree-able; the derived subset remains closed', () => {
    for (const type of DECLARABLE_WAR_REASON_TYPES) {
      const r = declareCasus(litWorld(), { fromId: 'a', toId: 'b', type, severity01: 0.5, tick: 1 });
      expect(r.ok, `${type} is decree-able`).toBe(true);
    }
    expect(DECLARABLE_WAR_REASON_TYPES).toHaveLength(WAR_REASON_TYPES.length - 1);
  });
});

describe('DECLARE_CASUS r2 worldpulse-war-military-5 — the decree survives the state-derived fold, decays, and expires', () => {
  // Decree FOREIGN_CLASH: its organic scorer (scoreForeignClash) reads the convergence ledger,
  // which is dark here ⇒ organic 0. So the decreed reason is the SOLE contributor for that type
  // and its ramp is directly observable (a neutral pair still mints a small ORGANIC grievance,
  // hence the separate reason type). Before the fix, advanceWarReasons rebuilt the ledger from
  // state each tick and the decree vanished after exactly one tick.
  const snapshot = () => ({ byId: new Map([['a', { id: 'a' }], ['b', { id: 'b' }]]) });
  const graph = { edges: [{ id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'neutral' }], channels: [] };
  const world = () => litWorld({ relationshipStates: { 'edge.a.b': { relationshipType: 'neutral' } } });
  const fold = (ws, tick) => advanceWarReasons({ snapshot: snapshot(), worldState: ws, graph, pIndex: null, tick }).worldState;
  const clashScore = (ws) => warReasonsFor(ws, 'a', 'b')?.reasons?.foreign_clash?.score ?? null;

  it('a decree LASTS across the fold, DECAYS visibly, and is never immortal', () => {
    const declared = declareCasus(world(), { fromId: 'a', toId: 'b', type: 'foreign_clash', severity01: 0.8, tick: 5 }).worldState;
    expect(clashScore(declared)).toBeCloseTo(0.8, 5); // stands at full the declare tick

    // Tick 6: the fold used to ERASE it — now it survives, decayed below its decreed severity.
    const t6 = fold(declared, 6);
    const s6 = clashScore(t6);
    expect(s6, 'the decree survived the state-derived rebuild (the bug: it vanished at tick 2)').toBeTruthy();
    expect(s6).toBeGreaterThan(REASON_TUNING.MIN_SCORE);
    expect(s6).toBeLessThan(0.8); // decayed

    // Tick 7 (chained): still present, still lower — a visible ramp.
    const t7 = fold(t6, 7);
    const s7 = clashScore(t7);
    expect(s7).toBeGreaterThan(REASON_TUNING.MIN_SCORE);
    expect(s7).toBeLessThan(s6);

    // At/after decreedUntilTick (5 + DECREE_RAMP_TICKS = 13) the decree EXPIRES — never immortal.
    let ws = t7;
    for (let t = 8; t <= 5 + REASON_TUNING.DECREE_RAMP_TICKS; t++) ws = fold(ws, t);
    expect(clashScore(ws), 'the decree expired at its decreedUntilTick — not immortal').toBeNull();
    expect(warReasonsFor(ws, 'a', 'b')?.decreedReasons, 'the decree sub-ledger is pruned at expiry').toBeUndefined();
  });

  it('ORGANIC SUBSUMES: a live organic grievance ≥ the decayed decree keeps its own record (force ≡ organic)', () => {
    // A hostile pair with real resentment produces an organic grievance; a small decree cannot
    // lower it (max-merge), and the organic reason persists after the decree would have expired.
    const hostile = litWorld({ relationshipStates: { 'edge.a.b': { relationshipType: 'hostile', resentment: 0.9, memoryScore: 0.9 } } });
    const hostileGraph = { edges: [{ id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'hostile' }], channels: [] };
    const declared = declareCasus(hostile, { fromId: 'a', toId: 'b', type: 'grievance', severity01: REASON_TUNING.MIN_SCORE, tick: 1 }).worldState;
    const folded = advanceWarReasons({ snapshot: snapshot(), worldState: declared, graph: hostileGraph, pIndex: null, tick: 2 }).worldState;
    const rec = warReasonsFor(folded, 'a', 'b')?.reasons?.grievance;
    expect(rec, 'the organic grievance stands').toBeTruthy();
    expect(rec.score).toBeGreaterThan(REASON_TUNING.MIN_SCORE); // organic, not the tiny decree
  });

  it('DORMANCY: with no decree ever issued, the fold mints no decree sub-ledger (the carry is inert)', () => {
    const ws = world();
    const a = advanceWarReasons({ snapshot: snapshot(), worldState: ws, graph, pIndex: null, tick: 3 });
    const b = advanceWarReasons({ snapshot: snapshot(), worldState: ws, graph, pIndex: null, tick: 3 });
    expect(JSON.stringify(a.worldState)).toBe(JSON.stringify(b.worldState)); // deterministic
    expect(warReasonsFor(a.worldState, 'a', 'b')?.decreedReasons, 'no decree ⇒ no decreedReasons key added').toBeUndefined();
  });
});

describe('SUE_FOR_PEACE — the peace-side forceable verb', () => {
  const warWorld = () => litWorld({
    deployments: { a: { targetId: 'b', sinceTick: 1, role: 'siege', currentEffectiveStrength: 10, maxStartStrength: 10 } },
  });

  it('gate dark ⇒ typed refusal; no war ⇒ typed refusal; repeat order ⇒ typed refusal', () => {
    expect(sueForPeaceOrder({ simulationRules: { warLayerEnabled: true }, deployments: { a: { targetId: 'b' } } }, { partyId: 'a', foeId: 'b' }))
      .toEqual({ ok: false, code: 'peace_gate_dark', detail: 'peace-engine gate absent' });
    expect(sueForPeaceOrder(litWorld({ deployments: {} }), { partyId: 'a', foeId: 'b' }))
      .toEqual({ ok: false, code: 'peace_no_deployment', detail: 'a>b' });
    const first = sueForPeaceOrder(warWorld(), { partyId: 'a', foeId: 'b', tick: 6 });
    expect(first.ok).toBe(true);
    expect(sueForPeaceOrder(first.worldState, { partyId: 'a', foeId: 'b', tick: 7 }))
      .toEqual({ ok: false, code: 'peace_already_ordered', detail: 'a' });
  });

  it('a lit order stamps the EXISTING recall contract on the live deployment', () => {
    const r = sueForPeaceOrder(warWorld(), { partyId: 'a', foeId: 'b', tick: 6 });
    expect(r.ok).toBe(true);
    expect(r.worldState.deployments.a.recalled).toEqual({ cause: 'sue_for_peace_decree', tick: 6 });
    // Directionality: the foe's (nonexistent) army is untouched.
    expect(r.worldState.deployments.b).toBeUndefined();
  });

  it('PREVIEW ≡ APPLY: pure and deterministic; the input worldState is never mutated', () => {
    const ws = warWorld();
    const preview = sueForPeaceOrder(ws, { partyId: 'a', foeId: 'b', tick: 6 });
    const apply = sueForPeaceOrder(ws, { partyId: 'a', foeId: 'b', tick: 6 });
    expect(preview).toEqual(apply);
    expect(ws.deployments.a.recalled).toBeUndefined();
  });

  it('VETO-CHANNEL COMPLIANCE: every refusal code carries DM-facing prose, none stale', () => {
    const raised = ['peace_gate_dark', 'peace_no_deployment', 'peace_already_ordered'];
    expect(Object.keys(PEACE_VETO_PROSE).sort()).toEqual([...raised].sort());
    for (const code of raised) expect(PEACE_VETO_PROSE[code].length).toBeGreaterThan(20);
  });

  it('END-TO-END: the war layer executes a decree-stamped recall as a withdrawal (the contract cannot drift)', () => {
    // A real war world (the consumption-test fixture shape): a besieges b.
    const settlement = (name, mil) => ({
      name, tier: 'town', population: 1800,
      config: { tradeRouteAccess: 'road', priorityMilitary: 35 },
      institutions: [],
      economicState: { prosperity: 'Prosperous', primaryExports: [], primaryImports: [] },
      powerStructure: { publicLegitimacy: { score: 60, label: 'Stable' }, factions: [{ faction: 'F', category: 'military', power: mil, isGoverning: true }], conflicts: [] },
      npcs: [], activeConditions: [],
    });
    const saves = [
      { id: 'a', name: 'Atown', phase: 'canon', settlement: settlement('Atown', 78), campaignState: { phase: 'canon', eventLog: [], locks: {} } },
      { id: 'b', name: 'Btown', phase: 'canon', settlement: settlement('Btown', 30), campaignState: { phase: 'canon', eventLog: [], locks: {} } },
    ];
    const baseState = {
      rngSeed: 'verb-e2e', tick: 6,
      relationshipStates: { 'edge.a.b': { relationshipType: 'hostile' } },
      deployments: { a: { targetId: 'b', sinceTick: 1, role: 'siege', maxStartStrength: 10, currentEffectiveStrength: 8, accumulatedAttrition: 0, deploymentAge: 5, objective: 'conquest', returnCondition: 'pending' } },
      simulationRules: { ...LIT_RULES },
    };
    const ordered = sueForPeaceOrder(baseState, { partyId: 'a', foeId: 'b', tick: 6 });
    expect(ordered.ok).toBe(true);
    const campaign = {
      id: 'verb-e2e', settlementIds: ['a', 'b'], worldState: ordered.worldState,
      regionalGraph: ensureRegionalGraph({ edges: [{ id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'hostile' }] }),
      wizardNews: { currentTick: 6, entries: [] },
    };
    const snapshot = buildWorldSnapshot({ campaign, saves, worldState: ordered.worldState });
    const war = evaluateWarLayer({
      snapshot, worldState: snapshot.worldState, rng: createPRNG('verb-e2e'), tick: 7, now: '2026-01-01T00:00:00.000Z',
      rules: ordered.worldState.simulationRules,
    });
    expect(war.deployments.a, 'the army marched home — the decree was executed by the existing withdrawal path').toBeUndefined();
    // The war layer receipts the recall through resolvedDeployments (the
    // downstream pulse composes the news from this record).
    const resolved = war.resolvedDeployments.find((r) => String(r.attackerId) === 'a');
    expect(resolved, 'the withdrawal was resolved').toBeTruthy();
    expect(resolved.outcome).toBe('withdrawal');
    expect(String(resolved.targetId)).toBe('b');
  });
});
