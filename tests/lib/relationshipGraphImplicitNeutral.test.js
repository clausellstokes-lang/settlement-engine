/**
 * relationshipGraphImplicitNeutral.test.js — the cascade engine reading co-campaign
 * settlements as implicit Neutral neighbours through the effectiveNeighboursOf
 * chokepoint (owner order 2026-07-22).
 *
 * Also carries THE ROUTES-UNTOUCHED PIN: placing / co-campaigning settlements
 * creates NO route. Routes stay the realm's deterministic infrastructure
 * (computeRoadEdges reads RAW explicit links, and neutral is not a trade
 * relationship), so an implicit neutral neighbour never becomes a road.
 */
import { describe, test, expect } from 'vitest';
import {
  buildGraph,
  getSettlementModifiers,
  getAllModifiers,
} from '../../src/lib/relationshipGraph.js';
import { campaignMembershipIndex } from '../../src/domain/relationships/effectiveNeighbours.js';
import { computeRoadEdges } from '../../src/lib/roadNetwork.js';

function save(id, name, neighbours = [], tier = 'town') {
  return { id, name, settlement: { name, neighbourNetwork: neighbours, tier }, config: {}, tier };
}

describe('buildGraph — campaign-aware implicit neutral edges', () => {
  const A = save('a', 'Aford');
  const B = save('b', 'Bton');
  const C = save('c', 'Cwick');

  test('NO campaignOf ⇒ strict no-op: unlinked settlements have no edges', () => {
    const graph = buildGraph([A, B, C]);
    expect(graph.get('a')).toEqual([]);
    expect(graph.get('b')).toEqual([]);
    expect(graph.get('c')).toEqual([]);
  });

  test('WITH campaignOf ⇒ every co-campaign pair gets a neutral edge (both directions)', () => {
    const campaignOf = campaignMembershipIndex([{ id: 'camp1', settlementIds: ['a', 'b', 'c'] }]);
    const graph = buildGraph([A, B, C], { campaignOf });
    const targets = (id) => graph.get(id).map((e) => e.targetId).sort();
    expect(targets('a')).toEqual(['b', 'c']);
    expect(targets('b')).toEqual(['a', 'c']);
    expect(targets('c')).toEqual(['a', 'b']);
    for (const e of graph.get('a')) expect(e.relType).toBe('neutral');
  });

  test('cross-campaign settlements are NOT implicit neighbours', () => {
    const campaignOf = campaignMembershipIndex([
      { id: 'camp1', settlementIds: ['a', 'b'] },
      { id: 'camp2', settlementIds: ['c'] },
    ]);
    const graph = buildGraph([A, B, C], { campaignOf });
    expect(graph.get('a').map((e) => e.targetId)).toEqual(['b']); // not c
    expect(graph.get('c')).toEqual([]); // alone in camp2
  });

  test('settlements in NO campaign get no implicit neighbours', () => {
    const campaignOf = campaignMembershipIndex([{ id: 'camp1', settlementIds: ['a'] }]);
    const graph = buildGraph([A, B], { campaignOf });
    expect(graph.get('a')).toEqual([]); // alone in its campaign
    expect(graph.get('b')).toEqual([]); // in no campaign
  });

  test('explicit link still wins over the implicit neutral default', () => {
    const A2 = save('a', 'Aford', [{ id: 'b', neighbourName: 'Bton', relationshipType: 'hostile' }]);
    const B2 = save('b', 'Bton', [{ id: 'a', neighbourName: 'Aford', relationshipType: 'hostile' }]);
    const C2 = save('c', 'Cwick');
    const campaignOf = campaignMembershipIndex([{ id: 'camp1', settlementIds: ['a', 'b', 'c'] }]);
    const graph = buildGraph([A2, B2, C2], { campaignOf });
    const aEdges = graph.get('a');
    const bEdge = aEdges.find((e) => e.targetId === 'b');
    const cEdge = aEdges.find((e) => e.targetId === 'c');
    expect(bEdge.relType).toBe('hostile');  // explicit preserved
    expect(cEdge.relType).toBe('neutral');  // implicit default
  });

  test('deterministic — same inputs produce identical graphs (x2)', () => {
    const campaignOf = campaignMembershipIndex([{ id: 'camp1', settlementIds: ['a', 'b', 'c'] }]);
    const g1 = buildGraph([A, B, C], { campaignOf });
    const g2 = buildGraph([A, B, C], { campaignOf });
    expect([...g1.entries()]).toEqual([...g2.entries()]);
  });
});

describe('getSettlementModifiers / getAllModifiers — implicit neutrals produce coherent effects', () => {
  const A = save('a', 'Aford');
  const B = save('b', 'Bton');
  const campaignOf = campaignMembershipIndex([{ id: 'camp1', settlementIds: ['a', 'b'] }]);

  test('a lone unlinked co-campaign pair now has non-empty Network Effects sources', () => {
    const withCampaign = getSettlementModifiers('a', [A, B], { campaignOf });
    expect(withCampaign.sources.length).toBeGreaterThan(0);
    // ...and remains empty without campaign context (behaviour before this change).
    const without = getSettlementModifiers('a', [A, B]);
    expect(without.sources.length).toBe(0);
  });

  test('getAllModifiers activates for both members under a campaign', () => {
    const all = getAllModifiers([A, B], 4, { campaignOf });
    expect(all.get('a').sources.length).toBeGreaterThan(0);
    expect(all.get('b').sources.length).toBeGreaterThan(0);
  });
});

describe('NUMERIC ids — implicit targetId must match the raw graph keys (regression)', () => {
  // Cloud saves carry NUMERIC ids (saves.js: `id = v2.id || Date.now()`). The
  // implicit edge's targetId must be the RAW id, or a numeric-id node gets keyed
  // as `3` in the graph but `"3"` on the implicit edge — two distinct Set/Map
  // keys — double-visiting an already-explicitly-linked partner.
  test('an explicitly-linked partner is NOT also counted as an implicit neutral (no double-count)', () => {
    // S(1) is rival with B(3) and allied with A(2); A has no explicit link to B.
    // From S, B must be reached ONCE (rival), never a second time as the phantom
    // neutral routed through A's implicit edge to B.
    const S = save(1, 'Sford', [
      { id: 2, neighbourName: 'Aton', relationshipType: 'allied' },
      { id: 3, neighbourName: 'Bwick', relationshipType: 'rival' },
    ]);
    const A = save(2, 'Aton', []);
    const B = save(3, 'Bwick', [{ id: 1, neighbourName: 'Sford', relationshipType: 'rival' }]);
    const campaignOf = campaignMembershipIndex([{ id: 'camp1', settlementIds: [1, 2, 3] }]);
    const mods = getSettlementModifiers(1, [S, A, B], { campaignOf });
    const bSources = mods.sources.filter((s) => String(s.settlementId) === '3');
    expect(bSources.length).toBe(1);            // exactly one — no phantom neutral
    expect(bSources[0].relType).toBe('rival');  // the explicit relationship, not neutral
  });

  test('numeric-id and string-id topologies produce identical totals', () => {
    const build = (ids) => {
      const [a, b] = ids;
      const A = save(a, 'Aford', []);
      const B = save(b, 'Bton', []);
      const campaignOf = campaignMembershipIndex([{ id: 'camp1', settlementIds: [a, b] }]);
      return getSettlementModifiers(a, [A, B], { campaignOf }).totals;
    };
    expect(build([1, 2])).toEqual(build(['a', 'b'])); // numeric enrichment matches string
  });
});

describe('ROUTES UNTOUCHED — co-campaign / placement creates no route', () => {
  test('co-campaign settlements with NO explicit links draw NO relationship-derived route', () => {
    // Any route between these two comes from the REALM's deterministic
    // infrastructure (placement connectivity: a 'lane'/'highway', reason
    // 'nearest'/'mst') — never from the implicit neutral neighbour reading, which
    // computeRoadEdges cannot even see (it reads raw neighbourNetwork, and neutrals
    // are never written there). So no edge is relationship-derived (reason 'rel:').
    const A = save('a', 'Aford', [], 'village');
    const B = save('b', 'Bton', [], 'village');
    const placements = {
      burgA: { settlementId: 'a', x: 10, y: 10 },
      burgB: { settlementId: 'b', x: 90, y: 90 },
    };
    const edges = computeRoadEdges([A, B], placements);
    const relationshipRoutes = edges.filter((e) => String(e.reason).startsWith('rel:'));
    expect(relationshipRoutes).toEqual([]); // being neighbours created no route
  });

  test('a NEUTRAL relationshipType never yields a trade road (neutral ∉ TRADE_RELATIONSHIPS)', () => {
    // Even if a neutral link reached the road builder, it must not create a route.
    const A = save('a', 'Aford', [{ id: 'b', neighbourName: 'Bton', relationshipType: 'neutral' }], 'village');
    const B = save('b', 'Bton', [{ id: 'a', neighbourName: 'Aford', relationshipType: 'neutral' }], 'village');
    const placements = {
      burgA: { settlementId: 'a', x: 10, y: 10 },
      burgB: { settlementId: 'b', x: 90, y: 90 },
    };
    const tradeEdges = computeRoadEdges([A, B], placements).filter((e) => e.tier === 'trade');
    expect(tradeEdges).toEqual([]);
  });
});
