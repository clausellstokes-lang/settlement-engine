/**
 * coalitionDissentCoupSoak.m9d.test.js — Phase 5.5 M9d SOAK: COALITION DISSENT → COUP.
 *
 * The M9 soak clause (playbook PART 7, M9 line 620): "coalition dissent → coup pathway
 * exercised." M9a built the DISSENT half — a faction reading the world materially
 * differently from the ruling seat stamps a `council_schism` internal stressor (belief
 * divergence, the fog of war turned inward). M9a stopped there ("no mechanical coup this
 * wave"). This soak drives the schism dissent the rest of the way down the EXISTING coup
 * pathway and proves it is BOUNDED at every link:
 *
 *   (1) DISSENT IS LIVE — the divergent-belief council reliably stamps council_schism,
 *       and a multi-tick run keeps legitimacy bounded [0,100] (no runaway collapse).
 *   (2) THE PATHWAY OPENS — a schism-depressed (Crisis) seat with a real challenger
 *       faction opens the coup spawn gate (positive probabilityMult); a HEALTHY seat is
 *       blocked (null). Dissent creates coup CONDITIONS — it does not force a coup.
 *   (3) THE COUP RESOLVES BOUNDED — a coup_detat in a schism-active settlement resolves
 *       through the REAL kernel into a single verdict (coup_suppressed OR coup_succeeded);
 *       across seeds BOTH branches occur (a coup can be crushed or can win — neither is a
 *       one-sided runaway), severity + hold-chance stay in bounds, legitimacy stays in
 *       [0,100].
 *
 * The coup MACHINERY (spawn gate, verdict) is pre-M9d; this soak only EXERCISES the
 * dissent→coup link and pins its boundedness. Nothing here depends on the M9d war split
 * (they share only the M9 wave), so it stays green independent of war-mode.
 */
import { describe, expect, test } from 'vitest';

import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { GOVERNING_SEAT_KEY } from '../../src/domain/worldPulse/beliefMap.js';
import { STRESSOR_SPAWN_GATES } from '../../src/domain/worldPulse/stressorGates.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';

const NOW = '2026-01-01T00:00:00.000Z';
const IDS = ['a', 'b'];

function digest() {
  const pack = makeGridPack({ cols: 24, rows: 18 });
  const placements = placeSettlements(pack, IDS.length).map((p, i) => ({ id: IDS[i], cellId: p.cellId }));
  return buildSpatialDigest({ pack, placements });
}

function save(id, factions, legit) {
  return {
    id, name: id.toUpperCase(), phase: 'canon',
    settlement: {
      name: id, tier: 'town', population: 2600,
      config: { tradeRouteAccess: 'road' }, institutions: [],
      powerStructure: {
        governingName: 'City Council',
        publicLegitimacy: { score: legit, label: 'Crisis', govMultiplier: 0.7, crimMultiplier: 1.2 },
        factions, conflicts: [], factionRelationships: [],
      },
      npcs: [{ id: `n_${id}`, name: 'Reeve', importance: 'key' }],
      activeConditions: [],
      economicState: { prosperity: 'Struggling', primaryExports: [], primaryImports: [] },
    },
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  };
}

// 'a' governs via a WEAK council (power 22) beside a STRONG garrison (44) + merchant
// league (40) — the challengers the coup contest needs. The seat is at Crisis legitimacy.
const facA = [
  { faction: 'City Council', category: 'government', power: 22, isGoverning: true },
  { faction: 'The Garrison', category: 'military', power: 44 },
  { faction: 'Merchant League', category: 'merchant', power: 40 },
];
const rel = { readiness: 0.2, allianceLabel: 'hostile', faithLabel: null, lastUpdateTick: 0 };
// The seat reads b SLIGHT (band 1); the merchants + military — better-informed — read it
// FORMIDABLE (band 4). A confident 3-band divergence INSIDE the council: dissent.
const priorBeliefs = {
  a: {
    [GOVERNING_SEAT_KEY]: { b: { ...rel, strengthBand: 1, confidence01: 0.9 } },
    merchant: { b: { ...rel, strengthBand: 4, confidence01: 0.9 } },
    military: { b: { ...rel, strengthBand: 4, confidence01: 0.9 } },
  },
};

function campaign(seed, { seedCoup = false, tick = 1 } = {}) {
  const coupStressor = {
    id: 'st_coup_a', type: 'coup_detat', status: 'active',
    severity: 0.7, peakSeverity: 0.8, age: 5,
    originSettlementId: 'a', affectedSettlementIds: ['a'], originTick: 0,
    originContext: { variant: 'military' },
  };
  return {
    id: 'coup-soak', name: 'coup-soak', settlementIds: [...IDS],
    worldState: {
      rngSeed: seed, tick,
      relationshipStates: { 'edge.a.b': { relationshipType: 'hostile' } },
      simulationRules: { propagationMode: 'first_order', settlementStrategyEnabled: true, warLayerEnabled: true, infoMode: 'unreliable', stressorsEnabled: true },
      spatialCanonVersion: 1, spatialDigest: digest(), spatialLedgers: { beliefMaps: priorBeliefs },
      ...(seedCoup ? { stressors: [coupStressor] } : {}),
    },
    regionalGraph: ensureRegionalGraph({ edges: [{ id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'hostile' }], channels: [] }),
    wizardNews: { currentTick: tick, entries: [] },
  };
}

const saves = () => [save('a', facA, 12), save('b', [{ faction: 'Elders', category: 'government', isGoverning: true }], 40)];
const conditionsOf = (r, id) => ((r.settlementUpdates || []).find(x => String(x.saveId) === id)?.settlement?.activeConditions || []).map(c => c.archetype);
const legitOf = (r, id) => (r.settlementUpdates || []).find(x => String(x.saveId) === id)?.settlement?.powerStructure?.publicLegitimacy?.score;
const verdictsOf = (r) => (r.selected || []).filter(o => o.candidateType === 'coup_suppressed' || o.candidateType === 'coup_succeeded');

describe('M9d SOAK — coalition dissent → coup, exercised + bounded', () => {
  test('(1) dissent is live and the multi-tick run stays bounded', () => {
    let camp = campaign('dissent-soak');
    let sv = saves();
    let schismEverSeen = false;
    for (let t = 0; t < 12; t++) {
      const r = simulateCampaignWorldPulse({ campaign: camp, saves: sv, interval: 'one_week', now: NOW });
      if (conditionsOf(r, 'a').includes('council_schism')) schismEverSeen = true;
      // Legitimacy never leaves the well-formed band (no runaway collapse or overflow).
      const la = legitOf(r, 'a');
      expect(la).toBeGreaterThanOrEqual(0);
      expect(la).toBeLessThanOrEqual(100);
      // Feed the tick forward (the pathway must survive its own consequences).
      camp = { ...camp, worldState: { ...r.worldState, tick: r.worldState.tick + 1 }, regionalGraph: r.regionalGraph, wizardNews: r.wizardNews };
      sv = sv.map(s => {
        const u = (r.settlementUpdates || []).find(x => String(x.saveId) === String(s.id));
        return u ? { ...s, settlement: u.settlement } : s;
      });
    }
    expect(schismEverSeen).toBe(true); // the coalition dissent fired
  });

  test('(2) a schism-depressed seat OPENS the coup gate; a healthy seat is blocked', () => {
    const settlement = (score) => ({
      name: 'Oakmere', tier: 'town',
      powerStructure: {
        governingName: 'City Council',
        publicLegitimacy: { score, label: score < 30 ? 'Crisis' : 'Stable', govMultiplier: 0.7 },
        factions: facA, factionRelationships: [],
      },
    });
    const snap = (score, auth) => ({
      worldState: { stressors: [] },
      byId: new Map([['a', { settlement: settlement(score), causal: { scores: { ruling_authority: auth } }, name: 'Oakmere' }]]),
    });
    // The dissent-depressed Crisis seat: the coup pathway is OPEN.
    const opened = STRESSOR_SPAWN_GATES.coup_detat(snap(12, 14), { settlementId: 'a', score: 0.8 });
    expect(opened).toBeTruthy();
    expect(opened.probabilityMult).toBeGreaterThan(0);
    expect(opened.reasons.some(x => /Garrison|Merchant/.test(x))).toBe(true); // real challengers
    // A healthy seat blocks the birth — dissent must actually expose the seat.
    expect(STRESSOR_SPAWN_GATES.coup_detat(snap(70, 70), { settlementId: 'a', score: 0.8 })).toBeNull();
  });

  test('(3) a coup in a schism-active settlement resolves BOUNDED through the kernel', () => {
    // Across seeds BOTH verdict branches must appear (crushed AND won) — a coup is a real
    // fork, never a one-sided runaway — and each verdict is a single well-formed outcome.
    const seeds = ['s1', 's2', 'coup', 's4', 'crisis', 'x9'];
    const kinds = new Set();
    for (const seed of seeds) {
      const r = simulateCampaignWorldPulse({ campaign: campaign(seed, { seedCoup: true, tick: 6 }), saves: saves(), interval: 'one_week', now: NOW });
      // The dissent is present in the same run that resolves the coup.
      expect(conditionsOf(r, 'a')).toContain('council_schism');
      const verdicts = verdictsOf(r);
      expect(verdicts.length).toBe(1); // exactly one verdict — the coup RESOLVED
      const v = verdicts[0];
      kinds.add(v.candidateType);
      // Bounded verdict: severity in the coup band, hold-chance a probability.
      expect(v.severity).toBeGreaterThan(0);
      expect(v.severity).toBeLessThanOrEqual(1);
      const pHold = v.metadata?.verdict?.pHold;
      expect(pHold).toBeGreaterThanOrEqual(0);
      expect(pHold).toBeLessThanOrEqual(1);
      // Legitimacy stays in bounds after the palace fight.
      const la = legitOf(r, 'a');
      expect(la).toBeGreaterThanOrEqual(0);
      expect(la).toBeLessThanOrEqual(100);
    }
    // The pathway is genuinely two-sided (not always the same outcome).
    expect(kinds.has('coup_succeeded')).toBe(true);
    expect(kinds.has('coup_suppressed')).toBe(true);
  });
});
