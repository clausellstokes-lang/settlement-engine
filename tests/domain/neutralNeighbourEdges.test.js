/**
 * neutralNeighbourEdges.test.js — THE NEUTRAL-CONNECTED DEFAULT minter, unit pins
 * (realm directive 2 / judgment J-D2, 2026-07-31).
 *
 * The seam-level (real pulse) proofs — dormancy by object identity, explicit-beats-
 * default end to end, JSON-round-trip persistence, and the interaction-density
 * smoke — live in tests/property/neutralConnectedDefault.test.js. This file pins the
 * pure minter's contract:
 *
 *   1. FLAG — `neutralNeighborsEnabled === true` and nothing else (fail closed on the
 *      string 'true', 1, absent, and a missing rules object).
 *   2. STRICT NO-OP — nothing to add ⇒ the INPUT graph returned BY REFERENCE. This is
 *      the property the dormancy guarantee is built on.
 *   3. THE DEFAULT EDGE — neutral, channel-less (J-D2: known, NOT trading), carrying
 *      the provenance evidence row, stamped with the graph's own updatedAt (no clock).
 *   4. EXPLICIT WINS — in EITHER orientation, for any relationship type.
 *   5. ORDER STABILITY — a re-ordered member list yields a byte-identical graph.
 *   6. ROUND-TRIP — provenance survives JSON + ensureRegionalGraph, and re-minting
 *      over a round-tripped graph is idempotent (no duplicate defaults).
 */
import { describe, it, expect } from 'vitest';

import { ensureRegionalGraph } from '../../src/domain/region/graph.js';
import {
  NEUTRAL_DEFAULT_EDGE_SOURCE,
  isNeutralDefaultEdge,
  neutralNeighboursActive,
  withNeutralNeighbourEdges,
} from '../../src/domain/region/neutralNeighbourEdges.js';

const NOW = '2026-01-01T00:00:00.000Z';
const MEMBERS = ['ashford', 'brightmoor', 'crowfen'];

/** An ensured (normalized + branded) graph carrying exactly `edges`. */
function graphWith(edges = []) {
  return ensureRegionalGraph({ edges, updatedAt: NOW }, { now: NOW });
}

const idsOf = (graph) => (graph.edges || []).map((e) => e.id).sort();
const defaultsOf = (graph) => (graph.edges || []).filter(isNeutralDefaultEdge);

describe('neutralNeighboursActive — the virtual flag read (fail closed)', () => {
  it('only an explicit boolean true lights it', () => {
    expect(neutralNeighboursActive({ simulationRules: { neutralNeighborsEnabled: true } })).toBe(true);
    expect(neutralNeighboursActive({ simulationRules: { neutralNeighborsEnabled: false } })).toBe(false);
    expect(neutralNeighboursActive({ simulationRules: { neutralNeighborsEnabled: 'true' } })).toBe(false);
    expect(neutralNeighboursActive({ simulationRules: { neutralNeighborsEnabled: 1 } })).toBe(false);
  });

  it('absent rules / absent key / garbage worldState are dormant', () => {
    expect(neutralNeighboursActive({ simulationRules: {} })).toBe(false);
    expect(neutralNeighboursActive({})).toBe(false);
    expect(neutralNeighboursActive(null)).toBe(false);
    expect(neutralNeighboursActive(undefined)).toBe(false);
    expect(neutralNeighboursActive({ simulationRules: 'nonsense' })).toBe(false);
  });
});

describe('withNeutralNeighbourEdges — strict no-op contract (the dormancy substrate)', () => {
  it('fewer than two members returns the SAME graph object', () => {
    const graph = graphWith();
    expect(withNeutralNeighbourEdges(graph, [])).toBe(graph);
    expect(withNeutralNeighbourEdges(graph, ['ashford'])).toBe(graph);
    expect(withNeutralNeighbourEdges(graph, null)).toBe(graph);
  });

  it('a fully-connected member set returns the SAME graph object', () => {
    const graph = graphWith([
      { id: 'edge.ashford.brightmoor', from: 'ashford', to: 'brightmoor', relationshipType: 'trade_partner' },
    ]);
    // Anti-vacuity: the same pair set WOULD gain an edge if it were unconnected.
    expect(defaultsOf(withNeutralNeighbourEdges(graphWith(), ['ashford', 'brightmoor'])).length).toBe(1);
    expect(withNeutralNeighbourEdges(graph, ['ashford', 'brightmoor'])).toBe(graph);
  });

  it('repeated ids in the member list never mint a self-pair or a duplicate', () => {
    const minted = withNeutralNeighbourEdges(graphWith(), ['ashford', 'ashford', 'brightmoor']);
    expect(idsOf(minted)).toEqual(['edge.ashford.brightmoor']);
  });
});

describe('withNeutralNeighbourEdges — the default edge shape (J-D2)', () => {
  const minted = withNeutralNeighbourEdges(graphWith(), MEMBERS);

  it('connects every pair of campaign members', () => {
    expect(idsOf(minted)).toEqual([
      'edge.ashford.brightmoor',
      'edge.ashford.crowfen',
      'edge.brightmoor.crowfen',
    ]);
  });

  it('every default is neutral, channel-less, and provenance-marked', () => {
    expect(defaultsOf(minted).length).toBe(3);
    for (const edge of defaultsOf(minted)) {
      expect(edge.relationshipType).toBe('neutral');
      expect(edge.status).toBe('active');
      // J-D2: diplomatic KNOWN + minimal route awareness — NOT a trade route, no
      // resource flow. Channels are what carry goods/tax/protection, so a default
      // edge must carry none.
      expect(edge.channelIds).toEqual([]);
      expect(edge.evidence.map((row) => row.source)).toEqual([NEUTRAL_DEFAULT_EDGE_SOURCE]);
    }
  });

  it('inherits the graph updatedAt — no wall clock in the mint (determinism law)', () => {
    for (const edge of defaultsOf(minted)) expect(edge.updatedAt).toBe(NOW);
    // Re-minting from the same inputs is byte-identical.
    expect(withNeutralNeighbourEdges(graphWith(), MEMBERS)).toEqual(minted);
  });

  it('does not mutate the input graph', () => {
    const graph = graphWith();
    withNeutralNeighbourEdges(graph, MEMBERS);
    expect(graph.edges).toEqual([]);
  });
});

describe('withNeutralNeighbourEdges — explicit relationships always win', () => {
  it('an authored edge suppresses the default for its pair only', () => {
    const authored = graphWith([
      { id: 'edge.ashford.brightmoor', from: 'ashford', to: 'brightmoor', relationshipType: 'hostile' },
    ]);
    const result = withNeutralNeighbourEdges(authored, MEMBERS);
    const hostile = result.edges.find((e) => e.id === 'edge.ashford.brightmoor');
    expect(hostile.relationshipType).toBe('hostile');
    expect(isNeutralDefaultEdge(hostile)).toBe(false);
    expect(defaultsOf(result).map((e) => e.id).sort())
      .toEqual(['edge.ashford.crowfen', 'edge.brightmoor.crowfen']);
  });

  it('the REVERSE orientation of an authored edge also wins (unordered pair key)', () => {
    const reversed = graphWith([
      { id: 'edge.brightmoor.ashford', from: 'brightmoor', to: 'ashford', relationshipType: 'vassal' },
    ]);
    const result = withNeutralNeighbourEdges(reversed, MEMBERS);
    expect(idsOf(result)).toEqual([
      'edge.ashford.crowfen',
      'edge.brightmoor.ashford',
      'edge.brightmoor.crowfen',
    ]);
    expect(defaultsOf(result).length).toBe(2);
  });

  it('a channel_inferred edge (minted by ensureRegionalGraph) also counts as connected', () => {
    const channelled = ensureRegionalGraph({
      updatedAt: NOW,
      channels: [{ id: 'channel.trade_route.ashford.crowfen', type: 'trade_route', from: 'ashford', to: 'crowfen' }],
    }, { now: NOW });
    const result = withNeutralNeighbourEdges(channelled, MEMBERS);
    const inferred = result.edges.find((e) => e.from === 'ashford' && e.to === 'crowfen');
    expect(inferred.relationshipType).toBe('channel_inferred');
    expect(defaultsOf(result).map((e) => e.id).sort())
      .toEqual(['edge.ashford.brightmoor', 'edge.brightmoor.crowfen']);
  });
});

describe('withNeutralNeighbourEdges — order stability + JSON round-trip', () => {
  it('a re-ordered member list yields an identical graph', () => {
    const forward = withNeutralNeighbourEdges(graphWith(), MEMBERS);
    const shuffled = withNeutralNeighbourEdges(graphWith(), ['crowfen', 'ashford', 'brightmoor']);
    expect(shuffled).toEqual(forward);
  });

  it('provenance survives JSON + re-normalization, and re-minting is idempotent', () => {
    const minted = withNeutralNeighbourEdges(graphWith(), MEMBERS);
    const rehydrated = ensureRegionalGraph(JSON.parse(JSON.stringify(minted)), { now: NOW });
    expect(defaultsOf(rehydrated).length).toBe(3);
    expect(idsOf(rehydrated)).toEqual(idsOf(minted));
    // Idempotence: every pair is already connected, so the strict no-op fires.
    expect(withNeutralNeighbourEdges(rehydrated, MEMBERS)).toBe(rehydrated);
  });

  it('isNeutralDefaultEdge tells a default from an authored edge after a round-trip', () => {
    const mixed = withNeutralNeighbourEdges(graphWith([
      { id: 'edge.ashford.brightmoor', from: 'ashford', to: 'brightmoor', relationshipType: 'allied' },
    ]), MEMBERS);
    const rehydrated = ensureRegionalGraph(JSON.parse(JSON.stringify(mixed)), { now: NOW });
    const byId = new Map(rehydrated.edges.map((e) => [e.id, e]));
    expect(isNeutralDefaultEdge(byId.get('edge.ashford.brightmoor'))).toBe(false);
    expect(isNeutralDefaultEdge(byId.get('edge.ashford.crowfen'))).toBe(true);
  });
});
