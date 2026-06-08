import { describe, it, expect } from 'vitest';
import { inferSupplyChains } from '../../src/domain/inferSupplyChains.js';

// Identity resolver: dependency fields hold bare names in these fixtures.
const idResolve = (r) => (typeof r === 'string' ? r : null);

describe('inferSupplyChains', () => {
  it('discovers a multi-hop chain: resource → processor → good', () => {
    const cc = {
      resources: [{ name: 'Cattle Ranch', localUid: 'r1', commodities: 'hides, meat' }],
      institutions: [{ name: 'Tannery', localUid: 'i1', produces: ['leather'], requires: ['hides'] }],
      tradeGoods: [{ name: 'Saddle', localUid: 'g1', requiredResources: ['leather'] }],
    };
    const chains = inferSupplyChains(cc, { resolve: idResolve });
    expect(chains.length).toBeGreaterThanOrEqual(1);
    const chain = chains.find((c) => c.processingInstitutions.includes('Tannery'));
    expect(chain).toBeTruthy();
    const names = chain.discovered.nodes.map((n) => n.name);
    expect(names).toEqual(['Cattle Ranch', 'Tannery', 'Saddle']);
    expect(chain.resource).toBe('Cattle Ranch');
    expect(chain.discovered.nodes[0].role).toBe('source');
    expect(chain.discovered.nodes[2].role).toBe('sink');
  });

  it('flags an unmet input as an import candidate (upstreamMissing)', () => {
    const cc = {
      // Smithy needs ore, but nothing local produces ore → import.
      institutions: [{ name: 'Smithy', localUid: 'i1', produces: ['tools'], requires: ['ore'] }],
      tradeGoods: [{ name: 'Plough', localUid: 'g1', requiredResources: ['tools'] }],
    };
    const chains = inferSupplyChains(cc, { resolve: idResolve });
    const chain = chains.find((c) => c.processingInstitutions.includes('Smithy'));
    expect(chain).toBeTruthy();
    expect(chain.upstreamMissing.some((m) => m.includes('ore'))).toBe(true);
    expect(chain.discovered.tradeEndpoints.imports.some((i) => i.label.includes('ore'))).toBe(true);
  });

  it('marks a terminal surplus output as an export candidate', () => {
    const cc = {
      resources: [{ name: 'Vineyard', localUid: 'r1', commodities: 'grapes' }],
      institutions: [{ name: 'Winery', localUid: 'i1', produces: ['wine'], requires: ['grapes'] }],
    };
    const chains = inferSupplyChains(cc, { resolve: idResolve });
    const chain = chains[0];
    expect(chain.exportable).toBe(true);
    expect(chain.discovered.tradeEndpoints.exports.some((e) => e.label.includes('wine'))).toBe(true);
  });

  it('reconciles imports/exports against a neighbour', () => {
    const cc = {
      institutions: [{ name: 'Smithy', localUid: 'i1', produces: ['tools'], requires: ['ore'] }],
      tradeGoods: [{ name: 'Plough', localUid: 'g1', requiredResources: ['tools'] }],
    };
    const chains = inferSupplyChains(cc, { resolve: idResolve, neighbour: { name: 'Irontown', primaryExports: ['ore'] } });
    const chain = chains.find((c) => c.processingInstitutions.includes('Smithy'));
    const oreImport = chain.discovered.tradeEndpoints.imports.find((i) => i.label.includes('ore'));
    expect(oreImport.source).toBe('neighbour');
    expect(oreImport.counterpart).toBe('ore');
  });

  it('is deterministic — same input yields identical chainIds in the same order', () => {
    const cc = {
      resources: [{ name: 'Mine', localUid: 'r1', commodities: 'ore' }],
      institutions: [{ name: 'Forge', localUid: 'i1', produces: ['blades'], requires: ['ore'] }],
    };
    const a = inferSupplyChains(cc, { resolve: idResolve }).map((c) => c.chainId);
    const b = inferSupplyChains(cc, { resolve: idResolve }).map((c) => c.chainId);
    expect(a).toEqual(b);
    expect(a.length).toBeGreaterThan(0);
  });

  it('returns the activeChain render props ChainRow needs', () => {
    const cc = {
      resources: [{ name: 'Mine', localUid: 'r1', commodities: 'ore' }],
      institutions: [{ name: 'Forge', localUid: 'i1', produces: ['blades'], requires: ['ore'] }],
    };
    const chain = inferSupplyChains(cc, { resolve: idResolve })[0];
    for (const k of ['chainId', 'status', 'label', 'processingInstitutions', 'outputs', 'upstreamMissing', 'exportable']) {
      expect(chain).toHaveProperty(k);
    }
    expect(chain.status).toBe('vulnerable');
    expect(chain.verification.state).toBe('discovered');
  });

  it('threads a good’s processing institution as a mid-chain node (resource → institution → good)', () => {
    const cc = {
      resources: [{ name: 'Clay Pit', localUid: 'r1', commodities: 'clay' }],
      institutions: [{ name: 'Pottery', localUid: 'i1' }], // plain custom institution, no produces/requires
      tradeGoods: [{ name: 'Amphora', localUid: 'g1', requiredInstitution: ['Pottery'], requiredResources: ['clay'] }],
    };
    const chain = inferSupplyChains(cc, { resolve: idResolve }).find((c) => c.processingInstitutions.includes('Pottery'));
    expect(chain).toBeTruthy();
    expect(chain.discovered.nodes.map((n) => n.name)).toEqual(['Clay Pit', 'Pottery', 'Amphora']);
  });

  it('seeds a referenced (built-in) institution as a mid-chain processor for a mixed chain', () => {
    // 'Town Forge' is referenced by the good but never defined as custom content —
    // it stands in for a built-in institution the chain must thread through.
    const cc = {
      resources: [{ name: 'Iron Ore', localUid: 'r1', commodities: 'iron ore' }],
      tradeGoods: [{ name: 'Steel Blades', localUid: 'g1', requiredInstitution: ['Town Forge'], requiredResources: ['iron ore'] }],
    };
    const chain = inferSupplyChains(cc, { resolve: idResolve }).find((c) => c.processingInstitutions.includes('Town Forge'));
    expect(chain).toBeTruthy();
    expect(chain.discovered.nodes.map((n) => n.name)).toEqual(['Iron Ore', 'Town Forge', 'Steel Blades']);
  });

  it('handles empty / no-edge content without throwing', () => {
    expect(inferSupplyChains({}, { resolve: idResolve })).toEqual([]);
    expect(inferSupplyChains({ institutions: [{ name: 'Lonely Hall', localUid: 'i1' }] }, { resolve: idResolve })).toEqual([]);
  });
});
