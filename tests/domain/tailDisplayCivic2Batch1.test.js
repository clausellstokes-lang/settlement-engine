/**
 * TAIL-DISPLAY-CIVIC-2 · BATCH 1 (READ-ALL-3, the exports' read: 20491 26932 27231 28629 29824 22279 22278 27635
 * 17171 17167; base: e633bd333). The threat rows (domain/display/threatAssessment.js :: buildThreatAssessment,
 * the PDF's Defense & Security chapter and the Defense tab's readiness rows both read them) said, by the census's 720 at
 * the base: what "a plague would" do where the outbreak is the town's own crisis; "There is a court" where the roster
 * lists a town hall; "organised crime" beside a safety label that names another cause; "Quiet country" and "the primary
 * threats here are internal" under a siege, an occupation, a war or a monster pressure; "a long siege" in a town with no
 * siege. Births of the census's own seeds (CENSUS-3
 * seedcfg.mjs :: cfgFor); every cured pair red at the base, every kept pair green before and after.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { buildThreatAssessment } from '../../src/domain/display/threatAssessment.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true,
  selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** @param {string} seed the census's seed: r2r-<size>-<n> or r2s-<stress>-<size>-<n> */
const cfgFor = (seed) => {
  const s = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/);
  if (s) return birthConfig({ ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [s[1]], selectedStressesRandom: false, settType: s[2] });
  return birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: seed.split('-')[1] });
};
/** @param {string} seed @returns {Record<string, string>} each threat row's sentence by its label */
const rowsOf = (seed) => Object.fromEntries(buildThreatAssessment(generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} }))
  .map((row) => [row.label, row.assess]));

// [seed, row, the sentence that must not print, what that row prints instead]
const CURED = [
  ['r2s-plague_onset-thorp-0', 'Disasters & Famine', 'a plague would run until it burned out', 'The outbreak has come, and no house here is kept to treat the sick.'],
  ['r2s-plague_onset-town-1', 'Disasters & Famine', 'keep an outbreak from spreading', 'The outbreak has come; the hospital is where the sick can be isolated.'],
  ['r2s-plague_onset-city-0', 'Disasters & Famine', 'an outbreak would outrun it', 'The outbreak has come, and the monastic infirmary treats the sick one at a time.'],
  // RE-KEYED BY IDENTITY 2026-11-18 (FAULTS-WATCH FR19 item 6): the internal line reads the Legal row's court (`courtHoldersOf`);
  // r2s-famine-town-2's Legal row reads "None" (its town hall holds no court), so the court-without-gaol claim stands on
  // r2s-famine-town-0 ("Court only"), the same shape and crisis
  ['r2s-famine-town-0', 'Internal Security', 'There is a court', 'Cases are heard here, but there is almost nowhere to hold anyone.'],
  ['r2s-plague_onset-thorp-0', 'Internal Security', 'organised crime', 'Internal security: Dangerous — Plague Unrest — Plague Conditions. No court and no gaol'],
  ['r2s-occupied-thorp-1', 'Beasts & Monsters', 'Quiet country', 'Few creatures trouble this country; the danger here now is not from beasts.'],
  ['r2s-under_siege-town-0', 'Beasts & Monsters', 'Quiet country', 'Few creatures trouble this country; the danger here now is not from beasts.'],
  ['r2s-under_siege-town-2', 'Beasts & Monsters', 'The primary threats here are internal.', 'Few creatures trouble this country; the danger here now is not from beasts.'],
  ['r2s-plague_onset-town-3', 'Economic Survival', 'a long siege', 'Money enough for a short crisis, laid by before the outbreak; a long one would start eating the reserves within months.'],
  ['r2s-famine-town-3', 'Economic Survival', 'a long siege', 'Money enough for a short crisis, laid by before the famine; a long one would start eating the reserves within months.'],
];
// [seed, row, a true sibling that must still print]
const KEPT = [
  ['r2r-thorp-0', 'Disasters & Famine', 'Nobody here treats the sick, and a plague would run until it burned out.'],
  ['r2r-town-37', 'Disasters & Famine', 'The outbreak has come. Clergy provide basic wound care: better than nothing, worse than a hospital.'],
  ['r2r-town-12', 'Disasters & Famine', 'The hospital can isolate the sick and keep an outbreak from spreading.'],
  ['r2r-village-8', 'Disasters & Famine', 'A healer treats the sick one at a time; an outbreak would outrun it.'],
  ['r2r-thorp-0', 'Beasts & Monsters', 'Quiet country and no organised defence, which is all the country asks.'], // P9 (RULING G22): settled country is graded Adequate at least, so the reassurance prints
  ['r2r-city-1', 'Beasts & Monsters', 'Quiet country, and far more defences than it calls for.'],
  ['r2s-famine-city-3', 'Beasts & Monsters', 'Quiet country, and far more defences than it calls for.'],
  ['r2r-town-10', 'Beasts & Monsters', 'The primary threats here are internal.'],
];
const ROWS = new Map();
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of new Set([...CURED, ...KEPT].map((r) => r[0]))) ROWS.set(seed, rowsOf(seed));
}, 900000);

describe('batch 1: the threat rows say what the town\'s own record bears', () => {
  test('the cured sentences do not print; each row prints its true twin', () => {
    expect(CURED.filter(([seed, row, gone, instead]) => ROWS.get(seed)[row].includes(gone) || !ROWS.get(seed)[row].includes(instead))
      .map(([seed, row]) => `${seed} ${row}: ${ROWS.get(seed)[row]}`)).toEqual([]);
  });
  test('the true siblings still print', () => {
    expect(KEPT.filter(([seed, row, kept]) => !ROWS.get(seed)[row].includes(kept)).map(([seed, row]) => `${seed} ${row}: ${ROWS.get(seed)[row]}`)).toEqual([]);
  });
});
