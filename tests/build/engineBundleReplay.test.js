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
 *   4. THE SERVICE'S BIRTH (unit 3's chain, Node link): for the three cases of
 *      tests/fixtures/engine-generate-cases.json, the bundle's birth (its own
 *      loadGenerationLawPayloads + birthConfig + pipeline — what engine-generate runs)
 *      equals the in-process birth. supabase/functions/engine-generate/index.test.ts is
 *      the Deno link: the function's settlement equals the bundle's birth, same cases.
 */

import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { goldenCorpus, keyOf } from '../helpers/goldenMasterCorpus.js';

const ROOT = process.cwd();
const BUNDLE = resolve(ROOT, 'supabase', 'functions', '_shared', 'engineBundle.js');
const FIXTURE = resolve(ROOT, 'tests', 'fixtures', 'generator-golden-master.json');
const SERVICE_CASES = resolve(ROOT, 'tests', 'fixtures', 'engine-generate-cases.json');
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
