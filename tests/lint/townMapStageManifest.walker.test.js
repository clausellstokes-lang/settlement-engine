/**
 * townMapStageManifest.walker.test.js — ⭐⭐⭐ THE WALKER THAT MAKES THE S0–S23 MANIFEST
 * EXECUTABLE IN *THIS* TREE (D3a, MF-T2J; §287.8 / SPEC §10.14).
 *
 * §287.8 orders a manifest that "CI refuses prose/source drift". A manifest nobody checks is a
 * prose table with a `.js` extension, and this programme has measured what those are worth twice:
 * SPEC §1.0's stage map is a snapshot of a tree that has since moved, and §10.16 says so in terms.
 *
 * ⛔⛔ **WHAT IS DIFFERENT HERE, AND IT CHANGES WHAT THIS FILE CAN HONESTLY ASSERT.** In the
 * sealed sandbox the manifest declared ONE datum — which stage a module serves — and its walker
 * re-derived every other field from the 54-module sandbox fabric. This tree holds the codex slice
 * plus the D3a port so far; 49 of those 54 modules are not here. So the record is carried as
 * PUBLISHED DATA and this file checks the two directions that are real:
 *
 *   • THE ACCOUNTING (test 2) — every `.js` under the fabric directory is either ASSIGNED by the
 *     record or on the frozen codex roster. Exact in BOTH directions, so an arrival that claims
 *     no stage reds, and a departure cannot go unbanked either.
 *   • THE AGREEMENT (test 3) — every module that is BOTH landed AND assigned has its imports, its
 *     key spellings and its `fabricRng(` fork sites re-parsed from source with `acorn` and refused
 *     if they exceed what the record allows. That set grows with each port member, so §287.8's
 *     executable half arrives incrementally rather than being promised.
 *
 * ⚠⚠ **AND THE DENOMINATOR IS NAMED RATHER THAN ASSUMED (preamble §P2.13).** The derivation skips
 * unassigned files wholesale, so the sealed arm "FOUNDATIONS has no outbound edge" would pass here
 * for the wrong reason: four codex modules already read the coordinate ABI and the derivation
 * cannot see one of them. Test 2 therefore freezes this tree's REAL reader roster for every landed
 * foundation module. An absence measured against a denominator that does not contain the surface
 * proves nothing about it, and a new reader reds on arrival.
 *
 * ⭐ THE SCC IS NOT CHECKED HERE. It is a property of the published edge set rather than of this
 * tree's source, so it is pinned in `tests/domain/townMapStageManifest.test.js` against an
 * independently written Tarjan run.
 *
 * E-A: its removing power is proven by `scripts/mutation-sweep.sh` (label
 * "town-map/stage-manifest foundation wired into a stage" — a planted foundation import inside
 * `fabricRng.js` must red this).
 *
 * ⚠ `acorn` is an explicit devDependency of this repository (`^8.16.0`), so the sealed file's
 * landing hazard — "present today only as a transitive dependency of vite" — is already
 * discharged and no dependency is bumped. If it were absent these tests must FAIL, never skip.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Parser } from 'acorn';
import { describe, expect, test } from 'vitest';
import {
  GENERATION_NODES, NODE_EDGES, FOUNDATION_NODE, manifestModules, nodeOfModule,
} from '../../src/domain/townMap/fabric/stageManifest.js';

const FABRIC = join(dirname(fileURLToPath(import.meta.url)), '../../src/domain/townMap/fabric');

const files = () => readdirSync(FABRIC).filter((f) => f.endsWith('.js')).sort();
const read = (/** @type {string} */ f) => readFileSync(join(FABRIC, f), 'utf8');
const parse = (/** @type {string} */ s) => Parser.parse(s, { ecmaVersion: 2024, sourceType: 'module' });

/**
 * ⛔ THE CODEX-SLICE ROSTER — the fabric modules this tree owns that the sealed record never
 * measured, published as data so silence cannot be mistaken for coverage. It is EXACT in both
 * directions and it is deliberately STABLE across the whole port: a later member lands a module
 * the record already assigns, which moves the assigned side and leaves this list alone. Only a
 * brand-new non-sandbox fabric module reds here, and that is exactly the drift §10.14 refuses.
 */
const CODEX_SLICE_MODULES = Object.freeze([
  'boundaryArrangement.js', 'boundaryNoder.js', 'building.js', 'content.js', 'dcel.js',
  'dcelEmbedding.js', 'exactGeometry.js', 'exactIntersectionArea.js', 'fabricRoot.js',
  'foundation.js', 'frontage.js', 'index.js', 'massPart.js', 'massingProjection.js',
  'massingRoster.js', 'operations.js', 'parcelRegistry.js', 'projection.js',
  'settlementFoundation.js', 'shapes.js', 'streetGeometry.js', 'streetGraph.js',
]);

/**
 * ⛔⛔ THIS TREE'S REAL READERS OF EACH LANDED FOUNDATION MODULE — the denominator the derivation
 * cannot see, frozen. `coordinateAbi.js` is read by seven modules here, four of them codex-slice
 * files the record does not assign; the sealed "no outbound edge" law is true of the sandbox and
 * is NOT asserted as a live law. Exact in both directions: a new reader is a deliberate act.
 */
const FOUNDATION_READERS = Object.freeze({
  'coordinateAbi.js': Object.freeze(['dcelEmbedding.js', 'foundation.js', 'index.js',
    'massPart.js', 'solidLegality.js', 'spatialReceipt.js', 'stageManifest.js']),
  'solidLegality.js': Object.freeze([]),
  'spatialReceipt.js': Object.freeze([]),
  'stageManifest.js': Object.freeze([]),
});

/** A string literal or a template's shape, `*` standing for an interpolated expression. */
function litOf(/** @type {any} */ n) {
  if (!n) return null;
  if (n.type === 'Literal' && typeof n.value === 'string') return n.value;
  if (n.type === 'TemplateLiteral') {
    return n.quasis.map((/** @type {any} */ q, /** @type {number} */ i) => q.value.cooked + (i < n.expressions.length ? '*' : '')).join('');
  }
  return null;
}

/** Every `./x.js` specifier a source imports, as bare module names. */
function relativeTargetsOf(/** @type {string} */ source) {
  /** @type {string[]} */
  const out = [];
  for (const st of parse(source).body) {
    const src = /** @type {any} */ (st).source;
    if (!src) continue;
    const v = String(src.value);
    if (v.startsWith('./')) out.push(v.slice(2));
  }
  return out;
}

/**
 * THE DERIVATION, carried from the sealed walker unchanged. Everything the record claims about a
 * node, recomputed from the given source map. Unassigned files are skipped entirely — which is
 * precisely why the reader roster above exists.
 * @param {Record<string, string>} sources
 */
function derive(sources) {
  const names = Object.keys(sources).sort();
  /** @type {Record<string, string|null>} */
  const assign = {};
  for (const f of names) assign[f] = nodeOfModule(f);
  /** @type {Record<string, Set<string>>} */ const imports = {};
  /** @type {Record<string, Set<string>>} */ const ns = {};
  /** @type {Record<string, number>} */ const forks = {};
  for (const n of GENERATION_NODES) { imports[n.nodeId] = new Set(); ns[n.nodeId] = new Set(); forks[n.nodeId] = 0; }
  /** @type {Set<string>} */
  const edges = new Set();
  for (const f of names) {
    const node = assign[f];
    if (!node) continue;
    const ast = parse(sources[f]);
    for (const st of ast.body) {
      const src = /** @type {any} */ (st).source;
      if (!src) continue;
      const v = String(src.value);
      if (v.startsWith('./')) {
        const target = v.slice(2);
        const to = assign[target] !== undefined ? assign[target] : nodeOfModule(target);
        if (to && to !== node) { imports[node].add(target); edges.add(`${to}>${node}`); }
      } else imports[node].add(v);
    }
    const walk = (/** @type {any} */ n) => {
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

const realSources = () => {
  /** @type {Record<string, string>} */
  const o = {};
  for (const f of files()) o[f] = read(f);
  return o;
};

/** Comment-stripped source, for the §293.3c text arms. */
const strip = (/** @type {string} */ s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');

describe('§287.8 / §10.14 · the S0-S23 stage manifest is CHECKED against this tree, never trusted beside it', () => {
  test('guard-the-guard: the record is populated, the fabric directory is live, and the acorn derivation discriminates', () => {
    // ⭐ THE FAMILY'S OPENING ARM (preamble §P6). Every refusal below is an equality against a
    // derived set; if the record emptied, the directory rotted, or the parser silently stopped
    // producing imports, those equalities would pass on nothing. The floors are asserted FIRST
    // and they tighten toward reality rather than toward zero.
    expect(GENERATION_NODES.length).toBe(23);
    expect(manifestModules().length).toBe(54);
    expect(NODE_EDGES.length).toBe(88);
    expect(files().length).toBeGreaterThanOrEqual(27);

    // THE DERIVATION ITSELF IS SHOWN WORKING BEFORE IT IS TRUSTED, on a two-file synthetic map:
    // one assigned module importing another across a node boundary must produce the import, the
    // edge, the key spelling and the fork site. A derivation that returned empty for everything
    // would satisfy every subset assertion in test 3 forever.
    const shown = derive({
      'spatialReceipt.js': "import { hash32 } from './fabricRng.js';\n"
        + "export const p = () => hash32('shown|ns');\n"
        + 'export const q = (settlementSeed) => fabricRng(settlementSeed, \'shown|fork\');\n',
      'fabricRng.js': 'export const r = 1;\n',
    });
    expect([...shown.imports[FOUNDATION_NODE]]).toEqual(['fabricRng.js']);
    expect(shown.edges).toEqual(['S0>FOUNDATIONS']);
    expect([...shown.ns[FOUNDATION_NODE]].sort()).toEqual(['shown|fork', 'shown|ns']);
    expect(shown.forks[FOUNDATION_NODE]).toBe(1);
  });

  test('every fabric module in this tree is accounted for — assigned by the record or on the frozen codex roster — and each landed foundation module names its real readers', () => {
    // ── THE ACCOUNTING, EXACT IN BOTH DIRECTIONS ────────────────────────────────────────────
    const onDisk = files();
    const assigned = onDisk.filter((f) => nodeOfModule(f) !== null);
    const unassigned = onDisk.filter((f) => nodeOfModule(f) === null);
    expect(
      unassigned,
      'a fabric module belongs to neither the S0-S23 record nor the codex roster. Assign it to a'
      + ' node in stageManifest.js, or add it to CODEX_SLICE_MODULES here and say why in the'
      + ' packet — silence is what SPEC 10.14 orders refused',
    ).toEqual([...CODEX_SLICE_MODULES]);
    expect(assigned).toEqual(['coordinateAbi.js', 'fabricRng.js', 'solidLegality.js',
      'spatialReceipt.js', 'stageManifest.js']);
    expect(assigned.length + unassigned.length).toBe(onDisk.length);

    // no module is claimed by two nodes, and an unknown name resolves to no node at all
    /** @type {Set<string>} */
    const seen = new Set();
    for (const n of GENERATION_NODES) for (const m of n.modules) {
      expect(seen.has(m), `${m} is claimed by more than one node`).toBe(false);
      seen.add(m);
    }
    expect(nodeOfModule('aModuleThatDoesNotExist.js')).toBe(null);

    // the record is ahead of this tree, and by how much is published rather than felt
    expect(manifestModules().filter((m) => !onDisk.includes(m)).length).toBe(49);

    // ── THE NAMED DENOMINATOR (preamble §P2.13) ─────────────────────────────────────────────
    // The derivation skips unassigned files, so it cannot see a codex module reading a
    // foundation. These rosters are read from the WHOLE directory instead, and they are the
    // reason the sealed "FOUNDATIONS has no outbound edge" arm is not asserted as a live law.
    const sources = realSources();
    /** @type {Record<string, string[]>} */
    const readers = {};
    for (const target of Object.keys(FOUNDATION_READERS)) {
      readers[target] = onDisk.filter((f) => f !== target && relativeTargetsOf(sources[f]).includes(target));
    }
    expect(readers, 'a landed FOUNDATIONS module gained or lost a reader in this tree').toEqual(
      Object.fromEntries(Object.entries(FOUNDATION_READERS).map(([k, v]) => [k, [...v]])),
    );
    // …and the roster is not vacuous: the ABI really is read here, which is the whole finding.
    expect(readers['coordinateAbi.js'].length).toBe(7);
    expect(Object.keys(FOUNDATION_READERS).sort()).toEqual(
      GENERATION_NODES.find((n) => n.nodeId === FOUNDATION_NODE)?.modules.filter((m) => onDisk.includes(m)).sort(),
    );
  });

  test('the landed sub-tranche agrees with the record on imports, key spellings, fork sites and cross-node edges, and four plants each convict', () => {
    const real = realSources();
    const d = derive(real);

    // ── AGREEMENT: nothing derived may exceed what the record allows ────────────────────────
    for (const n of GENERATION_NODES) {
      const extraImports = [...d.imports[n.nodeId]].filter((i) => !n.allowedImports.includes(i));
      expect(extraImports, `${n.nodeId} imports something the record does not list`).toEqual([]);
      const extraNs = [...d.ns[n.nodeId]].filter((s) => !n.randomNamespaces.includes(s));
      expect(extraNs, `${n.nodeId} mints a key spelling the record does not register`).toEqual([]);
      expect(d.forks[n.nodeId], `${n.nodeId} has more live fork sites than the record allows`)
        .toBeLessThanOrEqual(n.statefulForkSites);
    }
    const extraEdges = d.edges.filter((e) => !NODE_EDGES.includes(e));
    expect(extraEdges, 'a cross-node edge exists in this tree that the record does not carry').toEqual([]);

    // ── AND EXACT WHERE THE TRANCHE IS COMPLETE. Every FOUNDATIONS module the record names that
    //    exists here is landed, so its three fields are pinned as literals rather than bounded.
    expect([...d.imports[FOUNDATION_NODE]].sort()).toEqual(['fabricRng.js']);
    expect([...d.ns[FOUNDATION_NODE]].sort()).toEqual(['f0:*', 'f1:*', 'f2:*', 'f3:*']);
    expect(d.forks[FOUNDATION_NODE]).toBe(0);
    expect(d.edges).toEqual(['S0>FOUNDATIONS']);

    // ── §293.3c · THE STREAM-DERIVATION AUDIT, SOURCE HALF ──────────────────────────────────
    // A stage's draws are derived FROM THE SEED AT STAGE ENTRY, so no stage can be re-rolled by
    // an upstream draw-count change. `fabricRng.js` is landed, so both mechanisms are live here.
    for (const f of Object.keys(real)) {
      if (f === 'fabricRng.js') continue;
      for (const m of strip(real[f]).matchAll(/fabricRng\(([^,]+),/g)) {
        expect(m[1].trim(), `${f}: a fork must take the settlement seed, not a stream`).toMatch(/seed/i);
      }
    }
    const home = strip(read('fabricRng.js'));
    expect(home.split('\n').filter((l) => /^(let|var)\s/.test(l)),
      'fabricRng.js grew module-level mutable state — every stream is now coupled').toEqual([]);
    for (const f of Object.keys(real)) {
      expect(/\brng\s*:\s*rng\b/.test(strip(real[f])), `${f} publishes a live rng handle onto an artifact`).toBe(false);
    }

    // ── FOUR PLANTS, EACH CONVICTING A BRANCH THE ARMS ABOVE HOLD ───────────────────────────
    // ⚠⚠ A GUARD THAT HAS NEVER BEEN SHOWN CONVICTING IS A GUARD NOBODY HAS TESTED. Each plant
    // is a source map, never a write: this walker never mutates the tree it reads.

    // (i) an arrival that claims no stage — the accounting arm's subject
    expect(nodeOfModule('plantedStage.js')).toBe(null);
    expect(Object.keys({ ...real, 'plantedStage.js': 'export const x = 1;\n' })
      .filter((f) => nodeOfModule(f) === null).length).toBe(CODEX_SLICE_MODULES.length + 1);

    // (ii) A FOUNDATION WIRED INTO A STAGE — the §10.15(4) defect, and the one this member's
    //      sweep plant reproduces on disk. The edge appears and it is not in the record.
    const wired = { ...real, 'fabricRng.js': `import { STAGE_IDS } from './stageManifest.js';\n${real['fabricRng.js']}` };
    const dWired = derive(wired);
    expect(dWired.edges).toContain('FOUNDATIONS>S0');
    expect(dWired.edges.filter((e) => !NODE_EDGES.includes(e))).toEqual(['FOUNDATIONS>S0']);
    // anchored: the line above proves this exact filter convicts on the planted map, so an empty reading on the real map is agreement and not a broken derivation
    expect(d.edges).not.toContain('FOUNDATIONS>S0');

    // (iii) a key spelling the record does not register
    const minted = { ...real, 'solidLegality.js': `${real['solidLegality.js']}\nexport const p = () => hashUnit('planted|ns');\n` };
    expect([...derive(minted).ns[FOUNDATION_NODE]].filter((s) => !['f0:*', 'f1:*', 'f2:*', 'f3:*'].includes(s)))
      .toEqual(['planted|ns']);

    // (iv) a stateful fork site inside a node the record says has none
    const forked = { ...real, 'spatialReceipt.js': `${real['spatialReceipt.js']}\nexport const f = (settlementSeed) => fabricRng(settlementSeed, 'planted|fork');\n` };
    expect(derive(forked).forks[FOUNDATION_NODE]).toBe(1);
  });
});
