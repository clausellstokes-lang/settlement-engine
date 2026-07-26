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
  tradeRoute: null,
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
      'The settlement is under active siege. Every resource decision is a military decision. The debate is no longer about policy — it is about survival.',
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
      tradeRoute: {
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
