/**
 * tests/build/engineBundleReplay.test.js — THE ENGINE BUNDLE IS THE ENGINE (ENGINE-1, unit 2).
 *
 * `supabase/functions/_shared/engineBundle.js` is what the `engine-generate` edge function
 * runs: an esbuild bundle of `src/engine/serviceEntry.js` (scripts/build-edge-shared.mjs).
 * The service is only worth having if a settlement it returns is the settlement the app
 * would have generated in-process for the same seed and config. This suite loads the
 * COMMITTED bundle in Node and proves that, byte for byte, over every configuration of
 * the generator golden master's corpus (tests/helpers/goldenMasterCorpus.js, 525 rows),
 * called exactly as tests/property/generatorGoldenMaster.test.js calls the pipeline.
 *
 * It is therefore also the engine bundle's freshness pin: any edit to a module the
 * pipeline reaches, without `npm run build:edge-shared`, moves the in-process side and
 * not the bundle, and the first title reds naming the rows.
 *
 * THE TITLES
 *   1. Bundle vs in-process, JSON-equal on every row. Holds whatever the fixture says.
 *   2. Bundle vs the committed golden fixture. While the golden is pending a signed
 *      re-record, the fixture is stale for the engine as a whole, and this title SKIPS —
 *      but only after proving the staleness is exactly that: the key sets agree, and the
 *      in-process pipeline drifts from the fixture on the SAME rows with the SAME hashes
 *      the bundle produces. A bundle-only drift, or a key-set change, fails instead.
 *   3. NEGATIVE CONTROL: a temp copy of the bundle with a planted edit is NOT accepted
 *      by the comparison title 1 makes (the guard is not vacuous).
 *   4. THE ESPIONAGE FENCE'S DRIVEN CORPUS (the design's replay guarantee, item 2: "the
 *      generator golden master ... and the espionage fence constant byte for byte"): the
 *      360 settlements of tests/property/espionageDormancyFence.test.js's FENCE 1, generated
 *      through the bundle, equal the in-process ones; and their corpus hash is compared to
 *      the fence's PRE_COUPLING_CORPUS_SHA with title 2's known-stale rule. The constant and
 *      the corpus dimensions are READ OUT OF THE FENCE'S SOURCE (one spelling), and the
 *      fence's seed template and call are pinned verbatim, so a re-spelt fence reds here.
 *   5. THE SERVICE'S BIRTH (unit 3's chain, Node link): for the three cases of
 *      tests/fixtures/engine-generate-cases.json, the bundle's birth (its own
 *      loadGenerationLawPayloads + birthConfig + pipeline — what engine-generate runs)
 *      equals the in-process birth. supabase/functions/engine-generate/index.test.ts is
 *      the Deno link: the function's settlement equals the bundle's birth, same cases.
 */

import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { goldenCorpus, keyOf } from '../helpers/goldenMasterCorpus.js';

// The file's own address, never the working directory (moduleScopeCwdRatchet; TOOL-31's shape).
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const BUNDLE = resolve(ROOT, 'supabase', 'functions', '_shared', 'engineBundle.js');
const FIXTURE = resolve(ROOT, 'tests', 'fixtures', 'generator-golden-master.json');
const SERVICE_CASES = resolve(ROOT, 'tests', 'fixtures', 'engine-generate-cases.json');
const ESPIONAGE_FENCE = resolve(ROOT, 'tests', 'property', 'espionageDormancyFence.test.js');

/** The fence's key-sorted serializer, verbatim (its corpus hash is over THIS form). */
function stable(v) {
  if (v === null || typeof v !== 'object') return JSON.stringify(v) ?? 'null';
  if (Array.isArray(v)) return `[${v.map(stable).join(',')}]`;
  return `{${Object.keys(v).sort().map((k) => `${JSON.stringify(k)}:${stable(v[k])}`).join(',')}}`;
}

/**
 * FENCE 1's corpus, read from the fence's own source.
 * @param {string} src
 */
function fenceCorpus(src) {
  const pick = (re, what) => {
    const m = src.match(re);
    expect(m, `could not read ${what} out of espionageDormancyFence.test.js`).toBeTruthy();
    return m[1];
  };
  const list = (body) => [...body.matchAll(/'([^']+)'/g)].map((m) => m[1]);
  return {
    constant: pick(/const PRE_COUPLING_CORPUS_SHA = '([0-9a-f]{64})';/, 'PRE_COUPLING_CORPUS_SHA'),
    tiers: list(pick(/const CORPUS_TIERS = Object\.freeze\(\[([^\]]+)\]\)/, 'CORPUS_TIERS')),
    routes: list(pick(/const CORPUS_ROUTES = Object\.freeze\(\[([^\]]+)\]\)/, 'CORPUS_ROUTES')),
    seeds: Number(pick(/const CORPUS_SEEDS = (\d+);/, 'CORPUS_SEEDS')),
  };
}
const ROWS = goldenCorpus();
const WALL_MS = 600_000;

/** @param {string} s */
const sha256 = (s) => createHash('sha256').update(s).digest('hex');

/**
 * One row's settlement JSON, generated exactly as the golden master generates it.
 * @param {(cfg: object, n: null, o: object) => unknown} generate
 * @param {{_seed: string}} row
 */
function settlementJson(generate, row) {
  const { _seed, ...cfg } = row;
  return JSON.stringify(generate(cfg, null, { seed: _seed, customContent: {} }));
}

/** @param {string} path */
async function loadBundle(path) {
  return import(/* @vite-ignore */ pathToFileURL(path).href);
}

/**
 * Both sides, every row, computed once and shared by titles 1 and 2.
 * @type {Promise<{ mismatched: string[], bundleHash: Record<string,string>, inProcHash: Record<string,string> }> | null}
 */
let replay = null;
function runReplay() {
  replay ??= (async () => {
    const bundle = await loadBundle(BUNDLE);
    const mismatched = [];
    /** @type {Record<string,string>} */ const bundleHash = {};
    /** @type {Record<string,string>} */ const inProcHash = {};
    for (const row of ROWS) {
      const k = keyOf(row);
      const viaBundle = settlementJson(bundle.generateSettlementPipeline, row);
      const inProcess = settlementJson(generateSettlementPipeline, row);
      if (viaBundle !== inProcess) mismatched.push(k);
      bundleHash[k] = sha256(viaBundle);
      inProcHash[k] = sha256(inProcess);
    }
    return { mismatched, bundleHash, inProcHash };
  })();
  return replay;
}

describe('engine bundle replay — the bundle generates what the app generates', () => {
  it('the corpus is the golden master\'s full 525-row matrix (this replay is not vacuous)', () => {
    expect(ROWS.length).toBe(525);
    expect(new Set(ROWS.map(keyOf)).size).toBe(525);
  });

  it('every golden-corpus config: the committed bundle\'s settlement JSON equals the in-process pipeline\'s, byte for byte', async () => {
    const { mismatched, bundleHash } = await runReplay();
    expect(Object.keys(bundleHash).length).toBe(525);
    expect(
      mismatched,
      `${mismatched.length} of 525 rows differ between supabase/functions/_shared/engineBundle.js and `
        + 'the in-process pipeline. If src/ changed, the bundle is stale: run `npm run build:edge-shared` '
        + 'and commit the bundle with its inputs.',
    ).toEqual([]);
  }, WALL_MS);

  it('the bundle\'s hashes equal the committed golden fixture (skips, loudly, only while the fixture is the known-stale one)', async (ctx) => {
    const fixture = JSON.parse(readFileSync(FIXTURE, 'utf8'));
    expect(Object.keys(fixture).sort(), 'the golden fixture\'s key set is not the corpus\'s').toEqual(ROWS.map(keyOf).sort());

    const { bundleHash, inProcHash } = await runReplay();
    const bundleDrift = ROWS.map(keyOf).filter((k) => fixture[k] !== bundleHash[k]);
    if (bundleDrift.length === 0) return;

    // The fixture disagrees with the bundle. That is a SKIP only if it disagrees with the
    // in-process pipeline on exactly the same rows, with the bundle and the pipeline
    // agreeing on what those rows now are: the fixture is stale for the engine, not the
    // bundle for the source.
    const inProcDrift = ROWS.map(keyOf).filter((k) => fixture[k] !== inProcHash[k]);
    expect(inProcDrift, 'the bundle drifts from the golden fixture on rows the in-process pipeline does not').toEqual(bundleDrift);
    expect(bundleDrift.filter((k) => bundleHash[k] !== inProcHash[k])).toEqual([]);

    const reason = `ENGINE BUNDLE vs GOLDEN FIXTURE SKIPPED: tests/fixtures/generator-golden-master.json is stale on `
      + `${bundleDrift.length} of 525 rows for the in-process pipeline too (pending its signed re-record); the `
      + 'bundle matches the pipeline on every one of them. This title arms itself the moment the fixture is re-recorded.';
    // Straight to stderr: the runner drops console output of a title that ends skipped.
    process.stderr.write(`\n⚠ ${reason}\n`);
    ctx.skip(reason);
  }, WALL_MS);

  it('the espionage fence\'s 360-settlement driven corpus: bundle equals in-process byte for byte, and its hash meets the fence constant (known-stale rule)', async (ctx) => {
    const fenceSrc = readFileSync(ESPIONAGE_FENCE, 'utf8');
    // The fence's generation, verbatim: if the fence re-spells it, this replay must follow.
    expect(fenceSrc).toContain('const seed = `SUBw4-fence1-${tier}-${route}-${String(i).padStart(3, \'0\')}`;');
    expect(fenceSrc).toContain("{ settType: tier, tier, tradeRouteAccess: route, culture: 'germanic' }, null, { seed },");
    expect(fenceSrc).toContain("rows.push(`${tier}\\t${route}\\t${seed}\\t${sha(stable(settlement))}`);");
    const { constant, tiers, routes, seeds } = fenceCorpus(fenceSrc);
    expect(tiers.length * routes.length * seeds).toBe(360);

    const bundle = await loadBundle(BUNDLE);
    const bundleRows = [];
    const inProcRows = [];
    const mismatched = [];
    for (const tier of tiers) {
      for (const route of routes) {
        for (let i = 0; i < seeds; i += 1) {
          const seed = `SUBw4-fence1-${tier}-${route}-${String(i).padStart(3, '0')}`;
          const cfg = { settType: tier, tier, tradeRouteAccess: route, culture: 'germanic' };
          const b = stable(bundle.generateSettlementPipeline(cfg, null, { seed }));
          const p = stable(generateSettlementPipeline(cfg, null, { seed }));
          if (b !== p) mismatched.push(seed);
          bundleRows.push(`${tier}\t${route}\t${seed}\t${sha256(b)}`);
          inProcRows.push(`${tier}\t${route}\t${seed}\t${sha256(p)}`);
        }
      }
    }
    expect(mismatched, `${mismatched.length} of 360 fence settlements differ bundle vs in-process`).toEqual([]);

    const bundleCorpus = sha256(bundleRows.join('\n'));
    if (bundleCorpus === constant) return;
    // Known-stale only: the in-process corpus misses the constant too, with the same hash.
    expect(sha256(inProcRows.join('\n')), 'the bundle misses the fence constant where the in-process pipeline does not').toBe(bundleCorpus);
    const reason = 'ENGINE BUNDLE vs ESPIONAGE FENCE CONSTANT SKIPPED: the in-process corpus misses '
      + 'PRE_COUPLING_CORPUS_SHA too (the fence is pending its own re-record); the bundle matches the pipeline on all 360.';
    process.stderr.write(`\n⚠ ${reason}\n`);
    ctx.skip(reason);
  }, WALL_MS);

  it('the engine-generate birth: for the three service cases, the bundle\'s birth equals the in-process birth', async () => {
    const { config, seeds } = JSON.parse(readFileSync(SERVICE_CASES, 'utf8'));
    expect(seeds.length).toBe(3);
    const bundle = await loadBundle(BUNDLE);
    await bundle.loadGenerationLawPayloads();
    await loadGenerationLawPayloads();
    for (const seed of seeds) {
      const viaBundle = JSON.stringify(bundle.generateSettlementPipeline(bundle.birthConfig(config), null, { seed, customContent: {} }));
      const inProcess = JSON.stringify(generateSettlementPipeline(birthConfig(config), null, { seed, customContent: {} }));
      expect(sha256(viaBundle), `seed ${seed}`).toBe(sha256(inProcess));
    }
  }, WALL_MS);

  it('NEGATIVE CONTROL: a temp copy of the bundle with a planted edit is not accepted by the same comparison', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'engine-bundle-tamper-'));
    try {
      const src = readFileSync(BUNDLE, 'utf8');
      const decl = 'function generateSettlementPipeline(config = {}, importedNeighbour = null, options = {}) {';
      expect(src.split(decl).length - 1, 'the planted edit\'s anchor is not unique in the bundle').toBe(1);
      const planted = src.replace(decl, decl.replace('generateSettlementPipeline', '__untamperedGenerateSettlementPipeline'))
        + '\nfunction generateSettlementPipeline(...args) {\n'
        + '  const s = __untamperedGenerateSettlementPipeline(...args);\n'
        + '  s.population = (s.population || 0) + 1;\n'
        + '  return s;\n}\n';
      const tampered = join(dir, 'engineBundle.tampered.js');
      writeFileSync(tampered, planted);

      const bundle = await loadBundle(tampered);
      const row = ROWS[0];
      expect(settlementJson(bundle.generateSettlementPipeline, row)).not.toBe(settlementJson(generateSettlementPipeline, row));
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  }, WALL_MS);
});
