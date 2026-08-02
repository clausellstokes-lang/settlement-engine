/**
 * tests/build/mapTabShellLazy.test.js — TC-0, the lazy-leaf contract for the
 * dossier Map tab's SUB-TAB SHELL and its two bodies
 * (DESIGN_TOWN_CARTOGRAPHY.md §12 / J-TC-8; §7 "first-paint cost ZERO").
 *
 * WHAT MUST STAY OFF THE OPEN PATH. `MapTabShell.jsx` is the chrome; the map
 * bodies behind it — the town-map pane (and the whole town-map model) and the
 * player-view projection (and the whole export lane) — are the weight. Every
 * dossier reader pays for the chrome only if the shell holds no static edge to
 * either body, and pays for neither body until they pick that sub-tab.
 *
 * THE SECOND ASSERTION (the VersionsTab lesson, 2026-07-27; the Herald register
 * doors recipe). The PARENT here is itself lazy: OutputContainer mounts the shell
 * through `lazy()`, so an entry-closure check alone would pass even if the shell
 * held plain STATIC imports of both bodies — the parent is already off the entry
 * graph and static children would simply ride its chunk invisibly. So this file
 * also asserts each body rides a DIFFERENT chunk from the shell, which is exactly
 * the property a static import destroys.
 *
 * THE THIRD LAYER (what H4 added, generalized). A one-hop "no `from './x'`" check
 * is satisfiable by an innocent-looking intermediary: `import { thing } from
 * './helpers.js'` where helpers.js imports the pane. So the source layer walks the
 * shell's WHOLE transitive static closure and proves the heavy modules are not in
 * it by ANY path.
 *
 * FOUR LAYERS, because a dist read alone is not enough:
 *   1. SOURCE CONTRACT (no build needed, runs every gate) — the shell mounts both
 *      bodies through lazy() and holds no static edge to either; OutputContainer
 *      mounts the shell the same way.
 *   2. SOURCE CLOSURE (the third layer) — neither body, nor the town-map model,
 *      nor the export lane appears anywhere in the shell's transitive static
 *      import graph.
 *   3. DIST ABSENCE (ungated) — no fingerprint is in the entry's transitive static
 *      closure. Per the stale-dist policy (see tests/build/vendorPdfLazy.test.js)
 *      an absence check can only UNDER-report against an old dist, so it never
 *      false-reds.
 *   4. DIST PRESENCE + SEPARATION (VERIFY_DIST=1 only) — the fingerprints exist,
 *      and each body's chunk set is disjoint from the shell's. These read the
 *      FRESH build's bytes, so they run only in the post-build re-run.
 */

import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const ROOT = process.cwd();
const distDir = resolve(ROOT, 'dist');
const assetsDir = join(distDir, 'assets');
const distExists = existsSync(distDir) && existsSync(assetsDir);
const REQUIRE_DIST = process.env.VERIFY_DIST === '1';

const SHELL_SRC = resolve(ROOT, 'src/components/townMap/MapTabShell.jsx');
const DOSSIER_SRC = resolve(ROOT, 'src/components/OutputContainer.jsx');

// Minted string literals — they survive minification, so each is a stable
// fingerprint of its module in a built chunk. Each is stamped onto its component's
// root element, so it cannot be tree-shaken out of the chunk it identifies.
//
// The town-map MODEL's established fork key (tests/build/townMapLazy.test.js) is
// deliberately NOT used as the pane's fingerprint here: that literal is minted in
// TWO modules (the model and the dossier backdrop), so it can answer "did the
// model reach first paint" but not "which chunk is the PANE in", which is the
// question the separation assertion asks.
const SHELL_SENTINEL = 'settlementforge:map-tab-shell:lazy-v1';
const PLAYER_SENTINEL = 'settlementforge:map-player-subtab:lazy-v1';
const PANE_SENTINEL = 'settlementforge:town-map-pane:lazy-v1';

const BODIES = Object.freeze([
  { module: './SettlementMapPane.jsx', fingerprint: PANE_SENTINEL, what: 'the town-map pane' },
  { module: './subtabs/MapPlayerSubTab.jsx', fingerprint: PLAYER_SENTINEL, what: 'the player-view leaf' },
]);

/** Modules the CHROME must never be able to reach without a dynamic import. */
const FORBIDDEN_IN_SHELL_CLOSURE = Object.freeze([
  'src/components/townMap/SettlementMapPane.jsx',
  'src/components/townMap/subtabs/MapPlayerSubTab.jsx',
  'src/domain/townMap/townMapModel.js',
  'src/lib/townMapExport.js',
]);

const stripComments = (code) => code
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/^\s*\/\/.*$/gm, '');

/** Every `from './x'` STATIC relative specifier in a source file. */
function sourceStaticSpecifiers(code) {
  const specs = new Set();
  for (const m of stripComments(code).matchAll(/\bfrom\s*['"](\.[^'"]+)['"]/g)) specs.add(m[1]);
  return [...specs];
}

function resolveRelative(fromFile, spec) {
  if (!spec.startsWith('.')) return null;
  const base = resolve(dirname(fromFile), spec);
  for (const candidate of [base, `${base}.js`, `${base}.jsx`, join(base, 'index.js'), join(base, 'index.jsx')]) {
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  }
  return null;
}

/** The transitive STATIC import closure of a source file, repo-relative. */
function sourceClosure(entryFile) {
  const seen = new Set([entryFile]);
  const queue = [entryFile];
  while (queue.length) {
    const file = queue.shift();
    const code = stripComments(readFileSync(file, 'utf-8'));
    const specs = new Set();
    for (const m of code.matchAll(/(?:^|[^.\w])import\s+(?:[^'"]*?\sfrom\s+)?['"]([^'"]+)['"]/g)) specs.add(m[1]);
    for (const m of code.matchAll(/(?:^|[^.\w])export\s+[^'"]*?\sfrom\s+['"]([^'"]+)['"]/g)) specs.add(m[1]);
    for (const spec of specs) {
      const resolved = resolveRelative(file, spec);
      if (resolved && !seen.has(resolved)) { seen.add(resolved); queue.push(resolved); }
    }
  }
  return [...seen].map((p) => relative(ROOT, p).replace(/\\/g, '/'));
}

function distStaticImportSpecifiers(code) {
  const specs = new Set();
  const fromRe = /\bfrom\s*["'](\.\/[^"']+\.js)["']/g;
  const bareRe = /(?:^|[;}])import\s*["'](\.\/[^"']+\.js)["']/g;
  let m;
  while ((m = fromRe.exec(code)) !== null) specs.add(m[1].replace('./', ''));
  while ((m = bareRe.exec(code)) !== null) specs.add(m[1].replace('./', ''));
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
    const code = readFileSync(join(assetsDir, file), 'utf-8');
    for (const dep of distStaticImportSpecifiers(code)) {
      if (!seen.has(dep)) { seen.add(dep); queue.push(dep); }
    }
  }
  return [...seen];
}

const chunksContaining = (literal) => readdirSync(assetsDir)
  .filter((f) => f.endsWith('.js'))
  .filter((f) => readFileSync(join(assetsDir, f), 'utf-8').includes(literal));

describe('TC-0 — the Map sub-tab bodies are lazy leaves (source contract)', () => {
  const shell = readFileSync(SHELL_SRC, 'utf-8');
  const specs = sourceStaticSpecifiers(shell);

  it('the scan is non-vacuous — the shell does hold ordinary static sibling edges', () => {
    // If this file ever stops finding the shell's real static imports, the
    // exclusion assertions below would be measuring nothing.
    expect(specs.length).toBeGreaterThan(4);
    expect(specs).toContain('../primitives/MobileTabStrip.jsx');
    expect(specs).toContain('../../lib/mapSubTabs.js');
  });

  for (const { module, what } of BODIES) {
    it(`${module} is mounted through lazy(), not a static import`, () => {
      const escaped = module.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const lazyMount = new RegExp(`lazy\\(\\s*\\(\\)\\s*=>\\s*import\\(['"]${escaped}['"]\\)\\s*\\)`);
      expect(
        lazyMount.test(stripComments(shell)),
        `MapTabShell must mount ${module} as lazy(() => import('${module}')). `
        + `A static import folds ${what} into the dossier's Map chunk, which every reader `
        + 'pays for whether or not they open that sub-tab.',
      ).toBe(true);
      expectAbsentWithAnchor(specs, module, '../primitives/MobileTabStrip.jsx', `MapTabShell static imports (${module})`);
    });
  }

  it('the dossier mounts the SHELL itself through lazy(), so the chrome is off first paint too', () => {
    const dossier = stripComments(readFileSync(DOSSIER_SRC, 'utf-8'));
    expect(dossier).toMatch(
      /lazy\(\s*\(\)\s*=>\s*import\(['"]\.\/townMap\/MapTabShell\.jsx['"]\)\s*\)/,
    );
    const dossierSpecs = sourceStaticSpecifiers(dossier);
    expectAbsentWithAnchor(
      dossierSpecs, './townMap/MapTabShell.jsx', './dossier/DossierTabStrip.jsx',
      'OutputContainer static imports (MapTabShell)',
    );
  });

  it('each fingerprint is minted in exactly one source module', () => {
    // Anti-vacuity for the dist halves: a fingerprint that drifted out of the
    // source, or leaked into a second module, would make them meaningless.
    const files = [];
    const walk = (dir) => {
      for (const entry of readdirSync(dir)) {
        const p = join(dir, entry);
        if (statSync(p).isDirectory()) walk(p);
        else if (/\.(js|jsx)$/.test(entry)) files.push(p);
      }
    };
    walk(resolve(ROOT, 'src'));
    for (const fingerprint of [SHELL_SENTINEL, PLAYER_SENTINEL, PANE_SENTINEL]) {
      const hits = files.filter((f) => readFileSync(f, 'utf-8').includes(fingerprint));
      expect(hits.map((f) => relative(ROOT, f)), `the fingerprint "${fingerprint}"`).toHaveLength(1);
    }
  });
});

describe('TC-0 — THE THIRD LAYER: the chrome cannot reach a body by ANY static path', () => {
  const closure = sourceClosure(SHELL_SRC);

  it('the closure walk is non-vacuous', () => {
    // A resolver that silently resolved nothing would make every exclusion below
    // trivially true. Anchor it on two modules the shell genuinely imports.
    expect(closure.length).toBeGreaterThan(20);
    expect(closure).toContain('src/lib/mapSubTabs.js');
    expect(closure).toContain('src/components/primitives/MobileTabStrip.jsx');
  });

  for (const forbidden of FORBIDDEN_IN_SHELL_CLOSURE) {
    it(`${forbidden} is absent from the shell's transitive static closure`, () => {
      // A one-hop check is satisfiable through an innocent intermediary; this is
      // the whole graph. Anchored by a live sibling that travels the same walk.
      expectAbsentWithAnchor(
        closure, forbidden, 'src/lib/mapSubTabs.js',
        "MapTabShell transitive static closure",
      );
    });
  }
});

describe.runIf(distExists)('TC-0 — the Map sub-tab bodies are lazy leaves (dist)', () => {
  for (const { module, fingerprint, what } of BODIES) {
    it(`${what} is ABSENT from the entry transitive static closure`, () => {
      const leaked = entryStaticClosure()
        .filter((f) => readFileSync(join(assetsDir, f), 'utf-8').includes(fingerprint));
      expect(
        leaked,
        `${what} reached first paint via the static graph (chunks: ${leaked.join(', ')}). `
        + `It must stay behind the lazy() seam for ${module} in MapTabShell.jsx.`,
      ).toHaveLength(0);
    });
  }

  it('the SHELL itself is absent from the entry transitive static closure', () => {
    const leaked = entryStaticClosure()
      .filter((f) => readFileSync(join(assetsDir, f), 'utf-8').includes(SHELL_SENTINEL));
    expect(leaked, `the Map sub-tab shell reached first paint (chunks: ${leaked.join(', ')})`).toHaveLength(0);
  });

  it.skipIf(!REQUIRE_DIST)('anti-vacuity — every fingerprint DOES exist in a lazy chunk', () => {
    for (const fingerprint of [SHELL_SENTINEL, PLAYER_SENTINEL, PANE_SENTINEL]) {
      expect(
        chunksContaining(fingerprint).length,
        `the fingerprint "${fingerprint}" is in NO dist chunk — did the module change or the build skip it?`,
      ).toBeGreaterThan(0);
    }
  });

  for (const { module, fingerprint, what } of BODIES) {
    it.skipIf(!REQUIRE_DIST)(`THE SECOND ASSERTION — ${what} rides its OWN chunk, not the shell's`, () => {
      // The shell's parent is itself lazy, so the entry-closure checks above
      // cannot tell a lazy child from a static one. Chunk separation can.
      const bodyChunks = new Set(chunksContaining(fingerprint));
      const shellChunks = new Set(chunksContaining(SHELL_SENTINEL));
      expect(bodyChunks.size, `${module} fingerprint missing from dist`).toBeGreaterThan(0);
      expect(shellChunks.size, 'Map sub-tab shell fingerprint missing from dist').toBeGreaterThan(0);
      const shared = [...bodyChunks].filter((f) => shellChunks.has(f));
      expect(
        shared,
        `${what} was folded into the Map sub-tab shell's chunk (${shared.join(', ')}) — `
        + `the lazy() seam for ${module} in MapTabShell.jsx was replaced by a static import.`,
      ).toHaveLength(0);
    });
  }
});
