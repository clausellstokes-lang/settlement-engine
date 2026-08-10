/**
 * Persisted envoy validation is deliberately cold: the browser pays for the
 * strict DTO/picture/peace-term closure when campaign rows hydrate, not while
 * first paint boots. The source graph catches the edge immediately; the fresh
 * VERIFY_DIST pass proves the validator is emitted but outside the entry's
 * transitive static chunk closure.
 */
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
const VALIDATOR_SENTINEL = 'invalid_gathered';

const COLD_MODULES = [
  'src/domain/worldPulse/envoyErrandRecords.js',
  'src/domain/worldPulse/envoyErrandVocabulary.js',
  'src/domain/worldPulse/negotiationPictures.js',
  'src/domain/worldPulse/peaceTermsCarriedSheet.js',
  'src/domain/worldPulse/peaceTermsCatalog.js',
  'src/domain/worldPulse/peaceTermsPrimitives.js',
];

function walkSource(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const abs = join(dir, entry);
    if (statSync(abs).isDirectory()) walkSource(abs, out);
    else if (/\.(js|jsx)$/.test(entry)) out.push(abs);
  }
  return out;
}

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

function sourceStaticSpecifiers(source) {
  const executable = source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '');
  const specs = new Set();
  for (const match of executable.matchAll(/\bfrom\s*['"]([^'"]+)['"]/g)) {
    specs.add(match[1]);
  }
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
    for (const specifier of sourceStaticSpecifiers(readFileSync(module, 'utf8'))) {
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

const chunksContaining = literal => readdirSync(ASSETS)
  .filter(file => file.endsWith('.js'))
  .filter(file => readFileSync(join(ASSETS, file), 'utf8').includes(literal));

describe('persisted envoy hydration stays outside first paint', () => {
  test('the source first-paint graph keeps the strict persistence closure cold', () => {
    const closure = sourceStaticClosure('src/main.jsx');

    expect(closure.length).toBeGreaterThan(100);
    expect(closure).toContain('src/store/campaignSliceEntry.js');
    expect(closure).toContain('src/store/campaignRuntimeBridge.js');
    // These absences measure coldness rather than an empty walk.
    // anchored: the three positives above pin `closure` as live, populated (>100)
    expect(closure).not.toContain('src/domain/worldPulse/worldState.js');
    // anchored: same live `closure` pinned by the length and entry-module positives above
    expect(closure).not.toContain('src/store/campaignSlice.js');
    // The live-`closure` pins above do NOT cover this loop's own two vacuity paths: an
    // emptied COLD_MODULES runs ZERO assertions and still reads green, and a renamed cold
    // module makes its absence trivially true forever. Pin arity and real addresses.
    expect(COLD_MODULES.length).toBeGreaterThanOrEqual(6);
    for (const module of COLD_MODULES) expect(existsSync(join(ROOT, module))).toBe(true);
    // anchored: COLD_MODULES pinned non-empty at on-disk addresses immediately above, and
    // anchored: `closure` pinned live by the length and entry-module positives at 130-132
    for (const module of COLD_MODULES) expect(closure).not.toContain(module);
  });

  test('the source fingerprint belongs to the strict records leaf', () => {
    const carriers = walkSource(SRC)
      .filter(module => readFileSync(module, 'utf8').includes(VALIDATOR_SENTINEL))
      .map(module => relative(ROOT, module).replace(/\\/g, '/'))
      .sort();
    expect(carriers).toEqual(['src/domain/worldPulse/envoyErrandRecords.js']);
  });

  test('VERIFY_DIST cannot pass without a fresh production build', () => {
    expect(
      !REQUIRE_DIST || DIST_EXISTS,
      'VERIFY_DIST=1 but dist/assets is absent — run `npm run build` first',
    ).toBe(true);
  });
});

describe.runIf(REQUIRE_DIST && DIST_EXISTS)('built persisted envoy hydration stays lazy', () => {
  test('the strict-validator fingerprint is absent from every entry-closure chunk', () => {
    const closure = entryChunkClosure();
    const carriers = closure.filter(chunk => (
      readFileSync(join(ASSETS, chunk), 'utf8').includes(VALIDATOR_SENTINEL)
    ));
    expect(carriers).toEqual([]);
  });

  test('the strict validator is emitted in a non-worker lazy chunk', () => {
    const carriers = chunksContaining(VALIDATOR_SENTINEL);
    expect(carriers.length).toBeGreaterThan(0);
    expect(carriers.some(file => !file.includes('.worker-'))).toBe(true);
  });
});
