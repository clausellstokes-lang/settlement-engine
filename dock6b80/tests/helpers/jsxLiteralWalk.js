/**
 * tests/helpers/jsxLiteralWalk.js — shared JSX-aware string/text extractor for
 * the E-E VOICE WALKER → JSX EXTENSION (docs/THE_APLUS_EXECUTION_ARCHITECTURE.md
 * §E-E; bar 8 CONTENT/VOICE + bar 18 IMMERSION in THE_APLUS_CONVERGENCE_BLUEPRINT.md).
 *
 * E2 voiceMechanics (tests/copy/voiceMechanics.test.js) and E1 proseLeak
 * (tests/copy/proseLeak.test.js) enforce the VOICE_AND_TONE bans — no em dash,
 * no exclamation point, no raw engine token — over src/data + src/domain (E2's
 * own docstring: "the registries and the prose source files") and over rendered
 * COMPOSER output (E1). Neither ever looked inside src/**\/*.jsx: a hand-rolled
 * char tokenizer can find a quoted string literal, but the actual reader-facing
 * copy in a component is usually JSX TEXT — `<h2>The town thrives!</h2>` — which
 * is not a quoted string at all, so the existing scanners are structurally blind
 * to it. THAT was the recorded gap ("E2 scans registries + data, not components").
 *
 * This module closes the parsing gap with a real JSX-aware AST walk (espree with
 * `ecmaFeatures.jsx: true` — the same parser eslint's flat config and
 * tests/lint/rawColorLiteral.test.js already use for JSX-aware scanning; no new
 * dependency, `espree`/`acorn-jsx` are transitive via eslint). It extracts every
 * human-legible string surface in a component: JSXText content, quoted string
 * Literal values (attributes and plain JS string literals alike), and template-
 * literal cooked segments (the `${…}` interpolation holes are not string content
 * and are skipped, matching E2's template-literal handling).
 *
 * Extracted to tests/helpers/ (not left inline in one of the two callers) per the
 * dormancyOracle precedent in this same directory: importing a symbol FROM a
 * `.test.js` file re-evaluates that module, coupling a sibling suite's registration
 * to this file's name/shape. A plain, describe-free helper avoids that coupling —
 * both voiceMechanics.test.js and proseLeak.test.js import the identical walk.
 *
 * Pure and read-only: no writes, no network, deterministic given committed source.
 */
import { parse } from 'espree';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

/**
 * Recursively collect every `.jsx` file under `dir`.
 * @param {string} dir
 * @param {string[]} [out]
 * @returns {string[]} absolute paths
 */
export function walkJsxFiles(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walkJsxFiles(p, out);
    else if (/\.jsx$/.test(e)) out.push(p);
  }
  return out;
}

/**
 * Parse one JSX source file and extract every JSXText / string-Literal /
 * template-cooked-segment content string it contains.
 * @param {string} src
 * @returns {string[] | null} extracted strings, or null if the file failed to
 *   parse (callers must skip, not throw — one malformed file must not sink the
 *   whole ratchet).
 */
export function extractJsxProseStrings(src) {
  /** @type {import('estree').Node} */
  let ast;
  try {
    ast = parse(src, { ecmaVersion: 2024, sourceType: 'module', ecmaFeatures: { jsx: true } });
  } catch {
    return null;
  }
  /** @type {string[]} */
  const out = [];
  const stack = [ast];
  while (stack.length) {
    const n = /** @type {any} */ (stack.pop());
    if (!n || typeof n !== 'object') continue;
    if (n.type === 'JSXText' && typeof n.value === 'string') out.push(n.value);
    else if (n.type === 'Literal' && typeof n.value === 'string') out.push(n.value);
    else if (n.type === 'TemplateElement' && n.value && typeof n.value.cooked === 'string') out.push(n.value.cooked);
    for (const k in n) {
      if (k === 'loc' || k === 'range' || k === 'parent') continue;
      const v = n[k];
      if (Array.isArray(v)) { for (const x of v) if (x && typeof x.type === 'string') stack.push(x); }
      else if (v && typeof v.type === 'string') stack.push(v);
    }
  }
  return out;
}

/**
 * Walk every `.jsx` file under `rootDir`, extracting its prose strings.
 * Files that fail to parse are silently skipped (none currently do — see
 * voiceMechanics.test.js's "the JSX corpus parses" control).
 * @param {string} rootDir absolute directory to scan
 * @param {string} repoRoot absolute repo root (for relative-path keys)
 * @returns {{ rel: string, strings: string[] }[]}
 */
export function scanJsxTree(rootDir, repoRoot) {
  const results = [];
  for (const abs of walkJsxFiles(rootDir)) {
    const rel = relative(repoRoot, abs).replace(/\\/g, '/');
    const strings = extractJsxProseStrings(readFileSync(abs, 'utf8'));
    if (strings) results.push({ rel, strings });
  }
  return results.sort((a, b) => (a.rel < b.rel ? -1 : a.rel > b.rel ? 1 : 0));
}

/**
 * ── THE ADJACENCY MARKER (the second surface) ────────────────────────────────
 *
 * `extractJsxProseStrings` above deliberately DROPS every `${…}` interpolation
 * and every `{expr}` JSX child, because it answers "what literal text does this
 * component contain". That is the right surface for a character ban (an em dash
 * is an em dash wherever it sits) and the WRONG surface for an ADJACENCY ban.
 *
 * A counter label is a relationship between a word and the value beside it:
 * `Tick {tick}` is a leak and `Tick` alone is not. Drop the hole and the two
 * become the same string, so a detector built on the flat surface is
 * STRUCTURALLY BLIND to every live counter site — it can only ever see the
 * literal-digit form `tick 12`, which reader-facing code essentially never
 * writes. That blindness is what let `proseLeak`'s `tick` budget sit at zero
 * while 29 live sites rendered raw counters (ODQ §113).
 *
 * This second extractor keeps the holes as `INTERPOLATION_HOLE`, a NUL byte —
 * chosen because no JavaScript source text can contain one, so a hole can never
 * be confused with authored content and no authored content can forge a hole.
 * Each segment is one JSX element's joined children, or one template literal.
 *
 * ⛔ ADDITIVE. `extractJsxProseStrings`, `scanJsxTree` and `walkJsxFiles` keep
 * byte-identical behaviour: `voiceMechanics.test.js` and `proseLeak.test.js`
 * both import them and both carry committed per-file budgets, so a change there
 * would move a second suite's ratchet from inside this one's cure.
 */
export const INTERPOLATION_HOLE = '\u0000';

/**
 * Parse one JSX source file and extract its prose SEGMENTS with interpolation
 * holes preserved. A segment is one JSX element/fragment's joined children, or
 * one template literal's quasis joined by holes.
 * @param {string} src
 * @returns {{ text: string, line: number }[] | null} null if the file failed to
 *   parse (callers must skip, not throw — the same contract as the flat walk).
 */
export function extractJsxProseSegments(src) {
  /** @type {any} */
  let ast;
  try {
    ast = parse(src, { ecmaVersion: 2024, sourceType: 'module', ecmaFeatures: { jsx: true }, loc: true });
  } catch {
    return null;
  }
  /** @type {{ text: string, line: number }[]} */
  const out = [];
  /** @param {any} n */
  const visit = (n) => {
    if (!n || typeof n !== 'object') return;
    if (n.type === 'TemplateLiteral') {
      let s = '';
      for (let i = 0; i < n.quasis.length; i += 1) {
        s += n.quasis[i].value.cooked ?? '';
        if (i < n.expressions.length) s += INTERPOLATION_HOLE;
      }
      out.push({ text: s, line: n.loc?.start.line ?? 0 });
    } else if (n.type === 'JSXElement' || n.type === 'JSXFragment') {
      let s = '';
      for (const ch of n.children || []) {
        if (ch.type === 'JSXText') s += ch.value;
        else if (ch.type === 'JSXExpressionContainer') s += INTERPOLATION_HOLE;
      }
      if (s.trim() || s.includes(INTERPOLATION_HOLE)) out.push({ text: s, line: n.loc?.start.line ?? 0 });
    }
    for (const k in n) {
      if (k === 'loc' || k === 'range' || k === 'parent') continue;
      const v = n[k];
      if (Array.isArray(v)) { for (const x of v) if (x && typeof x.type === 'string') visit(x); }
      else if (v && typeof v.type === 'string') visit(v);
    }
  };
  visit(ast);
  return out;
}

/**
 * Walk every `.jsx` file under `rootDir`, extracting its prose SEGMENTS.
 * @param {string} rootDir absolute directory to scan
 * @param {string} repoRoot absolute repo root (for relative-path keys)
 * @returns {{ rel: string, segments: { text: string, line: number }[] }[]}
 */
export function scanJsxSegmentTree(rootDir, repoRoot) {
  const results = [];
  for (const abs of walkJsxFiles(rootDir)) {
    const rel = relative(repoRoot, abs).replace(/\\/g, '/');
    const segments = extractJsxProseSegments(readFileSync(abs, 'utf8'));
    if (segments) results.push({ rel, segments });
  }
  return results.sort((a, b) => (a.rel < b.rel ? -1 : a.rel > b.rel ? 1 : 0));
}
