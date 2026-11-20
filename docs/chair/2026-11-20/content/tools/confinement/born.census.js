/**
 * NAMES-3's birth arm (rebuilt from NAMES-2's hand-back §3; run ONLY by run.mjs, which copies it into the tree under
 * measure as `.names3-run/born.census.js`, so every import below resolves inside THAT tree). Births the generator's
 * golden 525 (`goldenCorpus()` through `generateSettlementPipeline(cfg, null, { seed, customContent: {} })`, as the
 * golden master does) and the census's 720 (`censusPlan('r2')` through `configOf(row, DEFAULT_CONFIG, birthConfig)`
 * after `loadGenerationLawPayloads()`, as the names walker does). Writes one JSON line per document:
 * `{ corpus, key, doc }` to `$NAMES3_OUT/<corpus>.jsonl`.
 */
import { test } from 'vitest';
import { writeFileSync, appendFileSync } from 'node:fs';
import { generateSettlementPipeline } from '../src/generators/generateSettlementPipeline.js';
import { goldenCorpus, keyOf } from '../tests/helpers/goldenMasterCorpus.js';
import { birthConfig, loadGenerationLawPayloads } from '../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../src/store/configSlice.js';
import { censusPlan, configOf } from '../tests/components/pageCensusWalk.shared.mjs';

const OUT = process.env.NAMES3_OUT;
const WHICH = process.env.NAMES3_CORPUS || 'both';

if (WHICH !== 'census') test('golden 525', () => {
  const file = `${OUT}/golden.jsonl`; writeFileSync(file, '');
  for (const config of goldenCorpus()) {
    const { _seed, ...cfg } = config;
    const doc = generateSettlementPipeline(cfg, null, { seed: _seed, customContent: {} });
    appendFileSync(file, `${JSON.stringify({ corpus: 'golden', key: keyOf(config), doc })}\n`);
  }
}, 3600000);

if (WHICH !== 'golden') test('census 720', async () => {
  await loadGenerationLawPayloads();
  const file = `${OUT}/census.jsonl`; writeFileSync(file, '');
  for (const row of censusPlan('r2')) {
    const doc = generateSettlementPipeline(configOf(row, DEFAULT_CONFIG, birthConfig), null, { seed: row.seed, customContent: {} });
    appendFileSync(file, `${JSON.stringify({ corpus: 'census', key: row.seed, doc })}\n`);
  }
}, 3600000);
