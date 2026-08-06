/**
 * significanceMigration.census.test.js — SP-E. THE SP-6a MIGRATION CENSUS.
 *
 * ASSESSMENT FIRST. SP-A minted the one significance family (bandFamilies.js) and edited no
 * existing source; the surfaces that should read it still spell their own comparisons inline.
 * This census NAMES that debt, gives it a number that can only shrink, and reads
 * `src/components/map/heraldFeed.js` WITHOUT EDITING IT. Each surface migrates in its own
 * small wave; SP-E's job is to make sure nobody has to rediscover the list.
 *
 * ── THREE CLASSES, MEASURED 2026-08-06, NOT ONE ─────────────────────────────────
 *
 * The compiled architecture describes ONE defect ("heraldFeed.js:95 mixes a banded
 * significance word with a raw 0.72 float"). The tree carries THREE, and the two the doc does
 * not name are the worse ones:
 *
 *   CLASS A — AD-HOC WORD COMPARISON. 40 occurrences across 20 modules compare `significance`
 *     to a string literal instead of asking the family. Ordinary drift risk: twelve
 *     independently authored scales is the condition bandFamilies.js was minted to end.
 *
 *   CLASS B — THE WORD/FLOAT TYPE COLLISION. 5 occurrences across 3 modules compare
 *     `significance` to a NUMBER. The engine's registries author it as one of three WORDS;
 *     these read it as a 0..1 scalar. Same field name, two types, no walker between them.
 *
 *   CLASS C — THE MIXED DECISION. 2 occurrences decide "is this major?" from a banded word OR
 *     a raw float in one expression. The doc names ONE of them (heraldFeed.js);
 *     HeraldAdjudication.jsx carries the second with the same 0.72 constant re-typed.
 *
 * ── THE MEASURED CONSEQUENCE, SO THE DEBT IS NOT ABSTRACT ───────────────────────
 *
 * `realmItemReadModel.js`'s `significanceOf` maps significance words to floats against a
 * FOURTH vocabulary — {major, critical, moderate, minor} — and returns a 0.35 default for
 * everything else. `notable` and `routine` are the two words the estate's registries actually
 * author on 65 of their 106 kinds, and NEITHER is in that ladder: both fall through to the
 * same 0.35 an item with no significance at all receives. A notable kind is graded exactly as
 * an unclassified one. That is what an ad-hoc scale costs, stated in the tree's own values.
 *
 * ── WHAT THIS FILE IS NOT ───────────────────────────────────────────────────────
 *
 * It is not a repair and it must not become one. It edits nothing. Every count is SHRINK-ONLY,
 * so a wave that migrates a surface lowers a number here and the debt is banked; a wave that
 * adds a new ad-hoc comparison reds and has to argue for it.
 *
 * @enforced-by this file
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';

import { SIGNIFICANCE_CLASSES } from '../../src/domain/worldPulse/bandFamilies.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

/** The one module allowed to speak the family's words as its own vocabulary. */
const FAMILY_HOME = 'src/domain/worldPulse/bandFamilies.js';

/** The doc the SP program's tuning surface lives in. */
const SP_VOLUME = 'docs/DESIGN_FP_ARCH_SP.md';

/** The FIRST migration target, named by the architecture and by SP-A's own module header. */
const FIRST_TARGET = 'src/components/map/heraldFeed.js';

/** The module whose fourth vocabulary makes the debt measurable. */
const FOURTH_VOCABULARY_HOME = 'src/domain/realm/realmItemReadModel.js';

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

/**
 * CODEPOINT ORDER, NOT `localeCompare`. The frozen file lists below are compared with
 * `toEqual`, so their ORDER is part of the pin — and `localeCompare` collates through the
 * host's ICU tables, which sort `heraldFeed.js` and `WorldPulsePanel.jsx` differently from a
 * codepoint sort. A census frozen under host collation reds on somebody else's machine for no
 * reason at all. (Found by this file's own first run, which is why it is spelled out here.)
 * @param {string} x @param {string} y @returns {number}
 */
const byCodepoint = (x, y) => (x < y ? -1 : x > y ? 1 : 0);

const SRC_FILES = walk(join(ROOT, 'src'))
  .filter((p) => /\.(js|jsx)$/.test(p))
  .map((p) => ({ rel: relative(ROOT, p).replace(/\\/g, '/'), src: readFileSync(p, 'utf8') }))
  .filter((f) => f.rel !== FAMILY_HOME)
  .sort((x, y) => byCodepoint(x.rel, y.rel));

/** `significance` compared to a string literal — the ad-hoc word comparison. */
const CLASS_A = /significance\s*(?:===|!==)\s*'[a-z/]+'/g;
/** `significance` compared to a NUMBER — the word/float type collision. */
const CLASS_B = /significance\s*(?:>=|<=|>|<)\s*[0-9]/g;
/** A banded word and a raw float deciding ONE thing on one line — the mixed decision. */
const CLASS_C = /significance\s*(?:===|!==)\s*'[a-z/]+'[^\n]*?(?:>=|<=|>|<)\s*0\.[0-9]/g;

/**
 * @param {RegExp} pattern
 * @returns {{ files: string[], occurrences: number }}
 */
function tally(pattern) {
  const files = [];
  let occurrences = 0;
  for (const { rel, src } of SRC_FILES) {
    const hits = src.match(pattern);
    if (!hits) continue;
    files.push(rel);
    occurrences += hits.length;
  }
  return { files, occurrences };
}

const a = tally(CLASS_A);
const b = tally(CLASS_B);
const c = tally(CLASS_C);

describe('SP-6a migration census — anti-vacuity anchors', () => {
  test('the scan sees a real denominator', () => {
    // Every SHRINK-ONLY ceiling below is worthless if the walk stopped finding files or the
    // patterns stopped matching: an empty scan reports zero debt and passes every bound.
    expect(SRC_FILES.length).toBeGreaterThan(500);
    expect(SRC_FILES.map((f) => f.rel)).not.toContain(FAMILY_HOME);
    expect(SRC_FILES.map((f) => f.rel)).toContain(FIRST_TARGET);
    expect(a.occurrences, 'the class-A pattern matched nothing').toBeGreaterThanOrEqual(1);
    expect(b.occurrences, 'the class-B pattern matched nothing').toBeGreaterThanOrEqual(1);
    expect(c.occurrences, 'the class-C pattern matched nothing').toBeGreaterThanOrEqual(1);
  });

  test('the family the surfaces must migrate ONTO is the three-word one', () => {
    expect([...SIGNIFICANCE_CLASSES]).toEqual(['routine', 'notable', 'major']);
  });
});

describe('SP-6a migration census — CLASS A: ad-hoc word comparison', () => {
  test('the ad-hoc comparison census is SHRINK-ONLY', () => {
    // 20 modules / 40 occurrences at the freeze. A wave that migrates one lowers both numbers;
    // a wave that spells a new inline comparison reds and must argue for it.
    expect(a.files.length).toBeLessThanOrEqual(20);
    expect(a.occurrences).toBeLessThanOrEqual(40);
    // Proven live at the freeze, so the ceilings measure a real inventory rather than a bound
    // nothing touches.
    expect(a.files).toHaveLength(20);
    expect(a.occurrences).toBe(40);
  });

  test('the named debtors are the ones the migration waves will visit', () => {
    // The list itself, frozen. A file LEAVING it is the win this census exists to bank; a file
    // joining it reds above. Spelled out so a migration wave can be scoped from this file
    // alone without re-running a grep nobody wrote down.
    expect(a.files).toEqual([
      'src/components/map/ChroniclersLetterPanel.jsx',
      'src/components/map/HeraldAdjudication.jsx',
      'src/components/map/WorldPulsePanel.jsx',
      'src/components/map/heraldFeed.js',
      'src/components/new/tabs/RumorsTab.jsx',
      // (codepoint order: capitals sort before lower-case, so heraldFeed.js follows the panels)
      'src/domain/display/chroniclersLetter.js',
      'src/domain/display/settlementRumors.js',
      'src/domain/realm/realmItemReadModel.js',
      'src/domain/spatial/rumorNetwork.js',
      'src/domain/worldPulse/auspice.js',
      'src/domain/worldPulse/chronicle.js',
      'src/domain/worldPulse/dispositionNews.js',
      'src/domain/worldPulse/envoyNews.js',
      'src/domain/worldPulse/lineageNews.js',
      'src/domain/worldPulse/roadsKernel.js',
      'src/domain/worldPulse/sovereigntyNews.js',
      'src/domain/worldPulse/treatyLifecycleVoice.js',
      'src/domain/worldPulse/warCoalitionNews.js',
      'src/domain/worldPulse/warCostsNews.js',
      'src/domain/worldPulse/warRulingsNews.js',
    ]);
  });
});

describe('SP-6a migration census — CLASS B: the word/float type collision', () => {
  test('three modules read `significance` as a NUMBER, and that is frozen shrink-only', () => {
    expect(b.files.length).toBeLessThanOrEqual(3);
    expect(b.occurrences).toBeLessThanOrEqual(5);
    expect(b.files).toEqual([
      'src/components/map/HeraldCommandBody.jsx',
      'src/components/map/heraldCommandSelectors.js',
      'src/domain/realm/realmItemReadModel.js',
    ]);
    expect(b.occurrences).toBe(5);
  });

  test('ONE module reads the same field BOTH ways — the sharpest single site', () => {
    // realmItemReadModel.js compares `significance` to string literals AND to floats. It is
    // therefore the migration wave with the most to untangle, and naming it here is the point
    // of doing a census before a repair.
    const both = a.files.filter((rel) => b.files.includes(rel));
    expect(both).toEqual([FOURTH_VOCABULARY_HOME]);
  });
});

describe('SP-6a migration census — CLASS C: the mixed decision', () => {
  test('the tree carries TWO mixed decisions, not the one the doc names', () => {
    // ⚠ A DOC CORRECTION, RECORDED RATHER THAN SILENTLY ABSORBED. The compiled architecture and
    // SP-A's module header both name heraldFeed.js as THE counter-example. HeraldAdjudication
    // .jsx makes the identical decision with the identical 0.72 constant re-typed, and no doc
    // names it. Both are frozen here so the second cannot be missed by a wave that reads only
    // the volume.
    expect(c.files).toEqual([
      'src/components/map/HeraldAdjudication.jsx',
      FIRST_TARGET,
    ]);
    expect(c.occurrences).toBeLessThanOrEqual(2);
    expect(c.occurrences).toBe(2);
  });
});

describe('SP-6a migration census — the FIRST target, read and never edited', () => {
  test('heraldFeed.js still carries the ad-hoc read, by SYMBOL not by line number', () => {
    // Navigated by symbol: a line address rots the moment anything above it moves. The claim
    // is that `toHeraldItem` still decides `major` from a banded word OR a raw float.
    const src = readFileSync(join(ROOT, FIRST_TARGET), 'utf8');
    const fn = /export function toHeraldItem\(/g;
    expect([...src.matchAll(fn)], 'toHeraldItem moved or was renamed').toHaveLength(1);
    const decisions = [...src.matchAll(/const major = [^\n]*\n/g)];
    expect(decisions, 'the `major` decision moved — re-anchor this census').toHaveLength(1);
    const line = decisions[0][0];
    expect(line).toContain("significance === 'major'");
    expect(line).toContain('severity >= 0.72');
    // The migration has NOT happened: if a later wave routes this through the family, this
    // reds and the census entry above must come down with it.
    expect(src).not.toContain('admitsSignificance');
  });

  // A pin asserting that THIS file contains no writer was drafted here and DELETED: the
  // assertion's own regex contains the words it searches for, so it could only ever fail. That
  // is the self-referential pin class this estate has a standing hazard note about — a scan
  // whose subject includes itself proves nothing about anything. The no-writer property is a
  // reviewable fact of the import list at the top of this file, not a test.
});

describe('SP-6a migration census — the measured consequence', () => {
  test('the FOURTH vocabulary grades `notable` and `routine` as unclassified', () => {
    // The debt made concrete. `significanceOf` recognises {major, critical, moderate, minor}
    // and defaults everything else — so the two words 65 of the estate's 106 registered kinds
    // actually carry are graded at the same value as an item carrying no significance at all.
    const src = readFileSync(join(ROOT, FOURTH_VOCABULARY_HOME), 'utf8');
    const fn = /function significanceOf\(/g;
    expect([...src.matchAll(fn)], 'significanceOf moved — re-anchor this pin').toHaveLength(1);
    const body = src.slice(src.search(fn), src.search(fn) + 700);
    // It speaks two words that are NOT significance classes…
    expect(body).toContain("'critical'");
    expect(body).toContain("'minor'");
    // …and is SILENT on the two the registries author most.
    expect(body).not.toContain("'notable'");
    expect(body).not.toContain("'routine'");
    // anchored: the family's top class IS present in that body, so the two absences above are
    // real gaps in a live ladder rather than a slice that missed the function.
    expect(body).toContain("'major'");
  });
});

describe('SP-6a migration census — the exactly-once doc pins on the family scales', () => {
  const doc = readFileSync(join(ROOT, SP_VOLUME), 'utf8');
  const flat = (text) => text.replace(/\s+/g, ' ');
  const occurrences = (text, needle) => text.split(needle).length - 1;

  const sectionSeven = () => {
    const start = doc.indexOf('## §7 THE TUNING SURFACE');
    const end = doc.indexOf('## §8 ');
    expect(start, `${SP_VOLUME}: §7 anchor moved`).toBeGreaterThan(-1);
    expect(end, `${SP_VOLUME}: §8 anchor moved`).toBeGreaterThan(start);
    return flat(doc.slice(start, end));
  };

  test('the section anchors this file reads each appear EXACTLY ONCE', () => {
    // The first-match retargeting law: `indexOf` takes the FIRST hit, and a pin that silently
    // retargets guards a neighbour instead of its subject.
    expect(occurrences(doc, '## §7 THE TUNING SURFACE')).toBe(1);
    expect(occurrences(doc, '## §8 ')).toBe(1);
    expect(occurrences(doc, '\nSP-A: ')).toBe(1);
  });

  test('each family scale is named EXACTLY ONCE on the owner\'s signature surface', () => {
    // A scale listed twice in §7 would be signed twice and could be tuned to two values; a
    // scale listed zero times never reaches the owner at all. One row, one signature.
    const seven = sectionSeven();
    expect(occurrences(seven, 'the SP-6a significance family')).toBe(1);
    expect(occurrences(seven, 'the SP-6b severity ladder')).toBe(1);
    // SP-E's own two rows, held to the same law.
    expect(occurrences(seven, 'the phrase-repetition envelope band')).toBe(1);
    expect(occurrences(seven, 'the frequency-cadence class boundaries')).toBe(1);
  });

  test('the family scales are named in §7 and in exactly one §5 Bands line', () => {
    // The reconciled pair the SP-A walker enforces, pinned from this side too: a family scale
    // appears once where the wave declares it and once where the owner signs it — never a
    // third home that neither surface reconciles.
    const whole = flat(doc);
    for (const scale of ['the SP-6a significance family', 'the SP-6b severity ladder']) {
      expect(occurrences(whole, scale), `${scale}: not the declare-once/sign-once pair`).toBe(2);
    }
  });
});
