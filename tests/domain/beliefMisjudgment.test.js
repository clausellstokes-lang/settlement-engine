/**
 * beliefMisjudgment.test.js — Phase 5.5 WAVE A: misjudgment-as-cause.
 *
 * When the chooser commits an offensive on a belief that diverges from the truth
 * beyond the band, the deploy candidate carries `metadata.misjudgment` and the
 * kernel composes a legible house-voice receipt. Also pins the three re-plumbed
 * reads' identity fallback: settlementStrategyEnabled + a spatial marker under
 * OMNISCIENT ⇒ byte-identical candidates to the no-marker (dormant) path.
 */
import { describe, it, expect } from 'vitest';

import { evaluateSettlementStrategyRules } from '../../src/domain/worldPulse/settlementStrategy.js';
import { beliefMisjudgmentNewsEntries, GOVERNING_SEAT_KEY } from '../../src/domain/worldPulse/beliefMap.js';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import { deriveSettlementPressures, pressureIndex } from '../../src/domain/worldPulse/pressureModel.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { createPRNG } from '../../src/kernel/prng.js';

function settlement(name, patch = {}) {
  return {
    name,
    tier: patch.tier || 'city',
    population: patch.population || 45000,
    config: { tradeRouteAccess: 'road', priorityEconomy: 25, priorityMilitary: 40 },
    institutions: [],
    economicState: { prosperity: 'Prosperous', primaryExports: [], primaryImports: [] },
    powerStructure: {
      publicLegitimacy: { score: 62, label: 'Stable' },
      factions: patch.factions || [{ faction: 'War Council', category: 'military', power: 82, isGoverning: true }],
      conflicts: [],
    },
    npcs: [{ id: `warlord_${name}`, name: `Warlord ${name}`, importance: 'pillar', personality: { dominant: 'aggressive' } }],
    activeConditions: [],
  };
}
const save = (id, name, patch) => ({ id, name, phase: 'canon', settlement: settlement(name, patch), campaignState: { phase: 'canon', eventLog: [], locks: {} } });

// Aggressor believes Fortress NEGLIGIBLE (strengthBand 0) though it is a strong city.
function fixture({ spatial = true, infoMode = 'unreliable', beliefs = true } = {}) {
  const worldState = {
    rngSeed: 'mis-seed', tick: 9,
    relationshipStates: { 'edge.agg.fort': { relationshipType: 'hostile' } },
    simulationRules: { settlementStrategyEnabled: true, warLayerEnabled: true, ...(infoMode ? { infoMode } : {}) },
    ...(spatial ? { spatialCanonVersion: 1 } : {}),
    ...(spatial && beliefs
      ? { spatialLedgers: { beliefMaps: { aggressor: { [GOVERNING_SEAT_KEY]: {
          fortress: { readiness: 0, strengthBand: 0, allianceLabel: 'hostile', faithLabel: null, confidence01: 0.7, lastUpdateTick: 2 },
        } } } } }
      : {}),
  };
  return {
    id: 'mis', name: 'mis', settlementIds: ['aggressor', 'fortress'],
    worldState,
    regionalGraph: ensureRegionalGraph({ edges: [{ id: 'edge.agg.fort', from: 'aggressor', to: 'fortress', relationshipType: 'hostile' }] }),
    wizardNews: { currentTick: 9, entries: [] },
  };
}
const saves = () => [save('aggressor', 'Ashkar'), save('fortress', 'Stonewatch')];

function chooseFor(campaign) {
  const snap = buildWorldSnapshot({ campaign, saves: saves(), worldState: campaign.worldState });
  const pIdx = pressureIndex(deriveSettlementPressures(snap));
  const out = [];
  for (const seed of ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']) {
    out.push(...evaluateSettlementStrategyRules(snap, pIdx, { tick: 9, simulationRules: campaign.worldState.simulationRules, rng: createPRNG(seed) }));
  }
  return out;
}

describe('WAVE A — misjudgment fires on a stale-belief offensive', () => {
  it('a deploy built on a WEAK belief of a STRONG target carries metadata.misjudgment', () => {
    const deploys = chooseFor(fixture()).filter((c) => c.candidateType === 'strategy_deploy' && c.metadata.settlementId === 'aggressor');
    expect(deploys.length).toBeGreaterThan(0); // the aggressor marches (believing it easy)
    for (const d of deploys) {
      expect(d.metadata.misjudgment).toBeTruthy();
      expect(d.metadata.misjudgment.kinds).toContain('strength');
      expect(d.metadata.misjudgment.subjectId).toBe('fortress');
      expect(d.metadata.misjudgment.believedStrengthBand).toBe(0);
      expect(d.metadata.misjudgment.trueStrengthBand).toBeGreaterThanOrEqual(2);
      // the receipt is legible in the candidate's reasons
      expect(d.reasons.some((r) => /misjudgment/i.test(r))).toBe(true);
    }
  });

  it('the SAME fixture with beliefs DORMANT (no marker) stamps NO misjudgment', () => {
    // Reading TRUE strength, the aggressor sees an equal-strength rival and does
    // NOT march (no false-weakness to exploit) — so nothing misjudges. No
    // candidate in the dormant run carries a misjudgment.
    const out = chooseFor(fixture({ spatial: false, infoMode: null, beliefs: false }));
    for (const c of out) expect(c.metadata.misjudgment).toBeUndefined();
    // and the belief-driven march is exactly what the marker unlocks:
    const dormantDeploys = out.filter((c) => c.candidateType === 'strategy_deploy' && c.metadata.settlementId === 'aggressor');
    expect(dormantDeploys.length).toBe(0);
  });
});

describe('WAVE A — the three reads identity fallback (spatial + omniscient == dormant)', () => {
  it('settlementStrategyEnabled + a spatial marker under OMNISCIENT yields byte-identical candidates to no-marker', () => {
    const key = (out) => out.map((c) => `${c.metadata.settlementId}:${c.candidateType}:${c.severity}:${JSON.stringify(c.condition || null)}`).sort();
    const omni = chooseFor(fixture({ spatial: true, infoMode: 'omniscient', beliefs: false }));
    const none = chooseFor(fixture({ spatial: false, infoMode: null, beliefs: false }));
    expect(key(omni)).toEqual(key(none));
    // and neither carries a misjudgment (beliefs never activated)
    for (const c of [...omni, ...none]) expect(c.metadata.misjudgment).toBeUndefined();
  });
});

describe('WAVE A — beliefMisjudgmentNewsEntries composes the receipt', () => {
  it('turns a selected candidate carrying a misjudgment into a house-voice wizard-news entry', () => {
    const selected = [{
      id: 'candidate.strategy.deploy.aggressor.9',
      metadata: { misjudgment: {
        observerId: 'aggressor', subjectId: 'fortress',
        believedStrengthBand: 0, trueStrengthBand: 4,
        believedRelationship: 'hostile', trueRelationship: 'hostile',
        confidence01: 0.7, kinds: ['strength'],
      } },
    }];
    const nameFor = (id) => ({ aggressor: 'Ashkar', fortress: 'Stonewatch' }[id] || id);
    const entries = beliefMisjudgmentNewsEntries(selected, nameFor, 9, '2026-01-01T00:00:00.000Z');
    expect(entries).toHaveLength(1);
    const e = entries[0];
    expect(e.impactKind).toBe('belief_misjudgment');
    expect(e.settlementIds).toEqual(['aggressor', 'fortress']);
    expect(e.tags).toContain('misjudgment');
    expect(e.headline).toMatch(/Ashkar/);
    expect(e.summary).toMatch(/Stonewatch/);
    // the receipt names believed vs true strength (negligible vs overwhelming)
    expect(e.reasons.join(' ')).toMatch(/negligible/);
    expect(e.reasons.join(' ')).toMatch(/overwhelming/);
  });

  it('is empty (byte-neutral) when no selected candidate carries a misjudgment', () => {
    expect(beliefMisjudgmentNewsEntries([{ id: 'x', metadata: {} }], (id) => id, 1, null)).toEqual([]);
    expect(beliefMisjudgmentNewsEntries([], (id) => id, 1, null)).toEqual([]);
  });
});
