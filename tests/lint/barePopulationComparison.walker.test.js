/**
 * barePopulationComparison.walker.test.js — NO BARE POPULATION NUMBER IN THE ENGINE
 * (X-46 car 2, 3b; docs/DESIGN_X46_SCALE_TRAIN.md §3b).
 *
 * Every population comparison written as `pop >= 5000` / `population < 200` was written for a
 * set of tier bands (a town 901–5,000, a city 5,001–25,000) and silently reads wrongly the day
 * the bands move: under the owner's historical bands (X-46 car 1) "pop >= 5000 is dense" became
 * a mid-sized city and "pop < 200 is thin" cut a village in half. So a site that means a TIER
 * CUT reads `src/data/constants.js :: TIER_STAMP_CUTS`, and a site whose meaning is not a tier
 * cut reads a named constant in `src/data/populationThresholds.js`; neither carries the figure
 * at the comparison. This walker pins the census at ZERO: it walks every `.js`/`.jsx` under
 * src/ (constants.js, the one home of the bands, excepted), blanks comments and string text
 * (`tests/helpers/codeOnlySource.js :: codeOnly` — a comment recalling the old `pop >= 5000`
 * is history, not a comparison), and fails naming each offending `file:line`.
 *
 * Measured at 8cc245db0 (before the cure): 17 live comparisons, causalState.js 4 and
 * capacityModel.js 13 (the brief's grep also hits four prose lines, which codeOnly blanks).
 *
 * THE SECOND ARM — A ROLL-BAND MINIMUM IS A CURRENT TIER'S FLOOR, NEVER THE NEXT TIER'S THRESHOLD
 * (LANDING-7 lane B, ruling R-B4). The census above sees a bare figure; it cannot see
 * `pop >= POPULATION_RANGES.hamlet.min`, which carries no figure and is the same defect once the
 * owner's roll bands overlap (X-46 car 1): a hamlet ROLLS from 20 and is STAMPED from 25, so a
 * reader asking "has this place reached the next tier?" must read `TIER_STAMP_CUTS`. Two readers
 * did exactly that after car 2 (the in-orbit ladder of settlementLifecycleKernel.js and
 * demographicsResponses.js :: nextTierHeadroom / at_threshold) and were re-based under R-B3. The
 * arm keeps a REGISTER of every code site that reads `POPULATION_RANGES` (outside its home),
 * keyed `file :: binding` (the `const` declared on the line, else the nearest enclosing function
 * or top-level const), each with the law that lets it read the band: a CURRENT tier's own floor
 * (the demotion floor, the viability grade, a parent's headroom; "a town rolled at 300–349 is
 * legitimate"), the MINT (a place just made a tier is clamped into that tier's own band), a ratio
 * that crosses nothing, or generation's roll and its display. A site not in the register fails,
 * so a new next-tier reader cannot land unseen; a register row with no site fails, so the
 * register cannot rot. A band-floor HELPER (`tierFloorOf`, `floorOf`) called with a next-tier
 * argument is convicted by name. The honest limit: an aliased import (`POPULATION_RANGES as X`)
 * or a table passed through a parameter is not followed.
 *
 * Measured at 8e568c729 (before R-B3): 3 unregistered sites (settlementLifecycleKernel.js ::
 * hamletMin twice, :: villageMin) and 2 next-tier helper calls (demographicsResponses.js ::
 * tierFloorOf(next), tierFloorOf(nextTierOf(...))); 0 and 0 after.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';
import { codeOnly } from '../helpers/codeOnlySource.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const SRC = join(ROOT, 'src');

/** The census pattern: the design's own grep (§3b), a population name against a 3+ digit figure. */
const BARE_POPULATION_COMPARISON = /(population|pop) *(>|<|>=|<=) *[0-9][0-9_]{2,}/;

/**
 * Files exempt from the census, by path, with the reason. Only the bands' own home: no engine
 * site survives as an exception.
 * @type {Readonly<Record<string, string>>}
 */
const EXCEPTIONS = Object.freeze({
  'src/data/constants.js': 'the one home of POPULATION_RANGES and TIER_STAMP_CUTS: the bands themselves',
});

function walk(dir, out = []) {
  for (const entry of readdirSync(dir).sort()) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(js|jsx)$/.test(entry)) out.push(full);
  }
  return out;
}

/** @param {string} source @returns {number[]} 1-based lines carrying a bare comparison in CODE */
function bareComparisonLines(source) {
  return codeOnly(source).split('\n')
    .map((line, i) => (BARE_POPULATION_COMPARISON.test(line) ? i + 1 : 0))
    .filter(Boolean);
}

describe('X-46 3b: no bare population comparison in the engine', () => {
  const files = walk(SRC);

  test('the walk sees the engine (non-vacuous) and every exception is a real file', () => {
    expect(files.length).toBeGreaterThan(500);
    const rel = new Set(files.map(f => relative(ROOT, f)));
    for (const path of Object.keys(EXCEPTIONS)) expect(rel.has(path), path).toBe(true);
  });

  test('the detector convicts a bare comparison in code and spares one in prose (executed control)', () => {
    expect(bareComparisonLines('if (pop >= 5000) x();')).toEqual([1]);
    expect(bareComparisonLines('const a = 1;\nif (s.population < 200) y();')).toEqual([2]);
    expect(bareComparisonLines('// used to read pop >= 5000\nconst t = "pop >= 5000";')).toEqual([]);
    expect(bareComparisonLines('if (pop >= TIER_STAMP_CUTS.city) z();')).toEqual([]);
  });

  test('zero bare population comparisons outside the exceptions', () => {
    const offenders = [];
    for (const file of files) {
      const rel = relative(ROOT, file);
      if (EXCEPTIONS[rel]) continue;
      for (const line of bareComparisonLines(readFileSync(file, 'utf8'))) offenders.push(`${rel}:${line}`);
    }
    expect(offenders).toEqual([]);
  });
});

/**
 * The register of every roll-band reader, keyed `file :: binding`, with the law that lets it read
 * the band rather than the stamp (LANDING-7 R-B4). Every row is a reader of a CURRENT tier's own
 * band or not a crossing at all; a next-tier threshold has no row and reads TIER_STAMP_CUTS.
 * @type {Readonly<Record<string, string>>}
 */
const BAND_READERS = Object.freeze({
  // A current tier's own floor (the file's law: a place rolled anywhere in its own band is legitimate).
  'src/domain/worldPulse/tierResourceDynamics.js :: currentMin': 'own floor: the demotion floor of the tier the place holds',
  'src/domain/worldPulse/settlementLifecycleKernel.js :: parentMin': 'own floor: a parent never founds or feeds a steading below its own tier floor',
  'src/domain/worldPulse/settlementLifecycleFirstClass.js :: thorpMin': 'own floor: the terminal-decline floor of the lowest tier',
  'src/domain/worldPulse/demographicsRates.js :: floor': 'own floor: tierViabilityOf grades the tier the place holds',
  'src/domain/worldPulse/demographicsLadder.js :: tierFloorOf': 'own floor: the viability ladder grades the tier the place holds',
  'src/domain/worldPulse/demographicsResponses.js :: tierFloorOf': 'own floor: the viability grade of input.tier (next-tier reads go through tierCutOf)',
  'src/domain/highWater.js :: TIER_FLOOR': 'own floor: the least population a recorded tier implies, a reading, not a crossing',
  // The mint: a place just made a tier is clamped into that tier's own band.
  'src/domain/worldPulse/tierOutcomeApply.js :: promotedFloor': 'mint: the promoted place is clamped into its new tier\'s own band',
  'src/domain/events/mutateEntities.js :: band': 'mint: SHIFT_TIER rebands the place into its destination tier\'s own band',
  // A ratio, not a crossing.
  'src/domain/worldPulse/settlementLifecycleKernel.js :: range': 'ratio: seedingDrive reads pop / the current band max',
  'src/domain/worldPulse/tierResourceDynamics.js :: tierEligibility': 'ratio: the promotion severity weight pop / next min (R-B1 left it, eligibility reads the cut); for the chair',
  // Generation's roll and the band's display: the band itself is the subject.
  'src/generators/steps/resolveConfig.js :: popRange': 'roll: generation draws the population from the band',
  'src/generators/density/densityRoll.js :: band': 'roll: the population tilt reads the place inside its band',
  'src/generators/foodGenerator.js :: range': 'roll: the band midpoint as a default population',
  'src/generators/foodGenerator.js :: tierDefaultPop': 'roll: the band midpoint as a default population',
  'src/generators/lookups.js :: getPopulationRanges': 'roll: the generator lookup accessor for the whole table',
  'src/data/institutionBudget.js :: band': 'roll: the institution budget reads the band midpoint',
  'src/components/ConfigurationPanel.jsx :: r': 'display: the band printed in the configuration dropdown',
  'src/components/HomeHero.jsx :: r': 'display: the band printed on the gauge',
});

/** The band-floor helpers whose CALL must not pass a next tier. */
const BAND_FLOOR_HELPERS = /\b(tierFloorOf|floorOf)\s*\(([^)]*)/g;

/** Blank import/export name lists (a name in a list is not a read), preserving offsets. */
function blankNameLists(code) {
  return code.replace(/^\s*(import|export)\s*\{[^}]*\}[^\n;]*;?/gm, (m) => m.replace(/[^\n]/g, ' '));
}

/** @param {string} source @returns {string[]} the binding of each line reading POPULATION_RANGES in code */
function bandReaderBindings(source) {
  const lines = blankNameLists(codeOnly(source)).split('\n');
  const out = [];
  lines.forEach((line, i) => {
    if (!/\bPOPULATION_RANGES\b/.test(line)) return;
    let name = (line.match(/\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=/) || [])[1];
    for (let j = i; !name && j >= 0; j -= 1) {
      const m = lines[j].match(/\bfunction\s+([A-Za-z_$][\w$]*)\s*\(/)
        || lines[j].match(/^(?:export\s+)?const\s+([A-Za-z_$][\w$]*)\s*=/);
      if (m) name = m[1];
    }
    out.push(String(name || '<top>'));
  });
  return out;
}

/** @param {string} source @returns {string[]} band-floor helper calls whose argument names a next tier */
function nextTierHelperCalls(source) {
  const out = [];
  for (const m of codeOnly(source).matchAll(BAND_FLOOR_HELPERS)) {
    if (/next/i.test(m[2])) out.push(`${m[1]}(${m[2].trim()})`);
  }
  return out;
}

describe('X-46 3b, second arm (R-B4): a roll-band minimum is read only as a current tier\'s own band', () => {
  const files = walk(SRC);

  test('the detectors convict a next-tier band read and spare a registered one (executed control)', () => {
    expect(bandReaderBindings('const hamletMin = POPULATION_RANGES.hamlet.min;')).toEqual(['hamletMin']);
    expect(bandReaderBindings('function f(t) {\n  return POPULATION_RANGES[t].min;\n}')).toEqual(['f']);
    expect(bandReaderBindings('import { POPULATION_RANGES } from "x";\n// POPULATION_RANGES.town.min')).toEqual([]);
    expect(nextTierHelperCalls('a >= tierFloorOf(next);\nb(tierFloorOf(nextTierOf(t)));')).toEqual(['tierFloorOf(next)', 'tierFloorOf(nextTierOf(t)']);
    expect(nextTierHelperCalls('tierFloorOf(input.tier); floorOf(stamp);')).toEqual([]);
  });

  test('every roll-band reader in src is in the register, and every register row is a live site', () => {
    const offenders = [];
    const seen = new Set();
    for (const file of files) {
      const rel = relative(ROOT, file);
      if (EXCEPTIONS[rel]) continue;
      for (const name of bandReaderBindings(readFileSync(file, 'utf8'))) {
        const key = `${rel} :: ${name}`;
        seen.add(key);
        if (!BAND_READERS[key]) offenders.push(key);
      }
    }
    expect(offenders, 'a next-tier threshold reads TIER_STAMP_CUTS, not a roll-band minimum').toEqual([]);
    expect(Object.keys(BAND_READERS).filter((key) => !seen.has(key)), 'stale register rows').toEqual([]);
  });

  test('no band-floor helper is called with a next tier', () => {
    const offenders = [];
    for (const file of files) {
      const rel = relative(ROOT, file);
      for (const call of nextTierHelperCalls(readFileSync(file, 'utf8'))) offenders.push(`${rel} :: ${call}`);
    }
    expect(offenders).toEqual([]);
  });
});
