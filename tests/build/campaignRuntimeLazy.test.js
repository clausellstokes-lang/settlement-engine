/** The campaign implementation is one cold capsule behind thin store entries. */
import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
} from 'node:fs';
import {
  dirname,
  extname,
  join,
  relative,
  resolve,
} from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';
import {
  buildChunkGraph,
  entryChunkFromHtml,
} from '../../scripts/boot-smoke.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const SRC = join(ROOT, 'src');
const DIST = join(ROOT, 'dist');
const ASSETS = join(DIST, 'assets');
const REQUIRE_DIST = process.env.VERIFY_DIST === '1';
const DIST_EXISTS = existsSync(join(DIST, 'index.html')) && existsSync(ASSETS);
const RUNTIME_SENTINEL = 'settlementforge_campaign_runtime_capsule_v1';
const BODY_SENTINELS = Object.freeze({
  'src/store/campaignSlice.js': 'settlementforge_campaign_core_body_v1',
  'src/store/campaignRegionalSlice.js': 'settlementforge_campaign_regional_body_v1',
  'src/store/campaignWorldPulseSlice.js': 'settlementforge_campaign_pulse_body_v1',
});

function resolveSourceImport(importer, specifier) {
  if (!specifier.startsWith('.')) return null;
  const base = resolve(dirname(importer), specifier);
  const extension = extname(base);
  if (extension && !/\.(?:js|jsx|mjs)$/.test(extension)) return null;
  const candidates = extension
    ? [base]
    : [
      `${base}.js`,
      `${base}.jsx`,
      `${base}.mjs`,
      join(base, 'index.js'),
      join(base, 'index.jsx'),
    ];
  return candidates.find(candidate => existsSync(candidate) && candidate.startsWith(SRC)) || null;
}

function staticSpecifiers(source) {
  const executable = source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '');
  const specs = new Set();
  for (const match of executable.matchAll(/\bfrom\s*['"]([^'"]+)['"]/g)) specs.add(match[1]);
  for (const match of executable.matchAll(/(?:^|[;\n])\s*import\s*['"]([^'"]+)['"]/g)) {
    specs.add(match[1]);
  }
  return [...specs];
}

function sourceStaticClosure(entryRelative) {
  const entry = join(ROOT, entryRelative);
  const seen = new Set([entry]);
  const queue = [entry];
  while (queue.length > 0) {
    const module = queue.shift();
    for (const specifier of staticSpecifiers(readFileSync(module, 'utf8'))) {
      const dependency = resolveSourceImport(module, specifier);
      if (dependency && !seen.has(dependency)) {
        seen.add(dependency);
        queue.push(dependency);
      }
    }
  }
  return [...seen]
    .map(module => relative(ROOT, module).replace(/\\/g, '/'))
    .sort();
}

function walkSource(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const absolute = join(dir, entry);
    if (statSync(absolute).isDirectory()) walkSource(absolute, out);
    else if (/\.(js|jsx)$/.test(entry)) out.push(absolute);
  }
  return out;
}

function entryChunkClosure() {
  const html = readFileSync(join(DIST, 'index.html'), 'utf8');
  const entry = entryChunkFromHtml(html);
  const graph = buildChunkGraph(ASSETS);
  const seen = new Set([entry]);
  const queue = [entry];
  while (queue.length > 0) {
    const chunk = queue.shift();
    for (const dependency of graph.get(chunk) || []) {
      if (!seen.has(dependency)) {
        seen.add(dependency);
        queue.push(dependency);
      }
    }
  }
  return [...seen].sort();
}

function chunkClosure(root, graph = buildChunkGraph(ASSETS)) {
  const seen = new Set([root]);
  const queue = [root];
  while (queue.length > 0) {
    const chunk = queue.shift();
    for (const dependency of graph.get(chunk) || []) {
      if (!seen.has(dependency)) {
        seen.add(dependency);
        queue.push(dependency);
      }
    }
  }
  return [...seen].sort();
}

const chunksContaining = literal => readdirSync(ASSETS)
  .filter(file => file.endsWith('.js'))
  .filter(file => readFileSync(join(ASSETS, file), 'utf8').includes(literal));

describe('campaign runtime capsule source boundary', () => {
  test('first paint contains only entries and the bridge, never campaign bodies', () => {
    const closure = sourceStaticClosure('src/main.jsx');
    for (const module of [
      'src/store/campaignSliceEntry.js',
      'src/store/campaignRegionalSliceEntry.js',
      'src/store/campaignWorldPulseSliceEntry.js',
      'src/store/campaignRuntimeBridge.js',
    ]) expect(closure).toContain(module);

    for (const module of [
      'src/store/campaignRuntime.js',
      'src/store/campaignSlice.js',
      'src/store/campaignRegionalSlice.js',
      'src/store/campaignWorldPulseSlice.js',
      'src/domain/worldPulse/worldState.js',
      'src/domain/worldPulse/simulationRules.js',
      // An empty closure reds in the four-module positive loop above, not here.
      // anchored: the same `closure` is proven live and correctly keyed by that loop
    ]) expect(closure).not.toContain(module);
  });

  test('the bridge has one dynamic capsule edge and no static implementation edge', () => {
    const bridge = readFileSync(join(SRC, 'store/campaignRuntimeBridge.js'), 'utf8');
    expect(bridge).toContain("import('./campaignRuntime.js')");
    // The previous form here — not.toEqual(arrayContaining([all four])) — asserted
    // NOTHING. `staticSpecifiers(bridge)` is legitimately [] at head, and
    // `expect([]).not.toEqual(expect.arrayContaining([...]))` passes; worse,
    // arrayContaining is ALL-OR-NOTHING, so it only fires when all four specifiers are
    // present at once. A bridge with the ONE static implementation edge this test is
    // named for shipped green. Per-specifier absences fire on any single edge.
    //
    // LIVENESS CONTROL. No same-subject positive is possible, because the correct
    // answer for this bridge really is the empty list. So drive the parser over this
    // bridge's OWN text with one static edge spliced in: a parser whose regex rotted
    // and returned [] for every input reds here instead of greening every absence.
    expect(staticSpecifiers(`import './__probe__.js';\n${bridge}`)).toContain('./__probe__.js');
    for (const specifier of [
      './campaignRuntime.js',
      './campaignSlice.js',
      './campaignRegionalSlice.js',
      './campaignWorldPulseSlice.js',
      // anchored: the parser is proven live on this exact bridge text by the probe above
    ]) expect(staticSpecifiers(bridge)).not.toContain(specifier);
  });

  test('the runtime fingerprint has exactly one source owner', () => {
    const carriers = walkSource(SRC)
      .filter(module => readFileSync(module, 'utf8').includes(RUNTIME_SENTINEL))
      .map(module => relative(ROOT, module).replace(/\\/g, '/'));
    expect(carriers).toEqual(['src/store/campaignRuntime.js']);
  });

  test('the runtime static source closure owns every implementation body and sentinel', () => {
    const runtimeClosure = sourceStaticClosure('src/store/campaignRuntime.js');
    const mainClosure = sourceStaticClosure('src/main.jsx');
    // LIVENESS ANCHOR for the mainClosure negative in the loop. The positive beside it
    // measures runtimeClosure — a DIFFERENT collection — so a main.jsx walk that
    // silently returned [] would satisfy every absence below without reding anything.
    expect(mainClosure).toContain('src/store/campaignRuntimeBridge.js');
    for (const [module, sentinel] of Object.entries(BODY_SENTINELS)) {
      expect(runtimeClosure).toContain(module);
      // anchored: mainClosure is proven live by the bridge module pinned above
      expect(mainClosure).not.toContain(module);
      const carriers = walkSource(SRC)
        .filter(candidate => readFileSync(candidate, 'utf8').includes(sentinel))
        .map(candidate => relative(ROOT, candidate).replace(/\\/g, '/'));
      expect(carriers).toEqual([module]);
    }
  });

  test('the static parser follows both export-star and named re-export edges', () => {
    expect(staticSpecifiers([
      "export * from './star.js';",
      "export { named } from './named.js';",
    ].join('\n')).sort()).toEqual(['./named.js', './star.js']);
  });

  test('second-stage pulse chunk promises clear on rejection for action retry', () => {
    const pulse = readFileSync(join(SRC, 'store/campaignWorldPulseSlice.js'), 'utf8');
    expect(pulse).toMatch(/_worldEnginePromise\s*=\s*null;\s*throw error;/s);
    expect(pulse).toMatch(/_deferredPulseMutationsPromise\s*=\s*null;\s*throw error;/s);
  });

  test('VERIFY_DIST cannot pass without a fresh production build', () => {
    expect(
      !REQUIRE_DIST || DIST_EXISTS,
      'VERIFY_DIST=1 but dist/assets is absent — run `npm run build` first',
    ).toBe(true);
  });
});

describe.runIf(REQUIRE_DIST && DIST_EXISTS)('built campaign runtime capsule boundary', () => {
  test('the runtime fingerprint is absent from the entry closure', () => {
    const closure = entryChunkClosure();
    expect(closure.filter(chunk => (
      readFileSync(join(ASSETS, chunk), 'utf8').includes(RUNTIME_SENTINEL)
    ))).toEqual([]);
  });

  test('the runtime fingerprint survives in a non-worker lazy chunk', () => {
    const carriers = chunksContaining(RUNTIME_SENTINEL);
    expect(carriers).toHaveLength(1);
    // The length pin proves the ARRAY holds one element; this proves that element is a
    // real chunk FILENAME, which is what the absence below actually questions.
    expect(carriers[0]).toMatch(/\.js$/);
    // anchored: carriers[0] is pinned to exactly one real .js chunk name above
    expect(carriers[0]).not.toContain('.worker-');
  });

  test('all three implementation bodies live only in the runtime chunk closure', () => {
    const runtimeCarriers = chunksContaining(RUNTIME_SENTINEL);
    expect(runtimeCarriers).toHaveLength(1);
    const runtimeClosure = new Set(chunkClosure(runtimeCarriers[0]));
    const entryClosure = new Set(entryChunkClosure());

    for (const sentinel of Object.values(BODY_SENTINELS)) {
      const carriers = chunksContaining(sentinel);
      expect(carriers).toHaveLength(1);
      expect(runtimeClosure.has(carriers[0])).toBe(true);
      expect(entryClosure.has(carriers[0])).toBe(false);
    }
  });
});
