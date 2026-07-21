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
 */
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import { en } from '../../src/copy/en.js';
import { landing } from '../../src/copy/landing.js';
import { pricingPage } from '../../src/copy/pricingPage.js';
import { footer } from '../../src/copy/footer.js';
import { deityAuthoring } from '../../src/copy/deityAuthoring.js';
import { extractJsxProseStrings, scanJsxTree } from '../helpers/jsxLiteralWalk.js';

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
function stringLiteralContents(src) {
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
function countFile(abs) {
  let em = 0, bang = 0;
  for (const text of stringLiteralContents(readFileSync(abs, 'utf8'))) {
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
  const c = countFile(join(ROOT, rel));
  if (c.em > 0 || c.bang > 0) current[rel] = c;
}

if (UPDATE) {
  writeFileSync(BASELINE_PATH, JSON.stringify(current, null, 1) + '\n');
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
  writeFileSync(JSX_BASELINE_PATH, JSON.stringify(currentJsx, null, 1) + '\n');
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

  it('total debt never grows past its committed budget', () => {
    // Frozen at the fix-wave-3 sweep (src/data cleared to two deferred pool
    // files; src/domain remains the debt). LOWER these as the pools burn down
    // (eventProse/roadsProse/traditionProse are the bulk — canonical-at-zero
    // contracts defer them to their own wave); NEVER raise them.
    const EM_BUDGET = 672;
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
    // FINDING (E-E build, 2026-07-21): this is the first time JSX components
    // were ever scanned for the VOICE_AND_TONE em-dash/`!` ban — the ban held
    // ZERO enforcement here before this walker. The measured floor: 396 em
    // dashes across 133 files (mostly HowToUse/CompendiumPanel/PrivacySettings
    // prose paragraphs and a few CSS-in-JS `/* comment — text */` blocks inside
    // template-literal <style> blocks — a known, precedent-matched blind spot:
    // Tier 2 also only strips JS `//` and `/* */` comments, not comments-inside-
    // a-string in a different embedded language) and 10 exclamation points
    // (toast/banner copy: "Credits added!", "Welcome aboard, Founder!", plus a
    // handful of literal "(!)" glyphs used as inline warning icons in PDF
    // sections). Real, reader-facing debt — recorded here rather than forced
    // to zero by editing ceiling-bound/unrelated component files out of scope
    // for a test-only enforcer. LOWER these as components get their own
    // VOICE_AND_TONE pass; NEVER raise them.
    const EM_BUDGET_JSX = 396;
    const BANG_BUDGET_JSX = 10;
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
