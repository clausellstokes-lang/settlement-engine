/**
 * tests/domain/regionRelationshipB06Fixes.test.js
 *
 * Regression coverage for the B06-domain-region review fixes in the canonical
 * relationship normalizer and the region/regionalGraph systems:
 *   #1/#3 ONE shared canonical-label normalizer; aliases resolve consistently
 *         across the three regional systems (no drift, no neutral fallthrough).
 *   #1    a 'smuggling_partner' relationship now mints criminal channels.
 *   #5    legacy vassal/overlord direction prefers the AUTHORED direction over
 *         the settlement-size heuristic.
 *   #6    deriveRegionalImpacts feeds the already-normalized graph to the
 *         direct-impact channel lookup (single normalize), result unchanged.
 *   #7    channelIdFor keeps id-less goods sets distinct (no '[object Object]').
 */

import { describe, it, expect } from 'vitest';
import {
  canonicalRelationshipLabel,
  canonicalPropagationLabel,
  canonicalEdgeForLink,
} from '../../src/domain/relationships/canonicalRelationship.js';
import {
  channelIdFor,
  relationshipChannelBundle,
  canonicalRelationshipLabel as regionCanonicalLabel,
} from '../../src/domain/region/graph.js';
import { deriveRegionalImpacts } from '../../src/domain/region/propagation.js';
import { deriveRegionalLink } from '../../src/domain/regionalGraph.js';

describe('B06 #3 — one shared canonical-label normalizer', () => {
  it('region/graph.js re-export delegates to the shared normalizer', () => {
    // Same input must give the same output through both entry points.
    for (const raw of ['ally', 'alliance', 'overlord', 'trade_partners', 'coldwar', 'smuggling']) {
      expect(regionCanonicalLabel(raw)).toBe(canonicalRelationshipLabel(raw));
    }
  });

  it('normalizes spelling/synonym variants to one canonical base', () => {
    expect(canonicalRelationshipLabel('ally')).toBe('allied');
    expect(canonicalRelationshipLabel('alliance')).toBe('allied');
    expect(canonicalRelationshipLabel('overlord')).toBe('vassal');
    expect(canonicalRelationshipLabel('trade_partners')).toBe('trade_partner');
    expect(canonicalRelationshipLabel('cold-war')).toBe('cold_war');
  });

  it('keeps smuggling_partner as a first-class regional vocab term', () => {
    // CROSS-VOCAB-SAFE: the shared label table must NOT collapse
    // smuggling_partner to criminal_network (that lives in the matrix vocab).
    expect(canonicalRelationshipLabel('smuggling_partner')).toBe('smuggling_partner');
    expect(canonicalRelationshipLabel('smuggling')).toBe('smuggling_partner');
    // ...while the matrix-vocab normalizer DOES collapse it.
    expect(canonicalPropagationLabel('smuggling_partner')).toBe('criminal_network');
    expect(canonicalPropagationLabel('smuggling')).toBe('criminal_network');
  });

  it('regionalGraph classification still maps legacy aliases via the shared table', () => {
    expect(deriveRegionalLink({ name: 'X', relationshipType: 'ally' }, { id: 'c' }).relationshipType)
      .toBe('protector');
    expect(deriveRegionalLink({ name: 'X', relationshipType: 'overlord' }, { id: 'c' }).relationshipType)
      .toBe('tax_authority');
    // smuggling_partner remains a regional type, not corrupted.
    expect(deriveRegionalLink({ name: 'X', relationshipType: 'smuggling' }, { id: 'c' }).relationshipType)
      .toBe('smuggling_partner');
  });
});

describe('B06 #1 — smuggling_partner mints criminal channels', () => {
  it('produces criminal_corridor + information_flow channels', () => {
    const edge = { from: 'a', to: 'b', id: 'edge.a.b' };
    const bundle = relationshipChannelBundle(edge, 'smuggling_partner');
    expect(bundle.length).toBeGreaterThan(0);
    const types = new Set(bundle.map(c => c.type));
    expect(types.has('criminal_corridor')).toBe(true);
  });

  it("an authored 'smuggling' label heals to the same criminal bundle", () => {
    const edge = { from: 'a', to: 'b', id: 'edge.a.b' };
    const viaSmuggling = relationshipChannelBundle(edge, 'smuggling');
    const viaCriminal = relationshipChannelBundle(edge, 'criminal_network');
    expect(new Set(viaSmuggling.map(c => c.type)))
      .toEqual(new Set(viaCriminal.map(c => c.type)));
  });
});

describe('B06 #5 — legacy hierarchical direction prefers authored direction', () => {
  const small = { id: 'small', tier: 'village', settlement: { population: 300 } };
  const big = { id: 'big', tier: 'city', settlement: { population: 12000 } };

  it('honors a role hint that the SMALLER settlement is the overlord', () => {
    // A deposed-but-sovereign capital: small is canonically the overlord.
    const edge = canonicalEdgeForLink(
      { relationshipType: 'vassal', localRelationshipRole: 'overlord' },
      small,
      big,
    );
    // canonical edge: from = overlord, to = vassal.
    expect(edge).toEqual({ from: 'small', to: 'big', relationshipType: 'vassal' });
  });

  it("treats a raw 'overlord' type as 'the source is the overlord'", () => {
    const edge = canonicalEdgeForLink({ relationshipType: 'overlord' }, small, big);
    expect(edge).toEqual({ from: 'small', to: 'big', relationshipType: 'vassal' });
  });

  it('honors a role hint that the source is the vassal', () => {
    const edge = canonicalEdgeForLink(
      { relationshipType: 'vassal', localRelationshipRole: 'vassal' },
      small,
      big,
    );
    expect(edge).toEqual({ from: 'big', to: 'small', relationshipType: 'vassal' });
  });

  it("falls back to the size heuristic only for an ambiguous raw 'vassal'", () => {
    const edge = canonicalEdgeForLink({ relationshipType: 'vassal' }, small, big);
    // No directional signal → stronger (city) becomes overlord.
    expect(edge).toEqual({ from: 'big', to: 'small', relationshipType: 'vassal' });
  });
});

describe('B06 #7 — channelIdFor keeps distinct goods sets distinct', () => {
  it('id-less goods objects do not collapse to one channel id', () => {
    const a = channelIdFor({ type: 'trade_dependency', from: 'x', to: 'y', goods: [{ label: 'Iron' }] });
    const b = channelIdFor({ type: 'trade_dependency', from: 'x', to: 'y', goods: [{ label: 'Grain' }] });
    expect(a).not.toBe(b);
    expect(a).not.toContain('object');
    expect(b).not.toContain('object');
  });

  it('normalized goods (with ids) still produce the original stable id', () => {
    const withId = channelIdFor({ type: 'trade_dependency', from: 'x', to: 'y', goods: [{ id: 'iron' }] });
    expect(withId).toBe('channel.trade_dependency.x.y.iron');
  });
});

describe('B06 #6 — deriveRegionalImpacts single-normalize path is equivalent', () => {
  it('still derives the direct impact off a confirmed channel', () => {
    const graph = {
      schemaVersion: 2,
      nodes: [{ id: 'a' }, { id: 'b' }],
      channels: [{
        id: 'channel.trade_dependency.a.b.iron',
        type: 'trade_dependency',
        from: 'a',
        to: 'b',
        status: 'confirmed',
        strength: 0.8,
        confidence: 0.8,
        goods: [{ id: 'iron', label: 'Iron' }],
      }],
    };
    const localDelta = {
      id: 'ld1',
      sourceSettlementId: 'a',
      sourceSettlementName: 'Aford',
      changes: [{ kind: 'export_lost', good: { id: 'iron', label: 'Iron' }, magnitude: 0.8 }],
    };
    const impacts = deriveRegionalImpacts(localDelta, graph, { now: 'TICK_1' });
    expect(impacts.length).toBeGreaterThan(0);
    expect(impacts[0].targetSettlementId).toBe('b');
    expect(impacts[0].kind).toBe('import_shortage');
    // The threaded `now` is stamped deterministically (no wall clock).
    expect(impacts[0].createdAt).toBe('TICK_1');
  });
});
