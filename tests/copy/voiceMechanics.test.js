/**
 * tests/copy/voiceMechanics.test.js — E2: THE VOICE-MECHANICS WALKER
 * (VOICE_AND_TONE §3/§7 — the em-dash and exclamation-point ban, enforced).
 *
 * Three sites (docs/VOICE_AND_TONE.md §7, src/lib/seo.js, src/lib/seoCompendium.js)
 * referenced this guard before it existed; fix wave 3 makes the claim true.
 *
 * TWO ENFORCEMENT TIERS:
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
 *
 * TO COMPLY when this reds:
 *   - a NEW em dash / `!` in a registry string → rewrite per VOICE_AND_TONE §6.
 *   - a file's count grew → rewrite the new string; never raise the baseline.
 *   - a file's count fell → lower (or delete) its baseline entry to bank the win.
 *   - APPROVED sweep landed → regenerate: UPDATE_VOICE_BASELINE=1 npx vitest run
 *     tests/copy/voiceMechanics.test.js  (shrink-only: totals may never grow).
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

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const BASELINE_PATH = join(ROOT, 'tests/copy/.voice-mechanics-baseline.json');
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
