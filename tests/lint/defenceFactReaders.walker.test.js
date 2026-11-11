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

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const REGISTER = JSON.parse(readFileSync(join(ROOT, 'tests/lint/defenceFactReaders.register.json'), 'utf8'));
/** The register's total at its first commit: it never rises. */
const FIRST_TOTAL = 77;

const ASSIGN = /\bhas(?:Walls|Garrison|Militia|Watch|Mercenary)\s*[:=](?!=)(?!\s*(?:defen[cs]e|d)\b\.)/;
const WORD = String.raw`\b(?:walls?|garrison|barracks|militia|watch|mercenar\w*)\b`;
const CALL = /\b(?:includes|test|hasAny|hasInst|some|match|find|filter)\s*\(/;
const LITERAL = new RegExp(String.raw`'[^'\n]*${WORD}[^'\n]*'|"[^"\n]*${WORD}[^"\n]*"|\x60[^\x60\n]*${WORD}[^\x60\n]*\x60|/[^/\n]*${WORD}[^/\n]*/[gimsuy]*`, 'i');
/** @param {string} line */
const reads = (line) => ASSIGN.test(line) || (CALL.test(line) && LITERAL.test(line));
/** Comments out, line count kept. @param {string} source */
const codeOf = (source) => source
  .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
  .replace(/(^|[^:'"`])\/\/[^\n]*/g, '$1');

/** @param {string} dir @param {string[]} out @returns {string[]} */
const walk = (dir, out = []) => {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) walk(path, out); else out.push(path);
  }
  return out;
};

const counted = () => {
  /** @type {Record<string, number>} */
  const out = {};
  for (const path of walk(join(ROOT, 'src'))) {
    const rel = relative(ROOT, path).replace(/\\/g, '/');
    if (!/\.(js|jsx)$/.test(rel) || /\.generated\.js$/.test(rel)) continue;
    if (/^src\/(?:domain\/facts|domain\/defense|data)\//.test(rel)) continue;
    const n = codeOf(readFileSync(path, 'utf8')).split('\n').filter(reads).length;
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
