/**
 * fnv1a32Identity.walker.test.js — every local FNV-1a copy in the tree, EXECUTED and proven
 * identical to the canonical one.
 *
 * ── WHAT THIS REPLACES, AND WHY IT IS NOT A RE-HOME ──────────────────────────
 * §766.2 chartered "the SIX `fnv1a32` copies consolidated onto the zero-import leaf". Two
 * measured facts moved that instruction (both recorded at the T7 landing, both reproducible
 * by this file's own scan):
 *
 *   1. THERE ARE NOT SIX. There are TWENTY-TWO named `fnv1a32` definitions in src/. The
 *      "six" came from `proseSelection.js`'s header, which was already stale by sixteen when
 *      the packet quoted it — the first thing this walker fixes is that nobody can quote a
 *      stale count again, because the count is measured here.
 *
 *   2. EVERY ONE OF THEM IS A DELIBERATE, DOCUMENTED ARCHITECTURAL DECISION, not an
 *      accidental transcription. Each carries its own written reason — "carried locally so
 *      this leaf keeps a narrow import posture", "kept as a local 8-line copy so this
 *      primitive stays a dependency-light PDF leaf with no new import edge", "the house
 *      display-sidecar idiom … so it stays a light, dependency-free lazy leaf". One of them,
 *      `proseSelection.js`, has that posture MACHINE-ENFORCED: its coupling-walker row
 *      declares `reads: []` with the note "the day it reaches a port this reds by name
 *      instead of hiding the edge."
 *
 * Re-homing them would overturn a uniform, written, partly machine-enforced chunking posture
 * across thirteen lazy dossier chunks, the PDF primitives and the ornament leaf — a change to
 * bundle composition on a paid surface, against a repo that ratchets bundle size on exact
 * ceilings. That is a priced architectural decision, not a hygiene car's to take on its own
 * authority.
 *
 * ── SO THE HAZARD IS CURED WHERE IT ACTUALLY LIVES ───────────────────────────
 * The hazard the charter names is DRIFT: twenty-two transcriptions that could diverge.
 * Today, twenty-two comments ASSERT identity ("the constants are identical everywhere they
 * appear") and NOTHING CHECKS IT. This file turns that assertion into an executed fact:
 * every definition is extracted from source, RUN over a corpus, and compared to the
 * canonical body. A twenty-third copy — correct or not — reds here the day it lands, and so
 * does the first character of real divergence.
 *
 * ⛔ THESE HASHES ARE GOLDEN-BOUND. Prose selection, market prices, settlement rumors, the
 * chronicle and the seeded-ornament family all persist a picked string chosen by one of
 * these. A divergence is not a style question; it is same-seed history moving.
 *
 * IT EXECUTES, IT DOES NOT DIFF TEXT. Two different spellings can compute the same hash and
 * identical text can be reached by different code; only running them settles it. That is the
 * anti-mirror discipline this estate applies to every other census.
 *
 * @enforced-by this file
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';

import { fnv1a32 as canonicalFnv1a32 } from '../../src/kernel/proseHash.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

/** The canonical home. Every local copy's own comment already names it as the reference. */
const CANONICAL = 'src/kernel/proseHash.js';

/**
 * The measured population at the T7 landing. SHRINK-ONLY: a consolidation lowers it, a new
 * copy raises it and reds. It is a CEILING, not an equality, so cures do not need this file
 * re-recorded — but growth needs an argument.
 */
const COPY_CEILING = 22;

function srcFiles(dir = path.join(ROOT, 'src'), out = []) {
  for (const entry of fs.readdirSync(dir).sort()) {
    const full = path.join(dir, entry);
    if (fs.statSync(full).isDirectory()) srcFiles(full, out);
    else if (/\.(js|jsx)$/.test(entry)) out.push(path.relative(ROOT, full).replace(/\\/g, '/'));
  }
  return out;
}

/** Every `function fnv1a32(...) { ... }` in src/, compiled from its own source text. */
function collectDefinitions() {
  const definition = /(?:export\s+)?function\s+fnv1a32\s*\(([^)]*)\)\s*\{([\s\S]*?)\n\}/;
  const found = [];
  for (const rel of srcFiles()) {
    const source = fs.readFileSync(path.join(ROOT, rel), 'utf8');
    const match = definition.exec(source);
    if (!match) continue;
    found.push({ rel, param: match[1].trim(), fn: new Function(match[1], match[2]) });
  }
  return found;
}

/** Inputs chosen to reach every branch a 32-bit string hash has: empty, single, multibyte,
 *  the `::` fork delimiter the estate seeds with, a long run that overflows the accumulator
 *  many times over, and the real shape of a seeded selection key. */
function corpus() {
  const out = [];
  for (let i = 0; i < 512; i += 1) out.push(`seed-${i}`);
  out.push('', 'a', 'ünïcødé ✦', '::', '\x00', '￿', 'x'.repeat(4096), '0',
    'settlement:Ashford::rumor:3', String(Number.MAX_SAFE_INTEGER),
    'war:Ashford|Brackenhold::casus:border_raid');
  return out;
}

const DEFINITIONS = collectDefinitions();
const CORPUS = corpus();

describe('every fnv1a32 in src/ is the SAME function', () => {
  test('the scan finds the population it claims, and the canonical home is among them', () => {
    expect(DEFINITIONS.length, 'the extractor found nothing — it has drifted off its subject')
      .toBeGreaterThan(1);
    expect(DEFINITIONS.length, `fnv1a32 copies grew past ${COPY_CEILING}. A new local copy is `
      + 'a new drift surface: import an existing one, or argue the count up here with the '
      + 'chunking reason the other copies each carry').toBeLessThanOrEqual(COPY_CEILING);
    expect(DEFINITIONS.map((d) => d.rel)).toContain(CANONICAL);
  });

  test.each(DEFINITIONS.map((d) => [d.rel, d]))(
    '%s computes the canonical hash for every input',
    (rel, definition) => {
      const divergent = CORPUS
        .map((input) => [input, definition.fn(input), canonicalFnv1a32(input)])
        .filter(([, mine, theirs]) => mine !== theirs)
        .map(([input, mine, theirs]) => `${JSON.stringify(input).slice(0, 48)}: ${mine} ≠ ${theirs}`);
      expect(divergent, `${rel} has DRIFTED from ${CANONICAL}. These hashes are golden-bound — `
        + 'prose selection, market prices, rumors, the chronicle and seeded ornament all '
        + 'persist a string one of them picked, so this is same-seed history moving')
        .toEqual([]);
    },
  );

  test('the comparison is not vacuous — a planted one-character divergence is convicted', () => {
    // The classic transcription slip: the FNV prime off by one bit (0x01000193 → 0x01000191).
    // If the check above could not see this, it could not see a real drift either.
    const planted = new Function('str', `
      let h = 0x811c9dc5;
      const s = String(str);
      for (let i = 0; i < s.length; i += 1) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000191); }
      return h >>> 0;`);
    const divergent = CORPUS.filter((input) => planted(input) !== canonicalFnv1a32(input));
    expect(divergent.length, 'a wrong FNV prime produced identical hashes — the corpus is inert')
      .toBeGreaterThan(CORPUS.length / 2);

    // …and a legitimate re-spelling (the ornament leaf's extra per-iteration `>>> 0`) is NOT
    // convicted, so the check tests behaviour rather than punishing style.
    const respelled = new Function('str', `
      let h = 0x811c9dc5;
      for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
      return h >>> 0;`);
    expect(CORPUS.filter((input) => respelled(input) !== canonicalFnv1a32(input))).toEqual([]);
  });

  test('the corpus reaches the inputs a hash can hide a bug behind', () => {
    // A corpus of only short ASCII would miss an accumulator-overflow or charCode bug.
    expect(CORPUS).toContain('');
    expect(CORPUS.some((s) => s.length > 4000)).toBe(true);
    expect(CORPUS.some((s) => [...s].some((c) => c.charCodeAt(0) > 127))).toBe(true);
    expect(CORPUS.some((s) => s.includes('::'))).toBe(true);
    // Distinctness: a corpus that collided with itself would hide a constant-output copy.
    expect(new Set(CORPUS.map((s) => canonicalFnv1a32(s))).size)
      .toBeGreaterThan(CORPUS.length * 0.9);
  });
});
