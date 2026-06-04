/**
 * tests/domain/regionalGraph.test.js — Tier 4.13 lean tests.
 */

import { describe, it, expect } from 'vitest';
import {
  REGIONAL_RELATIONSHIP_TYPES,
  deriveRegionalLink,
  deriveRegionalGraph,
  regionalBreakdown,
  summarizeRegional,
  supportedRelationshipTypes,
} from '../../src/domain/regionalGraph.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

describe('catalog', () => {
  it('exposes 13 canonical types', () => {
    expect(REGIONAL_RELATIONSHIP_TYPES).toHaveLength(13);
    expect(REGIONAL_RELATIONSHIP_TYPES).toContain('supplier');
    expect(REGIONAL_RELATIONSHIP_TYPES).toContain('rival');
    expect(REGIONAL_RELATIONSHIP_TYPES).toContain('military_threat');
    expect(REGIONAL_RELATIONSHIP_TYPES).toContain('other');
    expect(supportedRelationshipTypes()).toEqual([...REGIONAL_RELATIONSHIP_TYPES]);
  });
});

describe('deriveRegionalLink()', () => {
  it('legacy "hostile" maps to military_threat', () => {
    const link = deriveRegionalLink({ name: 'Blackmoor', relationshipType: 'hostile' }, { id: 'settlement.center' });
    expect(link.relationshipType).toBe('military_threat');
    expect(link.direction).toBe('incoming');
  });

  it('legacy "ally" maps to protector', () => {
    const link = deriveRegionalLink({ name: 'Highvale', relationshipType: 'ally' }, { id: 'settlement.center' });
    expect(link.relationshipType).toBe('protector');
  });

  it('legacy "trade_partner" maps to market_hub', () => {
    const link = deriveRegionalLink({ name: 'Riverford', relationshipType: 'trade_partner' }, { id: 'settlement.center' });
    expect(link.relationshipType).toBe('market_hub');
    expect(link.direction).toBe('bidirectional');
  });

  it('falls back to name pattern when relationshipType missing', () => {
    const link = deriveRegionalLink({ name: 'The Great Market' }, { id: 'settlement.center' });
    expect(link.relationshipType).toBe('market_hub');
  });

  it('returns "other" when nothing matches', () => {
    const link = deriveRegionalLink({ name: 'A nameless place' }, { id: 'settlement.center' });
    expect(link.relationshipType).toBe('other');
  });

  it('respects explicit regionalType override', () => {
    const link = deriveRegionalLink(
      { name: 'Whoever', regionalType: 'smuggling_partner' },
      { id: 'settlement.center' }
    );
    expect(link.relationshipType).toBe('smuggling_partner');
  });

  it('includes propagation hints for the relationship type', () => {
    const link = deriveRegionalLink({ name: 'Ironmere', relationshipType: 'supplier' }, { id: 'settlement.center' });
    expect(link.propagationHints.length).toBeGreaterThan(0);
  });

  it('returns null for nullish input', () => {
    expect(deriveRegionalLink(null, {})).toBeNull();
  });
});

describe('deriveRegionalGraph()', () => {
  it('returns center + node + link arrays', () => {
    const s = {
      id: 'settlement.greycairn',
      name: 'Greycairn',
      neighbours: [
        { name: 'Blackmoor',  relationshipType: 'hostile' },
        { name: 'Ironmere',   relationshipType: 'supplier' },
        { name: 'Riverford',  relationshipType: 'trade_partner' },
      ],
    };
    const g = deriveRegionalGraph(s);
    expect(g.center).toBe('settlement.greycairn');
    expect(g.nodes.length).toBe(4);  // center + 3 neighbours
    expect(g.links.length).toBe(3);
    const types = new Set(g.links.map(l => l.relationshipType));
    expect(types.has('military_threat')).toBe(true);
    expect(types.has('supplier')).toBe(true);
    expect(types.has('market_hub')).toBe(true);
  });

  it('aggregates from neighbours[] + neighbourNetwork[]', () => {
    const s = {
      id: 'x',
      neighbours: [{ name: 'A', relationshipType: 'ally' }],
      neighbourNetwork: [{ name: 'B', relationshipType: 'hostile' }],
    };
    const g = deriveRegionalGraph(s);
    expect(g.links).toHaveLength(2);
  });

  it('returns empty graph for nullish settlement', () => {
    const g = deriveRegionalGraph(null);
    expect(g.nodes).toEqual([]);
    expect(g.links).toEqual([]);
  });

  it('returns center-only graph when no neighbours present', () => {
    const g = deriveRegionalGraph({ id: 'x', name: 'X' });
    expect(g.nodes).toHaveLength(1);
    expect(g.links).toHaveLength(0);
  });
});

describe('regionalBreakdown()', () => {
  it('counts links by relationship type', () => {
    const s = {
      neighbours: [
        { name: 'A', relationshipType: 'hostile' },
        { name: 'B', relationshipType: 'hostile' },
        { name: 'C', relationshipType: 'supplier' },
      ],
    };
    const b = regionalBreakdown(s);
    expect(b.military_threat).toBe(2);
    expect(b.supplier).toBe(1);
  });
});

describe('summarizeRegional()', () => {
  it('emits one line per link', () => {
    const s = { neighbours: [{ name: 'A', relationshipType: 'ally' }] };
    const lines = summarizeRegional(s);
    expect(lines).toHaveLength(1);
    expect(lines[0]).toMatch(/protector/);
  });

  it('emits placeholder line when empty', () => {
    expect(summarizeRegional({})).toEqual(['No structured regional neighbours.']);
  });
});

describe('purity + smoke', () => {
  it('does not mutate input settlement', () => {
    const s = { neighbours: [{ name: 'A', relationshipType: 'hostile' }] };
    const before = JSON.stringify(s);
    deriveRegionalGraph(s);
    expect(JSON.stringify(s)).toBe(before);
  });

  it('runs over a real settlement (probably empty graph)', () => {
    const settlement = generateSettlementPipeline(
      { settType: 'city', culture: 'germanic' },
      null,
      { seed: 'regional-real-city', customContent: {} },
    );
    const g = deriveRegionalGraph(settlement);
    expect(g).toBeTruthy();
    expect(Array.isArray(g.links)).toBe(true);
  });
});
