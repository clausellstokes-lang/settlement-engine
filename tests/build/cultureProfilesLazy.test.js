/**
 * tests/build/cultureProfilesLazy.test.js — the first-paint contract for the
 * governed culture corpus (FP-G16, 2026-08-01).
 *
 * WHAT WAS RECLAIMED. `src/data/cultureProfiles.js` is a ~33 kB governed corpus:
 * seven design grammars of civic form, exchange, foodways, sacred life and defense.
 * Nothing on the open path reads it — generation materializes a cultural identity
 * from it, and two LAZY surfaces (ConfigurationPanel, new/dailyLifeLogic) render it.
 * It rode first paint anyway, through a 466-byte re-export boundary:
 * `domain/cultureProfiles.js` is imported by three generators, so
 * computeEngineSharedDomain() derived it into the EAGER `engine-core` chunk, and
 * because the boundary was then a member of the eager module graph the derived
 * EAGER_DATA classifier routed the corpus itself into the EAGER `data` chunk with
 * it. Excising the boundary (vite.config's ENGINE_SHARED_DOMAIN delete list) and
 * pinning it to `engine-core-lazy` took ~24.9 kB out of the first-paint `data`
 * chunk. Placement-only: no source module changed, so generation is byte-identical.
 *
 * WHY A NAMED PIN AND NOT JUST THE BYTE RATCHET. The ratchet catches the
 * REGRESSION but names no culprit, and it has ~19 kB of margin now, so the corpus
 * could quietly return without turning it red. This pin names the file.
 *
 * FOUR LAYERS:
 *   1. SOURCE GRAPH — nothing reachable from `src/main.jsx` by STATIC edges reaches
 *      either the boundary or the corpus. Runs without a build; anchored by a
 *      module that IS in the graph.
 *   2. CONFIG — the boundary is excised from ENGINE_SHARED_DOMAIN *and* pinned to a
 *      lazy chunk. Leaving it unpinned is the FP-G11 formatNumber incident: an
 *      orphan co-locates into the big `engine` chunk and the lazy UI surfaces then
 *      fetch the whole generation engine to read a culture paragraph.
 *   3. DIST ABSENCE (ungated) — the corpus fingerprint is not in the entry's
 *      transitive static closure.
 *   4. DIST PRESENCE (VERIFY_DIST=1) — the corpus still exists in SOME chunk. A
 *      pure absence assertion is equally satisfied by the corpus being deleted or
 *      tree-shaken, which is exactly the vacuity this pair closes.
 *
 * @see tests/build/vendorPdfLazy.test.js — the first-paint byte ratchet.
 */

import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { resolve, join, dirname } from 'node:path';

const ROOT = process.cwd();
const SRC = resolve(ROOT, 'src');
const distDir = resolve(ROOT, 'dist');
const assetsDir = join(distDir, 'assets');
const distExists = existsSync(distDir) && existsSync(assetsDir);
const requireDistRead = process.env.VERIFY_DIST === '1';

const BOUNDARY = resolve(SRC, 'domain/cultureProfiles.js');
const CORPUS = resolve(SRC, 'data/cultureProfiles.js');
const EAGER_ANCHOR = resolve(SRC, 'store/index.js');

// A governed corpus sentence minted in exactly one source module, riding a LIVE
// property of a frozen profile that lazy consumers read — so minification keeps it
// and tree-shaking cannot strip it.
const CORPUS_FINGERPRINT = 'A timber-and-stone, guild-and-estate design grammar.';

function staticSourceSpecifiers(code) {
  const stripped = code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  const specs = new Set();
  for (const m of stripped.matchAll(/(?:^|[^.\w])import\s+(?:[^'"()]*?\sfrom\s+)?['"]([^'"]+)['"]/g)) specs.add(m[1]);
  for (const m of stripped.matchAll(/(?:^|[^.\w])export\s+[^'"]*?\sfrom\s+['"]([^'"]+)['"]/g)) specs.add(m[1]);
  return [...specs];
}

function resolveRelative(from, spec) {
  if (!spec.startsWith('.')) return null;
  const base = resolve(dirname(from), spec);
  for (const candidate of [base, `${base}.js`, `${base}.jsx`, join(base, 'index.js'), join(base, 'index.jsx')]) {
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  }
  return null;
}

function firstPaintSourceGraph() {
  const entry = resolve(SRC, 'main.jsx');
  const seen = new Set([entry]);
  const parent = new Map();
  const queue = [entry];
  while (queue.length) {
    const file = queue.shift();
    for (const spec of staticSourceSpecifiers(readFileSync(file, 'utf-8'))) {
      const dep = resolveRelative(file, spec);
      if (!dep || seen.has(dep)) continue;
      seen.add(dep);
      parent.set(dep, file);
      queue.push(dep);
    }
  }
  return { seen, parent };
}

function staticChunkSpecifiers(code) {
  const specs = new Set();
  for (const m of code.matchAll(/\bfrom\s*["'](\.\/[^"']+\.js)["']/g)) specs.add(m[1].replace('./', ''));
  for (const m of code.matchAll(/(?:^|[;}])import\s*["'](\.\/[^"']+\.js)["']/g)) specs.add(m[1].replace('./', ''));
  return [...specs];
}

function entryStaticClosure() {
  const html = readFileSync(join(distDir, 'index.html'), 'utf-8');
  const m = html.match(/<script[^>]*type="module"[^>]*src="\/assets\/([^"]+)"/);
  if (!m) throw new Error('Could not locate entry <script type="module"> in dist/index.html');
  const seen = new Set([m[1]]);
  const queue = [m[1]];
  while (queue.length) {
    const file = queue.shift();
    for (const dep of staticChunkSpecifiers(readFileSync(join(assetsDir, file), 'utf-8'))) {
      if (!seen.has(dep)) { seen.add(dep); queue.push(dep); }
    }
  }
  return [...seen];
}

describe('FP-G16 — the culture corpus stays off the open path (source + config)', () => {
  it('no module reachable from main.jsx statically reaches the boundary or the corpus', () => {
    const { seen, parent } = firstPaintSourceGraph();
    // ANCHOR: a module that IS eager, so an empty or broken walk cannot satisfy the
    // exclusions below for the wrong reason.
    expect(
      seen.has(EAGER_ANCHOR),
      'the first-paint source graph does not contain src/store/index.js — the walk is broken, '
      + 'so the exclusions below prove nothing',
    ).toBe(true);
    const chainTo = (file) => {
      const chain = [];
      let cur = file;
      while (cur) { chain.push(cur.slice(ROOT.length + 1)); cur = parent.get(cur); }
      return chain.reverse().join(' -> ');
    };
    for (const target of [BOUNDARY, CORPUS]) {
      expect(
        seen.has(target),
        `${target.slice(ROOT.length + 1)} re-entered the first-paint static graph via `
        + `${seen.has(target) ? chainTo(target) : '(unreachable)'}. Read the culture corpus from a `
        + 'lazy surface or behind a dynamic import; it is ~33 kB no anon landing path needs.',
      ).toBe(false);
    }
  });

  it('vite.config excises the boundary from ENGINE_SHARED_DOMAIN AND pins it lazily', () => {
    const config = readFileSync(resolve(ROOT, 'vite.config.js'), 'utf-8');
    // The excision: without it the generator-derived closure routes the boundary
    // into eager engine-core and drags the corpus back into the eager data chunk.
    expect(
      config,
      'vite.config must delete /src/domain/cultureProfiles.js from ENGINE_SHARED_DOMAIN',
    ).toMatch(/['"]\/src\/domain\/cultureProfiles\.js['"],/);
    // The pin: an excised-but-unpinned module co-locates into the big lazy `engine`
    // chunk (FP-G11), which is not a first-paint regression but makes both lazy UI
    // consumers fetch the whole generator.
    expect(
      config,
      'vite.config must pin /src/domain/cultureProfiles.js into a lazy chunk (engine-core-lazy)',
    ).toMatch(/id\.includes\('\/src\/domain\/cultureProfiles\.js'\)/);
  });

  it('the corpus fingerprint is minted in exactly one source module', () => {
    const walk = (dir, out = []) => {
      for (const entry of readdirSync(dir)) {
        const p = join(dir, entry);
        if (statSync(p).isDirectory()) walk(p, out);
        else if (/\.jsx?$/.test(entry)) out.push(p);
      }
      return out;
    };
    const hits = walk(SRC).filter(f => readFileSync(f, 'utf-8').includes(CORPUS_FINGERPRINT));
    expect(
      hits.map(f => f.slice(ROOT.length + 1)),
      `the fingerprint "${CORPUS_FINGERPRINT}" must be minted in exactly one source module`,
    ).toHaveLength(1);
  });
});

describe.runIf(distExists)('FP-G16 — the culture corpus stays off the open path (dist)', () => {
  it('the corpus is ABSENT from the entry transitive static closure', () => {
    const leaked = entryStaticClosure()
      .filter(f => readFileSync(join(assetsDir, f), 'utf-8').includes(CORPUS_FINGERPRINT));
    expect(
      leaked,
      `data/cultureProfiles.js reached first paint via the static graph (chunks: ${leaked.join(', ')}). `
      + 'An eager static importer of domain/cultureProfiles.js returns the whole corpus to the data chunk.',
    ).toHaveLength(0);
  });

  it.skipIf(!requireDistRead)('the corpus DOES exist in a lazy chunk (the absence above is a move, not a deletion)', () => {
    const carriers = readdirSync(assetsDir)
      .filter(f => f.endsWith('.js'))
      .filter(f => readFileSync(join(assetsDir, f), 'utf-8').includes(CORPUS_FINGERPRINT));
    expect(
      carriers.length,
      `the corpus fingerprint "${CORPUS_FINGERPRINT}" is in NO dist chunk — either the copy changed or `
      + 'the corpus was tree-shaken out entirely, which would make the absence assertion above vacuous.',
    ).toBeGreaterThan(0);
  });
});
