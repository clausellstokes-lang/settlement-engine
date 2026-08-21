/**
 * tests/lint/derivationGraph.walker.test.js — ⭐⭐⭐ THE DERIVATION-GRAPH RATCHET (ODQ §234.2).
 *
 * TWO ENFORCEMENTS, both source scans, both carrying counterfactuals.
 *
 * ⭐⭐ (1) THE SCC RATCHET. `buildFabric` is straight-line code, so it has no loops — and yet it
 * has CYCLES, because a name that is REBOUND after something read it makes the derivation of
 * that name depend on something that depended on it. Every such rebinding is a cycle that the
 * fixed statement order has ALREADY CUT, silently. This walker extracts the stage graph, runs
 * Tarjan, and refuses any cycle that is not on the declared roster below with a WRITTEN CUT
 * EDGE. It does NOT choose cuts — MF-B8b's pilot notes are explicit that which edge to cut is a
 * domain judgment ("a wall does not move for a quarter") that no SCC analysis can supply. The
 * diagnostic reports; the roster records; a new unnamed cycle reds.
 *
 * ⭐⭐ (2) THE GOVERNED-PUBLICATION SCAN. MF-B8b asked for "a SOURCE SCAN for raw-handle reads —
 * an accessor is unenforceable while the raw handle exists". MF-ARCH built that scan and
 * measured why it cannot be the primary enforcement: the fabric travels under many names
 * (`fabric`, `f`, `dp`, `P`, `a`, `ctx`, `closing`), so a token scan for `.walls` convicts
 * `fort.walls` and `P.walls`, and an alias-aware scan found only 6 of the files that hold one.
 * ⭐ THE CLASS: **A SCAN OVER READ SITES MUST SOLVE ALIASING; A GUARD AT THE PUBLICATION POINT
 * DOES NOT HAVE TO.** So the raw handle is published as a VERIFYING ACCESSOR
 * (`wallCircuit.publishCircuitRings`) and this walker's job is the one thing a scan CAN do
 * precisely: refuse a second, PLAIN-NAME publication of a governed artifact from the single
 * place artifacts are published.
 *
 * ⚠⚠ LANDING HAZARD: this file parses source with `acorn`. It is present today only as a
 * transitive dependency of vite. THE LANDING EXECUTOR OWES AN EXPLICIT devDependency, and a
 * dependency bump is a MINT TRIGGER (package.json / package-lock governed). If acorn is absent
 * these tests must FAIL, never skip — "skipped due to environment can never read green".
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Parser } from 'acorn';
import { buildFabric } from '../../src/domain/townMap/fabric/buildFabric.js';
import { buildTownMapModel } from '../../src/domain/townMap/townMapModel.js';
import { publishCircuitRings } from '../../src/domain/townMap/fabric/wallCircuit.js';
import { keyedRandom, keyedRandomKey, descendantId } from '../../src/domain/townMap/fabric/fabricRng.js';
import { makeWalledFixture } from '../fixtures/townMapFixtures.js';
import { waterMeetings, deriveBridges, deckKindFor } from '../../src/domain/townMap/fabric/waterWorks.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const FABRIC = join(HERE, '../../src/domain/townMap/fabric');
const ASSEMBLY = join(FABRIC, 'buildFabric.js');

// ── THE EXTRACTOR ───────────────────────────────────────────────────────────────
const MUTATORS = new Set(['set', 'push', 'add', 'delete', 'clear', 'sort', 'splice',
  'unshift', 'pop', 'shift', 'fill', 'reverse', 'copyWithin']);

function refsIn(node, out = new Set(), bound = new Set()) {
  if (!node || typeof node !== 'object') return out;
  if (Array.isArray(node)) { for (const c of node) refsIn(c, out, bound); return out; }
  if (!node.type) return out;
  if (node.type === 'Identifier') { if (!bound.has(node.name)) out.add(node.name); return out; }
  if (node.type === 'Property' && !node.computed) { refsIn(node.value, out, bound); return out; }
  if (node.type === 'MemberExpression' && !node.computed) { refsIn(node.object, out, bound); return out; }
  if (node.type === 'ArrowFunctionExpression' || node.type === 'FunctionExpression') {
    const inner = new Set(bound);
    for (const p of node.params) for (const n of refsIn(p, new Set(), new Set())) inner.add(n);
    refsIn(node.body, out, inner);
    return out;
  }
  for (const k of Object.keys(node)) {
    if (k === 'type' || k === 'start' || k === 'end' || k === 'loc') continue;
    refsIn(node[k], out, bound);
  }
  return out;
}
const assignBase = (n) => { let c = n; while (c && c.type === 'MemberExpression') c = c.object; return c && c.type === 'Identifier' ? c.name : null; };
const assignPath = (n) => { const p = []; let c = n; while (c && c.type === 'MemberExpression') { p.unshift(c.computed ? '[]' : c.property.name); c = c.object; } return p.join('.'); };

/** Every statement in source order, through blocks, both `if` arms and every LOOP BODY —
 *  carrying the loop head's references down, so a mutation inside `for (… of x)` depends on x. */
function* statements(body, ambient = new Set()) {
  for (const st of body) {
    yield [st, ambient];
    const sub = (b, amb) => (b && b.type === 'BlockStatement' ? statements(b.body, amb) : b ? statements([b], amb) : []);
    if (st.type === 'BlockStatement') yield* statements(st.body, ambient);
    else if (st.type === 'IfStatement') { yield* sub(st.consequent, ambient); yield* sub(st.alternate, ambient); }
    else if (st.type === 'ForOfStatement' || st.type === 'ForInStatement') {
      yield* sub(st.body, new Set([...ambient, ...refsIn(st.right, new Set(), new Set())]));
    } else if (st.type === 'ForStatement' || st.type === 'WhileStatement' || st.type === 'DoWhileStatement') {
      yield* sub(st.body, new Set([...ambient,
        ...refsIn(st.init, new Set(), new Set()), ...refsIn(st.test, new Set(), new Set())]));
    } else if (st.type === 'TryStatement') { yield* sub(st.block, ambient); yield* sub(st.finalizer, ambient); }
  }
}

export function stageGraph(src, fnName) {
  const ast = Parser.parse(src, { ecmaVersion: 2024, sourceType: 'module', locations: true });
  let fn = null;
  for (const st of ast.body) {
    const d = st.type === 'ExportNamedDeclaration' ? st.declaration : st;
    if (d && d.type === 'FunctionDeclaration' && d.id && d.id.name === fnName) fn = d;
  }
  if (!fn) throw new Error(`${fnName} not found`);
  const nodes = new Set(), edges = new Map(), mutations = [];
  const add = (u, v) => { if (u === v) return; if (!edges.has(u)) edges.set(u, new Set()); edges.get(u).add(v); };
  for (const [st, ambient] of statements(fn.body.body)) {
    if (st.type === 'VariableDeclaration') {
      for (const d of st.declarations) {
        if (!d.id || d.id.type !== 'Identifier') continue;
        const name = d.id.name;
        for (const r of ambient) if (nodes.has(r) && r !== name) add(r, name);
        for (const r of refsIn(d.init, new Set(), new Set())) if (nodes.has(r) && r !== name) add(r, name);
        nodes.add(name);
      }
    } else if (st.type === 'ExpressionStatement' && st.expression.type === 'AssignmentExpression') {
      const a = st.expression, base = assignBase(a.left), path = assignPath(a.left);
      if (!base || !nodes.has(base) || !path) continue;
      const from = [...new Set([...refsIn(a.right, new Set(), new Set()), ...ambient])]
        .filter((r) => nodes.has(r) && r !== base).sort();
      mutations.push({ base, slot: path.split('.')[0], from, line: st.loc.start.line });
      for (const r of from) add(r, base);
    } else if (st.type === 'ExpressionStatement' && st.expression.type === 'CallExpression'
      && st.expression.callee.type === 'MemberExpression' && !st.expression.callee.computed
      && MUTATORS.has(st.expression.callee.property.name)) {
      const c = st.expression, base = assignBase(c.callee.object);
      if (!base || !nodes.has(base)) continue;
      const from = [...new Set([...refsIn(c.arguments, new Set(), new Set()), ...ambient])]
        .filter((r) => nodes.has(r) && r !== base).sort();
      mutations.push({ base, slot: `${assignPath(c.callee).split('.').pop()}()`, from, line: c.loc.start.line });
      for (const r of from) add(r, base);
    }
  }
  return { nodes: [...nodes], edges, mutations };
}

/** Tarjan, iterative, canonical ordering in and out. */
export function tarjan(nodes, edges) {
  const order = nodes.slice().sort();
  const index = new Map(), low = new Map(), onStack = new Set(), stack = [];
  let counter = 0; const comps = [];
  for (const root of order) {
    if (index.has(root)) continue;
    const work = [{ v: root, it: [...(edges.get(root) || [])].sort(), i: 0 }];
    index.set(root, counter); low.set(root, counter); counter++;
    stack.push(root); onStack.add(root);
    while (work.length) {
      const fr = work[work.length - 1];
      if (fr.i < fr.it.length) {
        const w = fr.it[fr.i++];
        if (!nodes.includes(w)) continue;
        if (!index.has(w)) {
          index.set(w, counter); low.set(w, counter); counter++;
          stack.push(w); onStack.add(w);
          work.push({ v: w, it: [...(edges.get(w) || [])].sort(), i: 0 });
        } else if (onStack.has(w)) low.set(fr.v, Math.min(low.get(fr.v), index.get(w)));
      } else {
        work.pop();
        if (work.length) { const p = work[work.length - 1]; low.set(p.v, Math.min(low.get(p.v), low.get(fr.v))); }
        if (low.get(fr.v) === index.get(fr.v)) {
          const comp = [];
          for (;;) { const w = stack.pop(); onStack.delete(w); comp.push(w); if (w === fr.v) break; }
          comps.push(comp.sort());
        }
      }
    }
  }
  return comps.filter((c) => c.length > 1 || (edges.get(c[0]) || new Set()).has(c[0]))
    .sort((a, b) => (a.join() < b.join() ? -1 : 1));
}

/**
 * ⭐⭐⭐ THE DECLARED CYCLE ROSTER — **AND IT IS EMPTY, WHICH IS THE FINDING.**
 *
 * MF-ARCH measured EIGHT distinct cycles here and proved that every one of them was the same
 * defect: TWO VERSIONS OF ONE ARTIFACT SHARING ONE BINDING NAME. MF-ARCH-2 gave each version
 * its own name (ODQ §240's epoch law and the architecture cure are the same object), and all
 * eight dissolved — measured, at binding AND at field granularity, with the determinism digest
 * byte-identical across the change. ⭐⭐⭐ **A DERIVATION CYCLE IS USUALLY A MISSING VERSION
 * AXIS**, and this empty roster is the receipt.
 *
 * ⚠ A ROW MAY ONLY BE ADDED WITH AN OWNER RULING. The roster is not a place to park a cycle a
 * lane found inconvenient: the pipeline is acyclic today, so a new cycle is a new architectural
 * commitment, not a housekeeping entry. Keyed by TARGET SLOT and SOURCE — never by line number,
 * which rots on the next edit (the hand-keyed-address class).
 */
export const DECLARED_CYCLES = Object.freeze([]);

describe('§234.2 · the derivation graph carries no UNDECLARED cycle', () => {
  const src = readFileSync(ASSEMBLY, 'utf8');

  it('every non-trivial SCC is created by a write-back on the DECLARED roster', () => {
    const g = stageGraph(src, 'buildFabric');
    // Which write-backs actually close a cycle? Remove them all, then re-add one at a time.
    const backEdge = new Set();
    for (const m of g.mutations) for (const r of m.from) backEdge.add(`${r} ${m.base}`);
    const readOnly = new Map();
    for (const [u, vs] of g.edges) readOnly.set(u, new Set([...vs].filter((v) => !backEdge.has(`${u} ${v}`))));

    // ⭐ THE STRUCTURAL CLAIM, ASSERTED RATHER THAN ASSUMED: with the write-backs gone the
    // pipeline is a DAG, so the write-back set is a COMPLETE feedback edge set.
    expect(tarjan(g.nodes, readOnly)).toEqual([]);

    const closing = [];
    for (const m of g.mutations) {
      if (!m.from.length) continue;
      const e = new Map([...readOnly].map(([u, vs]) => [u, new Set(vs)]));
      for (const r of m.from) { if (!e.has(r)) e.set(r, new Set()); e.get(r).add(m.base); }
      if (tarjan(g.nodes, e).length) closing.push(`${m.base}.${m.slot} ← ${m.from.join('+')}`);
    }
    const declared = DECLARED_CYCLES.map((c) => `${c.target} ← ${c.from}`).sort();
    expect(closing.sort()).toEqual(declared);
    // ⭐⭐⭐ AND THE ROSTER IS EMPTY: the whole graph is acyclic, not merely declared.
    expect(tarjan(g.nodes, g.edges)).toEqual([]);
  });

  it('every declared cycle names a CUT EDGE and a bounded pass count', () => {
    // Vacuously true today (the roster is empty) — the arm exists so that a row ADDED under a
    // future owner ruling still has to carry its cut edge. ⚠ An empty-set forall passes by
    // construction, so the roster's emptiness is asserted where it means something, above.
    for (const c of DECLARED_CYCLES) {
      expect(c.cut.length).toBeGreaterThan(30);
      expect(c.cut).toMatch(/→/);
      expect(Number.isInteger(c.passes) && c.passes >= 1 && c.passes <= 3).toBe(true);
    }
    expect(DECLARED_CYCLES.length).toBe(0);
  });

  it('⛔ COUNTERFACTUAL — the acyclicity is a FACT ABOUT THIS SOURCE, not about the walker', () => {
    // Plant the exact write-back MF-ARCH measured (`packed.parcels ← ground`) back into the
    // REAL assembly and prove the walker convicts it. Without this arm, "0 cycles" is
    // indistinguishable from an extractor that stopped seeing them.
    const anchor = '  const parcelsLawful = ground.parcels;';
    expect(src).toContain(anchor);
    const planted = src.replace(anchor, `${anchor}\n  packed.parcels = ground.parcels;`);
    const g = stageGraph(planted, 'buildFabric');
    expect(tarjan(g.nodes, g.edges).length).toBeGreaterThan(0);
  });

  it('⛔ COUNTERFACTUAL — a write-back INSIDE A CALLEE is invisible here, and leafCensus has none', () => {
    // ⭐ THE CLASS MF-ARCH-2 FOUND: a stage graph extracted from `buildFabric` stops at the
    // call, so `censusLeaf`'s five assignments into its caller's artifacts were real cycles
    // that no SCC over the assembly could ever report. The guard is a source scan on the
    // callee: it may not assign into a parameter's field.
    const census = readFileSync(join(FABRIC, 'leafCensus.js'), 'utf8');
    const body = census.slice(census.indexOf('export function censusLeaf'));
    const head = body.slice(0, body.indexOf('\nexport '));
    expect(head).not.toMatch(/^\s{2}a\.[A-Za-z]+(\.[A-Za-z]+)*\s*=/m);
    // and the arm is non-vacuous: the shape it forbids is detected when present
    expect('  a.parcels = live;').toMatch(/^\s{2}a\.[A-Za-z]+(\.[A-Za-z]+)*\s*=/m);
  });

  it('the MODULE IMPORT graph of the fabric layer is acyclic', () => {
    const { readdirSync } = require('node:fs');
    const files = readdirSync(FABRIC).filter((f) => f.endsWith('.js')).sort();
    const edges = new Map(files.map((f) => [f, new Set()]));
    for (const f of files) {
      const ast = Parser.parse(readFileSync(join(FABRIC, f), 'utf8'), { ecmaVersion: 2024, sourceType: 'module' });
      for (const st of ast.body) {
        if (!st.source || !String(st.source.value).startsWith('./')) continue;
        const t = String(st.source.value).slice(2);
        if (edges.has(t)) edges.get(t).add(f);
      }
    }
    expect(tarjan(files, edges)).toEqual([]);
  });

  it('⛔ COUNTERFACTUAL — the walker CONVICTS a planted cycle, by assignment and by method', () => {
    const planted = 'export function f(x){ const a=one(x); const b=two(a); a.slot=b.out; return b; }';
    const viaMethod = 'export function f(x){ const a=one(x); const b=two(a); const m=new Map();'
      + ' for (const q of b.items) m.set(q,1); a.slot=m; return a; }';
    const clean = 'export function f(x){ const a=one(x); const b=two(a); const c=three(b); return c; }';
    for (const [src2, want] of [[planted, 1], [viaMethod, 1], [clean, 0]]) {
      const g = stageGraph(src2, 'f');
      expect(tarjan(g.nodes, g.edges).length).toBe(want);
    }
  });
});

/**
 * ⭐⭐⭐ THE HAND-MINTED FORK-KEY RATCHET (§234's keyedRandom requirement, enforcement half) —
 * **AND THE FIVE SALT-DROPPERS ARE CURED, NOT MERELY FROZEN (ODQ §241.5b).**
 *
 * `fabricForkKey` puts the world seed, the `map-fabric:v3` namespace and — critically — the
 * `mapEdits.layoutVariant` REROLL SALT into the root of every key. MF-ARCH measured TWELVE sites
 * minting a key by hand and **five that dropped the salt**: the river's meander, the coast
 * fallback's jitter, the growth umbrella, the built umbrella and the wall. A sixth re-added the
 * salt by hand as `|v${variant}` — a THIRD spelling of one rule. All seven `buildFabric.js`
 * sites now go through `fabricForkKey`/`keyedRandom`, so the file mints none.
 *
 * ⚠ THE ACTIVITY OF EACH CURED KEY, STATED RATHER THAN IMPLIED (MF-ARCH's own measurement):
 *   meander / umb / built-umb / built|wall — the damage was **LATENT**. Each mechanic's INPUTS
 *     already carry the variant, so its output moved at a reroll anyway; the key was wrong and
 *     the drawing was not. A behavioural pin on these would therefore be VACUOUS, which is why
 *     the enforcement below is a SOURCE property and says so.
 *   coast fallback — the one **ACTIVE** site: its input is the landed model's two-point path,
 *     which is variant-invariant, so the jitter was identical at every reroll. ⚠ THE CORPUS
 *     DOES NOT EXERCISE IT (every coastal leaf finds a shore contour), so this cure is provable
 *     by construction and not by a moved sha.
 *   colonize — salted by hand; now salted in the one home.
 *
 * ⚠ WHAT REMAINS, AND WHY IT IS NOT THE SAME DEFECT. `substrate.js` composes its own root as
 * `${seed}::substrate::variant:N` — a SECOND SPELLING of the salt, but the salt IS there, so a
 * reroll reaches the ground. Converting it to `fabricForkKey` would move EVERY leaf in the
 * corpus, and MF-D1 proved it with the two key strings: those four draws place the VALLEY AXIS
 * and the COASTAL RAMP EDGE, so the conversion re-rolls the GROUND on every leaf at every
 * variant. §303.2 PARKED it and `fabricRng.legacySubstrateForkKey` is pinned against an
 * accidental conversion. **The DUPLICATED RULE — the actual §241.5b defect — is cured: the salt
 * has one home and emits the character-identical string.**
 * ⛔⛔ ⟦§303.6⟧ **AND THE SENTENCE ABOVE ABOUT `|v${variant}` BEING CURED IS FALSE AND IS LEFT
 * STANDING WITH THIS CORRECTION BESIDE IT** rather than quietly edited: it is alive in
 * `fields.js`, `immersion.js`, `relief.js` and `stateMarks.js`, and the inventory below now
 * counts all four. The claim was true of `buildFabric.js` only, and the ratchet could not see
 * the difference because of its matcher (below).
 *
 * ⚠ THE ALLOWANCE IS EXACT, NEVER A CEILING. A `<=` ratchet lets a cured site pay for a new one
 * and the count never moves — the banked-failure shape. Any change in either direction reds and
 * must be re-addressed on purpose.
 */
/**
 * ⛔⛔ ⟦§303.6 / MF-D1 RAISED-6⟧ **THE RATCHET WAS SEEING 5 OF THE FABRIC'S 30 SEED-ROOTED KEYS,
 * AND THE INVENTORY ABOVE WAS TRUE OF TWO FILES.** The old matcher required the interpolation to
 * be a BARE identifier — `` `${[A-Za-z]*seed[A-Za-z]*}|` `` — so every site that spells the seed
 * `${String(seeding.seed)}` or `${s.seed}` was INVISIBLE to it, including the very `|v${variant}`
 * spelling this file's own prose calls cured. MF-D1 named four such sites; the widened matcher
 * finds **fourteen modules and thirty keys**.
 *
 * ⭐⭐ **THE CONVICTION COUNT, MEASURED AND DECLARED BEFORE THE WIDENING — §303.6 ORDERS EXACTLY
 * THIS, "never silently":**
 *
 *   old matcher   5 keys / 2 modules   snapshot 1 · substrate 4
 *   new matcher  30 keys / 14 modules  commons 1 · fields 1 · habitation 10 · immersion 3 ·
 *                                      institutionShapes 1 · relief 2 · routes 2 · snapshot 1 ·
 *                                      stateMarks 1 · streetEdges 1 · streets 1 · substrate 4 ·
 *                                      terraform 1 · waterWorks 1
 *   ⭐ **+25 NEW CONVICTIONS**, none of them new code — the surface was always there.
 *
 * ⚠⚠ NOTHING IS CURED BY THIS ROW AND THAT IS DELIBERATE. Converting any of the 25 changes a KEY,
 * and §241.5c's class rule is exact: **a key-spelling cure is ALWAYS a same-seed shift.** Twenty-
 * five of them inside a content wave would be unattributable. The ratchet's job is to make the
 * surface VISIBLE and frozen; the cures are a micro-wave of their own, D0-pattern.
 * ⭐ THE CLASS, worth the sentence: **A RATCHET IS ONLY AS WIDE AS ITS MATCHER, AND A NARROW
 * MATCHER READS AS A SMALL PROBLEM.** This one published "5" for four waves and its own docstring
 * called a live defect cured, because the four live sites spell the seed a way it cannot see.
 */
const HAND_MINTED_FORK_KEYS = Object.freeze({
  'commons.js': 1,
  'fields.js': 1,              // ⚠ the `|v${variant}` spelling the prose above calls cured
  'habitation.js': 10,
  'immersion.js': 3,           // ⚠ likewise
  'institutionShapes.js': 1,
  'relief.js': 2,              // ⚠ likewise
  'routes.js': 2,
  'snapshot.js': 1,            // colonize|i — composes from the (salted) key its caller passes
  'stateMarks.js': 1,          // ⚠ likewise
  'streetEdges.js': 1,
  'streets.js': 1,
  'substrate.js': 4,           // valley|bearing, valley|across, ramp|edge, resource|…|site
  'terraform.js': 1,
  'waterWorks.js': 1,
});

describe('§234 · randomness is keyed, and a new hand-minted fork key cannot appear quietly', () => {
  const { readdirSync } = require('node:fs');
  /**
   * A key minted from a seed-ish EXPRESSION with a `|` separator, outside fabricRng.js.
   * ⚠ `[^}]*` AND NOT `[A-Za-z]*` — see `HAND_MINTED_FORK_KEYS`' header for the 25 sites the
   * identifier-only form could not see and for the measured conviction count of the widening.
   */
  const MINT = /`\$\{[^}]*[Ss]eed[^}]*\}\|/g;

  it('the hand-minted fork keys are EXACTLY the frozen inventory, and the ASSEMBLY mints none', () => {
    const found = {};
    for (const f of readdirSync(FABRIC).sort()) {
      if (!f.endsWith('.js') || f === 'fabricRng.js') continue;
      const src = readFileSync(join(FABRIC, f), 'utf8')
        .replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
      const m = src.match(MINT);
      if (m) found[f] = m.length;
    }
    expect(found).toEqual({ ...HAND_MINTED_FORK_KEYS });
    // ⭐ THE ASSEMBLY IS THE FILE THE FIVE SALT-DROPPERS LIVED IN, so it is named directly:
    // every fork it takes goes through `fabricForkKey` or `keyedRandom`, which is the property
    // the count above can only imply.
    expect(found['buildFabric.js']).toBeUndefined();
    const asm = readFileSync(ASSEMBLY, 'utf8')
      .replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
    expect(asm).toMatch(/const fork = \(name\) => fabricForkKey\(seed, name, \{ variant \}\);/);
    // ⛔ AND THE ARM IS NON-VACUOUS: the shape it forbids is still detected when present.
    expect('`${seed}|umb`').toMatch(MINT);
  });

  it('keyedRandom NAMESPACES by mechanic and INDEXES by sample — neither can collide', () => {
    const seed = 'seed-x', feature = 'district.market';
    // two mechanics asking about ONE feature never share a draw
    expect(keyedRandom(seed, feature, 'jitter', 0)).not.toBe(keyedRandom(seed, feature, 'tone', 0));
    // adding a draw at k+1 cannot move k
    const k0 = keyedRandom(seed, feature, 'jitter', 0);
    expect(keyedRandom(seed, feature, 'jitter', 1)).not.toBe(k0);
    expect(keyedRandom(seed, feature, 'jitter', 0)).toBe(k0);
    // two features never share a draw
    expect(keyedRandom(seed, 'district.other', 'jitter', 0)).not.toBe(k0);
    // and the REROLL SALT reaches it — the property five hand-minted sites drop
    expect(keyedRandom(seed, feature, 'jitter', 0, { variant: 2 })).not.toBe(k0);
    expect(keyedRandomKey(seed, feature, 'jitter', 0, { variant: 2 })).toContain('::variant:2::');
  });

  it('⛔ COUNTERFACTUAL — a HAND-MINTED key drops the reroll salt; keyedRandom cannot', () => {
    const seed = 'seed-x';
    // exactly the shape `buildFabric` uses for the umbrella
    const handMinted = (variant) => `${seed}|umb`;          // eslint-disable-line no-unused-vars
    expect(handMinted(0)).toBe(handMinted(3));              // ⛔ the reroll does NOT reach it
    expect(keyedRandomKey(seed, 'umb', 'smoothing', 0, { variant: 0 }))
      .not.toBe(keyedRandomKey(seed, 'umb', 'smoothing', 0, { variant: 3 }));
  });

  it('descendantId is a pure function of descent, and never of position', () => {
    expect(descendantId('p.4.2.0', 1)).toBe(descendantId('p.4.2.0', 1));
    expect(descendantId('p.4.2.0', 1)).not.toBe(descendantId('p.4.2.0', 2));
    expect(descendantId('p.4.2.0', 1)).not.toBe(descendantId('p.4.2.1', 1));
    // a grandchild's key still names its whole line
    expect(descendantId(descendantId('p.4.2.0', 1), 0)).toBe('p.4.2.0/1/0');
  });
});

describe('§234 · a governed artifact is published ONCE, through its accessor', () => {
  it('`walls` is a VERIFYING GETTER on the fabric, never a plain array', () => {
    const f = buildFabric(makeWalledFixture(), buildTownMapModel(makeWalledFixture(), null), {});
    const d = Object.getOwnPropertyDescriptor(f, 'walls');
    expect(typeof d.get).toBe('function');
    expect(d.enumerable).toBe(true);
    expect(d.configurable).toBe(false);     // no consumer can replace it with a raw array
    expect(f.walls).toBe(f.wallCircuit.rings);
  }, 120000);

  it('⛔ COUNTERFACTUAL — the RAW HANDLE itself throws on a mutated node', () => {
    const s = makeWalledFixture();
    const f = buildFabric(s, buildTownMapModel(s, null), {});
    const node = f.wallCircuit;
    const tampered = {
      ...node,
      rings: node.rings.map((r, i) => (i ? r : { ...r, polygon: r.polygon.map(([x, y]) => [x + 3, y]) })),
    };
    const probe = publishCircuitRings({}, tampered);
    expect(() => probe.walls).toThrow(/STALE OR MUTATED/);
  }, 120000);

  it('the assembly does not re-publish a governed artifact under a PLAIN name', () => {
    // The one place artifacts are published is buildFabric's return literal. A governed
    // artifact's internals must not appear there as a plain key beside its accessor.
    const ast = Parser.parse(readFileSync(ASSEMBLY, 'utf8'), { ecmaVersion: 2024, sourceType: 'module' });
    let fn = null;
    for (const st of ast.body) {
      const d = st.type === 'ExportNamedDeclaration' ? st.declaration : st;
      if (d && d.type === 'FunctionDeclaration' && d.id && d.id.name === 'buildFabric') fn = d;
    }
    const ret = fn.body.body.find((s) => s.type === 'ReturnStatement');
    // the return is `publishCircuitRings({ … }, wallCircuit)`
    expect(ret.argument.type).toBe('CallExpression');
    expect(ret.argument.callee.name).toBe('publishCircuitRings');
    const literal = ret.argument.arguments[0];
    expect(literal.type).toBe('ObjectExpression');
    const keys = literal.properties.filter((p) => p.type === 'Property' && !p.computed).map((p) => p.key.name);
    expect(keys).not.toContain('walls');          // published by the accessor, not by the literal
    expect(keys).toContain('wallCircuit');        // the node itself is public
  });
});

// ── G-34 · ONE PREDICATE, ONE HOME ──────────────────────────────────────────────
/**
 * ⭐⭐⭐ §262.2(a) · THE CHECK THAT REDS WHEN A SECOND MODULE ASKS THE SAME GEOMETRIC QUESTION.
 *
 * ⚠⚠ AND THE FORM OF THIS CHECK IS ITSELF A FINDING. The obvious guard — scan the fabric for a
 * second spelling of the intersection kernel or of "read the water's centreline" — was written
 * first and MEASURED USELESS: the kernel appears legitimately in FIVE modules (reservedGround,
 * fabricGeometry, accessLaw, groundLaw and this one) on five different subjects, and a water
 * line is read in THIRTEEN. A token scan over read sites convicts all of them or none.
 * ⭐ THE CURE IS §241.5a's, APPLIED AGAIN: **a scan over read sites must solve aliasing; a
 * guard at the publication point does not have to.** The answer is published once, by
 * `deriveBridges`, and carried to the census on `bridges2.meetings`; so the guard asserts
 * (1) `waterMeetings` has exactly ONE caller in the whole fabric layer, (2) the assembly hands
 * the census THAT call's own object rather than letting it ask again, (3) the deriver no
 * longer holds the centreline spelling it used to ask — and then proves behaviourally that the
 * two readings were genuinely different questions, so a regression to either is visible.
 */
describe('§262.2(a) / G-34 · one predicate, one home, and a second spelling REDS', () => {
  const fabricSrc = () => {
    const { readdirSync } = require('node:fs');
    /** @type {Record<string,string>} */ const out = {};
    for (const f of readdirSync(FABRIC)) {
      if (!f.endsWith('.js')) continue;
      // Comments stripped, so a rule NAMED in prose is never a rule BROKEN in code.
      out[f] = readFileSync(join(FABRIC, f), 'utf8')
        .replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
    }
    return out;
  };

  it('`waterMeetings` has exactly ONE caller in the fabric layer, and it is the deriver', () => {
    const src = fabricSrc();
    const callers = Object.keys(src).filter((f) => /\bwaterMeetings\s*\(/.test(src[f])).sort();
    expect(callers).toEqual(['waterWorks.js']);
    // Inside its home it is called once: by deriveBridges. The census is HANDED that answer.
    expect((src['waterWorks.js'].match(/\bwaterMeetings\s*\(/g) || []).length).toBe(2); // decl + 1 call
    expect(/export function waterMeetings\s*\(/.test(src['waterWorks.js'])).toBe(true);
    // ⭐ AND THE SECOND QUESTION THE PAIR USED TO SPELL TWICE: HOW FAR A DECK REACHES. The
    // deriver's uncovered second pass and the census's `decks` radius carried the identical
    // arithmetic in two modules — the same defect one surface out. It lives once now, and the
    // census reaches it only through `runIsCovered`.
    const reach = Object.keys(src).filter((f) => /\bdeckReach\s*\(/.test(src[f])).sort();
    expect(reach).toEqual(['waterWorks.js']);
    expect(/export function deckReach\s*\(/.test(src['waterWorks.js'])).toBe(true);
    expect(/0\.75\s*\+\s*frontage\s*\*\s*0\.6/.test(src['leafCensus.js'])).toBe(false);
    expect(/\brunIsCovered\s*\(/.test(src['leafCensus.js'])).toBe(true);
  });

  it('⭐ MF-PERF1 · the §202 STREET SEEDS are derived ONCE and CARRIED, and a fallback REDS', () => {
    // ⭐⭐ THE SAME LAW AS `waterMeetings` ABOVE, one module over. The §202 grid is built SIX
    // times on a walled leaf — four repair rounds, the census and the permeability statistic —
    // and the street seed mask is IDENTICAL in all six, because the access pass moves BODIES
    // and never channels. MF-PERF1 derived it once in `censusLeaf` and handed it down.
    // ⚠⚠ THE HAZARD THIS ARM EXISTS FOR IS MF-W0's OWN, VERBATIM: *"a lane that makes it
    // default to a recomputation 'for safety' restores the defect silently."* `seeds` is a
    // REQUIRED argument with no default, and this scan is what keeps it one.
    const src = fabricSrc();
    // ONE home for the derivation.
    const decl = Object.keys(src).filter((f) => /export function streetSeeds\s*\(/.test(src[f])).sort();
    expect(decl).toEqual(['accessLaw.js']);
    // ONE caller, and it is the closing pass — the module that orchestrates all three consumers.
    const callers = Object.keys(src).filter((f) => /[^n]\bstreetSeeds\s*\(/.test(src[f]) && f !== 'accessLaw.js').sort();
    expect(callers).toEqual(['leafCensus.js']);
    expect((src['leafCensus.js'].match(/\bstreetSeeds\s*\(/g) || []).length).toBe(1);
    // ⛔ AND `buildGrid` NO LONGER STAMPS THE MASK ITSELF — the shape that made six copies.
    const grid = src['accessLaw.js'].slice(src['accessLaw.js'].indexOf('export function buildGrid'));
    const gridBody = grid.slice(0, grid.indexOf('\nexport '));
    expect(gridBody).not.toMatch(/fillBand\s*\(\s*street/);
    expect(gridBody).toMatch(/seeds\.street/);
    // ⛔ NON-VACUOUS, BOTH WAYS: the shapes forbidden above are detected when present.
    const planted = { ...src, 'accessLaw.js': `${src['accessLaw.js']}\nfunction __planted(f, s) { return s || streetSeeds(f); }\n` };
    const plantedCallers = Object.keys(planted).filter((f) => /[^n]\bstreetSeeds\s*\(/.test(planted[f]) && f !== 'accessLaw.js').sort();
    expect(plantedCallers).toEqual(['leafCensus.js']);            // the plant is INSIDE the home…
    expect(/\bfunction __planted[\s\S]*\|\|\s*streetSeeds\(/.test(planted['accessLaw.js'])).toBe(true);
    expect(/\bfunction __planted[\s\S]*\|\|\s*streetSeeds\(/.test(src['accessLaw.js'])).toBe(false);
    expect('  fillBand(street, n, cell, ch.line, 1, 1);').toMatch(/fillBand\s*\(\s*street/);
  });

  it('⛔ COUNTERFACTUAL — PLANT a second spelling in a sibling module and the scan CONVICTS it', () => {
    // ⚠⚠ A GUARD THAT HAS NEVER BEEN SHOWN CONVICTING IS A GUARD NOBODY HAS TESTED. §5 W0's
    // exit 3(a) says so in terms: "the check must be non-vacuous: plant a second spelling and
    // it must convict." So the scan is factored out and run twice — once over the real source,
    // once over source with `leafCensus.js` re-spelling the question for itself.
    const { readdirSync } = require('node:fs');
    const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
    const callersOf = (src) => Object.keys(src).filter((f) => /\bwaterMeetings\s*\(/.test(src[f])).sort();
    /** @type {Record<string,string>} */ const real = {};
    for (const f of readdirSync(FABRIC)) if (f.endsWith('.js')) real[f] = strip(readFileSync(join(FABRIC, f), 'utf8'));
    expect(callersOf(real)).toEqual(['waterWorks.js']);            // the tree as it stands
    // THE PLANT: the census decides to answer the question itself, exactly as it did before
    // this wave — a private second reading of the same two lines.
    const planted = { ...real };
    planted['leafCensus.js'] = `${real['leafCensus.js']}\nfunction __planted(ch, rel) { return waterMeetings(ch.line, rel); }\n`;
    expect(callersOf(planted)).toEqual(['leafCensus.js', 'waterWorks.js']);
    expect(callersOf(planted)).not.toEqual(['waterWorks.js']);     // ⛔ the assertion above REDS
  });

  it('the assembly hands the census the DERIVER\'s own answer, never a second computation', () => {
    const ast = Parser.parse(readFileSync(ASSEMBLY, 'utf8'), { ecmaVersion: 2024, sourceType: 'module' });
    let found = null;
    const walk = (n) => {
      if (!n || typeof n !== 'object') return;
      if (Array.isArray(n)) { for (const c of n) walk(c); return; }
      if (n.type === 'CallExpression' && n.callee && n.callee.name === 'censusLeaf') found = n;
      for (const k of Object.keys(n)) if (k !== 'type' && k !== 'start' && k !== 'end') walk(n[k]);
    };
    walk(ast);
    expect(found).not.toBeNull();
    const lit = found.arguments[0];
    const prop = lit.properties.find((p) => p.type === 'Property' && !p.computed && p.key.name === 'meetings');
    expect(prop).toBeTruthy();
    // `meetings: bridges2.meetings` — the SAME expression that produced `bridges`.
    expect(prop.value.type).toBe('MemberExpression');
    expect(prop.value.property.name).toBe('meetings');
    const bridgesProp = lit.properties.find((p) => p.type === 'Property' && !p.computed && p.key.name === 'bridges');
    expect(bridgesProp.value.object.name).toBe(prop.value.object.name);
  });

  it('⛔ COUNTERFACTUAL — `deriveBridges` no longer holds the CENTRELINE spelling, and the wall still does', () => {
    const ast = Parser.parse(readFileSync(join(FABRIC, 'waterWorks.js'), 'utf8'), { ecmaVersion: 2024, sourceType: 'module' });
    const bodyOf = (name) => {
      for (const st of ast.body) {
        const d = st.type === 'ExportNamedDeclaration' ? st.declaration : st;
        if (d && d.type === 'FunctionDeclaration' && d.id && d.id.name === name) return d;
      }
      return null;
    };
    const calls = (node) => {
      const out = [];
      const walk = (n) => {
        if (!n || typeof n !== 'object') return;
        if (Array.isArray(n)) { for (const c of n) walk(c); return; }
        if (n.type === 'CallExpression' && n.callee && n.callee.name) out.push(n.callee.name);
        for (const k of Object.keys(n)) if (k !== 'type' && k !== 'start' && k !== 'end') walk(n[k]);
      };
      walk(node);
      return out;
    };
    // THE DEFECT THIS FILE EXISTS TO REFUSE: the bridge deriver asking the centreline.
    expect(calls(bodyOf('deriveBridges'))).not.toContain('crossPoint');
    expect(calls(bodyOf('deriveBridges'))).toContain('waterMeetings');
    // ⭐ AND THE WALL'S QUESTION IS A DIFFERENT QUESTION AND KEEPS ITS OWN ANSWER: a curtain is
    // a closed ring the water CUTS, and the gate stands at the cut. Giving the wall the
    // street's predicate would mint a water gate wherever the curtain merely grazed the bank.
    expect(calls(bodyOf('deriveWaterGates'))).toContain('crossPoint');
    expect(calls(bodyOf('deriveWaterGates'))).not.toContain('waterMeetings');
  });

  it('⛔ COUNTERFACTUAL — the two spellings ARE different questions, so a regression is visible', () => {
    // The pre-cure reading, reconstructed: a TRUE intersection with the centreline. If this
    // agreed with `waterMeetings` the guard above would be proving nothing.
    const rel = { kind: 'river', width: 10, line: [[0, 50], [100, 50]] };
    const grazing = [[20, 47], [80, 47]];       // inside the band, never touching the centreline
    const crossPointOld = (a, b, line) => {
      for (let i = 0; i + 1 < line.length; i++) {
        const c = line[i], d = line[i + 1];
        const r0 = b[0] - a[0], r1 = b[1] - a[1], s0 = d[0] - c[0], s1 = d[1] - c[1];
        const den = r0 * s1 - r1 * s0;
        if (den === 0) continue;
        const t = ((c[0] - a[0]) * s1 - (c[1] - a[1]) * s0) / den;
        const u = ((c[0] - a[0]) * r1 - (c[1] - a[1]) * r0) / den;
        if (t < 0 || t > 1 || u < 0 || u > 1) continue;
        return true;
      }
      return false;
    };
    expect(crossPointOld(grazing[0], grazing[1], rel.line)).toBe(false);   // the deriver saw NOTHING
    expect(waterMeetings(grazing, rel).inside).toBe(1);                    // the census saw a crossing
    // ⭐ THAT GAP IS THE 72. The cured predicate answers ONE question for both consumers.
    expect(waterMeetings(grazing, rel).runs.map((r) => r.verdict)).toEqual(['in-channel']);
  });

  it('§262.2(b) · rank scales the WORK and never refuses the CROSSING — a planted passage earns a plank', () => {
    const rel = { kind: 'river', width: 10, line: [[0, 50], [100, 50]] };
    // ⚠ THE FIXTURE IS PLANTED BECAUSE THE CORPUS CANNOT REACH THIS ARM. All 20 of the corpus's
    // `passage` convictions turn out to be BANKSIDE — none of them actually crosses — so
    // without this fixture the removal of `if (ch.rank === 'passage') continue;` would be an
    // UNREACHABLE ARM and the pin vacuous.
    const across = { key: 'street.passage.planted', rank: 'passage', width: 2, line: [[50, 0], [50, 100]] };
    const out = deriveBridges({ rel, channels: [across], frontage: 6 });
    expect(out.bridges).toHaveLength(1);
    expect(out.bridges[0].rank).toBe('passage');
    expect(out.bridges[0].kind).toBe('plank');           // not a clone of the arterial bridge
    expect(deckKindFor('artery')).toBe('bridge');
    expect(deckKindFor('lane')).toBe('footbridge');
    // ⛔ AND THE SAME PASSAGE LAID ALONG ITS OWN BANK EARNS NOTHING — the geometry decides.
    const along = { key: 'street.passage.along', rank: 'passage', width: 2, line: [[20, 40], [50, 47], [80, 40]] };
    expect(waterMeetings(along.line, rel).runs.map((r) => r.verdict)).toEqual(['bankside']);
    expect(deriveBridges({ rel, channels: [along], frontage: 6 }).bridges).toHaveLength(0);
  });

  it('§262.2(c) · a street meeting a meander THREE times earns THREE works, not one', () => {
    const rel = { kind: 'river', width: 10, line: [[0, 50], [200, 50]] };
    const weaving = {
      key: 'street.high.weaving', rank: 'artery', width: 8,
      line: [[10, 0], [10, 100], [90, 100], [90, 0], [170, 0], [170, 100]],
    };
    const m = waterMeetings(weaving.line, rel);
    expect(m.runs.filter((r) => r.verdict === 'transit')).toHaveLength(3);
    const out = deriveBridges({ rel, channels: [weaving], frontage: 6 });
    expect(out.bridges).toHaveLength(3);
    // ⛔ THE OLD LOOP `break`s after the first crossing per channel — one deck, two convictions
    // that no bridge could ever cover. That is the 35.
    expect(out.bridges.length).toBeGreaterThan(1);
  });

  it('§262.2(e) · the BANKSIDE exemption is keyed to the water, and a coast has ONE bank', () => {
    // A river's claim band IS the water: a line lying in it with no dry ground either side is
    // convicted, and no terrain token can forgive it.
    const river = { kind: 'river', width: 10, line: [[0, 50], [100, 50]] };
    expect(waterMeetings([[20, 48], [80, 48]], river).runs.map((r) => r.verdict)).toEqual(['in-channel']);
    // A coast's claim is the STRAND — walkable ground — so a shore road on it crosses nothing.
    const coast = {
      kind: 'coast', width: 10, bankSide: 1,
      line: [[0, 50], [100, 50]],
      body: [[0, 50], [100, 50], [100, 200], [0, 200]],
    };
    const shoreRoad = waterMeetings([[10, 48], [50, 52], [90, 48]], coast);
    expect(shoreRoad.runs.every((r) => r.verdict === 'bankside')).toBe(true);
    // ⛔ AND IT IS NOT A LICENCE: a road out PAST the strand into the sea stays convicted.
    const intoTheSea = waterMeetings([[50, 40], [50, 120]], coast);
    expect(intoTheSea.runs.map((r) => r.verdict)).toEqual(['open-water']);
  });
});
