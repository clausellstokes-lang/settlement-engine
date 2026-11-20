/**
 * tests/architecture/engineCoreLazyEdge.test.js — the eager engine-core chunk never
 * statically imports a module pinned to a LAZY chunk (BOOT-TIP, 2026-11-10; FIRSTPAINT-4).
 *
 * THE CLASS. vite.config.js derives ENGINE_SHARED_DOMAIN from the generators' domain
 * imports and routes every member into the EAGER `engine-core` chunk. A new
 * generator-side import grows that set; a member that statically imports a module
 * pinned lazy (coherence-lazy above all) gives engine-core a static edge into the lazy
 * chunk, so first paint swallows it and the chunk graph closes a cycle
 * (engine-core -> coherence-lazy -> data-lazy -> engine-core) whose TDZ throw stops the
 * shell mounting. It happened three times: FIRSTPAINT-2 (LANDING-6), FIRSTPAINT-3
 * (LANDING-R2) and FIRSTPAINT-4 (STYLE-2-MERGE point 22: crisisHooks.js ->
 * display/governanceAccount.js pulled governanceAccount into the derived set, and its
 * import of dossier/powerStrata.js became engine-core -> coherence-lazy). Every time the
 * dev server was fine and only a production build saw it, and the per-merge gates ran no
 * build. tests/build/** reads dist/ and is vacuous without one.
 *
 * THIS GUARD needs no build. It EXECUTES the shipped manualChunks over every source
 * file (so it reads the same ESD derivation, excisions and pins the build does), takes
 * the modules it routes to `engine-core`, walks their static imports with
 * vite.config.js's own static-edge spelling (dynamic import() is a lazy boundary and is
 * not followed), and fails on any edge into a module manualChunks routes to a chunk
 * that is not one of the eager chunks named below. An unpinned target is allowed ONLY
 * where Rollup's own placement keeps it out of a lazy chunk (FIRSTPAINT-5, below).
 *
 * FIRSTPAINT-5 (CURE-FIRSTPAINT, DEPTH-3, 2026-11-20): WHY THIS GUARD WAS GREEN ON A TREE
 * WHOSE ENGINE-CORE IMPORTED COHERENCE-LAZY. It read every unpinned target as safe ("Rollup
 * co-locates it"), but Rollup (4.x, getChunkDefinitionsFromManualChunks) ABSORBS each
 * unpinned module into the manual chunk of the first pinned module, in execution order,
 * that statically reaches it through unpinned hops. facts/rosterGrounds.js (BUILD-CONFLICT,
 * new; derived into engine-core through facts/factsOf.js) imports facts/liveInstitutionNames.js,
 * an UNPINNED excision whose other pinned reachers (facts/institutions.js,
 * display/threatAssessment.js) are coherence-lazy: no reacher of it is in the entry's static
 * graph, so coherence-lazy absorbed it and engine-core -> liveInstitutionNames was an
 * engine-core -> coherence-lazy edge (coherence-lazy, data-lazy and narrative-mutations rode
 * first paint at 2582075ed). The third case below follows unpinned hops and models that
 * absorption: an unpinned module is SAFE only where an eager-pinned reacher sits in the
 * entry's static graph (it executes before any lazily loaded module, so it absorbs first) and
 * no lazily pinned reacher does; any other unpinned module a lazy pin reaches is read as that
 * lazy chunk's.
 * WHAT THIS GUARD CANNOT SEE (the chair's rule, 20:31 UTC: a test that says what it cannot see beats
 * one that looks whole). Rollup's seating is MODELLED here, not observed: no build runs. The model
 * reads static edges with vite.config.js's regex spelling (relative specifiers only: no alias, no
 * import.meta.glob, no plugin rewrite but the flagged seam swap), and it takes the entry's static
 * graph to execute before every lazily loaded module (Rollup 4's analyseModuleExecution); among
 * lazily loaded modules it cannot know the order, so it reads any lazy reacher there as winning.
 * So the smallest honest net rides beside the model: no engine-core module reaches, through
 * unpinned hops, an EXCISED-BUT-UNPINNED module (ENGINE_SHARED_DOMAIN_EXCISIONS that manualChunks
 * leaves undefined, facts/liveInstitutionNames.js among them): the derivation took each out of
 * engine-core and nothing put it back, so Rollup seats it wherever its first pinned reacher is.
 * THE FINAL WORD IS THE BUILD: tests/build/vendorPdfLazy.test.js (FIX-B2's anchored-leaf chunks
 * and "no prose leaf reaches a first-paint chunk", on the emitted dist; DEPTH-3's proof).
 * BOTH SHAPES ARE WALKED: (a) a module eager by first-paint reach and (b) a module the derivation
 * SEATS in engine-core only by walking through a lazily pinned importer (facts/factsOf.js's homes):
 * both are what the executed manualChunks routes to engine-core, so every case reads both.
 * The cure for a red is vite.config.js's convention: excise the engine-core member that
 * no true first-paint module reaches and pin it with the lazy module it imports,
 * measured beside the pin (FIRSTPAINT2_LAZY_DOMAIN).
 * @guards vite.config.js :: ENGINE_SHARED_DOMAIN, FIRSTPAINT2_LAZY_DOMAIN
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import viteConfig, { ENGINE_SHARED_DOMAIN_EXCISIONS } from '../../vite.config.js';

const ROOT = resolve(__dirname, '../..');
const SRC = join(ROOT, 'src');
const manualChunks = viteConfig.build.rollupOptions.output.manualChunks;

// The chunks engine-core may statically import: each is in the entry's first-paint
// closure by design (vite.config.js manualChunks: data's eager tables, the kernel, the
// strict content identity, the det-math core) or is engine-core itself.
const EAGER_CHUNKS = new Set(['engine-core', 'data', 'kernel', 'content-identity', 'det-math']);

const walk = (d, out = []) => {
  for (const e of readdirSync(d)) {
    const p = join(d, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.jsx?$/.test(e)) out.push(p);
  }
  return out;
};
const resolveRel = (from, spec) => {
  if (!spec.startsWith('.')) return null;
  const base = resolve(dirname(from), spec);
  for (const c of [base, `${base}.js`, `${base}.jsx`, join(base, 'index.js'), join(base, 'index.jsx')])
    if (existsSync(c) && statSync(c).isFile()) return c;
  return null;
};
// vite.config.js :: computeEagerModuleGraph's static-edge spelling.
const importsOf = (file) => {
  const code = readFileSync(file, 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '');
  const specs = [];
  for (const m of code.matchAll(/(?:^|[^.\w])import\s+(?:[^'"()]*?\sfrom\s+)?['"]([^'"]+)['"]/g)) specs.push(m[1]);
  for (const m of code.matchAll(/(?:^|[^.\w])export\s+[^'"]*?\sfrom\s+['"]([^'"]+)['"]/g)) specs.push(m[1]);
  return specs.map((s) => resolveRel(file, s)).filter(Boolean);
};
const rel = (p) => p.slice(ROOT.length + 1);

describe('engine-core never statically imports a lazily pinned module (FIRSTPAINT-4)', () => {
  const engineCore = walk(SRC).filter((f) => manualChunks(f) === 'engine-core');

  it('the executed manualChunks routes a real engine-core (not vacuous)', () => {
    expect(engineCore.length).toBeGreaterThan(40);
  });

  const edgesOutOfEngineCore = (resolveDep = (dep) => dep) => {
    const bad = [];
    for (const f of engineCore)
      for (const raw of importsOf(f)) {
        const dep = resolveDep(raw);
        const chunk = manualChunks(dep);
        if (chunk && !EAGER_CHUNKS.has(chunk)) bad.push(`${rel(f)} -> ${rel(dep)} [${chunk}]`);
      }
    return bad;
  };

  // THE FLAGGED GRAPH (DIST-FLAGGED, 2026-11-10). The production artifact is built with
  // VITE_ENGINE_REMOTE=true, and vite.config.js :: engineAbsentWhenRemote then resolves the
  // local engine's three seam ids to src/lib/localEngine.absent.js. That plugin swaps those
  // ids and nothing else, and manualChunks does not read the flag, so the flagged graph is
  // this walk with the same swap applied — cheap, and it is THE graph that ships.
  it('the same holds on the FLAGGED graph (the seam swapped to its absent twin, as the plugin does)', () => {
    const swapped = new Set([
      join(SRC, 'lib/localEngine.js'),
      join(SRC, 'lib/localPipeline.js'),
      join(SRC, 'generators/generateSettlementPipeline.js'),
    ]);
    const absent = join(SRC, 'lib/localEngine.absent.js');
    expect(existsSync(absent), 'the absent twin the plugin resolves to').toBe(true);
    const bad = edgesOutOfEngineCore((dep) => (swapped.has(dep) ? absent : dep));
    expect(bad, `FLAGGED graph: engine-core (eager) statically imports a lazily pinned module:\n  ${bad.join('\n  ')}`).toEqual([]);
  });

  // FIRSTPAINT-5 (the header): the unpinned hop, followed. Rollup absorbs an unpinned module into
  // the manual chunk of the first pinned module (in execution order) that reaches it through
  // unpinned hops; the entry's static graph executes before any lazily loaded module.
  const ENTRY = join(SRC, 'main.jsx');
  const SWAPPED = new Set([
    join(SRC, 'lib/localEngine.js'),
    join(SRC, 'lib/localPipeline.js'),
    join(SRC, 'generators/generateSettlementPipeline.js'),
  ]);
  const ABSENT = join(SRC, 'lib/localEngine.absent.js');
  const unpinnedHopEdges = (resolveDep = (dep) => dep) => {
    const deps = (f) => importsOf(f).map(resolveDep);
    const entryGraph = new Set([ENTRY]);
    for (const q = [ENTRY]; q.length;) for (const d of deps(q.shift())) if (!entryGraph.has(d)) { entryGraph.add(d); q.push(d); }
    // every unpinned module each pinned module reaches through unpinned hops
    const unpinnedReach = (from) => {
      const reached = new Map([[from, []]]);
      for (const q = [from]; q.length;) {
        const f = q.shift();
        for (const d of deps(f)) if (!reached.has(d) && !manualChunks(d)) { reached.set(d, [...reached.get(f), rel(d)]); q.push(d); }
      }
      reached.delete(from);
      return reached;
    };
    const lazyReachers = new Map(); // unpinned module -> lazily pinned reachers
    const eagerFirst = new Set(); // unpinned modules an eager pin in the entry's static graph reaches
    const lazyInEntry = new Set(); // unpinned modules a lazy pin in the entry's static graph reaches
    for (const p of walk(SRC)) {
      const chunk = manualChunks(p);
      if (!chunk) continue;
      for (const u of unpinnedReach(p).keys()) {
        if (EAGER_CHUNKS.has(chunk)) { if (entryGraph.has(p)) eagerFirst.add(u); continue; }
        if (!lazyReachers.has(u)) lazyReachers.set(u, []);
        lazyReachers.get(u).push(`${rel(p)} [${chunk}]`);
        if (entryGraph.has(p)) lazyInEntry.add(u);
      }
    }
    const bad = [];
    for (const f of engineCore)
      for (const [u, path] of unpinnedReach(f)) {
        if (lazyReachers.has(u) && (!eagerFirst.has(u) || lazyInEntry.has(u)))
          bad.push(`${rel(f)} -> ${path.join(' -> ')} [unpinned; absorbed lazy by ${lazyReachers.get(u).join(', ')}]`);
        for (const d of deps(u)) {
          const chunk = manualChunks(d);
          if (chunk && !EAGER_CHUNKS.has(chunk)) bad.push(`${rel(f)} -> ${path.join(' -> ')} -> ${rel(d)} [${chunk}]`);
        }
      }
    return bad;
  };

  it('no engine-core module reaches, through UNPINNED hops, a module Rollup places lazy (FIRSTPAINT-5)', () => {
    const bad = unpinnedHopEdges();
    expect(bad, `engine-core (eager) statically reaches, through unpinned hops, a module Rollup's manual-chunk absorption places in a lazy chunk (or a lazily pinned module behind them). Excise and pin the engine-core importer with the lazy module it imports (vite.config.js FIRSTPAINT2_LAZY_DOMAIN):\n  ${bad.join('\n  ')}`).toEqual([]);
  });

  it('the same holds on the FLAGGED graph through unpinned hops (FIRSTPAINT-5)', () => {
    expect(existsSync(ABSENT), 'the absent twin the plugin resolves to').toBe(true);
    const bad = unpinnedHopEdges((dep) => (SWAPPED.has(dep) ? ABSENT : dep));
    expect(bad, `FLAGGED graph: engine-core (eager) statically reaches, through unpinned hops, a module placed lazy:\n  ${bad.join('\n  ')}`).toEqual([]);
  });

  // The smallest honest net (the header): the excised-but-unpinned modules, read from the derivation's
  // own list, are never reached from engine-core through unpinned hops.
  const EXCISED_UNPINNED = ENGINE_SHARED_DOMAIN_EXCISIONS.map((frag) => join(ROOT, frag.slice(1)))
    .filter((f) => existsSync(f) && !manualChunks(f));
  const excisedReach = (resolveDep = (dep) => dep) => {
    const bad = [];
    for (const f of engineCore) {
      const reached = new Map([[f, []]]);
      for (const q = [f]; q.length;) {
        const g = q.shift();
        for (const d of importsOf(g).map(resolveDep))
          if (!reached.has(d) && !manualChunks(d)) { reached.set(d, [...reached.get(g), rel(d)]); q.push(d); }
      }
      for (const e of EXCISED_UNPINNED) if (reached.has(e)) bad.push(`${rel(f)} -> ${reached.get(e).join(' -> ')} [excised, unpinned]`);
    }
    return bad;
  };

  it('no engine-core module reaches an EXCISED-BUT-UNPINNED module through unpinned hops (plain and flagged)', () => {
    expect(EXCISED_UNPINNED.map(rel), 'the net reads the derivation, liveInstitutionNames.js in it').toContain('src/domain/facts/liveInstitutionNames.js');
    const bad = [...excisedReach(), ...excisedReach((dep) => (SWAPPED.has(dep) ? ABSENT : dep)).map((e) => `FLAGGED ${e}`)];
    expect(bad, `engine-core (eager) reaches a module the derivation excised and nothing pinned; Rollup seats it with its first pinned reacher, possibly lazy. Excise and pin the engine-core importer with it (vite.config.js FIRSTPAINT2_LAZY_DOMAIN):\n  ${bad.join('\n  ')}`).toEqual([]);
  });

  it('shape (b) is walked: engine-core holds members the derivation seats only through a lazily pinned importer', () => {
    const factsOf = join(SRC, 'domain/facts/factsOf.js');
    expect(manualChunks(factsOf)).toBe('coherence-lazy');
    const importersOf = new Map();
    for (const g of walk(SRC)) for (const d of importsOf(g)) importersOf.set(d, [...(importersOf.get(d) || []), g]);
    const seatedThroughLazyPins = engineCore.filter((f) => {
      const importers = importersOf.get(f) || [];
      return importers.length > 0 && importers.every((g) => manualChunks(g) && !EAGER_CHUNKS.has(manualChunks(g)));
    });
    expect(seatedThroughLazyPins.length).toBeGreaterThan(5);
  });

  it('the unpinned-hop walk is not vacuous: it sees the shared unpinned modules it rules on', () => {
    // src/lib/entities.js is unpinned, read by engine-core (corruption.js, in the entry's static
    // graph) AND by lazily pinned modules: the walk must see it and rule it safe, not skip it.
    const entities = join(SRC, 'lib/entities.js');
    expect(manualChunks(entities), 'lib/entities.js is unpinned').toBeUndefined();
    expect(importsOf(join(SRC, 'domain/corruption.js'))).toContain(entities);
    expect(unpinnedHopEdges().some((e) => e.includes('src/lib/entities.js'))).toBe(false);
  });

  it('every static edge out of engine-core lands in an eager chunk or an unpinned module', () => {
    const bad = [];
    for (const f of engineCore)
      for (const dep of importsOf(f)) {
        const chunk = manualChunks(dep);
        if (chunk && !EAGER_CHUNKS.has(chunk)) bad.push(`${rel(f)} -> ${rel(dep)} [${chunk}]`);
      }
    expect(bad, `engine-core (eager) statically imports a lazily pinned module; first paint swallows that chunk and the graph can close a cycle. Excise and pin the importer (vite.config.js FIRSTPAINT2_LAZY_DOMAIN):\n  ${bad.join('\n  ')}`).toEqual([]);
  });
});
