/**
 * tests/joins/labelJoins.test.js — Cohesion Wave 8: the habitat freeze.
 *
 * The bug class this gate makes structurally unable to return: IDENTITY BY
 * LABEL. For years the engine joined institutions to chains, services, and
 * dependencies by fuzzy name matching — 12-char prefixes ('Mill' matching
 * 'Access to external mill') and bare substring .includes() — and every such
 * site is a silent false-match or silent no-match waiting for the next
 * catalog respelling. Wave 8 gave institutions stable catalog ids
 * (catalogIdForName, src/data/institutionalCatalog.js) and an id-first join
 * (institutionMatchesProcessor, src/generators/computeActiveChains.js).
 *
 * This test freezes the remaining habitat: every label-join site in
 * src/generators + src/domain is enumerated below with its CURRENT count.
 * The inventory can only SHRINK. A count that grows means someone added a
 * new label join — the fix is to join by id instead:
 *
 *   • chain-processor joins → institutionMatchesProcessor(inst, pattern)
 *   • presence checks on catalog institutions → compare inst.catalogId to
 *     catalogIdForName('<canonical name>') (fall back to the name matcher
 *     ONLY for unstamped legacy/custom content)
 *
 * Scan signatures (comment-stripped source; surgical by design — generic
 * string .includes() is NOT scanned, only the institution-label idioms):
 *   prefix-includes   — .includes(…  .slice(0, N))  — the 12-char-prefix join
 *   lowercase-prefix  — .toLowerCase().slice(0, N)  — prefix key derivation
 *   instNames-scan    — <…>inst[itution]Names.some/filter/find/every( — fuzzy
 *                       scans over institution-name collections
 *   instName-includes — i.name / inst.name / institution.name … .includes(
 *
 * Known gaps (documented, not scanned): collections not named *instNames*
 * (e.g. institutionLifecycle's existingNames set) and regex .test() probes.
 * Two more, verifier-proven: (1) SPLIT-LINE prefix derivation evades all four
 * signatures — deriving the prefix key on one line (`const key =
 * name.toLowerCase().slice(0, 12)` matches lowercase-prefix, but a bare
 * `name.slice(0, 12)` does not) and calling `.includes(key)` on another
 * matches nothing; (2) instName-includes is line-scoped and can FALSE-POSITIVE
 * on a same-line unrelated `.includes(` after an inst.name mention (e.g.
 * `f(inst.name, tags.includes('x'))` counts as a label join). Both are
 * accepted costs of a regex gate — the counts below were hand-audited.
 * The load-bearing chain joins are converted and pinned elsewhere
 * (tests/joins/institutionIdentity.test.js); this gate keeps the REST of the
 * habitat from growing back.
 */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..');
const SCAN_DIRS = ['src/generators', 'src/domain'];

// ── The frozen inventory (file → label-join site count) ──────────────────────
// Recorded 2026-06-11 (Wave 8). SHRINK-ONLY: convert a site to ids and lower
// its number (or delete the line at zero). Never raise a number; never add a
// file. New files must join by catalog id from day one.
//
// ONE-TIME CORRECTION 2026-06-14: de-minifying the machine-minified helper
// functions in economicGenerator.js (55→58) and powerGenerator.js (17→18)
// renamed single-letter collections to their accurate names (`o` → `instNames`,
// etc.), which made PRE-EXISTING label-join scans textually visible to this
// regex gate for the first time — the minified `o.some(n => n.includes(...))`
// evaded the `instNames`/`inst.name` signatures. No new label-join LOGIC was
// added: the generator golden master (tests/property/generatorGoldenMaster)
// proves byte-identical output across 155 configs. The corrected counts reflect
// de-obfuscated reality; these revealed sites remain id-join conversion
// candidates, and the shrink-only rule holds from the new baseline.
const FROZEN_LABEL_JOINS = Object.freeze({
  'src/domain/worldPulse/institutionLifecycle.js': 1,
  'src/generators/aiLayer.js': 2,
  'src/generators/cascadeGenerator.js': 2,
  'src/generators/computeActiveChains.js': 10,
  'src/generators/defenseGenerator.js': 2,
  'src/generators/economicGenerator.js': 58, // 55 → 58: de-minification revealed existing scans (see note above)
  'src/generators/foodGenerator.js': 3,
  'src/generators/historyGenerator.js': 13,
  'src/generators/isolationGenerator.js': 1,
  'src/generators/narrativeGenerator.js': 1,
  'src/generators/npcGenerator.js': 5,
  'src/generators/powerGenerator.js': 18, // 17 → 18: de-minification revealed an existing scan (see note above)
  'src/generators/priorityHelpers.js': 1,
  'src/generators/spatialGenerator.js': 8,
  'src/generators/steps/cascadePass.js': 1,
  'src/generators/stressGenerator.js': 8,
  'src/generators/structuralValidator.js': 1,
});

// ── The scanner ───────────────────────────────────────────────────────────────

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, out);
    else if (/\.(js|jsx)$/.test(entry.name)) out.push(p);
  }
  return out;
}

function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '');
}

const SIGNATURES = {
  // .includes(<expr>.slice(0, N)) — the inline 12-char-prefix join.
  prefixIncludes: /\.includes\(\s*(?:[^()]|\([^()]*\))*?\.slice\(0,\s*\d+\)\s*\)/g,
  // .toLowerCase().slice(0, N) — derivation of a prefix join key
  // (counted only OUTSIDE prefix-includes matches, so a site is one site).
  lowercasePrefix: /\.toLowerCase\(\)\s*\.slice\(0,\s*\d+\)/g,
  // instNames/_settlementInstNames/institutionNames….some|filter|find|every(
  instNamesScan: /[\w$]*[Ii]nst(?:itution)?[Nn]ames?\b\s*\.\s*(?:some|filter|find|every)\s*\(/g,
  // i.name / inst.name / institution.name … .includes( on one line
  instNameIncludes: /\b(?:i|inst|institution)\.name\b[^\n]*?\.includes\(/g,
};

function scanFile(absPath) {
  const src = stripComments(fs.readFileSync(absPath, 'utf8'));
  const counts = { prefixIncludes: 0, lowercasePrefix: 0, instNamesScan: 0, instNameIncludes: 0 };
  const prefixRanges = [];
  let m;
  SIGNATURES.prefixIncludes.lastIndex = 0;
  while ((m = SIGNATURES.prefixIncludes.exec(src))) {
    prefixRanges.push([m.index, m.index + m[0].length]);
  }
  counts.prefixIncludes = prefixRanges.length;
  SIGNATURES.lowercasePrefix.lastIndex = 0;
  while ((m = SIGNATURES.lowercasePrefix.exec(src))) {
    if (!prefixRanges.some(([a, b]) => m.index >= a && m.index < b)) counts.lowercasePrefix += 1;
  }
  for (const key of ['instNamesScan', 'instNameIncludes']) {
    SIGNATURES[key].lastIndex = 0;
    while ((m = SIGNATURES[key].exec(src))) counts[key] += 1;
  }
  return counts;
}

function scanTree() {
  const results = new Map();
  for (const dir of SCAN_DIRS) {
    for (const abs of walk(path.join(ROOT, dir))) {
      const rel = path.relative(ROOT, abs).split(path.sep).join('/');
      const counts = scanFile(abs);
      const total = Object.values(counts).reduce((a, b) => a + b, 0);
      if (total > 0) results.set(rel, { counts, total });
    }
  }
  return results;
}

// ── The pins ─────────────────────────────────────────────────────────────────

describe('label-join habitat freeze (shrink-only inventory)', () => {
  const scanned = scanTree();

  it('no file gains a label-join site (new joins must use catalog ids)', () => {
    const grown = [];
    for (const [file, { counts, total }] of scanned) {
      const allowed = FROZEN_LABEL_JOINS[file] ?? 0;
      if (total > allowed) {
        grown.push(`${file}: ${total} label-join sites (frozen at ${allowed}) — ${JSON.stringify(counts)}`);
      }
    }
    // A non-empty list means a NEW identity-by-label join entered the tree.
    // Do not raise the frozen count. Join by id instead:
    //   institutionMatchesProcessor(inst, pattern)  — chain processors
    //   inst.catalogId === catalogIdForName(name)   — presence checks
    // (fuzzy name matching is reserved for unstamped legacy/custom content,
    // and only via the existing frozen sites).
    expect(grown).toEqual([]);
  });

  it('the inventory is honest: every frozen file still exists in the scan tree', () => {
    const ghosts = Object.keys(FROZEN_LABEL_JOINS)
      .filter(file => !fs.existsSync(path.join(ROOT, file)));
    // A ghost entry means the file moved or died — delete its row so the
    // frozen inventory stays a true map of the remaining habitat.
    expect(ghosts).toEqual([]);
  });

  it('the converted load-bearing joints stay converted (their counts cannot quietly climb back)', () => {
    // computeActiveChains keeps exactly: 1 canonical legacy fallback matcher
    // (fuzzyProcessorMatch — the ONE place the 12-char prefix may live),
    // 2 tradeDependencies prefix joins, and 7 frozen instNames scans.
    const cac = scanned.get('src/generators/computeActiveChains.js');
    expect(cac.counts.prefixIncludes).toBeLessThanOrEqual(3);
    // institutionLifecycle's PROCESSOR_MATCH is gone — only the
    // buildableEntryForProcessor catalog-side resolver remains.
    const lifecycle = scanned.get('src/domain/worldPulse/institutionLifecycle.js');
    expect(lifecycle.total).toBeLessThanOrEqual(1);
  });
});
