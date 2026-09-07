/**
 * habitLedgerSingleWriter.walker.test.js — HB-2's three-direction single-writer census.
 *
 * ⛔ ONE STATE, ONE WRITER. `spatialLedgers.habits` is written by `writeHabits` and by nothing
 * else in the estate. A second writer would not merely duplicate logic — it would fork the
 * drop-when-neutral pass and the two deterministic evictions, and a ledger with two eviction
 * policies is a ledger whose replay depends on which writer ran last.
 *
 * ⚠⚠ THE THREE DIRECTIONS ARE NOT REDUNDANT, and the second is the one a file-level scan
 * misses: a SECOND FUNCTION inside the ledger leaf itself would satisfy "only this file
 * writes" while breaking "only this writer writes". The third direction is the anti-vacuity
 * arm — if the WRITE pattern were narrowed until it matched nothing, directions one and two
 * would both pass over an empty set, so the mention census must be provably WIDER.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const LEDGER_HOME = 'src/domain/worldPulse/habit/habitLedger.js';
const LEDGER_KEY_SYMBOL = 'HABIT_LEDGER_KEY';
const WRITER = 'writeHabits';
/** The two spatial write forms. A habit stamp can reach the world through no other door. */
const WRITE_RE = /\b(?:setSpatialLedger|dropSpatialLedger)\s*\(/g;

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) walk(path, out);
    else if (/\.(js|jsx)$/.test(path)) out.push(path);
  }
  return out;
}

const SRC_FILES = walk(join(ROOT, 'src'))
  .map((path) => ({ rel: relative(ROOT, path).replace(/\\/g, '/'), src: readFileSync(path, 'utf8') }))
  .sort((a, b) => (a.rel < b.rel ? -1 : 1));

const ledgerSource = () => SRC_FILES.find(({ rel }) => rel === LEDGER_HOME).src;

/**
 * The byte range of `writeHabits`'s own body, found by brace balance from its signature.
 *
 * ⚠ THE PARAMETER LIST IS SKIPPED FIRST, AND THAT IS NOT A DETAIL. Taking the next `{` after
 * the signature lands on a DEFAULT PARAMETER (`changes = {}`) and yields a two-byte range that
 * every real write falls outside of — a detector that reports the whole leaf as broken while
 * the leaf is correct. Balance the parens to the end of the parameter list, then take the brace.
 */
function writerBodyRange(source) {
  const signature = source.indexOf(`export function ${WRITER}`);
  if (signature < 0) return null;
  let cursor = source.indexOf('(', signature);
  for (let parens = 0; cursor < source.length; cursor += 1) {
    if (source[cursor] === '(') parens += 1;
    else if (source[cursor] === ')') {
      parens -= 1;
      if (parens === 0) break;
    }
  }
  const open = source.indexOf('{', cursor);
  let depth = 0;
  for (let index = open; index < source.length; index += 1) {
    if (source[index] === '{') depth += 1;
    else if (source[index] === '}') {
      depth -= 1;
      if (depth === 0) return { start: open, end: index };
    }
  }
  return null;
}

describe('HB-2 — the habit ledger has exactly one writer, and it is proved in three directions', () => {
  test('DIRECTION 1 — the WRITER EXACT SET, both ways: only the ledger leaf writes the habit key', () => {
    const writers = SRC_FILES
      .filter(({ src }) => {
        WRITE_RE.lastIndex = 0;
        return WRITE_RE.test(src) && src.includes(LEDGER_KEY_SYMBOL);
      })
      .map(({ rel }) => rel);
    expect(
      writers,
      'a module other than the habit ledger performs a spatial write while naming the habit'
      + ' ledger key. ONE STATE, ONE WRITER: a second writer forks the drop pass and both'
      + ' evictions, and a ledger with two eviction policies cannot replay deterministically',
    ).toEqual([LEDGER_HOME]);
  });

  test('DIRECTION 2 — FUNCTION SCOPE: every write form sits inside the writer\'s own body', () => {
    // ⛔ THIS IS THE DIRECTION A FILE-LEVEL SCAN IS STRUCTURALLY BLIND TO. A second function in
    // this same leaf would satisfy direction 1 completely while breaking the law it exists for.
    const source = ledgerSource();
    const range = writerBodyRange(source);
    expect(range, `${WRITER} must be an exported function declaration in ${LEDGER_HOME}`).not.toBeNull();
    WRITE_RE.lastIndex = 0;
    const offsets = [...source.matchAll(WRITE_RE)].map((match) => match.index);
    expect(offsets.length, 'the write scan found nothing — a narrowed pattern would make every'
      + ' direction of this census pass over an empty set').toBeGreaterThan(0);
    const strays = offsets.filter((offset) => offset < range.start || offset > range.end);
    expect(
      strays.map((offset) => source.slice(offset, offset + 40)),
      `a spatial write sits OUTSIDE ${WRITER}'s own body. Every write form must live in the one`
      + ' writer, not merely in the one file',
    ).toEqual([]);
  });

  test('DIRECTION 3 — THE READERS READ: the mention census is strictly WIDER than the writer set', () => {
    // The anti-vacuity arm. If the key were unmentioned outside its writer, a broken WRITE
    // pattern and a genuinely single-writer estate would look identical from directions 1 and 2.
    const mentions = SRC_FILES
      .filter(({ src }) => src.includes(LEDGER_KEY_SYMBOL) || /['"`]habits['"`]/.test(src))
      .map(({ rel }) => rel);
    expect(mentions).toContain(LEDGER_HOME);
    expect(
      mentions.length,
      'nothing outside the ledger leaf mentions the habit key at all, so directions 1 and 2'
      + ' are measuring an estate in which the pattern could match nothing and still pass',
    ).toBeGreaterThan(1);
    // and the readers are READERS: none of them writes.
    const readersThatWrite = mentions
      .filter((rel) => rel !== LEDGER_HOME)
      .filter((rel) => {
        WRITE_RE.lastIndex = 0;
        return WRITE_RE.test(SRC_FILES.find((file) => file.rel === rel).src)
          && SRC_FILES.find((file) => file.rel === rel).src.includes(LEDGER_KEY_SYMBOL);
      });
    expect(readersThatWrite).toEqual([]);
  });

  test('THE STORE-LAYER ESCAPE IS REFUSED: no habit stamp is written from outside src/domain', () => {
    // ⛔ NAMED RATHER THAN ASSUMED. `spatialUsage.js` states in source that its coverage walker
    // governs only keys written via setSpatialLedger INSIDE src/domain, so a habit stamp written
    // from the store layer would evade that walker entirely. This is the arm that closes it.
    const outsiders = SRC_FILES
      .filter(({ rel }) => !rel.startsWith('src/domain/'))
      .filter(({ src }) => {
        WRITE_RE.lastIndex = 0;
        return WRITE_RE.test(src) && /['"`]habits['"`]/.test(src);
      })
      .map(({ rel }) => rel);
    expect(
      outsiders,
      'a habit ledger write appeared outside src/domain, where the spatial coverage walker'
      + ' cannot see it — the key would read as untracked while the lane genuinely wrote',
    ).toEqual([]);
  });

  test('GUARD THE GUARD — the detectors are proved live on the writes that genuinely exist', () => {
    // An emptied scan must never pass as an absence, so every negative above is preceded here
    // by the same detector finding what it is supposed to find.
    const source = ledgerSource();
    WRITE_RE.lastIndex = 0;
    const forms = [...source.matchAll(WRITE_RE)].map((match) => match[0].replace(/\s*\($/, ''));
    expect([...new Set(forms)].sort()).toEqual(['dropSpatialLedger', 'setSpatialLedger']);
    expect(source).toContain(`export const ${LEDGER_KEY_SYMBOL}`);
    expect(source).toContain(`export function ${WRITER}`);
    // and the file walker itself is live rather than pointed at an empty tree
    expect(SRC_FILES.length).toBeGreaterThan(500);
  });
});
