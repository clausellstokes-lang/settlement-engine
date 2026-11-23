/**
 * bar3PowersLines.test.js — BAR3-POWERS batch 1 (REVIEW-BAR-3 C9941, C11669, C45570, C27440, C36418; the wide read C5398,
 * C21481, C51168; the chair's direction P3, vetoable by the owner), on births: A POWER'S LINE CLAIMS NO MORE THAN ITS OWN
 * STRENGTH, ITS FUNDING, ITS ROSTER, ITS RELATION ROW AND ITS FAMINE'S FAILED SOURCE BEAR.
 *   - the wartime military line names no rank ("a primary power centre" beside a Minor power): reworded, every town;
 *   - "Undermanned and underfunded" only where the funding gate is under 1 and no war is on: each state takes its twin;
 *   - the Ecclesiastical Council's line names no "elected aldermen" the roster lacks;
 *   - the rank-1 "in the shadow of" line claims no grudge beside a relation row that says the pair needs each other;
 *   - the levy boycott takes its twin beside the seat's settled relation row with the merchants;
 *   - the famine's "last harvest" takes the failed source's own word where that source is not the harvest;
 *   - a bargain relation ("each props up the other", "each needs the other") names the quarrel beside a conflict of the
 *     pair at ANY intensity (TAIL-POWERS-B-4 did HIGH only);
 *   - (page only, C31100) under an occupation the hall's tense consequence takes the occupiers' approval, not a bargain.
 * Every REFUSED pair asserts what prints instead; every KEEP pair is a true sibling that must still print.
 * RED AT THE BASE (9e29811b6): every refused pair; the KEEP pairs green before and after.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { governanceAccountOf } from '../../src/domain/display/governanceAccount.js';
import { FAILED_SOURCE_WORDS } from '../../src/generators/economy/foodBalance.js'; // the famine line's words, computed (proseDrawnAnchors)

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** the census's 720 shapes (r2r-<size>-n; r2s-<stress>-<size>-n) @param {string} seed */
function born(seed) {
  const r = seed.match(/^r2r-(\w+)-\d+$/);
  const s = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/);
  if (!r && !s) throw new Error(`no shape for ${seed}`);
  const cfg = r ? { ...DEFAULT_CONFIG, ...DIALS, settType: r[1] } : { ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [s?.[1]], selectedStressesRandom: false, settType: s?.[2] };
  return generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
}

/** @param {any} t @param {RegExp} name */
const descOf = (t, name) => (t.powerStructure?.factions || []).filter((/** @type {any} */ f) => name.test(String(f.faction))).map((/** @type {any} */ f) => String(f.desc || '')).join(' | ');
/** @param {any} t */
const conflictOf = (t) => String(t.powerStructure?.recentConflict || '');
/** @param {any} t @param {string} a @param {string} b */
const relationOf = (t, a, b) => String((t.powerStructure?.factionRelationships || []).find((/** @type {any} */ x) => Array.isArray(x.pair) && x.pair.includes(a) && x.pair.includes(b))?.narrative || '');

/** the Power tab's governance paragraph (page only) @param {any} t */
const accountOf = (t) => String(governanceAccountOf(t)?.text || '');

/** [row, town, what is read, the refused words, what prints instead] */
const REFUSED = /** @type {Array<[string, string, (t: any) => string, string, string]>} */ ([
  ['C9941', 'r2s-wartime-town-1', (t) => descOf(t, /military|guard/i), 'into a primary power centre', 'into an arm of the war'],
  ['C9941', 'r2s-wartime-metropolis-2', (t) => descOf(t, /military|guard/i), 'into a primary power centre', 'into an arm of the war'],
  ['C11669', 'r2r-town-47', (t) => descOf(t, /military|guard/i), 'Undermanned and underfunded', 'Small for a place of this size; it cannot enforce the law everywhere at once, and it knows it.'],
  ['C11669', 'r2s-wartime-town-0', (t) => descOf(t, /military|guard/i), 'Undermanned and underfunded', 'Kept small before the war, and the war has put more on it than it was built to carry.'],
  ['C5398', 'r2r-city-36', (t) => descOf(t, /Ecclesiastical Council/), 'alongside elected aldermen', 'Senior clergy hold effective civic authority through the council'],
  // the lit birth's value (the flip, 2026-11-23, CLOSE-5 F-SEAT): the military's rank and standing moved, so its standing
  // takes the far-behind rung (was ", close enough to matter and too far behind to lead.")
  ['C45570', 'r2r-village-46', (t) => descOf(t, /military|guard/i), 'they are waiting for a chance to push back', 'Behind the Feudal Stewardship by too much to challenge openly, so they get their way through petitions and procedure instead.'],
  ['C27440', 'r2r-town-2', conflictOf, 'The merchants have stopped attending the sessions.', 'The merchants have argued against every one of them, and nothing has been settled yet.'],
  ['C36418', 'r2r-hamlet-28', conflictOf, 'The last harvest failed badly.', `The ${FAILED_SOURCE_WORDS.fish} failed badly this year.`],
  ['C36418', 'r2s-famine-thorp-1', conflictOf, 'The last harvest failed badly.', `The ${FAILED_SOURCE_WORDS.livestock} failed badly this year.`],
  ['C21481', 'r2r-town-1', (t) => relationOf(t, 'Arcane Council', 'Religious Authorities'), 'Each props up the other.', 'but the two are now at odds over'],
  // the bargain may still be told, but it does not END the row: the quarrel follows it (' ‖' marks the row's end)
  ['C31100', 'r2s-occupied-hamlet-1', accountOf, 'Nothing large is settled in the hall without bargaining', 'Nothing large is settled in the hall until the occupiers have approved it.'],
  ['C51168', 'r2r-town-9', (t) => `${relationOf(t, 'Guild Council', 'Military/Guard')} ‖`, 'each needs the other to stay strong. ‖', 'Even so, the two are now at odds over'],
]);
/** KEEP: [row, town, what is read, the true sibling that still prints] */
const KEEP = /** @type {Array<[string, string, (t: any) => string, string]>} */ ([
  ['C11669', 'r2s-monster_pressure-town-0', (t) => descOf(t, /military|guard/i), 'Undermanned and underfunded; unable to enforce law consistently and aware of it.'],
  ['C27440', 'r2r-town-20', conflictOf, 'The merchants have stopped attending the sessions.'],
  ['C36418', 'r2s-famine-village-0', conflictOf, 'The last harvest failed badly.'],
  ['C31100', 'r2r-city-10', accountOf, 'without bargaining with them first.'],
  ['C21481', 'r2r-village-7', (t) => relationOf(t, 'Elder Council', 'Religious Authorities'), 'Each props up the other.'],
]);

/** @type {Record<string, any>} */
const towns = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of new Set([...REFUSED.map((r) => r[1]), ...KEEP.map((r) => r[1])])) towns[seed] = born(seed);
}, 900000);

describe('BAR3-POWERS · a power line claims no more than the record bears (P3)', () => {
  for (const [row, seed, read, refused, instead] of REFUSED) {
    it(`${row} ${seed}: "${refused}" refused; "${instead}" prints instead`, () => {
      const said = read(towns[seed]);
      expect(said).toContain(instead);
      expect(said.includes(refused)).toBe(false);
    });
  }
  for (const [row, seed, read, kept] of KEEP) {
    it(`KEEP ${row} ${seed}: "${kept}" still prints`, () => {
      expect(read(towns[seed])).toContain(kept);
    });
  }
});
