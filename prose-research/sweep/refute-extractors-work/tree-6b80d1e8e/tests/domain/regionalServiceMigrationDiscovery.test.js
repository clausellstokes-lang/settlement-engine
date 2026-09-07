/**
 * tests/domain/regionalServiceMigrationDiscovery.test.js — R3 decision
 * (2026-06-11): the two formerly-uncreatable channel types gain conservative,
 * SUGGESTED-only discovery heuristics. The DM confirm gate is the safety.
 *
 * Pins:
 *   • service_dependency — suggested provider -> dependent only when the
 *     provider shows real healing capacity (2+ healing-capable institutions
 *     per the canonical classifier, of which at least one is an
 *     INSTITUTIONAL-grade anchor — hospital/monastery/temple class; triage
 *     wave: two wayside shrines no longer read as a regional service hub),
 *     the dependent genuinely lacks it, and a route/trade link connects
 *     them; confidence 0.5, born 'suggested', evidence names the anchor;
 *   • migration_pressure — suggested along the trade-route link when the
 *     poles are unbalanced (tier gap >= 2 OR ~4x population), direction
 *     smaller -> larger (people flow toward the bigger pole); confidence
 *     0.45, born 'suggested';
 *   • reach — a CONFIRMED service_dependency channel lets a health shock
 *     derive a service_disruption impact end-to-end and materialize the
 *     regional_service_disruption condition (the propagation rule predates
 *     this wave; it was unreachable because nothing could mint the channel).
 *     A merely-suggested channel still propagates NOTHING by default.
 */

import { describe, expect, it } from 'vitest';

import {
  addRegionalChannels,
  applyRegionalImpact,
  deriveLocalDelta,
  deriveRegionalImpacts,
  discoverDependencyCandidates,
  setRegionalChannelStatus,
} from '../../src/domain/region/index.js';
import { findActiveCondition } from '../../src/domain/activeConditions.js';

function save(id, name, settlement = {}) {
  return {
    id,
    name,
    tier: settlement.tier || 'town',
    settlement: {
      id: `settlement.${id}`,
      name,
      tier: settlement.tier || 'town',
      population: settlement.population ?? 0,
      config: { tradeRouteAccess: 'road', ...(settlement.config || {}) },
      institutions: settlement.institutions || [],
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

const HEALING_INSTITUTIONS = [{ name: 'Major hospital' }, { name: 'Temple of the Dawn' }];

function tradeLinked(idA, nameA, idB, nameB, a = {}, b = {}) {
  return [
    save(idA, nameA, {
      ...a,
      neighbourNetwork: [{ id: idB, neighbourName: nameB, relationshipType: 'trade_partner' }],
    }),
    save(idB, nameB, {
      ...b,
      neighbourNetwork: [{ id: idA, neighbourName: nameA, relationshipType: 'trade_partner' }],
    }),
  ];
}

describe('service_dependency discovery (R3, suggested-only)', () => {
  it('suggests provider -> dependent when real healing capacity meets a lacking trade partner', () => {
    const [provider, dependent] = tradeLinked('sanctum', 'Sanctum Reach', 'fringe', 'Fringewick', {
      institutions: HEALING_INSTITUTIONS,
    });
    const channels = discoverDependencyCandidates(provider, dependent)
      .filter(c => c.type === 'service_dependency');

    expect(channels).toHaveLength(1);
    expect(channels[0].from).toBe('sanctum');
    expect(channels[0].to).toBe('fringe');
    expect(channels[0].status).toBe('suggested');
    expect(channels[0].confidence).toBeCloseTo(0.5, 10);
    expect(channels[0].strength).toBeGreaterThan(0);
    expect(channels[0].strength).toBeLessThanOrEqual(0.5);
    // The evidence prose names the institutional anchor, not just a count.
    const instEvidence = channels[0].evidence.find(e => e.source === 'institutions');
    expect(instEvidence.reason).toContain('Major hospital');
  });

  it('an institutional anchor plus a wayside healer qualifies (hospital + shrine)', () => {
    const [provider, dependent] = tradeLinked('anchored', 'Anchorage', 'bare', 'Barewick', {
      institutions: [{ name: 'Small hospital' }, { name: 'Wayside shrine' }],
    });
    const channels = discoverDependencyCandidates(provider, dependent)
      .filter(c => c.type === 'service_dependency');

    expect(channels).toHaveLength(1);
    expect(channels[0].from).toBe('anchored');
    expect(channels[0].to).toBe('bare');
    const instEvidence = channels[0].evidence.find(e => e.source === 'institutions');
    expect(instEvidence.reason).toContain('Small hospital');
  });

  it('two wayside shrines are healing-capable but NOT a regional service hub (no institutional anchor)', () => {
    const [provider, dependent] = tradeLinked('shrines', 'Shrineholt', 'bare', 'Barewick', {
      institutions: [{ name: 'Wayside shrine' }, { name: 'Roadside shrine' }],
    });
    expect(discoverDependencyCandidates(provider, dependent).filter(c => c.type === 'service_dependency')).toEqual([]);
  });

  it('does NOT suggest when the dependent has its own healing, the provider is a lone shrine, or no trade link exists', () => {
    // Dependent has its own healer — no dependency.
    const [a1, b1] = tradeLinked('p1', 'Provider', 'd1', 'Dependent', {
      institutions: HEALING_INSTITUTIONS,
    }, {
      institutions: [{ name: 'Herbalist' }],
    });
    expect(discoverDependencyCandidates(a1, b1).filter(c => c.type === 'service_dependency')).toEqual([]);

    // A single healing institution is not "real" regional capacity.
    const [a2, b2] = tradeLinked('p2', 'Provider', 'd2', 'Dependent', {
      institutions: [{ name: 'Wayside shrine' }],
    });
    expect(discoverDependencyCandidates(a2, b2).filter(c => c.type === 'service_dependency')).toEqual([]);

    // Hostile neighbours have no usable route/trade link for services.
    const hostileProvider = save('p3', 'Provider', {
      institutions: HEALING_INSTITUTIONS,
      neighbourNetwork: [{ id: 'd3', neighbourName: 'Dependent', relationshipType: 'hostile' }],
    });
    const hostileDependent = save('d3', 'Dependent');
    expect(discoverDependencyCandidates(hostileProvider, hostileDependent).filter(c => c.type === 'service_dependency')).toEqual([]);
  });
});

describe('migration_pressure discovery (R3, suggested-only)', () => {
  it('suggests smaller -> larger along the trade route when the tier gap is >= 2', () => {
    const [city, village] = tradeLinked('big', 'Highspire', 'small', 'Fringewick',
      { tier: 'city' }, { tier: 'village' });
    const channels = discoverDependencyCandidates(city, village)
      .filter(c => c.type === 'migration_pressure');

    expect(channels).toHaveLength(1);
    expect(channels[0].from).toBe('small'); // people flow toward the bigger pole
    expect(channels[0].to).toBe('big');
    expect(channels[0].status).toBe('suggested');
    expect(channels[0].confidence).toBeCloseTo(0.45, 10);
  });

  it('suggests on a ~4x population imbalance even at equal tier', () => {
    const [bigTown, smallTown] = tradeLinked('bigtown', 'Marketon', 'smalltown', 'Leanford',
      { tier: 'town', population: 4800 }, { tier: 'town', population: 1100 });
    const channels = discoverDependencyCandidates(bigTown, smallTown)
      .filter(c => c.type === 'migration_pressure');

    expect(channels).toHaveLength(1);
    expect(channels[0].from).toBe('smalltown');
    expect(channels[0].to).toBe('bigtown');
  });

  it('stays silent for balanced poles (tier gap 1, population ratio < 4)', () => {
    const [town, village] = tradeLinked('t', 'Marketon', 'v', 'Leanford',
      { tier: 'town', population: 2000 }, { tier: 'village', population: 900 });
    expect(discoverDependencyCandidates(town, village).filter(c => c.type === 'migration_pressure')).toEqual([]);
  });
});

describe('service_dependency propagation reach (the rule was always there — now reachable)', () => {
  function discoveredServiceChannel() {
    const [provider, dependent] = tradeLinked('sanctum', 'Sanctum Reach', 'fringe', 'Fringewick', {
      institutions: HEALING_INSTITUTIONS,
    });
    const channel = discoverDependencyCandidates(provider, dependent)
      .find(c => c.type === 'service_dependency');
    expect(channel).toBeTruthy();
    return { provider, dependent, channel };
  }

  function plagueDelta(provider) {
    // Same save before/after: the only regional change is the event's
    // health_shock — exactly what ruleServiceDependency listens for.
    return deriveLocalDelta(provider, provider, {
      event: { id: 'evt.plague.sanctum', type: 'PLAGUE', payload: { severity: 0.6 } },
    });
  }

  it('a suggested channel propagates nothing by default (the confirm gate is the safety)', () => {
    const { provider, channel } = discoveredServiceChannel();
    const graph = addRegionalChannels(null, [channel]);
    expect(deriveRegionalImpacts(plagueDelta(provider), graph)).toEqual([]);
  });

  it('a CONFIRMED channel turns a provider health shock into a service_disruption impact and condition', () => {
    const { provider, dependent, channel } = discoveredServiceChannel();
    let graph = addRegionalChannels(null, [channel]);
    graph = setRegionalChannelStatus(graph, channel.id, 'confirmed');

    const impacts = deriveRegionalImpacts(plagueDelta(provider), graph);
    expect(impacts).toHaveLength(1);
    expect(impacts[0].kind).toBe('service_disruption');
    expect(impacts[0].targetSettlementId).toBe('fringe');
    expect(impacts[0].severity).toBeGreaterThan(0);
    expect(impacts[0].severity).toBeLessThanOrEqual(1);

    const afflicted = applyRegionalImpact(dependent.settlement, impacts[0]);
    expect(findActiveCondition(afflicted, 'regional_service_disruption')).toBeTruthy();
  });
});
