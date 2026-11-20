/**
 * trad-pool.mjs — TRAD-1's born pool (2026-11-20). Births every tier x every culture x 6 seeds
 * (random terrain and route), 72 a tier, 432 towns, and writes each town's record whole to
 * <out>/pool.ndjson (one JSON line a town) so every later figure reads the same bytes.
 * Usage: node docs/chair/2026-11-20/content/traditions/trad-pool.mjs <outDir>
 * A reader of the engine, never a writer into it.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { generateSettlementPipeline } from '../../../../../../src/generators/generateSettlementPipeline.js';
import { CULTURE_PROFILE_KEYS } from '../../../../../../src/domain/cultureProfiles.js';

const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const CULTURES = [...CULTURE_PROFILE_KEYS, 'mediterranean'];
const SEEDS = ['trad-a', 'trad-b', 'trad-c', 'trad-d', 'trad-e', 'trad-f'];
const out = process.argv[2];
if (!out) throw new Error('usage: trad-pool.mjs <outDir>');
mkdirSync(out, { recursive: true });
const lines = [];
for (const settType of TIERS) for (const culture of CULTURES) for (const s of SEEDS) {
  const seed = `${s}-${settType}-${culture}`;
  const town = generateSettlementPipeline({ settType, culture, terrainOverride: 'auto', tradeRouteAccess: 'random_trade', monsterThreat: 'civilized' }, null, { seed, customContent: {} });
  lines.push(JSON.stringify(town));
}
writeFileSync(join(out, 'pool.ndjson'), `${lines.join('\n')}\n`);
console.log(`towns=${lines.length} tiers=${TIERS.length} cultures=${CULTURES.length} seeds=${SEEDS.length}`);
