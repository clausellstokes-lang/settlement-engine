/**
 * standingAgainstFigure.test.js — COHERENCE-POWERS-7 (the cold list REVIEW-W2A-3, MEDIUM #460 #638 #881 #1005 #291 #109
 * #713; the census's pattern 4): A POWER'S STANDING SENTENCE AGREES WITH THE FIGURES THE PAGE PRINTS BESIDE IT.
 *
 * Three causes, one arm each, each red on the tree before its own cure:
 *  (a) "Three powers stand almost level here, and no one leads" was given to the third power whenever it sat within five
 *      of its two neighbours, though the leader stood far clear of them all (City-State Council 39 against 17/13/12,
 *      rw3-metropolis-calm-1). The line is refused where the leader stands clear of the second (factionStanding.js), and
 *      the third power takes its band's own true line: "They are always at the table, but cannot set their own terms."
 *  (b) A density-law rival (`contestsNiche`) is minted as a copy of its host, its host's standing sentence included, and the
 *      settle to the final roster skipped it, so The Garrison Bloc (12) read "The gap between them and Ducal Governorship
 *      (24) is narrow", its host's line (rw3-metropolis-under_siege-1). The rival is settled like any power, from its host's
 *      old sentence to its own (rosterText.js :: settleStandingToRoster).
 *  (c) The settle kept a power's old sentence wherever its rank did not change, though the figures did: the military's "A
 *      slow war with the guild" stayed after the density law removed the Thieves' Guild (rw3-metropolis-politically_
 *      fractured-1, rw3-city-wartime-1). A sentence that differs from the final roster's is settled.
 * No draw: the standing table is a pure function of the roster. Births in the reviewer's app shape; literal words.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';
import { annotateFactionStanding } from '../../../src/generators/power/factionStanding.js';

/** @param {string} seed */
function born(seed) {
  const m = seed.match(/^rw3-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-\d+$/);
  const stresses = m[2] === 'calm' ? [] : m[2].split('+');
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: m[1], selectedStressesRandom: false,
    selectedStresses: stresses, _randomizePriorities: true }), null, { seed, customContent: {} });
}
/** The roster by figure, strongest first. @param {any} s */
const byFigure = (s) => [...s.powerStructure.factions].sort((a, b) => (Number(b.power) || 0) - (Number(a.power) || 0));
const LEVEL = 'Three powers stand almost level here, and no one leads';

describe('(a) "no one leads" is refused where a leader stands clear', () => {
  it('the table: 39/17/13/12 gives the third power its band\'s own line; 20/18/16/15 keeps the level line', () => {
    const clear = [{ faction: 'Ruler', power: 39, isGoverning: true }, { faction: 'B', power: 17 }, { faction: 'C', power: 13 }, { faction: 'D', power: 12 }];
    annotateFactionStanding(clear);
    expect(clear[2].desc).toBe('They are always at the table, but cannot set their own terms.');
    const level = [{ faction: 'Ruler', power: 20, isGoverning: true }, { faction: 'B', power: 18 }, { faction: 'C', power: 16 }, { faction: 'D', power: 15 }];
    annotateFactionStanding(level);
    expect(level[2].desc).toContain(LEVEL);
  });
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  it.each(['rw3-metropolis-calm-1', 'rw3-city-infiltrated-1', 'rw3-town-under_siege+famine-1', 'rw3-town-under_siege-1'])(
    '%s: no power says no one leads beside a leader clear of the second by more than five', (seed) => {
      const s = born(seed);
      const [first, second] = byFigure(s);
      expect(first.power - second.power, 'premise: the leader stands clear').toBeGreaterThan(5);
      expect(s.powerStructure.factions.filter((f) => String(f.desc || '').includes(LEVEL)).map((f) => f.faction)).toEqual([]);
    }, 60_000);
});
