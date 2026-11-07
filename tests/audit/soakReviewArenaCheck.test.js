/**
 * THE BATTERY'S A-05 ARENA CHECK COUNTS SPECTACLES HELD HERE (chair ruling 1, 2026-11-04). A
 * Gladiatorial school feeds the regional arena circuit, so its own rows ("Gladiator hire",
 * "Gladiator training") are not a contradiction where no arena stands; gladiatorial combat,
 * games or fights printed without an arena are.
 */
import { describe, expect, it } from 'vitest';
import { arenaSpectacleSentence, sentencesOf } from '../../scripts/audit/soak-review/checks.mjs';

describe('A-05 arena-absent, the instrument', () => {
  it('a town with a school and no arena: 0 findings', () => {
    const town = sentencesOf('Gladiatorial school\nGladiator hire\nGladiator training\nRent trained gladiators for arena performances or private display.');
    expect(arenaSpectacleSentence(town)).toBeUndefined();
  });
  it('a metropolis chain printing "Gladiatorial combat" with no Arena processor: 1 finding', () => {
    const metro = sentencesOf('Gambling & Arena\nGames of chance Gladiatorial combat Monster exhibitions');
    expect(arenaSpectacleSentence(metro)).toBe('Games of chance Gladiatorial combat Monster exhibitions');
  });
});
