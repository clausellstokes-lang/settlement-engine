import { describe, expect, it } from 'vitest';

import {
  applyResourceOutcomeToSettlement,
  applyTierOutcomeToSettlement,
  evaluateTierResourceDynamics,
  resourceEconomicRole,
} from '../../src/domain/worldPulse/tierResourceDynamics.js';
import {
  computeActiveChains,
  deriveLocalProductionFromChains,
} from '../../src/generators/computeActiveChains.js';
import { hasOwnRequiredContract } from '../../src/domain/generationOwnership.js';

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

  it('a depleted primary-export resource recovers under SUSTAINED DEEP CALM (no longer a permanent ratchet)', () => {
    // [worldpulse-religion-trade-8] — a depleted primary-export anchor was carved
    // out of the quiet-recovery path entirely (a permanent one-way ratchet), even
    // in the deepest calm. Now it recovers under the DEEPER quietRecovery gate
    // (perceivedPressureScore ≤ 0.2), the same slow path exhaustibles use — export
    // demand justifies slower recovery, not never. A local resource still recovers
    // under the shallower ≤ 0.32 gate. Both settlements below sit at deep calm.
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

    expect(recoveries.some(candidate => candidate.targetSaveId === 'exporter')).toBe(true);
    expect(recoveries.some(candidate => candidate.targetSaveId === 'bystander')).toBe(true);
  });
});

describe('evaluateTierResourceDynamics — depletion eligibility', () => {
  it('high pressure depletes material resources, never positions or infrastructure', () => {
    const pressured = item('pressured', settlement('Stonebridge', {
      tier: 'city',
      config: {
        tradeRouteAccess: 'crossroads',
        nearbyResources: [
          'deep_harbour',
          'river_mills',
          'crossroads_position',
          'defended_pass',
          'hot_springs',
          'oasis_water',
          'iron_deposits',
        ],
        nearbyResourcesState: {},
      },
      economicState: { primaryExports: [], primaryImports: [] },
    }), 100);

    const result = evaluateTierResourceDynamics(
      {},
      { settlements: [pressured] },
      undefined,
      { tick: 7 },
    );
    const depleted = result.candidates
      .filter(candidate => candidate.candidateType === 'resource_depletion')
      .map(candidate => candidate.resourcePatch.resource);

    expect(depleted).toContain('iron_deposits');
    expect(depleted).not.toContain('deep_harbour');
    expect(depleted).not.toContain('river_mills');
    expect(depleted).not.toContain('crossroads_position');
    expect(depleted).not.toContain('defended_pass');
    expect(depleted).not.toContain('hot_springs');
    expect(depleted).not.toContain('oasis_water');
  });

  it('applies depletion and recovery to the live economy atomically', () => {
    const institutions = [{ name: 'Mine (open cast)' }];
    const resources = ['iron_deposits'];
    const activeChains = computeActiveChains(
      institutions,
      resources,
      'town',
      'road',
      [],
      [],
      0,
    );
    const live = settlement('Ironford', {
      config: {
        tradeRouteAccess: 'road',
        nearbyResources: resources,
        nearbyResourcesNative: resources,
        nearbyResourcesDepleted: [],
        nearbyResourcesNativeDepleted: [],
        nearbyResourcesState: {},
        magicExists: false,
      },
      institutions,
      economicState: {
        activeChains,
        primaryExports: ['Iron ore'],
        localProduction: deriveLocalProductionFromChains(
          activeChains,
          resources,
        ),
      },
    });

    const depleted = applyResourceOutcomeToSettlement(live, {
      id: 'outcome.deplete-iron',
      candidateType: 'resource_depletion',
      resourcePatch: { resource: 'iron_deposits', state: 'depleted' },
    });
    const depletedIron = depleted.economicState.activeChains.find(
      chain => chain.chainId === 'iron',
    );

    expect(depletedIron).toMatchObject({
      resourceCondition: 'depleted',
      resourceInputCondition: 'depleted',
      status: 'impaired',
    });
    expect(depleted.economicState.localProduction).not.toContain('iron');
    expect(depleted.economicState.primaryExports).not.toContain('Iron ore');

    const recovered = applyResourceOutcomeToSettlement(depleted, {
      id: 'outcome.recover-iron',
      candidateType: 'resource_recovery',
      resourcePatch: { resource: 'iron_deposits', state: 'allow' },
    });
    const recoveredIron = recovered.economicState.activeChains.find(
      chain => chain.chainId === 'iron',
    );

    expect(recoveredIron).toMatchObject({
      resourceCondition: 'available',
      resourceInputCondition: 'available',
      status: 'running',
    });
    expect(recovered.economicState.localProduction).toContain('iron');
    expect(recovered.economicState.primaryExports).toContain('Iron ore');
  });

  it('does not invent organic recovery for an explicitly unavailable position', () => {
    const quiet = item('quiet', settlement('Closed Pass', {
      config: {
        tradeRouteAccess: 'mountain_pass',
        nearbyResources: ['defended_pass'],
        nearbyResourcesState: { defended_pass: 'depleted' },
      },
      economicState: { primaryExports: [], primaryImports: [] },
    }), 0);

    const result = evaluateTierResourceDynamics(
      {},
      { settlements: [quiet] },
      undefined,
      { tick: 8 },
    );

    expect(
      result.candidates.some(candidate => (
        candidate.candidateType === 'resource_recovery'
        && candidate.resourcePatch.resource === 'defended_pass'
      )),
    ).toBe(false);
  });
});

describe('tier resource drift — native/custom resource identity', () => {
  function collisionSettlement(nativeResources, nativeDepleted = []) {
    return settlement('Namesake', {
      config: {
        tradeRouteAccess: 'road',
        nearbyResources: ['iron_deposits'],
        nearbyResourcesNative: nativeResources,
        nearbyResourcesCustom: ['iron_deposits'],
        nearbyResourcesDepleted: ['iron_deposits'],
        nearbyResourcesNativeDepleted: nativeDepleted,
        nearbyResourcesState: { iron_deposits: 'depleted' },
        nearbyResourceDefinitionsDepleted: [{
          name: 'iron_deposits',
          customDefinitionId: 'definition:resources:custom-iron',
        }],
      },
      economicState: { primaryExports: [], primaryImports: [] },
    });
  }

  it('custom-only native-key spelling emits no built-in depletion or recovery', () => {
    const customOnly = item(
      'custom-only',
      collisionSettlement([]),
      100,
    );
    const result = evaluateTierResourceDynamics(
      {},
      { settlements: [customOnly] },
      undefined,
      { tick: 1 },
    );

    expect(
      result.candidates.some(candidate => (
        candidate.candidateType === 'resource_depletion'
        || candidate.candidateType === 'resource_recovery'
      )),
    ).toBe(false);
  });

  it('dual ownership retains built-in drift through the native sidecar', () => {
    const dualOwner = item(
      'dual-owner',
      collisionSettlement(['iron_deposits']),
      100,
    );
    const result = evaluateTierResourceDynamics(
      {},
      { settlements: [dualOwner] },
      undefined,
      { tick: 1 },
    );

    expect(
      result.candidates.some(
        candidate => candidate.candidateType === 'resource_depletion',
      ),
    ).toBe(true);
    expect(
      result.candidates.some(
        candidate => candidate.candidateType === 'resource_recovery',
      ),
    ).toBe(false);
  });

  it('native depletion and recovery preserve exact custom depletion', () => {
    const customDepleted = collisionSettlement(['iron_deposits']);
    const depleted = applyResourceOutcomeToSettlement(customDepleted, {
      id: 'outcome.native-deplete',
      candidateType: 'resource_depletion',
      resourcePatch: {
        resource: 'iron_deposits',
        state: 'depleted',
      },
    });
    const recovered = applyResourceOutcomeToSettlement(depleted, {
      id: 'outcome.native-recover',
      candidateType: 'resource_recovery',
      resourcePatch: {
        resource: 'iron_deposits',
        state: 'allow',
      },
    });

    expect(depleted.config.nearbyResourcesNativeDepleted)
      .toEqual(['iron_deposits']);
    expect(recovered.config.nearbyResourcesNativeDepleted).toEqual([]);
    expect(recovered.config.nearbyResourcesDepleted)
      .toEqual(['iron_deposits']);
    expect(recovered.config.nearbyResourcesState.iron_deposits)
      .toBe('depleted');
    expect(recovered.config.nearbyResourceDefinitionsDepleted)
      .toEqual(customDepleted.config.nearbyResourceDefinitionsDepleted);
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

describe('applyTierOutcomeToSettlement — native/custom institution identity', () => {
  function tierOutcome(fromTier, toTier, direction) {
    return {
      id: `candidate.tier.${direction}.identity.4`,
      tierChange: {
        saveId: 'identity',
        fromTier,
        toTier,
        direction,
      },
    };
  }

  function customInstitution(name) {
    return {
      name,
      category: 'Custom',
      status: 'active',
      source: 'custom',
      isCustom: true,
      customDefinitionCategory: 'institutions',
      customDefinitionId: `definition:institutions:${name}`,
    };
  }

  it('adds a required native institution beside a custom namesake on promotion', () => {
    const customGranary = customInstitution('Town granary');
    const village = settlement('Namesake', {
      tier: 'village',
      population: 950,
      institutions: [customGranary],
    });

    const next = applyTierOutcomeToSettlement(
      village,
      tierOutcome('village', 'town', 'promotion'),
    );
    const granaries = next.institutions.filter(
      institution => institution.name === 'Town granary',
    );

    expect(granaries).toHaveLength(2);
    expect(granaries).toContain(customGranary);
    expect(granaries).toContainEqual(expect.objectContaining({
      name: 'Town granary',
      required: true,
      requiredForTier: 'town',
      _worldPulseTierAdded: true,
    }));
  });

  it('does not apply a native demotion fate to a custom namesake', () => {
    const customGarrison = customInstitution('Garrison');
    const city = settlement('Namesake', {
      tier: 'city',
      population: 7000,
      institutions: [customGarrison],
    });

    const next = applyTierOutcomeToSettlement(
      city,
      tierOutcome('city', 'town', 'demotion'),
    );

    expect(next.institutions).toContain(customGarrison);
    expect(next.institutions[0]).toEqual(customGarrison);
  });
});

// Pin: A TIER SHIFT ADOPTS (manager ruling 2026-07-27). `required` is scoped to
// the tier whose catalog declares it, so when the settlement's tier moves the
// surviving roster must be restamped against the NEW catalog. Before this, a
// demoted city's cascade-seated 'Town watch' (required:false, cascadeAdded:true)
// survived into a town that genuinely requires that name: closure-protected by
// isClosableInstitution's settlement-tier backstop, but strike/collapse/upgrade
// eligible, because the flag-based readers cannot see the settlement's tier.
describe('applyTierOutcomeToSettlement — a tier shift ADOPTS the required contract', () => {
  function tierOutcome(fromTier, toTier, direction) {
    return {
      id: `candidate.tier.${direction}.adopt.4`,
      tierChange: { saveId: 'adopt', fromTier, toTier, direction },
    };
  }

  function authoredNamesake(name) {
    return {
      name,
      category: 'Custom',
      status: 'active',
      source: 'custom',
      isCustom: true,
      customDefinitionCategory: 'institutions',
      customDefinitionId: `definition:institutions:${name}`,
    };
  }

  function cascadeSeat(name, patch = {}) {
    return {
      id: `institution.${name.toLowerCase().replace(/\s+/g, '_')}`,
      name,
      category: 'Defense',
      status: 'active',
      source: 'cascade',
      cascadeAdded: true,
      required: false,
      ...patch,
    };
  }

  it('a demoted city adopts the cascade seat the new tier genuinely requires', () => {
    const city = settlement('Adoption', {
      tier: 'city',
      population: 7000,
      institutions: [cascadeSeat('Town watch')],
    });

    const next = applyTierOutcomeToSettlement(city, tierOutcome('city', 'town', 'demotion'));
    const watch = next.institutions.find(inst => inst.name === 'Town watch');

    expect(watch.required).toBe(true);
    expect('cascadeAdded' in watch).toBe(false);          // the borrowed stamp is cleared by ABSENCE
    expect(watch.source).toBe('cascade');                 // the historical record survives untouched
    expect(hasOwnRequiredContract(watch)).toBe(true);     // the law now agrees it owes the contract
    expect(watch.status).toBe('active');                  // adoption is not a demotion fate
  });

  it('adopts on PROMOTION too — the rule is tier-keyed, not direction-keyed', () => {
    const village = settlement('Adoption', {
      tier: 'village',
      population: 900,
      institutions: [cascadeSeat('Town watch')],
    });

    const next = applyTierOutcomeToSettlement(village, tierOutcome('village', 'town', 'promotion'));
    const watches = next.institutions.filter(inst => inst.name === 'Town watch');

    expect(watches).toHaveLength(1);                      // adopted in place, not duplicated
    expect(hasOwnRequiredContract(watches[0])).toBe(true);
  });

  it('leaves a record the new tier does not require exactly as it found it', () => {
    const seat = cascadeSeat('Curio stall', { category: 'Trade' });
    const city = settlement('Adoption', {
      tier: 'city',
      population: 7000,
      institutions: [seat],
    });

    const next = applyTierOutcomeToSettlement(city, tierOutcome('city', 'town', 'demotion'));

    expect(next.institutions[0]).toBe(seat);              // object identity — no gratuitous rewrite
    expect(next.institutions[0].required).toBe(false);
    expect(next.institutions[0].cascadeAdded).toBe(true);
  });

  it('never restamps custom content — an authored namesake keeps its own contract', () => {
    const customWatch = authoredNamesake('Town watch');
    const city = settlement('Adoption', {
      tier: 'city',
      population: 7000,
      institutions: [customWatch],
    });

    const next = applyTierOutcomeToSettlement(city, tierOutcome('city', 'town', 'demotion'));

    expect(next.institutions[0]).toBe(customWatch);
    expect(next.institutions[0].required).toBeUndefined();
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

    const candidate = result.candidates.find(entry => entry.candidateType === 'tier_promotion');
    expect(candidate).toBeTruthy();
    expect(candidate.summary).toContain('combined population and support promotion eligibility');
  });

  it('describes demotion as combined population and support eligibility too', () => {
    const worldState = {
      tick: 8,
      settlementTickStates: {
        a: { tierDrift: { direction: 'demotion', toTier: 'village', streak: 1 } },
      },
      proposals: [],
    };
    const snapshot = {
      settlements: [item('a', settlement('Ashford', { tier: 'town', population: 500 }), 0)],
    };

    const result = evaluateTierResourceDynamics(worldState, snapshot, undefined, { tick: 9 });
    const candidate = result.candidates.find(entry => entry.candidateType === 'tier_demotion');

    expect(candidate).toBeTruthy();
    expect(candidate.summary).toContain('combined population and support demotion eligibility');
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
