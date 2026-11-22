/**
 * worldPulseDeferMajorResidue.test.js — a PAUSED tick (deferMajors=true) must leave
 * NO out-of-band ledger residue for the majors it withholds (the worldpulse-pause
 * finding).
 *
 * Stage-3 PAUSE withholds every structural MAJOR from this tick's apply pass (the
 * deferredMajors partition) so a DM can decide them on resume. But the war /
 * mobilization / occupation layers still RAN this tick and banked their OUT-OF-BAND
 * residue BEFORE the apply partition: an occupation seeded from a conquest, a
 * warPosture ramp from a mobilization, a vassalized promotion + vassal edge from a
 * vassalization, the conquest disposition ratchet. Before the fix, that residue
 * COMMITTED while the major itself was deferred — a paused world is internally
 * inconsistent (occupation written, conquest parked). The fix suppresses the SAME
 * residue the resume-dismiss path suppresses, but for EVERY deferred major.
 *
 *   (1) conquest          — no phantom occupation, no disposition ratchet.
 *   (2) war_mobilization  — no warPosture entry, no information_flow signal channels.
 *   (3) occupation_vassalized — the occupation is NOT stranded at the terminal rung.
 *
 * Each case also PINS the equivalence invariant: a paused tick with NO majors (and the
 * legacy deferMajors=false path) is byte-identical to the single-pass autoresolve-ON tick.
 */
import { describe, expect, test } from 'vitest';

import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/pulseKernel.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';

const NOW = '2026-01-01T00:00:00.000Z';

// A fortified peer city — a peer-vs-peer siege is PLAUSIBLE (passes the hard gate),
// reaches the RNG, and ramps a war posture fast. Mirrors the dismiss fixtures.
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
// (1) conquest — a paused conquest seeds NO occupation and NO disposition residue.
// ─────────────────────────────────────────────────────────────────────────────
describe('a PAUSED conquest leaves no occupation/disposition residue', () => {
  const SAVES = [save('alpha', 'Alpha', fortifiedCity('Alpha')), save('beta', 'Beta', fortifiedCity('Beta'))];
  // A pre-existing siege (alpha → beta), war on; the seed resolves it to a conquest.
  function campaign() {
    return {
      id: 'pause-conquest', settlementIds: ['alpha', 'beta'],
      worldState: {
        rngSeed: 'probe-37', tick: 4,
        relationshipStates: { 'edge.alpha.beta': { relationshipType: 'hostile' } },
        deployments: { alpha: { targetId: 'beta', sinceTick: 1, role: 'siege' } },
        simulationRules: { warLayerEnabled: true },
      },
      regionalGraph: ensureRegionalGraph({
        edges: [{ id: 'edge.alpha.beta', from: 'alpha', to: 'beta', relationshipType: 'hostile' }],
        channels: [{ type: 'war_front', from: 'alpha', to: 'beta', status: 'confirmed' }],
      }),
      wizardNews: { currentTick: 4, entries: [] },
    };
  }
  const run = (opts = {}) => simulateCampaignWorldPulse({ campaign: campaign(), saves: SAVES, interval: 'one_week', now: NOW, ...opts });

  // Guard: the autoresolve-ON tick produces the conquest + commits its residue.
  test('the fixture resolves the siege to a conquest and commits the residue', () => {
    const baseline = run();
    const conquest = (baseline.selected || []).find(o => o.candidateType === 'conquest');
    expect(conquest).toBeTruthy();
    expect(baseline.worldState.occupations?.beta).toBeTruthy();
    expect(baseline.worldState.dispositionStats?.alpha?.wins).toBe(1);
    expect(baseline.worldState.dispositionStats?.beta?.losses).toBe(1);
  });

  test('pausing withholds the conquest AND writes no occupation/disposition residue', () => {
    const paused = run({ deferMajors: true });

    // The conquest is surfaced for the DM, not applied.
    expect((paused.deferredMajors || []).some(o => o.candidateType === 'conquest')).toBe(true);
    expect((paused.autoApplied || []).some(o => o.candidateType === 'conquest')).toBe(false);
    // (1) No phantom occupation for the paused conquest target.
    expect(paused.worldState.occupations).toBeUndefined();
    // (2) No occupation-derived outcomes applied.
    const occDerived = (paused.autoApplied || []).filter(o =>
      ['occupation_resistance', 'occupation_burden', 'war_spoils'].includes(o.candidateType));
    expect(occDerived).toHaveLength(0);
    // (3) No disposition ratchet from the withheld conquest.
    const disp = paused.worldState.dispositionStats || {};
    expect(disp.alpha?.wins || 0).toBe(0);
    expect(disp.beta?.losses || 0).toBe(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// (2) war_mobilization — a paused mobilization commits no posture / signal residue.
// ─────────────────────────────────────────────────────────────────────────────
describe('a PAUSED war_mobilization leaves no warPosture / signal residue', () => {
  const SAVES = [save('alpha', 'Alpha', fortifiedCity('Alpha')), save('beta', 'Beta', fortifiedCity('Beta'))];
  // alpha is pre-seeded near the top of `alert` facing a hostile beta → it crosses to
  // war_preparation this tick (a war_mobilization major + posture ramp + signals).
  function campaign() {
    return {
      id: 'pause-mob', settlementIds: ['alpha', 'beta'],
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

  // Guard: the autoresolve-ON tick mints a war_mobilization major + commits the residue.
  test('the fixture mobilizes alpha and commits posture + signal residue', () => {
    const baseline = run();
    const mob = (baseline.selected || []).find(o => o.candidateType === 'war_mobilization');
    expect(mob).toBeTruthy();
    expect(baseline.worldState.warPosture?.alpha?.state).toBe('war_preparation');
    expect((baseline.regionalGraph.channels || []).some(c => c.type === 'information_flow' && c.from === 'alpha')).toBe(true);
  });

  test('pausing withholds the mobilization AND commits no posture / signal residue', () => {
    const paused = run({ deferMajors: true });

    expect((paused.deferredMajors || []).some(o => o.candidateType === 'war_mobilization')).toBe(true);
    expect((paused.autoApplied || []).some(o => o.candidateType === 'war_mobilization')).toBe(false);
    // (1) alpha's mobilization posture is NOT committed (it was the side effect of the
    //     withheld major). The fixture's pre-existing `alert` entry must be dropped too —
    //     the ramp evaluated this tick crossed to war_preparation; suppressing the major
    //     drops the whole warPosture key for alpha.
    expect(paused.worldState.warPosture?.alpha).toBeUndefined();
    // (2) No information_flow signal channel from the paused mobilizer.
    expect((paused.regionalGraph.channels || []).some(c => c.type === 'information_flow' && c.from === 'alpha')).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// (3) occupation_vassalized — a paused vassalization does not strand the occupation.
// ─────────────────────────────────────────────────────────────────────────────
describe('a PAUSED occupation_vassalized does not strand the occupation', () => {
  const SAVES = [save('alpha', 'Alpha', fortifiedCity('Alpha')), save('beta', 'Beta', occupiedTown('Beta'))];
  // beta is a stabilized, low-resistance, compliant occupation with stateHeld +1 — one
  // more advance tick matures it to `vassalized` (an occupation_vassalized major).
  function campaign() {
    return {
      id: 'pause-vass', settlementIds: ['alpha', 'beta'],
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

  // Guard: the autoresolve-ON tick matures beta to vassalized.
  test('the fixture matures the occupation to vassalized', () => {
    const baseline = run();
    const vass = (baseline.selected || []).find(o => o.candidateType === 'occupation_vassalized');
    expect(vass).toBeTruthy();
    expect(baseline.worldState.occupations?.beta?.state).toBe('vassalized');
  });

  test('pausing withholds the vassalization AND rolls the promotion back', () => {
    const paused = run({ deferMajors: true });

    expect((paused.deferredMajors || []).some(o => o.candidateType === 'occupation_vassalized')).toBe(true);
    expect((paused.autoApplied || []).some(o => o.candidateType === 'occupation_vassalized')).toBe(false);
    // (1) The occupation is NOT stranded at vassalized — it holds at the prior rung.
    expect(paused.worldState.occupations?.beta?.state).toBe('stabilized');
    // (2) The vassal-edge relabel never applied (the edge stays hostile).
    const edge = (paused.regionalGraph.edges || []).find(e => e.id === 'edge.alpha.beta');
    expect(edge?.relationshipType).toBe('hostile');
    expect(paused.worldState.relationshipStates?.['edge.alpha.beta']?.relationshipType).not.toBe('vassal');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// The equivalence invariant: a PAUSED tick with NO majors is byte-identical to the
// single-pass autoresolve-ON tick — the residue suppression is inert when there is
// nothing to withhold.
// ─────────────────────────────────────────────────────────────────────────────
describe('a PAUSED tick with no majors is byte-identical to the single-pass tick', () => {
  // A quiet pair of neutral villages: nothing reaches major tier this tick.
  function quietVillage(name) {
    return {
      name, tier: 'village', population: 600,
      config: { tradeRouteAccess: 'road' },
      institutions: [],
      economicState: { prosperity: 'Stable', primaryExports: [], primaryImports: [], foodSecurity: { storageMonths: 6, resilienceScore: 60 } },
      powerStructure: { publicLegitimacy: { score: 70 }, factions: [{ faction: 'Council', category: 'civic', power: 60, isGoverning: true }], conflicts: [] },
      npcs: [], activeConditions: [],
    };
  }
  const SAVES = [save('a', 'A', quietVillage('A')), save('b', 'B', quietVillage('B'))];
  function campaign() {
    return {
      id: 'pause-quiet', settlementIds: ['a', 'b'],
      worldState: { rngSeed: 'quiet-seed', tick: 2, relationshipStates: { 'edge.a.b': { relationshipType: 'neutral' } }, simulationRules: { warLayerEnabled: true } },
      regionalGraph: ensureRegionalGraph({ edges: [{ id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'neutral' }], channels: [] }),
      wizardNews: { currentTick: 2, entries: [] },
    };
  }
  const run = (opts = {}) => simulateCampaignWorldPulse({ campaign: campaign(), saves: SAVES, interval: 'one_week', now: NOW, ...opts });

  test('no majors are deferred and the worldState matches the autoresolve-ON tick', () => {
    const baseline = run();
    const paused = run({ deferMajors: true });
    expect(baseline.majors || []).toHaveLength(0);
    expect(paused.deferredMajors || []).toHaveLength(0);
    expect(paused.worldState).toEqual(baseline.worldState);
  });
});
