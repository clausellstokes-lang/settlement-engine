import { describe, expect, it } from 'vitest';

import {
  INSTITUTION_LIFECYCLE_TUNING,
  economyHealthScore,
  classifyEconomyDirection,
  buildChance,
  closeChance,
  detectInstitutionGaps,
  institutionContribution,
  institutionImpairmentLoad,
  isClosableInstitution,
  applyInstitutionLifecycleOutcome,
} from '../../src/domain/worldPulse/institutionLifecycle.js';
import {
  nativeLifecycleDepletedResources,
  nativeLifecycleResourceList,
} from '../../src/domain/worldPulse/institutionLifecycleResourceRead.js';
import { catalogEntryByName } from '../../src/domain/worldPulse/tierResourceDynamics.js';

// A town with a working smithy and iron deposits but no mine — the canonical
// "missing supply-chain step" the build half exists to fill.
function smithyTown(overrides = {}) {
  return {
    name: 'Forgeham',
    tier: 'town',
    population: 2600,
    config: { nearbyResources: ['iron_deposits'], tradeRouteAccess: 'road' },
    institutions: [
      { name: 'Blacksmiths (3-10)', category: 'Crafts' },
      { name: 'Market square', category: 'Commerce' },
    ],
    economicState: { primaryExports: ['Quality tools and weapons', 'Basic metalwork'], primaryImports: [] },
    ...overrides,
  };
}

describe('institutionLifecycle — economy health classification', () => {
  it('reads neutral 0.5 from empty/missing scores and stays in [0,1] on garbage', () => {
    expect(economyHealthScore({})).toBe(0.5);
    expect(economyHealthScore(undefined)).toBe(0.5);
    const garbage = economyHealthScore({ trade_connectivity: 5000, labor_capacity: -200, infrastructure_condition: NaN, food_security: 'soup' });
    expect(garbage).toBeGreaterThanOrEqual(0);
    expect(garbage).toBeLessThanOrEqual(1);
  });

  it('classifies via the tuned thresholds with a neutral dead band between them', () => {
    const t = INSTITUTION_LIFECYCLE_TUNING.thresholds;
    expect(classifyEconomyDirection(t.prosperous)).toBe('prosperous');
    expect(classifyEconomyDirection(t.declining)).toBe('declining');
    expect(classifyEconomyDirection((t.prosperous + t.declining) / 2)).toBeNull();
    expect(classifyEconomyDirection(0.5)).toBeNull(); // un-derived settlements stay inert
  });
});

describe('institutionLifecycle — damped build/close chances', () => {
  it('build chance is zero below the required streak, then grows with the streak', () => {
    const t = INSTITUTION_LIFECYCLE_TUNING.build;
    expect(buildChance({ streak: t.requiredStreak - 1, health: 0.9, affinity: 1 })).toBe(0);
    const atGate = buildChance({ streak: t.requiredStreak, health: 0.7, affinity: 0.9 });
    const later = buildChance({ streak: t.requiredStreak + 2, health: 0.7, affinity: 0.9 });
    expect(atGate).toBeGreaterThan(0);
    expect(later).toBeGreaterThanOrEqual(atGate);
  });

  it('every prior lifecycle build makes the next strictly harder (no sprawl runaway)', () => {
    const args = { streak: 6, health: 0.7, affinity: 0.9 };
    const p0 = buildChance({ ...args, priorBuilds: 0 });
    const p2 = buildChance({ ...args, priorBuilds: 2 });
    const p5 = buildChance({ ...args, priorBuilds: 5 });
    expect(p2).toBeLessThan(p0);
    expect(p5).toBeLessThan(p2);
    expect(p5).toBeGreaterThanOrEqual(INSTITUTION_LIFECYCLE_TUNING.build.min);
  });

  it('build chance is clamped to the tuned band even under extreme inputs', () => {
    const t = INSTITUTION_LIFECYCLE_TUNING.build;
    const huge = buildChance({ streak: 500, health: 50, affinity: 50, priorBuilds: -5 });
    expect(huge).toBeLessThanOrEqual(t.max);
    expect(huge).toBeGreaterThanOrEqual(t.min);
  });

  it('closure chance is zero below its (longer) streak gate and capped below builds', () => {
    const close = INSTITUTION_LIFECYCLE_TUNING.close;
    const build = INSTITUTION_LIFECYCLE_TUNING.build;
    expect(close.requiredStreak).toBeGreaterThan(build.requiredStreak);
    expect(close.max).toBeLessThan(build.max); // closures rarer than builds by design
    expect(closeChance({ streak: close.requiredStreak - 1, distress: 1, impairment: 1 })).toBe(0);
  });

  it('economic contribution shields against closure; impairment exposes to it', () => {
    // Sub-cap inputs (streak at the gate, mild distress) so monotonicity is
    // observable — at the tuned max the clamp flattens everything by design.
    const base = { streak: INSTITUTION_LIFECYCLE_TUNING.close.requiredStreak, distress: 0.3, priorCloses: 0 };
    const filler = closeChance({ ...base, contribution: 0, impairment: 0 });
    const impaired = closeChance({ ...base, contribution: 0, impairment: 0.8 });
    const anchor = closeChance({ ...base, contribution: 1, impairment: 0 });
    expect(impaired).toBeGreaterThan(filler);
    expect(anchor).toBeLessThan(filler); // the smithy the economy rests on closes last
    expect(closeChance({ streak: 600, distress: 9, contribution: -4, impairment: 9 }))
      .toBeLessThanOrEqual(INSTITUTION_LIFECYCLE_TUNING.close.max);
  });

  it('prior closures damp the next one (decline decays, it does not cascade)', () => {
    const args = { streak: 8, distress: 0.8, contribution: 0, impairment: 0.5 };
    const first = closeChance({ ...args, priorCloses: 0 });
    const third = closeChance({ ...args, priorCloses: 2 });
    expect(third).toBeLessThan(first);
    expect(third).toBeGreaterThanOrEqual(INSTITUTION_LIFECYCLE_TUNING.close.min);
  });
});

describe('institutionLifecycle — supply-chain gap detection', () => {
  it('reads native lifecycle resources from exact ownership and depletion sidecars', () => {
    const mixedNamesake = {
      nearbyResources: ['iron_deposits'],
      nearbyResourcesNative: ['iron_deposits'],
      nearbyResourcesCustom: ['iron_deposits'],
      nearbyResourcesDepleted: ['iron_deposits'],
      nearbyResourcesNativeDepleted: [],
    };
    const settlement = {
      config: mixedNamesake,
      nearbyResources: ['legacy_top_level_should_not_join'],
      nearbyResourcesDepleted: ['legacy_top_level_should_not_join'],
    };

    expect(nativeLifecycleResourceList(settlement)).toEqual(['iron_deposits']);
    expect(nativeLifecycleDepletedResources(settlement)).toEqual([]);
    expect(nativeLifecycleDepletedResources({
      ...settlement,
      config: {
        ...mixedNamesake,
        nearbyResourcesNativeDepleted: ['iron_deposits'],
      },
    })).toEqual(['iron_deposits']);
  });

  it('does not promote a custom-only namesake into native lifecycle mechanics', () => {
    const settlement = {
      config: {
        nearbyResources: ['iron_deposits'],
        nearbyResourcesNative: [],
        nearbyResourcesCustom: ['iron_deposits'],
        nearbyResourcesDepleted: ['iron_deposits'],
        nearbyResourcesNativeDepleted: [],
      },
    };

    expect(nativeLifecycleResourceList(settlement)).toEqual([]);
    expect(nativeLifecycleDepletedResources(settlement)).toEqual([]);
  });

  it('finds the missing mine for a smithy town with iron deposits (extraction first)', () => {
    const gaps = detectInstitutionGaps(smithyTown());
    expect(gaps.length).toBeGreaterThan(0);
    expect(gaps[0].kind).toBe('extraction');
    expect(gaps[0].name.toLowerCase()).toContain('mine');
    // Every suggestion must be an EXACT catalog name (all economic joins are
    // name-keyed — a non-catalog name would be invisible to every system) and
    // carry an apply-ready spec.
    for (const gap of gaps) {
      expect(catalogEntryByName(gap.name)).not.toBeNull();
      expect(gap.spec).toBeTruthy();
      expect(gap.category).toBeTruthy();
      expect(gap.reason).toBeTruthy();
    }
  });

  it('works downstream too: a mine-only town is offered the working end of the chain', () => {
    const town = smithyTown({
      institutions: [{ name: 'Mine (open cast)', category: 'Crafts' }],
    });
    const gaps = detectInstitutionGaps(town);
    const names = gaps.map(g => g.name.toLowerCase());
    expect(names.some(n => /smith|smelter|metalwork/.test(n))).toBe(true);
    for (const gap of gaps) expect(catalogEntryByName(gap.name)).not.toBeNull();
  });

  it('a satisfied chain produces no gap for it (builds saturate naturally)', () => {
    const town = smithyTown({
      institutions: [
        { name: 'Blacksmiths (3-10)', category: 'Crafts' },
        { name: 'Mine', category: 'Crafts' },
        { name: 'Smelter', category: 'Crafts' },
      ],
    });
    const names = detectInstitutionGaps(town).map(g => g.name.toLowerCase());
    expect(names.some(n => n.includes('mine'))).toBe(false);
    expect(names.some(n => n.includes('smelter'))).toBe(false);
  });

  it('a current custom namesake does not satisfy a native institution gap', () => {
    const customSmelter = {
      name: 'Smelter',
      category: 'Crafts',
      status: 'active',
      source: 'custom',
      isCustom: true,
      customDefinitionCategory: 'institutions',
      customDefinitionId: 'definition:institutions:smelter-namesake',
    };
    const withCustom = smithyTown({
      institutions: [
        ...smithyTown().institutions,
        customSmelter,
      ],
    });
    const withLegacy = smithyTown({
      institutions: [
        ...smithyTown().institutions,
        { name: 'Smelter', category: 'Crafts', status: 'active' },
      ],
    });

    expect(
      detectInstitutionGaps(withCustom).map(gap => gap.name),
    ).toContain('Smelter');
    expect(
      detectInstitutionGaps(withLegacy).map(gap => gap.name),
    ).not.toContain('Smelter');
  });

  it('never proposes criminal or arcane economy steps (the corruption loop owns those)', () => {
    const gaps = detectInstitutionGaps(smithyTown());
    for (const gap of gaps) {
      expect(/thieves|smuggl|black market|gang|fence/i.test(gap.name)).toBe(false);
    }
  });

  it('degrades gracefully on a bare settlement', () => {
    expect(detectInstitutionGaps({})).toEqual([]);
    expect(detectInstitutionGaps(null)).toEqual([]);
    expect(detectInstitutionGaps({ institutions: [], config: {} })).toEqual([]);
  });
});

describe('institutionLifecycle — necessity ordering inputs', () => {
  it('an export-anchored chain processor contributes most; an unconnected service least', () => {
    const town = smithyTown();
    const smithy = town.institutions[0];
    const bathhouse = { name: 'Bathhouse', category: 'Services' };
    const smithyScore = institutionContribution(town, smithy);
    const bathScore = institutionContribution(town, bathhouse);
    expect(smithyScore).toBeGreaterThan(bathScore);
    expect(smithyScore).toBeGreaterThanOrEqual(INSTITUTION_LIFECYCLE_TUNING.contribution.exportAnchor);
    expect(bathScore).toBe(0);
  });

  it('export anchoring survives a subsumption rename within the same canonical good', () => {
    // Subsumption can keep 'Leather goods' as the surviving export label while
    // the chain's output reads 'Boots and shoes' — no >=4-char token overlap,
    // but the same canonical good. The closure shield must still see the anchor.
    const town = smithyTown({
      economicState: { primaryExports: ['Leather goods'], primaryImports: [] },
    });
    const tanningChain = {
      chainId: 'tanning', label: 'Tanning', resource: 'livestock',
      processingInstitutions: ['Tannery'],
      outputs: ['Boots and shoes'],
    };
    const w = INSTITUTION_LIFECYCLE_TUNING.contribution;
    const score = institutionContribution(town, { name: 'Tannery', category: 'Crafts' }, [tanningChain]);
    expect(score).toBeGreaterThanOrEqual(w.chainProcessor + w.exportAnchor);
  });

  it('food-anchor shielding is for FOOD: a sawmill is not a granary', () => {
    const town = smithyTown();
    // 'Sawmill' contains 'mill' but cuts wood, not flour (the events path
    // makes the same carve-out) — no food-anchor contribution.
    expect(institutionContribution(town, { name: 'Sawmill', category: 'Crafts' })).toBe(0);
    // A real food anchor outside any active chain still gets the shield.
    expect(institutionContribution(town, { name: 'Granary', category: 'Storage' }))
      .toBeGreaterThanOrEqual(INSTITUTION_LIFECYCLE_TUNING.contribution.foodAnchor);
  });

  it('impairment load compounds across impairments and respects status', () => {
    expect(institutionImpairmentLoad({ name: 'X' })).toBe(0);
    expect(institutionImpairmentLoad({ name: 'X', status: 'impaired' })).toBeGreaterThan(0);
    const one = institutionImpairmentLoad({ name: 'X', impairments: [{ type: 'capacity', severity: 0.5 }] });
    const two = institutionImpairmentLoad({ name: 'X', impairments: [{ type: 'capacity', severity: 0.5 }, { type: 'legitimacy', severity: 0.5 }] });
    expect(two).toBeGreaterThan(one);
    expect(two).toBeLessThanOrEqual(1);
  });

  it('required, criminal, essential, custom, and inactive institutions are never closable', () => {
    expect(isClosableInstitution({ name: 'Town hall', required: true })).toBe(false);
    expect(isClosableInstitution({ name: 'Granary', requiredForTier: 'town' })).toBe(false);
    expect(isClosableInstitution({ name: "Thieves' Guild", category: 'criminal' })).toBe(false);
    expect(isClosableInstitution({ name: 'Smugglers cove', category: 'Commerce' })).toBe(false); // tag backfill
    expect(isClosableInstitution({ name: 'Well', tags: ['essential'] })).toBe(false);
    expect(isClosableInstitution({ name: 'My Shop', isCustom: true })).toBe(false);
    expect(isClosableInstitution({ name: 'Old mill', status: 'removed' })).toBe(false);
    expect(isClosableInstitution({ name: 'Old mill', _worldPulseInactive: true })).toBe(false);
    expect(isClosableInstitution({ name: 'Bathhouse', category: 'Services' })).toBe(true);
    // A cascade seat is a probabilistic second chance, never this tier's contract:
    // it arrives with required:false and stays exposed like any other filler.
    expect(isClosableInstitution({
      name: 'Bathhouse', category: 'Services', source: 'cascade', cascadeAdded: true, required: false,
    })).toBe(true);
  });

  it('reader scoping retires the borrowed flag on PERSISTED rosters (no migration needed)', () => {
    // Every settlement saved BEFORE the 2026-07-26 producer fix still carries the
    // SOURCE tier's `required: true` on its cascade seats. Nothing rewrites that
    // saved byte — the reader asks whether the contract is this record's OWN, so
    // the persisted lie is neutralized in place, on load, forever.
    const persistedPreFix = {
      name: 'Bathhouse', category: 'Services', status: 'active',
      source: 'cascade', cascadeAdded: true, required: true,
    };
    expect(isClosableInstitution(persistedPreFix)).toBe(true);
    // The scoping is narrow: the same borrowed flag WITHOUT the cascade stamp is
    // an ordinary contract and keeps its full immunity.
    const { cascadeAdded: _ignored, ...noProvenance } = persistedPreFix;
    expect(isClosableInstitution(noProvenance)).toBe(false);
  });

  it('the name-keyed catalog backstop still rescues legacy rosters, but not stamped cascade records', () => {
    // THE BACKSTOP exists for legacy/imported rosters whose records LOST their
    // provenance stamps: the instance carries no `required` at all, so closure is
    // refused on the strength of the catalog spec for the NAME. 'Town watch' is
    // required at town — and is exactly the def the cascade borrows into a city.
    expect(catalogEntryByName('Town watch')?.spec.required).toBe(true);
    const legacyRoster = { name: 'Town watch', category: 'Defense', status: 'active' };
    expect(isClosableInstitution(legacyRoster)).toBe(false);

    // A cascade record has FULL provenance (source + cascadeAdded), so it answers
    // from its own stamps and needs no name-keyed rescue. Without this skip the
    // backstop kept every borrowed-required NAME un-closable even once the
    // instance flag told the truth — the producer fix would have been inert.
    expect(isClosableInstitution({
      ...legacyRoster, source: 'cascade', cascadeAdded: true, required: true,
    })).toBe(true);
    expect(isClosableInstitution({
      ...legacyRoster, source: 'cascade', cascadeAdded: true, required: false,
    })).toBe(true);
  });
});

describe('institutionLifecycle — outcome application', () => {
  const outcome = (patch) => ({ id: 'outcome.test.1', institutionPatch: patch });
  const customInstitution = (name, patch = {}) => ({
    id: `custom.${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    name,
    category: 'Custom',
    status: 'active',
    source: 'custom',
    isCustom: true,
    customDefinitionCategory: 'institutions',
    customDefinitionId: `definition:institutions:${name}`,
    ...patch,
  });

  it('build appends a catalog-shaped institution with lifecycle provenance + history', () => {
    const town = smithyTown();
    const next = applyInstitutionLifecycleOutcome(town, outcome({
      saveId: 'a', action: 'build', name: 'Mine', category: 'Crafts', description: 'Open seam', tags: ['industry'], reason: 'Iron feeds the smithy.',
    }));
    expect(next).not.toBe(town);
    const mine = next.institutions.find(i => i.name === 'Mine');
    expect(mine).toMatchObject({ status: 'active', _worldPulseEconomyBuilt: true, required: false });
    expect(mine.id).toBe('institution.mine');
    expect(next.institutionHistory.at(-1)).toMatchObject({ name: 'Mine', fate: 'built' });
  });

  it('build is idempotent: an already-standing institution returns the same reference', () => {
    const town = smithyTown();
    const built = applyInstitutionLifecycleOutcome(town, outcome({ saveId: 'a', action: 'build', name: 'Mine', category: 'Crafts' }));
    expect(applyInstitutionLifecycleOutcome(built, outcome({ saveId: 'a', action: 'build', name: 'Mine', category: 'Crafts' }))).toBe(built);
  });

  it('build over a closed remnant reopens it instead of duplicating', () => {
    const town = smithyTown({
      institutions: [{ name: 'Mine', category: 'Crafts', status: 'remnant', _worldPulseInactive: true, worldPulseFate: 'bankrupt', impairments: [{ type: 'capacity', severity: 0.4 }] }],
    });
    const next = applyInstitutionLifecycleOutcome(town, outcome({ saveId: 'a', action: 'build', name: 'Mine', category: 'Crafts' }));
    const mines = next.institutions.filter(i => i.name === 'Mine');
    expect(mines).toHaveLength(1);
    expect(mines[0]).toMatchObject({ status: 'active', _worldPulseInactive: false, impairments: [], _worldPulseEconomyBuilt: true });
    expect(next.institutionHistory.at(-1)).toMatchObject({ name: 'Mine', fate: 'reopened' });
  });

  it('build appends a native institution beside a current custom namesake', () => {
    const customMine = customInstitution('Mine');
    const town = smithyTown({ institutions: [customMine] });
    const next = applyInstitutionLifecycleOutcome(
      town,
      outcome({
        saveId: 'a',
        action: 'build',
        name: 'Mine',
        category: 'Crafts',
      }),
    );
    const mines = next.institutions.filter(inst => inst.name === 'Mine');

    expect(mines).toHaveLength(2);
    expect(mines[0]).toBe(customMine);
    expect(mines[1]).toMatchObject({
      id: 'institution.mine',
      _worldPulseEconomyBuilt: true,
    });
  });

  it('close flips status to remnant with a fate, never splicing the array', () => {
    const town = smithyTown({
      institutions: [
        { name: 'Blacksmiths (3-10)', category: 'Crafts' },
        { name: 'Bathhouse', category: 'Services' },
      ],
    });
    const next = applyInstitutionLifecycleOutcome(town, outcome({ saveId: 'a', action: 'close', name: 'Bathhouse' }));
    expect(next.institutions).toHaveLength(2);
    const bath = next.institutions.find(i => i.name === 'Bathhouse');
    expect(bath).toMatchObject({ status: 'remnant', _worldPulseInactive: true, _worldPulseEconomyClosed: true });
    expect(bath.worldPulseFate).toBeTruthy();
    expect(next.institutionHistory.at(-1)).toMatchObject({ name: 'Bathhouse' });
  });

  it('close targets the native namesake and never the current custom owner', () => {
    const customBathhouse = customInstitution('Bathhouse');
    const nativeBathhouse = {
      name: 'Bathhouse',
      category: 'Services',
      status: 'active',
    };
    const town = smithyTown({
      institutions: [customBathhouse, nativeBathhouse],
    });
    const next = applyInstitutionLifecycleOutcome(
      town,
      outcome({ action: 'close', name: 'Bathhouse' }),
    );

    expect(next.institutions[0]).toBe(customBathhouse);
    expect(next.institutions[1]).toMatchObject({
      status: 'remnant',
      _worldPulseEconomyClosed: true,
    });
    expect(
      applyInstitutionLifecycleOutcome(
        smithyTown({ institutions: [customBathhouse] }),
        outcome({ action: 'close', name: 'Bathhouse' }),
      ).institutions[0],
    ).toBe(customBathhouse);
  });

  it('abolish and found respect the same exact custom boundary', () => {
    const customMarket = customInstitution('Slave market');
    const nativeMarket = {
      name: 'Slave market',
      category: 'criminal_economy',
      status: 'active',
    };
    const abolished = applyInstitutionLifecycleOutcome(
      smithyTown({ institutions: [customMarket, nativeMarket] }),
      outcome({
        action: 'abolish',
        name: 'Slave market',
        fate: 'abolished',
      }),
    );
    expect(abolished.institutions[0]).toBe(customMarket);
    expect(abolished.institutions[1]).toMatchObject({
      status: 'remnant',
      _worldPulseMorallyAbolished: true,
    });

    const customHospice = customInstitution('Hospice');
    const founded = applyInstitutionLifecycleOutcome(
      smithyTown({ institutions: [customHospice] }),
      outcome({
        action: 'found',
        name: 'Hospice',
        category: 'Services',
        moralLean: { cruelty: -0.8, disorder: -0.1 },
        set: 'benevolent',
      }),
    );
    expect(founded.institutions).toHaveLength(2);
    expect(founded.institutions[0]).toBe(customHospice);
    expect(founded.institutions[1]).toMatchObject({
      id: 'institution.hospice',
      _worldPulseFounded: true,
    });
  });

  it('close re-verifies guards at apply time: required/criminal targets are refused', () => {
    const town = smithyTown({
      institutions: [
        { name: 'Town granary', category: 'Storage', required: true },
        { name: "Thieves' Guild", category: 'criminal' },
      ],
    });
    expect(applyInstitutionLifecycleOutcome(town, outcome({ saveId: 'a', action: 'close', name: 'Town granary' }))).toBe(town);
    expect(applyInstitutionLifecycleOutcome(town, outcome({ saveId: 'a', action: 'close', name: "Thieves' Guild" }))).toBe(town);
    expect(applyInstitutionLifecycleOutcome(town, outcome({ saveId: 'a', action: 'close', name: 'Never Existed' }))).toBe(town);
  });

  it('a cascade-added record is not required-immune (the borrowed flag no longer shields it)', () => {
    // The cascade seats borrowed lower-tier catalog defs at a higher tier. That
    // def's `required` belongs to the tier that declares it, so the seat now
    // writes required:false — and this guard, which reads the flag straight off
    // the record, must let the record through (owner-ratified 2026-07-26).
    const cascaded = (patch = {}) => ({
      name: 'Slave market', category: 'criminal_economy', status: 'active',
      source: 'cascade', cascadeAdded: true, cascadeBoost: 1.4, ...patch,
    });
    const abolish = outcome({ action: 'abolish', name: 'Slave market', fate: 'abolished' });

    const honest = applyInstitutionLifecycleOutcome(
      smithyTown({ institutions: [cascaded({ required: false })] }), abolish,
    );
    expect(honest.institutions[0]).toMatchObject({ status: 'remnant', _worldPulseMorallyAbolished: true });

    // THE PERSISTED PRE-FIX SHAPE — the same record carrying the SOURCE tier's
    // borrowed flag, as every settlement saved before the producer fix still does.
    // It USED to be immune here (the guard read the flag raw and returned the
    // settlement unchanged). Reader-side scoping neutralizes the saved lie in
    // place, which is why the fix ships without a data migration.
    const borrowed = applyInstitutionLifecycleOutcome(
      smithyTown({ institutions: [cascaded({ required: true })] }), abolish,
    );
    expect(borrowed.institutions[0]).toMatchObject({ status: 'remnant', _worldPulseMorallyAbolished: true });

    // The scoping is narrow: an institution whose `required` is its OWN contract
    // is still immune — a patron cannot abolish the town's granary.
    const contracted = smithyTown({ institutions: [{
      name: 'Slave market', category: 'criminal_economy', status: 'active', required: true,
    }] });
    expect(applyInstitutionLifecycleOutcome(contracted, abolish)).toBe(contracted);
  });

  it('no-ops on malformed outcomes with the same reference', () => {
    const town = smithyTown();
    expect(applyInstitutionLifecycleOutcome(town, {})).toBe(town);
    expect(applyInstitutionLifecycleOutcome(town, outcome({ action: 'build' }))).toBe(town);
    expect(applyInstitutionLifecycleOutcome(null, outcome({ action: 'build', name: 'Mine' }))).toBeNull();
  });
});
