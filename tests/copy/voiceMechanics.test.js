/**
 * tests/copy/voiceMechanics.test.js — E2: THE VOICE-MECHANICS WALKER
 * (VOICE_AND_TONE §3/§7 — the em-dash and exclamation-point ban, enforced).
 *
 * Three sites (docs/VOICE_AND_TONE.md §7, src/lib/seo.js, src/lib/seoCompendium.js)
 * referenced this guard before it existed; fix wave 3 makes the claim true.
 *
 * FIVE ENFORCEMENT TIERS:
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
 *     ⭐ ODQ §901's NAMED CURE IS DISCHARGED HERE (LT41 car 2): the eight dashes
 *     the per-file arm was BANKED on at §900 are TRANSCRIPTIONS of strings the
 *     then-unscanned `src/generators` producers write, so they now pass by the
 *     declared authored-vocabulary allowlist below — count-pinned, named by file
 *     and literal, with the producer line each mirrors. The producers themselves
 *     are scanned by Tier 5, so neither half is exempt any more.
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
 *  4. THE SETTING-AGNOSTIC TELL BAN (TE-AGNOSTIC-1 / ODQ §857) — HARD ZERO over
 *     the SAME `SCANNED_FILES` roots as Tier 2, with an exact-set quarantine.
 *     Its full charter is at the tier itself, far below.
 *  5. THE GENERATORS TIER (LONG TAIL #41) — SHRINK-ONLY RATCHET over
 *     `src/generators/**\/*.js`, baselined in
 *     tests/copy/.voice-mechanics-generators-baseline.json. See the tier's own
 *     block for why this is a FIFTH TIER and not one more root on Tier 2.
 *
 * TO COMPLY when this reds:
 *   - a NEW em dash / `!` in a registry string → rewrite per VOICE_AND_TONE §6.
 *   - a file's count grew → rewrite the new string; never raise the baseline.
 *   - a file's count fell → lower (or delete) its baseline entry to bank the win.
 *   - APPROVED sweep landed → regenerate: UPDATE_VOICE_BASELINE=1 npx vitest run
 *     tests/copy/voiceMechanics.test.js  (shrink-only: totals may never grow;
 *     this regenerates the Tier-2, Tier-3/JSX and Tier-5/generators baselines).
 *
 * ⛔ THE FIGURES THIS GUARD IS DESCRIBED BY, RE-MEASURED (LONG TAIL #41, 2026-09-15).
 * Written down rather than argued about, because two figures carried INTO this item do
 * not reproduce at the build slot — and neither sentence is deleted, because a record
 * that quietly loses its own wrong numbers cannot be audited.
 *
 *   ⛔ "A THIRD DIRECTORY HOLDS 496 INSTANCES" — DOES NOT REPRODUCE, AT ANY GRAIN.
 *      `src/generators` measures 1031 RAW em-dash characters over 114 non-test .js
 *      files; 81 on lines that do not open with a comment marker; and 62 inside actual
 *      string literals by espree, the instrument this file counts with. The two figures
 *      the record itself carried DO reproduce exactly (crossSettlementConflicts.js 11,
 *      narrative/settlementOriginProse.js 5). The nearest real ~496 numbers at this tip
 *      belong to other surfaces entirely: 506 non-comment em dashes across the two
 *      ALREADY-SCANNED Tier-2 roots, and 505 in docs/content/RECEIPT_POOLS_DOSSIER_STATE.md.
 *      An implementer who freezes 496 freezes nothing that exists.
 *
 *   ⛔ "27 FURTHER INSTANCES ARE BYTE-TWINS TO BE CURED ON BOTH SIDES IN ONE ACT" — the
 *      byte-twin act was 28, not 27, and it LANDED: the src/ prose sweep
 *      (`fd8b6df00` -> `5e28d5c83`, ODQ §890.4 and §898), which is an ancestor of this
 *      tree. What is still live is a DIFFERENT, smaller set that this item DID pay:
 *      9 em-dash strings authored in the then-unscanned `src/generators` are
 *      byte-identical to strings elsewhere in `src/`, and 6 of those are exactly the
 *      eight dashes the Tier-2 per-file arm was banked on. Both sides are now scanned
 *      and both sides are declared in the allowlist below.
 *
 *   ✔ THE FIGURE THAT DOES REPRODUCE, AND HOW: 114 files, 0 unparseable, 62 em dashes
 *      over 51 string literals in 12 files, 0 exclamation points; 51 = 23 label bands +
 *      12 code/delimiter/prompt + 16 genuine prose dashes; 21 distinct label-band
 *      strings pass by the named allowlist, leaving 39 over 8 files as Tier 5's first
 *      freeze. Re-measure by running this file — every number above is one it computes.
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

// ── THE DECLARED AUTHORED-VOCABULARY ALLOWLIST (ODQ §901's named cure) ───────
//
// ⛔ THIS IS A NAMED ALLOWLIST OF EXACT STRINGS, NEVER A PATH EXEMPTION. The key
// is `<repo-relative file>` → `<the WHOLE string literal, byte for byte>`. A
// substring never matches, so a NEW sentence in an allowlisted file — even one
// that quotes a band verbatim inside it — is a DIFFERENT literal and still reds.
// Exempting a path would switch the guard off over the exact directory Long
// Tail #41 exists to cover.
//
// WHAT IT EXEMPTS, AND WHY. The em-dash bar is a PROSE rule: it governs the
// archiver's sentences (docs/VOICE_AND_TONE.md §6, whose whole decision table is
// about sentences). A `Word — gloss` LABEL BAND is not a sentence; it is a
// glance-grain element under the LEGIBILITY law, a typed value whose dash is the
// band/gloss separator, and its siblings in the same vocabulary spell the same
// relation with parentheses. The chair's ruling of 2026-09-14 (provisional on a
// full classification, which was then executed — see the tier block below) is
// that these keep their dash.
//
// ⚠ THE ALLOWLIST EXEMPTS THE EM DASH ONLY. `!` is still counted inside an
// allowlisted string: the exclamation ban has no authored-vocabulary reading and
// no tier grants it one.
//
// Each entry names the PRODUCER LINE it is authored at, so a reader can go and
// see the string rather than trust this list. Line numbers are as of the landing
// commit and are given as orientation; the allowlist matches on TEXT.
//
// ⭐ AND EVERY ENTRY IS COUNT-PINNED (`count`), not merely named. Banking a row
// freezes its EXISTENCE; the magnitude is what freezes its SIZE — the same law
// scripts/.test-ratchet-baseline.json applies to a banked red. Without it, the
// bare `'—'` delimiter entry below would be a STANDING PASS for every future bare
// em dash in that file, which is the one place a by-name allowlist is genuinely
// loose. With it, a copy that appears and a copy that disappears both red, and
// the arm's message says which direction moved.
const AUTHORED_VOCABULARY_ALLOWLIST = Object.freeze({
  'src/generators/power/governanceNarrative.js': Object.freeze({
    'Unstable — criminal governance': { count: 1, why: 'public-order band, deriveBaselineStability :250 — sibling values in the same return set spell the gloss with parentheses ("Enforced Order (authoritarian)", "Tense (external threat)").' },
    'Critical (active siege — survival priority)': { count: 1, why: 'public-order band, applyStressStability :289 — the dash is INSIDE the parenthetical gloss.' },
    'Fractured — no stable governing authority': { count: 1, why: 'public-order band, applyStressStability :295 — the `politically_fractured` stressor override.' },
    'Shaken — institutional trust collapsed': { count: 1, why: 'public-order band, applyStressStability :298 — the `recently_betrayed` stressor override.' },
    'Desperate — hunger is eroding order': { count: 1, why: 'public-order band, applyStressStability :301 — the `famine` stressor override.' },
    'Anxious — disease is overriding normal authority': { count: 1, why: 'public-order band, applyStressStability :304 — the `plague_onset` stressor override.' },
    'Volatile — power is available to whoever moves first': { count: 1, why: 'public-order band, applyStressStability :307 — the `succession_void` stressor override.' },
    'Strained — debt obligations constrain every decision': { count: 1, why: 'public-order band, applyStressStability :313 — the `indebted` stressor override, which yields to an Unstable baseline.' },
    'Tense — regional monster threat': { count: 1, why: 'public-order band, annotateMonsterThreat :337 — the standalone form of the "; monster threat active" annotation.' },
  }),
  'src/generators/economy/prosperity.js': Object.freeze({
    'Highly diversified — multiple major revenue streams': { count: 1, why: 'economic-complexity band, deriveEconomicComplexity :296 — byte-identical to src/domain/display/labelBands.js COMPLEXITY_LABEL.HIGHLY_DIVERSIFIED, which transcribes this producer.' },
    'Diversified — broad institutional economic base': { count: 1, why: 'economic-complexity band, deriveEconomicComplexity :298 — labelBands.js COMPLEXITY_LABEL.DIVERSIFIED transcribes it.' },
    'Concentrated — fewer revenue streams than scale suggests': { count: 1, why: 'economic-complexity band, deriveEconomicComplexity :299 — labelBands.js COMPLEXITY_LABEL.CONCENTRATED transcribes it.' },
    'Limited — narrow economic base for this scale': { count: 1, why: 'economic-complexity band, deriveEconomicComplexity :305 — labelBands.js COMPLEXITY_LABEL.LIMITED transcribes it.' },
    'Subsistence — survival economy': { count: 1, why: 'economic-complexity band, deriveEconomicComplexity :314 — labelBands.js COMPLEXITY_LABEL.SUBSISTENCE transcribes it.' },
  }),
  'src/generators/safetyProfile.js': Object.freeze({
    'Dangerous — Plague Unrest': { count: 1, why: 'safety strain band :135 — the two-em-dash plague strain the safetyStrains docblock names; the composite label is built from the TYPED entry, never parsed back out.' },
    'Controlled — Authoritarian': { count: 2, why: 'safety band :241, repeated as a comparison literal at :489 (isDangerous).' },
    'Dangerous — Criminal Governance': { count: 2, why: 'safety band :248, repeated as a comparison literal at :490 (isDangerous).' },
  }),
  'src/generators/economy/economicState.js': Object.freeze({
    'Military services — standing army leasing, siege engineering, garrison contracts': { count: 1, why: 'primary-export band :626 — `Export — what it is`, the same shape as every other primaryExports entry.' },
    'Mercenary services — trained companies available for hire': { count: 1, why: 'primary-export band :628 — the mercenary-institution arm of the same militaryExport ladder.' },
    'Military services — garrison contracts and armed escort': { count: 1, why: 'primary-export band :629 — the lower-effectiveness arm of the same militaryExport ladder.' },
  }),
  'src/generators/foodGenerator.js': Object.freeze({
    'Deficit — Active Famine': { count: 1, why: 'food-security band :342 — byte-identical to the pool key at src/domain/display/stateProse/generalStateProse.js:266, which transcribes this producer and says so in its own docblock (:40, :255).' },
  }),

  // ── THE TIER-2 HALF (LT41 car 2): THE EIGHT TRANSCRIBED DASHES ──────────────
  // These are the exact strings the Tier-2 per-file arm was BANKED on at ODQ §900,
  // whose census row named this allowlist as its cure: "the structural cure is a
  // declared authored-vocabulary exemption class in the voice scanner (§901)".
  // ⛔ NOT ONE OF THEM IS AUTHORED HERE. Every one is a TRANSCRIPTION of a string
  // an UNSCANNED producer in src/generators writes — verified byte for byte with
  // `grep -F` — or a delimiter matched to a separator such a producer composes.
  // That is the whole argument: the domain leaf may not import the generator (the
  // ZERO IMPORTS law, stated in labelBands.js's own docblock and in
  // economyStateProse.js), so the vocabulary has to be spelled twice, and a guard
  // that reds on the copy while never reading the original is measuring the wrong
  // file. Both halves are now scanned, and both halves are declared here.
  'src/domain/display/labelBands.js': Object.freeze({
    'Highly diversified — multiple major revenue streams': { count: 1, why: 'COMPLEXITY_LABEL.HIGHLY_DIVERSIFIED :131 — transcribes src/generators/economy/prosperity.js:296 byte for byte.' },
    'Diversified — broad institutional economic base': { count: 1, why: 'COMPLEXITY_LABEL.DIVERSIFIED :132 — transcribes prosperity.js:298 byte for byte.' },
    'Concentrated — fewer revenue streams than scale suggests': { count: 1, why: 'COMPLEXITY_LABEL.CONCENTRATED :133 — transcribes prosperity.js:299 byte for byte.' },
    'Limited — narrow economic base for this scale': { count: 1, why: 'COMPLEXITY_LABEL.LIMITED :134 — transcribes prosperity.js:305 byte for byte.' },
    'Subsistence — survival economy': { count: 1, why: 'COMPLEXITY_LABEL.SUBSISTENCE :135 — transcribes prosperity.js:314 byte for byte.' },
  }),
  'src/domain/display/stateProse/generalStateProse.js': Object.freeze({
    'Deficit — Active Famine': { count: 1, why: 'the FOOD_POOL_OF key :266 — transcribes src/generators/foodGenerator.js:342 byte for byte, and the map\'s own docblock (:40, :255) names that producer line as its source.' },
    '—': { count: 2, why: 'the two `.split(\'—\')` DELIMITERS at :323 (safetyPoolKey) and :1728 (the Systems Health rung) — the separator they split on is composed by src/generators/safetyProfile.js:235 (`${strain} — ${condition}`). A parser argument, not copy: it burns WITH the producer, the same way Tier 3\'s six banked JSX dashes do.' },
  }),
});

/**
 * Is this exact literal, in this exact file, a declared authored-vocabulary string?
 * @param {string} rel repo-relative path, forward slashes
 * @param {string} text the WHOLE cooked literal
 * @returns {boolean}
 */
function isAllowedVocabulary(rel, text) {
  const forFile = AUTHORED_VOCABULARY_ALLOWLIST[rel];
  return Boolean(forFile) && Object.prototype.hasOwnProperty.call(forFile, text);
}

/** @param {string} abs @param {string} rel @returns {{ em: number, bang: number }} */
function countFile(abs, rel) {
  let em = 0, bang = 0;
  for (const text of stringLiteralContents(readFileSync(abs, 'utf8'))) {
    // The allowlist suppresses the EM DASH only; `!` is counted regardless.
    if (!isAllowedVocabulary(rel, text)) em += (text.match(/—/g) || []).length;
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

// ── Tier 5 (LONG TAIL #41): THE GENERATORS TIER ──────────────────────────────
//
// THE BLIND SPOT THIS CLOSES. Tiers 2 and 4 scan `src/data` + `src/domain`.
// `src/generators` — where a large share of the reader-facing copy is AUTHORED
// — was scanned by NOTHING. Measured here by espree at the landing tip: 114
// non-test .js files, 0 of them unparseable, 62 em dashes over 51 string
// literals in 12 files, and 0 exclamation points.
//
// ⛔ WHY THIS IS A FIFTH TIER AND NOT ONE MORE ROOT ON `SCANNED_FILES`. Adding
// `src/generators` to the Tier-2 roots at the two-line array above is a
// one-line change with three measured tripwires, and all three fire:
//   (a) `SCANNED_FILES` ALSO DRIVES TIER 4's HARD-ZERO tell ban. It would red
//       instantly on src/generators/services/serviceCategoryTables.js's
//       `'Healer (divine, 1st level)'` institution key — a `spell-level scale`
//       hit with no quarantine row, and the six rows for that same key are
//       deferred to the keys car, not to this one.
//   (b) THE SHRINK-ONLY DOOR WOULD THROW, NOT WRITE. Tier 2's committed total
//       is em 311; the tree measures 319; folding the generators in takes it
//       past 380, and tests/helpers/shrinkOnlyBaseline.js refuses any total
//       that RISES. The documented refreeze would stop working.
//   (c) TIER 2's BUDGET HEADROOM IS NOT THERE. `BANG_BUDGET = 15` against a
//       measured 8 is the whole remaining allowance for every directory the
//       guard has yet to reach; spending it on one extension leaves none.
// A separate tier with its own baseline and its own budgets avoids all three
// and keeps each tier's verdict readable on its own.
//
// ⭐ THE CLASSIFICATION, EXECUTED (2026-09-14, reproduced at this tip). The 51
// literals are 23 LABEL BANDS, 12 code/delimiter/prompt strings, and 16 GENUINE
// PROSE SENTENCES. The 23 label bands are the 21 distinct strings declared in
// AUTHORED_VOCABULARY_ALLOWLIST above (two of them appear twice, as comparison
// literals in the same file). Everything else — the 12 mechanical strings and
// the 16 prose dashes — is FROZEN AS DECLARED DEBT in the baseline below: 39 em
// dashes across 8 files. The tier does NOT cut them.
//
// ⛔ THE 16 PROSE DASHES ARE ENROLLED AS SHRINK-ONLY DEBT, NOT CURED. They are
// 11 in crossSettlementConflicts.js and 5 in narrative/settlementOriginProse.js
// (16 dashes over 15 sentences — :136 carries two). Cutting them is
// OUTPUT-MOVING on a same-seed surface and is the owner's call, which is why
// this tier enrols them instead: no NEW one can appear, and these can only
// fall. Five of the sixteen are additionally ruled LAWFUL apposition by the
// corpus annex's own ratified R-DST-W4-f, and two of those five are transcribed
// byte-for-byte into the canonical-at-zero pin at
// tests/generators/settlementOriginProse.test.js:62.
const GENERATORS_BASELINE_PATH = join(ROOT, 'tests/copy/.voice-mechanics-generators-baseline.json');

const GENERATOR_FILES = walkJs(join(ROOT, 'src/generators'))
  .map((p) => relative(ROOT, p).replace(/\\/g, '/')).sort();

/** @type {Record<string, { em: number, bang: number }>} */
const currentGenerators = {};
for (const rel of GENERATOR_FILES) {
  const c = countFile(join(ROOT, rel), rel);
  if (c.em > 0 || c.bang > 0) currentGenerators[rel] = c;
}

if (UPDATE) {
  writeShrinkOnlyBaseline(GENERATORS_BASELINE_PATH, currentGenerators, 'the Tier-5 src/generators voice baseline');
}

/**
 * Does espree parse this source, or does `stringLiteralContents` fall back?
 * Tier 2 has NO control for this and Tier 3 does (its own arm, below); a tier
 * over a directory nobody has scanned before needs it most, because the
 * fallback is the char tokenizer this file's own docstring calls a FALSE
 * INSTRUMENT IN BOTH DIRECTIONS. A silent fallback over src/generators would
 * report a plausible number measured by the wrong instrument.
 * @param {string} src @returns {boolean}
 */
function parsesWithEspree(src) {
  try {
    parse(src, { ecmaVersion: 'latest', sourceType: 'module', range: true });
    return true;
  } catch {
    return false;
  }
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

describe('E2/Tier-5 voiceMechanics — src/generators string-literal ratchet (shrink-only)', () => {
  it('every src/generators .js file actually PARSED (none silently counted by the fallback tokenizer)', () => {
    const fellBack = GENERATOR_FILES
      .filter((rel) => !parsesWithEspree(readFileSync(join(ROOT, rel), 'utf8')));
    expect(
      fellBack,
      '\nThese files did not parse, so their counts came from charScanStringContents —'
      + ' a FALSE INSTRUMENT in both directions (see its docstring). Fix the parse,'
      + ' or the number below this line means nothing:\n  ' + fellBack.join('\n  ') + '\n',
    ).toEqual([]);
  });

  it('the committed generators baseline exists', () => {
    expect(
      existsSync(GENERATORS_BASELINE_PATH),
      'baseline missing — for an APPROVED sweep run: UPDATE_VOICE_BASELINE=1 npx vitest run tests/copy/voiceMechanics.test.js',
    ).toBe(true);
  });

  it('per-file generators debt exactly matches the baseline (grew ⇒ rewrite; fell ⇒ bank the win)', () => {
    /** @type {Record<string, { em: number, bang: number }>} */
    const baseline = JSON.parse(readFileSync(GENERATORS_BASELINE_PATH, 'utf8'));
    /** @type {string[]} */
    const diffs = [];
    const keys = new Set([...Object.keys(baseline), ...Object.keys(currentGenerators)]);
    for (const k of [...keys].sort()) {
      const b = baseline[k] || { em: 0, bang: 0 };
      const c = currentGenerators[k] || { em: 0, bang: 0 };
      if (b.em !== c.em || b.bang !== c.bang) {
        diffs.push(`${k}: baseline em:${b.em} bang:${b.bang} → current em:${c.em} bang:${c.bang}`);
      }
    }
    expect(diffs, `\n${diffs.join('\n')}\n`).toEqual([]);
  });

  it('total generators debt never grows past its measured first freeze', () => {
    // FIRST FREEZE, MEASURED (LONG TAIL #41): 39 em dashes across 8 files and
    // ZERO exclamation points, after the 23 declared label-band literals pass by
    // the named allowlist. The bang budget is a HARD ZERO because the directory
    // measures zero today — the "~7 real bangs" a 2026-09-03 parser sweep
    // reported over the unscanned directories are NOT in src/generators.
    // MONOTONE DOWN. Raising either is an owner act, not a lane's.
    const EM_BUDGET_GENERATORS = 39;
    const BANG_BUDGET_GENERATORS = 0;
    const totals = Object.values(currentGenerators).reduce(
      (t, c) => ({ em: t.em + c.em, bang: t.bang + c.bang }),
      { em: 0, bang: 0 },
    );
    expect(totals.em).toBeLessThanOrEqual(EM_BUDGET_GENERATORS);
    expect(totals.bang).toBeLessThanOrEqual(BANG_BUDGET_GENERATORS);
  });

  it('the tier is not vacuous — it really is scanning the whole directory', () => {
    // Without this, every arm above passes trivially if walkJs ever stops
    // reaching src/generators (a rename, a moved root, a bad join).
    expect(GENERATOR_FILES.length).toBeGreaterThan(100);
    expect(GENERATOR_FILES).toContain('src/generators/crossSettlementConflicts.js');
  });
});

describe('E2 voiceMechanics — the authored-vocabulary allowlist (ODQ §901)', () => {
  it('EXACT — every allowlisted string occurs in its file exactly the declared number of times', () => {
    // The Tier-4 quarantine idiom plus the census's magnitude law, in one arm. A
    // measured 0 means the string was rewritten or deleted and the entry must be
    // STRUCK, so the list cannot rot into an exemption for text nobody can find.
    // A measured number ABOVE the declared one means new copies landed under an
    // existing exemption — the only way a by-name allowlist can grow silently,
    // and the reason `count` exists at all.
    /** @type {string[]} */
    const wrong = [];
    for (const [rel, entries] of Object.entries(AUTHORED_VOCABULARY_ALLOWLIST)) {
      const live = stringLiteralContents(readFileSync(join(ROOT, rel), 'utf8'));
      for (const [text, { count }] of Object.entries(entries)) {
        const measured = live.filter((t) => t === text).length;
        if (measured !== count) {
          wrong.push(`${rel} :: ${JSON.stringify(text)}: declared ${count}, measured ${measured}`
            + `${measured === 0 ? ' (GONE — strike the entry and bank the win)' : ' (a copy landed under an existing exemption)'}`);
        }
      }
    }
    expect(wrong, `\n${wrong.join('\n')}\n`).toEqual([]);
  });

  it('EXACT — every allowlisted string actually carries an em dash (no entry earns its keep by accident)', () => {
    const pointless = [];
    for (const [rel, entries] of Object.entries(AUTHORED_VOCABULARY_ALLOWLIST)) {
      for (const text of Object.keys(entries)) {
        if (!text.includes('—')) pointless.push(`${rel} :: ${JSON.stringify(text)}`);
      }
    }
    expect(pointless, 'an allowlist entry that exempts nothing is noise').toEqual([]);
  });

  it('every entry carries a REAL reason naming its producer line (a stub launders the exemption)', () => {
    for (const [rel, entries] of Object.entries(AUTHORED_VOCABULARY_ALLOWLIST)) {
      for (const [text, { count, why }] of Object.entries(entries)) {
        expect(
          Number.isInteger(count) && count > 0,
          `${rel} :: ${JSON.stringify(text)} — count must be a positive whole number, got ${JSON.stringify(count)}`,
        ).toBe(true);
        expect(
          String(why).length,
          `${rel} :: ${JSON.stringify(text)} — exempted with a stub, not an argument`,
        ).toBeGreaterThan(40);
      }
    }
  });

  it('the allowlist is EXACT-STRING, never a path or substring exemption (the whole point)', () => {
    const rel = 'src/generators/economy/prosperity.js';
    const band = 'Subsistence — survival economy';
    // The declared band passes...
    expect(isAllowedVocabulary(rel, band)).toBe(true);
    // ...a sentence that merely CONTAINS it does not...
    expect(isAllowedVocabulary(rel, `The town runs a ${band} and little else.`)).toBe(false);
    // ...a NEW dashed string in the same file does not...
    expect(isAllowedVocabulary(rel, 'Booming — a brand new band')).toBe(false);
    // ...and the same string in a file that does not declare it does not.
    expect(isAllowedVocabulary('src/generators/foodGenerator.js', band)).toBe(false);
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
