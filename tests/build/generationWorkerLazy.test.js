/**
 * generationWorkerLazy.test.js — THE CONTRACT OF THE GENERATION TRANSPORT'S
 * LAZY BOUNDARY.
 *
 * The generation lane left the eager store slice so that the entry chunk stops
 * carrying it, and the worker transport was built wire-lean so that the happy
 * path never fetches the engine chunk on the main thread at all. Both are
 * SOURCE-SHAPE properties that a single careless static import would undo
 * silently, which is why they are pinned here rather than trusted:
 *
 *   1. the slice reaches the lane only through `import()`;
 *   2. the lane, the client, the core and the protocol are all outside vite's
 *      OWN derivation of the eager first-paint graph;
 *   3. the client never imports the core, so the fallback (and only the
 *      fallback) pays for the engine chunk;
 *   4. nothing under `src/workers/` imports the store or a persistence service;
 *   5. the protocol leaf really is import-free, which is what lets it be
 *      co-located into every chunk that needs it at zero cost.
 *
 * The dist arms are `describe.runIf(distExists)` in the estate's idiom: a stale
 * or missing dist can only UNDER-report, and the post-build `VERIFY_DIST=1`
 * re-run is what makes them binding. The unconditional anti-vacuity `it` below
 * turns "VERIFY_DIST=1 with no dist" into a hard failure instead of a skip.
 *
 * ⚠ DELIBERATELY ABSENT, AND RECORDED RATHER THAN FORGOTTEN: a
 * `WORKER_BUNDLE_CEILING_BYTES` arm. A monotone-down byte ceiling must be minted
 * from a MEASURED build, and this lane took no build. Writing the ceiling from a
 * figure measured on another tip would pin a number with no receipt behind it,
 * which is the false-instrument class the estate exists to refuse. The landing
 * lane that builds owes that arm.
 *
 * @enforced-by this test
 */

import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

import { EAGER_FIRST_PAINT_MODULES } from '../../vite.config.js';

const ROOT = resolve(process.cwd());
const DIST = join(ROOT, 'dist');
const ASSETS = join(DIST, 'assets');
const DIST_EXISTS = existsSync(DIST) && existsSync(ASSETS);
const REQUIRE_DIST = process.env.VERIFY_DIST === '1';
const SENTINEL = 'settlementforge:generation:worker-v1';

const source = (path) => readFileSync(join(ROOT, path), 'utf8');

/** Relative-specifier static imports, the customContentPreviewLazy idiom. */
function staticImports(code) {
  const out = new Set();
  const from = /\bfrom\s*["'](\.[^"']+\.js)["']/g;
  const bare = /(?:^|[;}])import\s*["'](\.[^"']+\.js)["']/g;
  let match;
  while ((match = from.exec(code)) !== null) out.add(match[1]);
  while ((match = bare.exec(code)) !== null) out.add(match[1]);
  return [...out];
}

function entryClosure() {
  const html = readFileSync(join(DIST, 'index.html'), 'utf8');
  const entry = html.match(/<script[^>]*type="module"[^>]*src="\/assets\/([^"]+)"/)?.[1];
  if (!entry) throw new Error('Production entry chunk was not found.');
  const seen = new Set([entry]);
  const queue = [entry];
  while (queue.length > 0) {
    const file = queue.shift();
    const code = readFileSync(join(ASSETS, file), 'utf8');
    for (const dependency of staticImports(code)) {
      const name = dependency.replace(/^\.\//, '');
      if (!seen.has(name)) {
        seen.add(name);
        queue.push(name);
      }
    }
  }
  return [...seen];
}

const eagerRelative = () => new Set(
  [...EAGER_FIRST_PAINT_MODULES].map(abs => relative(ROOT, abs).split('\\').join('/')),
);

describe('generation worker — source boundary', () => {
  it('the slice reaches the generation lane only through import(), never a static import', () => {
    const slice = source('src/store/settlementSlice.js');
    expect(slice).toMatch(/import\(['"]\.\/settlementGenerateAction\.js['"]\)/);
    // anchored: the positive toMatch on the line above proves the specifier is present in this file, so a drift that renamed or removed the lane would red there first rather than vacate this negative.
    expect(slice).not.toMatch(/^import\s[^;]*settlementGenerateAction/m);
  });

  it('the generation lane, the client, the core and the protocol are outside vite\'s own eager first-paint graph', () => {
    const eager = eagerRelative();
    // Non-vacuity first: the derivation must actually have produced a graph, or
    // "absent from the eager set" is true of every string in the world.
    expect(eager.size).toBeGreaterThan(50);
    expect(eager.has('src/store/settlementSlice.js')).toBe(true);

    const shouldBeLazy = [
      'src/store/settlementGenerateAction.js',
      'src/lib/generationClient.js',
      'src/lib/generationProtocol.js',
      'src/workers/generationRequest.js',
      'src/workers/generation.worker.js',
      'src/store/settlementContentRuntime.js',
      'src/lib/anonGenCounter.js',
    ];
    const leaked = shouldBeLazy.filter(rel => eager.has(rel));
    expect(
      leaked,
      `these modules are reachable from vite's EAGER first-paint graph and must not be: ${leaked.join(', ')}`,
    ).toEqual([]);
  });

  it('the client constructs the worker from its URL and never statically imports the core (the wire-lean law)', () => {
    const client = source('src/lib/generationClient.js');
    expect(client).toMatch(/new Worker\(new URL\(['"]\.\.\/workers\/generation\.worker\.js['"], import\.meta\.url\)/);
    expect(staticImports(client)).toEqual(['./generationProtocol.js']);
    // anchored: staticImports(client) is asserted to be exactly one entry on the line above, so this file's import list is proven non-empty and readable before the absence below is read.
    expect(client).not.toMatch(/generationRequest/);
  });

  it('the worker shell statically imports the core and the protocol, and nothing under src/workers imports the store, saves or a DOM global', () => {
    const shell = source('src/workers/generation.worker.js');
    expect(staticImports(shell).sort()).toEqual(['../lib/generationProtocol.js', './generationRequest.js']);

    const workerFiles = readdirSync(join(ROOT, 'src/workers')).filter(f => /\.js$/.test(f));
    expect(workerFiles.length).toBeGreaterThanOrEqual(5); // the scan is not vacuous
    const offenders = [];
    for (const file of workerFiles) {
      const code = source(`src/workers/${file}`);
      for (const banned of ['store/index.js', 'savesService', 'localStorage', 'sessionStorage']) {
        if (code.includes(banned)) offenders.push(`src/workers/${file}: ${banned}`);
      }
    }
    expect(
      offenders,
      `a worker module reached for the store, a persistence service or browser storage: ${offenders.join(', ')}`,
    ).toEqual([]);
  });

  it('the protocol leaf has no imports', () => {
    const protocol = source('src/lib/generationProtocol.js');
    expect(staticImports(protocol)).toEqual([]);
    // anchored: the assertion above proves the parser ran over a real file whose import list is empty; this line pins that no dynamic import was added either, and the file is read by path so it cannot silently vanish.
    expect(protocol).not.toMatch(/\bimport\s*\(/);
    expect(protocol).toContain(SENTINEL);
  });

  it('when VERIFY_DIST=1, dist/ + dist/assets exist (post-build must verify, not skip)', () => {
    expect(
      !REQUIRE_DIST || DIST_EXISTS,
      'VERIFY_DIST=1 but dist/assets is absent — a skipped post-build chunk contract is green-on-nothing; run `npm run build` first',
    ).toBe(true);
  });
});

describe.runIf(DIST_EXISTS)('generation worker — production boundary', () => {
  it('the worker contract sentinel is absent from the entry static closure', () => {
    const closure = entryClosure();
    expect(closure.length).toBeGreaterThan(1); // the BFS actually walked
    const carriers = closure.filter(file => readFileSync(join(ASSETS, file), 'utf8').includes(SENTINEL));
    expect(
      carriers,
      `first-paint chunks carrying the generation worker contract: ${carriers.join(', ')}`,
    ).toEqual([]);
  });

  it('exactly one generation.worker bundle is emitted, and it is a single chunk because vite inlines a worker entry\'s dynamic imports', () => {
    const bundles = readdirSync(ASSETS).filter(f => /^generation\.worker-.*\.js$/.test(f));
    expect(bundles.length).toBe(1);
    const code = readFileSync(join(ASSETS, bundles[0]), 'utf8');
    // Vite compiles a worker entry with its dynamic imports INLINED (no
    // `worker.rollupOptions` is configured), so the whole graph is one file.
    // The sibling customContentPreview worker in the same build is the
    // precedent. If this ever becomes 2, a code split appeared inside the
    // worker and a second cold fetch now sits inside the user's wait.
    expect(code.match(/\bimport\s*\(/g) || []).toEqual([]);
    expect(staticImports(code)).toEqual([]);
  });

  it('the sentinel ships outside first paint, in the generation lane\'s chunk and in the worker bundle', () => {
    const eagerSet = new Set(entryClosure());
    const carriers = readdirSync(ASSETS)
      .filter(f => f.endsWith('.js') && !eagerSet.has(f))
      .filter(f => readFileSync(join(ASSETS, f), 'utf8').includes(SENTINEL));
    expect(
      carriers.length,
      `chunks outside first paint carrying the contract: ${carriers.join(', ')}`,
    ).toBeGreaterThanOrEqual(2);
  });
});
