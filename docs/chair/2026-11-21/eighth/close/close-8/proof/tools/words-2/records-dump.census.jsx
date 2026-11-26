/** @vitest-environment node */
/**
 * WORDS-2 (the tenth chair's seat, 2026-11-25): THE RECORDS OF A PLAN, DUMPED WHOLE, so every measure of the seat's units
 * reads the born record without a second birth. CLOSE-7's `read25/records.census.jsx` pattern: each row of a plan is born ONCE
 * on a tree (`generateSettlementPipeline(birthConfig(row.config), null, { seed, customContent: {} })` after
 * `loadGenerationLawPayloads()`), and each birth is written to $W2_OUT/<seed>.json.gz: { seed, size, recordHash, record }.
 * Changes nothing in any tree. Run by vitest with its root at the tree:
 *   W2_TREE=<tree> W2_PLAN=<plan.json> W2_OUT=<dir> npx vitest run --config <cfg>
 */
import { test } from 'vitest';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { gzipSync } from 'node:zlib';

const T = String(process.env.W2_TREE);
const OUT = String(process.env.W2_OUT);
const PLAN = JSON.parse(readFileSync(String(process.env.W2_PLAN), 'utf8'));

test('WORDS-2 records dump', async () => {
  const R = `${T}/src/`;
  const { generateSettlementPipeline } = await import(/* @vite-ignore */ R + 'generators/generateSettlementPipeline.js');
  const { birthConfig, loadGenerationLawPayloads } = await import(/* @vite-ignore */ R + 'domain/density/densityCreateBoundary.js');
  await loadGenerationLawPayloads();
  mkdirSync(OUT, { recursive: true });
  for (const { seed, size, config } of PLAN) {
    if (existsSync(`${OUT}/${seed}.json.gz`)) continue;
    const s = generateSettlementPipeline(birthConfig(config), null, { seed, customContent: {} });
    const json = JSON.stringify(s);
    writeFileSync(`${OUT}/${seed}.json.gz`, gzipSync(JSON.stringify({ seed, size, recordHash: createHash('sha256').update(json).digest('hex'), record: s })));
  }
}, 7200000);
