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
