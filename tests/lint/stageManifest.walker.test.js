/**
 * tests/lint/stageManifest.walker.test.js — ⭐⭐⭐ MF-D1 · §287.8 / SPEC §10.14 ·
 * **THE WALKER THAT MAKES THE S0–S23 MANIFEST EXECUTABLE.**
 *
 * §287.8 orders a manifest that "CI refuses prose/source drift" over. A manifest nobody checks
 * is a prose table with a `.js` extension, and this programme has already measured what those
 * are worth twice: SPEC §1.0's stage map is a snapshot of a tree that has since moved, and
 * §10.16 says so in terms. So the rule here is one sentence:
 *
 *   ⭐⭐⭐ **THE MANIFEST DECLARES ONE THING — WHICH STAGE A MODULE SERVES — AND THIS FILE
 *   RE-DERIVES EVERYTHING ELSE FROM SOURCE AND REFUSES ANY DISAGREEMENT.**
 *
 * Nine arms, each a refusal, each with a planted counterfactual where a plant is possible:
 *   1  every module in the directory is assigned exactly once (a NEW module REDS)
 *   2  each node's `allowedImports` equals its real cross-node import set
 *   3  each node's `randomNamespaces` equals the key spellings its modules really mint
 *   4  each node's `statefulForkSites` equals its real `fabricRng(` count
 *   5  `NODE_EDGES` equals the derived cross-node edge set
 *   6  the backward edges are EXACTLY the declared `PUBLIC_ORDER_INVERSIONS`
 *   7  the stage graph's SCC roster is exactly `STAGE_GRAPH_SCC`, and cutting the declared
 *      inversions leaves a DAG with a unique order
 *   8  `UNBUILT_STAGES` own no module, and no other public stage is silently empty
 *   9  §293.3c — the stream-derivation audit's SOURCE half
 *
 * ⚠ LANDING HAZARD, INHERITED VERBATIM FROM `derivationGraph.walker.test.js`: this file parses
 * source with `acorn`, present today only as a transitive dependency of vite. THE LANDING
 * EXECUTOR OWES AN EXPLICIT devDependency, and a dependency bump is a MINT TRIGGER. If acorn is
 * absent these tests must FAIL, never skip.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Parser } from 'acorn';
import {
  GENERATION_NODES, NODE_EDGES, STAGE_IDS, UNBUILT_STAGES, PUBLIC_ORDER_INVERSIONS,
  STAGE_GRAPH_SCC, GENERATION_MANIFEST, manifestModules, nodeOfModule, topologicalNodeIds,
  acyclicEdges, backwardEdges, namespaceCollisions, FOUNDATION_NODE, foundationOutboundEdges,
} from '../../src/domain/townMap/fabric/stageManifest.js';
import { COORDINATE_ABI_VERSION } from '../../src/domain/townMap/fabric/coordinateAbi.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const FABRIC = join(HERE, '../../src/domain/townMap/fabric');

const files = () => readdirSync(FABRIC).filter((f) => f.endsWith('.js')).sort();
const read = (f) => readFileSync(join(FABRIC, f), 'utf8');
const parse = (src) => Parser.parse(src, { ecmaVersion: 2024, sourceType: 'module' });

/** A string literal or a template's shape, `*` standing for an interpolated expression. */
function litOf(n) {
  if (!n) return null;
  if (n.type === 'Literal' && typeof n.value === 'string') return n.value;
  if (n.type === 'TemplateLiteral') {
    return n.quasis.map((q, i) => q.value.cooked + (i < n.expressions.length ? '*' : '')).join('');
  }
  return null;
}

/** THE DERIVATION. Everything the manifest claims, recomputed from the given sources. */
function derive(sources) {
  const names = Object.keys(sources).sort();
  const assign = {};
  for (const f of names) assign[f] = nodeOfModule(f);
  const imports = {}, ns = {}, forks = {};
  for (const n of GENERATION_NODES) { imports[n.nodeId] = new Set(); ns[n.nodeId] = new Set(); forks[n.nodeId] = 0; }
  const edges = new Set();
  for (const f of names) {
    const node = assign[f];
    if (!node) continue;
    const ast = parse(sources[f]);
    for (const st of ast.body) {
      if (!st.source) continue;
      const v = String(st.source.value);
      if (v.startsWith('./')) {
        const target = v.slice(2);
        const to = assign[target] !== undefined ? assign[target] : nodeOfModule(target);
        if (to && to !== node) { imports[node].add(target); edges.add(`${to}>${node}`); }
      } else imports[node].add(v);
    }
    const walk = (n) => {
      if (!n || typeof n !== 'object') return;
      if (Array.isArray(n)) { for (const c of n) walk(c); return; }
      if (n.type === 'CallExpression' && n.callee && n.callee.type === 'Identifier') {
        const nm = n.callee.name;
        let t = null;
        if (nm === 'keyedRandom' || nm === 'keyedJitter' || nm === 'keyedRandomKey') t = litOf(n.arguments[2]);
        else if (nm === 'fabricRng' || nm === 'fabricForkKey') {
          t = litOf(n.arguments[1]);
          if (nm === 'fabricRng' && f !== 'fabricRng.js') forks[node] += 1;
        } else if (nm === 'hashUnit' || nm === 'hash32' || nm === 'hashInt') t = litOf(n.arguments[0]);
        if (t !== null) ns[node].add(t);
      }
      for (const k of Object.keys(n)) { if (k === 'type' || k === 'start' || k === 'end' || k === 'loc') continue; walk(n[k]); }
    };
    walk(ast);
  }
  return { assign, imports, ns, forks, edges: [...edges].sort() };
}

const realSources = () => { const o = {}; for (const f of files()) o[f] = read(f); return o; };

/** Tarjan over the node graph — the STAGE-level question, one collapse above §234.2's. */
function sccOf(edgeList) {
  const ids = GENERATION_NODES.map((n) => n.nodeId).sort();
  const out = new Map(ids.map((i) => [i, new Set()]));
  for (const e of edgeList) { const [a, b] = e.split('>'); if (out.has(a)) out.get(a).add(b); }
  const idx = new Map(), low = new Map(), on = new Set(), st = [];
  let c = 0; const comps = [];
  const strong = (v) => {
    idx.set(v, c); low.set(v, c); c++; st.push(v); on.add(v);
    for (const w of [...out.get(v)].sort()) {
      if (!idx.has(w)) { strong(w); low.set(v, Math.min(low.get(v), low.get(w))); }
      else if (on.has(w)) low.set(v, Math.min(low.get(v), idx.get(w)));
    }
    if (low.get(v) === idx.get(v)) {
      const comp = [];
      for (;;) { const w = st.pop(); on.delete(w); comp.push(w); if (w === v) break; }
      comps.push(comp.sort());
    }
  };
  for (const v of ids) if (!idx.has(v)) strong(v);
  return comps.filter((x) => x.length > 1 || out.get(x[0]).has(x[0]))
    .sort((a, b) => (a.join() < b.join() ? -1 : 1));
}

describe('§287.8 / §10.14 · the S0–S23 manifest is CHECKED against source, never trusted beside it', () => {
  it('1 · every fabric module is assigned to exactly ONE node — a new module REDS', () => {
    const onDisk = files();
    expect(manifestModules()).toEqual(onDisk);
    // and no module is claimed twice
    const seen = new Set();
    for (const n of GENERATION_NODES) for (const m of n.modules) {
      expect(seen.has(m), `${m} is claimed by more than one node`).toBe(false);
      seen.add(m);
    }
    // ⛔ NON-VACUOUS: an unassigned module is detected.
    expect(nodeOfModule('aModuleThatDoesNotExist.js')).toBe(null);
  });

  it('2 · every node\'s allowedImports EQUALS its real cross-node import set', () => {
    const d = derive(realSources());
    for (const n of GENERATION_NODES) {
      expect([...d.imports[n.nodeId]].sort(), `${n.nodeId} import drift`)
        .toEqual([...n.allowedImports].sort());
    }
  });

  it('3 · every node\'s randomNamespaces EQUALS the key spellings its modules mint', () => {
    const d = derive(realSources());
    for (const n of GENERATION_NODES) {
      expect([...d.ns[n.nodeId]].sort(), `${n.nodeId} random-namespace drift`)
        .toEqual([...n.randomNamespaces].sort());
    }
  });

  it('4 · every node\'s statefulForkSites EQUALS its real `fabricRng(` count', () => {
    const d = derive(realSources());
    let total = 0;
    for (const n of GENERATION_NODES) {
      expect(d.forks[n.nodeId], `${n.nodeId} fork-site drift`).toBe(n.statefulForkSites);
      total += n.statefulForkSites;
    }
    // ⭐ THE WHOLE-FABRIC FIGURE, PINNED WHERE IT MEANS SOMETHING: seventeen stateful streams.
    // Everything else the fabric draws is a pure string hash with no stream at all.
    expect(total).toBe(17);
  });

  it('5 · NODE_EDGES equals the derived cross-node edge set', () => {
    const d = derive(realSources());
    expect(d.edges).toEqual([...NODE_EDGES].sort());
  });

  it('6 · the backward edges are EXACTLY the declared PUBLIC_ORDER_INVERSIONS', () => {
    expect(backwardEdges()).toEqual(PUBLIC_ORDER_INVERSIONS.map((i) => i.edge).sort());
    // each inversion names a real import: the declared importer really imports the declared file
    for (const inv of PUBLIC_ORDER_INVERSIONS) {
      expect(read(inv.importer), `${inv.importer} no longer imports ${inv.imported}`)
        .toContain(`from './${inv.imported}'`);
      expect(inv.reason.length, 'an inversion without a written reason is a parked cycle')
        .toBeGreaterThan(60);
    }
  });

  it('7 · ⛔⛔ the STAGE graph carries ONE declared SCC, and cutting the two inversions leaves a DAG', () => {
    // The FILE graph is acyclic — §234.2 proves that. Collapsed onto the public stage ids it is
    // NOT, and that is the manifest's sharpest finding: the public numbering is a narrative
    // order. The roster is exact; a component this file does not name REDS.
    const found = sccOf(NODE_EDGES);
    expect(found).toEqual(STAGE_GRAPH_SCC.map((s) => [...s.members]));
    expect(topologicalNodeIds(NODE_EDGES), 'the raw stage graph is not a DAG and must say so')
      .toBe(null);
    // ⭐ AND THE TWO DECLARED INVERSIONS ARE A COMPLETE FEEDBACK EDGE SET.
    expect(sccOf(acyclicEdges())).toEqual([]);
    const order = topologicalNodeIds();
    expect(order).not.toBe(null);
    expect(order.length).toBe(GENERATION_NODES.length);
    expect(new Set(order).size).toBe(order.length);
    // the order is a pure function of the edge set, not of call order
    expect(topologicalNodeIds()).toEqual(order);
  });

  it('8 · UNBUILT_STAGES own no module, and no other public stage is silently empty', () => {
    const withModules = new Set(GENERATION_NODES.map((n) => n.nodeId));
    for (const s of UNBUILT_STAGES) expect(withModules.has(s), `${s} is declared unbuilt but owns a node`).toBe(false);
    const silent = STAGE_IDS.filter((s) => !withModules.has(s) && !UNBUILT_STAGES.includes(s));
    expect(silent, 'a public stage owns no module and is not on the UNBUILT roster').toEqual([]);
    expect(GENERATION_MANIFEST.coordinateAbiVersion).toBe(COORDINATE_ABI_VERSION);
  });

  it('9 · §293.3c · the stream-derivation audit, SOURCE half — no stage can carry a stream', () => {
    // ⭐⭐ THE PROPERTY: a stage's draws are derived FROM THE SEED AT STAGE ENTRY, so no stage can
    // be re-rolled by an upstream draw-count change. Two mechanisms exist in this fabric and the
    // source half checks both.
    const src = realSources();
    const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
    // (a) `fabricRng` is the ONLY stateful stream, and every fork takes an entity key from the
    //     settlement seed — never a counter, never a position, never a shared handle.
    for (const f of Object.keys(src)) {
      if (f === 'fabricRng.js') continue;
      const s = strip(src[f]);
      for (const m of s.matchAll(/fabricRng\(([^,]+),/g)) {
        expect(m[1].trim(), `${f}: a fork must take the settlement seed, not a stream`)
          .toMatch(/seed/i);
      }
    }
    // (b) THE HOME ITSELF HOLDS NO MODULE-LEVEL MUTABLE STATE. A counter here would couple every
    //     stream in the fabric to every other, which is the exact defect the file's own header
    //     says it exists to forbid ("THERE IS NO SHARED SEQUENTIAL STREAM").
    const home = strip(read('fabricRng.js'));
    const topLevel = home.split('\n').filter((l) => /^(let|var)\s/.test(l));
    expect(topLevel, 'fabricRng.js grew module-level mutable state — every stream is now coupled')
      .toEqual([]);
    // (c) NO STREAM HANDLE IS PUBLISHED. A `next`/`rand` handle stored on an artifact would let a
    //     later stage keep drawing from an earlier stage's stream.
    for (const f of Object.keys(src)) {
      const s = strip(src[f]);
      expect(s, `${f} publishes a live rng handle onto an artifact`).not.toMatch(/\brng\s*:\s*rng\b/);
    }
  });

  it('⭐⭐⭐ 10 · THE FOUNDATIONS HAVE NO OUTBOUND EDGE — "moves zero bytes" as a GRAPH FACT', () => {
    // This wave's entire safety argument is that nothing in the generation path imports the
    // coordinate ABI, the manifest, exact solid legality, the receipt seam or the DCEL. Written
    // in a receipt that is a promise; written here it is an edge set that a lane cannot cross
    // without reding. §10.15(4): "keep consumers on the legacy accessor until every equivalence
    // gate passes."
    expect(foundationOutboundEdges()).toEqual([]);
    const d = derive(realSources());
    expect(d.edges.filter((e) => e.startsWith(`${FOUNDATION_NODE}>`))).toEqual([]);
    // …and the node is not empty, or the arm would pass by having nothing to check
    const node = GENERATION_NODES.find((n) => n.nodeId === FOUNDATION_NODE);
    expect(node.modules.length).toBeGreaterThanOrEqual(5);
    // ⛔ NON-VACUOUS: wire a foundation into a stage and the edge appears.
    const planted = { ...realSources() };
    planted['lettering.js'] = `import * as abi from './coordinateAbi.js';\n${planted['lettering.js']}`;
    expect(derive(planted).edges).toContain(`${FOUNDATION_NODE}>S23`);
  });

  it('⛔ COUNTERFACTUAL — a NEW MODULE, a NEW IMPORT and a NEW NAMESPACE each CONVICT', () => {
    // ⚠⚠ A GUARD THAT HAS NEVER BEEN SHOWN CONVICTING IS A GUARD NOBODY HAS TESTED. Each arm
    // above is re-run over a PLANTED source map and must fail where the real one passes.
    const real = realSources();

    // (i) a new module in the directory that no node claims
    const withNew = { ...real, 'plantedStage.js': 'export const x = 1;\n' };
    expect(Object.keys(withNew).sort()).not.toEqual(manifestModules());
    expect(nodeOfModule('plantedStage.js')).toBe(null);

    // (ii) a new cross-node import inside an existing module
    const planted = { ...real };
    planted['lettering.js'] = `import { TRIG_N as pt } from './trigTable.js';\n${real['lettering.js']}`;
    const dPlanted = derive(planted);
    const dReal = derive(real);
    expect([...dReal.imports.S23].sort()).toEqual(['fabricGeometry.js']);
    expect([...dPlanted.imports.S23].sort()).toEqual(['fabricGeometry.js', 'trigTable.js']);
    expect([...dPlanted.imports.S23].sort()).not.toEqual([...dReal.imports.S23].sort());

    // (iii) a new random namespace inside an existing module
    const planted2 = { ...real };
    planted2['lettering.js'] = `${real['lettering.js']}\nexport const p = () => hashUnit('planted|ns');\n`;
    const d2 = derive(planted2);
    expect([...d2.ns.S23]).toEqual(['planted|ns']);
    expect([...dReal.ns.S23]).toEqual([]);

    // (iv) a new backward edge — a THIRD public-order inversion
    const planted3 = { ...real };
    planted3['substrate.js'] = `import * as pl from './lettering.js';\n${real['substrate.js']}`;
    const d3 = derive(planted3);
    expect(d3.edges).toContain('S23>S2');
    expect(dReal.edges).not.toContain('S23>S2');
  });

  it('⚠ the random-namespace registry\'s CROSS-STAGE COLLISIONS are enumerated, not silent', () => {
    // ⛔ EIGHT KEY SPELLINGS ARE CLAIMED BY MORE THAN ONE STAGE — measured, not feared. A
    // collision bites only when two stages also ask about the SAME entity id, which is why this
    // is an exact-count hazard row rather than a refusal: freezing it means a NINTH cannot
    // arrive quietly, and any change in either direction has to be looked at on purpose.
    const clashes = namespaceCollisions();
    expect(clashes.map((c) => c.namespace)).toEqual(
      ['*|*', '*|d', '*|g', '*|h', '*|s', '*|t', '*|tone', '*|w']);
    expect(clashes.find((c) => c.namespace === '*|w').nodes).toEqual(['S10', 'S15', 'S22']);
  });
});
