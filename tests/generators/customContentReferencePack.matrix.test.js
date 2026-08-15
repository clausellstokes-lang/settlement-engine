/**
 * Adversarial end-to-end certification for the canonical custom-content pack.
 *
 * This is deliberately a bounded matrix, not an exhaustive cross product. One
 * case per settlement tier crosses the route and terrain branches while keeping
 * CI cost predictable. Every case replays byte-identically; the lower three
 * tiers prove reviewed-but-ineligible definitions stay dormant, and town+
 * proves the same immutable revisions materialize with exact provenance.
 */

import { describe, expect, it } from 'vitest';

import { eligibleCustomContent } from '../../src/domain/customContentSchema.js';
import {
  AUTHORABLE_CONTENT_BUCKETS,
  admitCustomContentDefinition,
} from '../../src/domain/content/customContentManifest.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import {
  customContentReferencePack,
  identifiedCustomContentReferencePack,
  REFERENCE_PACK_NAMES,
} from '../fixtures/customContentReferencePack.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const MATRIX = Object.freeze([
  { tier: 'thorp', route: 'isolated', terrain: 'forest', eligible: false },
  { tier: 'hamlet', route: 'road', terrain: 'hills', eligible: false },
  { tier: 'village', route: 'river', terrain: 'riverside', eligible: false },
  { tier: 'town', route: 'crossroads', terrain: 'plains', eligible: true },
  { tier: 'city', route: 'port', terrain: 'coastal', eligible: true },
  { tier: 'metropolis', route: 'road', terrain: 'mountain', eligible: true },
]);

const SETTLEMENT_BUCKETS = Object.freeze([
  'institutions',
  'resources',
  'services',
  'tradeGoods',
]);
const EVENT_ACTIVATED_BUCKETS = Object.freeze([
  'deities',
  'factions',
  'stressors',
  'traditions',
]);

function configFor({ tier, route, terrain }) {
  return {
    settType: tier,
    culture: 'germanic',
    terrainOverride: terrain,
    tradeRouteAccess: route,
    monsterThreat: 'civilized',
  };
}

function generate(matrixCase, customContent, seed = `reference-pack-${matrixCase.tier}`) {
  const runtime = eligibleCustomContent(customContent, {
    tier: matrixCase.tier,
  });
  return generateSettlementPipeline(
    configFor(matrixCase),
    null,
    { seed, customContent: runtime },
  );
}

function allServices(settlement) {
  return Object.values(settlement.availableServices || {})
    .flatMap(bucket => (Array.isArray(bucket) ? bucket : []));
}

function serviceNamed(settlement, name) {
  return allServices(settlement).some(service => (
    (typeof service === 'string' ? service : service?.name) === name
  ));
}

function materializedDefinitions(settlement) {
  return settlement.customContentProvenance?.materializedDefinitions || [];
}

function materializedByName(settlement, name) {
  return materializedDefinitions(settlement)
    .find(definition => definition.name === name);
}

function exactIdentity(category, definition) {
  return {
    category,
    definitionId: definition.definitionId,
    revisionId: definition.revisionId,
    contentHash: definition.contentHash,
    localUid: definition.localUid,
    name: definition.name,
  };
}

function compareIdentityName(left, right) {
  if (left.name < right.name) return -1;
  if (left.name > right.name) return 1;
  return 0;
}

function exactMaterializedIdentities(settlement) {
  return materializedDefinitions(settlement)
    .map(definition => ({
      category: definition.category,
      definitionId: definition.definitionId,
      revisionId: definition.revisionId,
      contentHash: definition.contentHash,
      localUid: definition.localUid,
      name: definition.name,
    }))
    .sort(compareIdentityName);
}

describe('canonical adversarial custom-content reference pack', () => {
  it('contains exactly every authorable category and passes category admission', () => {
    const pack = customContentReferencePack();

    expect([...Object.keys(pack)].sort())
      .toEqual([...AUTHORABLE_CONTENT_BUCKETS].sort());
    for (const bucket of AUTHORABLE_CONTENT_BUCKETS) {
      expect(pack[bucket].length, `${bucket} needs a reference definition`)
        .toBeGreaterThan(0);
      for (const definition of pack[bucket]) {
        const admission = admitCustomContentDefinition(bucket, definition, {
          allowSystemFields: true,
        });
        expect(admission, `${bucket}:${definition.name}`).toMatchObject({
          ok: true,
        });
      }
    }
  });

  it('rejects arbitrary executable meaning in every authorable category', () => {
    const pack = customContentReferencePack();

    for (const bucket of AUTHORABLE_CONTENT_BUCKETS) {
      const admission = admitCustomContentDefinition(bucket, {
        ...pack[bucket][0],
        arbitraryRuntimeHook: 'globalThis.pwned = true',
      }, {
        allowSystemFields: true,
      });

      expect(admission, bucket).toMatchObject({
        ok: false,
      });
      expect(admission.errors, bucket).toContainEqual({
        code: 'unregistered_field',
        bucket,
        field: 'arbitraryRuntimeHook',
      });
    }
  });

  it.each(MATRIX)(
    'replays $tier / $route / $terrain and honors active versus ineligible state',
    (matrixCase) => {
      const pack = identifiedCustomContentReferencePack();
      const first = generate(matrixCase, pack);
      const second = generate(matrixCase, pack);

      expect(JSON.stringify(second)).toBe(JSON.stringify(first));

      const institutionPresent = first.institutions.some(
        institution => institution.name === REFERENCE_PACK_NAMES.institution,
      );
      const resourcePresent = first.config.nearbyResourcesCustom.includes(
        REFERENCE_PACK_NAMES.resource,
      );
      const servicePresent = allServices(first).some(service => (
        (typeof service === 'string' ? service : service?.name)
        === REFERENCE_PACK_NAMES.service
      ));
      const reviewedChains = first.economicState?.customChains || [];

      expect(institutionPresent).toBe(matrixCase.eligible);
      expect(resourcePresent).toBe(matrixCase.eligible);
      expect(servicePresent).toBe(matrixCase.eligible);
      expect(reviewedChains.length, `${matrixCase.tier}: reviewed chains`)
        .toBeGreaterThan(0);
      expect(
        new Set(reviewedChains.map(chain => chain.activation?.state)),
        `${matrixCase.tier}: chain activation`,
      ).toEqual(new Set([matrixCase.eligible ? 'active' : 'ineligible']));
      expect(
        reviewedChains.every(chain => (
          chain.tradeEndpoints?.promoted === matrixCase.eligible
        )),
        `${matrixCase.tier}: active-only endpoint promotion`,
      ).toBe(true);

      const materializedCategories = new Set(
        materializedDefinitions(first).map(definition => definition.category),
      );
      for (const bucket of SETTLEMENT_BUCKETS) {
        expect(
          materializedCategories.has(bucket),
          `${matrixCase.tier}:${bucket}`,
        ).toBe(matrixCase.eligible);
      }

      // Library membership is not an activation event. These definitions remain
      // available for explicit assignment/event authoring but never appear merely
      // because the pack governed generation.
      const settlementJson = JSON.stringify(first);
      for (const bucket of EVENT_ACTIVATED_BUCKETS) {
        const name = REFERENCE_PACK_NAMES[
          bucket === 'deities'
            ? 'deity'
            : bucket === 'factions'
              ? 'faction'
              : bucket === 'stressors'
                ? 'stressor'
                : 'tradition'
        ];
        // The institution name reaches the serialized settlement at EVERY tier
        // (the reviewed chain labels carry it even where the pack is ineligible),
        // so it proves pack names do land in this payload — without it, a
        // settlement that stopped embedding custom names at all would read as
        // "correctly dormant" forever.
        expectAbsentWithAnchor(
          settlementJson,
          name,
          REFERENCE_PACK_NAMES.institution,
          `${matrixCase.tier}:${bucket}`,
        );
        expect(materializedCategories.has(bucket)).toBe(false);
      }

      if (!matrixCase.eligible) {
        expect(first.customContentProvenance).toBeUndefined();
        return;
      }

      expect(reviewedChains.some(chain => (
        chain.tradeEndpoints.exports.includes(
          REFERENCE_PACK_NAMES.tradeGood,
        )
      ))).toBe(true);
      expect(
        Object.values(first.economicState.customCategoryExports || {})
          .flat(),
      ).toContain(REFERENCE_PACK_NAMES.tradeGood);

      expect(materializedByName(first, REFERENCE_PACK_NAMES.institution))
        .toMatchObject({
          ...exactIdentity('institutions', pack.institutions[0]),
          category: 'institutions',
          surfaces: ['institutions'],
        });
      expect(materializedByName(first, REFERENCE_PACK_NAMES.resource))
        .toMatchObject({
          ...exactIdentity('resources', pack.resources[0]),
          category: 'resources',
          surfaces: ['config.nearbyResourceDefinitions'],
        });
      expect(materializedByName(first, REFERENCE_PACK_NAMES.service))
        .toMatchObject({
          ...exactIdentity('services', pack.services[0]),
          category: 'services',
          surfaces: [expect.stringMatching(/^availableServices\./)],
        });
      expect(materializedByName(first, REFERENCE_PACK_NAMES.tradeGood))
        .toMatchObject({
          ...exactIdentity('tradeGoods', pack.tradeGoods[0]),
          category: 'tradeGoods',
          surfaces: [
            'economicState.customTradeEndpoints',
            'economicState.customTradeLabels',
          ],
        });
    },
  );

  it('leaves vanilla replay byte-identical before and after a custom run', () => {
    const matrixCase = MATRIX[3];
    const seed = 'reference-pack-vanilla-non-contamination';
    const vanillaBefore = generate(matrixCase, {}, seed);

    generate(matrixCase, identifiedCustomContentReferencePack(), seed);

    const vanillaAfter = generate(matrixCase, {}, seed);
    expect(JSON.stringify(vanillaAfter)).toBe(JSON.stringify(vanillaBefore));
  });

  it('holds the representative town invariants across 100 deterministic seeds', () => {
    const matrixCase = MATRIX[3];
    const pack = identifiedCustomContentReferencePack();
    const expectedIdentities = [
      exactIdentity('institutions', pack.institutions[0]),
      exactIdentity('resources', pack.resources[0]),
      exactIdentity('services', pack.services[0]),
      exactIdentity('tradeGoods', pack.tradeGoods[0]),
    ].sort(compareIdentityName);
    const dormantNames = [
      REFERENCE_PACK_NAMES.deity,
      REFERENCE_PACK_NAMES.faction,
      REFERENCE_PACK_NAMES.stressor,
      REFERENCE_PACK_NAMES.tradition,
    ];

    for (let index = 0; index < 100; index += 1) {
      const settlement = generate(
        matrixCase,
        pack,
        `reference-pack-town-corpus-${index}`,
      );

      expect(
        settlement.institutions.some(institution => (
          institution.name === REFERENCE_PACK_NAMES.institution
        )),
        `seed ${index}: essential institution`,
      ).toBe(true);
      expect(
        settlement.config.nearbyResourcesCustom,
        `seed ${index}: essential resource`,
      ).toContain(REFERENCE_PACK_NAMES.resource);
      expect(
        serviceNamed(settlement, REFERENCE_PACK_NAMES.service),
        `seed ${index}: critical service`,
      ).toBe(true);
      expect(
        settlement.economicState.customChains.every(chain => (
          chain.activation?.state === 'active'
          && chain.tradeEndpoints?.promoted === true
        )),
        `seed ${index}: confirmed chains active`,
      ).toBe(true);
      expect(
        exactMaterializedIdentities(settlement),
        `seed ${index}: exact materialized revisions`,
      ).toEqual(expectedIdentities);

      const settlementJson = JSON.stringify(settlement);
      for (const name of dormantNames) {
        // Anchored on the materialized institution name, which the assertions
        // above already prove is present in this settlement — so each dormant
        // name is measured against a payload that demonstrably carries pack names.
        expectAbsentWithAnchor(
          settlementJson,
          name,
          REFERENCE_PACK_NAMES.institution,
          `seed ${index}: dormant ${name}`,
        );
      }
    }
  }, 180_000);
});
