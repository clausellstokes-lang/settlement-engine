/**
 * bar7OrderUnderTheLaw.test.js — BAR7-ORDER (BRIEF-BAR7's section BAR7-ORDER; vetoable by the owner): LAW 9's `9a.order` and
 * the audit's `low.hook-party` ("the old families") KEPT AS A GUARD, over fixed seeds.
 *   (a) 9a.order: in every siege town of the sixth read's thirty and the wide read's 150 (`bar0-hamlet-under_siege` and
 *       `bar0-city-under_siege+famine`, rand-27 to rand-44), the safety line AS PRINTED (`defenseDisplay.js ::
 *       deriveSafetyLine`) says no force keeps order where the page prints `Law & order · Collapsed` (the audit's own
 *       pattern, `tests/helpers/pageLaws/law9w.mjs :: rules9a`, verbatim), and holds no declared siege order clause there;
 *   (b) THE CONTROL C5430 (bar0-city-under_siege+famine-rand-43): its STORED line keeps the drawn clause (the draw is not
 *       moved); the printed line holds the garrison's twin; a DM's own line prints as written;
 *   (c) KEEP: above Collapsed each siege clause prints as drawn;
 *   (d) low.hook-party: in the towns of the 720 and the 150 whose guard line named "the old families" with no power,
 *       conflict, tension or crisis of the record naming them (the audit's own reading, `lowFamiliesI.mjs`), the printed
 *       guard line names no such party; where the record holds them the drawn line prints as drawn.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { deriveGuardAssessment, deriveSafetyLine } from '../../src/domain/display/defenseDisplay.js';
import { lawBandOf } from '../../src/domain/facts/lawBand.js';
import { GUARD_LAW_SIBLINGS, SIEGE_ORDER_CLAUSES, guardLineUnderTheLaw, safetyLineAsPrinted } from '../../src/domain/display/guardLineUnderTheLaw.js';
import { applyUserEdit } from '../../src/domain/userEdits.js';

const SIZE = '(thorp|hamlet|village|town|city|metropolis)';
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** CENSUS-3 seedcfg.mjs, its three arms verbatim (as `bar5SafetyLawBand.test.js`). @param {string} seed */
const cfgFor = (seed) => {
  let m = seed.match(new RegExp(`^r2r-${SIZE}-(\\d+)$`));
  if (m) return birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[1] });
  m = seed.match(new RegExp(`^r2s-(\\w+)-${SIZE}-(\\d+)$`));
  if (m) return birthConfig({ ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] });
  m = /** @type {RegExpMatchArray} */ (seed.match(new RegExp(`^bar0-${SIZE}-([a-z_+]+)-([a-z_]+)-(\\d+)$`)));
  const st = m[2] === 'calm' ? [] : m[2].split('+');
  const route = m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
  return birthConfig({ ...DEFAULT_CONFIG, ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: st, _randomizePriorities: true });
};
/** @type {Map<string, any>} */ const towns = new Map();
const town = (/** @type {string} */ seed) => {
  if (!towns.has(seed)) towns.set(seed, generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} }));
  return towns.get(seed);
};

/** The siege shapes of the thirty (rand-42..44) and the 150 (rand-27..41). */
const SIEGE = ['bar0-hamlet-under_siege', 'bar0-city-under_siege+famine'].flatMap((s) => Array.from({ length: 18 }, (_, i) => `${s}-rand-${27 + i}`));
/** THE AUDIT'S PATTERN, verbatim (`law9w.mjs :: ORDER_KEPT`, `ORDER_SPARED`). */
const ORDER_KEPT = /\b(?:The )?(?:garrison|watch|militia|guard|soldiers)(?: and (?:the )?(?:city )?watch)? keeps? (?:order|the peace)\b/i;
const ORDER_SPARED = /\b(nobody|no one|once kept|cannot keep|can no longer|could not keep|no longer)\b/i;
/** @param {string} line */
const orderKept = (line) => line.split(/(?<=\.)\s+/).filter((s) => ORDER_KEPT.test(s) && !ORDER_SPARED.test(s));

/** The towns whose guard line named the old families with no party on the record, at the base (the 720 and the 150). */
const FAMILIES_UNHELD_TOWNS = [
  // the census's 720 (7 the law-collapse twin, 5 the drawn line)
  'r2r-hamlet-0', 'r2r-hamlet-24', 'r2r-thorp-52', 'r2r-village-17', 'r2s-famine-hamlet-3', 'r2s-indebted-thorp-0', 'r2s-insurgency-hamlet-0',
  'r2s-insurgency-thorp-3', 'r2s-politically_fractured-thorp-3', 'r2s-politically_fractured-village-2', 'r2s-religious_conversion-village-0',
  'r2s-under_siege-thorp-3',
  // the 150 (rand-27..41)
  'bar0-hamlet-calm-rand-28', 'bar0-thorp-calm-rand-38', 'bar0-thorp-calm-rand-39', 'bar0-village-famine-rand-38', 'bar0-village-famine-rand-39',
];
/** THE AUDIT'S READING, verbatim (`lowFamiliesI.mjs`: the party's key against the record's powers, conflicts, tensions, crisis). @param {any} rec */
const familiesHeld = (rec) => /famil|noble|clan|elder/i.test(JSON.stringify([rec.powerStructure?.factions?.map((/** @type {any} */ f) => f?.faction), rec.conflicts, rec.history?.currentTensions, rec.stress, rec.powerStructure?.recentConflict]));

beforeAll(async () => { await loadGenerationLawPayloads(); }, 120_000);

describe('BAR7-ORDER: the siege\'s order clause reads the law band at print; the old families are named only where held', () => {
  test('(a) 9a.order: beside Collapsed, no printed safety line says the force keeps order (the siege towns of the thirty and the 150)', () => {
    let collapsed = 0;
    const failures = collectSeedFailures(SIEGE, (seed) => {
      const t = town(seed);
      if (lawBandOf(t) !== 'collapsed') return;
      collapsed += 1;
      const printed = String(deriveSafetyLine(t) ?? '');
      expect(orderKept(printed), `${seed}: the audit's pattern`).toEqual([]);
      expect(SIEGE_ORDER_CLAUSES.filter((k) => printed.includes(k)), `${seed}: a declared clause beside Collapsed`).toEqual([]);
    });
    expectNoSeedFailures(failures);
    expect(collapsed, 'the law holds over towns that print Collapsed').toBeGreaterThan(0);
  }, 600_000);

  test('(b) the control C5430: the stored clause stands, the printed line holds its twin, a DM\'s own line prints as written', () => {
    const t = town('bar0-city-under_siege+famine-rand-43');
    const stored = t.economicState.safetyProfile.safetyDesc;
    expect(lawBandOf(t)).toBe('collapsed');
    expect(stored, 'C5430: the draw is not moved').toContain(SIEGE_ORDER_CLAUSES[0]);
    const twin = GUARD_LAW_SIBLINGS[SIEGE_ORDER_CLAUSES[0]][1].text;
    expect(deriveSafetyLine(t), 'the twin prints instead').toContain(twin);
    expect(orderKept(String(deriveSafetyLine(t)))).toEqual([]);
    const edited = structuredClone(t);
    applyUserEdit(edited, 'economicState.safetyProfile.safetyDesc', stored);
    expect(deriveSafetyLine(edited), 'a DM\'s own line is printed as written').toBe(stored);
  }, 600_000);

  test('(c) KEEP: above Collapsed each siege clause prints as drawn', () => {
    const neutral = { history: { currentTensions: [] } };
    expect(lawBandOf(neutral)).toBe('adequate');
    for (const k of SIEGE_ORDER_CLAUSES) {
      const line = `${k}. People quarrel over rations.`;
      expect(safetyLineAsPrinted(line, neutral), k).toBe(line);
    }
  });

  test('(d) low.hook-party: the guard line names the old families only where the record holds them', () => {
    expect(FAMILIES_UNHELD_TOWNS.length, 'the towns the audit found').toBeGreaterThan(0);
    const failures = collectSeedFailures(FAMILIES_UNHELD_TOWNS, (seed) => {
      const t = town(seed);
      expect(familiesHeld(t), `${seed}: the record holds no such party`).toBe(false);
      expect(String(deriveGuardAssessment(t) ?? ''), `${seed}`).not.toMatch(/\bthe old families\b/i);
    });
    expectNoSeedFailures(failures);
    const drawn = Object.keys(GUARD_LAW_SIBLINGS)[0];
    const held = { history: { currentTensions: [] }, powerStructure: { factions: [{ faction: 'Council of Elders' }] } };
    expect(guardLineUnderTheLaw(drawn, held), 'held: the drawn line prints as drawn').toBe(drawn);
    expect(guardLineUnderTheLaw(drawn, { history: { currentTensions: [] } }), 'unheld: no party').not.toMatch(/old families/);
  }, 600_000);
});
