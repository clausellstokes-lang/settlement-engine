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
 */
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

export const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');
const DOMAIN = path.join(ROOT, 'src', 'domain');
export const BASELINE = path.join(ROOT, 'tests', 'lint', '.domain-any-baseline.json');

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

// CLI: report, or `--update` to re-freeze the baseline.
if (import.meta.url === url.pathToFileURL(process.argv[1] || '').href) {
  const tally = countDomain();
  if (process.argv.includes('--update')) {
    fs.writeFileSync(BASELINE, `${JSON.stringify(tally, null, 2)}\n`);
    console.log(`[domain-any] baseline updated: ${tally.total} holes (${tally.totalAny} any, ${tally.totalSuppress} suppress) across ${Object.keys(tally.files).length} files.`);
  } else {
    const top = Object.entries(tally.files)
      .sort(([, a], [, b]) => (b.any + b.suppress) - (a.any + a.suppress))
      .slice(0, 15);
    console.log(`[domain-any] ${tally.total} holes (${tally.totalAny} any, ${tally.totalSuppress} suppress) across ${Object.keys(tally.files).length} files.`);
    console.log('top offenders:');
    for (const [f, { any, suppress }] of top) console.log(`  ${any + suppress}\t(${any} any, ${suppress} suppress)\t${f}`);
  }
}
