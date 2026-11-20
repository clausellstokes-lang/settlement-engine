// goalHashes.mjs — THE BORN TOWNS' GOALS, HASHED (GOALS-3, builder 7, 2026-11-20; the chair's test (u)): per card of the goal
// measure's 300 towns (seeds `hxd-<size>-<i>`, i < 50, every size of `tests/components/pageCensusWalk.shared.mjs :: SIZES`, born
// through the pipeline at the default settings after `loadGenerationLawPayloads()`), a hash of each vantage's (text, intent).
// Read by tests/generators/people/goalSentencesOnceInTown.test.js (u) against `goal-hashes-d8b174237.json` (GOALS-4, builder
// 10: re-taken at the wants' build's base by the test's own door), which this script wrote ONCE, run against an archive of
// d8b174237 (node_modules linked); `goal-hashes-d3937c3f8.json` (GOALS-3, builder 7) stays as the record of the cure's base:
//   node tests/fixtures/goalHashes.mjs <tree> tests/fixtures/goal-hashes-d8b174237.json d8b174237
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

/** Towns per size. */
export const HASHED_TOWNS = 50;
/** Hex digits kept per hash. */
const KEEP = 6;
/** @param {string} s */
const hash = (s) => createHash('sha1').update(s).digest('hex').slice(0, KEEP);

/** One vantage of one card: its printed text and its keyed intent. @param {any} card @param {'short' | 'long'} v */
export const vantageHash = (card, v) => hash(JSON.stringify([card?.goal?.[v] ?? null, card?.goal?.intent?.[v] ?? null]));

/** A town's row: its roster's ids hashed, its card count, and each card's short and long hashes in roster order. @param {any} town */
export function townRow(town) {
  const cards = town?.npcs || [];
  return { ids: hash(cards.map((c) => String(c.id)).join('\n')), n: cards.length, goals: cards.map((c) => vantageHash(c, 'short') + vantageHash(c, 'long')).join('') };
}

/** A card's two hashes read back from a row. @param {{ goals: string }} row @param {number} k */
export const rowHashes = (row, k) => ({ short: row.goals.slice(k * 2 * KEEP, k * 2 * KEEP + KEEP), long: row.goals.slice(k * 2 * KEEP + KEEP, (k + 1) * 2 * KEEP) });

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [, , tree, out] = process.argv;
  if (!tree || !out) { console.error('usage: node tests/fixtures/goalHashes.mjs <tree> <out.json>'); process.exit(2); }
  const imp = (/** @type {string} */ p) => import(pathToFileURL(path.join(path.resolve(tree), p)).href);
  const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
  const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
  const { DEFAULT_CONFIG } = await imp('src/store/configSlice.js');
  const { SIZES } = await imp('tests/components/pageCensusWalk.shared.mjs');
  await loadGenerationLawPayloads();
  /** @type {Record<string, ReturnType<typeof townRow>>} */ const towns = {};
  for (const size of SIZES) for (let i = 0; i < HASHED_TOWNS; i += 1) {
    const seed = `hxd-${size}-${i}`;
    towns[seed] = townRow(generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} }));
  }
  fs.writeFileSync(out, `${JSON.stringify({ tree: process.argv[4] || path.basename(path.resolve(tree)), towns })}\n`);
  console.log(`towns ${Object.keys(towns).length} → ${out}`);
}
