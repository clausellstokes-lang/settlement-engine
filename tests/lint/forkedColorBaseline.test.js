/**
 * forkedColorBaseline.test.js — A+ P1.3 ratchet pin.
 *
 * scripts/.forked-color-baseline.json grandfathers the component files that
 * re-declare token hexes as local consts (`const GOLD = '#8C6F32'`). The
 * no-forked-color-const lint rule exempts exactly those files. This pin keeps the
 * baseline HONEST and MONOTONE:
 *   - it must equal the set of files that actually still contain a fork (no new
 *     violator escapes via the baseline; no stale entry lingers after a cleanup);
 *   - it can never grow past its committed ceiling (you may shrink it, not pad it).
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const BASELINE_CEILING = 0; // committed max — lower it as files are cleaned; never raise it

const FORK_RE = /(?:const|let|var)\s+[A-Za-z_$][\w$]*\s*=\s*['"]#[0-9a-fA-F]{3,8}['"]/;
const isTokenSource = (rel) => /(?:design\/tokens|components\/theme)\b|src\/design\//.test(rel);

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(jsx?|tsx?)$/.test(e)) out.push(p);
  }
  return out;
}

const currentForkFiles = walk(join(ROOT, 'src/components'))
  .map(p => relative(ROOT, p).replace(/\\/g, '/'))
  .filter(rel => !isTokenSource(rel))
  .filter(rel => readFileSync(join(ROOT, rel), 'utf8').split('\n').some(l => FORK_RE.test(l)))
  .sort();

const baseline = JSON.parse(readFileSync(join(ROOT, 'scripts/.forked-color-baseline.json'), 'utf8')).sort();

describe('forked-color baseline ratchet (A+ P1.3)', () => {
  test('baseline exactly matches the files that still fork a token hex', () => {
    // Mismatch directions: a NEW violator missing from the baseline (lint also
    // catches it), or a STALE baseline entry whose forks were cleaned (remove it).
    expect(baseline).toEqual(currentForkFiles);
  });

  test('baseline never grows past its committed ceiling', () => {
    expect(baseline.length).toBeLessThanOrEqual(BASELINE_CEILING);
  });
});
