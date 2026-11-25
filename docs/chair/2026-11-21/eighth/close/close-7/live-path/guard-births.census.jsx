/** @vitest-environment node */
/**
 * GUARD (R24j 8): BORN RECORDS DIFFER ONLY IN `generatorVersion`. Births every row of a plan (the close's C or V,
 * `read24/make-plan.mjs` / `make-visitor-plan.mjs`; the page battery's own birth: `generateSettlementPipeline(config, null,
 * { seed, customContent: {} })` after `loadGenerationLawPayloads()`) on a TREE and writes, per seed, the record's stamp, the
 * sha256 of the whole record, and the sha256 of the record with `generatorVersion` set apart. Two trees' outputs are compared
 * by `guard-births-compare.mjs`.
 * Env: GB_TREE, GB_PLAN, GB_OUT (jsonl).
 */
import { test } from 'vitest';
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const TREE = String(process.env.GB_TREE); const PLAN = String(process.env.GB_PLAN); const OUT = String(process.env.GB_OUT);
const sha = (v) => createHash('sha256').update(JSON.stringify(v)).digest('hex');

test('births of a plan, hashed with and without the version', async () => {
  const pipe = await import(/* @vite-ignore */ `${TREE}/src/generators/generateSettlementPipeline.js`);
  const dens = await import(/* @vite-ignore */ `${TREE}/src/domain/density/densityCreateBoundary.js`);
  await dens.loadGenerationLawPayloads();
  const plan = JSON.parse(readFileSync(PLAN, 'utf8'));
  const out = [];
  for (const row of plan) {
    const town = pipe.generateSettlementPipeline(row.config, null, { seed: row.seed, customContent: {} });
    const { generatorVersion, ...rest } = town;
    // the key order of the rest is the record's own, so a moved key position would show as a moved hash
    out.push(JSON.stringify({ seed: row.seed, size: row.size, generatorVersion, whole: sha(town), withoutVersion: sha(rest),
      keys: Object.keys(town).join(',') }));
  }
  writeFileSync(OUT, `${out.join('\n')}\n`);
}, 1200000);
