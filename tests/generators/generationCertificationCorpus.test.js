/**
 * Seeded experiential certification for the complete generated dossier.
 *
 * Unit tests protect individual contracts, but the original generation audit
 * found defects in the joins between otherwise-correct systems. This cohort
 * deliberately crosses every tier, culture, route family, threat posture,
 * content profile, and magic regime. The final coherence receipt is the oracle:
 * ordinary generation must ship with every cross-system check green, while
 * explicit unusual premises may be coherent with clearly-labelled tensions.
 *
 * The 55 profile specimens plus ten exact population boundaries reproduce the
 * shape of the audit cohort. The receipt is one input to certification, not its
 * own proof: independent assertions below verify reference integrity, unique
 * identities, chronology, and percentage conservation directly from the final
 * dossier. One specimen from each profile is replayed in full to retain
 * byte-level determinism as a separate guarantee.
 */

import { describe, expect, it } from 'vitest';
import {
  POPULATION_RANGES,
  popToTier,
} from '../../src/data/constants.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

const FORMAL_JUDGMENT_IDS = Object.freeze([
  'hard_structural_validity',
  'cross_system_semantic_agreement',
  'user_intent_fulfillment',
  'narrative_realization',
  'dramatic_tension',
  'diversity_and_repetition',
  'confidence_and_provenance',
]);

const PROFILE_SEEDS = Object.freeze([
  'alder',
  'bracken',
  'cinder',
  'dun',
  'ember',
]);

const PROFILES = Object.freeze([
  {
    id: 'subsistence-thorp',
    config: {
      settType: 'thorp',
      culture: 'germanic',
      terrainOverride: 'plains',
      tradeRouteAccess: 'road',
      magicExists: false,
      priorityMagic: 0,
      priorityEconomy: 20,
      priorityMilitary: 35,
    },
  },
  {
    id: 'frontier-hamlet',
    config: {
      settType: 'hamlet',
      culture: 'celtic',
      terrainOverride: 'forest',
      tradeRouteAccess: 'road',
      monsterThreat: 'frontier',
      priorityMilitary: 80,
    },
  },
  {
    id: 'religious-river-village',
    config: {
      settType: 'village',
      culture: 'slavic',
      terrainOverride: 'riverside',
      tradeRouteAccess: 'river',
      priorityReligion: 90,
    },
  },
  {
    id: 'magical-desert-village',
    config: {
      settType: 'village',
      culture: 'arabic',
      terrainOverride: 'desert',
      tradeRouteAccess: 'road',
      magicExists: true,
      priorityMagic: 90,
    },
  },
  {
    id: 'mercantile-seaport-town',
    config: {
      settType: 'town',
      culture: 'latin',
      terrainOverride: 'coastal',
      tradeRouteAccess: 'port',
      priorityEconomy: 90,
    },
  },
  {
    id: 'criminal-crossroads-town',
    config: {
      settType: 'town',
      culture: 'steppe',
      terrainOverride: 'plains',
      tradeRouteAccess: 'crossroads',
      priorityCriminal: 90,
    },
  },
  {
    id: 'isolated-arcane-town',
    config: {
      settType: 'town',
      culture: 'greek',
      terrainOverride: 'mountain',
      tradeRouteAccess: 'isolated',
      magicExists: true,
      priorityMagic: 90,
    },
  },
  {
    id: 'plagued-martial-city',
    config: {
      settType: 'city',
      culture: 'norse',
      terrainOverride: 'hills',
      tradeRouteAccess: 'road',
      monsterThreat: 'plagued',
      priorityMilitary: 5,
      contentProfile: 'heroic',
    },
  },
  {
    id: 'mundane-river-port-city',
    config: {
      settType: 'city',
      culture: 'east_asian',
      terrainOverride: 'riverside',
      tradeRouteAccess: 'port',
      magicExists: false,
      priorityMagic: 100,
    },
  },
  {
    id: 'commercial-metropolis',
    config: {
      settType: 'metropolis',
      culture: 'south_asian',
      terrainOverride: 'plains',
      tradeRouteAccess: 'crossroads',
      priorityEconomy: 95,
      contentProfile: 'grounded',
    },
  },
  {
    id: 'grim-seaport-metropolis',
    config: {
      settType: 'metropolis',
      culture: 'mesoamerican',
      terrainOverride: 'coastal',
      tradeRouteAccess: 'port',
      priorityMilitary: 85,
      priorityCriminal: 80,
      contentProfile: 'grim',
    },
  },
]);

const POPULATION_BOUNDARIES = Object.freeze([
  [60, 'thorp'],
  [61, 'hamlet'],
  [400, 'hamlet'],
  [401, 'village'],
  [900, 'village'],
  [901, 'town'],
  [5000, 'town'],
  [5001, 'city'],
  [25000, 'city'],
  [25001, 'metropolis'],
]);

function generate(config, seed) {
  return generateSettlementPipeline(config, null, {
    seed,
    customContent: {},
  });
}

function expectFiniteNumbers(value, path = 'settlement') {
  if (typeof value === 'number') {
    expect(Number.isFinite(value), `${path} is non-finite`).toBe(true);
    return;
  }
  if (!value || typeof value !== 'object') return;
  if (Array.isArray(value)) {
    value.forEach((entry, index) => (
      expectFiniteNumbers(entry, `${path}[${index}]`)
    ));
    return;
  }
  for (const [key, child] of Object.entries(value)) {
    expectFiniteNumbers(child, `${path}.${key}`);
  }
}

function normalizedIdentity(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

/**
 * Independent final-dossier invariants.
 *
 * Do not replace these with assertions against generationCoherenceReceipt.
 * They intentionally observe the persisted graph directly, so a defect in the
 * receipt cannot certify the same defect in the generated settlement.
 */
function expectIndependentIntegrity(settlement, label) {
  const institutions = settlement.institutions || [];
  const institutionNames = institutions
    .map(institution => normalizedIdentity(institution?.name))
    .filter(Boolean);
  expect(
    new Set(institutionNames).size,
    `${label} contains duplicate generated institutions`,
  ).toBe(institutionNames.length);

  const npcs = settlement.npcs || [];
  const npcIds = npcs.map(npc => npc?.id).filter(Boolean);
  const npcNames = npcs
    .map(npc => normalizedIdentity(npc?.name))
    .filter(Boolean);
  expect(new Set(npcIds).size, `${label} contains duplicate NPC ids`).toBe(npcIds.length);
  expect(
    new Set(npcNames).size,
    `${label} contains duplicate NPC display names`,
  ).toBe(npcNames.length);

  const npcById = new Map(npcs.map(npc => [npc?.id, npc]));
  for (const [index, relationship] of (
    settlement.relationships || []
  ).entries()) {
    const first = npcById.get(relationship?.npc1Id);
    const second = npcById.get(relationship?.npc2Id);
    expect(first, `${label} relationship[${index}] has no first NPC`).toBeTruthy();
    expect(second, `${label} relationship[${index}] has no second NPC`).toBeTruthy();
    expect(
      normalizedIdentity(relationship?.npc1Name),
      `${label} relationship[${index}] first name drifted from its NPC`,
    ).toBe(normalizedIdentity(first?.name));
    expect(
      normalizedIdentity(relationship?.npc2Name),
      `${label} relationship[${index}] second name drifted from its NPC`,
    ).toBe(normalizedIdentity(second?.name));
  }

  const prominent = settlement.prominentRelationship;
  if (prominent) {
    const canonicalNames = new Set(npcs.map(npc => normalizedIdentity(npc?.name)));
    expect(
      canonicalNames.has(normalizedIdentity(prominent.npc1)),
      `${label} prominent relationship has no first NPC`,
    ).toBe(true);
    expect(
      canonicalNames.has(normalizedIdentity(prominent.npc2)),
      `${label} prominent relationship has no second NPC`,
    ).toBe(true);
  }

  const powerFactions = settlement.powerStructure?.factions || [];
  const powerFactionNames = powerFactions
    .map(faction => faction?.faction)
    .filter(Boolean);
  expect(
    new Set(powerFactionNames).size,
    `${label} contains duplicate power factions`,
  ).toBe(powerFactionNames.length);
  if (powerFactions.length) {
    expect(
      powerFactions.reduce(
        (sum, faction) => sum + (Number(faction?.power) || 0),
        0,
      ),
      `${label} faction power is not conserved`,
    ).toBe(100);
  }

  const powerFactionSet = new Set(powerFactionNames);
  for (const npc of npcs) {
    if (!npc?.factionAffiliation) continue;
    expect(
      powerFactionSet.has(npc.factionAffiliation),
      `${label} NPC ${npc.id} references a missing power faction`,
    ).toBe(true);
  }

  const narrativeFactions = settlement.factions || [];
  const narrativeFactionNames = narrativeFactions
    .map(faction => faction?.name)
    .filter(Boolean);
  expect(
    new Set(narrativeFactionNames).size,
    `${label} contains duplicate narrative factions`,
  ).toBe(narrativeFactionNames.length);

  const narrativeFactionSet = new Set(narrativeFactionNames);
  for (const [index, faction] of narrativeFactions.entries()) {
    for (const member of faction?.members || []) {
      expect(
        npcById.has(member?.id),
        `${label} faction[${index}] references a missing NPC`,
      ).toBe(true);
    }
  }
  for (const [index, conflict] of (settlement.conflicts || []).entries()) {
    for (const party of conflict?.parties || []) {
      expect(
        narrativeFactionSet.has(party),
        `${label} conflict[${index}] references a missing narrative faction`,
      ).toBe(true);
    }
  }

  const events = settlement.history?.historicalEvents || [];
  for (let index = 0; index < events.length; index += 1) {
    expect(
      Number(events[index]?.yearsAgo),
      `${label} history[${index}] has an invalid date`,
    ).toBeGreaterThanOrEqual(0);
    if (index === 0) continue;
    expect(
      Number(events[index - 1]?.yearsAgo),
      `${label} history is not ordered oldest to newest`,
    ).toBeGreaterThanOrEqual(Number(events[index]?.yearsAgo));
  }

  const incomeSources = settlement.economicState?.incomeSources || [];
  if (incomeSources.length) {
    expect(
      incomeSources.reduce(
        (sum, source) => sum + (Number(source?.percentage) || 0),
        0,
      ),
      `${label} income shares are not conserved`,
    ).toBe(100);
  }
}

function expectCertified(settlement, label) {
  const receipt = settlement.generationCoherenceReceipt;
  expect(receipt, `${label} has no generation receipt`).toBeTruthy();
  expect(receipt.status, `${label} needs manual review`).not.toBe('needs_review');
  for (const check of receipt.checks) {
    expect(check.findings, `${label}: ${check.id}`).toEqual([]);
    expect(check.status, `${label}: ${check.id}`).toBe('pass');
  }
  expect(
    receipt.judgments?.map(judgment => judgment.id),
    `${label} formal judgment contract`,
  ).toEqual(FORMAL_JUDGMENT_IDS);
  for (const judgment of receipt.judgments) {
    expect(
      judgment.status,
      `${label}: ${judgment.id}`,
    ).not.toBe('needs_review');
    expect(
      judgment.evidence?.length,
      `${label}: ${judgment.id} has no evidence`,
    ).toBeGreaterThan(0);
  }

  const range = POPULATION_RANGES[settlement.tier];
  expect(
    settlement.population,
    `${label} population outside ${settlement.tier}`,
  ).toBeGreaterThanOrEqual(range.min);
  expect(
    settlement.population,
    `${label} population outside ${settlement.tier}`,
  ).toBeLessThanOrEqual(range.max);
  expectFiniteNumbers(settlement);
  expectIndependentIntegrity(settlement, label);
}

function expectHighPriorityVisible(settlement, profileId) {
  const institutionText = (settlement.institutions || [])
    .map(institution => `${institution.category || ''} ${institution.name || ''}`)
    .join(' ');
  const priorityReceipts = [
    ...(settlement.economicViability?.issues || []),
    ...(settlement.economicViability?.warnings || []),
    ...(settlement.economicViability?.dependencies || []),
  ];
  if (profileId === 'religious-river-village') {
    const hasReligiousInstitution = /\breligious|church|temple|shrine|chapel|monastery\b/i
      .test(institutionText);
    const hasReligionReceipt = priorityReceipts.some(
      item => item.category === 'Religious Priorities',
    );
    expect(
      hasReligiousInstitution || hasReligionReceipt,
      'high religion priority is neither realized nor explained',
    ).toBe(true);
  }
  if (profileId === 'magical-desert-village') {
    const hasMagicInstitution = /\bmagic|arcane|wizard|mage|alchemist|enchant\b/i
      .test(institutionText);
    const hasMagicReceipt = priorityReceipts.some(
      item => item.category === 'Magical Priorities',
    );
    expect(
      hasMagicInstitution || hasMagicReceipt,
      'high magic priority is neither realized nor explained',
    ).toBe(true);
  }
}

describe('seeded generation certification cohort', () => {
  it('certifies 55 deliberately different whole-settlement specimens', () => {
    const names = new Set();
    let generated = 0;

    for (const profile of PROFILES) {
      for (const seed of PROFILE_SEEDS) {
        const specimenSeed = `certification-v1-${profile.id}-${seed}`;
        const settlement = generate(profile.config, specimenSeed);
        expectCertified(settlement, specimenSeed);
        expectHighPriorityVisible(settlement, profile.id);
        names.add(settlement.name);
        generated += 1;
      }
    }

    expect(generated).toBe(55);
    expect(names.size).toBeGreaterThanOrEqual(50);
  }, 60_000);

  it('replays one complete specimen from every profile byte-for-byte', () => {
    for (const profile of PROFILES) {
      const seed = `certification-v1-replay-${profile.id}`;
      expect(JSON.stringify(generate(profile.config, seed))).toBe(
        JSON.stringify(generate(profile.config, seed)),
      );
    }
  }, 60_000);

  it.each(POPULATION_BOUNDARIES)(
    'maps exact population boundary %i to %s',
    (population, tier) => {
      const settlement = generate(
        {
          settType: 'custom',
          population,
          culture: 'germanic',
          terrainOverride: 'plains',
          tradeRouteAccess: 'road',
        },
        `certification-v1-boundary-${population}`,
      );

      expect(popToTier(population)).toBe(tier);
      expect(settlement.tier).toBe(tier);
      expect(settlement.population).toBe(population);
      expectCertified(settlement, `population-${population}`);
    },
  );
});
