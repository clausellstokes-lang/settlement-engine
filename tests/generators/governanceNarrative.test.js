/**
 * governanceNarrative.test.js — direct characterization of the governance
 * presentation policy.
 *
 * These tests pin precedence and institution-aware wording at the module
 * boundary. Broader generator tests prove that the policy is wired into a
 * settlement; this suite explains which competing facts are supposed to win.
 */
import { describe, expect, test } from 'vitest';
import { buildGovernanceLabels } from '../../src/generators/power/governanceNarrative.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { STRESS_TYPE_MAP } from '../../src/data/stressTypes.js';
import { STABILITY_BANDS, bandOf } from '../../src/domain/display/labelBands.js';

const DEFAULT_INPUT = {
  factions: [{ faction: 'Elected Reeve', isGoverning: true }],
  config: { monsterThreat: 'frontier' },
  stressFlags: {},
  instFlags: {
    criminalEffective: 20,
    militaryEffective: 45,
    economyOutput: 50,
    religionInfluence: 30,
  },
  neighbourRelationship: null,
  instNames: [],
  priorities: { military: 50, economy: 50 },
  tier: 'village',
  governingFaction: 'Elected Reeve',
  hasNobleInstitution: false,
  stressTypes: [],
  fallbackStressType: null,
};

const deriveGovernance = (overrides = {}) =>
  buildGovernanceLabels({
    ...DEFAULT_INPUT,
    ...overrides,
    stressFlags: {
      ...DEFAULT_INPUT.stressFlags,
      ...overrides.stressFlags,
    },
    instFlags: {
      ...DEFAULT_INPUT.instFlags,
      ...overrides.instFlags,
    },
    priorities: {
      ...DEFAULT_INPUT.priorities,
      ...overrides.priorities,
    },
  });

describe('governance narrative precedence', () => {
  test('a primary stressor overrides synthesis stability before monster threat annotates it', () => {
    const result = deriveGovernance({
      config: { monsterThreat: 'plagued' },
      stressFlags: { stateCrime: true },
      stressTypes: ['occupied', 'under_siege'],
    });

    expect(result.stability).toBe(
      'Critical (active siege — survival priority); monster threat active',
    );
    expect(result.recentConflict).toBe(
      'The settlement is under active siege. Every resource decision is a military decision. The debate is no longer about policy. It is about survival.',
    );
  });

  test('primary-stress priority is canonical rather than input-order dependent', () => {
    const result = deriveGovernance({
      stressTypes: ['infiltrated', 'famine'],
      instNames: ['council hall'],
    });

    expect(result.stability).toBe('Desperate — hunger is eroding order');
    expect(result.recentConflict).toBe(
      'Food shortages have sharpened every tension in the settlement. Those with stocks are not advertising the fact. Those without are watching those with.',
    );
  });

  test('infiltration changes the vignette without changing public stability', () => {
    const result = deriveGovernance({
      instFlags: {
        criminalEffective: 90,
        militaryEffective: 20,
      },
      stressTypes: ['infiltrated'],
    });

    expect(result.stability).toBe('Unstable (pervasive organized crime)');
    expect(result.recentConflict).toBe(
      'Someone has been stealing from the communal stores. Everyone suspects someone. No one is saying anything.',
    );
  });

  test('the single-stress fallback selects prose but does not impersonate the active stress list', () => {
    const result = deriveGovernance({
      fallbackStressType: 'occupied',
    });

    expect(result.stability).toBe('Stable');
    expect(result.recentConflict).toBe(
      'An occupying officer arrested a local elder for "seditious speech". Elected Reeve filed a formal protest. The protest was returned unread.',
    );
  });
});

describe('governance narrative institutional phrasing', () => {
  test('a real watch replaces generic garrison language without losing sentence case', () => {
    const result = deriveGovernance({
      stressFlags: { stateCrime: true },
      instNames: ['town watch'],
      tier: 'town',
    });

    expect(result.recentConflict).toBe(
      "Several households disappeared following a tax audit. The watch's commander has not been available for comment.",
    );
  });

  test('a governing-body label replaces generic council language', () => {
    const result = deriveGovernance({
      instFlags: { economyOutput: 70 },
      instNames: ['guild hall'],
      governingFaction: 'Household Council',
      factions: [{ faction: 'Household Council', isGoverning: true }],
    });

    expect(result.recentConflict).toBe(
      'Two rival guilds are contesting control of the main trade route. Neither side will back down and Household Council is avoiding the question.',
    );
  });

  test('formal civic authority receives the authored betrayal construction', () => {
    const result = deriveGovernance({
      instNames: ['council hall'],
      stressTypes: ['recently_betrayed'],
    });

    expect(result.recentConflict).toBe(
      'The investigation into the betrayal has been obstructed twice. The obstruction came from within the office of the elected reeve. No one will say who.',
    );
  });

  test('canonical adversarial relationship tokens drive both label and vignette', () => {
    const result = deriveGovernance({
      neighbourRelationship: {
        neighborName: 'Grimhold',
        relationshipType: 'hostile',
      },
    });

    expect(result).toEqual({
      stability: 'Tense (external threat)',
      recentConflict: 'Ongoing tensions with Grimhold',
    });
  });
});

/**
 * ⛔ A TOWN UNDER AN ACTIVE CRISIS NEVER READS AS STABLE (owner order 2026-09-17: "fix the
 * remaining contradictions"). The Overview shows an ACTIVE CRISIS card for every entry in
 * `settlement.stress`, and the Power tab shows this module's stability label. Five stressors
 * had no arm in the precedence chain (insurgency, mass migration, wartime, religious
 * conversion, slave revolt), and `infiltrated` returned the baseline on the spot, so a town
 * could carry a public crisis banner beside a `Stable` label: 12 of 18 forced towns per type
 * measured before the fix.
 *
 * ⛔ AND `infiltrated` IS NO LONGER AN EXEMPTION (the same owner order, taken to its end by
 * the review of 2026-09-17). It was left alone at the first pass on the producer's own
 * covert-crisis reasoning, and that exemption was 479 of the 525 golden-master towns reading
 * `Stable` under an `Infiltrated · ACTIVE CRISIS` card — measured, not argued. The band
 * `Vulnerable` is the least alarmed word in STABILITY_BANDS that still refuses to call the
 * town calm, which is what covert means here: exposed, not visibly disordered.
 */
const PUBLIC_UNREST = Object.freeze({
  insurgency: 'Unstable (insurgency contests authority)',
  mass_migration: 'Strained (people arriving or leaving)',
  wartime: 'Tense (requisition and conscription)',
  religious_conversion: 'Tense (the creed is contested)',
  slave_revolt: 'Unstable (revolt not contained)',
});

/** The sixth arm, kept apart because it is covert rather than public unrest. */
const INFILTRATED_LABEL = 'Vulnerable (decisions shaped from outside)';

describe('an active crisis never reads as Stable (owner order 2026-09-17)', () => {
  test('each of the five unrest stressors labels a Stable-baseline town with its own band', () => {
    // THE ANCHOR: the same inputs with no stressor are the Stable baseline, so each arm
    // below is measured against a town that really would have read Stable.
    expect(deriveGovernance().stability).toBe('Stable');
    for (const [stressType, label] of Object.entries(PUBLIC_UNREST)) {
      const result = deriveGovernance({ stressTypes: [stressType] });
      expect(result.stability, stressType).toBe(label);
      expect(bandOf(result.stability, STABILITY_BANDS), `${stressType} reads as Stable`).not.toBe('Stable');
    }
  });

  test('the five follow the module\'s own primary-stress precedence, so the label names the vignette\'s crisis', () => {
    expect(deriveGovernance({ stressTypes: ['slave_revolt', 'insurgency'] }).stability).toBe(PUBLIC_UNREST.insurgency);
    expect(deriveGovernance({ stressTypes: ['religious_conversion', 'wartime'] }).stability).toBe(PUBLIC_UNREST.wartime);
    expect(deriveGovernance({ stressTypes: ['slave_revolt', 'mass_migration'] }).stability).toBe(PUBLIC_UNREST.mass_migration);
  });

  test('infiltration beside a PUBLIC crisis no longer masks that crisis', () => {
    expect(deriveGovernance({ stressTypes: ['infiltrated', 'indebted'] }).stability)
      .toBe('Strained — debt obligations constrain every decision');
    expect(deriveGovernance({ stressTypes: ['infiltrated', 'monster_pressure'] }).stability)
      .toBe('Tense (monster pressure from surrounding region)');
    for (const [stressType, label] of Object.entries(PUBLIC_UNREST)) {
      expect(deriveGovernance({ stressTypes: ['infiltrated', stressType] }).stability, stressType).toBe(label);
    }
    // …and infiltration ALONE no longer calls a compromised town calm. It is LAST in the
    // chain, so every pairing above still names the public crisis and this arm only ever
    // speaks when infiltration is the only thing on the books.
    expect(deriveGovernance({ stressTypes: ['infiltrated'] }).stability).toBe(INFILTRATED_LABEL);
    expect(bandOf(INFILTRATED_LABEL, STABILITY_BANDS), 'infiltration reads as Stable').toBe('Vulnerable');
  });

  test('a plagued town keeps the crisis label and annotates it, never replacing it', () => {
    for (const [stressType, label] of Object.entries(PUBLIC_UNREST)) {
      expect(deriveGovernance({ config: { monsterThreat: 'plagued' }, stressTypes: [stressType] }).stability, stressType)
        .toBe(`${label}; monster threat active`);
    }
  });

  test('THE PIPELINE: every registered stressor, forced at every tier, never yields a Stable band', () => {
    const tiers = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
    // EVERY registered type, infiltration included. The exemption this sweep used to carry
    // was the contradiction itself, so excluding it here would have been the pin defending it.
    const allTypes = Object.keys(STRESS_TYPE_MAP);
    // Non-vacuity: the register really carries the six this fix names, beside the rest.
    for (const type of [...Object.keys(PUBLIC_UNREST), 'infiltrated']) expect(allTypes.includes(type), type).toBe(true);
    const offenders = [];
    let judged = 0;
    for (const type of allTypes) {
      // Infiltration pairs with itself in no meaningful way, so it runs alone.
      const pairings = type === 'infiltrated' ? [[type]] : [[type], ['infiltrated', type]];
      for (const tier of tiers) {
        for (const stressTypes of pairings) {
          const settlement = generateSettlementPipeline({
            settType: tier, culture: 'germanic', terrainOverride: 'plains', tradeRouteAccess: 'road',
            monsterThreat: 'frontier', stressTypes,
          }, null, { seed: `stable-contradiction-${type}-${tier}-${stressTypes.length}`, customContent: {} });
          const banners = (Array.isArray(settlement.stress) ? settlement.stress : [settlement.stress]).map((s) => s?.type);
          if (!banners.includes(type)) continue;
          judged += 1;
          const band = bandOf(settlement.powerStructure?.stability ?? '', STABILITY_BANDS);
          if (band === 'Stable') offenders.push(`${stressTypes.join('+')} @ ${tier}: ${settlement.powerStructure?.stability}`);
        }
      }
    }
    // Every forced crisis must actually have landed on the town, or the sweep proves nothing.
    expect(judged).toBe(((allTypes.length - 1) * 2 + 1) * tiers.length);
    expect(offenders, 'a town under an ACTIVE CRISIS banner reads as Stable').toEqual([]);
  }, 120_000);
});

