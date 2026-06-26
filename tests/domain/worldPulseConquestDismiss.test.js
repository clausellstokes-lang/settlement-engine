/**
 * worldPulseConquestDismiss.test.js — a DM-dismissed conquest must leave NO
 * occupation/ledger residue (the conquest-dismiss finding).
 *
 * The Stage-3 resume re-run filters a dismissed major out of the APPLY pass, but a
 * conquest also has OUT-OF-BAND ledger effects: evaluateOccupations seeds an
 * occupation into worldState.occupations from the conquest power_transfer, and the
 * war layer banks a conqueror-win / conquered-loss disposition ratchet. Before the
 * fix, dismissing the conquest suppressed only the apply outcome — so a phantom
 * `contested` occupation (and its disposition residue) survived for a power transfer
 * that never landed. PIN: a feasible peer siege resolves to a conquest; dismissing
 * that conquest leaves the occupations ledger absent and the dispositionStats clean.
 */
import { describe, expect, test } from 'vitest';

import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/pulseKernel.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';

const NOW = '2026-01-01T00:00:00.000Z';

// A fortified peer city — a peer-vs-peer siege is PLAUSIBLE (passes the hard gate),
// so the conquest reaches the RNG and a chosen seed resolves it (mirrors the
// feasibilityGate.siege integration fixture).
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
function save(id, name) {
  return { id, name, phase: 'canon', settlement: fortifiedCity(name), campaignState: { phase: 'canon', eventLog: [], locks: {} } };
}

// A pre-existing siege (alpha → beta), war layer on. The seed is chosen so the
// siege RESOLVES into a conquest this tick.
function campaignWithSiege(seed) {
  const worldState = {
    rngSeed: seed, tick: 4,
    relationshipStates: { 'edge.alpha.beta': { relationshipType: 'hostile' } },
    deployments: { alpha: { targetId: 'beta', sinceTick: 1, role: 'siege' } },
    simulationRules: { warLayerEnabled: true },
  };
  return {
    id: 'conquest-dismiss', settlementIds: ['alpha', 'beta'], worldState,
    regionalGraph: ensureRegionalGraph({
      edges: [{ id: 'edge.alpha.beta', from: 'alpha', to: 'beta', relationshipType: 'hostile' }],
      channels: [{ type: 'war_front', from: 'alpha', to: 'beta', status: 'confirmed' }],
    }),
    wizardNews: { currentTick: 4, entries: [] },
  };
}

const SAVES = [save('alpha', 'Alpha'), save('beta', 'Beta')];

// A seed under which alpha's peer siege of beta resolves to a conquest on this tick.
const CONQUEST_SEED = 'probe-37';

function runTick(opts = {}) {
  return simulateCampaignWorldPulse({ campaign: campaignWithSiege(CONQUEST_SEED), saves: SAVES, interval: 'one_week', now: NOW, ...opts });
}

describe('a DM-dismissed conquest leaves no occupation/ledger residue', () => {
  // Guard: the chosen seed must actually produce a conquest (else the dismiss
  // assertions below would pass vacuously).
  test('the fixture seed resolves the peer siege to a conquest', () => {
    const baseline = runTick();
    const conquest = (baseline.selected || []).find(o => o.candidateType === 'conquest');
    expect(conquest).toBeTruthy();
    expect(conquest.targetSaveId).toBe('beta');
    // The autoresolve-ON tick DOES seed the occupation + bank the disposition ratchet.
    expect(baseline.worldState.occupations?.beta).toBeTruthy();
    expect(baseline.worldState.dispositionStats?.alpha?.wins).toBe(1);
    expect(baseline.worldState.dispositionStats?.beta?.losses).toBe(1);
  });

  test('dismissing the conquest writes NO occupation and NO disposition residue', () => {
    const baseline = runTick();
    const conquestId = (baseline.selected || []).find(o => o.candidateType === 'conquest').id;

    const dismissed = runTick({ dismissMajorIds: new Set([String(conquestId)]) });

    // (1) No phantom occupation for the dismissed target.
    expect(dismissed.worldState.occupations).toBeUndefined();
    // (2) No occupation-derived outcomes (resistance/burden/war_spoils) applied.
    const occDerived = (dismissed.autoApplied || []).filter(o =>
      ['occupation_resistance', 'occupation_burden', 'war_spoils'].includes(o.candidateType));
    expect(occDerived).toHaveLength(0);
    // (3) No disposition ratchet from the dismissed conquest (no win for alpha, no loss for beta).
    const disp = dismissed.worldState.dispositionStats || {};
    expect(disp.alpha?.wins || 0).toBe(0);
    expect(disp.beta?.losses || 0).toBe(0);
    // (4) The conquest power transfer itself never landed in the apply pass.
    expect((dismissed.autoApplied || []).some(o => o.candidateType === 'conquest')).toBe(false);
  });

  test('the equivalence invariant: NO dismissals re-runs byte-identically (null / empty set)', () => {
    const baseline = runTick();
    const nullDismiss = runTick({ dismissMajorIds: null });
    const emptyDismiss = runTick({ dismissMajorIds: new Set() });
    // A resume that dismissed nothing must be byte-identical to the autoresolve-ON tick —
    // the occupation + disposition residue is PRESERVED, the fix is inert.
    expect(nullDismiss.worldState).toEqual(baseline.worldState);
    expect(emptyDismiss.worldState).toEqual(baseline.worldState);
    expect(baseline.worldState.occupations?.beta).toBeTruthy();
  });
});
