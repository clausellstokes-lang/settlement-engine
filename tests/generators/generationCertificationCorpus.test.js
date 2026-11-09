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
  'record_coherence_battery',
]);

/**
 * THE EIGHTH JUDGMENT IS ADVISORY (the chair's ruling on lane SELF-VOUCH, 2026-11-04):
 * `record_coherence_battery` reads the coherence battery over the stored record, and the
 * receipt's overall status does not follow it. The seven original judgments are held to
 * "not needs_review" exactly as before; the eighth's failures are PINNED BY IDENTITY below
 * (an instrument, not an allowance), so a specimen that starts or stops failing moves the pin.
 */
const ADVISORY_JUDGMENT = 'record_coherence_battery';
/** specimen label → the advisory judgment's status, filled as the specimens certify. */
const ADVISORY_STATUS = new Map();
/** The specimens whose advisory judgment fails today: 65 of 65, RE-KEYED 2026-11-04 on the window
 *  branch (lane/window-rung1-2026-11-04, the chair's follow-up (b)). Was 62 of 65. Causes: X-46's bands
 *  moved POPULATION_BOUNDARIES (ten boundary labels changed: 60/61, 400/401, 900/901, 5000/5001,
 *  25000/25001 became 24/25, 87/88, 349/350, 2249/2250, 14999/15000), and the composed lanes plus the
 *  kind-7 judgment (I5) made three more specimens fail (criminal-crossroads-town-dun,
 *  isolated-arcane-town-cinder, mercantile-seaport-town-dun). See the pin's own comment for the cause.
 *  RE-KEYED 2026-11-06 (LANDING-7 lane E, third seat): 65 -> 60 of 65. FIVE SPECIMENS STOPPED FAILING, the
 *  direction the ladder drives this list; nothing started. Bisected on the first-parent line from the last
 *  re-key 09fe09b8d (git bisect --first-parent, one run per specimen, each flip monotone):
 *    ff4448d2e (the rung-1 TRUTH compose)            religious-river-village-dun
 *    11467ed57 (the rung-1 PINS compose)              isolated-arcane-town-alder
 *    5e9ffb220 (the F1 DEFENCE-WORDS compose)         criminal-crossroads-town-dun,
 *                                                     isolated-arcane-town-cinder, mundane-river-port-city-bracken
 *  RE-KEYED 2026-11-07 (LANDING-R2, the pool census composed): 60 -> 59 of 65. ONE SPECIMEN STOPPED FAILING,
 *  nothing started: isolated-arcane-town-dun, at 1abf16d8d (census-4d unit 2c, R-W: the bowyers' "Military
 *  supply" presumes a guard, not garrison AND militia). Bisected by a probe copy of this pin: rung 1's final
 *  1bff51c6d and the merge base bf263a78d fail it; the compose's census-1b merge 0856c09d3 does not; inside
 *  census-1b's first-parent line the flip is the census-4 merge fe7bb1d4a, and on census-4's side
 *  fa39513d3 fails it, 1abf16d8d does not. */
/* RE-KEYED 2026-11-07 (PEOPLE-1 CAST, the people car's lane 1): 60 -> 59 of 65, MEASURED at the lane's tip. The cast
 * replaces the rung roster and the battery over the stored record reads a different cast: criminal-crossroads-town-alder,
 * -cinder, isolated-arcane-town-ember, mercantile-seaport-town-cinder and religious-river-village-cinder STOPPED
 * failing; criminal-crossroads-town-dun, isolated-arcane-town-alder and -cinder and religious-river-village-dun STARTED
 * (the advisory judgment, not the overall status: every specimen still certifies). Not bisected per specimen: one
 * cause, the cast (R-P2) with its mints born beside it (R-P4), the mundane draw of a magic-category face where magic
 * does not function, and the pressure line's noun without its article (M-1b) — the battery reads that prose. */
/* RE-KEYED 2026-11-09 (ALLEGIANCE-CAR4, 03ff59084 THE GOALS REBUILT): 59 -> 52 of 65, MEASURED at the car's tip.
 * SEVEN SPECIMENS STOPPED FAILING, nothing started: criminal-crossroads-town-dun, isolated-arcane-town-alder, -bracken,
 * -cinder, mercantile-seaport-town-bracken, -dun, plagued-martial-city-ember. Read at the base f6209c0c5, each one's
 * ONLY battery finding was the same `battery.defense-words` "hospital without a hospital" on the goal line "Found an
 * institution (a hospital, a school) that will outlast them by centuries" — a row of the retired role pool
 * (npcData.js :: NPC_FACTION_GOALS); A9 draws every card's goal from the families its record supports, so the line is no
 * longer printed. The direction the ladder drives this list. */
const ADVISORY_FAILING = Object.freeze([
  'certification-v1-commercial-metropolis-alder',
  'certification-v1-commercial-metropolis-bracken',
  'certification-v1-commercial-metropolis-cinder',
  'certification-v1-commercial-metropolis-dun',
  'certification-v1-commercial-metropolis-ember',
  'certification-v1-criminal-crossroads-town-bracken',
  'certification-v1-criminal-crossroads-town-ember',
  'certification-v1-frontier-hamlet-alder',
  'certification-v1-frontier-hamlet-bracken',
  'certification-v1-frontier-hamlet-cinder',
  'certification-v1-frontier-hamlet-dun',
  'certification-v1-frontier-hamlet-ember',
  'certification-v1-grim-seaport-metropolis-alder',
  'certification-v1-grim-seaport-metropolis-bracken',
  'certification-v1-grim-seaport-metropolis-cinder',
  'certification-v1-grim-seaport-metropolis-dun',
  'certification-v1-grim-seaport-metropolis-ember',
  'certification-v1-isolated-arcane-town-dun',
  'certification-v1-magical-desert-village-alder',
  'certification-v1-magical-desert-village-bracken',
  'certification-v1-magical-desert-village-cinder',
  'certification-v1-magical-desert-village-dun',
  'certification-v1-magical-desert-village-ember',
  'certification-v1-mercantile-seaport-town-alder',
  'certification-v1-mercantile-seaport-town-ember',
  'certification-v1-mundane-river-port-city-alder',
  'certification-v1-mundane-river-port-city-cinder',
  'certification-v1-mundane-river-port-city-dun',
  'certification-v1-mundane-river-port-city-ember',
  'certification-v1-plagued-martial-city-alder',
  'certification-v1-plagued-martial-city-bracken',
  'certification-v1-plagued-martial-city-cinder',
  'certification-v1-plagued-martial-city-dun',
  'certification-v1-religious-river-village-alder',
  'certification-v1-religious-river-village-bracken',
  'certification-v1-religious-river-village-dun',
  'certification-v1-religious-river-village-ember',
  'certification-v1-subsistence-thorp-alder',
  'certification-v1-subsistence-thorp-bracken',
  'certification-v1-subsistence-thorp-cinder',
  'certification-v1-subsistence-thorp-dun',
  'certification-v1-subsistence-thorp-ember',
  'population-14999',
  'population-15000',
  'population-2249',
  'population-2250',
  'population-24',
  'population-25',
  'population-349',
  'population-350',
  'population-87',
  'population-88',
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

// X-46 THE HISTORICAL SCALE, car 1 (ODQ §934.104): the stamp's cut points 25 / 88 / 350 /
// 2,250 / 15,000 (src/data/constants.js :: TIER_STAMP_CUTS), each population either side of one.
const POPULATION_BOUNDARIES = Object.freeze([
  [24, 'thorp'],
  [25, 'hamlet'],
  [87, 'hamlet'],
  [88, 'village'],
  [349, 'village'],
  [350, 'town'],
  [2249, 'town'],
  [2250, 'city'],
  [14999, 'city'],
  [15000, 'metropolis'],
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
    // RE-KEYED 2026-11-07 (PEOPLE-4 TIES, R-P7): a tie's ends are `from`/`to` (directed).
    const first = npcById.get(relationship?.from);
    const second = npcById.get(relationship?.to);
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

  // PEOPLE-LAND re-key, cause M-7 (the v2 boundary, PEOPLE_5B_EDIT §9 item 1), as
  // scripts/audit/generation-certification-soak.mjs already reads it: a card's power is a MEMBERSHIP naming a
  // power on the roster (the per-NPC `factionAffiliation` left the record), and a conflict is fought between
  // POWER factions (GS-2, ODQ §934.101), so its parties are checked against `powerStructure.factions`. The
  // grouping (`settlement.factions`) left the record at v2, so its member check has no subject and left with it.
  const powerFactionSet = new Set(powerFactionNames);
  for (const npc of npcs) {
    for (const membership of Array.isArray(npc?.memberships) ? npc.memberships : []) {
      if (!membership?.power) continue;
      expect(
        powerFactionSet.has(membership.power),
        `${label} NPC ${npc.id} membership references a missing power faction`,
      ).toBe(true);
    }
  }
  expect(Object.hasOwn(settlement, 'factions'), `${label} still carries the retired NPC grouping`).toBe(false);
  for (const [index, conflict] of (settlement.conflicts || []).entries()) {
    for (const party of conflict?.parties || []) {
      expect(
        powerFactionSet.has(party),
        `${label} conflict[${index}] references a missing power faction`,
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
    if (judgment.id === ADVISORY_JUDGMENT) {
      expect(judgment.status, `${label}: ${judgment.id}`).toMatch(/^(pass|needs_review)$/);
      ADVISORY_STATUS.set(label, judgment.status);
    } else {
      expect(
        judgment.status,
        `${label}: ${judgment.id}`,
      ).not.toBe('needs_review');
    }
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
    // I3 (the chair, 2026-11-04, on X-46 car 1b): the metropolis band is open above its floor.
  ).toBeLessThanOrEqual(settlement.tier === 'metropolis' ? Infinity : range.max);
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

  it('pins the advisory record_coherence_battery failures BY IDENTITY', () => {
    // A filtered run certifies only some specimens; the rest are read here.
    for (const profile of PROFILES) {
      for (const seed of PROFILE_SEEDS) {
        const label = `certification-v1-${profile.id}-${seed}`;
        if (!ADVISORY_STATUS.has(label)) {
          const judgment = generate(profile.config, label).generationCoherenceReceipt.judgments
            .find((entry) => entry.id === ADVISORY_JUDGMENT);
          ADVISORY_STATUS.set(label, judgment?.status);
        }
      }
    }
    for (const [population] of POPULATION_BOUNDARIES) {
      const label = `population-${population}`;
      if (!ADVISORY_STATUS.has(label)) {
        const judgment = generate({
          settType: 'custom', population, culture: 'germanic', terrainOverride: 'plains', tradeRouteAccess: 'road',
        }, `certification-v1-boundary-${population}`).generationCoherenceReceipt.judgments
          .find((entry) => entry.id === ADVISORY_JUDGMENT);
        ADVISORY_STATUS.set(label, judgment?.status);
      }
    }
    const failing = [...ADVISORY_STATUS].filter(([, status]) => status === 'needs_review')
      .map(([label]) => label).sort();
    expect(ADVISORY_STATUS.size).toBe(65);
    // MEASURED 2026-11-04 at lane/self-vouch-2026-11-04: CAUSE — the battery reads, in the
    // stored record, contradictions the fix lanes are curing (surplus exports on short food,
    // defence and hospital words without the thing, "town" for a place that is not one,
    // hooks false on the record). The ladder drives this list to empty; shrink it as it does.
    expect(failing).toEqual(ADVISORY_FAILING);
  }, 120_000);
});
