/**
 * faithContenderWeight.test.js — R2-CODE-B-13, the reader's M12 (REVIEW-R2-CODE-B-2026-11-14 §9): 57395ee18 took
 * "Real political weight rests with the Religious Authorities." off every town where another power governs, and put
 * "A voice in the village's affairs belongs to …" in its place; in the towns where the religious contender OUTWEIGHS
 * the governor (r2s-succession_void-village-3: Dominant 58 against the Elder Council's 18) that is an understatement,
 * and the true line was removed. RULED (M12, A LINE IS IN ITS POOL UNLESS THE TOWN MAKES IT FALSE): the line returns
 * where the contender outweighs the governor, read from the powers' standing, and outweighs every other power too (the
 * line says the weight RESTS with it); where the governor or any other power matches or outweighs it, it keeps "A voice …". COLLECTED over census towns of both cases (every town checked
 * against the rule, not the first); a KEEP-GUARD (the governor's equal or better keeps "A voice") and a TAKEN-OFF
 * GUARD (both cases are in the corpus, so neither arm is vacuous).
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { faithReadingOf, faithLinesOf } from '../../src/domain/dossier/faithReading.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** The census's own cfgFor (r2r-<size>-<i>, r2s-<crisis>-<size>-<i>). */
function cfgFor(seed) {
  let m = seed.match(/^r2r-(\w+)-(\d+)$/);
  if (m) return birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[1] });
  m = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/);
  if (m) return birthConfig({ ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] });
  // rr3-<size>-<calm|s1+s2>-<rand|route>-<i>: the app's own shape (the reader's births.mjs, verbatim).
  m = seed.match(/^rr3-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-([a-z_]+)-(\d+)$/);
  if (m) return birthConfig({ ...DEFAULT_CONFIG, ...(m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] }), settType: m[1], selectedStressesRandom: false, selectedStresses: m[2] === 'calm' ? [] : m[2].split('+'), _randomizePriorities: true });
  throw new Error(seed);
}
/** Contender outweighs the governor and every other power (village-9 79/21, village-19 52/48, village-28, village-29, the
 * reader's succession_void-village-3, succession_void-village-0 over a religious governor's 24); the governor outweighs
 * (village-10 48/52, village-13, village-16) or matches (village-23 50/50, town-24 38/38); a third power outweighs it
 * though the governor does not (rr3-town-religious_conversion-rand-3: the Merchant Guilds' 36 over its 33, the Church
 * Council governing at 31). */
const SEEDS = ['r2r-village-9', 'r2r-village-19', 'r2r-village-28', 'r2r-village-29', 'r2s-succession_void-village-3',
  'r2s-succession_void-village-0', 'r2r-village-10', 'r2r-village-13', 'r2r-village-16', 'r2r-village-23', 'r2r-town-24',
  'rr3-town-religious_conversion-rand-3'];

/** @type {Array<{ seed: string, f: any, gov: number, other: number, lines: readonly string[] }>} */
const rows = [];
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of SEEDS) {
    const s = generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} });
    const reading = faithReadingOf(s);
    const f = reading.religiousFaction;
    const others = (s.powerStructure?.factions || []).filter((x) => (x?.faction || x?.name) !== f?.name);
    const gov = Math.max(-1, ...others.filter((x) => x?.isGoverning === true).map((x) => Number(x.power) || 0));
    const other = Math.max(-1, ...others.map((x) => Number(x.power) || 0));
    rows.push({ seed, f, gov, other, lines: faithLinesOf(reading, { tierNoun: 'village' }) });
  }
}, 300000);

describe('M12: the religious contender that outweighs the governor holds the real political weight', () => {
  test('COLLECTED: the line follows the powers\' standing; KEEP: the governor\'s, or any power\'s, equal or better keeps "A voice"', () => {
    const wrong = [];
    let outweighs = 0;
    let held = 0;
    let third = 0;
    for (const { seed, f, gov, other, lines } of rows) {
      if (!f || f.governs || f.power < 30 || gov < 0) continue;
      const real = lines.includes(`Real political weight rests with the ${f.name}.`);
      const voice = lines.some((l) => l.startsWith('A voice in ') && l.endsWith(`belongs to the ${f.name}.`));
      if (f.power > other) { outweighs += 1; if (!real || voice) wrong.push([seed, 'outweighs', f.power, gov, lines]); }
      else { held += 1; if (f.power > gov) third += 1; if (real || !voice) wrong.push([seed, 'held', f.power, gov, other, lines]); }
    }
    expect(wrong).toEqual([]);
    expect(outweighs, 'TAKEN-OFF GUARD: towns where the contender outweighs the governor are in the corpus').toBeGreaterThanOrEqual(4);
    expect(held, 'KEEP-GUARD: towns where the governor matches or outweighs are in the corpus').toBeGreaterThanOrEqual(4);
    expect(third, 'KEEP-GUARD: a town where a third power outweighs the contender, the governor not, is in the corpus').toBeGreaterThanOrEqual(1);
  });
});
