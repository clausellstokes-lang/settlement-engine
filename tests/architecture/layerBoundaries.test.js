/**
 * tests/architecture/layerBoundaries.test.js — F29: the layer map, enforced.
 *
 * ARCHITECTURE.md used to claim a "three-layer rule (respected):
 * data → generators → presentation". Reading the imports showed that was
 * aspirational: generators and domain are mutually-dependent PEER engine
 * layers (generators reuse domain vocabulary — trace, magicFilter,
 * goodsCatalog; domain reuses engine derivations — structuralValidator,
 * crossSettlementConflicts), and both build on the src/kernel determinism
 * primitives (createPRNG / rngContext), and five dependency cycles existed.
 *
 * This test pins what is ACTUALLY true and worth defending:
 *
 *  1. THE HEADLESS-ENGINE SPINE — nothing under src/kernel, src/data,
 *     src/generators or src/domain imports React, Zustand, or the store. This
 *     is the boundary that keeps the whole engine runnable in tests/scripts/
 *     servers, and it genuinely holds. A violation here is an architecture
 *     regression, full stop. (src/kernel is the lowest of these layers — the
 *     shared determinism primitives, createPRNG / rngContext, that generators
 *     and domain both build on.)
 *
 *  2. THE CYCLE BASELINE — the dependency-cycle set equals a checked-in
 *     allowlist (madge over src/). New cycles fail the gate; killing a cycle
 *     obligates shrinking the allowlist so the win is locked (same ratchet
 *     philosophy as rawButtonBaseline). The economicGenerator ↔
 *     servicesGenerator cycle died with the F30 goods-table collapse — that
 *     is why it is absent below.
 *
 * @enforced-by this file (referenced from ARCHITECTURE.md's layer map)
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { describe, expect, test } from 'vitest';

const ROOT = join(import.meta.dirname, '../..');
const SRC = join(ROOT, 'src');

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(js|jsx)$/.test(e)) out.push(p);
  }
  return out;
}

// Import specifiers that would drag UI/state machinery into the engine.
const FORBIDDEN = [
  /^react(\/|$|-dom)/,          // React and react-dom
  /^zustand(\/|$)/,             // the store library
  /(^|\/)store\//,              // src/store via any relative path
  /\/store\/index\.js$/,
];

describe('layer boundaries (F29)', () => {
  test('headless-engine spine: kernel/data/generators/domain import no React/Zustand/store', () => {
    const offenders = [];
    // src/kernel is the lowest engine layer — the shared determinism
    // primitives (seeded PRNG seam + its context). It must stay as headless
    // as data/generators/domain: nothing here may reach for React/Zustand/store.
    for (const layer of ['kernel', 'data', 'generators', 'domain']) {
      for (const file of walk(join(SRC, layer))) {
        const src = readFileSync(file, 'utf8');
        // Match both `import ... from 'x'` and `import('x')` specifiers.
        const specs = [
          ...src.matchAll(/from\s+['"]([^'"]+)['"]/g),
          ...src.matchAll(/import\(\s*['"]([^'"]+)['"]\s*\)/g),
        ].map((m) => m[1]);
        for (const spec of specs) {
          if (FORBIDDEN.some((re) => re.test(spec))) {
            offenders.push(`${relative(ROOT, file)} -> ${spec}`);
          }
        }
      }
    }
    expect(offenders, 'engine layers must stay headless (no React/Zustand/store imports)').toEqual([]);
  });

  test('headless-engine spine is TRANSITIVELY clean (no domain→lib→React/store chain)', () => {
    // The direct scan above only proves a spine file does not import React/Zustand/
    // store ITSELF. It is NOT transitive: a domain file may import a lib leaf that
    // (now or later) imports the store, and the whole engine silently loses its
    // headless guarantee through that back door (code-quality-architecture-4 found
    // six such domain→lib edges — customRegistry/entities/text — scanned by no
    // walker). This walks the FULL src import graph and asserts nothing REACHABLE
    // from a spine root (kernel/data/generators/domain), directly or transitively,
    // pulls in React/Zustand/store. Reuses the same resolver as the cycle test.
    const files = walk(SRC);
    const rel = (p) => relative(SRC, p).replace(/\\/g, '/');
    const fileSet = new Set(files.map(rel));
    const stripComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
    const resolveImport = (fromFile, spec) => {
      if (!spec.startsWith('.')) return null; // package specifiers checked directly below
      const base = resolve(dirname(fromFile), spec);
      for (const cand of [base, `${base}.js`, `${base}.jsx`, join(base, 'index.js'), join(base, 'index.jsx')]) {
        const r = relative(SRC, cand).replace(/\\/g, '/');
        if (fileSet.has(r)) return r;
      }
      return null;
    };
    // Per file: resolved intra-src edges + whether it DIRECTLY imports a forbidden
    // specifier (package like 'react' or a relative store path).
    const edgesOf = new Map();
    const dirty = new Set();
    for (const f of files) {
      const self = rel(f);
      const src = stripComments(readFileSync(f, 'utf8'));
      const specs = [
        ...src.matchAll(/from\s+['"]([^'"]+)['"]/g),
        ...src.matchAll(/import\(\s*['"]([^'"]+)['"]\s*\)/g),
        ...src.matchAll(/^\s*import\s+['"]([^'"]+)['"]/gm),
      ].map((m) => m[1]);
      if (specs.some((s) => FORBIDDEN.some((re) => re.test(s)))) dirty.add(self);
      edgesOf.set(self, [...new Set(specs.map((s) => resolveImport(f, s)).filter(Boolean))]);
    }
    // Reverse reachability from the dirty set: every ancestor of a forbidden importer
    // is "taint-reaching" (cycle-safe — a plain BFS over reversed edges).
    const reverse = new Map();
    for (const [from, tos] of edgesOf) for (const to of tos) {
      if (!reverse.has(to)) reverse.set(to, []);
      reverse.get(to).push(from);
    }
    const taintReaching = new Set(dirty);
    const queue = [...dirty];
    while (queue.length) {
      const n = queue.shift();
      for (const importer of reverse.get(n) || []) {
        if (!taintReaching.has(importer)) { taintReaching.add(importer); queue.push(importer); }
      }
    }
    // Find a witness chain root→…→forbidden for a readable failure (only on red).
    const witnessChain = (root) => {
      const path = [];
      const seen = new Set();
      const dfs = (node) => {
        if (seen.has(node)) return false;
        seen.add(node);
        path.push(node);
        if (dirty.has(node)) return true;
        for (const next of edgesOf.get(node) || []) if (taintReaching.has(next) && dfs(next)) return true;
        path.pop();
        return false;
      };
      return dfs(root) ? path.join(' → ') : root;
    };
    const spineRoots = [...fileSet].filter((r) => /^(kernel|data|generators|domain)\//.test(r));
    const offenders = spineRoots.filter((r) => taintReaching.has(r)).sort().map(witnessChain);
    expect(
      offenders,
      'a headless-engine spine file transitively reaches React/Zustand/store. Route the offending edge ' +
        'through a headless leaf: either relocate the pulled-in helper to src/kernel, or split the store/React ' +
        'part out of the lib leaf so the spine imports only the pure half.',
    ).toEqual([]);
  }, 60_000);

  test('dependency-cycle set equals the checked-in baseline (shrink-only)', () => {
    // The known, tolerated cycles (canonical form: members rotated so the
    // lexicographically-smallest file leads, edge order preserved). Killing one
    // → REMOVE it here (locks the win). Adding one → this fails, and the
    // answer is to break the cycle, not extend the list.
    // (2026-07-10, W2a-main: the pulseKernel port's worldPulse restructure broke
    // both worldPulse cycles — foodStockpile>stressors>stressorGates and
    // relationshipEvolution>relationshipHierarchy — locked here, 4 → 2.)
    // (2026-07-10, W2b: the causalState port would have closed a NEW
    // causalState>deityEffects>magicProfile cycle by importing
    // DEITY_RANK_AUTHORITY via display/deityEffects.js; refused — the constant
    // moved to the dependency-free leaf domain/deityConstants.js, causalState
    // imports the leaf, deityEffects re-exports it, and the baseline stays at 2.)
    // Each allowed cycle as its MEMBER SET (order-invariant — an SCC is a set,
    // not an ordered walk). Killing a cycle → REMOVE its entry here (locks the
    // win). Adding one → this fails, and the answer is to break the cycle, not
    // extend the list.
    // (Fold-in reconciliation 2026-07-16: RF's SCC machinery adopted; W6's
    // ratchet-down honored — the CustomContent <> Dependencies cycle was broken
    // on the merge lineage, entry removed, shrink-only resumes.)
    const ALLOWED_CYCLES = [
      ['generators/helpers.js', 'generators/priorityHelpers.js'],
    ];

    // Self-contained deterministic import graph (no dependency on madge):
    // resolve relative imports within src/.
    const files = walk(SRC).sort();
    const rel = (p) => relative(SRC, p).replace(/\\/g, '/');
    const fileSet = new Set(files.map(rel));
    const resolveImport = (fromFile, spec) => {
      if (!spec.startsWith('.')) return null; // packages are out of scope
      const base = resolve(dirname(fromFile), spec);
      for (const cand of [base, `${base}.js`, `${base}.jsx`, join(base, 'index.js'), join(base, 'index.jsx')]) {
        const r = relative(SRC, cand).replace(/\\/g, '/');
        if (fileSet.has(r)) return r;
      }
      return null; // unresolved (a package, or a path we don't map) — no edge
    };
    // Strip comments before scanning — JSDoc headers quote import examples
    // ("import { random } from './prng.js'") that a raw regex would read as
    // real self-edges. Crude but sufficient: template literals containing
    // comment-like text would only ADD edges, never hide one.
    const stripComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
    const graph = new Map();
    for (const f of files) {
      const src = stripComments(readFileSync(f, 'utf8'));
      const specs = [
        ...src.matchAll(/from\s+['"]([^'"]+)['"]/g),
        ...src.matchAll(/import\(\s*['"]([^'"]+)['"]\s*\)/g),
        ...src.matchAll(/^\s*import\s+['"]([^'"]+)['"]/gm),
      ].map((m) => m[1]);
      const self = rel(f);
      const edges = [...new Set(specs.map((s) => resolveImport(f, s)).filter(Boolean))]
        .filter((e) => e !== self) // a self-edge is never a real cycle
        .sort();
      graph.set(self, edges);
    }

    // Tarjan's strongly-connected-components. This REPLACES a back-edge DFS that
    // recorded a cycle only at the first back edge it happened to walk, and could
    // MISS a new cycle threading through an already-FINISHED (state===2) node —
    // so enforcement silently depended on the lexicographic DFS visitation order
    // (tests-estate-1). SCCs are order-invariant: a directed cycle is EXACTLY a
    // strongly-connected component of size > 1 (self-edges are already filtered
    // out above, so a singleton SCC is always acyclic). Every SCC is therefore
    // either a singleton (fine) or must equal one of the allowed cycles' member
    // sets. Recursive, in sorted node order for a deterministic component listing
    // (the graph is a few hundred files — well within the call stack).
    const index = new Map();
    const low = new Map();
    const onStack = new Set();
    const sccStack = [];
    const sccs = [];
    let counter = 0;
    const strongconnect = (v) => {
      index.set(v, counter);
      low.set(v, counter);
      counter += 1;
      sccStack.push(v);
      onStack.add(v);
      for (const w of graph.get(v) || []) {
        if (!index.has(w)) {
          strongconnect(w);
          low.set(v, Math.min(low.get(v), low.get(w)));
        } else if (onStack.has(w)) {
          low.set(v, Math.min(low.get(v), index.get(w)));
        }
      }
      if (low.get(v) === index.get(v)) {
        const comp = [];
        let w;
        do { w = sccStack.pop(); onStack.delete(w); comp.push(w); } while (w !== v);
        sccs.push(comp);
      }
    };
    for (const node of [...graph.keys()].sort()) if (!index.has(node)) strongconnect(node);

    // Canonicalize a member collection to an order-invariant key.
    const canonicalSet = (members) => [...members].sort().join(' | ');
    const cyclicSccs = sccs.filter((c) => c.length > 1).map(canonicalSet).sort();
    const allowedSets = ALLOWED_CYCLES.map(canonicalSet).sort();

    // Exact-set equality (shrink-only, both directions): a NEW cyclic SCC fails
    // (break the cycle, don't extend the list); a KILLED cycle also fails until
    // its allowlist entry is removed (the win must be locked).
    expect(
      cyclicSccs,
      'the set of import cycles (strongly-connected components of size > 1) drifted from the allowlist. ' +
        'A new cycle → break it (route the offending import through a dependency-free leaf, the deityConstants.js ' +
        'pattern). A killed cycle → delete its row from ALLOWED_CYCLES to lock the win. Never extend the list to pass.',
    ).toEqual(allowedSets);
  }, 60_000);
});

// ── 3. THE PRINT SURFACE'S BOUNDARY ────────────────────────────────────────────
/**
 * THE RULE, AND THE TWO DEFECTS THAT PROVED IT WAS UNGATED (2026-09-19).
 *
 * `src/pdf` is the PAID DOCUMENT. It renders in its own worker, off its own theme, in
 * @react-pdf primitives that are not DOM elements — so it may NEVER import `src/components`
 * (a screen tree of React DOM + the screen type scale) or `src/store` (Zustand state the
 * document must not depend on). The estate had stated that rule in prose for months —
 * `domain/display/labelCase.js` is a whole module cut to honour it — and this file, the
 * layer-map enforcer, DID NOT MENTION `src/pdf` AT ALL. Two crossings landed in the gap:
 *
 *   1. `sections/DefenseSecurity.jsx` imported `statusCase` from
 *      `components/new/labelLadder.js` ON TOP OF the same symbol from
 *      `domain/display/labelCase.js`. esbuild refused the module — "the symbol statusCase
 *      has already been declared" — so two PDF suites reported "(0 test)" and the
 *      prose-numerics scanner SKIPPED the file entirely, walking 222 rows against a
 *      225-row baseline while reading green on its count.
 *   2. `sections/Relationships.jsx` imported the relationship palette from
 *      `components/settlements/relationshipColors.js` — a module whose own header names
 *      the PDF as one of its readers, which is exactly why it belonged one layer down.
 *      It has been moved to `domain/display/relationshipColors.js` and all seven
 *      importers repointed.
 *
 * Both are cured, so this arm is written at EXACT ZERO with no allowlist: there is no debt
 * to burn down, and a row here would be a place for the third one to hide.
 */
const PDF_FORBIDDEN_TREES = Object.freeze(['components', 'store']);

/**
 * The src/ trees `src/pdf` may reach, each with the reason it is lawful. This is a CENSUS,
 * not a permission slip: a NEW tree appearing here reds and must be ruled, rather than being
 * absorbed because it happened to compile.
 */
const PDF_ALLOWED_TREES = Object.freeze({
  pdf:    'its own tree',
  domain: 'the headless read-models and display leaves both surfaces share',
  lib:    'headless helpers (flags, proseSeams, entities, entityRefTokenizer)',
  // ⛔ `copy` IS DELIBERATELY ABSENT, and the arm below is why. The rule as handed down
  // named src/copy among the permitted trees; the MEASUREMENT says src/pdf never reaches
  // it — the document's strings are authored in its own sections. Banking a permission the
  // tree does not use would be a door left open onto an empty room, so it is not banked.
  // If the PDF ever does read src/copy, that is a one-line addition with a reason.
  data:   'engine data tables — supplyChainData\'s chain definitions',
  design: 'the shared token + ornament tree the PDF theme derives from (logo, emblemPaths, tokens)',
});

describe('the print surface may not reach into the screen (src/pdf boundary)', () => {
  /** Every relative import in src/pdf, resolved to the src/ tree it lands in. */
  function pdfCrossings() {
    const out = [];
    for (const file of walk(join(SRC, 'pdf'))) {
      const src = readFileSync(file, 'utf8');
      const specs = [
        ...src.matchAll(/from\s+['"]([^'"]+)['"]/g),
        ...src.matchAll(/import\(\s*['"]([^'"]+)['"]\s*\)/g),
      ].map((m) => m[1]).filter((s) => s.startsWith('.'));
      for (const spec of specs) {
        const target = resolve(dirname(file), spec);
        if (!target.startsWith(SRC)) { out.push({ file: relative(ROOT, file), spec, tree: '(outside src)' }); continue; }
        out.push({ file: relative(ROOT, file), spec, tree: relative(SRC, target).split(/[\\/]/)[0] });
      }
    }
    return out;
  }

  test('src/pdf imports NOTHING from src/components or src/store', () => {
    const offenders = pdfCrossings()
      .filter((c) => PDF_FORBIDDEN_TREES.includes(c.tree))
      .map((c) => `${c.file} -> ${c.spec}`);
    expect(
      offenders,
      'the paid document renders in its own worker off its own theme, and may not reach into the '
      + 'screen tree or the store. Bring the PURE part DOWN to domain/display (the labelCase.js and '
      + 'relationshipColors.js precedent) and import it from there — never widen this arm.',
    ).toEqual([]);
  });

  test('src/pdf reaches only the censused trees — a new one must be ruled, not absorbed', () => {
    const seen = [...new Set(pdfCrossings().map((c) => c.tree))].sort();
    const unruled = seen.filter((t) => !Object.prototype.hasOwnProperty.call(PDF_ALLOWED_TREES, t));
    expect(unruled, `src/pdf reached an unruled tree: ${unruled.join(', ')}`).toEqual([]);
  });

  test('every censused tree is REALLY reached — no stale permission', () => {
    const seen = new Set(pdfCrossings().map((c) => c.tree));
    const stale = Object.keys(PDF_ALLOWED_TREES).filter((t) => !seen.has(t));
    // A permission whose import has gone is a door left open onto an empty room.
    expect(stale, `censused but unreached: ${stale.join(', ')}`).toEqual([]);
  });

  test('THE POSITIVE ANCHOR: the scan can see a real import, so zero means zero', () => {
    // ⛔ WITHOUT THIS the two arms above pass just as happily against a resolver that
    // returned nothing at all — the vacuous green this estate has been bitten by.
    const crossings = pdfCrossings();
    expect(crossings.length).toBeGreaterThan(200);
    const anchored = crossings.filter(
      (c) => c.file === 'src/pdf/sections/Relationships.jsx' && c.spec.endsWith('relationshipColors.js'),
    );
    expect(anchored, 'the moved palette must still be imported, and from domain/').toHaveLength(1);
    expect(anchored[0].tree).toBe('domain');
    // And the sibling that started this: the shared case ladder, read from domain/display.
    expect(crossings.some((c) => c.spec.endsWith('domain/display/labelCase.js'))).toBe(true);
  });

  test('the forbidden trees are REAL trees, so the prohibition is not a typo', () => {
    // A misspelled tree name would make the first arm unfalsifiable forever.
    for (const tree of PDF_FORBIDDEN_TREES) {
      expect(statSync(join(SRC, tree)).isDirectory(), tree).toBe(true);
    }
  });
});
