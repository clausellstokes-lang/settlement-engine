/** @vitest-environment node */
/**
 * BATCH item 3 (C1; R24-C1 with R24g (2)): the proof's births. Births every row of a plan (the page battery's birth) on a tree;
 * writes `hashes.jsonl` (seed, governing name, sha256 of the record) for all, and the full record of each place governed by
 * one of the six names (the three old forms and their three birth names) to `<out>/carriers/<seed>.json`. The compare
 * (`c1-compare.mjs`) maps the birth names back and asks for byte-equality with the old tree's record.
 * Env: CB_TREE, CB_PLAN, CB_OUT (dir).
 */
import { test } from 'vitest';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const TREE = String(process.env.CB_TREE); const PLAN = String(process.env.CB_PLAN); const OUT = String(process.env.CB_OUT);
const NAMES = new Set(['Corrupt Council', 'Corrupt City Council', 'Shadow Senate', 'Council of Aldermen', 'Council of Syndics', 'Senate']);

test('births of a plan for the C1 proof', async () => {
  mkdirSync(`${OUT}/carriers`, { recursive: true });
  const pipe = await import(/* @vite-ignore */ `${TREE}/src/generators/generateSettlementPipeline.js`);
  const dens = await import(/* @vite-ignore */ `${TREE}/src/domain/density/densityCreateBoundary.js`);
  await dens.loadGenerationLawPayloads();
  const plan = JSON.parse(readFileSync(PLAN, 'utf8'));
  const rows = [];
  for (const row of plan) {
    const town = pipe.generateSettlementPipeline(row.config, null, { seed: row.seed, customContent: {} });
    const text = JSON.stringify(town);
    const gov = String(town?.powerStructure?.governingName ?? '');
    rows.push(JSON.stringify({ seed: row.seed, size: row.size, gov, hash: createHash('sha256').update(text).digest('hex') }));
    if (NAMES.has(gov)) writeFileSync(`${OUT}/carriers/${row.seed}.json`, text);
  }
  writeFileSync(`${OUT}/hashes.jsonl`, `${rows.join('\n')}\n`);
}, 1200000);
