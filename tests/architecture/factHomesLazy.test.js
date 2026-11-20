/**
 * tests/architecture/factHomesLazy.test.js — the fact homes of "an input is at hand" ride LAZY, beside facts/factsOf.js
 * (BAR4-FIRSTPAINT, 2026-11-16; the round's first-paint regression).
 *
 * THE CLASS. vite.config.js derives ENGINE_SHARED_DOMAIN from the generators' domain imports and routes every member into
 * the EAGER engine-core chunk. facts/houseInputAtHand.js is generator-reached, so it rode first paint, and the chair's HW1
 * gave it a static import of data/crisisDependence.js, which imports data/institutionServices.js: both tables left
 * data-lazy for the eager `data` chunk (first paint 1,143,114 B raw at f19c3b28b, 1,291,683 at 7738e71be). No module of
 * the true first-paint graph reads any of it; the atoms it serves (`timber at hand`, `timber reaches the saws`, `trade at
 * work: <trade>`) are read only through facts/factsOf.js, which rides coherence-lazy.
 *
 * THIS GUARD needs no build. It reads vite.config.js's own derivations (EAGER_FIRST_PAINT_MODULES and the shipped
 * manualChunks), never a replica:
 *   (a) the eager first-paint module graph holds none of the four fact homes and neither of the two tables, and still
 *       holds the eager vocabulary that names their atoms (facts/factVocabulary.js), so the absence is not vacuous;
 *   (b) THE ONE DOOR: manualChunks routes the four homes to the chunk facts/factsOf.js rides, so a getter of factsOf runs
 *       only after the chunk that holds the homes has evaluated; and every static importer of the four in src/ is one of
 *       them, factsOf.js, a module routed to a lazy chunk, or a module the eager graph does not reach.
 * @guards vite.config.js :: FIRSTPAINT2_LAZY_DOMAIN (the BAR4-FIRSTPAINT block)
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import viteConfig, { EAGER_FIRST_PAINT_MODULES } from '../../vite.config.js';

const ROOT = resolve(__dirname, '../..');
const SRC = join(ROOT, 'src');
const manualChunks = viteConfig.build.rollupOptions.output.manualChunks;

/** The fact homes of the one reading, and the two tables the reading's spent-ground half brings. */
const HOMES = Object.freeze([
  'src/domain/facts/houseInputAtHand.js',
  'src/domain/facts/timberAtHand.js',
  'src/domain/facts/tradeAtWork.js',
  'src/domain/facts/sceneSupply.js',
]);
const TABLES = Object.freeze(['src/data/crisisDependence.js', 'src/data/institutionServices.js']);
const FACTS_OF = 'src/domain/facts/factsOf.js';
/** The chunks in the entry's first-paint closure by design (tests/architecture/engineCoreLazyEdge.test.js's set). */
const EAGER_CHUNKS = new Set(['engine-core', 'data', 'kernel', 'content-identity', 'det-math']);

const rel = (abs) => abs.slice(ROOT.length + 1);
const eager = new Set([...EAGER_FIRST_PAINT_MODULES].map(rel));
const route = (file) => manualChunks(join(ROOT, file), { getModuleInfo: () => null, getModuleIds: () => [][Symbol.iterator]() }) ?? null;

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
// vite.config.js :: computeEagerModuleGraph's static-edge spelling (a dynamic import() is a lazy boundary).
const importsOf = (file) => {
  const code = readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  const specs = [];
  for (const m of code.matchAll(/(?:^|[^.\w])import\s+(?:[^'"()]*?\sfrom\s+)?['"]([^'"]+)['"]/g)) specs.push(m[1]);
  for (const m of code.matchAll(/(?:^|[^.\w])export\s+[^'"]*?\sfrom\s+['"]([^'"]+)['"]/g)) specs.push(m[1]);
  return specs.map((s) => resolveRel(file, s)).filter(Boolean).map(rel);
};

describe('BAR4-FIRSTPAINT: the fact homes of "an input is at hand" ride lazy, beside factsOf', () => {
  it('(a) the eager first-paint graph holds none of the four homes and neither table', () => {
    // the positive control: the derivation is the live one, and it holds the eager vocabulary that names the atoms
    expect(eager.size).toBeGreaterThan(100);
    expect(eager.has('src/domain/facts/factVocabulary.js')).toBe(true);
    expect(eager.has('src/domain/facts/drawDeclared.js')).toBe(true);
    for (const f of [...HOMES, ...TABLES, FACTS_OF]) expect(existsSync(join(ROOT, f)), f).toBe(true);
    expect([...HOMES, ...TABLES].filter((f) => eager.has(f))).toEqual([]);
  });

  it('(b) the four homes ride the chunk factsOf rides, a lazy one', () => {
    const chunk = route(FACTS_OF);
    expect(chunk).toBe('coherence-lazy');
    expect(EAGER_CHUNKS.has(chunk)).toBe(false);
    expect(Object.fromEntries(HOMES.map((f) => [f, route(f)]))).toEqual(Object.fromEntries(HOMES.map((f) => [f, chunk])));
  });

  it('(b) every static importer of the four is one of them, factsOf, a lazily routed module, or off the eager graph', () => {
    const importers = walk(SRC).map(rel).filter((f) => importsOf(join(ROOT, f)).some((d) => HOMES.includes(d)));
    // the positive control: the reading's known doors are seen
    expect(importers).toEqual(expect.arrayContaining([FACTS_OF, 'src/generators/resourceGenerator.js', 'src/domain/display/validationOnPage.js']));
    const eagerDoors = importers.filter((f) => !HOMES.includes(f) && f !== FACTS_OF && (eager.has(f) || EAGER_CHUNKS.has(route(f))));
    expect(eagerDoors).toEqual([]);
  });
});
