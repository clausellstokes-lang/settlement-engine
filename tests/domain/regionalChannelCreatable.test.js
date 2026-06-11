/**
 * tests/domain/regionalChannelCreatable.test.js — Regional wave R4 invariant.
 *
 * REGIONAL_CHANNEL_TYPES carries 13 types, but the graph has exactly two real
 * creators: discoverDependencyCandidates (trade flows + relationship links)
 * and the relationship channel bundles (relationshipChannelBundle /
 * syncRelationshipChannelBundle). The audit found that some enum members have
 * NO creation path at all — dead vocabulary the propagation rules, the map
 * legend, and the condition archetypes all still price.
 *
 * Invariant: every member of REGIONAL_CHANNEL_TYPES is either
 *   (a) producible by a creator on the constructed fixture set below, or
 *   (b) enumerated in the explicit UNCREATABLE allowlist.
 * The companion pin keeps the allowlist honest in the other direction: an
 * allowlisted type that becomes creatable must be REMOVED from the list, so
 * the dead vocabulary is visible and can never silently grow.
 */

import { describe, expect, it } from 'vitest';

import {
  discoverDependencyCandidates,
  REGIONAL_CHANNEL_TYPES,
  relationshipChannelBundle,
  syncRelationshipChannelBundle,
} from '../../src/domain/region/index.js';

const NOW = '2026-06-11T12:00:00.000Z';

// OWNER DECISION (R4, recorded — see docs/REGIONAL_ENGINE_AUDIT.md
// "uncreatable channel types" and the R4 wave entry in
// docs/COHESION_REMEDIATION_PLAN.md): service_dependency and
// migration_pressure have no creation path — neither discovery heuristics
// nor relationship bundles ever mint them, which leaves the
// service_disruption impact kind and the regional_service_disruption
// condition archetype dead vocabulary end-to-end. Inventing discovery
// heuristics for them is genuinely new simulation behavior and is parked as
// an owner item; until the owner rules, they live here so the gap is visible.
const UNCREATABLE = Object.freeze([
  'service_dependency',
  'migration_pressure',
]);

// Every relationship label either creator understands, including both
// directions of patronage and the alias spellings.
const RELATIONSHIP_LABELS = Object.freeze([
  'vassal', 'patron', 'client',
  'allied', 'ally',
  'trade_partner',
  'hostile',
  'rival', 'cold_war',
  'criminal_network', 'criminal_corridor',
  'religious_authority',
]);

function save(id, name, settlement = {}) {
  return {
    id,
    name,
    tier: settlement.tier || 'town',
    settlement: {
      id: `settlement.${id}`,
      name,
      tier: settlement.tier || 'town',
      config: { tradeRouteAccess: 'road', ...(settlement.config || {}) },
      institutions: [],
      economicState: {
        primaryExports: [],
        primaryImports: [],
        activeChains: [],
        ...(settlement.economicState || {}),
      },
      neighbourNetwork: settlement.neighbourNetwork || [],
      activeConditions: settlement.activeConditions || [],
    },
  };
}

/** Channel types discovery can mint across the full fixture set. */
function discoveredTypes() {
  const types = new Set();

  // Trade pair: intersecting exports/imports, open routes, trade partners —
  // exercises trade_dependency, export_market, trade_route, information_flow.
  const supplier = save('supplier', 'Granary Ford', {
    economicState: { primaryExports: ['Bulk grain and foodstuffs'] },
    neighbourNetwork: [{ id: 'buyer', neighbourName: 'Millcross', relationshipType: 'trade_partner' }],
  });
  const buyer = save('buyer', 'Millcross', {
    economicState: { primaryImports: ['Grain and malt'] },
    neighbourNetwork: [{ id: 'supplier', neighbourName: 'Granary Ford', relationshipType: 'trade_partner' }],
  });
  for (const channel of discoverDependencyCandidates(supplier, buyer)) types.add(channel.type);

  // One pair per relationship label discovery understands.
  for (const rel of RELATIONSHIP_LABELS) {
    const a = save(`a_${rel}`, `Aford ${rel}`, {
      neighbourNetwork: [{ id: `b_${rel}`, neighbourName: `Bristle ${rel}`, relationshipType: rel }],
    });
    const b = save(`b_${rel}`, `Bristle ${rel}`);
    for (const channel of discoverDependencyCandidates(a, b)) types.add(channel.type);
    for (const channel of discoverDependencyCandidates(b, a)) types.add(channel.type);
  }

  return types;
}

/** Channel types the relationship bundles can mint. */
function bundleTypes() {
  const types = new Set();
  const edge = { id: 'edge.a.b', from: 'a', to: 'b' };
  for (const rel of RELATIONSHIP_LABELS) {
    for (const channel of relationshipChannelBundle(edge, rel, { now: NOW })) {
      types.add(channel.type);
    }
  }
  return types;
}

describe('every regional channel type is creatable or visibly allowlisted', () => {
  it('union(discovery, relationship bundles, UNCREATABLE) covers REGIONAL_CHANNEL_TYPES exactly', () => {
    const creatable = new Set([...discoveredTypes(), ...bundleTypes()]);
    const unaccounted = REGIONAL_CHANNEL_TYPES.filter(
      type => !creatable.has(type) && !UNCREATABLE.includes(type)
    );
    // A non-empty list here means a channel type exists that nothing can
    // create — either give it a creation path (owner sign-off: new simulation
    // behavior) or add it to UNCREATABLE with the owner decision recorded.
    expect(unaccounted).toEqual([]);
  });

  it('the allowlist cannot go stale: no allowlisted type is actually creatable', () => {
    const creatable = new Set([...discoveredTypes(), ...bundleTypes()]);
    // If this fails, someone added a creation path — delete the type from
    // UNCREATABLE so the dead-vocabulary list stays truthful.
    expect(UNCREATABLE.filter(type => creatable.has(type))).toEqual([]);
  });

  it('every allowlisted type is a real enum member (no typo rot)', () => {
    for (const type of UNCREATABLE) {
      expect(REGIONAL_CHANNEL_TYPES).toContain(type);
    }
  });

  it('religious_authority is creatable via discovery on a religious_authority link', () => {
    // The audit flagged this one as uncertain — pin the answer: discovery DOES
    // mint it (two-way) when a neighbour link carries the label; the
    // relationship bundles do NOT.
    const a = save('abbey', 'Abbeyford', {
      neighbourNetwork: [{ id: 'parish', neighbourName: 'Parishvale', relationshipType: 'religious_authority' }],
    });
    const b = save('parish', 'Parishvale');
    const channels = discoverDependencyCandidates(a, b);
    expect(channels.some(c => c.type === 'religious_authority')).toBe(true);
    expect(bundleTypes().has('religious_authority')).toBe(false);
  });

  it('syncRelationshipChannelBundle actually lands bundle channels in a graph (the second creator is wired)', () => {
    const graph = syncRelationshipChannelBundle(null, { id: 'edge.a.b', from: 'a', to: 'b' }, 'vassal', { now: NOW });
    expect(graph.channels.some(c => c.type === 'political_authority' && c.status === 'confirmed')).toBe(true);
    expect(graph.channels.some(c => c.type === 'tax_obligation')).toBe(true);
    expect(graph.channels.some(c => c.type === 'military_protection')).toBe(true);
  });
});
