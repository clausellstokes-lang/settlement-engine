/**
 * peaceCausalConsumption.test.js — W-PEACE-1 Tier 2: the DECISIONS consume the
 * reason ledgers through the EXISTING §H loaded draws (DESIGN_PEACE_ENGINE.md §14).
 *
 * Three seams, each pinned lit AND dark:
 *   1. settlementStrategy's enumerateMoves — the deploy / sue_for_peace weights
 *      are multiplied by the bounded causal factors (the weights ARE the
 *      reasons); causal null/×1 ⇒ byte-identical scores.
 *   2. warDeployment's conquest-margin gate — an accumulated casus EMBOLDENS a
 *      march the dormant engine refuses (the differential pin), and the minted
 *      war record CARRIES its casus list (the §14 artifact law) with the
 *      receipt naming the typed reasons.
 *   3. The dark-with-ledger negative control: a hand-seeded ledger under a dark
 *      gate changes NOTHING (consumption is gate-checked, not ledger-checked).
 */

import { describe, it, expect } from 'vitest';

import { enumerateMoves, evaluateSettlementStrategyRules } from '../../src/domain/worldPulse/settlementStrategy.js';
import { evaluateWarLayer } from '../../src/domain/worldPulse/warDeployment.js';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { REASON_TUNING } from '../../src/domain/worldPulse/warReasons.js';
import { peaceReasonFactor, peaceReasonsFor } from '../../src/domain/worldPulse/peaceReasons.js';

const NOW = '2026-01-01T00:00:00.000Z';

// ── Fixtures ─────────────────────────────────────────────────────────────────

function settlement(name, patch = {}) {
  return {
    name,
    tier: patch.tier || 'town',
    population: patch.population ?? 1800,
    config: { tradeRouteAccess: 'road', priorityMilitary: patch.priorityMilitary ?? 35 },
    institutions: patch.institutions || [],
    economicState: { prosperity: patch.prosperity || 'Prosperous', primaryExports: [], primaryImports: [] },
    powerStructure: {
      publicLegitimacy: { score: patch.legitimacy ?? 60, label: 'Stable' },
      factions: patch.factions || [{ faction: 'Military Council', category: 'military', power: 78, isGoverning: true }],
      conflicts: [],
    },
    npcs: [], activeConditions: [],
  };
}
const save = (id, name, patch) => ({ id, name, phase: 'canon', settlement: settlement(name, patch), campaignState: { phase: 'canon', eventLog: [], locks: {} } });

// EQUAL-STRENGTH towns on the relationship read (the conquest-margin gate
// blocks the dormant march), but the attacker's garrison institutions + High
// Command carry the CAPACITY feasibility gate — so the ONLY thing standing
// between Ashvale and the march is the 0.12 relationship margin, which the
// saturated casus (×1.30) clears. Verified empirically: dark ⇒ blocked,
// lit ⇒ MARCH.
const attacker = () => save('atk', 'Ashvale', {
  tier: 'town', population: 1800, priorityMilitary: 40,
  institutions: [{ name: 'City Garrison' }, { name: 'Royal Armory' }],
  factions: [{ faction: 'High Command', category: 'military', power: 96, isGoverning: true }],
});
const victim = () => save('vic', 'Brackmoor', {
  tier: 'town', population: 1800, priorityMilitary: 15,
  factions: [
    { faction: 'Town Council', category: 'civic', power: 50, isGoverning: true },
    { faction: 'Watch', category: 'military', power: 25 },
  ],
});

/** A saturated directed case atk>vic (three max-score reasons ⇒ aggregate 1 ⇒ ×1.30). */
function saturatedWarLedger() {
  const rec = (type, receipt) => ({ type, score: 1, sinceTick: 1, tick: 3, receipt });
  return {
    'atk>vic': {
      reasons: {
        grievance: rec('grievance', 'A ledger of grievances stands open.'),
        encirclement: rec('encirclement', 'War stands at the borders.'),
        resource_pressure: rec('resource_pressure', 'Their granaries stand full while ours thin.'),
      },
      updatedTick: 3,
    },
  };
}

function warWorldState({ lit, withLedger, termination = false }) {
  return {
    rngSeed: 'consumption', tick: 4,
    relationshipStates: { 'edge.atk.vic': { relationshipType: 'hostile' } },
    deployments: {},
    warPosture: { atk: { state: 'mobilized', progress: 1, sinceTick: 0 } },
    simulationRules: { warLayerEnabled: true, ...(lit ? { peaceEngineEnabled: true } : {}), ...(termination ? { warTerminationEnabled: true } : {}) },
    ...(withLedger ? { spatialLedgers: { warReasons: saturatedWarLedger() } } : {}),
  };
}

function snapFor(worldState) {
  const saves = [attacker(), victim()];
  const campaign = {
    id: 'consumption', settlementIds: ['atk', 'vic'], worldState,
    regionalGraph: ensureRegionalGraph({ edges: [{ id: 'edge.atk.vic', from: 'atk', to: 'vic', relationshipType: 'hostile' }] }),
    wizardNews: { currentTick: 4, entries: [] },
  };
  return buildWorldSnapshot({ campaign, saves, worldState });
}

function runWarLayer({ lit, withLedger, termination = false }) {
  const worldState = warWorldState({ lit, withLedger, termination });
  const snapshot = snapFor(worldState);
  return evaluateWarLayer({
    snapshot, worldState: snapshot.worldState, rng: createPRNG('consumption'), tick: 4, now: NOW,
    rules: worldState.simulationRules,
  });
}

// ── 1. The §H weight seam (enumerateMoves) ───────────────────────────────────

describe('enumerateMoves — the causal factors load the deploy / sue_for_peace weights', () => {
  const baseArgs = () => ({
    sId: 'atk',
    ctx: { hostileTargets: ['vic'], besieging: [], homeBesieged: false, vassalBesieged: false },
    aggressiveness: 1,
    strengthFor: (id) => (String(id) === 'atk' ? 0.7 : 0.5),
    exhaustion: 0.3,
  });

  it('causal absent ⇒ the scored moves are identical to the pre-wave scorer (byte-identity at the seam)', () => {
    const without = enumerateMoves(baseArgs());
    const withNull = enumerateMoves({ ...baseArgs(), causal: null });
    const withUnit = enumerateMoves({ ...baseArgs(), causal: { warFor: () => 1, peaceFor: () => 1 } });
    expect(withNull).toEqual(without);
    expect(withUnit).toEqual(without);
  });

  it('a war case multiplies the deploy weight (bounded); a peace case multiplies the sue weight (bounded)', () => {
    const base = enumerateMoves(baseArgs());
    const loaded = enumerateMoves({
      ...baseArgs(),
      causal: { warFor: () => 1 + REASON_TUNING.WAR_FACTOR_W, peaceFor: () => 1 + REASON_TUNING.PEACE_FACTOR_W },
    });
    const score = (moves, m) => moves.find((x) => x.move === m)?.score;
    expect(score(loaded, 'deploy')).toBeGreaterThan(score(base, 'deploy'));
    expect(score(loaded, 'deploy')).toBeLessThanOrEqual(score(base, 'deploy') * (1 + REASON_TUNING.WAR_FACTOR_W) + 1e-12);
    expect(score(loaded, 'sue_for_peace')).toBeGreaterThan(score(base, 'sue_for_peace'));
    expect(score(loaded, 'sue_for_peace')).toBeLessThanOrEqual(score(base, 'sue_for_peace') * (1 + REASON_TUNING.PEACE_FACTOR_W) + 1e-12);
    // The untouched moves are untouched.
    expect(score(loaded, 'defend')).toBe(score(base, 'defend'));
    expect(score(loaded, 'hold')).toBe(score(base, 'hold'));
  });
});

describe('WR-1 peace-reason consumption does not count a dissolved cause twice', () => {
  it('filters only the dissolved cause mirrors and preserves unrelated peace pressure', () => {
    const rec = (type, receipt) => ({ type, score: 1, sinceTick: 1, tick: 4, receipt });
    const worldState = {
      simulationRules: { warLayerEnabled: true, peaceEngineEnabled: true },
      spatialLedgers: {
        peaceReasons: {
          'atk>vic': {
            reasons: {
              hopelessness: rec('hopelessness', 'The weaker court sees no road to victory.'),
              exhaustion: rec('exhaustion', 'The long campaign has worn the court thin.'),
            },
            updatedTick: 4,
          },
        },
      },
    };
    const complete = peaceReasonFactor(worldState, 'atk', 'vic');
    const filtered = peaceReasonFactor(worldState, 'atk', 'vic', ['opportunism']);
    const filteredEntry = peaceReasonsFor(worldState, 'atk', 'vic', ['opportunism']);
    expect(filtered).toBeGreaterThan(1);
    expect(filtered).toBeLessThan(complete);
    expect(Object.keys(filteredEntry.reasons)).toEqual(['exhaustion']);
  });
});

// ── 2. The war-initiation seam (evaluateWarLayer) ────────────────────────────

describe('warDeployment — the accumulated casus emboldens the march and stamps the artifact', () => {
  it('DIFFERENTIAL: the dormant engine refuses the under-margin march; the saturated casus clears it', () => {
    const dark = runWarLayer({ lit: false, withLedger: true });
    expect(dark.deployments.atk, 'dark: the margin gate refuses (even with a ledger present)').toBeUndefined();

    const lit = runWarLayer({ lit: true, withLedger: true });
    expect(lit.deployments.atk, 'lit: the case carries the march past the margin').toBeTruthy();
    expect(String(lit.deployments.atk.targetId)).toBe('vic');
  });

  it('the minted war record CARRIES its casus list, and the receipt names the typed reasons', () => {
    const lit = runWarLayer({ lit: true, withLedger: true });
    const rec = lit.deployments.atk;
    expect(Array.isArray(rec.casusReasons)).toBe(true);
    expect(rec.casusReasons.length).toBe(3);
    for (const c of rec.casusReasons) {
      expect(Object.keys(c).sort()).toEqual(['receipt', 'score', 'type']);
      expect(typeof c.type).toBe('string');
      expect(c.score).toBeGreaterThan(0);
      expect(c.receipt.length).toBeGreaterThan(0);
    }
    expect(rec.casusReasons.map((c) => c.type).sort()).toEqual(['encirclement', 'grievance', 'resource_pressure']);
    const deployOutcome = lit.outcomes.find((o) => o.candidateType === 'strategy_deploy');
    expect(deployOutcome, 'the march announced itself').toBeTruthy();
    expect(deployOutcome.reasons.some((r) => /^Casus belli: /.test(r)), 'the receipt names the casus').toBe(true);
  });

  it('the termination flag pins the open-tick on new causes without changing the dark record shape', () => {
    const lit = runWarLayer({ lit: true, withLedger: true, termination: true });
    const rec = lit.deployments.atk;
    expect(rec.casusReasons).toHaveLength(3);
    expect(rec.casusReasons.every((cause) => cause.atTick === 4)).toBe(true);
    expect(Object.keys(rec.casusReasons[0]).sort()).toEqual(['atTick', 'receipt', 'score', 'type']);
  });

  it('NEGATIVE CONTROL: a hand-seeded ledger under a DARK gate changes nothing at all', () => {
    const darkWith = runWarLayer({ lit: false, withLedger: true });
    const darkWithout = runWarLayer({ lit: false, withLedger: false });
    expect(darkWith.deployments).toEqual(darkWithout.deployments);
    expect(darkWith.outcomes).toEqual(darkWithout.outcomes);
  });

  it('a lit gate with NO case still refuses the under-margin march (the factor is the reasons, not the flag)', () => {
    const litNoLedger = runWarLayer({ lit: true, withLedger: false });
    expect(litNoLedger.deployments.atk, 'no case ⇒ ×1 ⇒ the margin still blocks').toBeUndefined();
  });
});

// ── 3. The strategy receipts (evaluateSettlementStrategyRules) ───────────────

describe('settlementStrategy — the chosen move receipts name the reasons it consumed', () => {
  // A strong attacker beside a WAR-WEARY struggling village: the no-rng argmax
  // deterministically picks sue_for_peace for the drained defender (verified
  // empirically — economic exhaustion 0.70 drives the suit).
  const strongAttacker = () => save('atk', 'Ashvale', {
    tier: 'city', population: 60000, priorityMilitary: 40,
    institutions: [{ name: 'Great Citadel' }, { name: 'City Garrison' }, { name: 'Royal Armory' }, { name: 'War College' }],
    factions: [{ faction: 'High Command', category: 'military', power: 96, isGoverning: true }],
    legitimacy: 88,
  });
  const wearyVictim = () => save('vic', 'Brackmoor', {
    tier: 'village', population: 280, priorityMilitary: 10, prosperity: 'Struggling', legitimacy: 24,
    factions: [{ faction: 'Village Elders', category: 'civic', power: 30, isGoverning: true }],
  });

  /** A saturated PEACE case vic>atk (the war-weary defender's ledger). */
  function saturatedPeaceLedger() {
    const rec = (type, receipt) => ({ type, score: 1, sinceTick: 1, tick: 3, receipt });
    return {
      'vic>atk': {
        reasons: {
          exhaustion: rec('exhaustion', 'The war has worn the town to the bone.'),
          belief_convergence: rec('belief_convergence', 'The fighting has taught both courts the same truth.'),
        },
        updatedTick: 3,
      },
    };
  }

  function strategySnap({ lit, withLedger }) {
    const worldState = {
      rngSeed: 'strategy-consumption', tick: 4,
      relationshipStates: { 'edge.atk.vic': { relationshipType: 'hostile' } },
      deployments: {},
      simulationRules: { warLayerEnabled: true, settlementStrategyEnabled: true, ...(lit ? { peaceEngineEnabled: true } : {}) },
      ...(withLedger ? { spatialLedgers: { warReasons: saturatedWarLedger(), peaceReasons: saturatedPeaceLedger() } } : {}),
    };
    const saves = [strongAttacker(), wearyVictim()];
    const campaign = {
      id: 'strategy-consumption', settlementIds: ['atk', 'vic'], worldState,
      regionalGraph: ensureRegionalGraph({ edges: [{ id: 'edge.atk.vic', from: 'atk', to: 'vic', relationshipType: 'hostile' }] }),
      wizardNews: { currentTick: 4, entries: [] },
    };
    return buildWorldSnapshot({ campaign, saves, worldState });
  }

  const runStrategy = (opts) => {
    const snapshot = strategySnap(opts);
    return evaluateSettlementStrategyRules(snapshot, null, {
      simulationRules: snapshot.worldState.simulationRules, tick: 4,
    });
  };

  it('lit: the exhausted defender argmax-chooses sue_for_peace and its receipt names the Casus pacis it consumed', () => {
    // (The deploy-side receipt is pinned end-to-end at the warDeployment outcome
    // above — 'Casus belli:' on the strategy_deploy reasons; the deploy WEIGHT
    // loading is pinned directly at enumerateMoves. Here the argmax-deterministic
    // move in this fixture is the war-weary victim's suit.)
    const out = runStrategy({ lit: true, withLedger: true });
    const suit = out.find((c) => /sues for peace/.test(String(c.headline || '')));
    expect(suit, 'the war-weary defender sued for peace').toBeTruthy();
    expect(suit.reasons.some((r) => /^Casus pacis: /.test(r)), 'the suit names the typed peace reasons').toBe(true);
    expect(suit.reasons.some((r) => /Casus pacis: exhaustion/.test(r))).toBe(true);
  });

  it('dark: the same world with the same hand-seeded ledgers emits byte-identical candidates with NO causal lines', () => {
    const darkWith = runStrategy({ lit: false, withLedger: true });
    const darkWithout = runStrategy({ lit: false, withLedger: false });
    expect(darkWith).toEqual(darkWithout);
    for (const c of darkWith) {
      expect((c.reasons || []).some((r) => /Casus (belli|pacis)/.test(r))).toBe(false);
    }
  });
});
