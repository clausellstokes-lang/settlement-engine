/**
 * importCycles.test.js — architecture guard against ESM import cycles in src/.
 *
 * The audit (ARCH-01) found 3 real ESM cycles, none guarded against:
 *   1. relationshipEvolution.js  ↔ relationshipHierarchy.js
 *   2. stressors → stressorGates → foodStockpile → stressors
 *   3. helpers.js ↔ priorityHelpers.js
 * Cycles risk temporal-dead-zone / undefined-export bugs at module init (a real
 * hazard with the build's onwarn-promotes-unresolved-imports rule) and make the
 * modules un-testable in isolation. eslint-plugin-import (import/no-cycle) isn't
 * installable here (its peer range lags ESLint 10, same blocker as jsx-a11y), so
 * this test IS the guard — Tarjan SCC over the real relative-import graph.
 *
 * All three are now broken. Cycles 2 and 3 fell to pure-leaf extraction
 * (stressorSeverity.js, mathHelpers.js). Cycle 1 was broken by hoisting the
 * "relationship-state core" (clamp01, RELATIONSHIP_DEFAULTS,
 * RELATIONSHIP_TYPE_ALIASES, normalizeRelationshipType, relationshipKeyFromEdge,
 * getRelationshipSettlements, relationshipRoles, normalizeRelationshipEdge,
 * ensureRelationshipState) out of relationshipEvolution.js into relationshipState.js,
 * a leaf that both relationshipEvolution and relationshipHierarchy import — verified
 * behavior-preserving against a full golden-master run.
 *
 * The guard is a RATCHET: the allowed-cycle baseline below is now EMPTY and may only
 * stay empty. Any cycle at all — including a regression of any of the three — fails
 * this test.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, posix } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

/** Known-and-accepted import cycles, as canonical sorted node-set keys. This list
 *  may only get SHORTER — and it is now EMPTY: all three audit-found cycles were
 *  broken by extracting shared leaves (stressorSeverity.js, mathHelpers.js,
 *  relationshipState.js). Any cycle at all now fails the guard. */
const ALLOWED_CYCLES = new Set([]);

function listSourceFiles() {
  const out = [];
  (function walk(dir) {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = posix.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (/\.jsx?$/.test(e.name) && !/\.test\./.test(e.name)) out.push(p);
    }
  })('src');
  return out;
}

function resolveImport(fromFile, spec) {
  let dep = posix.normalize(posix.join(posix.dirname(fromFile), spec));
  if (/\.jsx?$/.test(dep)) return dep;
  for (const ext of ['.js', '.jsx']) if (existsSync(join(ROOT, dep + ext))) return dep + ext;
  for (const idx of ['index.js', 'index.jsx']) if (existsSync(join(ROOT, dep, idx))) return posix.join(dep, idx);
  return dep;
}

function buildGraph(files) {
  const graph = new Map();
  // Matches both `import … from './x'` and re-exports `export … from './x'`.
  const re = /(?:import|export)[^;]*?from\s*['"](\.[^'"]+)['"]/g;
  for (const f of files) {
    const src = readFileSync(join(ROOT, f), 'utf8');
    const deps = new Set();
    let m;
    while ((m = re.exec(src))) {
      const d = resolveImport(f, m[1]);
      if (d !== f) deps.add(d); // a file can't meaningfully cycle with itself
    }
    graph.set(f, deps);
  }
  return graph;
}

/** Tarjan's SCC. Any strongly-connected component with >1 node is a cycle. */
function findCycles(graph) {
  let idx = 0;
  const stack = [], onStack = new Set(), low = new Map(), num = new Map(), sccs = [];
  const strongconnect = (v) => {
    num.set(v, idx); low.set(v, idx); idx++; stack.push(v); onStack.add(v);
    for (const w of graph.get(v) || []) {
      if (!num.has(w)) { if (graph.has(w)) { strongconnect(w); low.set(v, Math.min(low.get(v), low.get(w))); } }
      else if (onStack.has(w)) low.set(v, Math.min(low.get(v), num.get(w)));
    }
    if (low.get(v) === num.get(v)) {
      const comp = [];
      let w;
      do { w = stack.pop(); onStack.delete(w); comp.push(w); } while (w !== v);
      if (comp.length > 1) sccs.push(comp);
    }
  };
  for (const v of graph.keys()) if (!num.has(v)) strongconnect(v);
  return sccs.map((c) => c.slice().sort().join('|'));
}

describe('no NEW ESM import cycles in src/', () => {
  const cycles = findCycles(buildGraph(listSourceFiles()));

  it('every detected cycle is in the allowed baseline (cycles 2 & 3 stay broken)', () => {
    const unexpected = cycles.filter((c) => !ALLOWED_CYCLES.has(c));
    expect(
      unexpected,
      `New/regressed import cycle(s) detected:\n${unexpected.join('\n')}\n` +
        'Break the cycle by extracting the shared symbols into a leaf module (see stressorSeverity.js / mathHelpers.js).',
    ).toEqual([]);
  });

  it('the baseline does not contain stale entries that no longer cycle (ratchet only shrinks)', () => {
    const live = new Set(cycles);
    const stale = [...ALLOWED_CYCLES].filter((c) => !live.has(c));
    expect(stale, `ALLOWED_CYCLES lists cycles that are already fixed — delete them: ${stale.join(', ')}`).toEqual([]);
  });
});
