/**
 * pressureLadderMints.walker.test.js — SP-A, discharging J-FP-2.
 *
 * THE CLASS THIS EXISTS TO REMOVE. The discipline keeping the estate's pressure
 * vocabularies singular was, until this file, ruling J-WR-10-B plus two header comments
 * — the shared-substrate census's own words: *"NOTHING ENFORCES THE SINGLE LADDER. There
 * is no walker, no source-scan census, no shrink-only ratchet over OVERFLOW_BANDS
 * spellings."* Seven FP programs are about to read pressure. A ladder minted in a volume
 * would work perfectly, serialize fine, and mean something subtly different from the
 * first — invisible at runtime, permanent once two surfaces disagree.
 *
 * ⚠⚠ WHAT THIS WALKER MEASURED ON ITS FIRST RUN (2026-08-04 — REPORTED TO THE CHAIR).
 * The compiled architecture's §2b item 4 calls `OVERFLOW_BANDS` "THE ONE pressure
 * ladder". That is true of CAPACITY pressure. It is not true of the tree. There are TWO
 * ladders, and the second is declared NINE TIMES under EIGHT names:
 *
 *   CAPACITY PRESSURE — how full a settlement is. ONE authority, exactly as ruled.
 *     `OVERFLOW_BANDS` {easy, filling, pressed, overflowing} — demographicsResponses.js.
 *     demographicsPlans.js re-exports the binding as PLAN_OVERFLOW_BANDS: an alias.
 *
 *   THE INTENSITY LADDER — how hard something presses. {quiet, present, pressing,
 *     decisive}, with an optional `unknown` head, declared nine times for nine subjects:
 *       negotiationPictures.js            PRESSURE_BANDS               (5, private)
 *       conquestFeasibility.js            CONQUEST_PRESSURE_BANDS      (5)
 *       conquestIntent.js                 CONQUEST_MARTIAL_BANDS       (5)
 *       envoyNegotiationPictureBuilder.js PRESSURE_BANDS               (4, exported)
 *       conquestDoctrineStage.js          PRESSURE_WORDS               (4)
 *       compromiseRound.js                COMPROMISE_DRAIN_BANDS       (4)
 *       envoyErrandVocabulary.js          ENVOY_MORALE_EXHAUSTION_BANDS(4)
 *       warCosts.js                       WAR_HOME_FRONT_BANDS         (4)
 *       warTermination.js                 WAR_TERMINATION_BANDS        (4)
 *
 * Reusing ONE intensity vocabulary across nine subjects is good design — each names its
 * own subject and the reader learns one set of words. Declaring it nine times is the
 * per-volume-minting problem on exactly the class the runaway's lesson makes most
 * dangerous: nine tables that can drift, and nothing that would notice the first one
 * that did. This wave does not consolidate them — every one is a war-lane file, several
 * at or near the size ceiling, and SP-A's charter is zero existing-src edits — so the
 * set is FROZEN SHRINK-ONLY here and the rungs are pinned IDENTICAL across all nine.
 * The moment one of them changes a word, this reds and names it. Consolidation is a win
 * to be banked by lowering the list, never a reason to widen it.
 *
 * `pressed` (capacity) and `pressing` (intensity) already differ by one letter across
 * two ladders. That is the whole hazard in a word, which is why the two vocabularies are
 * pinned DISJOINT from live imports.
 *
 * WHAT RATCHETS AND WHAT DOES NOT. CONSUMERS may grow freely; that is the point of a
 * shared ladder, and freezing them would punish the reuse this walker argues for. MINTS
 * may not. The claim defended is "no new AUTHORITY on what pressure means", which is a
 * declaration count, not a call count — the distinction the satellites writer census
 * draws.
 *
 * THE SEMANTIC HALF. `OVERFLOW_BANDS` is a pressure LEVEL — how full. It is NOT a
 * DIRECTION. A program needing "growing / shrinking" borrows
 * `SOVEREIGNTY_TRAJECTORY_BANDS` or `populationTrendBand`; reading the wrong one is a
 * silent semantic error no walker catches, and the ruling that minted the direction
 * ladder (J-WR-10-B) turned on exactly this distinction. The law is authored once in
 * docs/DESIGN_FP_ARCH_SP.md and measured once in docs/DESIGN_FP_ARCH_CENSUS.md; both
 * anchors are pinned EXACTLY ONCE here (the first-match retargeting hole).
 *
 * THE DEAD-BAND RECEIPT IS EXECUTED, NOT ARGUED. The census established all four rungs
 * reachable by reading the arithmetic. An analytic pin that recomputes the guarded value
 * from the same tokens proves nothing, so this file DRIVES the real `pressureOf` over a
 * population grid and bands the results with the real `overflowBandOf`. If a clamp, a
 * threshold or a bound derivation ever put a rung out of reach, this reds.
 *
 * @enforced-by itself (a source scan + a live drive; no runtime coupling)
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';
import {
  OVERFLOW_BANDS,
  OVERFLOW_THRESHOLDS,
  overflowBandOf,
  bandDemandsResponse,
} from '../../src/domain/worldPulse/demographicsResponses.js';
import { pressureOf, DEMOGRAPHIC_TUNING } from '../../src/domain/worldPulse/demographicsRates.js';
import { SOVEREIGNTY_TRAJECTORY_BANDS } from '../../src/domain/worldPulse/sovereigntyAppraisal.js';
import { CONQUEST_PRESSURE_BANDS } from '../../src/domain/worldPulse/conquestFeasibility.js';
import { PRESSURE_BANDS as ENVOY_PICTURE_PRESSURE_BANDS } from '../../src/domain/worldPulse/envoyNegotiationPictureBuilder.js';
import { NEGOTIATION_SUBJECT_BANDS } from '../../src/domain/worldPulse/negotiationPictures.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

/** THE CAPACITY-PRESSURE ladder's one authority. SHRINK-ONLY — never widen. */
const CAPACITY_PRESSURE_MINTS = Object.freeze([
  'src/domain/worldPulse/demographicsResponses.js',
]);

/** THE INTENSITY LADDER's nine pre-existing declaration sites. SHRINK-ONLY backlog. */
const INTENSITY_LADDER_DECLARERS = Object.freeze([
  'src/domain/worldPulse/compromiseRound.js',
  'src/domain/worldPulse/conquestDoctrineStage.js',
  'src/domain/worldPulse/conquestFeasibility.js',
  'src/domain/worldPulse/conquestIntent.js',
  'src/domain/worldPulse/envoyErrandVocabulary.js',
  'src/domain/worldPulse/envoyNegotiationPictureBuilder.js',
  'src/domain/worldPulse/negotiationPictures.js',
  'src/domain/worldPulse/warCosts.js',
  'src/domain/worldPulse/warTermination.js',
]);

/** The eight const names that one ladder wears. A NINTH name reds — the drift this
 *  walker makes visible is a vocabulary wearing more disguises, not fewer. */
const INTENSITY_LADDER_NAMES = Object.freeze([
  'COMPROMISE_DRAIN_BANDS',
  'CONQUEST_MARTIAL_BANDS',
  'CONQUEST_PRESSURE_BANDS',
  'ENVOY_MORALE_EXHAUSTION_BANDS',
  'PRESSURE_BANDS',
  'PRESSURE_WORDS',
  'WAR_HOME_FRONT_BANDS',
  'WAR_TERMINATION_BANDS',
]);

/** The intensity rungs, without the optional `unknown` head. */
const INTENSITY_RUNGS = Object.freeze(['quiet', 'present', 'pressing', 'decisive']);

/** A lawful re-export alias, named so the exclusion below is a measured claim rather
 *  than a hole: it binds the mint's own export and declares no vocabulary. */
const LAWFUL_REEXPORT = 'src/domain/worldPulse/demographicsPlans.js';

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const SRC_FILES = walk(join(ROOT, 'src'))
  .filter((p) => /\.(js|jsx)$/.test(p))
  .map((p) => ({ rel: relative(ROOT, p).replace(/\\/g, '/'), src: readFileSync(p, 'utf8') }))
  .sort((a, b) => a.rel.localeCompare(b.rel));

/**
 * Every array literal of quoted lowercase-token members in a source, with the identifier
 * it is assigned to (or '?') and its 1-based line.
 * @param {string} src @returns {{name: string, members: string[], line: number}[]}
 */
function vocabularyLiterals(src) {
  const out = [];
  for (const m of src.matchAll(/\[([^[\]]*)\]/g)) {
    const members = [...m[1].matchAll(/'([^']*)'/g)].map((q) => q[1]);
    if (members.length === 0) continue;
    const before = src.slice(Math.max(0, m.index - 160), m.index);
    const named = before.match(/([A-Za-z_$][\w$]*)\s*=\s*(?:Object\.freeze\(\s*)?$/);
    out.push({ name: named ? named[1] : '?', members, line: src.slice(0, m.index).split('\n').length });
  }
  return out;
}

/**
 * Files declaring an array literal whose quoted members are EXACTLY `words`.
 * @param {readonly string[]} words @returns {string[]}
 */
function filesDeclaringVocabulary(words) {
  const target = [...words].sort().join('|');
  return SRC_FILES
    .filter(({ src }) => vocabularyLiterals(src).some((v) => [...v.members].sort().join('|') === target))
    .map(({ rel }) => rel);
}

/** Every (file, name, members) declaring the intensity ladder, with or without `unknown`. */
function intensityDeclarations() {
  const withHead = ['unknown', ...INTENSITY_RUNGS].sort().join('|');
  const bare = [...INTENSITY_RUNGS].sort().join('|');
  const out = [];
  for (const { rel, src } of SRC_FILES) {
    for (const v of vocabularyLiterals(src)) {
      const key = [...v.members].sort().join('|');
      if (key === withHead || key === bare) out.push({ rel, name: v.name, members: v.members });
    }
  }
  return out;
}

/**
 * Files declaring a `…PRESSURE…_BANDS` / `…OVERFLOW…_BANDS` const with a VALUE of its
 * own. A bare alias (`= OVERFLOW_BANDS;`) binds a mint and is not a declaration.
 *
 * THE RIGHT-HAND SIDE IS CAPTURED AND TESTED SEPARATELY rather than excluded with a
 * negative lookahead. `\s*=\s*(?!ALIAS)` looks correct and is not: the `\s*` before the
 * lookahead backtracks to zero width, the lookahead then reads a leading SPACE instead
 * of the alias, and every alias in the tree passes the filter. That hole was live in
 * this walker's first draft and reported a false authority.
 * @returns {string[]}
 */
function filesDeclaringPressureBandNames() {
  const decl = /\b(?:const|let|var)\s+([A-Z0-9_]*(?:PRESSURE|OVERFLOW)[A-Z0-9_]*_BANDS)\s*=([^;\n]*)/g;
  const hits = [];
  for (const { rel, src } of SRC_FILES) {
    for (const m of src.matchAll(decl)) {
      // A bare identifier RHS is a re-export alias; anything else declares a value.
      if (/^\s*[A-Za-z_$][\w$]*\s*$/.test(m[2])) continue;
      hits.push(rel);
      break;
    }
  }
  return hits;
}

/** Files that CALL the capacity ladder's banding reads — deliberately unfrozen. */
function pressureBandConsumers() {
  return SRC_FILES
    .filter(({ src }) => /\boverflowBandOf\s*\(|\bbandDemandsResponse\s*\(/.test(src))
    .map(({ rel }) => rel);
}

const flat = (rel) => readFileSync(join(ROOT, rel), 'utf8').replace(/\s+/g, ' ');
const occurrences = (haystack, needle) => haystack.split(needle).length - 1;

describe('J-FP-2 — the pressure-ladder mint census (shrink-only)', () => {
  test('the scanners see a real denominator (guard the guard)', () => {
    expect(SRC_FILES.length).toBeGreaterThan(500);
    // The vocabulary detector is proven live on a vocabulary declared more than once.
    const tiers = filesDeclaringVocabulary(['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']);
    expect(tiers.length, 'the array-vocabulary detector matched nothing').toBeGreaterThanOrEqual(2);
    // A vocabulary nobody declares reads empty, so the detector discriminates.
    expect(filesDeclaringVocabulary(['no_such_band', 'nor_this_one'])).toEqual([]);
  });

  test('CAPACITY pressure has exactly ONE authority', () => {
    expect(
      filesDeclaringVocabulary(OVERFLOW_BANDS),
      'a second file declares the capacity-pressure vocabulary. Import OVERFLOW_BANDS'
      + ' from demographicsResponses.js rather than widening this list: a second authority'
      + ' on what "pressed" means is invisible at runtime and permanent once two surfaces'
      + ' disagree.',
    ).toEqual([...CAPACITY_PRESSURE_MINTS]);
  });

  test('THE INTENSITY LADDER is declared in exactly the nine frozen files', () => {
    const files = [...new Set(intensityDeclarations().map((d) => d.rel))].sort();
    expect(
      files,
      'the intensity ladder {quiet, present, pressing, decisive} gained or lost a'
      + ' declaration. GAINED: import one of the nine existing spellings instead — nine'
      + ' is already the backlog this walker froze, and a tenth is a tenth table that can'
      + ' drift. LOST: lower the frozen list so the consolidation is banked.',
    ).toEqual([...INTENSITY_LADDER_DECLARERS]);
  });

  test('THE INTENSITY LADDER wears exactly the eight frozen names', () => {
    const names = [...new Set(intensityDeclarations().map((d) => d.name))].sort();
    expect(names, 'a ninth alias for one ladder — name drift is how nine become ten').toEqual([...INTENSITY_LADDER_NAMES]);
  });

  test('all nine declarations spell the SAME rungs (the drift tripwire)', () => {
    const declarations = intensityDeclarations();
    expect(declarations.length, 'the intensity scan matched nothing').toBe(9);
    for (const d of declarations) {
      const tail = d.members[0] === 'unknown' ? d.members.slice(1) : d.members;
      expect(
        tail,
        `${d.rel} (${d.name}) no longer spells the shared intensity rungs — the first`
        + ' drift among nine copies is exactly what this walker was landed to catch',
      ).toEqual([...INTENSITY_RUNGS]);
    }
  });

  test('EVERY *PRESSURE*_BANDS / *OVERFLOW*_BANDS declaration is accounted for', () => {
    // A name-shaped scan orthogonal to the vocabulary one: it catches a pressure ladder
    // spelled in DIFFERENT words, which the member-set detector by construction cannot.
    const known = new Set([...CAPACITY_PRESSURE_MINTS, ...INTENSITY_LADDER_DECLARERS]);
    const unaccounted = filesDeclaringPressureBandNames().filter((rel) => !known.has(rel));
    expect(
      unaccounted,
      'a module declares a pressure band vocabulary in words no existing ladder uses —'
      + ' borrow a ladder, or record why nothing existed (J-WR-10-B)',
    ).toEqual([]);
  });

  test('the re-export alias is recognised AS an alias, not counted as a mint', () => {
    const src = readFileSync(join(ROOT, LAWFUL_REEXPORT), 'utf8');
    expect(src, 'the alias moved — re-anchor the exclusion').toMatch(/PLAN_OVERFLOW_BANDS\s*=\s*OVERFLOW_BANDS\s*;/);
    // The scan is proven live by the capacity-mint equality above, so
    // anchored: this exclusion measures the alias carve-out against a real, correct set.
    expect(filesDeclaringPressureBandNames()).not.toContain(LAWFUL_REEXPORT);
  });

  test('CONSUMERS may grow — this walker ratchets authorities, not call sites', () => {
    const consumers = pressureBandConsumers();
    expect(consumers, 'the consumer scan matched nothing').toContain(CAPACITY_PRESSURE_MINTS[0]);
    expect(consumers.length).toBeGreaterThanOrEqual(2);
  });

  test('MUTANT: a tenth declaring file IS caught by the same comparison', () => {
    const mutant = [...INTENSITY_LADDER_DECLARERS, 'src/domain/worldPulse/capacityModel.js'].sort();
    // anchored: the unmutated measurement is asserted equal to the frozen list two tests
    // above, so this inequality measures the mutation and not an always-false comparison.
    expect(mutant).not.toEqual([...INTENSITY_LADDER_DECLARERS]);
    expect(mutant.length).toBe(INTENSITY_LADDER_DECLARERS.length + 1);
  });
});

describe('J-FP-2 — the two ladders, and LEVEL is not DIRECTION', () => {
  test('CAPACITY and INTENSITY share no word', () => {
    expect(OVERFLOW_BANDS.length).toBe(4);
    expect(CONQUEST_PRESSURE_BANDS.length).toBe(5);
    const overlap = OVERFLOW_BANDS.filter((w) => CONQUEST_PRESSURE_BANDS.includes(w));
    expect(
      overlap,
      'the capacity ladder and the intensity ladder now share a word — `pressed` and'
      + ' `pressing` already differ by one letter across the two, and a shared rung would'
      + ' make reading the wrong one a spelling coincidence away',
    ).toEqual([]);
  });

  test("the intensity ladder's two arities differ ONLY by the `unknown` head", () => {
    expect(CONQUEST_PRESSURE_BANDS).toEqual(NEGOTIATION_SUBJECT_BANDS.foodPressureBand);
    expect(CONQUEST_PRESSURE_BANDS[0]).toBe('unknown');
    expect(CONQUEST_PRESSURE_BANDS.slice(1)).toEqual([...ENVOY_PICTURE_PRESSURE_BANDS]);
    expect([...ENVOY_PICTURE_PRESSURE_BANDS]).toEqual([...INTENSITY_RUNGS]);
  });

  test('LEVEL and DIRECTION share no word, measured from live imports', () => {
    expect(SOVEREIGNTY_TRAJECTORY_BANDS.length).toBeGreaterThanOrEqual(3);
    const overlap = OVERFLOW_BANDS.filter((w) => SOVEREIGNTY_TRAJECTORY_BANDS.includes(w));
    expect(overlap, 'the LEVEL ladder and the DIRECTION ladder now share a word').toEqual([]);
  });

  test('the law is authored ONCE and measured ONCE (the first-match retargeting hole)', () => {
    const sp = flat('docs/DESIGN_FP_ARCH_SP.md');
    const census = flat('docs/DESIGN_FP_ARCH_CENSUS.md');
    expect(occurrences(sp, 'THE LADDER LAW (J-FP-2)')).toBe(1);
    expect(occurrences(sp, 'is a pressure LEVEL, never a DIRECTION')).toBe(1);
    expect(occurrences(census, 'is a LEVEL, not a DIRECTION')).toBe(1);
    // A phrase neither doc carries reads zero, so the counter discriminates rather than
    // matching everything.
    expect(occurrences(sp, 'is a DIRECTION, never a LEVEL')).toBe(0);
  });
});

describe('J-FP-2 — the dead-band receipt, EXECUTED rather than argued', () => {
  test('every rung of the capacity ladder is reachable by driving the real pressure read', () => {
    const bound = 100;
    const reached = new Set();
    // Population 0 → 2.5x the bound: the whole span the clamp admits, and past it.
    for (let pop = 0; pop <= 250; pop += 1) {
      reached.add(overflowBandOf(pressureOf(pop, bound)));
    }
    expect([...reached].sort()).toEqual([...OVERFLOW_BANDS].sort());
  });

  test('the clamp still admits the top rung (the ratio-band dead-band class)', () => {
    // The class that has bitten three ways: a band whose entry threshold sits above the
    // measured ceiling of its own input is DEAD and every "fix" to it stays green.
    expect(DEMOGRAPHIC_TUNING.PRESSURE_MAX).toBeGreaterThan(OVERFLOW_THRESHOLDS.overflowing);
    expect(pressureOf(10_000, 100)).toBe(DEMOGRAPHIC_TUNING.PRESSURE_MAX);
    expect(overflowBandOf(DEMOGRAPHIC_TUNING.PRESSURE_MAX)).toBe('overflowing');
  });

  test('the demand rung is inside the ladder and splits it (both answers reachable)', () => {
    const answers = OVERFLOW_BANDS.map(bandDemandsResponse);
    expect(answers).toEqual([false, false, true, true]);
  });
});
