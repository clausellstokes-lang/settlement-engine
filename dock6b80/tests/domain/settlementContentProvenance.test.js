import { describe, expect, it } from 'vitest';

import {
  buildSettlementContentProvenance,
} from '../../src/domain/content/settlementContentProvenance.js';
import {
  makeContentEnvironmentRevision,
} from '../../src/domain/content/contentEnvironment.js';

function definition(category, name, suffix) {
  return {
    name,
    localUid: `local-${suffix}`,
    definitionId: `definition:${suffix}`,
    revisionId: `revision:${suffix}:3`,
    contentHash: suffix.padEnd(64, 'a').slice(0, 64),
    category,
  };
}

describe('settlement custom-content provenance', () => {
  it('retains only exact definitions that actually materialized', () => {
    const foundry = definition('institutions', 'Ash Foundry', '1');
    const spring = definition('resources', 'Moonlit Spring', '2');
    const unused = definition('services', 'Unused Blessing', '3');
    const environment = makeContentEnvironmentRevision({
      environmentId: 'personal:smithing',
      environmentRevisionId: 'personal:smithing:v3',
    });

    const receipt = buildSettlementContentProvenance({
      institutions: [{
        name: foundry.name,
        source: 'custom',
        customDefinitionId: foundry.definitionId,
      }],
      config: {
        nearbyResourcesCustom: [spring.name],
      },
      availableServices: {},
    }, {
      institutions: [foundry],
      resources: [spring],
      services: [unused],
    }, {
      scope: 'standalone',
      environment,
    });

    expect(receipt).toMatchObject({
      schemaVersion: 1,
      environment: {
        environmentId: environment.environmentId,
        environmentRevisionId: environment.environmentRevisionId,
        environmentHash: environment.environmentHash,
      },
      receiptHash: expect.stringMatching(/^[0-9a-f]{64}$/),
    });
    expect(receipt.materializedDefinitions).toEqual([
      expect.objectContaining({
        definitionId: foundry.definitionId,
        surfaces: ['institutions'],
      }),
      expect.objectContaining({
        definitionId: spring.definitionId,
        surfaces: ['config.nearbyResourcesCustom'],
      }),
    ]);
  });

  it('omits ambiguous name-only evidence rather than claiming exact usage', () => {
    const first = definition('resources', 'Twin Spring', '4');
    const second = definition('resources', 'Twin Spring', '5');

    const receipt = buildSettlementContentProvenance({
      config: { nearbyResourcesCustom: ['Twin Spring'] },
    }, {
      resources: [first, second],
    });

    expect(receipt).toBeNull();
  });

  it('uses an endpoint sidecar to resolve same-name trade goods exactly', () => {
    const first = definition('tradeGoods', 'Twin Loaf', '6');
    const second = definition('tradeGoods', 'Twin Loaf', '7');

    const receipt = buildSettlementContentProvenance({
      economicState: {
        primaryExports: ['Twin Loaf'],
        customTradeLabels: { exports: ['Twin Loaf'], imports: [] },
        customTradeEndpoints: {
          exports: [{
            label: 'Twin Loaf',
            source: 'custom',
            customDefinitionCategory: 'tradeGoods',
            customDefinitionId: second.definitionId,
          }],
          imports: [],
        },
      },
    }, {
      tradeGoods: [first, second],
    });

    expect(receipt?.materializedDefinitions).toEqual([
      expect.objectContaining({
        definitionId: second.definitionId,
        name: second.name,
        surfaces: ['economicState.customTradeEndpoints'],
      }),
    ]);
  });

  it('retains a reviewed environment even when no definition materializes', () => {
    const environment = makeContentEnvironmentRevision({
      environmentId: 'personal:tunables',
      environmentRevisionId: 'personal:tunables:v1',
      tunables: { priorityEconomy: 72 },
    });

    const receipt = buildSettlementContentProvenance(
      { institutions: [] },
      {},
      { scope: 'campaign', environment, bindingHash: 'b'.repeat(64) },
    );

    expect(receipt).toMatchObject({
      scope: 'campaign',
      bindingHash: 'b'.repeat(64),
      materializedDefinitions: [],
    });
  });
});
