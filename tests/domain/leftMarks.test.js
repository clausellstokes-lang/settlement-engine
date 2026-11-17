/** @vitest-environment jsdom */
/**
 * leftMarks.test.js — LEFT-MARKS (the sixth chair's BRIEF-LEFT, 2026-11-17; vetoable by the owner): THE MARK'S ONE LEAF READS
 * WHAT EARLIER SEATS LEFT BY NAME. Over fixed seeds of the census's 720 (born in the census's own configuration shape, as
 * `bar6MarksLaw8.test.js` births them):
 *   (L25) SEAM-ECON's houses. A house whose trade takes a good no chain names it for (`crisisDependence.js ::
 *         HOUSE_NEED_INPUT`: the butchers' stock, the established apothecary's herbs) is short where the record's own need
 *         list names the good and the one reader finds it nowhere: the butchers of r2r-town-54 ("Short of livestock."), the
 *         apothecary of r2s-religious_conversion-town-2 ("Short of medicinal herbs."), and no other house of that table in
 *         the 720. The reader's two mends (`houseInputAtHand.js`): "Herbs and forage" brings the herbs (the apothecary of
 *         r2r-village-13, "Short of its materials." at the base, is fed), and game is the butchers' stock (the butchers of
 *         r2r-metropolis-19, beside "Game and hides" on the imports, are at work). Each mark prints alike on the owner's
 *         record, its public projection and the share veil (N4).
 *   (L16) THE HOUSE THAT WORKS ONLY A SURPLUS (rule 8i.surplus; the auditor's cure): the maltster ("Requires grain surplus.")
 *         is "Short of grain." where the page's food line is short ("Short: N lbs/day"), in a crisis or not: the four
 *         maltsters of the 720 on a short food line (r2r-hamlet-27, calm; r2s-under_siege-hamlet-1, -3; r2s-wartime-village-3)
 *         are marked, the ten on a food line that is not short are not; alike on the three views (N4).
 *   (M3)  THE HEAD LINE OVER A VENTURE: "A row marked short is what its house makes when supplied." prints on neither the
 *         Institutions tab nor the Services tab where the only mark there is a failed venture's (the ten towns of the 720 at
 *         the base; r2r-hamlet-27 of them now carries a short mark of its own, the maltster's (L16), and prints it); it
 *         prints in a town with a short mark (r2r-city-20).
 * POSITIVE CONTROL: at the base (e0242a12a) the two houses print bare, the apothecary of r2r-village-13 is marked, the
 * four maltsters print bare and the head line prints over the ten towns' ventures: the file is red there.
 */
import { describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { rowMarkText } from '../../src/domain/display/crisisStoppedRow.js';
import { toPublicSafe } from '../../src/domain/display/publicSafe.js';
import { projectShareVeil } from '../../src/domain/display/galleryVeil.js';
import { liveInstitutions } from '../../src/domain/institutions/institutionRoster.js';
import { catalogIdForName } from '../../src/data/institutionalCatalog.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import InstitutionsTab from '../../src/components/new/tabs/InstitutionsTab.jsx';
import { ServicesTab } from '../../src/components/new/tabs/ServicesTab.jsx';

await loadGenerationLawPayloads();

const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const CRISES = ['famine', 'indebted', 'infiltrated', 'insurgency', 'mass_migration', 'monster_pressure', 'occupied', 'plague_onset',
  'politically_fractured', 'recently_betrayed', 'religious_conversion', 'slave_revolt', 'succession_void', 'under_siege', 'wartime'];
/** The census's 720, in its own order of shapes. */
const CENSUS = [
  ...SIZES.flatMap((size) => Array.from({ length: 60 }, (_, i) => `r2r-${size}-${i}`)),
  ...CRISES.flatMap((c) => SIZES.flatMap((size) => Array.from({ length: 4 }, (_, i) => `r2s-${c}-${size}-${i}`))),
];
const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** CENSUS-3 seedcfg.mjs's r2r-/r2s- arms, verbatim in shape (as bar6MarksLaw8.test.js). @param {string} seed */
const born = (seed) => {
  let m = /^r2r-(\w+)-\d+$/.exec(seed);
  if (m) return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: m[1] }), null, { seed, customContent: {} });
  m = /^r2s-(\w+)-(\w+)-\d+$/.exec(seed);
  if (!m) throw new Error(`not a census seed: ${seed}`);
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] }), null, { seed, customContent: {} });
};
/** @type {Map<string, any>} */
const towns = new Map();
const town = (/** @type {string} */ seed) => { if (!towns.has(seed)) towns.set(seed, born(seed)); return towns.get(seed); };
/** The house's mark on the record, its public projection and the share veil (N4): one answer, or the three. @param {any} s @param {string} name */
const markOf = (s, name) => {
  const read = (/** @type {any} */ r) => { const h = liveInstitutions(r).find((x) => x?.name === name); return h ? rowMarkText(r, 'house', h) : 'NO SUCH HOUSE'; };
  const pub = toPublicSafe(structuredClone(s));
  const marks = [read(s), read(pub), read(projectShareVeil(toPublicSafe(structuredClone(s)), null))];
  return marks.every((x) => x === marks[0]) ? marks[0] : `the views differ: ${JSON.stringify(marks)}`;
};

describe('L25 · SEAM-ECON\'s houses: short where the page says their good is not had, and the reader\'s two mends', () => {
  const ROWS = /** @type {Array<[string, string, string | null, string]>} */ ([
    ['r2r-town-54', 'Butchers (3-8)', 'Short of livestock.', 'the need list names livestock; no import brings it (a town on no road)'],
    ['r2s-religious_conversion-town-2', 'Apothecary (established)', 'Short of medicinal herbs.', 'the need list names medicinal herbs; no import brings them'],
    ['r2r-village-13', 'Apothecary', null, '"Herbs and forage" on the imports brings the herbs (the mend)'],
    ['r2r-metropolis-19', 'Butchers (3-8)', null, '"Game and hides" on the imports is the butchers\' stock (the mend)'],
  ]);
  test('each house reads its state, alike on the record, its public projection and the share veil (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(ROWS, ([seed, house, want, why]) => {
      expect(markOf(town(seed), house), `${seed} · ${house}: ${why}`).toBe(want);
    }), 'L25 rows');
  }, 600_000);
  test('no other house of the table is marked short of its good over the census\'s 720', () => {
    const NEED = { butchers_3_8: 'Short of livestock.', apothecary_established: 'Short of medicinal herbs.' };
    /** @type {string[]} */ const marked = [];
    expectNoSeedFailures(collectSeedFailures(CENSUS, (seed) => {
      const s = town(seed);
      for (const h of liveInstitutions(s)) {
        const id = String(h?.catalogId || catalogIdForName(String(h?.name ?? '')) || '');
        const want = /** @type {Record<string, string>} */ (NEED)[id];
        if (want && String(rowMarkText(s, 'house', h) ?? '').includes(want)) marked.push(`${seed} · ${h.name}`);
      }
    }), 'every census town is born and read');
    expect(marked.sort(), 'the houses of the table marked short of their good').toEqual(['r2r-town-54 · Butchers (3-8)', 'r2s-religious_conversion-town-2 · Apothecary (established)']);
  }, 1_800_000);
});

describe('L16 · the house that works only a surplus is short where the page\'s food line is short', () => {
  const SHORT = ['r2r-hamlet-27', 'r2s-under_siege-hamlet-1', 'r2s-under_siege-hamlet-3', 'r2s-wartime-village-3'];
  const FED = ['r2r-hamlet-31', 'r2r-hamlet-44', 'r2r-hamlet-56', 'r2r-village-22', 'r2r-village-42', 'r2s-monster_pressure-hamlet-2',
    'r2s-politically_fractured-village-0', 'r2s-politically_fractured-village-1', 'r2s-slave_revolt-hamlet-2', 'r2s-succession_void-hamlet-1'];
  test('the four maltsters on a short food line read "Short of grain."; the ten on a food line that is not short do not (every row, the three views)', () => {
    expectNoSeedFailures(collectSeedFailures([...SHORT, ...FED], (seed) => {
      const mark = String(markOf(town(seed), 'Maltster'));
      expect(mark.includes('NO SUCH HOUSE') || mark.includes('the views differ'), `${seed}: ${mark}`).toBe(false);
      expect(mark.includes('Short of grain.'), `${seed}: the maltster's mark ${mark}`).toBe(SHORT.includes(seed));
    }), 'L16 rows');
  }, 600_000);
});

describe('M3 · the head line over a failed venture: no "marked short" sentence where no row is marked short', () => {
  const SUPPLIED = 'A row marked short is what its house makes when supplied.';
  /** @param {any} s @returns {{ inst: boolean, svc: boolean }} whether each rendered tab prints the sentence */
  const printed = (s) => {
    const inst = render(React.createElement(InstitutionsTab, { settlement: s })).container.textContent || '';
    cleanup();
    const svc = render(React.createElement(ServicesTab, { services: s.availableServices, settlement: s, narrativeNote: null })).container.textContent || '';
    cleanup();
    return { inst: inst.includes(SUPPLIED), svc: svc.includes(SUPPLIED) };
  };
  const VENTURE_ONLY = ['r2r-hamlet-26', 'r2r-hamlet-48', 'r2r-hamlet-57', 'r2r-town-13', 'r2r-town-18', 'r2s-infiltrated-town-1',
    'r2s-politically_fractured-hamlet-0', 'r2s-under_siege-city-1', 'r2s-wartime-city-3'];
  test('absent on both tabs in the nine towns whose only mark is a venture\'s; present in r2r-city-20 (a short mark) and r2r-hamlet-27 (the maltster\'s)', () => {
    expectNoSeedFailures(collectSeedFailures([...VENTURE_ONLY, 'r2r-city-20', 'r2r-hamlet-27'], (seed) => {
      const shown = printed(town(seed));
      if (VENTURE_ONLY.includes(seed)) expect(shown, `${seed}: the sentence on the Institutions and the Services tab`).toEqual({ inst: false, svc: false });
      else expect(shown.inst, `${seed}: the sentence on the Institutions tab, over its short mark`).toBe(true);
    }), 'M3 rows');
  }, 900_000);
});
