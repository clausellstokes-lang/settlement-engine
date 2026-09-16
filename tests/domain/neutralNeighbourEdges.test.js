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
 *   7. K-NEAREST (J-D2 as AMENDED 2026-07-31, wave B1b) — the pair SELECTION: the
 *      k-NN graph is COMPLETE at S <= 4 (where the small-N stasis medicine binds),
 *      bounded by S·k above it, spatially driven when the world carries a frozen
 *      canon, codepoint-rank driven when it does not, and codepoint-tiebroken.
 */
import { describe, it, expect } from 'vitest';

import { ensureRegionalGraph } from '../../src/domain/region/graph.js';
import {
  NEUTRAL_DEFAULT_EDGE_SOURCE,
  NEUTRAL_DEFAULT_K,
  isNeutralDefaultEdge,
  neutralNeighbourPairs,
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

  it('connects every pair of a three-member campaign (k-NN is complete at S <= 4)', () => {
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

// ── THE K-NEAREST SELECTION (J-D2 as AMENDED 2026-07-31 — wave B1b) ───────────
// B1 shipped an ALL-PAIRS selection, whose lit edge set is C(S,2) — quadratic. The
// amendment makes the default edge set each member's k nearest fellows, unioned.
// The two claims that carry the amendment are pinned here directly on the pure
// selection, exactly and cheaply, rather than inferred from a driven pulse.

/** `[from, to]` tuples rendered as sortable, readable pair labels. */
const labels = (pairs) => pairs.map(([a, b]) => `${a}~${b}`);

/** Codepoint-sorted labels of the complete graph over `ids` — the reference set. */
function completeLabels(ids) {
  const out = [];
  for (let i = 0; i < ids.length; i += 1) {
    for (let j = i + 1; j < ids.length; j += 1) {
      const [a, b] = [ids[i], ids[j]].sort();
      out.push(`${a}~${b}`);
    }
  }
  return out.sort();
}

// A hand-authored frozen canon. `activeSpatialDigest` needs a positive-integer
// spatialCanonVersion plus a distanceMatrix; pathCost then reads the matrix
// directly (no sea lanes / teleport / season ⇒ its O(1) fast path).
const SPATIAL_IDS = ['alpha', 'beta', 'delta', 'epsilon', 'gamma'];
const SPATIAL_COSTS = {
  'alpha|beta': 10,
  'alpha|gamma': 15,
  'alpha|delta': 20,
  'alpha|epsilon': 20,   // ties with alpha↔delta at alpha's THIRD (last) slot
  'beta|gamma': 12,
  'beta|delta': 8,
  'beta|epsilon': 5,
  'delta|gamma': 9,
  'epsilon|gamma': 6,
  'delta|epsilon': 7,
};

/** A worldState carrying the frozen canon above, restricted to `ids`. */
function spatialWorld(ids = SPATIAL_IDS) {
  const distanceMatrix = {};
  for (const from of ids) {
    distanceMatrix[from] = {};
    for (const to of ids) {
      if (to === from) continue;
      const key = [from, to].sort().join('|');
      distanceMatrix[from][to] = SPATIAL_COSTS[key];
    }
  }
  return { spatialCanonVersion: 1, spatialDigest: { settlementIds: [...ids], distanceMatrix } };
}

describe('k-nearest selection — COMPLETE at S <= 4 (where the stasis medicine binds)', () => {
  it('every membership of 2, 3 or 4 selects the COMPLETE graph, aspatial and spatial alike', () => {
    // k = 3 is the whole argument: a member with at most 3 fellows has all of them
    // among its 3 nearest, so the amendment costs the small-N case nothing.
    expect(NEUTRAL_DEFAULT_K).toBe(3);
    for (const size of [2, 3, 4]) {
      const aspatialIds = ['ashford', 'brightmoor', 'crowfen', 'dunmoor'].slice(0, size);
      expect(labels(neutralNeighbourPairs(aspatialIds)).sort(), `aspatial S=${size}`)
        .toEqual(completeLabels(aspatialIds));

      const spatialIds = SPATIAL_IDS.slice(0, size);
      expect(labels(neutralNeighbourPairs(spatialIds, spatialWorld(spatialIds))).sort(), `spatial S=${size}`)
        .toEqual(completeLabels(spatialIds));
    }
  });

  it('the minted EDGES at S = 4 are still the complete graph end to end', () => {
    const ids = ['ashford', 'brightmoor', 'crowfen', 'dunmoor'];
    const minted = withNeutralNeighbourEdges(graphWith(), ids);
    expect(idsOf(minted)).toEqual([
      'edge.ashford.brightmoor',
      'edge.ashford.crowfen',
      'edge.ashford.dunmoor',
      'edge.brightmoor.crowfen',
      'edge.brightmoor.dunmoor',
      'edge.crowfen.dunmoor',
    ]);
  });
});

describe('k-nearest selection — BOUNDED above S = 4 (the asymptotic cure)', () => {
  // The alternative this replaces is the complete graph, so each scale carries its
  // own C(S,2) as the anti-vacuity reference: the bound only means something while
  // the complete graph it beats is genuinely bigger.
  const sizes = [5, 8, 12, 16, 24];
  const alphabet = 'abcdefghijklmnopqrstuvwx'.split('');

  it('the selected pair count never exceeds S·k, and falls strictly under C(S,2)', () => {
    for (const size of sizes) {
      const ids = alphabet.slice(0, size);
      const selected = neutralNeighbourPairs(ids);
      const complete = (size * (size - 1)) / 2;
      expect(selected.length, `S=${size} must stay within the S·k bound`)
        .toBeLessThanOrEqual(size * NEUTRAL_DEFAULT_K);
      expect(complete, `S=${size} — the complete graph must be BIGGER, or the bound proves nothing`)
        .toBeGreaterThan(selected.length);
      // LINEARITY, stated as a ratio the quadratic alternative cannot satisfy: the
      // selection stays within 3 edges per settlement while C(S,2) is (S-1)/2.
      expect(selected.length / size, `S=${size} edges-per-settlement`).toBeLessThanOrEqual(NEUTRAL_DEFAULT_K);
    }
    // The quadratic alternative, at the top scale, for the record: 24 settlements
    // would carry 276 default edges all-pairs versus at most 72 here.
    expect(completeLabels(alphabet.slice(0, 24)).length).toBe(276);
  });

  it('the aspatial fallback is the codepoint-rank line — exact selection at S = 6', () => {
    // No spatial canon ⇒ no "nearest" but the codepoint order. Each member takes its
    // rank-nearest fellows (i-1, i+1, i-2, …), so the union is a spanning chain with
    // short chords — bounded, deterministic, and never islands.
    expect(labels(neutralNeighbourPairs(['a', 'b', 'c', 'd', 'e', 'f'])).sort()).toEqual([
      'a~b', 'a~c', 'a~d',
      'b~c', 'b~d',
      'c~d', 'c~e', 'c~f',
      'd~e', 'd~f',
      'e~f',
    ]);
  });

  it('the aspatial fallback keeps every member reachable (no islands) at S = 16', () => {
    const ids = alphabet.slice(0, 16);
    const adjacency = new Map(ids.map((id) => [id, []]));
    for (const [a, b] of neutralNeighbourPairs(ids)) {
      adjacency.get(a).push(b);
      adjacency.get(b).push(a);
    }
    const seen = new Set([ids[0]]);
    const queue = [ids[0]];
    while (queue.length) {
      for (const next of adjacency.get(queue.pop())) {
        if (seen.has(next)) continue;
        seen.add(next);
        queue.push(next);
      }
    }
    expect([...seen].sort()).toEqual([...ids].sort());
  });
});

describe('k-nearest selection — the ORDERING LAW (spatial cost, then codepoint id)', () => {
  it('the frozen canon drives the choice — NOT the codepoint order it disagrees with', () => {
    const selected = labels(neutralNeighbourPairs(SPATIAL_IDS, spatialWorld())).sort();
    expect(selected).toEqual([
      'alpha~beta', 'alpha~delta', 'alpha~gamma',
      'beta~delta', 'beta~epsilon', 'beta~gamma',
      'delta~epsilon', 'delta~gamma',
      'epsilon~gamma',
    ]);
    // DISCRIMINATION: the same membership with NO canon selects a different set, so
    // the assertion above cannot be satisfied by the fallback quietly taking over.
    expect(labels(neutralNeighbourPairs(SPATIAL_IDS)).sort()).toEqual([
      'alpha~beta', 'alpha~delta', 'alpha~epsilon',
      'beta~delta', 'beta~epsilon', 'beta~gamma',
      'delta~epsilon', 'delta~gamma',
      'epsilon~gamma',
    ]);
  });

  it('an exact distance tie at the last slot is broken by the CODEPOINT id', () => {
    // alpha sits 20 from BOTH delta and epsilon, and has room for only one of them.
    // 'delta' < 'epsilon', so alpha~delta is selected and alpha~epsilon is the one
    // pair of the ten this membership can form that nobody selects — neither delta
    // (its three nearest are epsilon/beta/gamma) nor epsilon (beta/gamma/delta)
    // reaches back for it. The exact list above pins that; here is the crux alone.
    const world = spatialWorld();
    const selected = new Set(labels(neutralNeighbourPairs(SPATIAL_IDS, world)));
    expect(selected.has('alpha~delta')).toBe(true);
    expect(selected.has('alpha~epsilon')).toBe(false);
    // Anti-vacuity: the tie is real — both distances are present and equal.
    const matrix = world.spatialDigest.distanceMatrix;
    expect([matrix.alpha.delta, matrix.alpha.epsilon]).toEqual([20, 20]);
  });

  it('the selection is a pure function of the member SET, not its order', () => {
    const forward = labels(neutralNeighbourPairs(SPATIAL_IDS, spatialWorld()));
    const shuffled = labels(neutralNeighbourPairs(
      ['gamma', 'epsilon', 'alpha', 'delta', 'beta'], spatialWorld(),
    ));
    expect(shuffled).toEqual(forward);
    // ...and duplicates in the membership change nothing.
    expect(labels(neutralNeighbourPairs([...SPATIAL_IDS, 'alpha', 'gamma'], spatialWorld())))
      .toEqual(forward);
  });
});

describe('k-nearest selection — an authored tie outside the selection is never touched', () => {
  it('a DM edge between two NON-neighbours survives, and mints no reciprocal default', () => {
    // alpha↔epsilon is the pair the selection excludes. An authored edge there must
    // survive untouched: the selection governs what the default MINTS, never what
    // the graph already carries.
    const authored = graphWith([
      { id: 'edge.alpha.epsilon', from: 'alpha', to: 'epsilon', relationshipType: 'hostile' },
    ]);
    const result = withNeutralNeighbourEdges(authored, SPATIAL_IDS, spatialWorld());
    const kept = result.edges.find((e) => e.id === 'edge.alpha.epsilon');
    expect(kept.relationshipType).toBe('hostile');
    expect(isNeutralDefaultEdge(kept)).toBe(false);
    // The nine selected pairs mint nine defaults; the authored tenth stays alone.
    expect(defaultsOf(result).length).toBe(9);
    expect(result.edges.length).toBe(10);
  });
});
