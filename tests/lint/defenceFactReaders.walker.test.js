/**
 * defenceFactReaders.walker.test.js — COHERENCE-AGREE's second guard (the chair's charter of
 * 2026-11-11, §2): ONE FACT, ONE READER. The defence facts (walls, garrison, militia, watch,
 * mercenaries) have a home — `src/domain/facts/defence.js` over `src/domain/defense/defenseFacts.js`.
 * A private reader elsewhere answers the same question its own way, and the two answers drift: the
 * safety text named "a mercenary company" in towns whose defence record lists none, because
 * `priorityHelpers.js` keeps its own list of names.
 *
 * WHAT IS COUNTED, per source file under `src/` (outside the home, the data tables and generated
 * files), with comments stripped: a line that sets a private `hasWalls / hasGarrison / hasMilitia /
 * hasWatch / hasMercenary` flag from anything but the home, or a line that calls a name test
 * (`includes`, `test`, `some`, `hasAny`, `hasInst`, `match`, `find`, `filter`) with a string or
 * pattern literal holding a defence word. It is a count that points, not a proof: a row may hold a
 * line that reads another sense of the word, and is held as counted.
 *
 * THE REGISTER (`defenceFactReaders.register.json`) IS SHRINK-ONLY: every file's count equals its
 * row (a file that reads less lowers its row the same commit), no file outside the register may
 * read, and the register's total never rises above its first commit's.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';
import { linesReading, reads, readsCourtGate } from './defenceFactReaders.shared.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const REGISTER = JSON.parse(readFileSync(join(ROOT, 'tests/lint/defenceFactReaders.register.json'), 'utf8'));
/** The register's total at its first commit: it never rises. */
const FIRST_TOTAL = 77;
const COURT_GATE_REGISTER = JSON.parse(readFileSync(join(ROOT, 'tests/lint/defenceFactReaders.courtGate.register.json'), 'utf8'));
/** The second member's total at its first commit (COHERENCE-AGREE-3, over 65ce74ce6): it never rises. */
const COURT_GATE_FIRST_TOTAL = 20;

/** @param {string} dir @param {string[]} out @returns {string[]} */
const walk = (dir, out = []) => {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) walk(path, out); else out.push(path);
  }
  return out;
};

/** @param {(line: string) => boolean} [test] */
const counted = (test = reads) => {
  /** @type {Record<string, number>} */
  const out = {};
  for (const path of walk(join(ROOT, 'src'))) {
    const rel = relative(ROOT, path).replace(/\\/g, '/');
    if (!/\.(js|jsx)$/.test(rel) || /\.generated\.js$/.test(rel)) continue;
    if (/^src\/(?:domain\/facts|domain\/defense|data)\//.test(rel)) continue;
    const n = linesReading(readFileSync(path, 'utf8'), test);
    if (n) out[rel] = n;
  }
  return out;
};

describe('the defence facts have one reader (shrink-only)', () => {
  test('guard-the-guard: the patterns catch a private reader and pass the home', () => {
    expect(reads("const hasMilitia = names.some(n => n.includes('militia'));")).toBe(true);
    expect(reads("hasMercenary: hasAny(names, ['mercenary company']),")).toBe(true);
    expect(reads("  const watchExists = instNames.some(n => /watch|guard/i.test(n));")).toBe(true);
    expect(reads('hasMercenary: defence.mercenary,')).toBe(false);
    expect(reads('hasMercenary: home.hasMercenary,')).toBe(false);
    expect(reads("const inScope = wall.scope.includes('*') || wall.scope.includes(register);")).toBe(false);
    expect(Object.keys(counted()).length).toBeGreaterThan(10);
  });

  test('every file reads exactly its banked count, and no file reads outside the register', () => {
    const now = counted();
    const banked = Object.fromEntries(Object.entries(REGISTER.rows).map(([file, row]) => [file, row.count]));
    expect(now).toEqual(banked);
  });

  test('every row carries its reason, and the total never rises', () => {
    for (const row of Object.values(REGISTER.rows)) expect(String(row.reason || '').length).toBeGreaterThan(20);
    const total = Object.values(REGISTER.rows).reduce((sum, row) => sum + row.count, 0);
    expect(total).toBeLessThanOrEqual(FIRST_TOTAL);
  });
});

/**
 * THE SECOND MEMBER (COHERENCE-AGREE-3, REVIEW-AGREE F9, 2026-11-12). The first member saw only literal
 * walls/garrison/militia/watch/mercenar* words: a reader of the COURT or the GATE (the two facts the lane gave
 * a home in the flag bag), or of a hired company named any other way (the names priorityHelpers.js listed for
 * it before cure 9 — "hireling hall", "free company", "hired muscle", "veteran's lodge" — and "sellsword"),
 * passed unseen (the review planted each and the walker passed). What it still does NOT see: a defence word
 * held in a constant and tested through the constant (`const W = 'courthouse'; n.includes(W)`).
 */
describe('the court, the gate and a hired company by its other names have one reader (shrink-only)', () => {
  test('guard-the-guard: the review\'s plants are caught, the home and the constant are not', () => {
    expect(readsCourtGate("const sits = names.some(n => n.includes('courthouse'));")).toBe(true);
    expect(readsCourtGate("const hired = names.some(n => n.includes('hireling hall'));")).toBe(true);
    expect(readsCourtGate("const gated = names.some(n => /\\bgates?\\b/i.test(n));")).toBe(true);
    expect(readsCourtGate("const hired = n.includes('sellsword') || n.includes('free company');")).toBe(true);
    expect(readsCourtGate('hasGates: home.hasGate,')).toBe(false);
    expect(readsCourtGate('hasCourtSystem: home.hasCourt,')).toBe(false);
    // a bare name with no binding in its file is not a literal (the line alone tests nothing it can see)
    expect(readsCourtGate('const sits = names.some(n => n.includes(COURT_WORD));')).toBe(false);
    expect(Object.keys(counted(readsCourtGate)).length).toBeGreaterThan(5);
  });
  test('every file reads exactly its banked count, and no file reads outside the register', () => {
    const banked = Object.fromEntries(Object.entries(COURT_GATE_REGISTER.rows).map(([file, row]) => [file, row.count]));
    expect(counted(readsCourtGate)).toEqual(banked);
  });
  test('every row carries its reason, and the total never rises', () => {
    for (const row of Object.values(COURT_GATE_REGISTER.rows)) expect(String(row.reason || '').length).toBeGreaterThan(20);
    const total = Object.values(COURT_GATE_REGISTER.rows).reduce((sum, row) => sum + row.count, 0);
    expect(total).toBeLessThanOrEqual(COURT_GATE_FIRST_TOTAL);
  });
});

/**
 * A WORD HELD IN A CONSTANT (COHERENCE-AGREE-6, REVIEW-AGREE-2 F8 (i), the chair's ruling of 2026-11-12): the walker
 * reads an identifier bound to a name-like string in the same file as that string, so a reader cannot hide its
 * word behind a name. The review's plant, red; a prose constant with a comma (a sentence, not a name) is not.
 */
describe('a defence word held in a constant is read as the word', () => {
  test('the review\'s plant: const MERC = \'mercenary\'; … n.includes(MERC)', () => {
    expect(linesReading("const MERC = 'mercenary';\nconst hired = names.some((n) => n.includes(MERC));\n", reads)).toBe(1);
    expect(linesReading("const COURT_WORD = 'courthouse';\nconst sits = names.some((n) => n.includes(COURT_WORD));\n", readsCourtGate)).toBe(1);
    // controls: the binding alone tests nothing; a prose constant is not a name; a property key is not the constant
    expect(linesReading("const MERC = 'mercenary';\n", reads)).toBe(0);
    expect(linesReading("const LINE = 'dawn, the market, the tavern, the watch';\nconst hit = lines.find((x) => x.includes(LINE));\n", reads)).toBe(0);
    expect(linesReading("const MERC = 'mercenary';\nconst row = { MERC: names.some((n) => n.includes(other)) };\n", reads)).toBe(0);
  });
});
