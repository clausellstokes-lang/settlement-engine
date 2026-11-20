/**
 * confine-hash.mjs — THE SEAT LANE'S CONFINEMENT HASH (brief `docs/chair/2026-11-20/content/seat/briefs/CONFINE.md`).
 *
 * Run from a tree's root:  node <path>/confine-hash.mjs [--only golden|census]
 * It imports THE TREE IT RUNS IN (process.cwd()'s own `src/` and `tests/`), births that tree's documents exactly as the
 * two suites birth them, and prints:
 *   golden <sha> 525   — tests/helpers/goldenMasterCorpus.js :: goldenCorpus(), each row born as
 *                        tests/property/generatorGoldenMaster.test.js :: hashFor does:
 *                        const { _seed, ...cfg } = row; generateSettlementPipeline(cfg, null, { seed: _seed, customContent: {} })
 *   census <sha> 720   — tests/components/pageCensusWalk.shared.mjs :: censusPlan('r2'), after loadGenerationLawPayloads(),
 *                        each row born as tests/lint/namesInSentences.walker.test.js does:
 *                        generateSettlementPipeline(configOf(row, DEFAULT_CONFIG, birthConfig), null, { seed: row.seed, customContent: {} })
 *   all <sha> 1245
 * Serialization: JSON.stringify(town), as the golden master hashes it. Each document's sha256 (hex); a set's sha is the
 * sha256 of its documents' hashes, each followed by "\n", in the suite's own row order; `all` folds the golden's 525 then
 * the census's 720 the same way. Each set is born in its OWN node process (as each suite runs in its own module
 * context), so neither set's module state reaches the other.
 */
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { join } from 'node:path';

const ROOT = process.cwd();
const imp = (p) => import(pathToFileURL(join(ROOT, p)).href);
const sha = (s) => createHash('sha256').update(s).digest('hex');
const fold = (hashes) => sha(hashes.map((h) => `${h}\n`).join(''));

async function birthGolden() {
  const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
  const { goldenCorpus } = await imp('tests/helpers/goldenMasterCorpus.js');
  return goldenCorpus().map((config) => {
    const { _seed, ...cfg } = config;
    return sha(JSON.stringify(generateSettlementPipeline(cfg, null, { seed: _seed, customContent: {} })));
  });
}

async function birthCensus() {
  const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
  const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
  const { DEFAULT_CONFIG } = await imp('src/store/configSlice.js');
  const { censusPlan, configOf } = await imp('tests/components/pageCensusWalk.shared.mjs');
  await loadGenerationLawPayloads();
  return censusPlan('r2').map((row) => sha(JSON.stringify(
    generateSettlementPipeline(configOf(row, DEFAULT_CONFIG, birthConfig), null, { seed: row.seed, customContent: {} }),
  )));
}

const args = process.argv.slice(2);
const at = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : undefined; };

if (args.includes('--child')) {
  // one set: its document hashes on stdout, one per line, in the suite's row order
  const hashes = at('--child') === 'golden' ? await birthGolden() : await birthCensus();
  process.stdout.write(hashes.join('\n') + '\n');
} else {
  const only = at('--only');
  if (only && only !== 'golden' && only !== 'census') { console.error('--only golden|census'); process.exit(2); }
  const sets = only ? [only] : ['golden', 'census'];
  const self = fileURLToPath(import.meta.url);
  const all = [];
  for (const set of sets) {
    const r = spawnSync(process.execPath, [self, '--child', set], {
      cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'inherit'],
    });
    if (r.status !== 0) { console.error(`${set}: birth failed (exit ${r.status})`); process.exit(1); }
    const hashes = r.stdout.split('\n').filter((l) => /^[0-9a-f]{64}$/.test(l)); // a birth's own console output is not a document
    console.log(`${set} ${fold(hashes)} ${hashes.length}`);
    all.push(...hashes);
  }
  if (!only) console.log(`all ${fold(all)} ${all.length}`);
}
