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
 * that is not one of the eager chunks named below. An unpinned target is allowed: it is
 * not a pin, Rollup co-locates it, and the first-paint byte budget prices it.
 * The cure for a red is vite.config.js's convention: excise the engine-core member that
 * no true first-paint module reaches and pin it with the lazy module it imports,
 * measured beside the pin (FIRSTPAINT2_LAZY_DOMAIN).
 * @guards vite.config.js :: ENGINE_SHARED_DOMAIN, FIRSTPAINT2_LAZY_DOMAIN
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import viteConfig from '../../vite.config.js';

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
