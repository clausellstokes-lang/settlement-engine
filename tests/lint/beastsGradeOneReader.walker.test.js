/**
 * beastsGradeOneReader.walker.test.js — THE BEASTS GRADE HAS ONE READER (the tenth chair's RULING G22 (2) on C6 (A),
 * "P9": "a walker: no printer reads `scores.monster`'s band except through the leaf").
 *
 * In settled country the beasts grade is read against the need (`src/domain/facts/beastsReadiness.js ::
 * beastsReadinessOf`, and `scoresAsShown` for a printer that bands every score); the STORED score does not move, so the
 * simulator's readers keep it. This arm holds that no other reader of the stored monster score enters unseen.
 *
 * WHAT IT SEES (code only: comments and strings out, `tests/helpers/codeOnlySource.js :: codeOnly`): a `.monster`
 * property read (not `.monsterThreat`), in any `.js`, `.jsx` or `.mjs` file under `src/`.
 * THE LIST: every file with such a line, its EXACT count, its class and its reason. A file not listed reds; a new read in
 * a listed file reds (its count moved); a count that falls reds too, so the list is re-stated by its cause.
 * THE CLASSES: LEAF (the one reader); SIMULATOR (reads the stored score, as G22 keeps it); FRONTIER (reads it only in
 * frontier country, which the cure does not touch); INSTRUMENT (a fingerprint or a capture that prints nothing); DEAD
 * (mounted nowhere: RULING G4).
 * WHAT IT DOES NOT SEE: an index by a string literal (`scores['monster']`: the strings are blanked); a printer handed the whole scores bag (`defenseProfile.scores`) that bands every key by a loop:
 * those take `scoresAsShown` (the Overview's Systems Health, DS-GEN-3's readings, the PDF view model's `defenseScores`);
 * the behaviour over every birth of the close's two corpora is `docs/chair/2026-11-24/tenth/gen/birth-2/probes/
 * p9check.mjs` (the printed grade on the web Defense tab, the web Overview and the PDF, against the raw threat tier).
 */
import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { codeOnly } from '../helpers/codeOnlySource.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
/** A line that reads the stored monster score: a `.monster` property (never `.monsterThreat`). */
const READS = /\.monster\b(?!Threat)/;

/** THE WHOLE LIST: every file of `src` with such a line, its exact count of such lines (code only), and its class. */
const MONSTER_SCORE_READERS = Object.freeze({
  'src/domain/facts/beastsReadiness.js': [2, 'LEAF', 'the one reader: the grade read against the need (RULING G22); and scoresAsShown passing a score that is not a number through (P9b-2, G68 (P2))'],
  'src/domain/defenseLedger.js': [1, 'SIMULATOR', 'the ledger the capacity model and the world pulse read: the stored score, as G22 keeps it'],
  'src/domain/facts/monsterFrontier.js': [1, 'FRONTIER', 'the `monster frontier` atom reads the score only in frontier country, which the cure does not touch'],
  'src/lib/structuralFingerprint.js': [1, 'INSTRUMENT', 'the structural fingerprint: a number, never printed'],
  'src/lib/researchCapture.js': [1, 'INSTRUMENT', 'a research snapshot of the fingerprint: never printed'],
  // P9b-2 (G68 (P1)): src/components/new/SummaryTab.jsx's systems average (DEAD, mounted nowhere) now reads the scores as
  // printed through the leaf (`scoresAsShown`), so it no longer reads the stored score: its row leaves the list
});
const CLASSES = new Set(['LEAF', 'SIMULATOR', 'FRONTIER', 'INSTRUMENT', 'DEAD']);

/** The count of reading lines in a source, code only. @param {string} src */
const monsterScoreReadsIn = (src) => codeOnly(src).split('\n').filter((l) => READS.test(l)).length;

describe('the beasts grade has one reader: every reader of the stored monster score is classed', () => {
  const walk = (/** @type {string} */ d, /** @type {string[]} */ o = []) => {
    for (const e of readdirSync(d)) { const p = join(d, e); if (statSync(p).isDirectory()) walk(p, o); else if (/\.(js|jsx|mjs)$/.test(e)) o.push(p); }
    return o;
  };
  /** @type {Record<string, number>} */ const found = {};
  for (const f of walk(join(ROOT, 'src'))) {
    const n = monsterScoreReadsIn(readFileSync(f, 'utf8'));
    if (n) found[relative(ROOT, f).replace(/\\/g, '/')] = n;
  }

  it('the predicate is not vacuous: a planted read counts, a threat tier and a comment do not', () => {
    expect(monsterScoreReadsIn('const g = r.defenseProfile.scores.monster;')).toBe(1);
    expect(monsterScoreReadsIn('const { monster } = d; const g = d.monster + 1;')).toBe(1);
    expect(monsterScoreReadsIn('const t = r.config.monsterThreat; // scores.monster')).toBe(0);
    expect(monsterScoreReadsIn("const k = 'scores.monster: CRITICAL';")).toBe(0);
  });

  it('every reading file is classed, at its exact count', () => {
    expect(found).toEqual(Object.fromEntries(Object.entries(MONSTER_SCORE_READERS).map(([f, [n]]) => [f, n])));
  });

  it('every row names a class and a reason, and the leaf is the one LEAF', () => {
    for (const [f, [, cls, why]] of Object.entries(MONSTER_SCORE_READERS)) {
      expect(CLASSES.has(String(cls)), f).toBe(true);
      expect(String(why).length, f).toBeGreaterThan(20);
    }
    expect(Object.values(MONSTER_SCORE_READERS).filter(([, cls]) => cls === 'LEAF')).toHaveLength(1);
  });
});
