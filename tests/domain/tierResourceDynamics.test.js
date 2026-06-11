import { describe, expect, it } from 'vitest';

import {
  evaluateTierResourceDynamics,
  resourceEconomicRole,
} from '../../src/domain/worldPulse/tierResourceDynamics.js';

// Pin: resource keys and chain-output export labels share no vocabulary
// ('fishing_grounds' vs 'River fish'), so classification must resolve the
// resource through RESOURCE_TO_CHAINS / RESOURCE_DATA tradeGoods and compare
// canonical good ids — a token match against the key misfiled ~15 of 120
// generated settlements' exported resources as local-only.

function withTrade(primaryExports = [], primaryImports = []) {
  return { economicState: { primaryExports, primaryImports } };
}

function settlement(name, patch = {}) {
  return {
    name,
    tier: 'town',
    population: 1500,
    config: { tradeRouteAccess: 'road', nearbyResources: [], nearbyResourcesState: {} },
    institutions: [],
    activeConditions: [],
    npcs: [],
    ...patch,
  };
}

function item(id, settlementValue, resourcePressureValue) {
  return {
    id,
    name: settlementValue.name || id,
    settlement: settlementValue,
    causal: { scores: {} },
    system: { resourcePressure: { value: resourcePressureValue } },
  };
}

describe('resourceEconomicRole — chain-output export classification', () => {
  it('classifies verbatim chain/tradeGoods export labels as primary_export', () => {
    expect(resourceEconomicRole(withTrade(['River fish']), 'fishing_grounds')).toBe('primary_export');
    expect(resourceEconomicRole(withTrade(['Raw wool']), 'grazing_land')).toBe('primary_export');
    expect(resourceEconomicRole(withTrade(['Reeds and thatch']), 'marshlands')).toBe('primary_export');
    expect(resourceEconomicRole(withTrade(['Milled timber']), 'managed_forest')).toBe('primary_export');
    expect(resourceEconomicRole(withTrade(['Furs and pelts']), 'hunting_grounds')).toBe('primary_export');
  });

  it('sees through stress annotations on export labels', () => {
    expect(resourceEconomicRole(withTrade(['River fish (taxed by occupation)']), 'fishing_grounds')).toBe('primary_export');
  });

  it('matches by canonical good id when the label is a rename, not a verbatim chain good', () => {
    // 'Preserved fish' appears in no fishing chain or tradeGoods list, but
    // exactGoodId resolves it to the same 'fish' id as 'River fish'.
    expect(resourceEconomicRole(withTrade(['Preserved fish']), 'fishing_grounds')).toBe('primary_export');
  });

  it('keeps the token match as fallback for custom resources outside the catalog', () => {
    expect(resourceEconomicRole(withTrade(['Dragonglass shards']), 'dragonglass_cliffs')).toBe('primary_export');
  });

  it('leaves unrelated exports classified as local_resource', () => {
    expect(resourceEconomicRole(withTrade(['Quality cloth', 'Basic metalwork']), 'fishing_grounds')).toBe('local_resource');
  });

  it('classifies the import side with the same vocabulary', () => {
    expect(resourceEconomicRole(withTrade([], ['River fish']), 'fishing_grounds')).toBe('primary_import');
    expect(resourceEconomicRole(withTrade(['Salted fish'], ['River fish']), 'fishing_grounds')).toBe('export_and_import');
  });
});

describe('evaluateTierResourceDynamics — economic role feeds the drift logic', () => {
  it('export trade load pushes a borderline resource over the depletion threshold', () => {
    const exporter = item('exporter', settlement('Netherquay', {
      config: { tradeRouteAccess: 'river', nearbyResources: ['fishing_grounds'], nearbyResourcesState: {} },
      economicState: { primaryExports: ['River fish'], primaryImports: [] },
    }), 55);
    const bystander = item('bystander', settlement('Stillmere', {
      config: { tradeRouteAccess: 'river', nearbyResources: ['fishing_grounds'], nearbyResourcesState: {} },
      economicState: { primaryExports: [], primaryImports: [] },
    }), 55);

    const result = evaluateTierResourceDynamics({}, { settlements: [exporter, bystander] }, undefined, { tick: 1 });
    const depletions = result.candidates.filter(candidate => candidate.candidateType === 'resource_depletion');

    const exporterCandidate = depletions.find(candidate => candidate.targetSaveId === 'exporter');
    expect(exporterCandidate).toBeTruthy();
    expect(exporterCandidate.metadata.economicRole).toBe('primary_export');
    expect(depletions.some(candidate => candidate.targetSaveId === 'bystander')).toBe(false);
  });

  it('a depleted primary-export resource does not quietly recover', () => {
    const exporter = item('exporter', settlement('Timberfall', {
      config: { nearbyResources: ['managed_forest'], nearbyResourcesState: { managed_forest: 'depleted' } },
      economicState: { primaryExports: ['Milled timber'], primaryImports: [] },
    }), 0);
    const bystander = item('bystander', settlement('Quietglade', {
      config: { nearbyResources: ['managed_forest'], nearbyResourcesState: { managed_forest: 'depleted' } },
      economicState: { primaryExports: [], primaryImports: [] },
    }), 0);

    const result = evaluateTierResourceDynamics({}, { settlements: [exporter, bystander] }, undefined, { tick: 1 });
    const recoveries = result.candidates.filter(candidate => candidate.candidateType === 'resource_recovery');

    expect(recoveries.some(candidate => candidate.targetSaveId === 'exporter')).toBe(false);
    expect(recoveries.some(candidate => candidate.targetSaveId === 'bystander')).toBe(true);
  });
});
