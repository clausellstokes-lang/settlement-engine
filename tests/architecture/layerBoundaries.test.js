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
    const ALLOWED_CYCLES = [
      ['components/compendium/CustomContent.jsx', 'components/compendium/Dependencies.jsx'],
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
