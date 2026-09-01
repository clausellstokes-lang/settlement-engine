/**
 * livingContentLawVersion.test.js — the direct-import proof of the living-content
 * version leaf, and the two STRUCTURAL arms that keep the F29 cycle cure from
 * silently regressing.
 *
 * ⛔ WHY THIS FILE EXISTS AT ALL, BEYOND UNIT COVERAGE. The leaf was created to
 * break a three-module import cycle (seam → roster → law → seam), and its value
 * rests on two properties that no behavioural test would notice being lost:
 *
 *   1. IT IMPORTS NOTHING. One static import here re-opens the cycle the moment
 *      the target imports back into this family, and — because the leaf is
 *      generator-reachable through the seam — drags whatever it names into
 *      `computeEngineSharedDomain()`'s eager closure and charges it to FIRST
 *      PAINT. `vite.config.js` excises the leaf itself, not what it imports.
 *   2. EACH SYMBOL IS DEFINED EXACTLY ONCE IN `src/`. The whole point of moving
 *      rather than copying is that `_livingContentLawVersion` has one spelling.
 *      A convenience re-export added later to the seam or the law would restore
 *      the old import edges and the old cycle with them.
 *
 * Both are source-scan arms, so both carry a POSITIVE CONTROL: a scanner that
 * reads nothing passes an absence claim for the wrong reason, which is the
 * vacuous green this estate's walker family exists to prevent.
 */

import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  DEFAULT_LIVING_CONTENT_LAW_VERSION,
  LIVING_CONTENT_LAW_CONFIG_KEY,
  LIVING_CONTENT_LAW_VERSIONS,
  ROSTER_LIVING_CONTENT_LAW_VERSION,
  materializesLivingContent,
  readLivingContentLawVersion,
  resolveLivingContentLawVersion,
} from '../../src/domain/content/livingContentLawVersion.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const SRC = join(ROOT, 'src');
const LEAF = join(SRC, 'domain/content/livingContentLawVersion.js');
const SEAM = join(SRC, 'domain/content/livingContentSeam.js');

/** Source with comments blanked — a specifier quoted in a docblock is not an
 *  import edge, and a scan that cannot tell the difference convicts its own
 *  documentation. (The estate's `codeWithoutCitations` idiom.) */
function code(file) {
  return readFileSync(file, 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '');
}

/** Every `.js` under src/, repo-relative. */
function jsFilesUnder(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) jsFilesUnder(p, out);
    else if (p.endsWith('.js')) out.push(p);
  }
  return out;
}

const MOVED_SYMBOLS = [
  'LIVING_CONTENT_LAW_CONFIG_KEY',
  'LIVING_CONTENT_LAW_VERSIONS',
  'DEFAULT_LIVING_CONTENT_LAW_VERSION',
  'ROSTER_LIVING_CONTENT_LAW_VERSION',
  'readLivingContentLawVersion',
  'resolveLivingContentLawVersion',
  'materializesLivingContent',
];

describe('living-content law version — the dependency-free leaf the F29 cycle cure rests on', () => {
  it('the config key is the one spelling the persisted config carries', () => {
    expect(LIVING_CONTENT_LAW_CONFIG_KEY).toBe('_livingContentLawVersion');
  });

  it('the version list is frozen, and v1 is the dormant default', () => {
    expect(LIVING_CONTENT_LAW_VERSIONS).toEqual([1, 2]);
    expect(Object.isFrozen(LIVING_CONTENT_LAW_VERSIONS)).toBe(true);
    expect(DEFAULT_LIVING_CONTENT_LAW_VERSION).toBe(1);
    expect(ROSTER_LIVING_CONTENT_LAW_VERSION).toBe(2);
  });

  it('the read is a CLOSED membership test: absent, garbage and unshipped all fall to the default', () => {
    expect(readLivingContentLawVersion(undefined)).toBe(1);
    expect(readLivingContentLawVersion(null)).toBe(1);
    expect(readLivingContentLawVersion('nonsense')).toBe(1);
    expect(readLivingContentLawVersion(0)).toBe(1);
    expect(readLivingContentLawVersion(3)).toBe(1);
    expect(readLivingContentLawVersion(1.5)).toBe(1);
    // The one value that is NOT the default is the one the roster ships under.
    expect(readLivingContentLawVersion(2)).toBe(2);
    expect(readLivingContentLawVersion('2')).toBe(2);
  });

  it('the resolve reads the config key and nothing else', () => {
    expect(resolveLivingContentLawVersion(null)).toBe(1);
    expect(resolveLivingContentLawVersion(undefined)).toBe(1);
    expect(resolveLivingContentLawVersion({})).toBe(1);
    expect(resolveLivingContentLawVersion({ livingContentLawVersion: 2 })).toBe(1);
    expect(resolveLivingContentLawVersion({ [LIVING_CONTENT_LAW_CONFIG_KEY]: 2 })).toBe(2);
  });

  it('the gate is true for exactly the roster version', () => {
    expect(materializesLivingContent(undefined)).toBe(false);
    expect(materializesLivingContent({})).toBe(false);
    expect(materializesLivingContent({ [LIVING_CONTENT_LAW_CONFIG_KEY]: 1 })).toBe(false);
    expect(materializesLivingContent({ [LIVING_CONTENT_LAW_CONFIG_KEY]: 3 })).toBe(false);
    expect(materializesLivingContent({ [LIVING_CONTENT_LAW_CONFIG_KEY]: 2 })).toBe(true);
  });

  // ── STRUCTURAL ARM 1 — the zero-import contract ────────────────────────────
  it('the leaf imports NOTHING, and the scanner that says so can see a real import', () => {
    const leafCode = code(LEAF);
    // POSITIVE CONTROL FIRST: the same scanner, run over the seam, must FIND the
    // one static edge the seam is known to carry. Without this, the absence
    // claim below would pass just as happily against a broken regex.
    const importRe = /(?:^|\n)\s*import\b[^;]*?['"][^'"]+['"]/g;
    expect(code(SEAM).match(importRe)?.length).toBe(1);
    expect(leafCode.match(importRe)).toBe(null);
    expect(leafCode.match(/\bimport\s*\(/)).toBe(null);
    expect(leafCode.match(/\brequire\s*\(/)).toBe(null);
    // And the file is genuinely there to be read — an empty read passes any
    // absence claim.
    expect(leafCode.length).toBeGreaterThan(400);
  });

  // ── STRUCTURAL ARM 2 — one definition of each symbol in the estate ─────────
  it('every moved symbol is DECLARED exactly once in src/, and only in this leaf', () => {
    const files = jsFilesUnder(SRC);
    expect(files.length).toBeGreaterThan(100);
    for (const symbol of MOVED_SYMBOLS) {
      const declarers = files.filter((f) => new RegExp(
        `export\\s+(?:const|function)\\s+${symbol}\\b`,
      ).test(code(f)));
      expect(declarers).toEqual([LEAF]);
    }
  });

  it('neither the seam nor the law re-exports the moved vocabulary — that is what re-opened the cycle', () => {
    const reExport = /export\s*\{[^}]*\}\s*from\s*['"][^'"]*livingContent[^'"]*['"]/;
    expect(reExport.test(code(SEAM))).toBe(false);
    expect(reExport.test(code(join(SRC, 'domain/content/livingContentLaw.js')))).toBe(false);
    // Positive control: the pattern DOES match a re-export when one is present.
    expect(reExport.test("export { A } from './livingContentLawVersion.js';")).toBe(true);
  });
});
