/**
 * worldPulseDismissMajors.test.js — extend the conquest-dismiss ledger discipline to
 * the OTHER major types (the worldpulse-dismiss cluster).
 *
 * The Stage-3 resume re-run filters a DM-dismissed major out of the APPLY pass, but a
 * major can ALSO write OUT-OF-BAND ledger / graph state before that filter runs. The
 * conquest case was already fixed (worldPulseConquestDismiss.test.js); this pins the
 * same equivalence for the remaining majors that carry side effects:
 *
 *  (1) HIGH  — war_mobilization: dismissing it must commit NEITHER the warPosture ledger
 *              entry NOR the information_flow signal channels (mobilizationEffects).
 *  (2) MED   — occupation_vassalized: dismissing it must NOT strand the occupation at the
 *              terminal `vassalized` rung — the state machine rolls the promotion back.
 *  (3) LOW   — the dismissed-conquest disposition strip is now tagged by sourceConquestId
 *              at the resolver, so it removes EXACTLY its own win/loss pair (robust against
 *              an occupier carrying an unrelated same-id win that tick), not by {id,outcome}.
 *
 * Every case also PINS the equivalence invariant: a resume that dismissed NOTHING
 * (null / empty set) re-runs byte-identically to the autoresolve-ON tick.
 */
import { describe, expect, test } from 'vitest';

import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/pulseKernel.js';
import { evaluateWarLayer } from '../../src/domain/worldPulse/warDeployment.js';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { createPRNG } from '../../src/generators/prng.js';

const NOW = '2026-01-01T00:00:00.000Z';

// A fortified peer city (mirrors the conquest-dismiss fixture) — a peer siege is
// PLAUSIBLE, so it reaches the RNG; a warlike city also ramps its war posture fast.
function fortifiedCity(name) {
  return {
    name, tier: 'city', population: 80000,
    config: { tradeRouteAccess: 'road' },
    institutions: [{ name: 'Great Citadel' }, { name: 'City Garrison' }, { name: 'Royal Armory' }, { name: 'War College' }],
    economicState: { prosperity: 'Prosperous', primaryExports: [{ name: 'Siege Engines' }, { name: 'Forged Weapons' }], primaryImports: [], foodSecurity: { storageMonths: 9, resilienceScore: 85 } },
    powerStructure: {
      publicLegitimacy: { score: 88, label: 'Stable' },
      factions: [{ faction: 'High Command', category: 'military', power: 96, isGoverning: true }],
      conflicts: [],
    },
    npcs: [], activeConditions: [],
  };
}

// A compliant-regime occupied town: an installed `occupier` faction + a `disarmed`
// local council — suitability stays high so the occupation can climb to vassalized.
function occupiedTown(name) {
  return {
    name, tier: 'town', population: 8000,
    config: { tradeRouteAccess: 'road' },
    institutions: [],
    economicState: { prosperity: 'Stable', primaryExports: [], primaryImports: [] },
    powerStructure: {
      publicLegitimacy: { score: 30 },
      factions: [
        { faction: 'Occupation Authority', category: 'military', power: 90, modifiers: ['occupier'], isGoverning: true },
        { faction: 'Old Council', category: 'civic', power: 10, modifiers: ['disarmed'] },
      ],
      conflicts: [],
    },
    npcs: [], activeConditions: [],
  };
}

function save(id, name, settlement) {
  return { id, name, phase: 'canon', settlement, campaignState: { phase: 'canon', eventLog: [], locks: {} } };
}

// ─────────────────────────────────────────────────────────────────────────────
// (1) HIGH — war_mobilization dismiss leaves no warPosture / signal residue.
// ─────────────────────────────────────────────────────────────────────────────
describe('a DM-dismissed war_mobilization leaves no warPosture / signal residue', () => {
  const SAVES = [save('alpha', 'Alpha', fortifiedCity('Alpha')), save('beta', 'Beta', fortifiedCity('Beta'))];
  // alpha is pre-seeded near the top of the `alert` rung facing a hostile beta, so it
  // crosses to `war_preparation` this tick → a war_mobilization major + posture + signals.
  function campaign() {
    return {
      id: 'mob-dismiss', settlementIds: ['alpha', 'beta'],
      worldState: {
        rngSeed: 'mob-seed', tick: 4,
        relationshipStates: { 'edge.alpha.beta': { relationshipType: 'hostile' } },
        warPosture: { alpha: { state: 'alert', progress: 0.9, sinceTick: 2 } },
        simulationRules: { warLayerEnabled: true },
      },
      regionalGraph: ensureRegionalGraph({
        edges: [{ id: 'edge.alpha.beta', from: 'alpha', to: 'beta', relationshipType: 'hostile' }],
        channels: [],
      }),
      wizardNews: { currentTick: 4, entries: [] },
    };
  }
  const run = (opts = {}) => simulateCampaignWorldPulse({ campaign: campaign(), saves: SAVES, interval: 'one_week', now: NOW, ...opts });

  // Guard: the fixture must actually mint a war_mobilization major (else vacuous).
  test('the fixture mobilizes alpha to a war footing (a war_mobilization major)', () => {
    const baseline = run();
    const mob = (baseline.selected || []).find(o => o.candidateType === 'war_mobilization');
    expect(mob).toBeTruthy();
    expect(mob.targetSaveId).toBe('alpha');
    // Autoresolve-ON DOES commit the posture ledger + the neighbour signal channel.
    expect(baseline.worldState.warPosture?.alpha?.state).toBe('war_preparation');
    expect((baseline.regionalGraph.channels || []).some(c => c.type === 'information_flow' && c.from === 'alpha')).toBe(true);
  });

  test('dismissing it commits NO warPosture entry and NO signal channels', () => {
    const baseline = run();
    const mobId = (baseline.selected || []).find(o => o.candidateType === 'war_mobilization').id;

    const dismissed = run({ dismissMajorIds: new Set([String(mobId)]) });

    // (1) alpha's mobilization posture is NOT committed (the ramp was the side effect of
    //     the dismissed major).
    expect(dismissed.worldState.warPosture?.alpha).toBeUndefined();
    // (2) No information_flow signal channel from the dismissed mobilizer.
    expect((dismissed.regionalGraph.channels || []).some(c => c.type === 'information_flow' && c.from === 'alpha')).toBe(false);
    // (3) The war_mobilization footing condition never landed in the apply pass.
    expect((dismissed.autoApplied || []).some(o => o.candidateType === 'war_mobilization')).toBe(false);
  });

  test('the equivalence invariant: NO dismissals re-runs byte-identically', () => {
    const baseline = run();
    const nullDismiss = run({ dismissMajorIds: null });
    const emptyDismiss = run({ dismissMajorIds: new Set() });
    expect(nullDismiss.worldState).toEqual(baseline.worldState);
    expect(emptyDismiss.worldState).toEqual(baseline.worldState);
    expect(baseline.worldState.warPosture?.alpha).toBeTruthy();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// (2) MEDIUM — occupation_vassalized dismiss rolls the promotion back.
// ─────────────────────────────────────────────────────────────────────────────
describe('a DM-dismissed occupation_vassalized does not strand the occupation', () => {
  const SAVES = [save('alpha', 'Alpha', fortifiedCity('Alpha')), save('beta', 'Beta', occupiedTown('Beta'))];
  // beta is a stabilized, low-resistance, compliant occupation with stateHeld +1 — one
  // more advance tick matures it to `vassalized` (an occupation_vassalized major).
  function campaign() {
    return {
      id: 'vass-dismiss', settlementIds: ['alpha', 'beta'],
      worldState: {
        rngSeed: 'vass-seed', tick: 4,
        relationshipStates: { 'edge.alpha.beta': { relationshipType: 'hostile' } },
        occupations: { beta: { occupierId: 'alpha', state: 'stabilized', sinceTick: 1, stateHeld: 1, resistance: 0.05, benefitYield: 0, lastTick: 3 } },
        simulationRules: { warLayerEnabled: true },
      },
      regionalGraph: ensureRegionalGraph({
        edges: [{ id: 'edge.alpha.beta', from: 'alpha', to: 'beta', relationshipType: 'hostile' }],
        channels: [],
      }),
      wizardNews: { currentTick: 4, entries: [] },
    };
  }
  const run = (opts = {}) => simulateCampaignWorldPulse({ campaign: campaign(), saves: SAVES, interval: 'one_week', now: NOW, ...opts });

  // Guard: the fixture must actually advance beta to vassalized (else vacuous).
  test('the fixture matures the occupation to vassalized (a vassalization major)', () => {
    const baseline = run();
    const vass = (baseline.selected || []).find(o => o.candidateType === 'occupation_vassalized');
    expect(vass).toBeTruthy();
    expect(baseline.worldState.occupations?.beta?.state).toBe('vassalized');
  });

  test('dismissing it rolls the occupation back to stabilized and forms no vassal edge', () => {
    const baseline = run();
    const vassId = (baseline.selected || []).find(o => o.candidateType === 'occupation_vassalized').id;

    const dismissed = run({ dismissMajorIds: new Set([String(vassId)]) });

    // (1) The occupation is NOT stranded at vassalized — it holds at the prior rung.
    expect(dismissed.worldState.occupations?.beta?.state).toBe('stabilized');
    // (2) The vassal-edge relabel never applied (the edge stays hostile).
    const edge = (dismissed.regionalGraph.edges || []).find(e => e.id === 'edge.alpha.beta');
    expect(edge?.relationshipType).toBe('hostile');
    expect(dismissed.worldState.relationshipStates?.['edge.alpha.beta']?.relationshipType).not.toBe('vassal');
    // (3) The vassalization outcome never landed in the apply pass.
    expect((dismissed.autoApplied || []).some(o => o.candidateType === 'occupation_vassalized')).toBe(false);
  });

  test('the equivalence invariant: NO dismissals re-runs byte-identically', () => {
    const baseline = run();
    const nullDismiss = run({ dismissMajorIds: null });
    const emptyDismiss = run({ dismissMajorIds: new Set() });
    expect(nullDismiss.worldState).toEqual(baseline.worldState);
    expect(emptyDismiss.worldState).toEqual(baseline.worldState);
    expect(baseline.worldState.occupations?.beta?.state).toBe('vassalized');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// (3) LOW — conquest disposition deltas are tagged with sourceConquestId, so the
// dismiss strip removes EXACTLY the dismissed conquest's pair (order-robust).
// ─────────────────────────────────────────────────────────────────────────────
describe('conquest disposition deltas carry sourceConquestId and strip by it', () => {
  function siegeSaves() {
    return [save('alpha', 'Alpha', fortifiedCity('Alpha')), save('beta', 'Beta', fortifiedCity('Beta'))];
  }
  // The kernel increments tick 4 → 5 and forks `war-layer` off the per-tick PRNG; this
  // reproduces the exact rng the kernel hands evaluateWarLayer for the conquest tick.
  function siegeWorldState() {
    return {
      rngSeed: 'probe-37', tick: 5,
      relationshipStates: { 'edge.alpha.beta': { relationshipType: 'hostile' } },
      deployments: { alpha: { targetId: 'beta', sinceTick: 1, role: 'siege' } },
      simulationRules: { warLayerEnabled: true },
    };
  }

  test('the resolver tags both conquest deltas with the source conquest outcome id', () => {
    const saves = siegeSaves();
    const worldState = siegeWorldState();
    const campaign = {
      id: 'conq-tag', settlementIds: ['alpha', 'beta'], worldState,
      regionalGraph: ensureRegionalGraph({
        edges: [{ id: 'edge.alpha.beta', from: 'alpha', to: 'beta', relationshipType: 'hostile' }],
        channels: [{ type: 'war_front', from: 'alpha', to: 'beta', status: 'confirmed' }],
      }),
    };
    const snapshot = buildWorldSnapshot({ campaign, saves, worldState });
    const rng = createPRNG('probe-37::tick:5::one_week').fork('war-layer');
    const war = evaluateWarLayer({ snapshot, worldState, rng, tick: 5, now: NOW, rules: { warLayerEnabled: true } });

    const conquest = war.outcomes.find(o => o.candidateType === 'conquest');
    expect(conquest).toBeTruthy();
    const conquestId = conquest.id;
    const win = war.dispositionDeltas.find(d => d.id === 'alpha' && d.outcome === 'win');
    const loss = war.dispositionDeltas.find(d => d.id === 'beta' && d.outcome === 'loss');
    expect(win?.sourceConquestId).toBe(conquestId);
    expect(loss?.sourceConquestId).toBe(conquestId);
  });

  // The order-robustness pin: alpha both CONQUERS beta (win, mag 1) AND stabilizes a
  // pre-existing occupation of gamma (an UNRELATED alpha win, mag 0.3) in the same tick.
  // Dismissing only the conquest must strip EXACTLY the conquest win — never the
  // unrelated stabilization win — so alpha keeps one win, not zero.
  function comboCampaign() {
    return {
      id: 'conq-strip', settlementIds: ['alpha', 'beta', 'gamma'],
      worldState: {
        rngSeed: 'probe-37', tick: 4,
        relationshipStates: { 'edge.alpha.beta': { relationshipType: 'hostile' } },
        deployments: { alpha: { targetId: 'beta', sinceTick: 1, role: 'siege' } },
        occupations: { gamma: { occupierId: 'alpha', state: 'extractive', sinceTick: 1, stateHeld: 1, resistance: 0.05, benefitYield: 0, lastTick: 3 } },
        simulationRules: { warLayerEnabled: true },
      },
      regionalGraph: ensureRegionalGraph({
        edges: [{ id: 'edge.alpha.beta', from: 'alpha', to: 'beta', relationshipType: 'hostile' }],
        channels: [{ type: 'war_front', from: 'alpha', to: 'beta', status: 'confirmed' }],
      }),
      wizardNews: { currentTick: 4, entries: [] },
    };
  }
  const COMBO_SAVES = [
    save('alpha', 'Alpha', fortifiedCity('Alpha')),
    save('beta', 'Beta', fortifiedCity('Beta')),
    save('gamma', 'Gamma', occupiedTown('Gamma')),
  ];
  const runCombo = (opts = {}) => simulateCampaignWorldPulse({ campaign: comboCampaign(), saves: COMBO_SAVES, interval: 'one_week', now: NOW, ...opts });

  test('dismissing the conquest strips only its win, preserving an unrelated same-id win', () => {
    const baseline = runCombo();
    const conquest = (baseline.selected || []).find(o => o.candidateType === 'conquest');
    expect(conquest).toBeTruthy();
    // Baseline: alpha banks BOTH the conquest win AND the gamma-stabilization win.
    expect(baseline.worldState.dispositionStats?.alpha?.wins).toBe(2);

    const dismissed = runCombo({ dismissMajorIds: new Set([String(conquest.id)]) });

    // Exactly the conquest pair is stripped: alpha keeps its unrelated stabilization win,
    // and beta carries no conquest loss.
    expect(dismissed.worldState.dispositionStats?.alpha?.wins).toBe(1);
    expect(dismissed.worldState.dispositionStats?.beta?.losses || 0).toBe(0);
  });
});
