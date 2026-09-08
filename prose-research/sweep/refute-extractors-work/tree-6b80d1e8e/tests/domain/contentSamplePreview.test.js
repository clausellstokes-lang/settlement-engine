import { describe, expect, it } from 'vitest';
import {
  buildContentPreviewSnapshot,
  compareContentSampleProjections,
  forgeContentSample,
} from '../../src/domain/content/contentSamplePreview.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

describe('custom-content sample preview', () => {
  it('forces previewable candidates only in the ephemeral snapshot', () => {
    const original = {
      institutions: [{ localUid: 'existing', name: 'Old Hall', essential: false }],
    };
    const { snapshot, forced, dormant } = buildContentPreviewSnapshot(original, [
      { bucket: 'institutions', entry: { localUid: 'new', name: 'Glassworks' } },
      { bucket: 'deities', entry: { localUid: 'god', name: 'The Ember Saint' } },
    ]);

    expect(snapshot.institutions[1]).toMatchObject({
      name: 'Glassworks',
      essential: true,
    });
    expect(original.institutions[0].essential).toBe(false);
    expect(forced).toHaveLength(1);
    expect(dormant).toHaveLength(1);
  });

  it('produces a deterministic, unsaved same-seed before/after receipt', () => {
    const request = {
      seed: 'custom-content-preview-test',
      baseContent: {},
      accepted: [{
        bucket: 'institutions',
        entry: {
          localUid: 'glassworks',
          name: 'Haunted Glassworks',
          category: 'economic',
          description: 'A forbidden guild works moonlit glass.',
        },
      }],
    };
    const first = forgeContentSample(request, generateSettlementPipeline);
    const second = forgeContentSample(request, generateSettlementPipeline);

    expect(first).toEqual(second);
    expect(first.saved).toBe(false);
    expect(first.seed).toBe(request.seed);
    expect(first.diff.materialized.institutions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Haunted Glassworks',
          localUid: 'glassworks',
        }),
      ]),
    );
  });

  it('projects a forced resource and canonical food state from real generator output', () => {
    const generated = [];
    const generateAndCapture = (...args) => {
      const settlement = generateSettlementPipeline(...args);
      generated.push(settlement);
      return settlement;
    };
    const request = {
      seed: 'custom-content-resource-preview-contract',
      baseContent: {},
      accepted: [{
        bucket: 'resources',
        entry: {
          localUid: 'moon-salt',
          name: 'Moon Salt',
          category: 'minerals',
          description: 'Mineral salt gathered from moonlit flats.',
        },
      }],
    };

    const sample = forgeContentSample(request, generateAndCapture);
    const [baselineSettlement, candidateSettlement] = generated;

    // The first pair remains the summary sample. Category-aware lower/upper
    // tier fixtures add further canonical generation pairs afterward.
    expect(generated.length).toBeGreaterThanOrEqual(2);
    expect(candidateSettlement.config.nearbyResourcesCustom).toContain('Moon Salt');
    expect(sample.diff.materialized.resources).toContainEqual({
      name: 'Moon Salt',
      localUid: 'moon-salt',
    });
    expect(sample.baseline.foodStatus).toBe(
      baselineSettlement.economicState.foodSecurity.label,
    );
    expect(sample.candidate.foodStatus).toBe(
      candidateSettlement.economicState.foodSecurity.label,
    );
    expect(sample.baseline.foodStatus).not.toBeNull();
    expect(sample.candidate.foodStatus).not.toBeNull();
  });

  it('exercises generation categories at their authored minimum and maximum tiers', () => {
    const sample = forgeContentSample({
      seed: 'custom-content-tier-fixtures',
      baseContent: {},
      accepted: [{
        bucket: 'institutions',
        entry: {
          localUid: 'border-glassworks',
          name: 'Border Glassworks',
          category: 'economic',
          tierMin: 'village',
          tierMax: 'city',
        },
      }],
    }, generateSettlementPipeline);

    const fixtures = sample.fixtures.filter(
      fixture => fixture.kind === 'generation-boundary',
    );
    expect(fixtures.map(fixture => ({
      bucket: fixture.bucket,
      tier: fixture.tier,
      boundaries: fixture.boundaries,
    }))).toEqual([
      { bucket: 'institutions', tier: 'village', boundaries: ['minimum'] },
      { bucket: 'institutions', tier: 'city', boundaries: ['maximum'] },
    ]);
    for (const fixture of fixtures) {
      expect(fixture.saved).toBe(false);
      expect(fixture.config.settType).toBe(fixture.tier);
      expect(fixture.receipt.definitions).toContainEqual(
        expect.objectContaining({
          localUid: 'border-glassworks',
          materialized: true,
        }),
      );
    }
  });

  it('does not claim that a mandatory override bypassed an authored tier gate', () => {
    const sample = forgeContentSample({
      seed: 'custom-content-summary-tier-truth',
      baseContent: {},
      accepted: [{
        bucket: 'institutions',
        entry: {
          localUid: 'metropolitan-exchange',
          name: 'Metropolitan Exchange',
          category: 'economic',
          tierMin: 'metropolis',
        },
      }],
    }, generateSettlementPipeline);

    expect(sample.config.settType).toBe('town');
    expect(sample.diff.materialized.institutions).toEqual([]);
    expect(sample.forced).toEqual([
      expect.objectContaining({
        name: 'Metropolitan Exchange',
        materialized: false,
        reason: expect.stringMatching(/tier, provider, or dependency gates/i),
      }),
    ]);
    expect(sample.fixtures).toContainEqual(
      expect.objectContaining({
        kind: 'generation-boundary',
        tier: 'metropolis',
        receipt: expect.objectContaining({
          definitions: expect.arrayContaining([
            expect.objectContaining({
              name: 'Metropolitan Exchange',
              materialized: true,
            }),
          ]),
        }),
      }),
    );
  });

  it('retains exact attribution for duplicate resource display names', () => {
    const sample = forgeContentSample({
      seed: 'custom-content-summary-duplicate-resource-truth',
      baseContent: {},
      accepted: [
        {
          bucket: 'resources',
          entry: {
            localUid: 'twin-ore-a',
            name: 'Twin Ore',
            category: 'mineral',
          },
        },
        {
          bucket: 'resources',
          entry: {
            localUid: 'twin-ore-b',
            name: 'Twin Ore',
            category: 'mineral',
          },
        },
      ],
    }, generateSettlementPipeline);

    expect(sample.candidate.resources).toEqual(
      expect.arrayContaining([
        { name: 'Twin Ore', localUid: 'twin-ore-a' },
        { name: 'Twin Ore', localUid: 'twin-ore-b' },
      ]),
    );
    expect(sample.forced).toEqual([
      expect.objectContaining({
        localUid: 'twin-ore-a',
        materialized: true,
        materializationState: 'materialized',
      }),
      expect.objectContaining({
        localUid: 'twin-ore-b',
        materialized: true,
        materializationState: 'materialized',
      }),
    ]);
    const resourceFixtures = sample.fixtures.filter(fixture => (
      fixture.bucket === 'resources'
      && fixture.kind === 'generation-boundary'
    ));
    expect(resourceFixtures.length).toBeGreaterThan(0);
    for (const fixture of resourceFixtures) {
      expect(fixture.receipt.definitions).toEqual([
        expect.objectContaining({
          localUid: 'twin-ore-a',
          materialized: true,
          materializationState: 'materialized',
        }),
        expect.objectContaining({
          localUid: 'twin-ore-b',
          materialized: true,
          materializationState: 'materialized',
        }),
      ]);
    }
  });

  it('attributes a reviewed definition exactly beside a same-name base definition', () => {
    const sample = forgeContentSample({
      seed: 'custom-content-summary-base-duplicate-truth',
      baseContent: {
        resources: [{
          localUid: 'existing-twin-ore',
          name: 'Twin Ore',
          category: 'mineral',
          essential: true,
        }],
      },
      accepted: [{
        bucket: 'resources',
        entry: {
          localUid: 'reviewed-twin-ore',
          name: 'Twin Ore',
          category: 'mineral',
        },
      }],
    }, generateSettlementPipeline);

    expect(sample.forced).toEqual([
      expect.objectContaining({
        localUid: 'reviewed-twin-ore',
        materialized: true,
        materializationState: 'materialized',
      }),
    ]);
    const resourceFixtures = sample.fixtures.filter(fixture => (
      fixture.bucket === 'resources'
      && fixture.kind === 'generation-boundary'
    ));
    expect(resourceFixtures.length).toBeGreaterThan(0);
    for (const fixture of resourceFixtures) {
      expect(fixture.receipt.definitions).toContainEqual(
        expect.objectContaining({
          localUid: 'reviewed-twin-ore',
          materialized: true,
          materializationState: 'materialized',
        }),
      );
    }
  });

  it('attributes an edited existing identity from candidate presence, not delta', () => {
    const sample = forgeContentSample({
      seed: 'custom-content-summary-existing-edit-truth',
      baseContent: {
        institutions: [{
          localUid: 'existing-hall',
          name: 'Existing Hall',
          category: 'economic',
          essential: true,
          description: 'Original description.',
        }],
      },
      accepted: [{
        bucket: 'institutions',
        entry: {
          localUid: 'existing-hall',
          name: 'Existing Hall',
          category: 'economic',
          essential: true,
          description: 'Reviewed replacement description.',
        },
      }],
    }, generateSettlementPipeline);

    expect(sample.diff.materialized.institutions).toEqual([]);
    const boundaryFixtures = sample.fixtures.filter(fixture => (
      fixture.bucket === 'institutions'
      && fixture.kind === 'generation-boundary'
    ));
    expect(boundaryFixtures.length).toBeGreaterThan(0);
    for (const fixture of boundaryFixtures) {
      expect(fixture.receipt.definitions).toContainEqual(
        expect.objectContaining({
          localUid: 'existing-hall',
          materialized: true,
          materializationState: 'materialized',
        }),
      );
    }
  });

  it('uses canonical unsaved activation paths and labels their real limits', () => {
    const request = {
      seed: 'custom-content-living-fixtures',
      baseContent: {},
      accepted: [
        {
          bucket: 'deities',
          entry: {
            localUid: 'ember-saint',
            name: 'The Ember Saint',
            alignmentAxis: 'good',
            temperamentAxis: 'peacelike',
            lawAxis: 'lawful',
            rankAxis: 'major',
            portfolio: 'Hearths and oaths',
          },
        },
        {
          bucket: 'factions',
          entry: {
            localUid: 'glass-compact',
            name: 'The Glass Compact',
            authority: 'economic',
            agenda: 'Control the furnaces.',
            description: 'A compact of furnace owners.',
          },
        },
        {
          bucket: 'stressors',
          entry: {
            localUid: 'whispering-rot',
            name: 'Whispering Rot',
            severity: 'catastrophic',
            affects: ['economy'],
            description: 'A strange rot spreads through timber stores.',
          },
        },
        {
          bucket: 'traditions',
          entry: {
            localUid: 'lantern-vigil',
            name: 'Lantern Vigil',
            motifElement: 'the-dead',
            motifAct: 'vigil',
            epithet: 'Lanterns at dusk',
          },
        },
      ],
    };

    const first = forgeContentSample(request, generateSettlementPipeline);
    const second = forgeContentSample(request, generateSettlementPipeline);
    expect(first.fixtures).toEqual(second.fixtures);

    const deity = first.fixtures.find(fixture => fixture.bucket === 'deities');
    expect(deity).toMatchObject({
      kind: 'deity-assignment',
      saved: false,
      event: { type: 'SET_PRIMARY_DEITY', appliedAt: null, veto: null },
      result: {
        assigned: true,
        snapshot: { name: 'The Ember Saint', lawAxis: 'lawful' },
      },
    });
    expect(deity.receipt.fieldTruth.presentationOnly).toContain('portfolio');

    const faction = first.fixtures.find(fixture => fixture.bucket === 'factions');
    expect(faction).toMatchObject({
      kind: 'faction-event',
      saved: false,
      event: { type: 'ADD_FACTION', appliedAt: null, veto: null },
      result: { present: true },
    });
    expect(faction.receipt.fieldTruth.presentationOnly).toContain('authority');

    const stressor = first.fixtures.find(fixture => fixture.bucket === 'stressors');
    expect(stressor).toMatchObject({
      kind: 'stressor-event',
      saved: false,
      event: { type: 'APPLY_STRESSOR', appliedAt: null, veto: null },
      result: { active: true, fixtureSeverity: 0.6 },
    });
    expect(stressor.receipt.fieldTruth.presentationOnly).toContain('severity');
    expect(stressor.receipt.assumption).toContain('not converted into simulation rules');

    const tradition = first.fixtures.find(fixture => fixture.bucket === 'traditions');
    expect(tradition).toMatchObject({
      kind: 'tradition-observance',
      saved: false,
      event: null,
      result: {
        observance: {
          name: 'Lantern Vigil',
          custom: true,
          coreMotif: { element: 'the-dead', act: 'vigil' },
        },
      },
      receipt: { activation: 'presentation-only' },
    });
    expect(tradition.result.observance.window.startWeekOfYear).toBeGreaterThanOrEqual(1);
    expect(tradition.result.observance.window.startWeekOfYear).toBeLessThanOrEqual(52);
  });

  it('compares structured facts rather than inventing causal prose', () => {
    const diff = compareContentSampleProjections(
      {
        tier: 'town',
        population: 1_000,
        prosperity: 'Moderate',
        foodStatus: 'balanced',
        exports: [],
        imports: [],
        institutions: [],
        resources: [],
        services: [],
      },
      {
        tier: 'town',
        population: 1_000,
        prosperity: 'Prosperous',
        foodStatus: 'balanced',
        exports: ['Glass'],
        imports: [],
        institutions: [{ name: 'Glassworks', localUid: 'g1' }],
        resources: [],
        services: [],
      },
    );

    expect(diff.scalarChanges).toEqual([
      { field: 'prosperity', before: 'Moderate', after: 'Prosperous' },
    ]);
    expect(diff.addedExports).toEqual(['Glass']);
    expect(diff.materialized.institutions[0].localUid).toBe('g1');
  });
});
