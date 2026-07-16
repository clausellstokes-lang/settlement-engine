/**
 * tickCoreDismissConsequence.test.js — r2 worldpulse-tick-core-1.
 *
 * The three post-apply CONSEQUENCE readers (moral drift, the misjudgment news beat, the tempo
 * birth fold) used to iterate the UNFILTERED `selectedForApply`, so a DM-DISMISSED major still
 * drove its consequences — a march the DM vetoed still emitted a "marches on a misjudgment"
 * receipt (and, for a relationship misjudgment, permanently drifted alignment, and counted as a
 * landed birth in the tempo ledger). The fix feeds all three the dismissal-filtered set
 * (`selectedForConsequences` = selected minus activeDismissals), matching the apply pass.
 *
 * This pins the misjudgment-news reader end-to-end (baseline emits the beat; dismissing the
 * deploy removes it) — the same `selectedForConsequences` variable the moral-drift loop and the
 * tempo fold consume, so the fix is unified across all three sites.
 */
import { describe, it, expect } from 'vitest';
import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/pulseKernel.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { GOVERNING_SEAT_KEY } from '../../src/domain/worldPulse/beliefMap.js';

const NOW = '2026-01-01T00:00:00.000Z';

function settlement(name) {
  return {
    name, tier: 'city', population: 45000,
    config: { tradeRouteAccess: 'road', priorityEconomy: 25, priorityMilitary: 40 },
    institutions: [],
    economicState: { prosperity: 'Prosperous', primaryExports: [], primaryImports: [] },
    powerStructure: { publicLegitimacy: { score: 62, label: 'Stable' }, factions: [{ faction: 'War Council', category: 'military', power: 82, isGoverning: true }], conflicts: [] },
    npcs: [{ id: `warlord_${name}`, name: `Warlord ${name}`, importance: 'pillar', personality: { dominant: 'aggressive' } }],
    activeConditions: [],
  };
}
const save = (id, name) => ({ id, name, phase: 'canon', settlement: settlement(name), campaignState: { phase: 'canon', eventLog: [], locks: {} } });
const saves = () => [save('aggressor', 'Ashkar'), save('fortress', 'Stonewatch')];

// The aggressor BELIEVES Stonewatch negligible (strengthBand 0, seeded in the belief map) though
// it is a strong city — so it marches on a misjudgment (the fog of war made a legible cause).
function campaign() {
  return {
    id: 'mis', name: 'mis', settlementIds: ['aggressor', 'fortress'],
    worldState: {
      rngSeed: 'mis-seed', tick: 9,
      relationshipStates: { 'edge.agg.fort': { relationshipType: 'hostile' } },
      simulationRules: { settlementStrategyEnabled: true, warLayerEnabled: true, infoMode: 'unreliable' },
      spatialCanonVersion: 1,
      spatialLedgers: { beliefMaps: { aggressor: { [GOVERNING_SEAT_KEY]: {
        fortress: { readiness: 0, strengthBand: 0, allianceLabel: 'hostile', faithLabel: null, confidence01: 0.7, lastUpdateTick: 2 },
      } } } },
    },
    regionalGraph: ensureRegionalGraph({ edges: [{ id: 'edge.agg.fort', from: 'aggressor', to: 'fortress', relationshipType: 'hostile' }] }),
    wizardNews: { currentTick: 9, entries: [] },
  };
}
const run = (opts = {}) => simulateCampaignWorldPulse({ campaign: campaign(), saves: saves(), interval: 'one_week', now: NOW, ...opts });
const misjudgmentBeats = (r) => ((r.wizardNews?.entries) || []).filter((e) => e.impactKind === 'belief_misjudgment');

describe('r2 tick-core-1 — a DM-dismissed misjudged deploy drives NO consequence', () => {
  it('baseline: the misjudged march emits its "marches on a misjudgment" beat (the residue to strip)', () => {
    const base = run();
    const deploy = (base.majors || []).find((o) => o.candidateType === 'strategy_deploy' && o.metadata?.settlementId === 'aggressor');
    expect(deploy, 'the aggressor marches on its stale belief').toBeTruthy();
    expect(deploy.metadata.misjudgment, 'the march is a misjudgment').toBeTruthy();
    expect(misjudgmentBeats(base).length, 'the misjudgment news beat fires').toBe(1);
  });

  it('DISMISS: vetoing the deploy withholds the misjudgment beat (the consequence reader honours the dismissal)', () => {
    const base = run();
    const deployId = String((base.majors || []).find((o) => o.candidateType === 'strategy_deploy').id);
    const dismissed = run({ dismissMajorIds: new Set([deployId]) });
    // The deploy itself never landed…
    expect(dismissed.worldState.deployments?.aggressor, 'the vetoed march never deployed').toBeUndefined();
    // …and its misjudgment consequence beat is GONE (before the fix it still fired off the
    // unfiltered selectedForApply). moralDrift + the tempo birth fold read the same filtered set.
    expect(misjudgmentBeats(dismissed).length, 'no receipt for a march the DM vetoed').toBe(0);
  });

  it('dismiss-NOTHING stays byte-identical to the baseline (the filter is inert without dismissals)', () => {
    const base = run();
    const nullDismiss = run({ dismissMajorIds: new Set() });
    expect(misjudgmentBeats(nullDismiss).length).toBe(misjudgmentBeats(base).length);
    expect(nullDismiss.worldState).toEqual(base.worldState);
  });
});
