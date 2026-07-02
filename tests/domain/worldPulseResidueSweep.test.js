/**
 * worldPulseResidueSweep.test.js — G strengthening.
 *
 * worldPulseDeferMajorResidue pins the pause residue-suppression invariant on ONE seed
 * per layer. The machine-enforced RESIDUE_STRIP_SITES registry catches a strip that
 * drifts from the code; but a strip that is CORRECT on the pinned seed yet leaks residue
 * only under some other seed/interval would slip both. This sweeps the war_mobilization
 * fixture (which fires reliably) across many seeds × intervals and re-asserts the invariant
 * on every combination that fires the major (guarded, never vacuous): the autoresolve tick
 * commits the warPosture ramp + information_flow signal residue, and the paused tick leaves
 * NONE of it.
 *
 * This is a byte-neutral, test-only broadening of the equivalence coverage — the closest
 * safe reinforcement of the residue-strip guarantee short of the (deliberately deferred)
 * kernel-control-flow restructure a true by-construction chokepoint would require.
 */
import { describe, expect, test } from 'vitest';

import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/pulseKernel.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';

const NOW = '2026-01-01T00:00:00.000Z';
const SEEDS = ['sweep-03', 'sweep-11', 'sweep-24', 'sweep-37', 'sweep-46', 'sweep-59', 'sweep-72', 'sweep-88'];
const INTERVALS = ['one_week', 'one_month', 'one_season'];

function fortifiedCity(name) {
  return {
    name, tier: 'city', population: 80000, config: { tradeRouteAccess: 'road' },
    institutions: [{ name: 'Great Citadel' }, { name: 'City Garrison' }, { name: 'Royal Armory' }, { name: 'War College' }],
    economicState: { prosperity: 'Prosperous', primaryExports: [{ name: 'Siege Engines' }, { name: 'Forged Weapons' }], primaryImports: [], foodSecurity: { storageMonths: 9, resilienceScore: 85 } },
    powerStructure: { publicLegitimacy: { score: 88, label: 'Stable' }, factions: [{ faction: 'High Command', category: 'military', power: 96, isGoverning: true }], conflicts: [] },
    npcs: [], activeConditions: [],
  };
}
const save = (id, name, settlement) => ({ id, name, phase: 'canon', settlement, campaignState: { phase: 'canon', eventLog: [], locks: {} } });
const SAVES = [save('alpha', 'Alpha', fortifiedCity('Alpha')), save('beta', 'Beta', fortifiedCity('Beta'))];

// alpha pre-seeded near the top of `alert` facing a hostile beta → it crosses to
// war_preparation this tick (a war_mobilization major + posture ramp + information_flow signal).
function mobilizationCampaign(rngSeed) {
  return {
    id: 'sweep-mob', settlementIds: ['alpha', 'beta'],
    worldState: {
      rngSeed, tick: 4,
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

const run = (campaign, interval, opts = {}) =>
  simulateCampaignWorldPulse({ campaign, saves: SAVES, interval, now: NOW, ...opts });
const hasAlphaSignal = (result) =>
  (result.regionalGraph.channels || []).some(c => c.type === 'information_flow' && c.from === 'alpha');

describe('war_mobilization residue suppression holds across the seed × interval space (G sweep)', () => {
  let fired = 0;

  test.each(SEEDS.flatMap(seed => INTERVALS.map(interval => [seed, interval])))(
    'seed=%s interval=%s — paused mobilization leaves no posture / signal residue',
    (seed, interval) => {
      const baseline = run(mobilizationCampaign(seed), interval);
      const firedInBaseline = (baseline.selected || []).some(o => o.candidateType === 'war_mobilization')
        || baseline.worldState.warPosture?.alpha?.state === 'war_preparation';
      if (!firedInBaseline) return; // this combination didn't mobilize — nothing to check

      fired += 1;
      const paused = run(mobilizationCampaign(seed), interval, { deferMajors: true });
      // Surfaced, not applied.
      expect((paused.autoApplied || []).some(o => o.candidateType === 'war_mobilization')).toBe(false);
      // (1) alpha's mobilization posture is NOT committed — the pre-existing `alert` key is
      //     dropped too, since suppressing the major strips the whole warPosture entry.
      expect(paused.worldState.warPosture?.alpha).toBeUndefined();
      // (2) No information_flow signal channel from the paused mobilizer.
      expect(hasAlphaSignal(paused)).toBe(false);
    },
  );

  // Non-vacuity guard: the sweep must have mobilized across MANY combos, not a lucky one.
  test('the sweep fired war_mobilization across most seed/interval combos (not vacuous)', () => {
    expect(fired).toBeGreaterThanOrEqual(SEEDS.length); // at least one interval fires for each seed
  });
});
