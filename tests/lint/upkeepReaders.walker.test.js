/**
 * upkeepReaders.walker.test.js — COHERENCE-UPKEEP's guard (the chair's ruling of 2026-11-12 on
 * item 4, ruling 1): WHAT A PLACE CAN KEEP UP HAS ONE HOME, the prosperity label read through
 * `src/domain/facts/keep.js :: keepOf`. Every other read of the economy's OUTPUT score used to
 * gate upkeep is a second reader of the same fact, and this walker holds them.
 *
 * WHAT IS COUNTED, per source line under `src/` (comments stripped): a line that names the
 * economy's output (`econOutput`, `economyOutput`, `economicOutput`, `_econOut`) AND either
 *   (a) sits in one of the upkeep WRITERS (the defence scores, the service demand, the service
 *       roll, the magic profile, the food writer), where every read of the output is counted, or
 *   (b) has the shape of an upkeep gate anywhere else, over the line's whole STATEMENT (a gate
 *       written across lines is caught): a `…Mult` / `…Gate` built on it, or the output over 50
 *       (today's full-funding point).
 * It is a count that points, not a proof: a row may hold a read that is not a gate, and then it
 * says why in its reason.
 *
 * THE REGISTER (`upkeepReaders.register.json`) IS SHRINK-ONLY: every live read is a row, every
 * row is a live read (a row retires the commit its read moves home), and the register never
 * holds more rows than at its first commit. The other half of the guard: `KEEP_TUNING` is named
 * by its home alone.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';
import { statementWindowAt } from '../helpers/sourceContract.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const REGISTER = JSON.parse(readFileSync(join(ROOT, 'tests/lint/upkeepReaders.register.json'), 'utf8'));
/** The register's row count at its first commit: it never rises. */
const FIRST_ROWS = 10;

/** The upkeep writers: every read of the output in these files is counted. */
const WRITERS = Object.freeze([
  'src/generators/defenseGenerator.js',
  'src/generators/services/serviceAvailability.js',
  'src/generators/services/serviceRollMaterialization.js',
  'src/domain/magicProfile.js',
  'src/generators/foodGenerator.js',
]);
const OUTPUT = /\b(?:econOutput|economyOutput|economicOutput|_econOut)\b/;
const GATE = /\b\w*(?:Mult|Gate)\s*=|\/\s*50\b/;
/** Comments out, line count kept. @param {string} source */
const codeOf = (source) => source
  .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
  .replace(/(^|[^:'"`])\/\/[^\n]*/g, '$1');

/** @param {string} dir @param {string[]} out @returns {string[]} */
function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(js|jsx|mjs)$/.test(name) && !/\.generated\.js$/.test(name)) out.push(full);
  }
  return out;
}

/**
 * The counted lines of one source: each line naming the output, kept where the file is a writer
 * or the line's whole statement has a gate's shape.
 * @param {string} code comment-stripped source @param {boolean} writer @returns {string[]}
 */
function countedLines(code, writer) {
  /** @type {string[]} */
  const out = [];
  let at = 0;
  for (const line of code.split('\n')) {
    const hit = line.search(OUTPUT);
    if (hit >= 0) {
      const gate = writer || GATE.test(statementWindowAt(code, at + hit));
      if (gate) out.push(line.trim());
    }
    at += line.length + 1;
  }
  return out;
}

/** The live reads, as `file :: code` keys (the code trimmed, so a line move is not a new read). */
function liveReads(root = ROOT) {
  /** @type {string[]} */
  const keys = [];
  for (const full of walk(join(root, 'src'))) {
    const file = relative(root, full).replace(/\\/g, '/');
    for (const line of countedLines(codeOf(readFileSync(full, 'utf8')), WRITERS.includes(file))) keys.push(`${file} :: ${line}`);
  }
  return keys;
}

describe('upkeepReaders — what a place can keep up has one home', () => {
  const live = liveReads();
  const rows = Object.keys(REGISTER.rows);

  test('every upkeep read of the economy\'s output is a register row, with its reason', () => {
    expect(live.length, 'anchored: the walk reads the defence gates').toBeGreaterThan(0);
    expect(live.filter((k) => !rows.includes(k)), 'a NEW reader of upkeep off the output: read `keepOf` instead').toEqual([]);
    for (const k of rows) expect(String(REGISTER.rows[k].reason || '').length, `${k} carries a reason`).toBeGreaterThan(20);
  });

  test('every register row is a live read (a row retires the commit its read moves home)', () => {
    expect(rows.filter((k) => !live.includes(k))).toEqual([]);
  });

  test('the register is shrink-only', () => {
    expect(rows.length).toBeLessThanOrEqual(FIRST_ROWS);
  });

  test('KEEP_TUNING is named by its home alone', () => {
    const namers = walk(join(ROOT, 'src'))
      .filter((full) => /\bKEEP_TUNING\b/.test(codeOf(readFileSync(full, 'utf8'))))
      .map((full) => relative(ROOT, full).replace(/\\/g, '/'));
    expect(namers).toEqual(['src/domain/facts/keep.js']);
  });

  test('the walker convicts a planted gate (one line or across lines) and clears a non-gate read', () => {
    const plant = codeOf('const fooUpkeepMult = Math.min(1, 0.5 + (econOutput / 50) * 0.5); // a gate\n'
      + 'const barGate = Math.min(1,\n  0.5 + (flags.economyOutput / 50) * 0.5); // a gate across lines\n'
      + 'const share = flags.economyOutput > 65; // not a gate\n');
    const counted = countedLines(plant, false);
    expect(counted).toHaveLength(2);
    expect(counted[0]).toMatch(/fooUpkeepMult/);
    expect(counted[1]).toMatch(/^0\.5 \+ \(flags\.economyOutput/);
    expect(countedLines(plant, true), 'in a writer every read counts').toHaveLength(3);
  });
});
