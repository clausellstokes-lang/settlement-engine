#!/usr/bin/env node
/**
 * scripts/boot-smoke.mjs — DOES THE SHIPPED BUNDLE ACTUALLY BOOT?
 *
 * THE INCIDENT THIS EXISTS FOR (lane BT, 2026-08-03). From a80c0be4 until this file
 * landed, `dist/` was un-bootable: the entry chunk threw
 * `ReferenceError: Cannot access 'Ot' before initialization` before a single React
 * component rendered, and 347 of 471 chunks inherited the throw. Every gate in the
 * estate stayed green through it:
 *
 *   • `npm run build` exits 0 — Rollup emits a chunk order it never executes.
 *   • `postbuild` prerender is Node-side over the ROUTE TABLE, not the bundle graph.
 *   • the whole vitest suite runs against `src/`, never against `dist/`.
 *   • the existing tests/build/* pins read dist as TEXT (names, sizes, preload tags).
 *     Reading a file proves nothing about whether it evaluates.
 *
 * The missing gate is the one below: EXECUTE the built graph.
 *
 * ── THE THREE STAGES ───────────────────────────────────────────────────────────
 *
 * STAGE 1 — THE CHUNK GRAPH IS ACYCLIC.  The static import graph over dist/assets
 *   must have no cycle. This is the CAUSE, not the symptom: ESM gives a cyclic graph
 *   no safe evaluation order, so a module-scope read of an imported `const` across
 *   the cycle lands in the temporal dead zone. Which binding explodes depends on
 *   which member Rollup happens to enter first, so the same source can boot on one
 *   build and die on the next. Stage 1 fails on the cycle itself, at build time,
 *   before it has picked a victim. Edges come from an acorn parse of each chunk's
 *   top-level `import`/`export … from` declarations — dynamic `import()` is a lazy
 *   boundary and is deliberately NOT an edge.
 *
 * STAGE 2 — EVERY CHUNK INITIALISES.  Import all 471 chunks under a browser-shaped
 *   environment and fail on any module-init throw. WHY ALL OF THEM, and not a page
 *   load: the fault lived in the LAZY `engine` chunk, which a browser hitting `/`
 *   only downloads once the user generates a settlement. A real-browser page-load
 *   smoke test would have caught this bug today only by accident — because the same
 *   defect had dragged `engine` into the eager closure — and would have gone VACUOUS
 *   for this exact class the moment the fix put `engine` back where it belongs.
 *   The all-chunks walk cannot go vacuous that way.
 *
 * STAGE 3 — THE APP SHELL MOUNTS.  Load the real `dist/index.html` into jsdom,
 *   import the real entry chunk, and prove React took the root: `#root` is empty in
 *   the shipped HTML, and the mount is asserted TWICE — non-empty markup AND React's
 *   own `__reactContainer$…` marker on the root element, so a stray innerHTML write
 *   cannot fake it.
 *
 * ── WHY A BROWSER-SHAPED ENVIRONMENT, PRECISELY ────────────────────────────────
 * Bundled UMD dependencies branch on host detection. `js-md5` inside vendor-pdf
 * takes its Node path when `process.versions.node` is readable and then dereferences
 * a `Buffer` that browser bundles do not carry — a failure of the HARNESS, not of the
 * bundle, and exactly the kind of noise that gets a real gate allowlisted into
 * uselessness. So the harness presents a browser: jsdom globals, `self`, and a
 * `process` shim that still answers `process.env` but does not claim to be Node.
 * With that in place the broken dist produced ONE failure class and no noise at all,
 * which is why this gate needs no allowlist. If you ever find yourself adding one,
 * fix the environment instead.
 *
 * ── ANTI-VACUITY ───────────────────────────────────────────────────────────────
 * A gate that greens on nothing is worse than no gate. Guarded here by: a hard
 * failure when dist/ or dist/assets is absent, a floor of MIN_CHUNKS chunks, a
 * required entry chunk resolved from index.html's own <script type="module"> tag
 * (never guessed from a filename pattern), and a required non-zero count of
 * successfully-initialised chunks. tests/build/bootSmoke.test.js adds a negative
 * control over `findChunkCycles` with a synthetic cyclic graph, so the cycle finder
 * cannot pass by never detecting anything.
 *
 * Usage:  node scripts/boot-smoke.mjs [--dist <dir>]
 * Exit:   0 all stages pass · 1 any stage fails.
 */

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parse as acornParse } from 'acorn';

const HERE = dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = resolve(HERE, '..');

/** Anti-vacuity floor: a dist with fewer chunks than this is a broken/partial build. */
export const MIN_CHUNKS = 50;

/** Hard ceiling on the whole run. A module that hangs at init is a boot failure too. */
const WATCHDOG_MS = 180_000;

/** The real process object, captured before Stage 2 swaps in the browser-shaped shim. */
const REAL_PROCESS = process;

// ── Stage 1: the chunk graph ────────────────────────────────────────────────

/**
 * The STATIC import specifiers of one chunk. Top-level `import` / `export … from`
 * only: a dynamic `import()` is a lazy boundary and creates no evaluation-order
 * obligation, so counting it would report cycles that cannot break a boot.
 *
 * @param {string} source  chunk source text
 * @returns {string[]} raw specifiers, in source order
 */
export function staticImportSpecifiers(source) {
  const ast = acornParse(source, { ecmaVersion: 'latest', sourceType: 'module' });
  const out = [];
  for (const node of ast.body) {
    const isStatic = node.type === 'ImportDeclaration'
      || node.type === 'ExportNamedDeclaration'
      || node.type === 'ExportAllDeclaration';
    if (isStatic && node.source && typeof node.source.value === 'string') {
      out.push(node.source.value);
    }
  }
  return out;
}

/**
 * The chunk-to-chunk static import graph, keyed by BASENAME (chunk specifiers in a
 * Rollup output are all sibling-relative). Specifiers that do not resolve to a chunk
 * in this directory are dropped — they are worker/asset URLs, not evaluation edges.
 *
 * @param {string} assetsDir
 * @returns {Map<string, string[]>}
 */
export function buildChunkGraph(assetsDir) {
  const files = readdirSync(assetsDir).filter((f) => f.endsWith('.js')).sort();
  const known = new Set(files);
  /** @type {Map<string, string[]>} */
  const graph = new Map();
  for (const file of files) {
    const specs = staticImportSpecifiers(readFileSync(join(assetsDir, file), 'utf8'));
    const deps = [];
    for (const spec of specs) {
      const base = spec.replace(/^.*\//, '');
      if (known.has(base) && base !== file && !deps.includes(base)) deps.push(base);
    }
    graph.set(file, deps);
  }
  return graph;
}

/**
 * Every cycle in a directed graph, as strongly-connected components of size > 1
 * (Tarjan). A self-edge is impossible in Rollup output and is not sought.
 *
 * @param {Map<string, string[]>} graph
 * @returns {string[][]} one array of member ids per cyclic component
 */
export function findChunkCycles(graph) {
  const index = new Map();
  const low = new Map();
  const onStack = new Set();
  const stack = [];
  const cycles = [];
  let counter = 0;

  // Iterative Tarjan: an 8-deep recursion is fine, a 400-deep one is a stack risk.
  for (const root of graph.keys()) {
    if (index.has(root)) continue;
    /** @type {{node: string, deps: string[], i: number}[]} */
    const work = [{ node: root, deps: graph.get(root) || [], i: 0 }];
    index.set(root, counter); low.set(root, counter); counter += 1;
    stack.push(root); onStack.add(root);
    while (work.length) {
      const frame = work[work.length - 1];
      if (frame.i < frame.deps.length) {
        const dep = frame.deps[frame.i];
        frame.i += 1;
        if (!graph.has(dep)) continue;
        if (!index.has(dep)) {
          index.set(dep, counter); low.set(dep, counter); counter += 1;
          stack.push(dep); onStack.add(dep);
          work.push({ node: dep, deps: graph.get(dep) || [], i: 0 });
        } else if (onStack.has(dep)) {
          low.set(frame.node, Math.min(low.get(frame.node), index.get(dep)));
        }
        continue;
      }
      work.pop();
      if (work.length) {
        const parent = work[work.length - 1].node;
        low.set(parent, Math.min(low.get(parent), low.get(frame.node)));
      }
      if (low.get(frame.node) === index.get(frame.node)) {
        const component = [];
        let popped;
        do {
          popped = stack.pop();
          onStack.delete(popped);
          component.push(popped);
        } while (popped !== frame.node);
        if (component.length > 1) cycles.push(component.sort());
      }
    }
  }
  return cycles;
}

// ── The browser-shaped environment ──────────────────────────────────────────

/**
 * Install jsdom globals plus the non-jsdom browser surface the bundle expects, and
 * replace `process` with a shim that answers `process.env` without claiming to be
 * Node (see the header note on js-md5). Returns the jsdom window.
 *
 * @param {string} html  the real dist/index.html
 * @param {string} url
 * @returns {Promise<object>} the jsdom window
 */
async function installBrowserEnvironment(html, url) {
  const require_ = createRequire(pathToFileURL(join(REPO_ROOT, 'noop.cjs')).href);
  const { JSDOM } = await import(pathToFileURL(require_.resolve('jsdom')).href);
  const dom = new JSDOM(html, { url, pretendToBeVisual: true });
  const win = dom.window;

  const define = (key, value) => {
    try {
      Object.defineProperty(globalThis, key, { value, configurable: true, writable: true });
    } catch { /* a non-configurable host global (e.g. `undefined`) — leave it alone */ }
  };
  for (const key of Object.getOwnPropertyNames(win)) {
    if (key in globalThis) continue;
    define(key, win[key]);
  }
  // These DO already exist on the Node global in recent versions (URL, crypto, …) or
  // must point at the document rather than at Node's copy — force them across.
  for (const key of [
    'window', 'document', 'navigator', 'location', 'history', 'localStorage',
    'sessionStorage', 'getComputedStyle', 'matchMedia',
    'requestAnimationFrame', 'cancelAnimationFrame',
  ]) define(key, win[key]);

  define('self', globalThis);
  define('global', globalThis);
  if (!globalThis.matchMedia) {
    define('matchMedia', () => ({
      matches: false, media: '', onchange: null,
      addEventListener() {}, removeEventListener: () => {},
      addListener() {}, removeListener: () => {}, dispatchEvent: () => false,
    }));
  }
  if (!globalThis.IntersectionObserver) {
    define('IntersectionObserver', class { observe() {} unobserve() {} disconnect() {} takeRecords() { return []; } });
  }
  if (!globalThis.ResizeObserver) {
    define('ResizeObserver', class { observe() {} unobserve() {} disconnect() {} });
  }
  if (!globalThis.requestAnimationFrame) {
    define('requestAnimationFrame', (cb) => REAL_PROCESS.nextTick(() => cb(Date.now())));
    define('cancelAnimationFrame', () => {});
  }
  // A browser, not Node. `env` stays readable because Vite's define may leave a
  // `process.env.NODE_ENV` read in a vendored dependency.
  define('process', {
    env: { NODE_ENV: 'production' },
    argv: [], platform: 'browser', versions: {},
    nextTick: (fn) => queueMicrotask(fn),
  });
  define('Buffer', undefined);
  return win;
}

// ── Reporting ───────────────────────────────────────────────────────────────

/**
 * The dist/assets frame a thrown error actually originated in.
 * @param {unknown} error
 * @returns {string} "chunk.js:line:col" or "unknown site"
 */
function originSite(error) {
  const stack = String((error && /** @type {Error} */ (error).stack) || '');
  const frame = stack.split('\n').find((line) => line.includes('/assets/'));
  const match = frame && frame.match(/assets\/([^:)\s]+\.js):(\d+):(\d+)/);
  return match ? `${match[1]}:${match[2]}:${match[3]}` : 'unknown site';
}

/**
 * The entry chunk, read from index.html's own module script tag — never guessed from
 * a filename pattern, so a renamed entry fails loudly instead of silently skipping.
 * @param {string} html
 * @returns {string} basename of the entry chunk
 */
export function entryChunkFromHtml(html) {
  const match = html.match(/<script[^>]*\btype="module"[^>]*\bsrc="([^"]+)"/);
  if (!match) throw new Error('index.html has no <script type="module" src=…> — cannot locate the entry chunk');
  return match[1].replace(/^.*\//, '');
}

// ── Main ────────────────────────────────────────────────────────────────────

/**
 * @param {{distDir?: string}} [options]
 * @returns {Promise<{ok: boolean, failures: string[], notes: string[]}>}
 */
export async function runBootSmoke(options = {}) {
  const distDir = resolve(options.distDir || join(REPO_ROOT, 'dist'));
  const assetsDir = join(distDir, 'assets');
  /** @type {string[]} */ const failures = [];
  /** @type {string[]} */ const notes = [];

  if (!existsSync(distDir) || !statSync(distDir).isDirectory()) {
    return { ok: false, failures: [`dist/ is absent at ${distDir} — run \`npm run build\` first`], notes };
  }
  if (!existsSync(assetsDir)) {
    return { ok: false, failures: [`dist/assets is absent at ${assetsDir} — the build did not emit chunks`], notes };
  }
  const chunks = readdirSync(assetsDir).filter((f) => f.endsWith('.js')).sort();
  if (chunks.length < MIN_CHUNKS) {
    return { ok: false, failures: [`dist/assets holds only ${chunks.length} JS chunks (floor ${MIN_CHUNKS}) — partial build`], notes };
  }
  const indexHtmlPath = join(distDir, 'index.html');
  if (!existsSync(indexHtmlPath)) {
    return { ok: false, failures: ['dist/index.html is absent — the build did not emit the shell'], notes };
  }
  const html = readFileSync(indexHtmlPath, 'utf8');
  const entryChunk = entryChunkFromHtml(html);
  if (!chunks.includes(entryChunk)) {
    return { ok: false, failures: [`index.html points at ${entryChunk}, which is not in dist/assets`], notes };
  }
  notes.push(`${chunks.length} chunks · entry ${entryChunk}`);

  // STAGE 1 — acyclic chunk graph.
  const graph = buildChunkGraph(assetsDir);
  const cycles = findChunkCycles(graph);
  const edgeCount = [...graph.values()].reduce((n, deps) => n + deps.length, 0);
  notes.push(`stage 1: ${edgeCount} static chunk edges`);
  for (const cycle of cycles) {
    const drawn = cycle
      .map((node) => `      ${node} -> ${(graph.get(node) || []).filter((d) => cycle.includes(d)).join(', ')}`)
      .join('\n');
    failures.push(
      `STAGE 1 — the chunk graph has a CYCLE of ${cycle.length} chunks. ESM has no safe\n`
      + `    evaluation order across a cycle, so a module-scope read of an imported const\n`
      + `    across it lands in the temporal dead zone and the bundle cannot boot:\n${drawn}`,
    );
  }

  // STAGE 3 first, then STAGE 2 — the mount needs a COLD module registry, and the
  // all-chunks walk warms it. Reported in stage order regardless of run order.
  const win = await installBrowserEnvironment(html, 'https://settlementforge.local/');
  const stage3 = [];
  try {
    await import(pathToFileURL(join(assetsDir, entryChunk)).href);
    for (let i = 0; i < 12; i += 1) await new Promise((r) => setTimeout(r, 5));
    const root = win.document.getElementById('root');
    if (!root) {
      stage3.push('dist/index.html has no #root element for the app to mount into');
    } else {
      const reactMarker = Object.keys(root).some((k) => k.startsWith('__reactContainer$'));
      const markup = String(root.innerHTML || '').trim();
      if (!reactMarker) stage3.push('React never took #root (no __reactContainer$ marker on the root element)');
      if (markup.length === 0) stage3.push('#root is still empty after the entry chunk ran — the app shell did not render');
      if (!stage3.length) notes.push(`stage 3: shell mounted, ${markup.length} B of markup under #root`);
    }
  } catch (error) {
    stage3.push(`the entry chunk threw during module initialisation: ${String(error && error.message)}\n`
      + `    origin: ${originSite(error)}`);
  }
  for (const problem of stage3) failures.push(`STAGE 3 — the app shell does not mount: ${problem}`);

  // STAGE 2 — every chunk initialises.
  /** @type {Map<string, {message: string, chunks: string[]}>} */
  const byOrigin = new Map();
  let initialised = 0;
  const watchdog = setTimeout(() => {
    REAL_PROCESS.stderr.write('boot-smoke: watchdog fired — a chunk hung during module initialisation\n');
    REAL_PROCESS.exit(1);
  }, WATCHDOG_MS);
  watchdog.unref?.();
  for (const chunk of chunks) {
    try {
      await import(pathToFileURL(join(assetsDir, chunk)).href);
      initialised += 1;
    } catch (error) {
      const key = originSite(error);
      if (!byOrigin.has(key)) byOrigin.set(key, { message: String(error && error.message), chunks: [] });
      byOrigin.get(key).chunks.push(chunk);
    }
  }
  clearTimeout(watchdog);
  notes.push(`stage 2: ${initialised}/${chunks.length} chunks initialised`);
  if (initialised === 0) {
    failures.push('STAGE 2 — not one chunk initialised; the harness itself is broken, not just the bundle');
  }
  for (const [site, { message, chunks: affected }] of byOrigin) {
    failures.push(
      `STAGE 2 — module-init throw at ${site}: ${message}\n`
      + `    ${affected.length} chunk(s) inherit it, e.g. ${affected.slice(0, 3).join(', ')}`,
    );
  }

  return { ok: failures.length === 0, failures, notes };
}

const invokedDirectly = REAL_PROCESS.argv[1]
  && resolve(REAL_PROCESS.argv[1]) === resolve(fileURLToPath(import.meta.url));
if (invokedDirectly) {
  const distFlag = REAL_PROCESS.argv.indexOf('--dist');
  const result = await runBootSmoke({
    distDir: distFlag >= 0 ? REAL_PROCESS.argv[distFlag + 1] : undefined,
  });
  const out = REAL_PROCESS.stdout;
  for (const note of result.notes) out.write(`boot-smoke: ${note}\n`);
  if (result.ok) {
    out.write('boot-smoke: PASS — the built bundle boots.\n');
    REAL_PROCESS.exit(0);
  }
  out.write(`boot-smoke: FAIL — ${result.failures.length} problem(s):\n`);
  for (const failure of result.failures) out.write(`  • ${failure}\n`);
  REAL_PROCESS.exit(1);
}
