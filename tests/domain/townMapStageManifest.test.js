/**
 * townMapStageManifest.test.js — MF-T2J · the S0–S23 stage manifest AS A PUBLISHED ARTIFACT.
 *
 * The companion walker (`tests/lint/townMapStageManifest.walker.test.js`) checks the record
 * against THIS TREE'S source. This file checks the record against ITSELF: every projection the
 * manifest publishes — the topological order, the backward edges, the foundation closure, the
 * namespace-collision roster and the strongly-connected component — is re-derived here by an
 * independently written implementation and must agree.
 *
 * ⛔⛔ **THE HEADLINE RESULT LIVES IN TEST 2 AND TRAVELS WITH THE MEMBER.** The module import
 * graph is acyclic; collapse it onto the public stage ids and ONE strongly-connected component
 * appears, spanning `S2 · S3 · S4 · S6 · S13`, closed by exactly two named module imports. The
 * port PRESERVES that component as published data. It is W4's work to remove it, and a later
 * "cleanup" that deletes an inversion, renames a member or empties the roster reds here against a
 * Tarjan run this file writes rather than reads.
 */
import { describe, expect, test } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  GENERATION_MANIFEST, GENERATION_NODES, MANIFEST_ABSENT_FIELDS, NODE_EDGES, NON_STAGE_NODES,
  PUBLIC_ORDER_INVERSIONS, STAGE_GRAPH_SCC, STAGE_IDS, UNBUILT_STAGES, FOUNDATION_NODE,
  acyclicEdges, backwardEdges, foundationOutboundEdges, manifestModules, namespaceCollisions,
  nodeOfModule, stageOrderIndex, topologicalNodeIds,
} from '../../src/domain/townMap/fabric/stageManifest.js';
import { COORDINATE_ABI_VERSION } from '../../src/domain/townMap/fabric/coordinateAbi.js';

const LEAF_PATH = join(dirname(fileURLToPath(import.meta.url)),
  '../../src/domain/townMap/fabric/stageManifest.js');

/**
 * The nondeterminism vocabulary, carried verbatim from MF-T2B's companion so every fabric leaf is
 * judged by one standard.
 */
const NONDETERMINISM_TOKENS = Object.freeze([
  'Date', 'Math.random', 'Intl', 'toLocale', 'performance', 'crypto',
]);

/**
 * TARJAN over the node graph — the STAGE-level question, one collapse above the file-level one.
 * Written here rather than imported, so the component the manifest PUBLISHES is compared against
 * a component this file COMPUTES. A pin that asked the manifest to confirm its own field would be
 * the self-referential vacuity the family forbids.
 * @param {readonly string[]} edgeList @returns {string[][]}
 */
function sccOf(edgeList) {
  const ids = GENERATION_NODES.map((n) => n.nodeId).sort();
  /** @type {Map<string, Set<string>>} */
  const out = new Map(ids.map((i) => [i, /** @type {Set<string>} */ (new Set())]));
  for (const e of edgeList) { const [a, b] = e.split('>'); const s = out.get(a); if (s) s.add(b); }
  /** @type {Map<string, number>} */ const idx = new Map();
  /** @type {Map<string, number>} */ const low = new Map();
  /** @type {Set<string>} */ const on = new Set();
  /** @type {string[]} */ const st = [];
  let c = 0;
  /** @type {string[][]} */ const comps = [];
  /** @param {string} v */
  const strong = (v) => {
    idx.set(v, c); low.set(v, c); c += 1; st.push(v); on.add(v);
    for (const w of [...(out.get(v) ?? [])].sort()) {
      if (!idx.has(w)) { strong(w); low.set(v, Math.min(low.get(v) ?? 0, low.get(w) ?? 0)); }
      else if (on.has(w)) low.set(v, Math.min(low.get(v) ?? 0, idx.get(w) ?? 0));
    }
    if (low.get(v) === idx.get(v)) {
      /** @type {string[]} */ const comp = [];
      for (;;) { const w = /** @type {string} */ (st.pop()); on.delete(w); comp.push(w); if (w === v) break; }
      comps.push(comp.sort());
    }
  };
  for (const v of ids) if (!idx.has(v)) strong(v);
  return comps.filter((x) => x.length > 1 || (out.get(x[0]) ?? new Set()).has(x[0]))
    .sort((a, b) => (a.join() < b.join() ? -1 : 1));
}

describe('MF-T2J the S0-S23 stage manifest as a published artifact', () => {
  test('guard-the-guard: the artifact is frozen, closed over its own vocabularies, joined to this tree live ABI, and pure', () => {
    // ⭐ THE FAMILY'S OPENING ARM (preamble §P6). Every equality below is over a projection of
    // this record; if the record emptied or thawed, they would agree on nothing.
    expect(Object.isFrozen(GENERATION_MANIFEST)).toBe(true);
    expect(GENERATION_NODES.every((n) => Object.isFrozen(n))).toBe(true);
    expect(Object.isFrozen(STAGE_IDS)).toBe(true);
    expect(STAGE_IDS.length).toBe(24);
    expect(new Set(STAGE_IDS).size).toBe(24);
    expect(manifestModules().length).toBe(54);
    expect(new Set(manifestModules()).size).toBe(54);

    // THE STAMPED STRINGS, PINNED AS LITERALS. Preamble §P7.4 makes a version string moving as a
    // SIDE EFFECT a STOP; these arrive with the sealed record's own values and are frozen here so
    // a later member has to move them ON PURPOSE.
    expect(GENERATION_MANIFEST.artifactKind).toBe('GENERATION_MANIFEST');
    expect(GENERATION_MANIFEST.schemaVersion).toBe(1);
    expect(GENERATION_MANIFEST.lawVersion).toBe('mf-d1-sandbox-stage-manifest-v1');

    // THE ONE FIELD READ FROM LIVE CODE RATHER THAN FROM THE RECORD — the join to this tree.
    expect(GENERATION_MANIFEST.coordinateAbiVersion).toBe(COORDINATE_ABI_VERSION);
    expect(COORDINATE_ABI_VERSION).toBe(1);

    // THE VOCABULARIES ARE MUTUALLY CLOSED: every non-stage node owns a node row, every node id is
    // a public stage or a declared non-stage node, and no unbuilt stage owns one.
    const ids = GENERATION_NODES.map((n) => n.nodeId);
    for (const nonStage of NON_STAGE_NODES) expect(ids).toContain(nonStage);
    for (const id of ids) expect([...STAGE_IDS, ...NON_STAGE_NODES]).toContain(id);
    for (const s of UNBUILT_STAGES) expect(STAGE_IDS).toContain(s);

    // ⭐ ABSENT-NOT-STUBBED, DRIVEN RATHER THAN ASSERTED (§10.14). The eleven fields the plan era
    // cannot honestly carry are NAMED, and none of them is present on the artifact — a stub
    // carrying `ALWAYS_ACTIVE` would satisfy a reader and lie to it.
    expect(MANIFEST_ABSENT_FIELDS.length).toBe(11);
    const present = Object.keys(GENERATION_MANIFEST);
    expect(MANIFEST_ABSENT_FIELDS.filter((f) => present.includes(f))).toEqual([]);
    // …and the filter is shown convicting, so the empty list above is absence and not a dead scan
    expect(MANIFEST_ABSENT_FIELDS.filter((f) => [...present, 'gate'].includes(f))).toEqual(['gate']);

    // ⭐ PURITY, WITH THE POSITIVE CONTROL ASSERTED BEFORE THE ABSENCE. The scan is over raw text,
    // so prose counts; the leaf names the forbidden vocabulary nowhere, including in its own
    // purity declaration, which is why that line is spelled in words rather than in tokens.
    const leaf = readFileSync(LEAF_PATH, 'utf8');
    expect(leaf.length).toBeGreaterThan(2000);
    const planted = `${leaf}\nconst stamped = ${'Date'}.now();`;
    expect(NONDETERMINISM_TOKENS.filter((t) => planted.includes(t))).toEqual(['Date']);
    const reachable = NONDETERMINISM_TOKENS.filter((t) => leaf.includes(t));
    expect(reachable, `a nondeterminism token is reachable from the manifest leaf: ${reachable.join(', ')}`)
      .toEqual([]);
    expect(leaf.includes('PURITY: ')).toBe(true);
  });

  test('THE STAGE GRAPH CARRIES EXACTLY ONE STRONGLY-CONNECTED COMPONENT, and the two declared inversions are its complete and MINIMAL feedback edge set', () => {
    // ⭐ GUARD-THE-GUARD ON TARJAN ITSELF, FIRST. A `sccOf` that returned [] for everything would
    // make every assertion below pass while proving nothing at all.
    expect(sccOf(['S2>S3', 'S3>S2'])).toEqual([['S2', 'S3']]);
    expect(sccOf(['S2>S3', 'S3>S4'])).toEqual([]);

    // ── THE FINDING, PINNED. The component EXISTS, there is exactly ONE, and its membership is a
    //    literal so a member renamed out of the roster reds rather than being absorbed.
    const found = sccOf(NODE_EDGES);
    expect(found.length).toBe(1);
    expect(found).toEqual([['S13', 'S2', 'S3', 'S4', 'S6']]);
    expect(STAGE_GRAPH_SCC.length).toBe(1);
    expect(STAGE_GRAPH_SCC.map((s) => [...s.members])).toEqual(found);
    expect([...STAGE_GRAPH_SCC[0].closedBy]).toEqual(['S13>S6', 'S6>S2']);

    // ── AND THE HONEST CONSEQUENCE: the RAW stage graph has no topological order, and the module
    //    says so by returning null rather than by throwing or by inventing one.
    expect(topologicalNodeIds(NODE_EDGES)).toBe(null);

    // ── THE FEEDBACK SET IS COMPLETE: cut exactly the two declared inversions and nothing else,
    //    and the collapse is a DAG with a unique total order.
    expect([...STAGE_GRAPH_SCC[0].closedBy].sort()).toEqual(backwardEdges());
    expect(sccOf(acyclicEdges())).toEqual([]);
    expect(acyclicEdges().length).toBe(NODE_EDGES.length - 2);

    // ── ⭐⭐ AND IT IS MINIMAL, WHICH THE SEALED RECORD DOES NOT PUBLISH AND THIS MEMBER MEASURED.
    //    Neither inversion is redundant: cutting ONE leaves a SMALLER but still cyclic collapse,
    //    and the two residues are different components. So the roster cannot be trimmed to one
    //    edge and still explain the cycle, and each written reason is load-bearing.
    expect(sccOf(NODE_EDGES.filter((e) => e !== 'S6>S2'))).toEqual([['S13', 'S6']]);
    expect(sccOf(NODE_EDGES.filter((e) => e !== 'S13>S6'))).toEqual([['S2', 'S3', 'S4', 'S6']]);
    for (const inv of PUBLIC_ORDER_INVERSIONS) {
      const residue = sccOf(NODE_EDGES.filter((e) => e !== inv.edge));
      expect(residue.length, `cutting ${inv.edge} alone already leaves a DAG — the roster is not minimal`).toBe(1);
      expect(residue, `cutting ${inv.edge} alone reproduces the published roster — the other edge does nothing`)
        .not.toEqual(STAGE_GRAPH_SCC.map((s) => [...s.members]));
    }

    // ── THE "CLEANUP" THIS PIN EXISTS TO REFUSE, DRIVEN. Delete an inversion from the record and
    //    leave the component roster as published, and the two disagree by name.
    const cleaned = sccOf(NODE_EDGES.filter((e) => e !== 'S6>S2'));
    expect(cleaned.flat()).toEqual(['S13', 'S6']);
    expect(STAGE_GRAPH_SCC[0].members.filter((m) => !cleaned.flat().includes(m)))
      .toEqual(['S2', 'S3', 'S4']);
  });

  test('every published projection is a pure function of the record — the inversions join the node table, the order respects every acyclic edge, the foundation closure is empty and the collisions are enumerated', () => {
    // ── THE INVERSIONS JOIN THE NODE TABLE, WHICH IS STRONGER THAN A TEXT SCAN AND IS WHAT THIS
    //    TREE CAN ACTUALLY CHECK. The sealed walker read each importer's source; `relief.js` and
    //    `districtPartition.js` are not in this tree, so the port asks the record instead: the
    //    declared importer must really belong to the CONSUMER stage and the declared imported
    //    module to the PRODUCER stage, or the edge is fiction.
    expect(PUBLIC_ORDER_INVERSIONS.length).toBe(2);
    for (const inv of PUBLIC_ORDER_INVERSIONS) {
      const [producer, consumer] = inv.edge.split('>');
      expect(nodeOfModule(inv.importer), `${inv.importer} does not belong to ${consumer}`).toBe(consumer);
      expect(nodeOfModule(inv.imported), `${inv.imported} does not belong to ${producer}`).toBe(producer);
      expect(NODE_EDGES).toContain(inv.edge);
      expect(inv.reason.length, 'an inversion without a written reason is a parked cycle').toBeGreaterThan(60);
      expect(stageOrderIndex(producer)).toBeGreaterThan(stageOrderIndex(consumer));
    }
    expect(backwardEdges()).toEqual(['S13>S6', 'S6>S2']);
    // ⚠ AND THE CONDITION THAT MAKES `backwardEdges` STRICTNESS UNOBSERVABLE IS PINNED RATHER
    //   THAN LEFT AS LUCK. `stageOrderIndex` is injective over the 23 node ids and the record
    //   carries no self-edge, so `>` and `>=` cannot disagree here — a mutant flipping them is
    //   EQUIVALENT, which this member measured rather than assumed. If a self-edge ever arrives
    //   the two spellings part company, and this arm is where that shows.
    expect(NODE_EDGES.filter((e) => { const [a, b] = e.split('>'); return a === b; })).toEqual([]);
    expect(new Set(GENERATION_NODES.map((n) => stageOrderIndex(n.nodeId))).size).toBe(GENERATION_NODES.length);

    // ── THE ORDER IS A PURE FUNCTION OF THE EDGE SET, AND IT IS A REAL ORDER. Every acyclic edge
    //    must place its producer before its consumer — a permutation that merely has the right
    //    length would satisfy a uniqueness check and still be wrong.
    const order = topologicalNodeIds();
    expect(order).not.toBe(null);
    const seq = /** @type {string[]} */ (order);
    expect(seq.length).toBe(GENERATION_NODES.length);
    expect(new Set(seq).size).toBe(seq.length);
    expect(topologicalNodeIds()).toEqual(seq);
    const misordered = acyclicEdges().filter((e) => {
      const [a, b] = e.split('>');
      return seq.indexOf(a) > seq.indexOf(b);
    });
    expect(misordered, 'the derived order violates an edge it was derived from').toEqual([]);
    expect(seq[0]).toBe('PRIMITIVES');
    expect(seq[seq.length - 1]).toBe(FOUNDATION_NODE);

    // ── THE FOUNDATION CLOSURE, AS A PROPERTY OF THE RECORD. In the measured tree nothing reads
    //    a foundation, and the projection says so; the plant proves the projection can speak.
    expect(foundationOutboundEdges()).toEqual([]);
    expect(NODE_EDGES.filter((e) => e.endsWith(`>${FOUNDATION_NODE}`))).toEqual(
      ['PRIMITIVES>FOUNDATIONS', 'S0>FOUNDATIONS'],
    );
    expect([...NODE_EDGES, `${FOUNDATION_NODE}>S23`].filter((e) => e.split('>')[0] === FOUNDATION_NODE))
      .toEqual([`${FOUNDATION_NODE}>S23`]);

    // ── THE UNBUILT ROSTER OWNS NO NODE, AND NO OTHER PUBLIC STAGE IS SILENTLY EMPTY.
    const withModules = new Set(GENERATION_NODES.map((n) => n.nodeId));
    for (const s of UNBUILT_STAGES) expect(withModules.has(s), `${s} is declared unbuilt but owns a node`).toBe(false);
    expect(STAGE_IDS.filter((s) => !withModules.has(s) && !UNBUILT_STAGES.includes(s)),
      'a public stage owns no module and is not on the UNBUILT roster').toEqual([]);
    expect([...UNBUILT_STAGES]).toEqual(['S1', 'S8', 'S9', 'S12']);

    // ── THE CROSS-STAGE NAMESPACE COLLISIONS ARE ENUMERATED, NOT SILENT. Eight key spellings are
    //    claimed by more than one stage — measured, not feared. Freezing the set means a NINTH
    //    cannot arrive quietly and a disappearance cannot go unbanked either.
    const clashes = namespaceCollisions();
    expect(clashes.map((c) => c.namespace)).toEqual(['*|*', '*|d', '*|g', '*|h', '*|s', '*|t', '*|tone', '*|w']);
    expect(clashes.find((c) => c.namespace === '*|w')?.nodes).toEqual(['S10', 'S15', 'S22']);
    expect(clashes.every((c) => c.nodes.length >= 2)).toBe(true);
    // ⚠ AND THE SAME-NODE HALF OF THAT GUARD IS UNREACHABLE OVER THIS RECORD — measured, not
    //   assumed, and pinned so it stays a stated property. `namespaceCollisions` tests both
    //   `already owned` AND `owned by a DIFFERENT node`; no node repeats a spelling inside its
    //   own list, so the second half can never be the deciding clause and a mutant deleting it
    //   is EQUIVALENT. A node that ever did repeat one would make it live again.
    expect(GENERATION_NODES.filter((n) => new Set(n.randomNamespaces).size !== n.randomNamespaces.length)
      .map((n) => n.nodeId)).toEqual([]);
  });
});
