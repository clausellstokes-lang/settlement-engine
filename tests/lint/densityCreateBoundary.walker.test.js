/**
 * tests/lint/densityCreateBoundary.walker.test.js — THE CREATE-BOUNDARY WALKER
 * (ODQ §822, structural prevention).
 *
 * The density law is a VERSIONED GENERATION LAW: a world's law is fixed at its
 * birth and never changes, because §810 R5 and THE PROMISE together forbid an
 * existing world acquiring a new generation law. The whole guarantee therefore
 * reduces to one question asked of every module that can reach the settlement
 * pipeline — IS THIS A BIRTH? — and to the fact that a birth and a replay look
 * structurally identical at the call (same config shape, same options.seed).
 *
 * ⭐ WHY A WALKER AND NOT JUST CAREFUL CALL SITES. Correctness that rests on
 * "today's caller set happens to be right" is not correctness; it is a snapshot.
 * The failure this guards is IRREVERSIBLE for any world it touches — a settlement
 * silently re-born under a different ladder cannot be un-born — and it is
 * SILENT, because a mis-minted world generates perfectly well, just not the world
 * the seed promised. So the denominator is enforced: a module that reaches the
 * pipeline and is not classified in `PIPELINE_REACHERS` REDS, and a classified
 * module whose class disagrees with whether it actually mints REDS.
 *
 * CANNOT-CATCH (documented evasion gap, in the house style): a module that
 * reaches the pipeline through a dynamically-computed name, or receives the
 * function as an already-bound argument from a caller that is itself classified,
 * is invisible to this scan. The manifest's `why` rows are the human backstop.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import {
  BOUNDARY_CLASSES,
  PIPELINE_REACHERS,
} from '../../src/generators/density/densityCreateBoundary.js';

const SRC = join(process.cwd(), 'src');

/** The module that DEFINES the pipeline is not a caller of it. */
const SELF = 'src/generators/generateSettlementPipeline.js';

/** The two symbols that constitute "this module mints a birth law". */
const MINT_SYMBOLS = ['birthConfig', 'newSettlementDensityLaw'];

/** The create-boundary module and its own re-export leaf legitimately NAME the
 *  mint without being pipeline callers; they are the mint's home and its pass-
 *  through, not generation sites. */
const MINT_HOMES = Object.freeze([
  'src/generators/density/densityCreateBoundary.js',
  'src/generators/density/densityLaw.js',
  'src/store/settlementSliceHelpers.js',
]);

/**
 * Comments AND string literals both go, and the second half was earned: the
 * certification row tables (`subsystemRowsBaseline.js`, `subsystemRowsVirtual.js`)
 * carry long PROSE STRINGS describing measurements taken "through the full
 * generateSettlementPipeline". A comment-only stripper flagged both as
 * unclassified pipeline callers on this walker's first run. They do not call it;
 * they talk about it. A mention in prose — in a comment or in a data string —
 * must never count as reaching the pipeline.
 */
function stripCommentsAndStrings(code) {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '')
    .replace(/'(?:\\.|[^'\\])*'/g, "''")
    .replace(/"(?:\\.|[^"\\])*"/g, '""')
    .replace(/`(?:\\.|[^`\\])*`/g, '``');
}

/** Every .js/.jsx file under src/, as repo-relative POSIX paths. */
function sourceFiles(dir = SRC, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) { sourceFiles(full, out); continue; }
    if (!/\.(js|jsx)$/.test(name)) continue;
    out.push(relative(process.cwd(), full).split(sep).join('/'));
  }
  return out;
}

/** Modules that can reach the settlement pipeline, comment-stripped so a mention
 *  in prose never counts (this file family is heavily commented, and several
 *  modules discuss the pipeline without calling it). */
function pipelineReachers() {
  return sourceFiles()
    .filter(rel => rel !== SELF)
    .filter(rel => /\bgenerateSettlementPipeline\b/
      .test(stripCommentsAndStrings(readFileSync(join(process.cwd(), rel), 'utf-8'))));
}

function mintsIn(rel) {
  const code = stripCommentsAndStrings(readFileSync(join(process.cwd(), rel), 'utf-8'));
  return MINT_SYMBOLS.some(sym => new RegExp(`\\b${sym}\\b`).test(code));
}

describe('density create-boundary walker (which generation is a BIRTH)', () => {
  const reachers = pipelineReachers();

  it('finds a real denominator (the scan is not vacuous)', () => {
    // If this ever collapses toward zero the scan has broken, and a broken scan
    // that passes is worse than no scan.
    expect(reachers.length).toBeGreaterThanOrEqual(4);
    expect(Object.keys(PIPELINE_REACHERS).length).toBeGreaterThanOrEqual(4);
  });

  it('every module that reaches the pipeline is classified', () => {
    const unclassified = reachers.filter(rel => !(rel in PIPELINE_REACHERS));
    expect(
      unclassified,
      `these modules reach generateSettlementPipeline but are not classified in `
      + `PIPELINE_REACHERS: ${unclassified.join(', ')} — decide whether each is a `
      + `BIRTH (mints a new world's law), DERIVED (re-derives an existing world) or `
      + `PREVIEW (throwaway), and say why. An unclassified caller is exactly how a `
      + `world gets silently re-born under a law it was not created with.`,
    ).toEqual([]);
  });

  it('the manifest names no module that has stopped reaching the pipeline', () => {
    const stale = Object.keys(PIPELINE_REACHERS).filter(rel => !reachers.includes(rel));
    expect(
      stale,
      `classified modules that no longer reach the pipeline: ${stale.join(', ')}`,
    ).toEqual([]);
  });

  it('every class is one of the declared three, and carries a reason', () => {
    for (const [rel, row] of Object.entries(PIPELINE_REACHERS)) {
      expect(BOUNDARY_CLASSES, `${rel} has class "${row.class}"`).toContain(row.class);
      expect(String(row.why || '').length, `${rel} needs a why`).toBeGreaterThan(40);
    }
  });

  it('every BIRTH mints the law, and nothing else does', () => {
    const birthsNotMinting = Object.entries(PIPELINE_REACHERS)
      .filter(([rel, row]) => row.class === 'BIRTH' && !mintsIn(rel))
      .map(([rel]) => rel);
    expect(
      birthsNotMinting,
      `classified BIRTH but never calls birthConfig: ${birthsNotMinting.join(', ')} — `
      + `a birth that does not mint produces a world with no recorded law, which reads `
      + `as v1 forever even after the dial flips`,
    ).toEqual([]);

    const nonBirthsMinting = Object.entries(PIPELINE_REACHERS)
      .filter(([rel, row]) => row.class !== 'BIRTH' && mintsIn(rel))
      .map(([rel]) => rel);
    expect(
      nonBirthsMinting,
      `classified ${'DERIVED/PREVIEW'} but mints the birth law: ${nonBirthsMinting.join(', ')} — `
      + `a preview or a re-derivation that mints would stamp a new law onto a world `
      + `that already exists, which is the PROMISE breach the version gate exists to prevent`,
    ).toEqual([]);
  });

  it('at least two real BIRTH paths exist (the product can still make worlds)', () => {
    const births = Object.values(PIPELINE_REACHERS).filter(r => r.class === 'BIRTH');
    // The single-settlement store path and the realm composer. If this drops to
    // one, a birth path was retired or silently reclassified.
    expect(births.length).toBeGreaterThanOrEqual(2);
  });

  it('the mint is not named outside its homes and its declared BIRTH callers', () => {
    const allowed = new Set([
      ...MINT_HOMES,
      ...Object.entries(PIPELINE_REACHERS)
        .filter(([, row]) => row.class === 'BIRTH').map(([rel]) => rel),
    ]);
    const strays = sourceFiles().filter(rel => !allowed.has(rel) && mintsIn(rel));
    expect(
      strays,
      `modules naming the birth mint outside its homes and declared BIRTH callers: `
      + `${strays.join(', ')}`,
    ).toEqual([]);
  });
});
