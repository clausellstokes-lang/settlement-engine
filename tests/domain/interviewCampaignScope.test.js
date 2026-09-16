/**
 * tests/domain/interviewCampaignScope.test.js — the V-26a CAMPAIGN-WIDE SCOPE pin.
 *
 * The Interview follow-on: `selectSlices({ scope: 'campaign', campaignSettlements })`
 * assembles the grounding bundle ACROSS the campaign's settlements instead of the single
 * anchored one. The pins:
 *   • settlement-scoped briefs fan across every member, each slice NAMESPACED by
 *     settlement (unique ids, legible titles) so a citation resolves to the right town;
 *   • realm-scoped briefs compose ONCE for the whole campaign (not per settlement);
 *   • the structural player-safe backstop still drops ground-truth slices;
 *   • the member count is bounded (bundle-size guard);
 *   • the default 'settlement' scope is unchanged (the aiAnalyst pins prove byte-identity).
 */
import { describe, it, expect } from 'vitest';
import { selectSlices } from '../../src/domain/ai/stateSlicers.js';
import { isPlayerSafeSource } from '../../src/domain/briefs/citations.js';

function treaty(victorId, loserId, terms = [{ type: 'tribute', complianceState: 'honored' }]) {
  return { victorId, loserId, parties: [victorId, loserId], terms };
}
function litWorld() {
  return {
    tick: 20,
    deployments: { thorn: { targetId: 'a' } },
    spatialLedgers: {
      treaties: {
        t1: treaty('thorn', 'a'), t2: treaty('thorn', 'b', [{ type: 'compelled_alliance', complianceState: 'honored' }]),
        t3: treaty('thorn', 'c', [{ type: 'puppet_seat', complianceState: 'honored' }]),
      },
      credibility: { s1: { score: 8, lastUpdateTick: 5, holder: 'people_held' } },
    },
    politicsLedgers: {
      s1: { blocs: [
        { id: 'b1', members: ['The Guildhall'], glue: [{ type: 'commerce', detail: 'x' }], end: 'commerce', strain: 0.4, sinceTick: 3 },
        { id: 'c1', members: ['The Whispered Court'], glue: [{ type: 'threat', detail: 'y' }], end: 'seats', strain: 0.2, sinceTick: 4, covert: true },
      ] },
    },
  };
}
function litSettlement(id, name) {
  return {
    id, name, tier: 'town', population: 1200, thesis: 'A river town.',
    npcs: [{ id: `${id}-n1`, name: 'Mira', role: 'reeve', power: 8, influence: 'high', secret: { what: 'skimming the tithe' }, goal: { short: 'buy the mill' } }],
    dmNotes: 'The reeve is the villain.', _seed: 42,
  };
}
const SETTLEMENTS = [
  { id: 'thorn', name: 'Thornwall' }, { id: 'a', name: 'Ashford' },
  { id: 'b', name: 'Briarwatch' }, { id: 'c', name: 'Caldmoor' }, { id: 's1', name: 'Rivermeet' },
];

describe('selectSlices — campaign-wide scope (V-26a)', () => {
  const world = litWorld();
  const s1 = litSettlement('s1', 'Rivermeet');
  const s2 = litSettlement('thorn', 'Thornwall');

  it('fans settlement briefs across the members with settlement-namespaced, unique ids', () => {
    const { slices, scope } = selectSlices({
      question: 'what factions are moving here?', worldState: world, settlements: SETTLEMENTS,
      scope: 'campaign', campaignSettlements: [s1, s2], audience: 'dm', tick: 5,
    });
    expect(scope).toBe('campaign');
    const ids = slices.map((s) => s.id);
    expect(ids.some((id) => id.includes('@s1:'))).toBe(true);
    expect(ids.some((id) => id.includes('@thorn:'))).toBe(true);
    // every id is unique (no cross-member collision that would confuse resolution)
    expect(new Set(ids).size).toBe(ids.length);
    // titles carry the settlement name so a receipt chip reads legibly
    expect(slices.some((s) => /^Rivermeet — /.test(s.title))).toBe(true);
    expect(slices.some((s) => /^Thornwall — /.test(s.title))).toBe(true);
  });

  it('realm-scoped briefs compose ONCE for the whole campaign (never namespaced)', () => {
    const { slices } = selectSlices({
      question: 'what factions dominate the region?', worldState: world, settlements: SETTLEMENTS,
      scope: 'campaign', campaignSettlements: [s1, s2], audience: 'dm',
    });
    const factionSlices = slices.filter((s) => s.id.startsWith('faction:'));
    expect(factionSlices.length).toBeGreaterThan(0);
    for (const s of factionSlices) expect(s.id).not.toContain('@');
  });

  it('the structural player-safe backstop still drops ground-truth slices in campaign scope', () => {
    const { audience, slices } = selectSlices({
      question: 'what can I tell the players across the campaign?', worldState: world, settlements: SETTLEMENTS,
      scope: 'campaign', campaignSettlements: [s1, s2], audience: 'dm',
    });
    expect(audience).toBe('player');
    for (const s of slices) expect(isPlayerSafeSource(s.source)).toBe(true);
  });

  it('bounds the number of settlements it fans across (bundle-size guard)', () => {
    const many = Array.from({ length: 10 }, (_, i) => litSettlement(`x${i}`, `Town${i}`));
    const { slices } = selectSlices({
      question: 'what is happening in each town?', worldState: world, settlements: SETTLEMENTS,
      scope: 'campaign', campaignSettlements: many, audience: 'dm',
    });
    const memberIds = new Set(slices.map((s) => (s.id.match(/@([^:]+):/) || [])[1]).filter(Boolean));
    expect(memberIds.size).toBeLessThanOrEqual(6);
    expect(memberIds.size).toBeGreaterThan(0);
  });

  it('an empty campaign yields no slices (inert), never throws', () => {
    const { slices } = selectSlices({
      question: 'what is happening?', worldState: { tick: 0 }, settlements: [],
      scope: 'campaign', campaignSettlements: [], audience: 'dm',
    });
    expect(slices).toEqual([]);
  });
});
