import { describe, it, expect } from 'vitest';
import { deriveTradeLinks } from '../../../src/domain/region/tradeLinks.js';

// §14 Phase 3b — good-level cross-settlement trade with the imported neighbour.
describe('deriveTradeLinks', () => {
  it('links our import to a matching neighbour export (inbound)', () => {
    const links = deriveTradeLinks([], ['Grain'], {
      name: 'Stonehaven', relationshipType: 'trade_partner', primaryExports: ['Grain'], primaryImports: [],
    });
    expect(links).toHaveLength(1);
    expect(links[0]).toMatchObject({ direction: 'import', partner: 'Stonehaven', viaNeighbour: true });
  });

  it('links our export to a matching neighbour import (outbound)', () => {
    const links = deriveTradeLinks(['Iron'], [], {
      name: 'Stonehaven', relationshipType: 'allied', primaryExports: [], primaryImports: ['Iron'],
    });
    expect(links).toHaveLength(1);
    expect(links[0]).toMatchObject({ direction: 'export', partner: 'Stonehaven' });
  });

  it('resolves both directions at once', () => {
    const links = deriveTradeLinks(['Iron'], ['Grain'], {
      name: 'Stonehaven', relationshipType: 'neutral', primaryExports: ['Grain'], primaryImports: ['Iron'],
    });
    expect(links.map((l) => l.direction).sort()).toEqual(['export', 'import']);
  });

  it('returns empty for a hostile relationship even with overlap', () => {
    expect(deriveTradeLinks(['Iron'], ['Grain'], {
      name: 'Foecastle', relationshipType: 'hostile', primaryExports: ['Grain'], primaryImports: ['Iron'],
    })).toEqual([]);
  });

  it('returns empty for a suppress economy mode', () => {
    expect(deriveTradeLinks(['Iron'], ['Grain'], {
      name: 'Foecastle', relationshipType: 'rival', dynamics: { economyMode: 'suppress' }, primaryExports: ['Grain'], primaryImports: ['Iron'],
    })).toEqual([]);
  });

  it('returns empty when there is no neighbour', () => {
    expect(deriveTradeLinks(['Iron'], ['Grain'], null)).toEqual([]);
  });

  it('returns empty when no goods overlap', () => {
    expect(deriveTradeLinks(['Iron'], ['Grain'], {
      name: 'Stonehaven', relationshipType: 'neutral', primaryExports: ['Silk bolts'], primaryImports: ['Exotic spices'],
    })).toEqual([]);
  });
});
