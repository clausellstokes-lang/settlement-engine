/**
 * tests/build/tableClerkLazy.test.js — R-1 SESSION LEDGER: the AI CLERK transport's
 * first-paint lazy contract (the pin src/lib/tableClerk.js's header claims).
 *
 * src/lib/tableClerk.js declares that it and its graph (domain/tableLedger) contribute
 * ZERO first-paint bytes, reached only through the ONE dynamic import inside the lazy
 * TableLedgerPanel (AppViews React.lazy → DmScreen → TableLedgerPanel → import()).
 * Until this file existed that was a CONVENTION WITHOUT ENFORCEMENT: the module
 * exported TABLE_CLERK_FINGERPRINT and NOTHING consumed it — no test, no closure check,
 * no script — so a future static import anywhere would have dragged the transport (plus
 * supabase and the tableLedger wall) onto first paint while the header went on claiming
 * a pin. This is the twin of tests/build/surveyorPanelsLazy.test.js (lib/surveyorWrite,
 * the write-stage sibling) and follows archKernelLazy's always-on/gated layering.
 *
 * WHICH LAYERS RUN WHEN — a guard that bites only under a flag must say so:
 *   1. THE EAGER SOURCE GRAPH  (ALWAYS ON, needs no build) — a static-edge-only BFS from
 *      src/main.jsx must reach NEITHER lib/tableClerk.js NOR domain/tableLedger.js. This
 *      is the direct source-level proof of the ZERO-first-paint-bytes claim.
 *   2. THE SINGLE LAZY PARENT  (ALWAYS ON, needs no build) — no shipped src file
 *      STATICALLY imports lib/tableClerk.js; its sole dynamic import() site is
 *      TableLedgerPanel; and the lazy membership chain down to that panel is intact.
 *   3. VERIFY_DIST ANTI-VACUITY (ALWAYS ON) — VERIFY_DIST=1 with no dist/assets is a hard
 *      fail: a skipped post-build contract is green-on-nothing.
 *   4. THE CLOSURE ABSENCE (runIf dist/ exists — SILENTLY SKIPPED on a plain
 *      `npm run test` in a tree with no dist/) — TABLE_CLERK_FINGERPRINT, imported here
 *      FROM the module so that export is finally load-bearing, appears in no chunk of
 *      the entry's transitive static closure. `npm run verify:dist` (VERIFY_DIST=1, run
 *      post-build by ci.yml) is the run that enforces it against a fresh dist; a stale
 *      dist can only under-report, never invent a leak.
 *   5. ANTI-VACUITY PRESENCE (VERIFY_DIST=1 only) — the fingerprint IS present in some
 *      emitted chunk, so layer 4's absence means laziness and not tree-shaking.
 *
 * Layers 1–3 are why a plain `npm run test` still bites: they read source, never dist.
 */
import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { TABLE_CLERK_FINGERPRINT } from '../../src/lib/tableClerk.js';

const ROOT = process.cwd();
const SRC = resolve(ROOT, 'src');
const distDir = resolve(ROOT, 'dist');
const assetsDir = join(distDir, 'assets');
const distExists = existsSync(distDir) && existsSync(assetsDir);
const requireDist = process.env.VERIFY_DIST === '1';

const TRANSPORT = resolve(SRC, 'lib/tableClerk.js');
const WALL = resolve(SRC, 'domain/tableLedger.js');
const LAZY_PARENT = 'src/components/tableLedger/TableLedgerPanel.jsx';

// ── shared source helpers ────────────────────────────────────────────────────
const stripComments = (source) => source
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/^\s*\/\/.*$/gm, '');

const rel = (abs) => relative(ROOT, abs).replace(/\\/g, '/');

function resolveRelativeImport(from, specifier) {
  if (!specifier.startsWith('.')) return null;
  const base = resolve(dirname(from), specifier);
  for (const candidate of [base, `${base}.js`, `${base}.jsx`, join(base, 'index.js'), join(base, 'index.jsx')]) {
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  }
  return null;
}

/** Static edges only — `import … from '…'` and `export … from '…'`, never `import(…)`. */
function staticImports(file) {
  const source = stripComments(readFileSync(file, 'utf8'));
  const specifiers = [];
  for (const m of source.matchAll(/(?:^|[^.\w])import\s+(?:[^'"()]*?\sfrom\s+)?['"]([^'"]+)['"]/g)) specifiers.push(m[1]);
  for (const m of source.matchAll(/(?:^|[^.\w])export\s+[^'"]*?\sfrom\s+['"]([^'"]+)['"]/g)) specifiers.push(m[1]);
  return specifiers.map((s) => resolveRelativeImport(file, s)).filter(Boolean);
}

function walkSrc(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walkSrc(p, out);
    else if (/\.(js|jsx)$/.test(entry)) out.push(p);
  }
  return out;
}

// ── LAYER 1: the eager source graph (ALWAYS ON) ──────────────────────────────
describe('R-1 table clerk — the eager source graph never reaches the transport', () => {
  const entry = resolve(SRC, 'main.jsx');
  const seen = new Set([entry]);
  const queue = [entry];
  while (queue.length) {
    const file = queue.shift();
    for (const dep of staticImports(file)) {
      if (!seen.has(dep)) { seen.add(dep); queue.push(dep); }
    }
  }

  it('guard-the-guard: the BFS from src/main.jsx actually walked the eager graph', () => {
    expect(seen.size, 'the static-edge BFS collapsed — every absence assertion below would be vacuous').toBeGreaterThan(100);
  });

  it('neither lib/tableClerk.js nor domain/tableLedger.js is statically reachable from main.jsx', () => {
    const reached = [TRANSPORT, WALL].filter((f) => seen.has(f)).map(rel);
    expect(
      reached,
      `the clerk transport / its schema wall reached FIRST PAINT through the static graph (${reached.join(', ')}). `
      + 'They must stay behind the lazy TableLedgerPanel\'s dynamic import().',
    ).toEqual([]);
  });
});

// ── LAYER 2: the single lazy parent (ALWAYS ON) ──────────────────────────────
describe('R-1 table clerk — the single-lazy-parent discipline', () => {
  const files = walkSrc(SRC).filter((f) => f !== TRANSPORT);
  const staticOffenders = [];
  const dynamicParents = [];
  for (const file of files) {
    const source = stripComments(readFileSync(file, 'utf8'));
    if (/(?:\bfrom\s*|(?:^|[;{}])\s*import\s*)['"][^'"]*\/tableClerk\.js['"]/m.test(source)) staticOffenders.push(rel(file));
    if (/\bimport\s*\(\s*['"][^'"]*\/tableClerk\.js['"]\s*\)/.test(source)) dynamicParents.push(rel(file));
  }

  it('guard-the-guard: the scan walked src/ and found the known dynamic import site', () => {
    expect(files.length, 'the src walker collapsed').toBeGreaterThan(200);
    expect(
      dynamicParents.length,
      'no dynamic import of lib/tableClerk.js was found anywhere — the scan\'s specifier shape went stale (a rename?), so the static-import assertion below proves nothing',
    ).toBeGreaterThan(0);
  });

  it('no shipped src file STATICALLY imports lib/tableClerk.js', () => {
    expect(
      staticOffenders,
      'these modules statically import the clerk transport, which pulls it (and supabase + domain/tableLedger) '
      + `into their chunk — route the edge through a dynamic import() instead:\n${staticOffenders.join('\n')}`,
    ).toEqual([]);
  });

  it('the sole dynamic import() parent is the lazy TableLedgerPanel', () => {
    expect(
      dynamicParents,
      'the clerk transport gained a second lazy parent. That is allowed only deliberately: add it here AND '
      + 'amend the DYNAMIC-IMPORTED sentence in src/lib/tableClerk.js\'s header, which claims exactly one.',
    ).toEqual([LAZY_PARENT]);
  });

  it('the lazy membership chain to that panel is intact (AppViews lazy → DmScreen → panel)', () => {
    const read = (p) => readFileSync(resolve(ROOT, p), 'utf8');
    expect(
      read('src/AppViews.jsx'),
      'DmScreen is no longer React.lazy in AppViews — the panel (and the clerk under it) may now ride first paint',
    ).toMatch(/lazy\(\s*\(\)\s*=>\s*import\('\.\/components\/screen\/DmScreen\.jsx'\)\s*\)/);
    expect(read('src/components/screen/DmScreen.jsx')).toMatch(/TableLedgerPanel/);
  });
});

// ── LAYER 3: VERIFY_DIST anti-vacuity (ALWAYS ON) ────────────────────────────
describe('R-1 table clerk — VERIFY_DIST post-build anti-vacuity', () => {
  it('when VERIFY_DIST=1, dist/ + dist/assets exist (post-build must verify, not skip)', () => {
    expect(
      !requireDist || distExists,
      'VERIFY_DIST=1 but dist/assets is absent — run `npm run build` first',
    ).toBe(true);
  });
});

// ── LAYERS 4 + 5: the emitted first-paint closure ────────────────────────────
function emittedStaticSpecs(code) {
  const specs = new Set();
  for (const m of code.matchAll(/\bfrom\s*["'](\.\/[^"']+\.js)["']/g)) specs.add(m[1].replace('./', ''));
  for (const m of code.matchAll(/(?:^|[;}])import\s*["'](\.\/[^"']+\.js)["']/g)) specs.add(m[1].replace('./', ''));
  return [...specs];
}

function entryStaticClosure() {
  const html = readFileSync(join(distDir, 'index.html'), 'utf-8');
  const m = html.match(/<script[^>]*type="module"[^>]*src="\/assets\/([^"]+)"/);
  if (!m) throw new Error('Could not locate entry <script type="module"> in dist/index.html');
  const seen = new Set([m[1]]);
  const queue = [m[1]];
  while (queue.length) {
    const file = queue.shift();
    for (const dep of emittedStaticSpecs(readFileSync(join(assetsDir, file), 'utf-8'))) {
      if (!seen.has(dep)) { seen.add(dep); queue.push(dep); }
    }
  }
  return [...seen];
}

describe.runIf(distExists)('R-1 table clerk — absent from the first-paint static closure', () => {
  it('TABLE_CLERK_FINGERPRINT appears in NO chunk of the entry transitive closure', () => {
    const carriers = entryStaticClosure()
      .filter((f) => readFileSync(join(assetsDir, f), 'utf-8').includes(TABLE_CLERK_FINGERPRINT));
    expect(
      carriers,
      `the clerk transport reached first paint via ${carriers.join(', ')} — it must contribute ZERO first-paint bytes`,
    ).toEqual([]);
  });

  it.skipIf(!requireDist)('anti-vacuity: the fingerprint IS present in some emitted chunk (absence is not tree-shaking)', () => {
    const hosting = readdirSync(assetsDir)
      .filter((f) => f.endsWith('.js') && readFileSync(join(assetsDir, f), 'utf-8').includes(TABLE_CLERK_FINGERPRINT));
    expect(
      hosting.length,
      `TABLE_CLERK_FINGERPRINT ("${TABLE_CLERK_FINGERPRINT}") is in NO dist chunk — it was tree-shaken or the clerk stopped shipping, `
      + 'so the absence check above proves nothing. Re-anchor the pin on a guaranteed-shipping literal.',
    ).toBeGreaterThan(0);
  });
});
