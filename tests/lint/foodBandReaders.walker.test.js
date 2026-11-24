/**
 * foodBandReaders.walker.test.js — THE TOTALITY ARM OF R24-A2 (CLOSE-7; the chair's ruling R24c of 2026-11-24: "A2's
 * commit carries THE WHOLE LIST of what in `src` reads the production band or the fare's band to choose a line, each
 * classed SAYS SHORTAGE, SAYS SOURCE or NEITHER, with a lint arm that reds on a reader that is not classed. A fifth must
 * not be found by a reader's luck.").
 *
 * A line that said people go short read the food CAPACITY band (`capacityModel.js :: food_production`) alone, and a
 * fourth reader (Dawn Work's food branch) stood where the ruling named three. The cure (`src/domain/dailyLife.js ::
 * fareBandOf`, the one derivation: the printed Food Security bounds the fare, production places it within) is read by
 * the four line-choosers; this arm holds that no other reader enters unseen.
 *
 * WHAT IT SEES (a reading line, comments out): an import of the capacity model, the `food_production` capacity named, or
 * the fare band asked (`fareBandOf(`), in any `.js`, `.jsx` or `.mjs` file under `src/`.
 * THE LIST: every file with such a line, its EXACT count of reading lines, its class and its reason. A file not listed
 * reds; a new read in a listed file reds (its count moved: classify the new read). A count that falls reds too, so the
 * list is re-stated by its cause, never left stale.
 * WHAT IT DOES NOT SEE: a reader that takes the band through a parameter whose name says nothing of it (the behaviour
 * tests of `tests/domain/close7FoodFact.test.js` read the page itself).
 * The behaviour tests (red first by name, the controls, the bound by cell) stay in `tests/domain/close7FoodFact.test.js`.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
/** A line that reads the production band or the fare band: the capacity model imported, the capacity named, the fare band asked. */
const READS = /food_production|fareBandOf\(|from\s+['"][^'"]*capacityModel\.js['"]/;
/**
 * THE WHOLE LIST: every file of `src` with such a line, its exact count of such lines (comments out), and its class.
 * SAYS SHORTAGE: it chooses a line that says people go short; SAYS SOURCE: a line of where food comes from; NEITHER: it
 * chooses no such line (it states the band as the band, cites it, compares it, or is an instrument); HOME: it writes it.
 */
const FOOD_BAND_READERS = Object.freeze({
  'src/domain/dailyLife.js': [14, 'SAYS SHORTAGE', 'the four line-choosers, each by the FARE BAND (`fareBandOf`, the one reader of the production band here): the fare (`deriveFoodCulture`: SAYS SHORTAGE in strained/critical/collapsed, SAYS SOURCE in A12, S5, S9, A10, A11, else NEITHER), Dawn Work\'s food branch (SAYS SHORTAGE), the food grievance (SAYS SHORTAGE; R24h: it fires on the fare band alone, so a page that prints its place fed has none) and the food visitor lens (SAYS SHORTAGE: F1, F2); the slots\' citations of `capacity.food_production` (NEITHER: references, no line); `fareBandOfRecord`, the same derivation for a reader outside the slots'],
  'src/data/dailyLife/outsiderImpressions.js': [2, 'SAYS SHORTAGE', 'the food visitor pool `services.food_production` and its declaration (`food:want`): chosen by dailyLife.js by the fare band'],
  'src/domain/coherence/pageCensusFindings.js': [1, 'NEITHER', 'the battery\'s row FOODSEC reads the visitor pool by its key: an instrument, it prints nothing'],
  'src/domain/capacityModel.js': [4, 'HOME', 'the capacity model writes the production band'],
  'src/domain/aiGrounding.js': [2, 'NEITHER', 'the bands handed to the AI layer as grounding facts, the band as the band'],
  'src/domain/causalViews.js': [1, 'NEITHER', 'the simulation view counts the capacities; no line'],
  'src/domain/contradictions.js': [3, 'NEITHER', 'a diagnostic that sets food security against food production'],
  'src/domain/counterfactual.js': [1, 'NEITHER', 'before and after capacity states compared; the band as the band'],
  'src/domain/customContent.js': [2, 'NEITHER', 'a custom content kind that adds food production supply'],
  'src/domain/display/glossary.js': [1, 'NEITHER', 'the band words\' glossary'],
  'src/domain/explanation.js': [2, 'NEITHER', 'the explanation states the capacity\'s band, supply and demand'],
  'src/domain/magicProfile.js': [1, 'NEITHER', 'reads the magic capacity only'],
  'src/domain/qualitativeBands.js': [1, 'NEITHER', 'a band looked up by id'],
  'src/domain/regenerationDelta.js': [1, 'NEITHER', 'the capacity shifts between two births; the band as the band'],
});
const CLASSES = new Set(['SAYS SHORTAGE', 'SAYS SOURCE', 'NEITHER', 'HOME']);

describe('the food band readers: every reader of the production band or the fare band is classed', () => {
  const walk = (/** @type {string} */ d, /** @type {string[]} */ o = []) => {
    for (const e of readdirSync(d)) { const p = join(d, e); if (statSync(p).isDirectory()) walk(p, o); else if (/\.(js|jsx|mjs)$/.test(e)) o.push(p); }
    return o;
  };
  /** @type {Record<string, number>} */ const found = {};
  for (const f of walk(join(ROOT, 'src'))) {
    const code = readFileSync(f, 'utf8').replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' ')).split('\n').map((l) => l.replace(/\/\/.*$/, ''));
    const n = code.filter((l) => READS.test(l)).length;
    if (n) found[relative(ROOT, f)] = n;
  }
  it('anti-vacuity: the walk finds the home and the fare', () => {
    expect(found['src/domain/capacityModel.js']).toBeGreaterThan(0);
    expect(found['src/domain/dailyLife.js']).toBeGreaterThan(0);
  });
  it('every reading file is classed, with its exact count of reading lines (a new reader or a new read reds)', () => {
    expect(found).toEqual(Object.fromEntries(Object.entries(FOOD_BAND_READERS).map(([f, [n]]) => [f, n])));
    for (const [f, [, cls, why]] of Object.entries(FOOD_BAND_READERS)) {
      expect(CLASSES.has(cls), f).toBe(true);
      expect(why.length, f).toBeGreaterThan(20);
    }
  });
  it('in dailyLife.js the production band is read once, by the fare band (R24h: no reader of its own)', () => {
    const src = readFileSync(join(ROOT, 'src/domain/dailyLife.js'), 'utf8');
    expect(src.match(/capacities\.food_production\.band/g)?.length).toBe(1);
  });
});
