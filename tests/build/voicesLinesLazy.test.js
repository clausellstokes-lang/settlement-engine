/**
 * tests/build/voicesLinesLazy.test.js — THE VOICES' LINES NEVER RIDE THE FIRST PAINT (S-G1; the chair's brief: "the first
 * paint must not carry the lines: load them lazily with the tab").
 *
 * The said and liar lines (`src/data/voices/`) and the plan that reads them (`src/domain/voices/voicePlan.js`) are reached
 * from the screen ONLY through the one dynamic import inside `components/primitives/CardVoice.jsx`. The PDF's twin may
 * import the plan statically: the PDF renderer is itself behind a dynamic import, which layer 1 proves by walking the
 * eager graph.
 *   1. THE EAGER SOURCE GRAPH (always on): a static-edge BFS from src/main.jsx reaches neither the lines nor the plan.
 *   2. THE PARENTS (always on): the screen's one dynamic import site is CardVoice; no screen file imports the plan
 *      statically (the PDF's twin alone may).
 */
import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

const ROOT = process.cwd();
const SRC = resolve(ROOT, 'src');
const LINES = [resolve(SRC, 'data/voices/saidLines.js'), resolve(SRC, 'data/voices/liarLines.js')];
const PLAN = resolve(SRC, 'domain/voices/voicePlan.js');
const LAZY_PARENT = 'src/components/primitives/CardVoice.jsx';
const PDF_TWIN = 'src/pdf/primitives/CardVoice.jsx';

const stripComments = (/** @type {string} */ source) => source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
const rel = (/** @type {string} */ abs) => relative(ROOT, abs).replace(/\\/g, '/');

/** @param {string} from @param {string} specifier */
function resolveRelativeImport(from, specifier) {
  if (!specifier.startsWith('.')) return null;
  const base = resolve(dirname(from), specifier);
  for (const c of [base, `${base}.js`, `${base}.jsx`, join(base, 'index.js'), join(base, 'index.jsx')]) {
    if (existsSync(c) && statSync(c).isFile()) return c;
  }
  return null;
}

/** Static edges only, never `import(…)`. @param {string} file */
function staticImports(file) {
  const source = stripComments(readFileSync(file, 'utf8'));
  /** @type {string[]} */ const specifiers = [];
  for (const m of source.matchAll(/(?:^|[^.\w])import\s+(?:[^'"()]*?\sfrom\s+)?['"]([^'"]+)['"]/g)) specifiers.push(m[1]);
  for (const m of source.matchAll(/(?:^|[^.\w])export\s+[^'"]*?\sfrom\s+['"]([^'"]+)['"]/g)) specifiers.push(m[1]);
  return /** @type {string[]} */ (specifiers.map((s) => resolveRelativeImport(file, s)).filter(Boolean));
}

/** @param {string} dir @param {string[]} [out] */
function walkSrc(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walkSrc(p, out);
    else if (/\.(js|jsx)$/.test(entry)) out.push(p);
  }
  return out;
}

describe('the voices\' lines: the eager source graph never reaches them', () => {
  const entry = resolve(SRC, 'main.jsx');
  const seen = new Set([entry]);
  const queue = [entry];
  while (queue.length) {
    const file = /** @type {string} */ (queue.shift());
    for (const dep of staticImports(file)) if (!seen.has(dep)) { seen.add(dep); queue.push(dep); }
  }

  it('guard-the-guard: the BFS from src/main.jsx walked the eager graph', () => {
    expect(seen.size).toBeGreaterThan(100);
  });

  it('neither the lines nor the plan is statically reachable from main.jsx', () => {
    expect([...LINES, PLAN].filter((f) => seen.has(f)).map(rel)).toEqual([]);
  });
});

describe('the voices\' lines: the one lazy parent on the screen', () => {
  const files = walkSrc(SRC);
  /** @type {string[]} */ const staticImporters = [];
  /** @type {string[]} */ const dynamicParents = [];
  for (const file of files) {
    const source = stripComments(readFileSync(file, 'utf8'));
    if (/(?:\bfrom\s*|(?:^|[;{}])\s*import\s*)['"][^'"]*\/voices\/voicePlan\.js['"]/m.test(source)) staticImporters.push(rel(file));
    if (/\bimport\s*\(\s*['"][^'"]*\/voices\/voicePlan\.js['"]\s*\)/.test(source)) dynamicParents.push(rel(file));
  }

  it('the screen reaches the plan through CardVoice\'s dynamic import alone', () => {
    expect(dynamicParents).toEqual([LAZY_PARENT]);
  });

  it('no file but the PDF\'s twin imports the plan statically', () => {
    expect(staticImporters.filter((f) => f !== PDF_TWIN && !f.startsWith('src/domain/voices/'))).toEqual([]);
  });
});
