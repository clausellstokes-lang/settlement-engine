import { describe, expect, it } from 'vitest';

import {
  applyTierOutcomeToSettlement,
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

// Pin: tier candidates re-emit every eligible tick with tick-suffixed ids, so
// worldState.proposals can hold a tier proposal whose fromTier the settlement
// has since left. Accepting it must not rewind the tier (wrong-direction
// roster surgery, bogus tierHistory) — applyTierOutcomeToSettlement re-verifies
// against the CURRENT settlement, same contract as
// applyInstitutionLifecycleOutcome.

describe('applyTierOutcomeToSettlement — apply-time tier re-verify', () => {
  function tierOutcome(fromTier, toTier, direction) {
    return {
      id: `candidate.tier.${direction}.a.4`,
      tierChange: { saveId: 'a', fromTier, toTier, direction },
    };
  }

  it('applies when the settlement still holds the proposal fromTier', () => {
    const town = settlement('Ashford', { tier: 'town', population: 4700 });
    const next = applyTierOutcomeToSettlement(town, tierOutcome('town', 'city', 'promotion'));

    expect(next).not.toBe(town);
    expect(next.tier).toBe('city');
    expect(next.config.tier).toBe('city');
    expect(next.tierHistory.at(-1)).toMatchObject({ fromTier: 'town', toTier: 'city', direction: 'promotion' });
  });

  it('no-ops with object identity when the tier moved on since the proposal', () => {
    const city = settlement('Ashford', {
      tier: 'city',
      population: 9000,
      institutions: [{ id: 'institution.grand_market', name: 'Grand Market', category: 'trade', status: 'active', requiredForTier: 'city', _worldPulseTierAdded: true }],
      tierHistory: [{ fromTier: 'town', toTier: 'city', direction: 'promotion' }],
    });

    const next = applyTierOutcomeToSettlement(city, tierOutcome('village', 'town', 'promotion'));

    expect(next).toBe(city);
    expect(next.tier).toBe('city');
    expect(next.tierHistory).toHaveLength(1);
    expect(next.institutions[0].status).toBe('active');
  });

  it('stale demotions no-op the same way — no roster surgery, no history entry', () => {
    const town = settlement('Ashford', {
      tier: 'town',
      institutions: [{ id: 'institution.grand_market', name: 'Grand Market', category: 'trade', status: 'active', requiredForTier: 'city', _worldPulseTierAdded: true }],
    });

    expect(applyTierOutcomeToSettlement(town, tierOutcome('city', 'town', 'demotion'))).toBe(town);
  });

  it('resolves an implicit tier from population before comparing', () => {
    const implicit = settlement('Ashford', { tier: undefined, population: 4700 });

    expect(applyTierOutcomeToSettlement(implicit, tierOutcome('town', 'city', 'promotion')).tier).toBe('city');
    expect(applyTierOutcomeToSettlement(implicit, tierOutcome('village', 'town', 'promotion'))).toBe(implicit);
  });

  it('the anti-churn promotion floor bump leaves a populationHistory breadcrumb', () => {
    // Eligibility promotes at pop >= nextTier.min * 0.92, so a 4700-strong town is
    // promoted BELOW the city floor (5001) and bumped up to it. That mint is
    // deliberate, but it must be visible to the chronicle/audit surfaces.
    const town = settlement('Ashford', { tier: 'town', population: 4700 });
    const next = applyTierOutcomeToSettlement(town, tierOutcome('town', 'city', 'promotion'));

    expect(next.population).toBe(5001);
    expect(next.populationHistory.at(-1)).toMatchObject({
      delta: 301,
      population: 5001,
      outcomeId: 'candidate.tier.promotion.a.4',
    });

    // A promotion already at/above the new floor mints nothing — no breadcrumb.
    const big = settlement('Ashford', { tier: 'town', population: 6000 });
    const bigNext = applyTierOutcomeToSettlement(big, tierOutcome('town', 'city', 'promotion'));
    expect(bigNext.population).toBe(6000);
    expect(bigNext.populationHistory).toBeUndefined();
  });
});

describe('evaluateTierResourceDynamics — pending tier proposal dedupe', () => {
  function promotionWorldState(proposals = []) {
    return {
      tick: 8,
      settlementTickStates: { a: { tierDrift: { direction: 'promotion', toTier: 'city', streak: 4 } } },
      proposals,
    };
  }

  function promotionSnapshot() {
    return { settlements: [item('a', settlement('Ashford', { tier: 'town', population: 4700 }), 0)] };
  }

  function pendingTierProposal(status = 'pending') {
    return {
      id: 'world_proposal.8.tier.a.candidate-tier-promotion-a-8',
      status,
      outcome: { type: 'tier', targetSaveId: 'a', tierChange: { saveId: 'a', fromTier: 'town', toTier: 'city', direction: 'promotion' } },
    };
  }

  it('emits a tier candidate when no tier proposal is pending for the settlement', () => {
    const result = evaluateTierResourceDynamics(promotionWorldState([]), promotionSnapshot(), undefined, { tick: 9 });

    expect(result.candidates.some(candidate => candidate.candidateType === 'tier_promotion')).toBe(true);
  });

  it('skips re-emitting while a pending tier proposal already targets the settlement', () => {
    const result = evaluateTierResourceDynamics(promotionWorldState([pendingTierProposal()]), promotionSnapshot(), undefined, { tick: 9 });

    expect(result.candidates.some(candidate => candidate.candidateType === 'tier_promotion')).toBe(false);
    // Streak tracking is not suppressed — a resolved proposal re-emits next tick.
    expect(result.worldState.settlementTickStates.a.tierDrift.streak).toBe(5);
  });

  it('resumes emitting once the proposal is resolved', () => {
    const result = evaluateTierResourceDynamics(promotionWorldState([pendingTierProposal('applied')]), promotionSnapshot(), undefined, { tick: 9 });

    expect(result.candidates.some(candidate => candidate.candidateType === 'tier_promotion')).toBe(true);
  });
});

// Pin: the tier change honors majorChangesRequireProposal, consistent with
// resource_depletion in the same module. Under the conservative default (flag
// on) it stays a DM proposal; a campaign that opts out of proposal gating (flag
// off, e.g. dramatic_campaign) gets it auto-applied. Deterministic — the
// candidate's applyMode is fixed by the flag, no RNG involved.
describe('evaluateTierResourceDynamics — tier change honors majorChangesRequireProposal', () => {
  function promotionWorldState(majorChangesRequireProposal) {
    return {
      tick: 8,
      simulationRules: { majorChangesRequireProposal },
      settlementTickStates: { a: { tierDrift: { direction: 'promotion', toTier: 'city', streak: 4 } } },
      proposals: [],
    };
  }

  function promotionSnapshot() {
    return { settlements: [item('a', settlement('Ashford', { tier: 'town', population: 4700 }), 0)] };
  }

  function tierCandidateFor(majorChangesRequireProposal) {
    const result = evaluateTierResourceDynamics(
      promotionWorldState(majorChangesRequireProposal),
      promotionSnapshot(),
      undefined,
      { tick: 9 },
    );
    return result.candidates.find(candidate => candidate.candidateType === 'tier_promotion');
  }

  it('proposes the tier change when majorChangesRequireProposal is true (the default)', () => {
    const candidate = tierCandidateFor(true);
    expect(candidate).toBeTruthy();
    expect(candidate.applyMode).toBe('proposal');
  });

  it('auto-applies the tier change when majorChangesRequireProposal is false', () => {
    const candidate = tierCandidateFor(false);
    expect(candidate).toBeTruthy();
    expect(candidate.applyMode).toBe('auto');
  });
});
