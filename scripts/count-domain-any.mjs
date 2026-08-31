#!/usr/bin/env node
/**
 * count-domain-any.mjs — the domain any-cast + ts-suppression counter/ratchet.
 *
 * The strict-typecheck burn-down reached 0 errors partly by SUPPRESSION: the
 * domain kernel carries hundreds of `@type {any}`-style casts and a handful of
 * `@ts-ignore` / `@ts-expect-error` directives. A strict gate says nothing
 * about that debt — a fresh `@type {any}` cast keeps the gate green while
 * silently regrowing the very holes the burn-down was meant to close. This
 * counter makes the debt a first-class, MONOTONE-DOWN number so it can only
 * shrink.
 *
 * Two debts, tracked per file, both shrink-only (see domainAnyCastBaseline.test.js):
 *   any      — every `any` TYPE-token and every bare `*` (JSDoc "any") that
 *              appears inside a JSDoc type expression. Counted per OCCURRENCE,
 *              not per annotation: an inline object type `{{ a: any, b: any }}`
 *              is two holes, and occurrence-count is split-invariant (relocating
 *              an annotation to a new sibling file does not change the total —
 *              only replacing a hole with a real type does).
 *   suppress — `@ts-ignore` + `@ts-expect-error` directives.
 *
 * Detection is a balanced-brace, whole-file scan (NOT line-based): it handles
 * multi-line `@typedef` unions and inline object types, multiple tags on one
 * line, and never miscounts the word "any" sitting in a prose description
 * (only text INSIDE the type braces is scanned). JSDoc continuation stars
 * (`\n * `) are stripped before `*`-type counting so a wrapped type expression
 * does not read its own comment gutter as a dozen `any`s.
 *
 * Enforced by tests/lint/domainAnyCastBaseline.test.js (runs under `npm run
 * test`, hence `npm run check`). Run `node scripts/count-domain-any.mjs` to see
 * the current tally, or `--update` to re-freeze the baseline after a burn-down
 * (the committed total must never rise).
 *
 * ⛔ `--update` REFUSES TO WRITE A DECLARED-OVERRUN ROW, AND THAT REFUSAL IS WHY
 * THE LEDGER LIVES IN THIS FILE RATHER THAN IN THE TEST. `--update` re-freezes
 * the WHOLE TREE. Three files in src/domain are knowingly OVER their baseline
 * under an attributed, capped, monotone-down ledger (`DECLARED_OVERRUNS` below),
 * so a blanket re-freeze banks 34 holes of declared debt as permanent baseline —
 * including a RAISE the ratchet forbids outright — and empties the ledger's
 * excess to zero while reading as a tidy green. THREE SEPARATE LANES WALKED INTO
 * THAT IN ONE DAY (2026-08-31: TE-CEIL step 6, W-FAITH F3c act 3, TE-INSTR-1 R1),
 * because the ratchet's own shrink arm prescribed the command its own header
 * forbids 150 lines further up.
 *
 * The prohibition is now the WRITER'S, not a comment's: for any file in
 * `DECLARED_OVERRUNS`, `--update` preserves the committed baseline row EXACTLY —
 * absent stays absent, a present row keeps its number — names every refusal, and
 * EXITS NON-ZERO. It is deliberately conservative in both directions: a declared
 * row is never created, never raised AND never lowered here, because a declared
 * row's movement is the LEDGER's governed path (lower the declared figure to bank
 * a win; delete the row once the baseline covers it), and only after that does
 * the file stop being declared and become an ordinary `--update` row again.
 * ⭐ THE ADVICE AND THE TOOL NOW DERIVE FROM ONE LEDGER, so they switch together:
 * empty the ledger and `--update` writes everything and exits 0.
 */
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

export const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');
const DOMAIN = path.join(ROOT, 'src', 'domain');
export const BASELINE = path.join(ROOT, 'tests', 'lint', '.domain-any-baseline.json');

/**
 * ── THE DECLARED-OVERRUN LEDGER — ONE HOME, AND IT IS THE WRITER'S ────────────
 * Every file in src/domain that is knowingly OVER its frozen baseline, each row
 * ATTRIBUTED to the commit that put it over and each carrying a written cause.
 * The set is EXACT in both directions and both its sizes are capped by
 * monotone-down literals — the arms that audit all of that live in
 * tests/lint/domainAnyCastBaseline.test.js, which imports this object.
 *
 * ⚠ IT LIVES HERE BECAUSE THE WRITER MUST OWN THE LIST IT MAY NOT WRITE. While
 * this object sat in the test file the counter had no idea it existed, so
 * `--update` happily banked all three rows; giving the script its own copy of the
 * file keys would have been the hardcoded-twin class instead. The test cannot be
 * imported by this script (it imports vitest at module scope), so the direction
 * is script → test and there is exactly one copy of every figure.
 *
 * ⛔ NOTHING MAY BE ADDED HERE TO MAKE A RED GO AWAY. New debt is TYPED, not
 * declared: the ledger's two ceilings in the test file are monotone-down
 * literals, so a new row (or a raised count on an existing one) only moves the
 * red from the regression arm to the ceiling arm.
 */
export const DECLARED_OVERRUNS = Object.freeze({
  'src/domain/worldPulse/commercialReasons.js': {
    any: 31,
    suppress: 0,
    introducedAt: 'd7ea69a4baf64d8c4281650b5160103519f453ef',
    cause: 'TR-1 THE CASUS COMMERCII added the file already carrying 31 holes, and a file absent '
      + 'from the baseline has an allowance of ZERO, so it has been over since its first commit. '
      + 'THE LARGEST SINGLE DEBT ON THIS LIST, and the reason `--update` is forbidden here: a '
      + 'blanket re-freeze would bank all 31 as permanent baseline. Cleared only by typing the '
      + 'commercial-reason payload shapes, one at a time.',
  },
  'src/domain/worldPulse/warDeployment.js': {
    any: 17,
    suppress: 0,
    introducedAt: '172e5f2252fada7e297ff2355147e4e42979ad2d',
    cause: 'Lane WZ-2 piece 3 (the license ledger) took this file from 16 holes to 17 against a '
      + 'baseline of 16. The smallest row on the list and the cheapest to clear: ONE hole, in a '
      + 'file the wave-5b burn-down already gave named pulseShapes typedefs (89 -> 64).',
  },
  'src/domain/worldPulse/envoyPulse.js': {
    any: 2,
    suppress: 0,
    introducedAt: 'e0c8646ee36fdfc6a34f7e8d20dce8885b2dffa3',
    cause: 'The `= {}` destructure idiom sweep left `regionalGraph?:any, wizardNews?:any` in '
      + "advanceEnvoyDiplomacyPulse's @param. ⚠ TYPING THEM `unknown` WAS TRIED, RE-MEASURED AND "
      + 'IS BACKWARDS — it adds two domain-strict errors here and two more in pulseKernel under '
      + 'BOTH configs (the full re-measurement is in the test file\'s header ledger). The honest '
      + 'cure needs the real WizardNewsFeed / region-graph shapes threaded through both files.',
  },
});

// JSDoc type-bearing tags whose `{...}` is a TYPE expression. The trailing
// `[ \t]*\{` requires the opening brace on the same line as the tag (JSDoc
// always writes `@param {type}` together) — an untyped `@param name` has a word
// before any brace and is correctly skipped.
const TAGGED_TYPE = /@(?:type|param|arg|argument|returns|return|property|prop|typedef|yields|yield|this)\b[ \t]*\{/g;

// A bare `*` used AS a type (`{*}`, `: *`, `[k: string]: *`, `Array<*>`) — a `*`
// not glued to a word char or another `*` (so it is not part of an identifier
// or a `**`). The `/` guards keep `*/`-adjacency from ever being read as a type.
const BARE_STAR = /(?<![\w$*/])\*(?![\w$*/])/g;

/** Balanced `{...}` group starting at index `open` (which must point at `{`). */
function balancedBrace(text, open) {
  let depth = 0;
  for (let j = open; j < text.length; j++) {
    const ch = text[j];
    if (ch === '{') depth++;
    else if (ch === '}' && --depth === 0) return text.slice(open, j + 1);
  }
  return null; // unbalanced (unterminated) — ignore
}

/**
 * Count `any`/`*` type-holes and ts-suppressions in one file's source text.
 * @param {string} text
 * @returns {{ any: number, suppress: number }}
 */
export function countText(text) {
  let any = 0;
  TAGGED_TYPE.lastIndex = 0;
  let m;
  while ((m = TAGGED_TYPE.exec(text))) {
    const open = m.index + m[0].length - 1; // index of the '{' captured by the regex
    const group = balancedBrace(text, open);
    if (!group) continue;
    // Drop JSDoc continuation gutters (`\n   * `) so a wrapped type does not
    // count its own comment stars as `*` types.
    const cleaned = group.replace(/\n[ \t]*\*[ \t]?/g, '\n');
    any += (cleaned.match(/\bany\b/g) || []).length;
    any += (cleaned.match(BARE_STAR) || []).length;
  }
  const suppress =
    (text.match(/@ts-ignore\b/g) || []).length +
    (text.match(/@ts-expect-error\b/g) || []).length;
  return { any, suppress };
}

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir)) {
    const p = path.join(dir, e);
    if (fs.statSync(p).isDirectory()) walk(p, out);
    else if (e.endsWith('.js')) out.push(p);
  }
  return out;
}

/**
 * Tally the whole domain. Only files with debt appear in `files`.
 * @returns {{ total:number, totalAny:number, totalSuppress:number, files: Record<string,{any:number,suppress:number}> }}
 */
export function countDomain() {
  const files = {};
  let totalAny = 0;
  let totalSuppress = 0;
  for (const abs of walk(DOMAIN).sort()) {
    const { any, suppress } = countText(fs.readFileSync(abs, 'utf8'));
    if (!any && !suppress) continue;
    const rel = path.relative(ROOT, abs).replace(/\\/g, '/');
    files[rel] = { any, suppress };
    totalAny += any;
    totalSuppress += suppress;
  }
  return { total: totalAny + totalSuppress, totalAny, totalSuppress, files };
}

/**
 * ── WHAT `--update` MAY WRITE, AS A PURE FUNCTION ─────────────────────────────
 * Given the measured tally and the committed baseline, return the baseline that
 * `--update` is allowed to write, plus the rows it REFUSED.
 *
 * THE RULE, in one sentence: a declared-overrun file's committed row is copied
 * through UNCHANGED — absent stays absent, present keeps its number — and every
 * other file is re-frozen at its measurement exactly as before.
 *
 * It is a pure function taking its inputs so the refusal can be CONVICTED without
 * a filesystem: the arms in tests/lint/domainAnyCastBaseline.test.js drive it with
 * a synthetic tree, including the empty-ledger control that proves the guard is
 * not passing by refusing nothing.
 *
 * @param {ReturnType<typeof countDomain>} tally  the measured tree
 * @param {{ files?: Record<string, {any:number, suppress:number}> }} baseline  the committed register
 * @param {Record<string, {any:number, suppress:number}>} declared  the overrun ledger
 * @returns {{ next: { total:number, totalAny:number, totalSuppress:number, files: Record<string,{any:number,suppress:number}> },
 *             refusals: Array<{ file:string, measured:{any:number,suppress:number}|null, kept:{any:number,suppress:number}|null }> }}
 */
export function updatePlan(tally, baseline, declared = DECLARED_OVERRUNS) {
  const committed = baseline?.files ?? {};
  const refusals = [];
  const rows = new Map();
  for (const [file, counts] of Object.entries(tally.files)) {
    if (!(file in declared)) { rows.set(file, { any: counts.any, suppress: counts.suppress }); continue; }
    const kept = committed[file] ?? null;
    refusals.push({ file, measured: { any: counts.any, suppress: counts.suppress }, kept });
    if (kept) rows.set(file, { any: kept.any, suppress: kept.suppress });
  }
  // A declared file the tree no longer lists at all still keeps its committed row: dropping it
  // here would be the same laundering in the other direction, silently banking a win the ledger
  // has not been told about. The ledger's own exactness arm is what reds until the row is
  // lowered or deleted BY HAND, and only then does an ordinary --update take over.
  for (const [file, counts] of Object.entries(committed)) {
    if (rows.has(file) || !(file in declared)) continue;
    refusals.push({ file, measured: null, kept: { any: counts.any, suppress: counts.suppress } });
    rows.set(file, { any: counts.any, suppress: counts.suppress });
  }
  const files = {};
  let totalAny = 0;
  let totalSuppress = 0;
  for (const file of [...rows.keys()].sort()) {
    const counts = /** @type {{any:number, suppress:number}} */ (rows.get(file));
    files[file] = counts;
    totalAny += counts.any;
    totalSuppress += counts.suppress;
  }
  return { next: { total: totalAny + totalSuppress, totalAny, totalSuppress, files }, refusals };
}

// CLI: report, or `--update` to re-freeze the baseline.
if (import.meta.url === url.pathToFileURL(process.argv[1] || '').href) {
  const tally = countDomain();
  if (process.argv.includes('--update')) {
    let committed = { files: {} };
    try { committed = JSON.parse(fs.readFileSync(BASELINE, 'utf8')); } catch { /* first freeze */ }
    const { next, refusals } = updatePlan(tally, committed);
    fs.writeFileSync(BASELINE, `${JSON.stringify(next, null, 2)}\n`);
    console.log(`[domain-any] baseline updated: ${next.total} holes (${next.totalAny} any, ${next.totalSuppress} suppress) across ${Object.keys(next.files).length} files.`);
    if (refusals.length) {
      console.error('');
      console.error('⛔ [domain-any] DECLARED-OVERRUN ROWS REFUSED — the tree was NOT re-frozen wholesale.');
      console.error('   These files are knowingly over their baseline under the attributed, capped,');
      console.error('   monotone-down ledger in scripts/count-domain-any.mjs. Banking them here would');
      console.error("   make declared debt permanent and empty the ledger's excess to zero, which is");
      console.error('   exactly the laundering the ledger exists to prevent. Their committed rows were');
      console.error('   copied through untouched:');
      for (const { file, measured, kept } of refusals) {
        const m = measured ? `${measured.any} any / ${measured.suppress} suppress` : 'no debt at all any more';
        const k = kept ? `${kept.any} any / ${kept.suppress} suppress` : 'ABSENT (allowance 0)';
        console.error(`     ${file}\n       measured ${m}  ·  baseline kept at ${k}`);
      }
      console.error('');
      console.error('   To move one of these, edit its LEDGER row, not the baseline: lower the declared');
      console.error('   figure to bank a win, or delete the row once the baseline covers the file. Once');
      console.error('   the ledger is empty this command re-freezes everything and exits 0.');
      process.exitCode = 2;
    }
  } else {
    const top = Object.entries(tally.files)
      .sort(([, a], [, b]) => (b.any + b.suppress) - (a.any + a.suppress))
      .slice(0, 15);
    console.log(`[domain-any] ${tally.total} holes (${tally.totalAny} any, ${tally.totalSuppress} suppress) across ${Object.keys(tally.files).length} files.`);
    console.log('top offenders:');
    for (const [f, { any, suppress }] of top) console.log(`  ${any + suppress}\t(${any} any, ${suppress} suppress)\t${f}`);
  }
}
