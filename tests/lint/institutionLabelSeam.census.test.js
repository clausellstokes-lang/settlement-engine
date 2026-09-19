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
 *   3. THE WORD ITSELF DOES NOT REACH A READER (ODQ §934.22, the second browser pass). Arm 2
 *      catches a raw `inst.name` READ. It cannot catch the word arriving any OTHER way, and
 *      the browser pass found three that did: the Religious Quarter's landmark bullet prints
 *      `q.landmarks[]`, which `spatialGenerator` fills by FILTERING `instNames` — the raw key
 *      under a different field name; a chain's `Via` list prints
 *      `chain.processingInstitutions[]`, the same key persisted into `economicState`; and the
 *      Defense tab's Medical Readiness note was an AUTHORED string that simply said 'Parish
 *      care'. A shape-scanner cannot see any of those, so the third arm scans for the WORD —
 *      in every form the browser pass met it, plural ('Parish churches'), adjectival ('parish
 *      care') and possessive ("the parish's") — across the screen, the document, the shared
 *      display layer and the VTT journal, with each surviving occurrence reasoned in a frozen
 *      register. The stronger rule, deliberately: §934.13's own pin is already that NO
 *      CATALOGUE KEY CONTAINING 'parish' MAY REACH A READER, and this is that pin turned
 *      around to face the call sites instead of the catalogue.
 *
 *   4. THE DETECTOR CAN SEE. A synthetic violation is run through the same scanner and must
 *      be caught, and a threaded line must NOT be. Without this pair the arms above
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

/**
 * ARM 3's TREES — wider than the shape scan's, because the WORD travels further than the
 * shape does. `src/domain/display` is the layer both surfaces read (the seam itself lives
 * there, and so did 'Parish care' and 'Parish clergy'), and `src/foundry` writes the VTT
 * journal, which is a reader surface that no PDF or component test ever looks at.
 */
const WORD_TREES = ['src/components', 'src/pdf', 'src/domain/display', 'src/foundry'];
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
 * The same, plus the JSX comment opener `{/*`. Kept as a SECOND function rather than folded
 * into `isComment`: arm 2's frozen counts were measured against that predicate exactly, and
 * widening it under them would move three numbers nobody asked to move.
 * @param {string} line
 */
const isCommentOrJsxComment = (line) => isComment(line) || /^\s*\{\s*\/\*/.test(line);

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

/**
 * ARM 3's FROZEN REGISTER: every remaining occurrence of the WORD under WORD_TREES, with the
 * reason it is lawful and — where it is not yet lawful — WHO OWES THE CURE.
 *
 * ⛔ COUNTS ARE EXACT IN BOTH DIRECTIONS, which is what makes an `owed` row an alarm rather
 * than a permission slip: the moment the owing lane applies its line, the count falls, this
 * arm REDS, and the row must be deleted. A debt that goes quiet when it is paid is a debt
 * nobody ever pays.
 * @type {Readonly<Record<string, { count: number, why: string, owed?: string }>>}
 */
const ALLOWED_WORD_SITES = Object.freeze({
  'src/domain/display/institutionDisplayName.js': {
    count: 6,
    why: 'THE SEAM ITSELF — the six catalogue keys are its left-hand side, and a map that could not name its own input would map nothing',
  },
  'src/domain/display/institutionVocabulary.js': {
    count: 8,
    why: 'LOOKUP KEYS, never values: every one of these entries is keyed by the raw catalogue key and its reader-facing VALUE already reads "house of worship" (lane 19 moved the prose, §934.13 left the keys as identifiers)',
  },
  'src/domain/display/stateProse/defenseStateProse.js': {
    count: 2,
    why: 'A POOL KEY AND THE STATE STRING THAT SELECTS IT ("granary, parish care" → "Disasters & Famine: granary AND parish care only"). The key is matched against the corpus, never printed; the SENTENCES the pool draws are the corpus\'s own and carry no such word',
  },
  'src/domain/display/rumorPhrasePools.js': {
    count: 2,
    why: 'PROJECTED CORPUS, not authored here: both lines are verbatim rows of docs/content/RECEIPT_POOLS_LEGACY.md (§ the plague_arrival and faith_foothold_recruited variant lists) and tests/lint/proseMoveGrammar.walker.test.js pins the family',
    owed: 'THE CORPUS ACT, owner-gated: the word also stands in RECEIPT_POOLS_FAITH.md and RECEIPT_POOLS_CAUSAL.md, so editing the projection alone would desync it from its document. Reported to the chair by lane 27 (ODQ §934.22) rather than cured under a display order.',
  },
  'src/domain/display/rumorFallbackPhrasePools.js': {
    count: 1,
    why: 'PROJECTED CORPUS — RECEIPT_POOLS_LEGACY.md\'s cult fallback variant, verbatim',
    owed: 'the same corpus act as rumorPhrasePools.js above',
  },
});

/**
 * ⛔ THE TWO LINES THIS LANE COULD NOT WRITE, NAMED SO THEY CANNOT BE FORGOTTEN.
 *
 * `chain.processingInstitutions[]` is the raw catalogue key persisted into
 * `economicState.activeChains[]`, and the browser pass met it as "Faith & Worship — Via:
 * Parish church · Monastery · Almshouse". `SupplyChainsPanel.jsx` already threads the same
 * field (`institutionDisplayName(inst.name)`, :208), so the cure is one call at each of the
 * two remaining readers — both of which belong to ANOTHER LANE in the 2026-09-18 consist,
 * and a lane that edits a file it does not own is how two lanes silently overwrite each
 * other. The arm below therefore asserts the defect is EXACTLY where it was left: two files,
 * one raw print each. When the owing lane threads them the count goes to zero, this reds, and
 * the rows come out.
 * @type {Readonly<Record<string, { count: number, line: string, owner: string }>>}
 */
const OWED_ELSEWHERE = Object.freeze({
  'src/components/new/tabs/EconomicsTab.jsx': {
    count: 1,
    line: ":173  {chain.processingInstitutions.join(' · ')} ⇒ {chain.processingInstitutions.map(institutionDisplayName).join(' · ')}",
    owner: 'lane 25 (EconomicsTab.jsx), ODQ §934.22 item 1(b)',
  },
  'src/pdf/sections/EconomicsTrade.jsx': {
    count: 1,
    line: ":227  c.processingInstitutions.map(label) ⇒ c.processingInstitutions.map((n) => label(institutionDisplayName(n)))",
    owner: 'lane 25 (EconomicsTrade.jsx), ODQ §934.22 item 1(b)',
  },
});

/** The WORD, in every form the browser pass met it: plural, adjectival, possessive. */
const WORD = /parish/i;

/**
 * The raw `processingInstitutions` prints arm 3 cannot see — the field name carries no
 * 'parish', so only a shape scan finds them — counted so the owed rows above are an
 * assertion rather than a claim.
 *
 * LINE-LOCAL AND DELIBERATELY SO: a line that turns the list into TEXT on that same line
 * (`.join(…)`, `.map(…)`) is a print. A `.length` test is not, and neither is the
 * ARRAY-SPREAD idiom `[c.resource, ...(c.processingInstitutions || []), …]` — that one is the
 * CUSTOM-chain flow string on both surfaces, and custom content is the user's own words,
 * which §934.13's seam passes through unchanged and this census has no business counting as
 * a parish-church leak.
 * @param {string} source
 * @returns {number}
 */
export function countRawChainInstitutionPrints(source) {
  let n = 0;
  for (const line of source.split('\n')) {
    if (isComment(line)) continue;
    if (!/processingInstitutions/.test(line)) continue;
    if (line.includes(SEAM_MODULE)) continue;
    if (!/\.(?:join|map)\s*\(/.test(line)) continue;
    n += 1;
  }
  return n;
}

/**
 * Every line under WORD_TREES that carries the word outside a comment.
 *
 * ⛔ WHAT COUNTS AS A COMMENT HERE, AND THE RULE THAT FOLLOWS FROM IT. `isComment` asks
 * whether a line STARTS with `//`, `/*`, `{/*` or `*`. That is deliberately a LINE-LOCAL
 * test: the obvious upgrade — carrying `/*` depth across lines — was written, run over these
 * four trees, and DESYNCED ON TWENTY-TWO FILES, because a glob (`'**\/*.js'`), a regex and a
 * `*\/` inside a template literal all put those two characters in code. A scanner that
 * silently swallows twenty-two files is worse than one with a spelling rule.
 *
 * SO THE SPELLING RULE IS: a comment that QUOTES the cured word — which a comment explaining
 * this cure should — must have every line begin with `//`, `*` or `{/*`. That is the estate's
 * own block-comment style anyway, and the comments this car wrote are formatted that way.
 * @param {string} source
 * @returns {Array<{ line: number, text: string }>}
 */
export function scanWordSites(source) {
  const out = [];
  source.split('\n').forEach((line, i) => {
    if (isCommentOrJsxComment(line)) return;
    if (!WORD.test(line)) return;
    out.push({ line: i + 1, text: line.trim() });
  });
  return out;
}

/** Every word site across the wider trees, grouped by repo-relative path. */
function censusWordSites() {
  /** @type {Record<string, Array<{ line: number, text: string }>>} */
  const found = {};
  for (const tree of WORD_TREES) {
    for (const abs of walk(join(ROOT, tree))) {
      const rel = relative(ROOT, abs).replace(/\\/g, '/');
      const hits = scanWordSites(readFileSync(abs, 'utf8'));
      if (hits.length) found[rel] = hits;
    }
  }
  return found;
}

describe('the institution label seam — the WORD does not reach a reader', () => {
  test('no surface under the wider trees carries the word outside the reasoned rows', () => {
    const found = censusWordSites();
    const unexpected = [];
    for (const [file, hits] of Object.entries(found)) {
      const row = ALLOWED_WORD_SITES[file];
      if (!row) {
        unexpected.push(`${file}: ${hits.length} occurrence(s) of the word, no row — line ${hits[0].line}: ${hits[0].text}`);
      } else if (hits.length !== row.count) {
        unexpected.push(`${file}: ${hits.length} occurrence(s), row says ${row.count} (${row.why})`);
      }
    }
    expect(unexpected).toEqual([]);
  });

  test('every reasoned row still describes a real occurrence — no stale permissions', () => {
    const found = censusWordSites();
    const stale = Object.keys(ALLOWED_WORD_SITES).filter((f) => !found[f]);
    expect(stale).toEqual([]);
  });

  test('the four surfaces §934.22 cured stay cured', () => {
    // ⛔ NAMED INDIVIDUALLY rather than left to the census above, because the census only
    // knows that a file has no row — it cannot say which DEFECT a row's absence proves gone.
    // anchored: each file below is read from disk in this same test, so a rename reds here
    // rather than passing vacuously.
    for (const file of [
      'src/components/new/tabs/OverviewTab.jsx',      // the Religious Quarter's landmark bullet
      'src/components/new/SummaryTab.jsx',            // the same landmarks, compactly
      'src/pdf/sections/Overview.jsx',                // the document's QUARTERS block
      'src/pdf/sections/IdentityDailyLife.jsx',       // the fillable LANDMARKS field
      'src/foundry/journalPages.js',                  // the VTT journal's quarters + institutions
    ]) {
      const source = readFileSync(join(ROOT, file), 'utf8');
      expect(source.length, `${file} is readable`).toBeGreaterThan(0);
      expect(source.includes(SEAM_MODULE), `${file} threads the seam`).toBe(true);
      expect(scanWordSites(source), `${file} carries the word again`).toEqual([]);
    }
    // The two authored strings that simply SAID the word, with no institution in sight.
    for (const [file, gone, kept] of [
      ['src/domain/display/defenseDisplay.js', 'Parish care', 'Clerical care'],
      ['src/domain/display/threatAssessment.js', 'Parish clergy', 'Clergy provide basic wound care'],
    ]) {
      const source = readFileSync(join(ROOT, file), 'utf8');
      // anchored: the replacement is asserted PRESENT in the same file, so a deletion of the
      // whole line cannot read as a pass.
      expect(source.includes(kept), `${file} lost its cured wording`).toBe(true);
      expect(source.includes(gone), `${file} says "${gone}" again`).toBe(false);
    }
  });

  test('the two lines lane 25 owes are exactly where they were left', () => {
    for (const [file, row] of Object.entries(OWED_ELSEWHERE)) {
      const source = readFileSync(join(ROOT, file), 'utf8');
      expect(
        countRawChainInstitutionPrints(source),
        `${file}: ${row.owner} — apply \`${row.line}\`, then DELETE this row`,
      ).toBe(row.count);
    }
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

  test('a JSX comment that QUOTES the cured word is prose, not a fresh violation', () => {
    // ⛔ THE CONTROL THIS ARM EXISTS FOR: the first cut of the word scan convicted its own
    // explanatory comment. anchored: the SAME words outside a comment ARE caught below, so
    // this is not a scanner that has simply stopped matching.
    const jsx = [
      "      {/* A LANDMARK IS A RAW CATALOGUE KEY, so this line printed",
      "        * 'Parish churches (2-5)' before the seam. */}",
      '      <Text>{institutionDisplayName(lm)}</Text>',
    ].join('\n');
    expect(scanWordSites(jsx)).toEqual([]);
    expect(scanWordSites("      <Text>{'Parish churches (2-5)'}</Text>")).toHaveLength(1);
  });

  test('the WORD scanner catches plural, adjectival and possessive forms alike', () => {
    expect(scanWordSites("<Text>Parish churches (2-5)</Text>")).toHaveLength(1);
    expect(scanWordSites("      status: 'Parish care',")).toHaveLength(1);
    expect(scanWordSites("const s = `the parish's own plot`;")).toHaveLength(1);
    // A COMMENT explaining the cure is not the defect it explains.
    expect(scanWordSites("  // printed 'Parish churches (2-5)' before the seam")).toEqual([]);
    expect(scanWordSites("   * 'Parish church' is the raw catalogue key")).toEqual([]);
    // A line with no such word at all.
    expect(scanWordSites("<Text>{institutionDisplayName(lm)}</Text>")).toEqual([]);
  });

  test('the chain-print counter separates a PRINT from a length test', () => {
    expect(countRawChainInstitutionPrints("{chain.processingInstitutions.join(' · ')}")).toBe(1);
    expect(countRawChainInstitutionPrints('c.processingInstitutions?.length ? 1 : 0')).toBe(0);
    // The custom-chain spread: the user's own words, not a catalogue key.
    expect(countRawChainInstitutionPrints('const flow = [c.resource, ...(c.processingInstitutions || [])]')).toBe(0);
    expect(countRawChainInstitutionPrints(
      "{chain.processingInstitutions.map(institutionDisplayName).join(' · ')}",
    )).toBe(0);
  });

  test('an unrelated .name is not swept up', () => {
    // The walk is deliberately narrow: an NPC's or a faction's name is not this seam's job.
    expect(scanRawReads('<Text>{npc.name}</Text>')).toEqual([]);
    expect(scanRawReads('<Text>{faction.name}</Text>')).toEqual([]);
  });
});
