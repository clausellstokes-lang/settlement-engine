/**
 * tests/generators/foundingOneFounder.test.js — R2-CODE-A-13, the chair's ruling (4) (2026-11-14): ONE FOUNDER ON A
 * PAGE. The History tab's "Origin:" row (`history.founding.reason`) and its "Founded by:" row are drawn apart
 * (`narrativeGenerator.js :: genArrivalDetail`), and 866 of the reader's 3,048 births drew an Origin row that names a
 * founder of its own ("was founded by religious hermits seeking isolation") beside a different "Founded by:" row ("a
 * discharged soldier who liked the view"): two founders on one page. THE RULING: an Origin row that names a founder
 * is drawn only where it agrees with the Founded-by row; else an Origin row that names none.
 *   O1 the agreement table names only founder-naming Origin rows and only founders the tables hold;
 *   O2 `oneFounderRow`: an agreeing row stands; a disagreeing one resolves draw-free onward to a row that names no
 *      founder and whose own test holds; where none does, no row; no state in reach keeps the row;
 *   O3 the collected towns (each printed two founders at the base, a siege and a famine among them): the Origin row
 *      names no founder, or the same founder as the Founded-by row, and its own test holds on the final record;
 *   O4 the guard towns: a founder row drawn beside its own founder still prints.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { FOUNDER_AGREES, FOUNDING_REASON_ADMITS, NAMES_A_FOUNDER, foundingStateOf, oneFounderRow } from '../../src/generators/narrative/foundingRowAdmits.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** The reader's births (`births.mjs :: cfgFor`) and the bar's (`render.bar0.jsx`), verbatim. @param {string} seed */
const born = (seed) => {
  const r2r = /^r2r-(\w+)-\d+$/.exec(seed);
  if (r2r) return /** @type {any} */ (generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: r2r[1] }), null, { seed, customContent: {} }));
  const m = /** @type {RegExpExecArray} */ (/^(?:rr3x?|bar0)-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-([a-z_]+)-\d+$/.exec(seed));
  const route = m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
  return /** @type {any} */ (generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: m[2] === 'calm' ? [] : m[2].split('+'), _randomizePriorities: true }), null, { seed, customContent: {} }));
};

describe('one founder on a page (ruling (4))', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  it('O1: the agreement table names founder-naming Origin rows and founders the tables hold', () => {
    const src = readFileSync(new URL('../../src/generators/narrativeGenerator.js', import.meta.url), 'utf8');
    for (const [row, founders] of FOUNDER_AGREES) {
      expect(NAMES_A_FOUNDER.has(row), row).toBe(true);
      for (const f of founders) expect(src.includes(`'${f}'`), f).toBe(true);
    }
  });

  it('O2: an agreeing row stands; a disagreeing one resolves onward to a founder-free admitted row, else silence', () => {
    const st = /** @type {any} */ ({ facts: {}, resources: new Set() });
    const founderRow = [...FOUNDER_AGREES.keys()][0];
    const agreeing = [.../** @type {ReadonlySet<string>} */ (FOUNDER_AGREES.get(founderRow))][0];
    const navigator = 'grew because a famous navigator retired here and others followed';
    const no = () => false;
    expect(oneFounderRow([founderRow, 'p'], founderRow, agreeing, {}, st)).toBe(founderRow);
    expect(oneFounderRow([navigator, 'p', 'q'], navigator, agreeing, { p: no }, st)).toBe('q');
    expect(oneFounderRow(['q', navigator, founderRow], navigator, 'someone else', {}, st)).toBe('q');
    expect(oneFounderRow([navigator, founderRow, 'p'], navigator, agreeing, { p: no }, st)).toBe(null);
    expect(oneFounderRow([navigator, 'p'], navigator, agreeing, {}, null)).toBe(navigator);
    expect(oneFounderRow(['p', 'q'], 'p', agreeing, {}, st)).toBe('p');
  });

  it('O3: the collected towns print one founder, and the Origin row printed holds (every row)', () => {
    expectNoSeedFailures(collectSeedFailures([
      'rr3-thorp-calm-rand-0', // hermits beside a discharged soldier
      'rr3-thorp-calm-rand-2', // a merchant beside a healer
      'rr3-thorp-calm-port-1', // a navigator beside a discharged soldier
      'rr3-thorp-under_siege-rand-0', // veterans beside an extended family, under a siege (now silent)
      'rr3-thorp-famine-rand-3', // a noble's farmland beside a pair of siblings, in a famine
      'r2r-city-16', // a navigator beside a noble house
      'bar0-thorp-calm-rand-1', // the bar's #159 town: a noble's farmland beside a healer
    ], (seed) => {
      const s = born(seed);
      const { reason, foundedBy } = s.history.founding;
      if (reason != null && NAMES_A_FOUNDER.has(String(reason))) {
        expect(FOUNDER_AGREES.get(String(reason))?.has(String(foundedBy)), `${seed}: "${reason}" beside "${foundedBy}"`).toBe(true);
      }
      const test = FOUNDING_REASON_ADMITS[String(reason)];
      if (test) expect(test(/** @type {any} */ (foundingStateOf(s.config, { _institutions: s.institutions }, null))), `${seed}: "${reason}" holds`).toBe(true);
    }), 'O3: one founder on a page');
  });

  it('O4: guard towns — a founder row drawn beside its own founder still prints (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(/** @type {Array<[string, string]>} */ ([
      ['r2r-thorp-17', 'grew from a single household that others joined over decades until it became permanent'],
      ['rr3-town-under_siege-rand-1', 'was founded by a disbanded military unit that liked the ground and stayed'],
      ['rr3x-thorp-calm-road-2', 'began when a failed soldier received a land grant and discovered the soil was worth more than any battlefield'],
    ]), ([seed, row]) => {
      expect(born(seed).history.founding.reason, seed).toBe(row);
    }), 'O4: the agreeing founder row stands');
  });
});
