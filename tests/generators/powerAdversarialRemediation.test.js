import { describe, test, expect } from 'vitest';

import { generatePowerStructure } from '../../src/generators/power/rulingStructure.js';

/**
 * Remediation package "power-adversarial" — two golden-shifting bugs.
 *
 * (1) under_siege AND wartime each pushed a 'War Council' faction. With both
 *     stresses active the roster carried two identical 'War Council' entries.
 *     The wartime push is now guarded so it only fires when no War Council
 *     already exists (siege adds one first).
 *
 * (2) the stability band's adversarial-relationship match covered the legacy /
 *     compound spellings ('Hostile rival', 'hostile_rival', 'cold_war', 'tense',
 *     …) and missed the canonical 'hostile' / 'rival' ids
 *     (domain/relationships/canonicalRelationship.js), so a hostile neighbour
 *     never produced the 'Tense (external threat)' band.
 */

const economicState = { tier: 'city', economyOutput: 55, wealthLevel: 'moderate' };

describe('power-adversarial — War Council dedup under siege + wartime', () => {
  test('siege + wartime yields exactly one War Council', () => {
    const config = { stressTypes: ['under_siege', 'wartime'] };
    const { factions } = generatePowerStructure('city', economicState, null, config, []);
    const councils = factions.filter((f) => f.faction === 'War Council');
    expect(councils.length).toBe(1);
  });

  test('siege alone still produces a War Council', () => {
    const config = { stressTypes: ['under_siege'] };
    const { factions } = generatePowerStructure('city', economicState, null, config, []);
    expect(factions.filter((f) => f.faction === 'War Council').length).toBe(1);
  });

  test('wartime alone still produces a War Council', () => {
    const config = { stressTypes: ['wartime'] };
    const { factions } = generatePowerStructure('city', economicState, null, config, []);
    expect(factions.filter((f) => f.faction === 'War Council').length).toBe(1);
  });
});

describe('power-adversarial — canonical hostile/rival neighbour drives the external-threat band', () => {
  test("a 'hostile' neighbour produces the 'Tense (external threat)' stability band", () => {
    const neighbourRelationship = { neighborName: 'Karsgard', relationshipType: 'hostile' };
    const { stability } = generatePowerStructure('city', economicState, neighbourRelationship, {}, []);
    expect(stability).toBe('Tense (external threat)');
  });

  test("a 'rival' neighbour produces the 'Tense (external threat)' stability band", () => {
    const neighbourRelationship = { neighborName: 'Karsgard', relationshipType: 'rival' };
    const { stability } = generatePowerStructure('city', economicState, neighbourRelationship, {}, []);
    expect(stability).toBe('Tense (external threat)');
  });

  test("the pre-existing 'cold_war' id still maps to the external-threat band", () => {
    const neighbourRelationship = { neighborName: 'Karsgard', relationshipType: 'cold_war' };
    const { stability } = generatePowerStructure('city', economicState, neighbourRelationship, {}, []);
    expect(stability).toBe('Tense (external threat)');
  });
});
