/**
 * tests/copy/voiceMechanics.test.js — E2: THE VOICE-MECHANICS WALKER
 * (VOICE_AND_TONE §3/§7 — the em-dash and exclamation-point ban, enforced).
 *
 * Three sites (docs/VOICE_AND_TONE.md §7, src/lib/seo.js, src/lib/seoCompendium.js)
 * referenced this guard before it existed; fix wave 3 makes the claim true.
 *
 * THREE ENFORCEMENT TIERS:
 *  1. THE COPY REGISTRIES — HARD ZERO. Every string VALUE reachable through the
 *     centralized copy objects (`en`, `landing`, `pricingPage`, `footer`,
 *     `deityAuthoring`) must carry no U+2014 and no `!`. The registries were
 *     swept clean in fix wave 3; new copy cannot reintroduce the tells.
 *  2. THE PROSE SOURCE FILES — SHRINK-ONLY RATCHET. Every string LITERAL in
 *     src/data/*.js and src/domain/(*)*.js is scanned (comments and template
 *     `${…}` expressions excluded — the ban governs text the reader sees, not
 *     dev notes). tests/copy/.voice-mechanics-baseline.json freezes today's
 *     per-file debt: a file whose count GROWS fails; a file that fell must be
 *     struck/lowered (the errorCopyBaseline honesty idiom). The remaining debt
 *     is dominated by the kernel prose pools (eventProse/roadsProse/
 *     traditionProse — canonical-at-zero contracts) and burns down by wave.
 *  3. E-E — THE JSX EXTENSION (docs/THE_APLUS_EXECUTION_ARCHITECTURE.md §E-E).
 *     Tier 2's char tokenizer only finds QUOTED string literals, so it never
 *     reached src/**\/*.jsx: the reader-facing copy in a component is usually
 *     JSX TEXT (`<h2>The town thrives!</h2>`), not a quoted literal — a
 *     structural blind spot, "E2 scans registries + data, not components."
 *     This tier parses every .jsx file with a real JSX-aware AST walk
 *     (tests/helpers/jsxLiteralWalk.js) and applies the identical em-dash/`!`
 *     ban as Tier 2, SHRINK-ONLY, baselined in
 *     tests/copy/.voice-mechanics-jsx-baseline.json. The initial baseline is a
 *     FINDING: 396 em dashes and 10 exclamation points already live,
 *     unenforced, in components (see enforcer-ee-voice-shipped.md).
 *
 * TO COMPLY when this reds:
 *   - a NEW em dash / `!` in a registry string → rewrite per VOICE_AND_TONE §6.
 *   - a file's count grew → rewrite the new string; never raise the baseline.
 *   - a file's count fell → lower (or delete) its baseline entry to bank the win.
 *   - APPROVED sweep landed → regenerate: UPDATE_VOICE_BASELINE=1 npx vitest run
 *     tests/copy/voiceMechanics.test.js  (shrink-only: totals may never grow;
 *     this regenerates BOTH the Tier-2 and Tier-3/JSX baselines).
 *
 * ⭐ THE SHIFT RECORD (VOICE-1b, 2026-08-31; the full entry lives with this instrument's
 * banked rows in scripts/.test-ratchet-baseline.json). TWO trains landed the generated
 * dossier corpora on 2026-08-03, not one: P-1 `a277f53d3` (six state-prose desk leaves,
 * 635 em, 81.5% of the drift, named nowhere until ODQ §854) and P-3 `23d118eb2` (the
 * causal corpus, 144 em). P-1 alone breached the budget — 469 committed against 670 at
 * `a277f53d3^` left 201 of headroom for 635 of new debt — so the rows' `introducedAt`
 * moved from P-3 to P-1. Measured here at `6770f878f`: 1478 / 21, not the 1369 / 18 the
 * blockers had recorded. VOICE-1b then burned the corpus's DARK half (299 pool-key + 142
 * title em dashes, 1478 → 1028); those pool keys are hashed into the draw
 * (stateProseKernel.js `drawVariant`), so that was a DECLARED one-time shift, free only
 * while the corpus has zero product callers. The 338 reader-facing variant sentences were
 * deliberately NOT touched: they are the owner-signed T5-ONE-REGEN constituent.
 *
 * ⭐ THE SHRINK-ONLY CLAIM IS NOW ENFORCED (VOICE-1b, ODQ §854). Both writes above
 * went through a bare `writeFileSync`, so the documented command BANKED whatever
 * drift it found — the one thing the ratchet exists to forbid, performed by its own
 * documented cure. They now route through
 * tests/helpers/shrinkOnlyBaseline.js#writeShrinkOnlyBaseline, which THROWS rather
 * than writing when any metric total would rise. The same variable drives
 * tests/copy/proseLeak.test.js, whose write carries the identical guard.
 */
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import { en } from '../../src/copy/en.js';
import { landing } from '../../src/copy/landing.js';
import { pricingPage } from '../../src/copy/pricingPage.js';
import { footer } from '../../src/copy/footer.js';
import { deityAuthoring } from '../../src/copy/deityAuthoring.js';
import { parse } from 'espree';

import { extractJsxProseStrings, scanJsxTree } from '../helpers/jsxLiteralWalk.js';
import { writeShrinkOnlyBaseline } from '../helpers/shrinkOnlyBaseline.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const BASELINE_PATH = join(ROOT, 'tests/copy/.voice-mechanics-baseline.json');
const JSX_BASELINE_PATH = join(ROOT, 'tests/copy/.voice-mechanics-jsx-baseline.json');
const UPDATE = process.env.UPDATE_VOICE_BASELINE === '1';

// ── Tier 1: the runtime registry walk (hard zero) ────────────────────────────

/** @param {unknown} v @param {string} path @param {Array<{path:string,text:string}>} out */
function walkValues(v, path, out) {
  if (typeof v === 'string') {
    if (v.includes('—') || v.includes('!')) out.push({ path, text: v.slice(0, 80) });
  } else if (Array.isArray(v)) {
    v.forEach((x, i) => walkValues(x, `${path}[${i}]`, out));
  } else if (v && typeof v === 'object') {
    for (const [k, x] of Object.entries(v)) walkValues(x, `${path}.${k}`, out);
  }
}

const REGISTRIES = { en, landing, pricingPage, footer, deityAuthoring };

// ── Tier 2: the string-literal source scan ───────────────────────────────────

/**
 * Extract the CONTENTS of every '…', "…", and `…` literal in a JS source,
 * skipping // and /* *\/ comments and `${…}` template expressions.
 * @param {string} src @returns {string[]}
 */
function charScanStringContents(src) {
  const out = [];
  let i = 0;
  const n = src.length;
  while (i < n) {
    const c = src[i];
    if (c === '/' && src[i + 1] === '/') { while (i < n && src[i] !== '\n') i++; continue; }
    if (c === '/' && src[i + 1] === '*') {
      i += 2;
      while (i < n && !(src[i] === '*' && src[i + 1] === '/')) i++;
      i += 2; continue;
    }
    if (c === "'" || c === '"') {
      const q = c; let buf = ''; i++;
      while (i < n && src[i] !== q) {
        if (src[i] === '\\') { buf += src[i + 1] ?? ''; i += 2; continue; }
        buf += src[i]; i++;
      }
      i++; out.push(buf); continue;
    }
    if (c === '`') {
      let buf = ''; i++;
      while (i < n && src[i] !== '`') {
        if (src[i] === '\\') { buf += src[i + 1] ?? ''; i += 2; continue; }
        if (src[i] === '$' && src[i + 1] === '{') {
          i += 2; let depth = 1;
          while (i < n && depth > 0) {
            if (src[i] === '{') depth++;
            else if (src[i] === '}') depth--;
            i++;
          }
          buf += ' '; continue;
        }
        buf += src[i]; i++;
      }
      i++; out.push(buf); continue;
    }
    i++;
  }
  return out;
}

/**
 * ⛔ THE CHAR TOKENIZER WAS A FALSE INSTRUMENT, and it lied in BOTH directions.
 * (Measured 2026-09-03, lane PARSER-3, against a real parser over the same files.)
 *
 * 1. IT HAS NO NOTION OF A REGEX LITERAL. A `'` inside `/[^']/` opens a string
 *    that swallows the code after it, so whatever punctuation that code contains
 *    is counted as reader copy. `src/generators/structuralValidator.js` measured
 *    **39 exclamation points by the tokenizer and 0 by a parser**;
 *    `generationCoherence.js` 10 vs 0; `npcGenerator.js` 7 em vs 0. Over the
 *    directories an extension would add, **64 of 71 exclamation points were
 *    phantom**.
 * 2. IT IS BLIND TO A NESTED TEMPLATE. `${…}` collapses to a single space, so a
 *    template inside an interpolation is never scanned at all — real reader prose
 *    the ban governs, invisible. `subsystemRowsMemory.js` measured 1 em by the
 *    tokenizer and 10 by a parser; `journalPages.js` 1 vs 3.
 *
 * Both defects sat INSIDE the covered surface, so the committed baseline was
 * measured against a counter that could not see straight. This replaces it with
 * the same parser the repo already uses for JSX-aware scanning (`espree`, per
 * tests/helpers/jsxLiteralWalk.js and tests/lint/rawColorLiteral.test.js).
 * Interpolation HOLES remain excluded — they are expressions, not string content
 * — which is the handling the JSX helper documents and this file always intended.
 *
 * ⭐ DECLARED MEASUREMENT SHIFT, src/data + src/domain, at this lane's tip:
 * **em 290 → 295, bang 15 → 8.** The em rise is debt the guard was BLIND to; the
 * bang fall is phantom debt it INVENTED. Against the committed baseline (em 455,
 * bang 10) both totals now FALL, which is what makes the documented shrink-only
 * refreeze legal at all: under the old counter `bang 10 → 15` ROSE, so
 * writeShrinkOnlyBaseline would have REFUSED to bank this lane's own shrink.
 *
 * The char scanner is kept as a FALLBACK rather than deleted: if a file ever fails
 * to parse, degraded counting beats a silent zero (the dormancy hazard).
 *
 * @param {string} src @returns {string[]}
 */
function stringLiteralContents(src) {
  /** @type {string[]} */
  const out = [];
  /** @type {import('espree').Node} */
  let ast;
  try {
    ast = /** @type {any} */ (parse(src, { ecmaVersion: 'latest', sourceType: 'module', range: true }));
  } catch {
    return charScanStringContents(src);
  }
  /** @param {any} node */
  const visit = (node) => {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) { node.forEach(visit); return; }
    if (!node.type) return;
    if (node.type === 'Literal' && typeof node.value === 'string') out.push(node.value);
    if (node.type === 'TemplateLiteral') {
      for (const q of node.quasis) out.push(String(q.value.cooked ?? q.value.raw));
    }
    for (const k of Object.keys(node)) {
      if (k === 'range' || k === 'loc' || k === 'parent') continue;
      visit(node[k]);
    }
  };
  visit(ast);
  return out;
}

/** @param {string} dir @param {string[]} out */
function walkJs(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walkJs(p, out);
    else if (/\.js$/.test(e) && !/\.test\./.test(e)) out.push(p);
  }
  return out;
}

/** @param {string} abs @returns {{ em: number, bang: number }} */
/**
 * ── THE DECLARED AUTHORED-VOCABULARY EXEMPTION (§901; LT28 car 6, 2026-09-15) ──────────
 *
 * THE BAN GOVERNS TEXT THE READER SEES. Two shapes carry a U+2014 that no reader will ever
 * read as punctuation, and both were reddening the per-file arm while the Tier-2 TOTAL sat
 * comfortably inside its budget:
 *
 *   DELIMITER   the bare literal '—' handed to `String.prototype.split` as a separator.
 *               One character, no words: it cannot be a sentence, so it is exempt wherever
 *               it appears and needs no per-file declaration.
 *   PRODUCER    a string that reproduces ANOTHER module’s authored label verbatim so this
 *   LABEL       file can map or match it. The em dash belongs to the producer’s vocabulary,
 *               not to this file’s prose, and editing it here would break the lookup while
 *               changing nothing a reader sees. Declared per file, literal by literal.
 *
 * ⛔ THIS IS AN EXEMPTION, NOT A BUDGET. It is keyed on the EXACT LITERAL, so a new
 * reader-facing em dash in an exempted file still reds the per-file arm — the control
 * `an em dash outside the declared vocabulary still reds` pins exactly that. And every
 * declared literal must still be PRESENT: a literal that no longer exists reds too, so a
 * burned-down exemption gets banked instead of rotting.
 */
const VOICE_EM = '\u2014';

/** @type {Record<string, { why: string, literals: readonly string[] }>} */
const AUTHORED_VOCABULARY_EXEMPTIONS = Object.freeze({
  'src/domain/display/labelBands.js': Object.freeze({
    why: 'COMPLEXITY_BAND_BY_LABEL is a TOTAL map over deriveEconomicComplexity\u2019s closed '
      + 'vocabulary; each key is that producer\u2019s own authored label, carried verbatim so the '
      + 'band word can be recovered from it.',
    literals: Object.freeze([
      'Highly diversified \u2014 multiple major revenue streams',
      'Diversified \u2014 broad institutional economic base',
      'Concentrated \u2014 fewer revenue streams than scale suggests',
      'Limited \u2014 narrow economic base for this scale',
      'Subsistence \u2014 survival economy',
    ]),
  }),
  'src/domain/display/stateProse/generalStateProse.js': Object.freeze({
    why: 'foodGenerator.js:342 writes the label `Deficit \u2014 Active Famine`; this desk carries '
      + 'it verbatim as a POOL KEY so the famine block can be keyed on it.',
    literals: Object.freeze([
      'Deficit \u2014 Active Famine',
    ]),
  }),
});

/**
 * Is this literal exempt in this file? Bare delimiters always; declared producer labels
 * only in the file that declared them.
 */
function isExemptLiteral(rel, text) {
  if (text === VOICE_EM) return true;
  return (AUTHORED_VOCABULARY_EXEMPTIONS[rel]?.literals || []).includes(text);
}

/** @param {string} abs @param {string} rel */
function countFile(abs, rel = '') {
  let em = 0, bang = 0;
  for (const text of stringLiteralContents(readFileSync(abs, 'utf8'))) {
    if (isExemptLiteral(rel, text)) continue;
    em += (text.match(/—/g) || []).length;
    bang += (text.match(/!/g) || []).length;
  }
  return { em, bang };
}

const SCANNED_FILES = [
  ...walkJs(join(ROOT, 'src/data')),
  ...walkJs(join(ROOT, 'src/domain')),
].map((p) => relative(ROOT, p).replace(/\\/g, '/')).sort();

/** @type {Record<string, { em: number, bang: number }>} */
const current = {};
for (const rel of SCANNED_FILES) {
  const c = countFile(join(ROOT, rel), rel);
  if (c.em > 0 || c.bang > 0) current[rel] = c;
}

// SHRINK-ONLY, ENFORCED (VOICE-1b). The docstring above has always said "totals may
// never grow"; until this guard nothing checked, so the documented command banked
// whatever drift it found. writeShrinkOnlyBaseline throws instead of writing.
if (UPDATE) {
  writeShrinkOnlyBaseline(BASELINE_PATH, current, 'the Tier-2 src/data + src/domain voice baseline');
}

// ── Tier 3 (E-E): the JSX component scan ─────────────────────────────────────
// Same ban, same shrink-only-ratchet shape as Tier 2, but reached via a real
// JSX-aware AST walk (tests/helpers/jsxLiteralWalk.js) over every src/**/*.jsx
// file — Tier 2's char tokenizer can only see quoted string literals, so JSX
// TEXT content (the actual reader-facing copy in a component) was invisible to
// it. This is the E-E "JSX extension" docs/THE_APLUS_EXECUTION_ARCHITECTURE.md
// calls for: "extend E2 voiceMechanics ... to scan JSX component string
// literals (the recorded gap — E2 scans registries + data, not components)."
const JSX_SCAN = scanJsxTree(join(ROOT, 'src'), ROOT);

/** @type {Record<string, { em: number, bang: number }>} */
const currentJsx = {};
for (const { rel, strings } of JSX_SCAN) {
  let em = 0, bang = 0;
  for (const text of strings) {
    em += (text.match(/—/g) || []).length;
    bang += (text.match(/!/g) || []).length;
  }
  if (em > 0 || bang > 0) currentJsx[rel] = { em, bang };
}

if (UPDATE) {
  writeShrinkOnlyBaseline(JSX_BASELINE_PATH, currentJsx, 'the Tier-3 src/**/*.jsx voice baseline');
}

describe('E2 voiceMechanics — the copy registries carry no em dash and no exclamation point', () => {
  for (const [name, obj] of Object.entries(REGISTRIES)) {
    it(`${name} registry is clean`, () => {
      /** @type {Array<{path:string,text:string}>} */
      const bad = [];
      walkValues(obj, name, bad);
      expect(
        bad,
        `\nRewrite per docs/VOICE_AND_TONE.md §6 (no em dash, no exclamation point):\n${bad.map((b) => `  ${b.path}: "${b.text}"`).join('\n')}\n`,
      ).toEqual([]);
    });
  }
});

describe('E2 voiceMechanics — src/data + src/domain string-literal ratchet (shrink-only)', () => {
  it('the committed baseline exists', () => {
    expect(
      existsSync(BASELINE_PATH),
      'baseline missing — for an APPROVED sweep run: UPDATE_VOICE_BASELINE=1 npx vitest run tests/copy/voiceMechanics.test.js',
    ).toBe(true);
  });

  it('per-file debt exactly matches the baseline (grew ⇒ rewrite; fell ⇒ bank the win)', () => {
    /** @type {Record<string, { em: number, bang: number }>} */
    const baseline = JSON.parse(readFileSync(BASELINE_PATH, 'utf8'));
    /** @type {string[]} */
    const diffs = [];
    const keys = new Set([...Object.keys(baseline), ...Object.keys(current)]);
    for (const k of [...keys].sort()) {
      const b = baseline[k] || { em: 0, bang: 0 };
      const c = current[k] || { em: 0, bang: 0 };
      if (b.em !== c.em || b.bang !== c.bang) {
        diffs.push(`${k}: baseline em:${b.em} bang:${b.bang} → current em:${c.em} bang:${c.bang}`);
      }
    }
    expect(diffs, `\n${diffs.join('\n')}\n`).toEqual([]);
  });

  // ── THE EXEMPTION’S OWN CONTROLS (§901; LT28 car 6) ──────────────────────────────
  //    A declared exemption without controls is a widened budget wearing a reason. These
  //    four pin that it exempts exactly what it says and nothing else.
  it('an em dash outside the declared vocabulary still reds, even in an exempted file', () => {
    const exempted = 'src/domain/display/labelBands.js';
    expect(isExemptLiteral(exempted, 'A sentence \u2014 with an authored dash')).toBe(false);
    expect(isExemptLiteral(exempted, 'Highly diversified \u2014 multiple major revenue streams')).toBe(true);
  });

  it('a declared literal is exempt ONLY in the file that declared it', () => {
    const label = 'Deficit \u2014 Active Famine';
    expect(isExemptLiteral('src/domain/display/stateProse/generalStateProse.js', label)).toBe(true);
    expect(isExemptLiteral('src/domain/display/labelBands.js', label)).toBe(false);
    expect(isExemptLiteral('src/domain/somewhereElse.js', label)).toBe(false);
  });

  it('the bare delimiter is exempt anywhere, and only when it is bare', () => {
    expect(isExemptLiteral('src/domain/anything.js', '\u2014')).toBe(true);
    expect(isExemptLiteral('src/domain/anything.js', ' \u2014 ')).toBe(false);
    expect(isExemptLiteral('src/domain/anything.js', '\u2014 and then words')).toBe(false);
  });

  it('every declared exemption literal is still PRESENT in its file (a burned one gets banked)', () => {
    const missing = [];
    for (const [rel, entry] of Object.entries(AUTHORED_VOCABULARY_EXEMPTIONS)) {
      const src = readFileSync(join(ROOT, rel), 'utf8');
      const seen = new Set(stringLiteralContents(src));
      for (const lit of entry.literals) if (!seen.has(lit)) missing.push(`${rel}: ${lit}`);
    }
    expect(missing, `\nDeclared voice exemptions whose literal no longer exists \u2014 remove the`
      + ` row to bank the win:\n${missing.join('\n')}\n`).toEqual([]);
  });

  it('total debt never grows past its committed budget', () => {
    // Frozen at the fix-wave-3 sweep (src/data cleared to two deferred pool
    // files; src/domain remains the debt). LOWER these as the pools burn down
    // (eventProse/roadsProse/traditionProse are the bulk — canonical-at-zero
    // contracts defer them to their own wave); NEVER raise them.
    const EM_BUDGET = 670;
    const BANG_BUDGET = 15;
    const totals = Object.values(current).reduce(
      (t, c) => ({ em: t.em + c.em, bang: t.bang + c.bang }),
      { em: 0, bang: 0 },
    );
    expect(totals.em).toBeLessThanOrEqual(EM_BUDGET);
    expect(totals.bang).toBeLessThanOrEqual(BANG_BUDGET);
  });
});

describe('E-E voiceMechanics JSX extension — src/**/*.jsx component ratchet (shrink-only)', () => {
  it('every src/**/*.jsx file on disk actually parsed (none silently skipped)', () => {
    // scanJsxTree drops a file that fails to parse (extractJsxProseStrings
    // returns null) rather than throwing — that keeps one malformed file from
    // sinking the whole ratchet, but it also means a parse failure silently
    // EXEMPTS that file's copy from the ban. Cross-check: recount .jsx files on
    // disk with the same recursive shape and assert nothing got dropped.
    /** @param {string} dir @param {number} n */
    function countJsx(dir, n = 0) {
      for (const e of readdirSync(dir)) {
        const p = join(dir, e);
        if (statSync(p).isDirectory()) n = countJsx(p, n);
        else if (/\.jsx$/.test(e)) n++;
      }
      return n;
    }
    expect(JSX_SCAN.length).toBe(countJsx(join(ROOT, 'src')));
  });

  it('the committed JSX baseline exists', () => {
    expect(
      existsSync(JSX_BASELINE_PATH),
      'baseline missing — for an APPROVED sweep run: UPDATE_VOICE_BASELINE=1 npx vitest run tests/copy/voiceMechanics.test.js',
    ).toBe(true);
  });

  it('per-file JSX debt exactly matches the baseline (grew ⇒ rewrite; fell ⇒ bank the win)', () => {
    /** @type {Record<string, { em: number, bang: number }>} */
    const baseline = JSON.parse(readFileSync(JSX_BASELINE_PATH, 'utf8'));
    /** @type {string[]} */
    const diffs = [];
    const keys = new Set([...Object.keys(baseline), ...Object.keys(currentJsx)]);
    for (const k of [...keys].sort()) {
      const b = baseline[k] || { em: 0, bang: 0 };
      const c = currentJsx[k] || { em: 0, bang: 0 };
      if (b.em !== c.em || b.bang !== c.bang) {
        diffs.push(`${k}: baseline em:${b.em} bang:${b.bang} → current em:${c.em} bang:${c.bang}`);
      }
    }
    expect(diffs, `\n${diffs.join('\n')}\n`).toEqual([]);
  });

  it('total JSX debt never grows past its committed budget', () => {
    // FINDING (E-E build, 2026-07-21): the first JSX scan measured 396 em
    // dashes + 10 exclamation points across 133 files — the ban held ZERO
    // enforcement in components before this walker.
    // BURNED (tranche 3b-B, 2026-07-21): the components got their
    // VOICE_AND_TONE pass — every reader-facing em dash and bang was rewritten
    // per docs/VOICE_AND_TONE.md §6 (period / comma / colon / parentheses;
    // bangs to plain statements; placeholder glyphs to the en-dash/middot
    // idioms). The remaining 6 em are NOT prose: they are the string-literal
    // arguments of defensive `.split('—')` / `.split(' — ')` parsers
    // (SummaryTab, EconomicsTab, OverviewTab) matched to em-dash separators
    // composed in src/domain (dossierViewModel granary/safety/stability
    // strings — Tier-2 baseline debt). They burn WITH that Tier-2 debt: when
    // the domain composer drops its em dash, the parser literal goes in the
    // same change. Encoding the char to dodge the walker was rejected as
    // ratchet-gaming. NEVER raise these.
    const EM_BUDGET_JSX = 6;
    const BANG_BUDGET_JSX = 0;
    const totals = Object.values(currentJsx).reduce(
      (t, c) => ({ em: t.em + c.em, bang: t.bang + c.bang }),
      { em: 0, bang: 0 },
    );
    expect(totals.em).toBeLessThanOrEqual(EM_BUDGET_JSX);
    expect(totals.bang).toBeLessThanOrEqual(BANG_BUDGET_JSX);
  });

  it('the JSX extractor discriminates (positive control): catches a seeded em dash and bang in JSX text, attrs, and template literals, and stays quiet on clean JSX', () => {
    const seeded = [
      "import React from 'react';",
      'export function Seed({ x }) {',
      '  return (',
      '    <div title="Loud!">',
      '      <h2>The town grows — quietly</h2>',
      '      <p>{`interpolated ${x} text — with a dash!`}</p>',
      '      <p>plain, clean, no tells</p>',
      '    </div>',
      '  );',
      '}',
    ].join('\n');
    const strings = extractJsxProseStrings(seeded);
    expect(strings).not.toBeNull();
    const em = /** @type {string[]} */ (strings).reduce((s, t) => s + ((t.match(/—/g) || []).length), 0);
    const bang = /** @type {string[]} */ (strings).reduce((s, t) => s + ((t.match(/!/g) || []).length), 0);
    expect(em).toBe(2);   // 'The town grows — quietly' + the template-literal ' text — with a dash!' segment
    expect(bang).toBe(2); // title="Loud!" + the template-literal bang (the ${x} hole itself is not counted)
  });

  it('the JSX extractor returns null (not a throw) on unparseable source, so one bad file cannot crash the ratchet', () => {
    expect(extractJsxProseStrings('this is not { valid JS at all <<<')).toBeNull();
  });
});

describe('E2 voiceMechanics — the scanners discriminate (positive controls)', () => {
  it('the registry walker catches a seeded violation', () => {
    /** @type {Array<{path:string,text:string}>} */
    const bad = [];
    walkValues({ a: { b: ['fine', 'not fine — at all', 'Loud!'] } }, 'seed', bad);
    expect(bad.map((b) => b.path)).toEqual(['seed.a.b[1]', 'seed.a.b[2]']);
  });
  it('the literal extractor reads values and skips comments and template expressions', () => {
    const src = [
      '// a comment — with a dash and a bang!',
      '/* block — comment! */',
      "const a = 'value — one';",
      'const b = `tpl ${x — y!} text — two`;',
      'const c = "plain";',
    ].join('\n');
    const lits = stringLiteralContents(src);
    const em = lits.reduce((s, t) => s + ((t.match(/—/g) || []).length), 0);
    const bang = lits.reduce((s, t) => s + ((t.match(/!/g) || []).length), 0);
    expect(em).toBe(2);   // 'value — one' + 'text — two'; comments and ${x — y!} excluded
    expect(bang).toBe(0);
  });
});

// ── Tier 4 (TE-AGNOSTIC-1 / ODQ §857): THE SETTING-AGNOSTIC TELL BAN ─────────
// The product is SETTING-AGNOSTIC BY LAW, so the engine's own vocabulary may not
// read as one publisher's rulebook. §857 measured the tells and TE-AGNOSTIC-1
// cured them; without a guard the next content wave simply writes them back, and
// the cure becomes a one-time cleanup instead of a property.
//
// ⛔ THIS BANS THREE SHAPES, NOT "FANTASY WORDS". docs/DESIGN_SETTING_AGNOSTIC.md
// §0 is the authority and is half the point: `druid`, `bard`, `paladin`,
// `warlock`, `witch`, `cantrip`, `artificer` and `ranger` are all OLDER than the
// game that borrowed them, and a sweep that deleted them would strip genuine
// period vocabulary out of a setting-agnostic engine. What is banned is a
// rulebook PROPER NOUN (a spell's Title Case name), a rulebook SCALE
// (`3rd-level`, `+1 weapons`) and a rulebook UNIT (`GP`).
//
// HARD ZERO, with ONE quarantine that is EXACT-SET-EQUAL to what is measured, so
// the deferred rows cannot grow AND the keys car must shrink it when it lands.
//
// ⭐ MUTANT-PROVEN, not merely written. A guard that has never been shown to fail
// is not a guard. Three tells were seeded into src/data/narrativeData.js and the
// walk was executed against the real tree:
//     'A hall kept honest by Zone of Truth, at 250 GP a session.'
//     'Scrolls from a cantrip to a 3rd-level spell, and +1 weapons besides.'
//     'A network of paired sending stones.'
// ALL FOUR detectors fired, each on its own row —
//     narrativeData.js :: currency GP
//     narrativeData.js :: spell-level scale
//     narrativeData.js :: item plus
//     narrativeData.js :: named spell (no ordinary reading)
// and the seed was reverted. Note the last one: `sending stones` is LOWERCASE and
// `cantrip` in that same sentence is correctly NOT convicted, which is both halves
// of this ban in one line.
const AGNOSTIC_TELLS = Object.freeze([
  // A rulebook UNIT. `\bGP\b` as a price, never as an ordinary word.
  { name: 'currency GP', re: /\b\d[\d,]*\s*GP\b|\bGP\/|\bGP\b(?=\s*(?:per|a session|\)))/ },
  // A rulebook SCALE: spell levels and item plusses.
  { name: 'spell-level scale', re: /\b\d+(?:st|nd|rd|th)[- ]level\b/i },
  { name: 'item plus', re: /\+\d+\s+(?:weapons?|armou?rs?|swords?|shields?)\b/i },
  // Rulebook PROPER NOUNS, in TWO arms, because case carries different weight
  // for different names.
  //
  // (a) CASE-SENSITIVE, for names whose lowercase form is ordinary English.
  //     "cure hides at scale" and "partial food supplement from plant growth"
  //     are things a tanner and a farmer do; "Cure Wounds" and "Plant Growth"
  //     are catalogue entries. Title Case is the whole tell here, and a
  //     case-insensitive arm would convict the tanner.
  { name: 'named spell', re: /\b(?:Cure Wounds|Cure light wounds|Plant Growth|Speak with Animals|Detect Poison|Detect Thoughts|Purify Food|Create Food and Water|Pass Without Trace|Magic Mouth|Continual Flame)\b/ },
  // (b) CASE-INSENSITIVE, for names with NO ordinary-English reading at all.
  //     ⭐ This arm exists because of a real miss: TE-AGNOSTIC-1's own car 5
  //     found `paired sending stones` in institutionVocabulary AFTER the corpus
  //     was cured, LOWERCASE, which a Title-Case-only sweep had walked straight
  //     past. Nobody writes "sending stone" or "goodberry" by accident.
  { name: 'named spell (no ordinary reading)', re: /\b(?:zone of truth|sending stones?|lesser restoration|greater restoration|goodberry|prestidigitation|transmute rock|conjure animals|glyph of warding|mage hand)\b/i },
]);

// The quarantine. Each row is a DEFERRED join key with a written reason, per
// docs/DESIGN_SETTING_AGNOSTIC.md §2g. ⛔ Not permission: an EXACT-SET equality
// below means a NEW tell reds, a row that leaves must be struck here, and the
// keys car cannot land without emptying its own entries.
const AGNOSTIC_TELLS_DEFERRED = Object.freeze({
  'src/data/institutionServices.js :: spell-level scale':
    'The INSTITUTION key `Healer (divine, 1st level)`, deferred to the keys car: it is pinned BY NAME in magicLicenceCensus.walker (four places) and arcaneIdentity.test, and lives in the order-authoritative institutionServiceKeys.generated.js.',
  'src/data/institutionDescVariants.js :: spell-level scale':
    'The same institution key, as the `village|Magic|…` variant-pool key.',
  'src/data/institutionalCatalog.js :: spell-level scale':
    'The same institution key, in the catalog that mints it.',
  'src/data/institutionServiceKeys.generated.js :: spell-level scale':
    'The same institution key, in the GENERATED key file. Regenerated by script; it can only change after the catalog does.',
  'src/data/economicData.js :: spell-level scale':
    'The same institution key, in the economic table that prices it.',
  'src/data/servicesData.js :: spell-level scale':
    'The three `spellcasting services (1st-Nth level)` LOCALE override SOURCES. MEASURED UNREACHABLE: the lookup is an exact lowercased key access (generators/services/institutionServices.js:111, display/institutionProfile.js:118) and no producer in src/ emits an institution by that name. Their honest disposition is DELETION in a dead-code car, not a rename that invents a differently-dead key.',
  'src/domain/display/institutionVocabulary.js :: spell-level scale':
    'The same institution key, twice, as a display-map key.',
});
// ⚠ magicAssertionText.js is NOT quarantined and does not need to be. Its receipt
// ledger names `Cure Wounds` and `Lesser Restoration` in COMMENTS and its pattern
// carries them in a REGEX LITERAL, and Tier 2's extractor reads neither — it takes
// the contents of quoted strings only. Measured, not assumed: the file produces
// zero Tier-4 hits. That is the correct outcome twice over, because the ledger is
// a RECORD of which corpus strings each token was derived from (including two whose
// receipts this wave spent) and rewriting a record to satisfy a grep is the defect,
// not the cure.

describe('E2/Tier-4 setting-agnostic tell ban (ODQ §857) — src/data + src/domain', () => {
  /** @returns {Map<string, string[]>} id -> sample offending strings */
  const scanTells = () => {
    /** @type {Map<string, string[]>} */
    const hits = new Map();
    for (const rel of SCANNED_FILES) {
      for (const text of stringLiteralContents(readFileSync(join(ROOT, rel), 'utf8'))) {
        for (const { name, re } of AGNOSTIC_TELLS) {
          if (!re.test(text)) continue;
          const id = `${rel} :: ${name}`;
          const seen = hits.get(id) || [];
          if (seen.length < 3) seen.push(text.slice(0, 90));
          hits.set(id, seen);
        }
      }
    }
    return hits;
  };

  it('no rulebook proper noun, scale or unit outside the written quarantine', () => {
    const hits = scanTells();
    const unquarantined = [...hits.entries()]
      .filter(([id]) => !(id in AGNOSTIC_TELLS_DEFERRED))
      .map(([id, samples]) => `${id}\n      ${samples.join('\n      ')}`);
    expect(
      unquarantined,
      `\nTE-AGNOSTIC-1 (ODQ §857): the engine may not read as one publisher's rulebook.\n`
      + `See docs/DESIGN_SETTING_AGNOSTIC.md §0 for what is NOT a tell before rewriting anything.\n`
      + `${unquarantined.join('\n  ')}\n`,
    ).toEqual([]);
  });

  it('the quarantine is EXACT — every deferred row is still a live hit', () => {
    // Shrink-only in the honest direction: a row cured in the tree must be struck
    // here, so the keys car cannot land while leaving dead prose behind.
    const live = new Set(scanTells().keys());
    const stale = Object.keys(AGNOSTIC_TELLS_DEFERRED).filter((id) => !live.has(id));
    expect(
      stale,
      `\nThese quarantine rows no longer match anything. Delete them and bank the win:\n  ${stale.join('\n  ')}\n`,
    ).toEqual([]);
  });

  it('the detectors discriminate (positive AND negative controls)', () => {
    const fire = (name, text) => AGNOSTIC_TELLS.find((t) => t.name === name).re.test(text);
    // POSITIVE — each shape is caught.
    expect(fire('currency GP', 'A station runs 250 to 10,000 GP.')).toBe(true);
    expect(fire('currency GP', 'torchbearers (1 GP/session)')).toBe(true);
    expect(fire('spell-level scale', 'Nothing above 1st-level spells.')).toBe(true);
    // The SPACED form too, which is how the catalog spelled it before the cure.
    expect(fire('spell-level scale', 'Spells of 1st through 3rd level.')).toBe(true);
    expect(fire('item plus', 'Specialised kit. +1 weapons, silver weapons.')).toBe(true);
    expect(fire('named spell', 'Basic healing spells. Cure Wounds (10 GP).')).toBe(true);
    expect(fire('named spell (no ordinary reading)', 'kept honest by Zone of Truth.')).toBe(true);
    // ...and LOWERCASE for the arm that exists because car 5 found exactly this.
    expect(fire('named spell (no ordinary reading)', 'a network of paired sending stones')).toBe(true);
    // NEGATIVE — the words docs/DESIGN_SETTING_AGNOSTIC.md §0 protects survive,
    // which is the half that matters: a ban that also deletes genuine period
    // vocabulary from a setting-agnostic engine has done the opposite of the law.
    expect(fire('named spell', 'A circle of druids bound to the land.')).toBe(false);
    expect(fire('named spell', 'from cheap cantrips to costly higher magic')).toBe(false);
    expect(fire('named spell', 'Tanners who cure hides at scale.')).toBe(false);
    expect(fire('named spell', 'A scribe who prepares and sells spell scrolls.')).toBe(false);
    expect(fire('named spell', 'Arcane quickening of growth supplements food.')).toBe(false);
    expect(fire('named spell (no ordinary reading)', 'A warlock, a witch and a druid walk in.')).toBe(false);
    expect(fire('currency GP', 'The GPS of the ancient world')).toBe(false);
    expect(fire('item plus', 'a +1 modifier on the roll')).toBe(false);
  });
});
