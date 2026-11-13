/**
 * crisisSeat.test.js — COHERENCE-POWERS-3 (the chair's rulings (1) and (2) of 2026-11-12, on F1's measure): A CRISIS
 * WHOSE OWN NAME SAYS A POWER HOLDS THE TOWN SEATS THAT POWER AT EVERY SIZE. An occupation seats its occupier, faced by
 * the minted governor; a fractured realm shows at least two powers. Before the cure, on both corpora, the occupier was
 * absent from 50 of 168 forced occupations (a thorp "under occupation" with no occupier on the page) and 42 of 168
 * fractured realms showed one power.
 *
 * Births through birthConfig with the browser's dials; every size; the expectations are literals.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';

const DIALS = Object.freeze({
  tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat',
  nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true,
  magicExists: true, contentProfile: 'grounded',
});
const TIERS = Object.freeze(['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']);
const born = (stress, settType, i) => generateSettlementPipeline(
  birthConfig({ ...DIALS, settType, selectedStresses: [stress], selectedStressesRandom: false }), null, { seed: `seat-${stress}-${settType}-${i}`, customContent: {} });

beforeAll(async () => { await loadGenerationLawPayloads(); });

describe('COHERENCE-POWERS-3 — the crisis that names a power seats it', () => {
  it('an occupation at every size has its occupier on the page, faced by the minted governor', () => {
    const misses = [];
    for (const settType of TIERS) for (let i = 0; i < 5; i++) {
      const s = born('occupied', settType, i);
      const seat = (s.powerStructure?.factions || []).find((f) => f.faction === 'Occupation Authority');
      const first = seat && (s.npcs || []).find((c) => (c.memberships || []).some((m) => m.power === 'Occupation Authority' && m.rank === 1));
      if (!seat) misses.push(`${settType}-${i}: no Occupation Authority (${(s.powerStructure?.factions || []).map((f) => f.faction).join(', ')})`);
      else if (!first || first.institution?.kind !== 'power') misses.push(`${settType}-${i}: the occupier is faced by ${first ? first.institution?.key : 'no one'}`);
    }
    expect(misses).toEqual([]);
  }, 120_000);

  it('a fractured realm at every size shows at least two powers', () => {
    const misses = [];
    for (const settType of TIERS) for (let i = 0; i < 5; i++) {
      const s = born('politically_fractured', settType, i);
      const roster = (s.powerStructure?.factions || []).map((f) => f.faction);
      if (roster.length < 2) misses.push(`${settType}-${i}: ${roster.join(', ')} alone`);
    }
    expect(misses).toEqual([]);
  }, 120_000);
});
