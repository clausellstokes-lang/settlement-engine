/**
 * institutionLabelSeam.census.test.js — HABITAT REMOVAL FOR THE RAW INSTITUTION NAME
 * (ODQ §934.13, the parish-church re-ruling).
 *
 * ── THE CLASS ────────────────────────────────────────────────────────────────────────
 * The institution catalogue has no id/label split: the entry KEY is the name, and ~158
 * sites key on it by substring. §934.13 therefore cured the owner's setting-specific
 * 'Parish church' with a READ-TIME SEAM rather than a rename — which means the cure is
 * only as complete as its INSTALLATION. One surface that prints `inst.name` directly goes
 * on shipping the old word next to fourteen that do not, and nothing fails: the label is
 * a display detail, so no golden moves, no type complains, and the defect is visible only
 * to a reader who happens to open that tab.
 *
 * That is a habitat, not an incident. This walker removes it.
 *
 * ── WHAT IS ASSERTED ─────────────────────────────────────────────────────────────────
 *   1. THE ROSTER HOLDS. Every file the census threaded still IMPORTS and CALLS the seam.
 *      A lane that strips the call while keeping the import, or deletes both, reds here —
 *      this is the arm that notices the cure being backed out one file at a time.
 *   2. THE HABITAT IS EXACTLY THE FROZEN ONE. Every remaining raw `inst.name`-shaped read
 *      under src/components and src/pdf is enumerated below WITH ITS REASON, and the count
 *      per file is EXACT. A new raw read reds; a raw read that goes away demands the row be
 *      removed, so the win is banked rather than quietly absorbed.
 *   3. THE DETECTOR CAN SEE. A synthetic violation is run through the same scanner and must
 *      be caught, and a threaded line must NOT be. Without this pair the two arms above
 *      would pass just as happily against a regex that matches nothing — the vacuous-green
 *      failure this estate has been bitten by before.
 *
 * ── WHY A RAW READ IS NOT ALWAYS A DEFECT ────────────────────────────────────────────
 * A MATCH IS NOT A PRINT. `resolveInstitutionByName`, the supply-chain `present` predicate
 * and every React key read the RAW catalogue key BECAUSE the engine, the catalogue and
 * every saved world still spell it that way. Threading the seam into one of those would
 * break the lookup. So the frozen rows below are not debt to burn down — each is a
 * deliberate, reasoned NON-print, and the reason is carried beside it so a later reader
 * can check the claim instead of trusting it.
 */

import { describe, test, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));
const TREES = ['src/components', 'src/pdf'];
const SEAM_MODULE = 'institutionDisplayName';

/**
 * THE ROSTER: every file the §934.13 census threaded, and what it prints.
 * @type {Readonly<Record<string, string>>}
 */
const THREADED = Object.freeze({
  'src/domain/display/institutionProfile.js': "the profile card's heading and aria-label",
  'src/components/primitives/InstitutionLink.jsx': 'every inline institution trigger and its title',
  'src/components/new/tabs/OverviewTab.jsx': 'the Overview roster pills',
  'src/components/new/SummaryTab.jsx': 'the Summary roster pills',
  'src/components/new/serviceComponents.jsx': "the service row's name",
  'src/components/compendium/CatalogTabs.jsx': "the Compendium's institution catalogue",
  'src/components/new/tabs/EconomicsTab.jsx': 'the "Via:" institution attribution',
  'src/components/new/tabs/DailyLifeTab.jsx': "the institution anchors in the day's prose",
  'src/components/new/SupplyChainsPanel.jsx': "the chain's processing-institution node",
  'src/components/interior/InteriorView.jsx': "the floor plan's heading and image alt text",
  'src/pdf/lib/viewModelBodySlices.js': "the PDF's institution projection",
  'src/pdf/sections/Institutions.jsx': 'the PDF institution card title',
  'src/pdf/sections/Services.jsx': 'the PDF service label',
  'src/pdf/sections/SupplyChainFlow.jsx': 'the PDF supply-chain node',
});

/**
 * THE FROZEN HABITAT: raw institution-name reads that are deliberately NOT prints.
 * EXACT counts, with the reason each one is lawful.
 * @type {Readonly<Record<string, { count: number, why: string }>>}
 */
const ALLOWED_RAW_READS = Object.freeze({
  'src/components/primitives/InstitutionLink.jsx': {
    count: 1,
    why: 'resolveInstitutionByName LOOKS THE INSTITUTION UP in settlement.institutions, which stores the raw catalogue key',
  },
  'src/components/compendium/CatalogTabs.jsx': {
    count: 1,
    why: 'a React key — an identity, not a word, and it must stay stable when the label changes',
  },
  'src/pdf/sections/EconomicsTrade.jsx': {
    count: 1,
    why: "instNames feeds SupplyChainFlow's `present` PREDICATE, which substring-matches the raw roster",
  },
});

/** A raw institution-name read: `inst.name`, `institution?.name`, `instDef.name`. */
const RAW_READ = /\b(?:inst|institution|instDef)\s*\??\.\s*name\b/;

/** Lines that are prose, not code. */
const isComment = (line) => /^\s*(?:\/\/|\/\*|\*)/.test(line.trim()) || /^\s*\*/.test(line);

/**
 * Scan one file's TEXT for raw reads. A line that also calls the seam is threaded and is
 * not a violation — that is what installing the seam looks like at a call site.
 * @param {string} source the file text
 * @returns {Array<{ line: number, text: string }>}
 */
export function scanRawReads(source) {
  const out = [];
  source.split('\n').forEach((line, i) => {
    if (isComment(line)) return;
    if (!RAW_READ.test(line)) return;
    if (line.includes(SEAM_MODULE)) return;
    out.push({ line: i + 1, text: line.trim() });
  });
  return out;
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(jsx?|mjs)$/.test(p)) out.push(p);
  }
  return out;
}

/** Every raw read across the walked trees, grouped by repo-relative path. */
function censusRawReads() {
  /** @type {Record<string, Array<{ line: number, text: string }>>} */
  const found = {};
  for (const tree of TREES) {
    for (const abs of walk(join(ROOT, tree))) {
      const rel = relative(ROOT, abs).replace(/\\/g, '/');
      const hits = scanRawReads(readFileSync(abs, 'utf8'));
      if (hits.length) found[rel] = hits;
    }
  }
  return found;
}

describe('the institution label seam — the roster holds', () => {
  for (const [file, what] of Object.entries(THREADED)) {
    test(`${file} still reads ${what} through the seam`, () => {
      const source = readFileSync(join(ROOT, file), 'utf8');
      const lines = source.split('\n');
      // THE IMPORT …
      const imports = lines.filter((l) => /^import\b/.test(l.trim()) && l.includes(SEAM_MODULE));
      expect(imports.length, `${file} imports the seam`).toBe(1);
      // … AND A USE OF IT. The import alone is not installation: a lane can strip the call
      // and leave the line. Counted OUTSIDE the import, and deliberately NOT as `name(` —
      // EconomicsTab and DailyLifeTab pass the seam BY REFERENCE to `.map()`, which is a
      // perfectly good installation that a paren-shaped check would have called missing.
      const uses = lines.filter((l) => !/^import\b/.test(l.trim()) && l.includes(SEAM_MODULE));
      expect(uses.length, `${file} uses the seam`).toBeGreaterThan(0);
    });
  }

  test('the roster is not silently shrinking', () => {
    expect(Object.keys(THREADED)).toHaveLength(14);
  });
});

describe('the institution label seam — the habitat is exactly the frozen one', () => {
  test('no surface prints a raw institution name outside the reasoned rows', () => {
    const found = censusRawReads();
    const unexpected = [];
    for (const [file, hits] of Object.entries(found)) {
      const allowed = ALLOWED_RAW_READS[file];
      if (!allowed) {
        unexpected.push(`${file}: ${hits.length} raw read(s), no row — ${hits[0].text}`);
      } else if (hits.length !== allowed.count) {
        unexpected.push(
          `${file}: ${hits.length} raw read(s), row says ${allowed.count} (${allowed.why})`,
        );
      }
    }
    expect(unexpected).toEqual([]);
  });

  test('every frozen row still describes a real read — no stale exemptions', () => {
    const found = censusRawReads();
    const stale = Object.keys(ALLOWED_RAW_READS).filter((f) => !found[f]);
    // A row whose read has gone is an exemption that has outlived its reason. Removing it
    // banks the win; leaving it would quietly re-permit a future raw read in that file.
    expect(stale).toEqual([]);
  });

  test('the frozen habitat is small, and every row carries its reason', () => {
    for (const [file, row] of Object.entries(ALLOWED_RAW_READS)) {
      expect(typeof row.why, file).toBe('string');
      expect(row.why.length, file).toBeGreaterThan(20);
      expect(row.count, file).toBeGreaterThan(0);
    }
    expect(Object.keys(ALLOWED_RAW_READS)).toHaveLength(3);
  });
});

describe('the institution label seam — the detector can see', () => {
  // ⛔ WITHOUT THIS PAIR the two describes above would pass against a regex that matches
  // nothing at all. The scanner is run over synthetic source whose answer is known.
  test('a raw print IS caught', () => {
    const hits = scanRawReads('      <Text>{inst.name}</Text>\n');
    expect(hits).toHaveLength(1);
    expect(hits[0].line).toBe(1);
  });

  test('the optional-chained and instDef spellings are caught too', () => {
    expect(scanRawReads('const a = institution?.name;')).toHaveLength(1);
    expect(scanRawReads('const b = instDef.name;')).toHaveLength(1);
  });

  test('a THREADED line is NOT caught', () => {
    const hits = scanRawReads('      <Text>{institutionDisplayName(inst)}</Text>\n');
    expect(hits).toEqual([]);
  });

  test('a line that both reads raw and threads is not counted twice, or at all', () => {
    // The split idiom: the raw binding kept for a lookup, the seam used for the word.
    expect(scanRawReads('const label = institutionDisplayName(inst.name);')).toEqual([]);
  });

  test('a COMMENT mentioning inst.name is not a violation', () => {
    expect(scanRawReads('  // inst.name is the raw catalogue key')).toEqual([]);
    expect(scanRawReads('   * `inst.name` is persisted by assembleInstitutions')).toEqual([]);
  });

  test('an unrelated .name is not swept up', () => {
    // The walk is deliberately narrow: an NPC's or a faction's name is not this seam's job.
    expect(scanRawReads('<Text>{npc.name}</Text>')).toEqual([]);
    expect(scanRawReads('<Text>{faction.name}</Text>')).toEqual([]);
  });
});
