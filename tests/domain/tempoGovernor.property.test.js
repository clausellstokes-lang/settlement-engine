/**
 * tempoGovernor.property.test.js — the E0 ON pins (design §5 / plan §8B). Activates
 * the governor via an explicit `narrativeTempo` axis and proves the design law:
 * throttle SPONTANEITY, never CAUSALITY.
 *
 * Two layers:
 *  - SEAM unit pins (rollCandidates + a deterministic rng stub): class budget, chain
 *    immunity, grace exemption, simultaneity, deferral determinism, quiet-before-storm.
 *  - FULL-PULSE integration (simulateCampaignWorldPulse, governor lit on the rules):
 *    dial monotonicity + no-crowd-out — proving the wiring is live end-to-end.
 */
import { describe, expect, test } from 'vitest';

import { rollCandidates } from '../../src/domain/worldPulse/candidateEvents.js';
import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import {
  buildTempoContext,
  readTempoLedger,
  governBirth,
  dramaClassOf,
  isChainedConsequence,
  TEMPO_BUDGETS,
  TEMPO_WINDOW_WEEKS,
} from '../../src/domain/worldPulse/narrativeTempo.js';

// A deterministic rng: no fork() ⇒ rollCandidates falls back to the shared stream;
// random()===0 ⇒ every rolled candidate passes (roll 0 <= probability). So anything
// ABSENT from `selected` was DEFERRED (skipped before the roll), never a roll miss.
const passRng = { random: () => 0 };

/** Build the seam tempo context from a synthetic pre-tick ledger. */
function tempoCtx({ tier = 'dramatic_campaign', elapsedWeeks = 60, classStamps = {}, stressors = [], settlement = {} }) {
  /** @type {Record<string, number[]>} */
  const realm = {};
  for (const [cls, n] of Object.entries(classStamps)) {
    realm[cls] = Array.from({ length: n }, () => elapsedWeeks); // n IN-WINDOW stamps
  }
  const worldState = { calendar: { elapsedWeeks }, stressors, narrativeTempo: { realm, settlement } };
  return buildTempoContext(worldState, { narrativeTempo: tier });
}

const opts = (tempo) => ({ maxAuto: 7, maxProposals: 5, volatility: 1, tempo });
const famineBirth = (id, sid) => ({ id, candidateType: 'stressor_birth_famine', ruleFamily: 'stressor', targetSaveId: sid, probability: 0.3, applyMode: 'auto', severity: 0.6 });
const siegeBirth = (id, sid) => ({ id, candidateType: 'stressor_birth_siege', ruleFamily: 'stressor', targetSaveId: sid, probability: 0.3, applyMode: 'auto', severity: 0.6 });
const spreadFamine = (id, sid) => ({ id, candidateType: 'stressor_spread_famine', ruleFamily: 'stressor', targetSaveId: sid, probability: 0.3, applyMode: 'auto', severity: 0.6, condition: { causes: [{ source: 'world_stressor.famine.a' }] } });
const residual = (id, sid) => ({ id, candidateType: 'stressor_residual', ruleFamily: 'stressor', targetSaveId: sid, probability: 1, applyMode: 'auto', severity: 0.5 });
const governmentChallenge = (id, sid) => ({
  id,
  candidateType: 'faction_government_challenge',
  ruleFamily: 'faction',
  targetSaveId: sid,
  factionId: `${sid}:challenger`,
  probability: 0.5,
  applyMode: 'proposal',
  severity: 0.8,
  proposalPayload: {
    kind: 'government_change',
    settlementId: sid,
    factionId: `${sid}:challenger`,
  },
});

const CM = TEMPO_BUDGETS.dramatic_campaign.classMax; // 3
const AM = TEMPO_BUDGETS.dramatic_campaign.arcMax;   // 7

describe('CLASS BUDGET — an over-budget spontaneous birth is deferred, once', () => {
  test('the (classMax+1)th famine of the window is absent from selected AND recorded once in deferred', () => {
    const ctx = tempoCtx({ classStamps: { economic_shock: CM } }); // economic_shock at budget.
    const { selected, deferred } = rollCandidates([famineBirth('c.famine.x', 'x')], passRng, opts(ctx));
    expect(selected.map((s) => s.id)).not.toContain('c.famine.x');
    expect(deferred).toHaveLength(1);
    expect(deferred[0]).toMatchObject({ class: 'economic_shock', reason: 'class_budget', settlementId: 'x' });
  });

  test('UNDER budget the same birth passes (anti-vacuity: the machinery moves when lit)', () => {
    const ctx = tempoCtx({ classStamps: { economic_shock: CM - 1 } });
    const { selected, deferred } = rollCandidates([famineBirth('c.famine.x', 'x')], passRng, opts(ctx));
    expect(selected.map((s) => s.id)).toContain('c.famine.x');
    expect(deferred).toHaveLength(0);
  });

  test('classMax is a hard same-tick ceiling across multiple passing candidates', () => {
    const fullMax = TEMPO_BUDGETS.full_simulation.classMax;
    const ctx = tempoCtx({
      tier: 'full_simulation',
      classStamps: { succession_coup: fullMax - 1 },
    });
    const { selected, deferred } = rollCandidates(
      [
        governmentChallenge('c.gov.a', 'a'),
        governmentChallenge('c.gov.b', 'b'),
      ],
      passRng,
      opts(ctx),
    );

    expect(selected.map(candidate => candidate.id)).toEqual(['c.gov.a']);
    expect(deferred).toEqual([{
      class: 'succession_coup',
      settlementId: 'b',
      reason: 'class_budget',
    }]);
  });

  test('a failed same-class roll consumes no in-tick class slot', () => {
    const fullMax = TEMPO_BUDGETS.full_simulation.classMax;
    const ctx = tempoCtx({
      tier: 'full_simulation',
      classStamps: { succession_coup: fullMax - 1 },
    });
    const rolls = [1, 0];
    const { selected, deferred } = rollCandidates(
      [
        governmentChallenge('c.gov.a', 'a'),
        governmentChallenge('c.gov.b', 'b'),
      ],
      { random: () => rolls.shift() ?? 1 },
      opts(ctx),
    );

    expect(selected.map(candidate => candidate.id)).toEqual(['c.gov.b']);
    expect(deferred).toEqual([]);
  });
});

describe('CHAIN IMMUNITY — a receipted consequence fires while its class is over budget (the design law proof)', () => {
  test('a stressor_spread_famine STILL lands even with economic_shock over budget; the fresh birth defers', () => {
    const ctx = tempoCtx({ classStamps: { economic_shock: CM } });
    const { selected, deferred } = rollCandidates(
      [spreadFamine('c.spread.b', 'b'), famineBirth('c.famine.x', 'x')],
      passRng, opts(ctx),
    );
    const ids = selected.map((s) => s.id);
    expect(ids).toContain('c.spread.b');       // chained consequence — never throttled.
    expect(ids).not.toContain('c.famine.x');   // fresh spontaneous birth — deferred.
    expect(deferred).toHaveLength(1);
    expect(isChainedConsequence(spreadFamine('c.spread.b', 'b'))).toBe(true);
  });

  test('a probability>=1 residual still fires while over budget', () => {
    const ctx = tempoCtx({ classStamps: { economic_shock: CM } });
    const { selected, deferred } = rollCandidates([residual('c.res.a', 'a')], passRng, opts(ctx));
    expect(selected.map((s) => s.id)).toContain('c.res.a');
    expect(deferred).toHaveLength(0);
  });
});

describe('GRACE — a settlement inside its post-major grace emits no NEW major, but still receives chains', () => {
  test('a fresh famine birth at a grace settlement defers; a chained spread at the SAME settlement lands', () => {
    const graceWeeks = TEMPO_BUDGETS.dramatic_campaign.graceWeeks; // 8
    const ctx = tempoCtx({ elapsedWeeks: 60, settlement: { g: { lastMajorWeek: 60 - (graceWeeks - 2) } } });
    const { selected, deferred } = rollCandidates(
      [famineBirth('c.famine.g', 'g'), spreadFamine('c.spread.g', 'g')],
      passRng, opts(ctx),
    );
    const ids = selected.map((s) => s.id);
    expect(ids).not.toContain('c.famine.g');   // new independent major — grace-deferred.
    expect(ids).toContain('c.spread.g');       // chained consequence — lands regardless.
    expect(deferred).toHaveLength(1);
    expect(deferred[0]).toMatchObject({ reason: 'grace', settlementId: 'g' });
  });

  test('a fresh birth at a NON-grace settlement (class under budget) passes', () => {
    const graceWeeks = TEMPO_BUDGETS.dramatic_campaign.graceWeeks;
    const ctx = tempoCtx({ elapsedWeeks: 60, settlement: { g: { lastMajorWeek: 60 - (graceWeeks - 2) } } });
    const { selected } = rollCandidates([famineBirth('c.famine.h', 'h')], passRng, opts(ctx));
    expect(selected.map((s) => s.id)).toContain('c.famine.h');
  });
});

describe('SIMULTANEITY — realm saturated ⇒ the LOWEST-priority pending class defers, higher-priority does not', () => {
  test('with liveArcs >= arcMax, the economic_shock birth defers while the war birth lands (codepoint priority, no rng)', () => {
    // arcMax live war stressors saturate the realm; both classes are UNDER their class budget.
    const stressors = Array.from({ length: AM }, (_, i) => ({ id: `s${i}`, type: 'siege', lifecycleStage: 'active' }));
    const ctx = tempoCtx({ stressors });
    const { selected, deferred } = rollCandidates(
      [siegeBirth('c.siege.w', 'w'), famineBirth('c.famine.e', 'e')],
      passRng, opts(ctx),
    );
    const ids = selected.map((s) => s.id);
    expect(ids).toContain('c.siege.w');        // war outranks economic_shock — it lands.
    expect(ids).not.toContain('c.famine.e');   // economic_shock is the lowest pending class — defers.
    expect(deferred).toHaveLength(1);
    expect(deferred[0]).toMatchObject({ class: 'economic_shock', reason: 'simultaneity' });
  });

  test('BELOW arcMax nothing simultaneity-defers (anti-vacuity)', () => {
    const stressors = Array.from({ length: AM - 1 }, (_, i) => ({ id: `s${i}`, type: 'siege', lifecycleStage: 'active' }));
    const ctx = tempoCtx({ stressors });
    const { selected } = rollCandidates([siegeBirth('c.siege.w', 'w'), famineBirth('c.famine.e', 'e')], passRng, opts(ctx));
    expect(selected.map((s) => s.id).sort()).toEqual(['c.famine.e', 'c.siege.w']);
  });
});

describe('DEFERRAL DETERMINISM — same inputs ⇒ identical deferral set (zero rng)', () => {
  test('two identical seam rolls produce byte-identical deferred arrays', () => {
    const mkCtx = () => tempoCtx({ classStamps: { economic_shock: CM }, stressors: Array.from({ length: AM }, (_, i) => ({ id: `s${i}`, type: 'siege', lifecycleStage: 'active' })) });
    const cands = () => [famineBirth('c.famine.x', 'x'), siegeBirth('c.siege.w', 'w'), spreadFamine('c.spread.b', 'b')];
    const one = rollCandidates(cands(), passRng, opts(mkCtx())).deferred;
    const two = rollCandidates(cands(), passRng, opts(mkCtx())).deferred;
    expect(JSON.stringify(one)).toBe(JSON.stringify(two));
  });
});

describe('QUIET-BEFORE-STORM — the slot re-opens deterministically as an in-window birth ages out (Model A)', () => {
  test('over-budget ⇒ defer; once the stamp ages past the window ⇒ the same class passes again', () => {
    const budget = TEMPO_BUDGETS.dramatic_campaign;
    const bornWeek = 10;
    const worldStateAt = (elapsedWeeks) => ({ calendar: { elapsedWeeks }, stressors: [], narrativeTempo: { realm: { economic_shock: Array.from({ length: budget.classMax }, () => bornWeek) } } });
    const config = { active: true, budgets: budget, lowestPendingClass: null };
    const cand = famineBirth('c.famine.x', 'x');

    // While the stamps are IN-window: the class is at budget ⇒ defer.
    const during = governBirth({ candidate: cand, snapshot: readTempoLedger(worldStateAt(bornWeek + 5), bornWeek + 5), config });
    expect(during.defer).toBe(true);
    expect(during.reason).toBe('class_budget');

    // Once elapsedWeeks - bornWeek >= WINDOW: the stamps expire ⇒ slot opens ⇒ pass.
    const after = governBirth({ candidate: cand, snapshot: readTempoLedger(worldStateAt(bornWeek + TEMPO_WINDOW_WEEKS), bornWeek + TEMPO_WINDOW_WEEKS), config });
    expect(after.defer).toBe(false);
  });
});

// ── FULL-PULSE INTEGRATION ────────────────────────────────────────────────────
const NOW = '2026-01-01T00:00:00.000Z';
const GRAIN = 'Bulk grain and foodstuffs';
const PIDS = ['a', 'b', 'c', 'd', 'e', 'f'];

function pSettlement(name, { exports = [], imports = [], patch = {} } = {}) {
  return {
    name, tier: 'town', population: 1700,
    config: { tradeRouteAccess: 'road', priorityEconomy: 25, priorityMilitary: 35 },
    institutions: [],
    economicState: { primaryExports: exports, primaryImports: imports },
    powerStructure: {
      publicLegitimacy: { score: 22, label: 'Legitimacy Crisis' },
      factions: [
        { faction: 'Merchant League', category: 'economy', power: 70 },
        { faction: 'Temple Wardens', category: 'religious', power: 58 },
        { faction: 'City Guard', category: 'military', power: 48 },
      ],
      conflicts: [],
    },
    npcs: [{ id: `reeve_${name}`, name: `Reeve ${name}`, importance: 'key' }],
    activeConditions: [],
    ...patch,
  };
}
const pSave = (id, name, opts) => ({ id, name, phase: 'canon', settlement: pSettlement(name, opts), campaignState: { phase: 'canon', eventLog: [], locks: {} } });
const pChannel = (to) => ({ id: `ch.a.${to}`, type: 'trade_dependency', from: 'a', to, goods: [{ id: 'grain', label: GRAIN }], strength: 0.7, status: 'confirmed' });
function pSaves() {
  return [
    pSave('a', 'Ashford', { exports: [GRAIN], patch: { activeConditions: [{ archetype: 'regional_import_shortage', severity: 0.85 }] } }),
    pSave('b', 'Briar', { imports: [GRAIN], patch: { activeConditions: [{ archetype: 'regional_import_shortage', severity: 0.8 }] } }),
    pSave('c', 'Crown', { imports: [GRAIN] }), pSave('d', 'Deep', { imports: [GRAIN] }),
    pSave('e', 'Eld', { imports: [GRAIN] }), pSave('f', 'Fen', { imports: [GRAIN] }),
  ];
}
function pCampaign(tier) {
  return {
    id: 'tempo-prop', name: 'Tempo Prop', settlementIds: [...PIDS],
    worldState: {
      rngSeed: 'tempo-prop-seed', tick: 1, calendar: { elapsedWeeks: 4 },
      ...(tier ? { simulationRules: { narrativeTempo: tier } } : {}),
      stressors: [
        { id: 'world_stressor.famine.a', type: 'famine', severity: 0.92, affectedSettlementIds: ['a'], age: 3 },
        { id: 'world_stressor.famine.b', type: 'famine', severity: 0.86, affectedSettlementIds: ['b'], age: 2 },
        { id: 'world_stressor.disease_outbreak.c', type: 'disease_outbreak', severity: 0.72, affectedSettlementIds: ['c'], age: 1 },
      ],
    },
    regionalGraph: ensureRegionalGraph({
      edges: PIDS.slice(1).map((to) => ({ id: `e.a.${to}`, from: 'a', to, relationshipType: 'trade_partner' })),
      channels: PIDS.slice(1).map(pChannel),
    }),
    wizardNews: { currentTick: 1, entries: [] },
  };
}
function driveCount(tier, ticks) {
  let campaign = pCampaign(tier); let saves = pSaves();
  let births = 0; let nonGoverned = 0;
  for (let t = 0; t < ticks; t++) {
    const r = simulateCampaignWorldPulse({ campaign, saves, interval: 'one_month', now: NOW });
    for (const o of r.selected || []) {
      if (dramaClassOf(o) !== null && !isChainedConsequence(o)) births += 1;
      else nonGoverned += 1;
    }
    const updates = new Map((r.settlementUpdates || []).map((u) => [String(u.saveId), u.settlement]));
    saves = saves.map((s) => (updates.has(s.id) ? { ...s, settlement: updates.get(s.id) } : s));
    campaign = { ...campaign, worldState: r.worldState, regionalGraph: r.regionalGraph || campaign.regionalGraph };
  }
  return { births, nonGoverned };
}

describe('DIAL MONOTONICITY (full pulse) — louder tempo ⇒ ≥ arc births, same seed', () => {
  test('quiet_local <= realistic_regional <= dramatic_campaign <= full_simulation <= OFF', () => {
    const quiet = driveCount('quiet_local', 24).births;
    const realistic = driveCount('realistic_regional', 24).births;
    const dramatic = driveCount('dramatic_campaign', 24).births;
    const full = driveCount('full_simulation', 24).births;
    const off = driveCount(null, 24).births;
    expect(quiet).toBeLessThanOrEqual(realistic);
    expect(realistic).toBeLessThanOrEqual(dramatic);
    expect(dramatic).toBeLessThanOrEqual(full);
    expect(full).toBeLessThanOrEqual(off);
    // Anti-vacuity: the governor MEASURABLY throttles (OFF strictly exceeds quiet).
    expect(off).toBeGreaterThan(quiet);
  }, 30_000);
});

describe('NO-CROWD-OUT (full pulse) — a lit governor does not budget-starve OTHER families', () => {
  test('non-governed candidates still flow when the governor is active', () => {
    const { nonGoverned } = driveCount('quiet_local', 12);
    expect(nonGoverned).toBeGreaterThan(0);
  }, 30_000);
});
