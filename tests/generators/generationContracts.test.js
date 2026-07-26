/**
 * Integration contract for the generation-policy envelope.
 *
 * Focused unit suites pin each producer in isolation. This file pins the joins:
 * the final settlement must retain one resource truth, the resolved culture and
 * content policy must agree with the coherence receipt, transient world-law
 * functions must not leak into the save, and downstream analysis must remain a
 * derivation of the resolved resource roster.
 */

import { describe, expect, it } from 'vitest';
import {
  CONSTRUCT_CONTENT_PROFILES,
  SETTLEMENT_CONFIG_FIELDS,
  buildConstructVocabulary,
  validateSettlementConfig,
} from '../../src/domain/construct/configVocabulary.js';
import {
  availableNativeResourceKeys,
  nativeResourceConditionRecords,
} from '../../src/domain/resourceSemantics.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { resolveNearbyCommodities } from '../../src/generators/resourceGenerator.js';

const CULTURE_DIMENSIONS = [
  'builtForm',
  'civicPattern',
  'exchangePattern',
  'foodways',
  'sacredLife',
  'defensePattern',
  'socialTexture',
  'architecturalDetail',
];

const COHERENCE_CHECKS = [
  'template_tokens',
  'narrative_quality',
  'world_law_magic',
  'content_boundaries',
  'resource_truth',
  'structural',
  'food_verdict',
  'npc_identity',
  'isolation_support',
  'final_graph',
  'chronology',
  'conservation',
  'user_intent',
  'narrative_realization',
  'dramatic_tension',
  'roster_repetition',
  'provenance',
];

const COHERENCE_JUDGMENTS = [
  'hard_structural_validity',
  'cross_system_semantic_agreement',
  'user_intent_fulfillment',
  'narrative_realization',
  'dramatic_tension',
  'diversity_and_repetition',
  'confidence_and_provenance',
];

describe('final settlement generation contracts', () => {
  it('persists data receipts while keeping function-bearing world law transient', () => {
    const settlement = generateSettlementPipeline(
      {
        settType: 'town',
        culture: 'latin',
        terrainOverride: 'plains',
        tradeRouteAccess: 'road',
        contentProfile: 'heroic',
        nearbyResourcesRandom: false,
        nearbyResources: [
          'grain_fields',
          'grazing_land',
          'managed_forest',
        ],
        nearbyResourcesState: {
          grain_fields: 'depleted',
          grazing_land: 'abundant',
          managed_forest: 'abundant',
        },
      },
      null,
      { seed: 'generation-contract-envelope-v1', customContent: {} },
    );

    expect(settlement).not.toHaveProperty('generationContext');
    expect(settlement).not.toHaveProperty('worldLaw');

    expect(settlement.culturalIdentity).toMatchObject({
      key: 'latin',
      label: expect.any(String),
      scope: expect.any(String),
    });
    for (const dimension of CULTURE_DIMENSIONS) {
      expect(
        settlement.culturalIdentity[dimension],
        `culturalIdentity.${dimension}`,
      ).toEqual(expect.any(String));
    }

    expect(settlement.config).toMatchObject({
      contentProfile: 'heroic',
      contentBoundaries: {
        human_trafficking: false,
        slavery: false,
        torture: false,
        hard_drugs: false,
      },
    });

    // Resource membership/condition lives in the effective config. The resource
    // analysis carries the exact derivative vocabulary its chain matcher reads.
    expect([...settlement.config.nearbyResourcesNative].sort()).toEqual([
      'grain_fields',
      'grazing_land',
      'managed_forest',
    ].sort());
    expect(settlement.config.nearbyResourcesNativeDepleted).toEqual([
      'grain_fields',
    ]);
    expect(availableNativeResourceKeys(settlement.config).sort()).toEqual([
      'grazing_land',
      'managed_forest',
    ].sort());
    expect(nativeResourceConditionRecords(settlement.config)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: 'grain_fields',
          condition: 'depleted',
        }),
        expect.objectContaining({
          key: 'grazing_land',
          condition: 'available',
        }),
      ]),
    );
    expect(settlement.resourceAnalysis.availableResources).toEqual(
      resolveNearbyCommodities(
        settlement.config,
        settlement.config.terrainType,
      ),
    );

    expect(settlement.isolationSupport).toMatchObject({
      version: 1,
      applicable: false,
      status: 'connected',
      deficit: 0,
    });
    expect(Object.isFrozen(settlement.isolationSupport)).toBe(true);

    expect(settlement.generationCoherenceReceipt).toMatchObject({
      version: 1,
      seed: 'generation-contract-envelope-v1',
      worldLawVersion: 1,
      cultureProfile: 'latin',
      contentProfile: 'heroic',
    });
    expect(COHERENCE_CHECKS).toEqual(
      settlement.generationCoherenceReceipt.checks.map(check => check.id),
    );
    expect(COHERENCE_JUDGMENTS).toEqual(
      settlement.generationCoherenceReceipt.judgments.map(
        judgment => judgment.id,
      ),
    );
    for (const judgment of settlement.generationCoherenceReceipt.judgments) {
      expect(judgment).toMatchObject({
        status: expect.stringMatching(
          /^(pass|pass_with_tension|needs_review|not_applicable)$/,
        ),
        scope: 'single_settlement',
        summary: expect.any(String),
        findings: expect.any(Array),
        evidence: expect.any(Array),
      });
      expect(judgment.evidence.length).toBeGreaterThan(0);
      expect(Object.isFrozen(judgment)).toBe(true);
      expect(Object.isFrozen(judgment.findings)).toBe(true);
      expect(Object.isFrozen(judgment.evidence)).toBe(true);
      for (const evidence of judgment.evidence) {
        expect(Object.isFrozen(evidence)).toBe(true);
      }
      for (const finding of judgment.findings) {
        expect(Object.isFrozen(finding)).toBe(true);
      }
    }
    expect(Object.isFrozen(settlement.generationCoherenceReceipt)).toBe(true);
    expect(Object.isFrozen(settlement.generationCoherenceReceipt.checks)).toBe(true);
    expect(Object.isFrozen(settlement.generationCoherenceReceipt.judgments)).toBe(true);
  });
});

describe('Surveyor construct content-profile wall', () => {
  it('admits complete preset profiles and rejects an inexpressible custom profile', () => {
    expect(CONSTRUCT_CONTENT_PROFILES).toEqual([
      'heroic',
      'grounded',
      'grim',
    ]);
    expect(SETTLEMENT_CONFIG_FIELDS.contentProfile).toEqual({
      type: 'enum',
      values: CONSTRUCT_CONTENT_PROFILES,
    });
    expect(
      buildConstructVocabulary().settlementFields.contentProfile.values,
    ).toBe(CONSTRUCT_CONTENT_PROFILES);

    expect(validateSettlementConfig({
      contentProfile: 'heroic',
    })).toEqual({
      config: { contentProfile: 'heroic' },
      unsupported: [],
    });
    expect(validateSettlementConfig({
      contentProfile: 'custom',
      contentBoundaries: { slavery: true },
    })).toEqual({
      config: {},
      unsupported: [
        { key: 'contentProfile', reason: 'invalid_value' },
        { key: 'contentBoundaries', reason: 'unregistered_key' },
      ],
    });
  });
});
