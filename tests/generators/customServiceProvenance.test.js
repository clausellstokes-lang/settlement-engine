import { describe, expect, it } from 'vitest';

import { contentRevisionHash } from '../../src/domain/content/customContentVersioning.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

const CONFIG = Object.freeze({
  settType: 'town',
  culture: 'germanic',
  terrainOverride: 'plains',
  tradeRouteAccess: 'road',
});

function versionedDefinition(bucket, data, suffix) {
  return {
    ...data,
    definitionId: `definition:${suffix}`,
    revisionId: `revision:${suffix}:1`,
    revisionNumber: 1,
    contentHash: contentRevisionHash(bucket, data),
  };
}

function serviceNamed(settlement, name) {
  return servicesNamed(settlement, name)[0];
}

function servicesNamed(settlement, name) {
  return Object.values(settlement.availableServices || {})
    .flatMap(entries => (Array.isArray(entries) ? entries : []))
    .filter(entry => (
      (typeof entry === 'string' ? entry : entry?.name) === name
    ));
}

describe('custom-service exact provenance', () => {
  it('retains the same custom service revision through every provider roll', () => {
    const serviceData = {
      localUid: 'sunwell-restoration',
      name: 'Sunwell Restoration',
      category: 'healing',
      criticality: 'critical',
      providedBy: ['custom:sunwell-house'],
    };
    const institutionData = {
      localUid: 'sunwell-house',
      name: 'Sunwell House',
      category: 'religious',
      essential: true,
      produces: ['custom:sunwell-restoration'],
    };
    const service = versionedDefinition('services', serviceData, 'sunwell-service');
    const institution = versionedDefinition(
      'institutions',
      institutionData,
      'sunwell-institution',
    );
    const customContent = {
      institutions: [institution],
      services: [service],
    };

    for (let seed = 0; seed < 100; seed += 1) {
      const settlement = generateSettlementPipeline(CONFIG, null, {
        seed: `custom-service-provenance-${seed}`,
        customContent,
      });
      const materializedServices = servicesNamed(settlement, service.name);
      const [materialized] = materializedServices;
      const receipt = settlement.customContentProvenance;

      // The provider's `produces` edge and the direct critical-service pass
      // project one definition twice, but identity reconciliation exposes one
      // buyable entity.
      expect(materializedServices, `duplicate service for seed ${seed}`)
        .toHaveLength(1);
      expect(materialized, `service missing for seed ${seed}`).toMatchObject({
        name: service.name,
        custom: true,
        source: 'custom',
        customDefinitionCategory: 'services',
        customDefinitionId: service.definitionId,
        customDefinitionRevisionId: service.revisionId,
        customDefinitionContentHash: service.contentHash,
      });
      expect(
        receipt?.materializedDefinitions.some(definition => (
          definition.category === 'services'
          && definition.definitionId === service.definitionId
          && definition.revisionId === service.revisionId
          && definition.surfaces.some(surface => surface.startsWith('availableServices.'))
        )),
        `exact service provenance missing for seed ${seed}`,
      ).toBe(true);
    }
  });

  it('retains both exact identities when distinct custom services share a name', () => {
    const sharedName = 'Twin Counsel';
    const firstServiceData = {
      localUid: 'twin-counsel-a',
      name: sharedName,
      category: 'legal',
      criticality: 'critical',
      providedBy: ['custom:twin-counsel-hall'],
    };
    const secondServiceData = {
      ...firstServiceData,
      localUid: 'twin-counsel-b',
    };
    const institutionData = {
      localUid: 'twin-counsel-hall',
      name: 'Twin Counsel Hall',
      category: 'government',
      essential: true,
      produces: ['custom:twin-counsel-a', 'custom:twin-counsel-b'],
    };
    const firstService = versionedDefinition('services', firstServiceData, 'twin-service-a');
    const secondService = versionedDefinition('services', secondServiceData, 'twin-service-b');
    const institution = versionedDefinition(
      'institutions',
      institutionData,
      'twin-institution',
    );
    const settlement = generateSettlementPipeline(CONFIG, null, {
      seed: 'custom-service-ambiguous-identity',
      customContent: {
        institutions: [institution],
        services: [firstService, secondService],
      },
    });
    const materialized = servicesNamed(settlement, sharedName);
    const definitionIds = materialized
      .map(service => service.customDefinitionId)
      .sort();

    expect(materialized).toHaveLength(2);
    expect(definitionIds).toEqual([
      firstService.definitionId,
      secondService.definitionId,
    ].sort());
    expect(materialized).toEqual(expect.arrayContaining([
      expect.objectContaining({
        localUid: firstService.localUid,
        customDefinitionId: firstService.definitionId,
        customDefinitionRevisionId: firstService.revisionId,
      }),
      expect.objectContaining({
        localUid: secondService.localUid,
        customDefinitionId: secondService.definitionId,
        customDefinitionRevisionId: secondService.revisionId,
      }),
    ]));
    expect(
      settlement.customContentProvenance.materializedDefinitions
        .filter(definition => definition.category === 'services')
        .map(definition => definition.definitionId)
        .sort(),
    ).toEqual([
      firstService.definitionId,
      secondService.definitionId,
    ].sort());
  });

  it('keeps native and custom same-name services as distinct entities', () => {
    const sharedName = 'Grain storage';
    const serviceData = {
      localUid: 'custom-grain-storage',
      name: sharedName,
      category: 'equipment',
      criticality: 'critical',
      providedBy: ['custom:custom-grain-house'],
    };
    const providerData = {
      localUid: 'custom-grain-house',
      name: 'Custom Grain House',
      category: 'economic',
      essential: true,
      produces: ['custom:custom-grain-storage'],
    };
    const service = versionedDefinition(
      'services',
      serviceData,
      'custom-grain-storage',
    );
    const provider = versionedDefinition(
      'institutions',
      providerData,
      'custom-grain-house',
    );
    const settlement = generateSettlementPipeline(CONFIG, null, {
      seed: 'custom-service-native-namesake',
      customContent: {
        institutions: [provider],
        services: [service],
      },
    });
    const materialized = servicesNamed(settlement, sharedName);

    expect(settlement.institutions).toEqual(expect.arrayContaining([
      expect.objectContaining({ name: 'Town granary', source: 'required' }),
      expect.objectContaining({
        name: provider.name,
        customDefinitionId: provider.definitionId,
      }),
    ]));
    expect(materialized).toHaveLength(2);
    expect(materialized).toEqual(expect.arrayContaining([
      expect.objectContaining({
        name: sharedName,
        institution: 'Town granary',
      }),
      expect.objectContaining({
        name: sharedName,
        institution: provider.name,
        customDefinitionId: service.definitionId,
        customDefinitionRevisionId: service.revisionId,
        customDefinitionContentHash: service.contentHash,
      }),
    ]));
    expect(
      settlement.customContentProvenance.materializedDefinitions
        .filter(definition => definition.category === 'services'),
    ).toEqual([
      expect.objectContaining({
        definitionId: service.definitionId,
        revisionId: service.revisionId,
      }),
    ]);
  });
});
