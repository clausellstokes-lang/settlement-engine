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
 *         are marked, the ten on a food line that is not short are not; alike on the three views (N4). Not in a calm town
 *         on a connected road, where BIRTH-1's law holds a buyer unmarked (bar0-hamlet-calm-rand-40: left by name).
 *   (M3)  THE HEAD LINE OVER A VENTURE: "A row marked short is what its house makes when supplied." prints on neither the
 *         Institutions tab nor the Services tab where the only mark there is a failed venture's (the ten towns of the 720 at
 *         the base; r2r-hamlet-27 of them now carries a short mark of its own, the maltster's (L16), and prints it); it
 *         prints in a town with a short mark (r2r-city-20).
 *   (M6)  THE OLD DETECTOR KNOWS THE FAILED VENTURE'S MARK (AMENDMENT 2): `law8.mjs :: houseMarks` reads "Abandoned: a failed
 *         venture." / "Failing: a failed venture." as a mark, so a venture printed as designed beside "Needed, and not
 *         brought in: clay." is no 8a.input instance; the same card bare is one (a constructed page).
 *   (M7)  RULING BR11 (AMENDMENT 2): under a siege a house whose material is the town's own BY A PROVEN GROUND reads as the
 *         town's own land reads, "Curtailed by the siege.", and so do the houses that work that material: over the
 *         besieged towns of the 720 and the 150, no house of a material prints bare beside a critical dependency card of
 *         that material ("Needs Timber. Supply route severed."); the positive anchor, bar0-city-under_siege+famine-rand-28
 *         and -35 (the carpenters, the cooper, the sawmill bare at the base), alike on the three views (N4).
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
import { MATERIAL_OF } from '../../src/domain/facts/houseKinds.js';
import { HOUSE_TRADE_INPUT } from '../../src/data/crisisDependence.js';
import { FAMILY_NOUN } from '../../src/domain/facts/supplyStory.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { readTown } from '../helpers/pageLaws/pageB.mjs';
import { law8 } from '../helpers/pageLaws/law8.mjs';
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
  if (m) return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] }), null, { seed, customContent: {} });
  // the wide read's arm (CENSUS-3 seedcfg.mjs's bar0- arm, as birthKindsLaw.test.js reads it)
  m = /^bar0-(\w+)-([a-z_+]+)-([a-z_]+)-\d+$/.exec(seed);
  if (!m) throw new Error(`not a census seed: ${seed}`);
  const st = m[2] === 'calm' ? [] : m[2].split('+'); const route = m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: st, _randomizePriorities: true }), null, { seed, customContent: {} });
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
  // FAULTS-BIRTH (2026-11-18, R8: re-keyed by identity): r2s-politically_fractured-hamlet-0's dairy is no venture beside its common
  // pasture (FR8 (b)): the same claim on bar0-town-calm-rand-32, whose potter is a venture and its only mark
  const VENTURE_ONLY = ['r2r-hamlet-26', 'r2r-hamlet-48', 'r2r-hamlet-57', 'r2r-town-13', 'r2r-town-18', 'r2s-infiltrated-town-1',
    'bar0-town-calm-rand-32', 'r2s-under_siege-city-1', 'r2s-wartime-city-3'];
  test('absent on both tabs in the nine towns whose only mark is a venture\'s; present in r2r-city-20 (a short mark) and r2r-hamlet-27 (the maltster\'s)', () => {
    expectNoSeedFailures(collectSeedFailures([...VENTURE_ONLY, 'r2r-city-20', 'r2r-hamlet-27'], (seed) => {
      const shown = printed(town(seed));
      if (VENTURE_ONLY.includes(seed)) expect(shown, `${seed}: the sentence on the Institutions and the Services tab`).toEqual({ inst: false, svc: false });
      else {
        expect(shown.inst, `${seed}: the sentence on the Institutions tab, over its short mark`).toBe(true);
        // LEFT-KEYS K7 (2026-11-18): the positive reads the Services tab too, as the negative does
        expect(shown.svc, `${seed}: the sentence on the Services tab, over its short mark`).toBe(true);
      }
    }), 'M3 rows');
  }, 900_000);
});

describe('M6 · the page form of 8a.input reads a failed venture\'s mark as a mark', () => {
  test('a potter beside "Needed, and not brought in: clay.": bare, an instance; under either venture mark or the short mark, none', () => {
    const page = (/** @type {string} */ lead) => ['== Systems/Economics ==', 'Imports', 'Grain · Salt', 'Needed, and not brought in: clay.',
      '== Systems/Institutions ==', 'Potter · Crafts', `${lead}A wheel and a small kiln for domestic pottery.`, ''].join('\n');
    const found = (/** @type {string} */ lead) => law8(readTown(page(lead), { institutions: [{ name: 'Potter' }], config: {} }), 'constructed').filter((/** @type {any} */ i) => i.rule === '8a.input').length;
    expect(found(''), 'the potter bare').toBe(1);
    for (const lead of ['Abandoned: a failed venture. ', 'Failing: a failed venture. ', 'Short of clay. ']) expect(found(lead), `the potter under "${lead.trim()}"`).toBe(0);
  });
});

describe('M7 · ruling BR11: under a siege, a house beside a critical dependency card of its material is marked', () => {
  const WIDE = ['hamlet-under_siege', 'city-under_siege+famine'].flatMap((shape) => Array.from({ length: 15 }, (_, i) => `bar0-${shape}-rand-${i + 27}`));
  /** The houses of a material printed bare beside a critical "Supply route severed." card of that material. @param {any} s */
  const bareBeside = (s) => {
    const cards = (s.economicState?.tradeDependencies || []).filter((/** @type {any} */ d) => d?.severity === 'critical' && /^Supply route severed/.test(String(d.impact ?? '')));
    /** @type {string[]} */ const out = [];
    for (const d of cards) for (const h of liveInstitutions(s)) {
      const id = String(h?.catalogId || catalogIdForName(String(h?.name ?? '')) || '');
      const family = /** @type {Record<string, string>} */ (MATERIAL_OF)[id] || /** @type {Record<string, string>} */ (HOUSE_TRADE_INPUT)[id] || '';
      const noun = /** @type {Record<string, string>} */ (FAMILY_NOUN)[family] || '';
      if (noun && String(d.resource ?? '').toLowerCase().includes(noun) && rowMarkText(s, 'house', h) === null) out.push(`${h.name} beside "Needs ${d.resource}"`);
    }
    return out;
  };
  test('over the besieged towns of the 720 and the 150 no such house prints bare; the two cities\' houses read "Curtailed by the siege." on the three views', () => {
    /** @type {string[]} */ const found = []; let besieged = 0;
    expectNoSeedFailures(collectSeedFailures([...CENSUS, ...WIDE], (seed) => {
      const s = town(seed);
      if (!(s.config?.stressTypes || []).includes('under_siege')) return;
      besieged++;
      for (const x of bareBeside(s)) found.push(`${seed} · ${x}`);
    }), 'every town is born and read');
    expect(besieged, 'the besieged towns read (the anchor)').toBeGreaterThan(40);
    expect(found, 'a house of a material bare beside a critical dependency card of it').toEqual([]);
    expectNoSeedFailures(collectSeedFailures(['bar0-city-under_siege+famine-rand-28', 'bar0-city-under_siege+famine-rand-35'], (seed) => {
      for (const house of ['Carpenters (5-15)', 'Cooper', 'Sawmill (commercial)']) expect(markOf(town(seed), house), `${seed} · ${house}`).toBe('Curtailed by the siege.');
    }), 'the positive anchor');
  }, 1_800_000);
});
