/**
 * Canonical adversarial reference pack for custom-content integration tests.
 *
 * This fixture is intentionally small but constitutional: it contains one
 * admitted definition in every authorable bucket, crosses every live
 * settlement dependency gate, and gives materialized definitions immutable
 * revision identity. Tests should extend this pack when a new authorable
 * bucket is added instead of inventing a disconnected happy-path fixture.
 *
 * The settlement-bearing definitions begin at town tier. The living-content
 * definitions deliberately have no automatic activation event: their presence
 * in a reviewed environment must not make a generated settlement silently
 * adopt a deity, faction, stressor, or tradition.
 */

import {
  contentRevisionHash,
} from '../../src/domain/content/customContentVersioning.js';
import {
  confirmCustomSupplyChainReview,
} from '../../src/domain/content/customSupplyChainReview.js';
import {
  inferSupplyChains,
} from '../../src/domain/inferSupplyChains.js';

export const REFERENCE_PACK_NAMES = Object.freeze({
  institution: 'Aurora Provisioners',
  absorbedInstitution: 'Aurora Cart Shed',
  service: 'Aurora Rationing Office',
  resource: 'Aurora Grain',
  stressor: 'Aurora Ashfall',
  tradeGood: 'Aurora Field Rations',
  faction: 'Aurora Compact',
  deity: 'Aurora of the Kept Oath',
  tradition: 'Aurora First Furrow',
});

const REFERENCE_PACK = {
  institutions: [
    {
      localUid: 'reference-aurora-provisioners',
      name: REFERENCE_PACK_NAMES.institution,
      category: 'economic',
      tags: ['trade', 'food'],
      essential: true,
      foodImpact: 'produces',
      economicWeight: 'backbone',
      satisfies: 'military',
      description: 'A chartered granary, kitchen, and field-logistics hall.',
      tierMin: 'town',
      tierMax: 'metropolis',
      produces: ['custom:reference-aurora-rationing-office'],
      requires: ['custom:reference-aurora-grain'],
      subsumes: ['custom:reference-aurora-cart-shed'],
    },
    {
      localUid: 'reference-aurora-cart-shed',
      name: REFERENCE_PACK_NAMES.absorbedInstitution,
      category: 'infrastructure',
      description: 'A smaller hauling office represented by the provisioners.',
      tierMin: 'town',
      tierMax: 'metropolis',
    },
  ],
  services: [
    {
      localUid: 'reference-aurora-rationing-office',
      name: REFERENCE_PACK_NAMES.service,
      category: 'economic',
      criticality: 'critical',
      foodImpact: 'consumes',
      description: 'Plans emergency allotments and military victuals.',
      tierMin: 'town',
      tierMax: 'metropolis',
      providedBy: 'custom:reference-aurora-provisioners',
      requires: ['custom:reference-aurora-grain'],
    },
  ],
  resources: [
    {
      localUid: 'reference-aurora-grain',
      name: REFERENCE_PACK_NAMES.resource,
      category: 'agricultural',
      criticality: 'critical',
      essential: true,
      foodImpact: 'produces',
      commodities: ['amber grain'],
      description: 'A cold-resistant grain cultivated under the charter.',
      tierMin: 'town',
      tierMax: 'metropolis',
      yields: ['custom:reference-aurora-field-rations'],
      enables: ['custom:reference-aurora-provisioners'],
    },
  ],
  stressors: [
    {
      localUid: 'reference-aurora-ashfall',
      name: REFERENCE_PACK_NAMES.stressor,
      description: 'A reviewed narrative stressor that requires an authored event.',
      severity: 'severe',
      affects: ['economy', 'supply chains'],
      disablesInstitutions: ['custom:reference-aurora-provisioners'],
      disablesGoods: ['custom:reference-aurora-field-rations'],
    },
  ],
  tradeGoods: [
    {
      localUid: 'reference-aurora-field-rations',
      name: REFERENCE_PACK_NAMES.tradeGood,
      category: 'food_processed',
      criticality: 'important',
      economicWeight: 'backbone',
      foodImpact: 'consumes',
      satisfies: 'military',
      description: 'Shelf-stable rations packed for patrols and caravans.',
      requiredInstitution: 'custom:reference-aurora-provisioners',
      requiredResources: ['custom:reference-aurora-grain'],
    },
  ],
  factions: [
    {
      localUid: 'reference-aurora-compact',
      name: REFERENCE_PACK_NAMES.faction,
      authority: 'economic',
      archetype: 'Quartermasters and tenant delegates',
      agenda: 'Keep the grain charter accountable to the settlements it feeds.',
      scale: 'significant',
      methods: 'Audits, bargaining, and public ration ledgers.',
      description: 'A reviewed faction definition that enters play through events.',
      controls: ['custom:reference-aurora-provisioners'],
    },
  ],
  deities: [
    {
      localUid: 'reference-aurora-kept-oath',
      name: REFERENCE_PACK_NAMES.deity,
      alignmentAxis: 'good',
      temperamentAxis: 'peacelike',
      lawAxis: 'lawful',
      rankAxis: 'minor',
      portfolio: 'Granaries, measured promises, and winter stores',
      domain: 'Provision and sworn stewardship',
    },
  ],
  traditions: [
    {
      localUid: 'reference-aurora-first-furrow',
      name: REFERENCE_PACK_NAMES.tradition,
      motifElement: 'harvest',
      motifAct: 'procession',
      epithet: 'the first furrow is cut before the charter is read',
    },
  ],
};

/** Deep-clone the raw authoring graph so individual tests may mutate safely. */
export function customContentReferencePack() {
  return structuredClone(REFERENCE_PACK);
}

/**
 * Add the immutable identity carried by admitted runtime revisions.
 *
 * The hash covers authorable meaning before persistence identity is attached;
 * this mirrors a revision whose content hash identifies its reviewed body.
 */
export function identifyCustomContentPack(source) {
  const pack = structuredClone(source);
  for (const [bucket, definitions] of Object.entries(pack)) {
    for (const definition of definitions) {
      const identityStem = `${bucket}:${definition.localUid}`;
      Object.assign(definition, {
        definitionId: `definition:${identityStem}`,
        revisionId: `revision:${identityStem}:1`,
        revisionNumber: 1,
        contentHash: contentRevisionHash(bucket, definition),
      });
    }
  }
  return pack;
}

export function identifiedCustomContentReferencePack() {
  const pack = identifyCustomContentPack(customContentReferencePack());
  // Inference is deliberately generous and review remains authoritative. The
  // absorbed cart shed is a representation relationship, not an operating
  // supply-chain component, so the canonical reviewer confirms only paths
  // rooted in the actual grain input.
  const supplyChains = inferSupplyChains(pack)
    .filter(chain => (
      chain.discovered?.nodes?.some(node => (
        node.refId === 'custom:reference-aurora-grain'
      ))
      && !chain.discovered?.nodes?.some(node => (
        node.refId === 'custom:reference-aurora-cart-shed'
      ))
      && chain.discovered?.nodes?.[
        chain.discovered.nodes.length - 1
      ]?.refId === 'custom:reference-aurora-field-rations'
    ))
    .map(chain => confirmCustomSupplyChainReview({
      ...chain,
      outputs: [REFERENCE_PACK_NAMES.tradeGood],
      exportable: true,
      discovered: {
        ...chain.discovered,
        tradeEndpoints: {
          imports: [],
          exports: [{ label: REFERENCE_PACK_NAMES.tradeGood }],
        },
      },
    }));
  if (supplyChains.length === 0) {
    throw new Error(
      'The canonical reference pack must retain at least one reviewable supply chain.',
    );
  }
  return { ...pack, supplyChains };
}
