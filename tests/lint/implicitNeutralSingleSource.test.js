/**
 * implicitNeutralSingleSource.test.js — single-writer guard for the neutral-neighbour
 * default (owner order 2026-07-22).
 *
 * Implicit Neutral neighbours are a READ-TIME default, never materialized rows.
 * They must be minted in exactly ONE place — src/domain/relationships/
 * effectiveNeighbours.js — so the "co-campaign ⇒ neutral by default" reading can
 * never be forked into a second, drifting implementation, and so the marker stays
 * a read-time-only object that is never persisted (a second minter could leak an
 * implicit entry into neighbourNetwork → the neighbour_links column → the map/road
 * network / regional causal graph, which deliberately read RAW explicit links).
 *
 * Scan signatures (WRITE shapes only, never reads):
 *   (a) `[IMPLICIT_NEUTRAL_FLAG]:`  — setting the marker as an object key (a mint)
 *   (b) `implicit_neutral__`        — the synthetic implicit linkId literal
 * A consumer READING the marker (`link[IMPLICIT_NEUTRAL_FLAG]`, no colon) does not
 * match, so display/guard code may freely detect implicit entries.
 *
 * CANNOT-CATCH (accepted regex-gate gaps): a minter that reconstructs an implicit
 * entry WITHOUT the marker key and WITHOUT the `implicit_neutral__` linkId prefix
 * (e.g. hand-rolling `{ relationshipType: 'neutral', targetId }`). Residual is
 * covered by the effectiveNeighbours totality pins + the buildGraph campaign-aware
 * pins, which assert the chokepoint is the path the cascade actually reads.
 *
 * Frozen 2026-07-22 (hand-audited): the ONLY legal minter is effectiveNeighbours.js.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative, sep } from 'node:path';

const REPO = join(dirname(fileURLToPath(import.meta.url)), '../..');
const SRC = join(REPO, 'src');
const CHOKEPOINT = 'src/domain/relationships/effectiveNeighbours.js';

const MINT_SIGNATURES = [
  /\[\s*IMPLICIT_NEUTRAL_FLAG\s*\]\s*:/, // (a) setting the marker as an object key
  /implicit_neutral__/,                  // (b) the synthetic implicit linkId literal
];

/** Strip block + line comments so a signature named in a doc comment isn't a hit. */
function stripComments(src) {
  return src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
}

/** Recursively collect .js / .jsx / .mjs files under src, forward-slash normalized. */
function sourceFiles(dir = SRC, acc = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const abs = join(dir, e.name);
    if (e.isDirectory()) sourceFiles(abs, acc);
    else if (/\.(jsx?|mjs)$/.test(e.name)) acc.push(relative(REPO, abs).split(sep).join('/'));
  }
  return acc;
}

describe('implicit neutral neighbour — single writer (effectiveNeighbours.js)', () => {
  it('the chokepoint itself matches the mint signature (guard non-vacuity)', () => {
    const src = stripComments(readFileSync(join(REPO, CHOKEPOINT), 'utf8'));
    expect(MINT_SIGNATURES.some((re) => re.test(src))).toBe(true);
  });

  it('no file except effectiveNeighbours.js mints an implicit neutral neighbour', () => {
    const offenders = [];
    for (const file of sourceFiles()) {
      if (file === CHOKEPOINT) continue; // the single sanctioned minter
      const src = stripComments(readFileSync(join(REPO, file), 'utf8'));
      for (const re of MINT_SIGNATURES) {
        if (re.test(src)) offenders.push(file);
      }
    }
    expect(
      [...new Set(offenders)],
      'implicit Neutral neighbours must be minted only in ' + CHOKEPOINT +
        ' (import effectiveNeighboursOf instead of hand-building an implicit link). ' +
        'Offending files:\n  ' + [...new Set(offenders)].join('\n  '),
    ).toEqual([]);
  });
});
