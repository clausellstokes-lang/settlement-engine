/**
 * Canonical GenerationContext / WorldLaw regression suite.
 *
 * These pins exercise policy at both levels: focused predicate contracts and
 * complete settlements produced by every tier. The named seeds reproduce the
 * concrete leaks found by the generation audit, so a later producer cannot
 * quietly restore the Wizard's tower, Hedge Witch, magical secret, divine
 * healing service, or wild-magic tension through a different path.
 */

import { describe, expect, it } from 'vitest';
import {
  createGenerationContext,
  createGenerationWorldLaw,
  textAssertsFunctionalMagic,
} from '../../src/generators/generationContext.js';
import { buildGenerationCoherenceReceipt } from '../../src/generators/generationCoherence.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

const TIERS = [
  'thorp',
  'hamlet',
  'village',
  'town',
  'city',
  'metropolis',
];

const MAGIC_INSTITUTION =
  /\b(?:arcane|airship|enchant|mage|magic|planar|sorcer|teleport|witch|wizard)\b/i;
const MAGIC_ROLE =
  /\b(?:archmage|artificer|druid|hedge witch|mage|magister|sorcerer|warlock|witch|wizard)\b/i;
const MAGIC_ASSERTION =
  /\b(?:arcane|curse|enchant|magic|magical|necroman|planar|scry|spell|teleport)\b/i;

function generatedServices(settlement) {
  return Object.entries(settlement.availableServices || {})
    .flatMap(([category, services]) => (
      (services || []).map(service => ({ category, service }))
    ));
}

function expectNoFunctionalMagic(settlement) {
  for (const institution of settlement.institutions || []) {
    expect(institution.name).not.toMatch(MAGIC_INSTITUTION);
  }
  for (const npc of settlement.npcs || []) {
    expect(`${npc.role || ''} ${npc.title || ''}`).not.toMatch(MAGIC_ROLE);
    expect(JSON.stringify(npc.secret || '')).not.toMatch(MAGIC_ASSERTION);
  }
  for (const { category, service } of generatedServices(settlement)) {
    expect(
      `${category} ${service.name || ''} ${service.desc || ''}`,
    ).not.toMatch(MAGIC_ASSERTION);
  }
  for (const event of [
    ...(settlement.history?.historicalEvents || []),
    ...(settlement.history?.currentTensions || []),
  ]) {
    expect([
      event.type,
      event.templateType,
    ]).not.toContain('magical_controversy');
    expect([
      event.type,
      event.templateType,
    ]).not.toContain('wild_magic');
  }
}

describe('GenerationContext immutability and precedence', () => {
  it('captures immutable resolved facts without freezing or retaining config', () => {
    const config = {
      magicExists: false,
      priorityMagic: 100,
      contentProfile: 'grounded',
    };
    const context = createGenerationContext({
      config,
      tier: 'city',
      tradeRoute: 'port',
      terrainType: 'coastal',
      cultureProfileId: 'latin',
    });

    expect(Object.isFrozen(context)).toBe(true);
    expect(Object.isFrozen(context.worldLaw)).toBe(true);
    expect(Object.isFrozen(
      context.worldLaw.generationContentProfile,
    )).toBe(true);
    expect(Object.isFrozen(
      context.worldLaw.generationContentProfile.boundaries,
    )).toBe(true);
    expect(Object.isFrozen(config)).toBe(false);
    expect(context).toMatchObject({
      tier: 'city',
      tradeRoute: 'port',
      terrainType: 'coastal',
      cultureProfileId: 'latin',
      contentProfileId: 'grounded',
    });
    expect(context.worldLaw.version).toBe(1);

    config.priorityMagic = 0;
    expect(context.worldLaw.magicPriority).toBe(100);
    expect(context.worldLaw.magicFunctions()).toBe(false);
    expect(context.worldLaw.supportsMaritime()).toBe(true);
    expect(context.worldLaw.supportsRiverTrade()).toBe(false);
  });

  it('makes either hard no-magic input dominate every permissive signal', () => {
    expect(createGenerationWorldLaw({
      magicExists: false,
      priorityMagic: 100,
    }).magicFunctions()).toBe(false);
    expect(createGenerationWorldLaw({
      magicExists: true,
      priorityMagic: 0,
    }).magicFunctions()).toBe(false);
    expect(createGenerationWorldLaw({
      magicExists: true,
      priorityMagic: 100,
    }).magicFunctions()).toBe(true);
  });

  it('distinguishes a riverside port from a maritime port', () => {
    const riverPort = createGenerationWorldLaw(
      { magicExists: true, priorityMagic: 50 },
      { tradeRoute: 'port', terrainType: 'riverside' },
    );
    const legacyPort = createGenerationWorldLaw(
      { magicExists: true, priorityMagic: 50 },
      { tradeRoute: 'port' },
    );

    expect(riverPort.portKind).toBe('river');
    expect(riverPort.supportsMaritime()).toBe(false);
    expect(riverPort.supportsRiverTrade()).toBe(true);
    expect(riverPort.allowsInstitution({ name: 'Major port' })).toBe(false);
    expect(riverPort.allowsInstitution({ name: 'Navy (if coastal)' })).toBe(false);
    expect(riverPort.allowsInstitution({ name: 'Docks/port facilities' })).toBe(true);
    expect(riverPort.allowsRole({
      role: 'Naval Commander',
      source: 'generated',
    })).toBe(false);
    expect(legacyPort.portKind).toBe('maritime');
    expect(legacyPort.supportsMaritime()).toBe(true);
  });
});

describe('WorldLaw eligibility predicates', () => {
  const deadMagic = createGenerationWorldLaw({
    magicExists: false,
    priorityMagic: 100,
    contentProfile: 'grounded',
  });

  it('closes institution, role, service, secret, and history magic paths', () => {
    expect(deadMagic.allowsInstitution({ name: "Wizard's tower" })).toBe(false);
    expect(deadMagic.allowsInstitution({ name: 'Public well' })).toBe(true);
    expect(deadMagic.allowsRole({ role: 'Hedge Witch', category: 'other' })).toBe(false);
    expect(deadMagic.allowsRole({
      role: 'High Priest',
      title: 'Druid',
      category: 'religious',
      source: 'generated',
    })).toBe(false);
    expect(deadMagic.allowsRole({ role: 'Healer', category: 'religious' })).toBe(true);
    expect(deadMagic.allowsService({
      name: 'Healing',
      desc: 'Divine healing magic, cure disease, remove curses.',
    })).toBe(false);
    expect(deadMagic.allowsService({
      name: 'Wound dressing',
      desc: 'Clean bandages and practiced hands.',
    })).toBe(true);
    expect(deadMagic.allowsSecret({
      secret: 'Has been using magic to alter memories.',
    })).toBe(false);
    expect(deadMagic.allowsHistoryEvent({ type: 'wild_magic' })).toBe(false);
    expect(deadMagic.allowsHistoryEvent({
      type: 'market_crash',
      description: 'Credit failed across the market.',
    })).toBe(true);
  });

  it('distinguishes explicit denials from affirmative magic claims', () => {
    expect(textAssertsFunctionalMagic(
      'Nothing magical here, only poultices and common herbs.',
    )).toBe(false);
    expect(textAssertsFunctionalMagic(
      'Where the alchemist deals in magical compounds and acid, this trade does not.',
    )).toBe(false);
    expect(textAssertsFunctionalMagic(
      'The hedge wizard teleports travelers across the valley.',
    )).toBe(true);
  });

  it('treats custom presentation labels as opaque unless metadata declares magic', () => {
    expect(deadMagic.allowsInstitution({
      name: "Wizard's Rest",
      source: 'custom',
      custom: true,
    })).toBe(true);
    expect(deadMagic.allowsInstitution({
      name: 'Quiet Research House',
      source: 'custom',
      custom: true,
      magical: true,
    })).toBe(false);

    const receipt = buildGenerationCoherenceReceipt({
      tier: 'town',
      config: {
        tradeRouteAccess: 'road',
        magicExists: false,
        priorityMagic: 0,
      },
      institutions: [{
        name: "Wizard's Rest",
        description: 'A family inn with an old-fashioned sign.',
        source: 'custom',
        custom: true,
      }],
      npcs: [],
      history: {},
      structuralViolations: [],
    });
    expect(
      receipt.checks.find(check => check.id === 'world_law_magic'),
    ).toMatchObject({
      status: 'pass',
      findings: [],
    });
  });

  it('composes generated-content boundaries with magic law', () => {
    const grounded = createGenerationWorldLaw({
      magicExists: true,
      priorityMagic: 50,
      contentProfile: 'grounded',
    });
    const grim = createGenerationWorldLaw({
      magicExists: true,
      priorityMagic: 50,
      contentProfile: 'grim',
    });
    const heroic = createGenerationWorldLaw({
      magicExists: true,
      priorityMagic: 50,
      contentProfile: 'heroic',
    });

    expect(grounded.allowsInstitution({ name: 'Slave market' })).toBe(false);
    expect(grounded.allowsRole('Slave trader')).toBe(false);
    expect(grounded.allowsService('Human trafficking brokerage')).toBe(false);
    expect(grounded.allowsService('Opium tincture')).toBe(true);
    expect(heroic.allowsService('Opium tincture')).toBe(false);
    expect(grim.allowsInstitution({ name: 'Slave market' })).toBe(true);
    expect(grim.allowsRole('Slave trader')).toBe(true);
    expect(grim.allowsService('Human trafficking brokerage')).toBe(true);
  });
});

describe('full-pipeline world-law enforcement', () => {
  const fixtures = [
    ['priority-zero-audit-2', { magicExists: true, priorityMagic: 0 }],
    ['world-law-audit-10', { magicExists: false, priorityMagic: 100 }],
    ['world-law-audit-11', { magicExists: false, priorityMagic: 100 }],
    ['world-law-audit-13', { magicExists: false, priorityMagic: 100 }],
    ['world-law-audit-44', { magicExists: false, priorityMagic: 100 }],
  ];

  it.each(fixtures)('closes the audited leak reproduced by %s', (seed, magic) => {
    const settlement = generateSettlementPipeline(
      {
        settType: seed.startsWith('priority-zero') ? 'city' : 'metropolis',
        culture: 'germanic',
        ...magic,
      },
      null,
      { seed, customContent: {} },
    );
    expectNoFunctionalMagic(settlement);
    expect(
      settlement.generationCoherenceReceipt.checks.find(
        check => check.id === 'world_law_magic',
      ),
    ).toMatchObject({
      status: 'pass',
      findings: [],
    });
  });

  it('holds across every tier and a deterministic seed corpus', () => {
    for (const tier of TIERS) {
      for (let index = 0; index < 8; index += 1) {
        const settlement = generateSettlementPipeline(
          {
            settType: tier,
            culture: 'germanic',
            magicExists: false,
            priorityMagic: 100,
          },
          null,
          {
            seed: `world-law-corpus-${tier}-${index}`,
            customContent: {},
          },
        );
        expectNoFunctionalMagic(settlement);
      }
    }
  });

  it('remains byte-deterministic after policy filtering', () => {
    const run = () => generateSettlementPipeline(
      {
        settType: 'metropolis',
        culture: 'germanic',
        magicExists: false,
        priorityMagic: 100,
      },
      null,
      { seed: 'world-law-byte-identity', customContent: {} },
    );
    expect(JSON.stringify(run())).toBe(JSON.stringify(run()));
  });

  it('never gives a riverside port maritime-only institutions', () => {
    for (let index = 0; index < 24; index += 1) {
      const settlement = generateSettlementPipeline(
        {
          settType: index % 2 ? 'city' : 'metropolis',
          culture: 'germanic',
          terrainOverride: 'riverside',
          tradeRouteAccess: 'port',
        },
        null,
        {
          seed: `river-port-world-law-${index}`,
          customContent: {},
        },
      );
      expect(
        settlement.institutions
          .map(({ name }) => name)
          .filter(name => /^(?:major port|navy \(if coastal\)|shipyard)$/i.test(name)),
      ).toEqual([]);
    }
  });

  it('keeps the audited river port river-specific through the final dossier', () => {
    const settlement = generateSettlementPipeline(
      {
        settType: 'city',
        culture: 'east_asian',
        terrainOverride: 'riverside',
        tradeRouteAccess: 'port',
        priorityEconomy: 90,
      },
      null,
      { seed: 'river-port-audit-0', customContent: {} },
    );

    expect(settlement.config.nearbyResources).toContain('river_fish');
    expect(settlement.config.nearbyResources).not.toEqual(
      expect.arrayContaining([
        'fishing_grounds',
        'deep_harbour',
        'shipbuilding_timber',
      ]),
    );
    expect(
      settlement.institutions
        .map(({ name }) => name)
        .filter(name => /^(?:major port|navy \(if coastal\)|shipyard)$/i.test(name)),
    ).toEqual([]);
    expect(settlement.settlementReason.join(' ')).toMatch(/river port|barges/i);
    expect(settlement.spatialLayout.tradeAccess).toBe(
      'Inland river port (wharves and barge docks)',
    );
    expect(
      settlement.spatialLayout.quarters.find(
        quarter => quarter.name === 'Waterfront District',
      ),
    ).toMatchObject({
      location: 'Along the river',
      desc: expect.stringMatching(/\b(?:barges|wharves|river traffic)\b/i),
    });
    expect(settlement.history.founding.initialChallenge).toMatch(
      /seasonal flooding|water rights|navigation hazards|river bandits/i,
    );
    expect(
      settlement.economicState.incomeSources.map(source => source.source),
    ).toContain('River Tolls');
    expect(
      settlement.economicState.incomeSources.map(source => source.source),
    ).not.toContain('Port Duties');
    expect(JSON.stringify({
      spatialLayout: settlement.spatialLayout,
      founding: settlement.history.founding,
      incomeSources: settlement.economicState.incomeSources,
      siegeNarrative: settlement.history.siegeNarrative,
    })).not.toMatch(
      /\b(?:maritime|naval|ocean-going|seagoing|seaport)\b|\bcoastal\s+(?:districts?|ports?|raids?|shipping|trade|waters?)\b|\bsea\s+(?:access|lanes?|power|raids?|supply|trade|traffic|voyages?)\b/i,
    );
    expect(settlement.generationCoherenceReceipt.status).toBe('coherent');
  });

  it('does not roll a magical node when the magic priority disables magic', () => {
    const settlement = generateSettlementPipeline(
      {
        settType: 'metropolis',
        culture: 'latin',
        terrainOverride: 'hills',
        tradeRouteAccess: 'port',
        monsterThreat: 'plagued',
        contentProfile: 'grim',
        magicExists: true,
        priorityMagic: 0,
        priorityEconomy: 0,
        priorityMilitary: 0,
        priorityReligion: 0,
        priorityCriminal: 0,
      },
      null,
      { seed: 'receipt-scan-101', customContent: {} },
    );

    expect(settlement.config.nearbyResources).not.toContain('magical_node');
    expect(settlement.generationCoherenceReceipt.status).toBe('coherent');
  });

  it('keeps generated faction conflicts mundane when world law disables magic', () => {
    const fixtures = [
      [
        {
          settType: 'city',
          culture: 'norse',
          terrainOverride: 'plains',
          tradeRouteAccess: 'port',
          monsterThreat: 'heartland',
          contentProfile: 'grounded',
          magicExists: false,
          priorityMagic: 100,
          priorityEconomy: 56,
          priorityMilitary: 80,
          priorityReligion: 88,
          priorityCriminal: 18,
        },
        'semantic-probe-22',
      ],
      [
        {
          settType: 'city',
          culture: 'greek',
          terrainOverride: 'mountain',
          tradeRouteAccess: 'road',
          monsterThreat: 'frontier',
          contentProfile: 'grim',
          magicExists: false,
          priorityMagic: 100,
          priorityEconomy: 83,
          priorityMilitary: 42,
          priorityReligion: 94,
          priorityCriminal: 53,
        },
        'semantic-probe-334',
      ],
    ];

    for (const [config, seed] of fixtures) {
      const settlement = generateSettlementPipeline(
        config,
        null,
        { seed, customContent: {} },
      );
      const conflictProse = JSON.stringify(
        settlement.powerStructure.conflicts || [],
      );

      expect(conflictProse).not.toMatch(
        /arcane research permit|magical autonomy/i,
      );
      expect(
        settlement.generationCoherenceReceipt.checks.find(
          check => check.id === 'world_law_magic',
        ),
      ).toMatchObject({
        status: 'pass',
        findings: [],
      });
    }
  });

  it('filters audited generated role and cultural-title leaks', () => {
    const riverSettlement = generateSettlementPipeline(
      {
        settType: 'metropolis',
        culture: 'norse',
        terrainOverride: 'riverside',
        tradeRouteAccess: 'isolated',
        monsterThreat: 'plagued',
        contentProfile: 'grounded',
        magicExists: true,
        priorityMagic: 90,
        priorityEconomy: 18,
        priorityMilitary: 41,
        priorityReligion: 63,
        priorityCriminal: 12,
      },
      null,
      { seed: 'generation-certification-5', customContent: {} },
    );
    const mundaneSettlement = generateSettlementPipeline(
      {
        settType: 'metropolis',
        culture: 'celtic',
        terrainOverride: 'hills',
        tradeRouteAccess: 'none',
        monsterThreat: 'heartland',
        contentProfile: 'grim',
        magicExists: true,
        priorityMagic: 0,
        priorityEconomy: 22,
        priorityMilitary: 29,
        priorityReligion: 51,
        priorityCriminal: 52,
      },
      null,
      { seed: 'generation-certification-11', customContent: {} },
    );

    expect(riverSettlement.npcs.map(npc => npc.role)).not.toContain(
      'Naval Commander',
    );
    expect(mundaneSettlement.npcs.map(npc => npc.title)).not.toContain(
      'Druid',
    );
    expect(riverSettlement.generationCoherenceReceipt.status).toBe('coherent');
    expect(mundaneSettlement.generationCoherenceReceipt.status).toBe('coherent');
  });
});

describe('final coherence receipt coverage', () => {
  const forbiddenClaimBranches = [
    ['powerStructure', { powerStructure: { recentConflict: 'A wizard teleports supplies.' } }],
    ['relationships', { relationships: [{ description: 'A wizard enforces this pact.' }] }],
    ['stressors', { stressors: [{ summary: 'A magical curse grips the district.' }] }],
    ['spatialLayout', { spatialLayout: { summary: 'A teleportation circle anchors the ward.' } }],
    ['culturalNotes', { culturalNotes: 'Arcane wards define local status.' }],
    ['activeConditions', { activeConditions: [{ summary: 'Magic sustains the harvest.' }] }],
    ['defenseProfile', { defenseProfile: { summary: 'A wizard maintains the walls.' } }],
    ['neighborRelationship', { neighborRelationship: { summary: 'Spell trade binds both towns.' } }],
  ];

  it.each(forbiddenClaimBranches)(
    'audits generated presentation claims in %s',
    (_branch, projection) => {
      const receipt = buildGenerationCoherenceReceipt({
        tier: 'town',
        config: {
          tradeRouteAccess: 'road',
          terrainType: 'plains',
          magicExists: false,
          priorityMagic: 0,
        },
        institutions: [],
        npcs: [],
        history: {},
        structuralViolations: [],
        ...projection,
      });

      expect(
        receipt.checks.find(check => check.id === 'world_law_magic'),
      ).toMatchObject({
        status: 'fail',
        findings: [expect.any(Object)],
      });
    },
  );

  it('does not treat validator guidance or profile alternatives as local claims', () => {
    const receipt = buildGenerationCoherenceReceipt({
      tier: 'town',
      config: {
        tradeRouteAccess: 'isolated',
        terrainType: 'mountain',
        magicExists: false,
        priorityMagic: 0,
      },
      institutions: [{
        name: 'Herbalist',
        desc: 'Nothing magical here; these are ordinary roots and poultices.',
      }],
      npcs: [],
      history: {},
      culturalIdentity: {
        scope: 'A maritime or upland design vocabulary.',
        exchangePattern: 'Maritime trade where geography permits.',
        defensePattern: 'Naval assets where relevant, otherwise local levies.',
      },
      structuralViolations: [{
        severity: 'by_design',
        reason: 'Functional magical transit does not cover the isolation gap.',
      }],
      structuralSuggestions: [
        'Use magical transit only in a functional high-magic setting.',
      ],
    });

    expect(
      receipt.checks.find(check => check.id === 'world_law_magic'),
    ).toMatchObject({
      status: 'pass',
      findings: [],
    });
  });
});
