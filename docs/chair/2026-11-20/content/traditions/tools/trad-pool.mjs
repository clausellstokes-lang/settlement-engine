/**
 * trad-pool.mjs — TRAD-1's born pool (2026-11-20). Births every tier x every culture x 6 seeds
 * (random terrain and route), 72 a tier, 432 towns, and writes each town's record whole to
 * <out>/pool.ndjson (one JSON line a town) so every later figure reads the same bytes.
 * Usage: node docs/chair/2026-11-20/content/traditions/tools/trad-pool.mjs <outDir> [crisis]
 * TRAD-4 unit 6: with a CRISIS key (one of data/stressTypes.js :: STRESS_TYPE_MAP's keys, refused otherwise), every town
 * is born with that one stress forced (`selectedStressesRandom: false, selectedStresses: [crisis]`) and the SAME seeds
 * as the calm pool, so a crisis town and the calm town of its seed differ by the stress alone.
 * A reader of the engine, never a writer into it.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { generateSettlementPipeline } from '../../../../../../src/generators/generateSettlementPipeline.js';
import { CULTURE_PROFILE_KEYS } from '../../../../../../src/domain/cultureProfiles.js';
import { STRESS_TYPE_MAP } from '../../../../../../src/data/stressTypes.js';

const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const CULTURES = [...CULTURE_PROFILE_KEYS, 'mediterranean'];
const SEEDS = ['trad-a', 'trad-b', 'trad-c', 'trad-d', 'trad-e', 'trad-f'];
const [, , out, crisis] = process.argv;
if (!out) throw new Error('usage: trad-pool.mjs <outDir> [crisis]');
if (crisis && !Object.hasOwn(STRESS_TYPE_MAP, crisis)) throw new Error(`not a stress key the engine holds: ${crisis}`);
const forced = crisis ? { selectedStressesRandom: false, selectedStresses: [crisis] } : {};
mkdirSync(out, { recursive: true });
const lines = [];
for (const settType of TIERS) for (const culture of CULTURES) for (const s of SEEDS) {
  const seed = `${s}-${settType}-${culture}`;
  const town = generateSettlementPipeline({ settType, culture, terrainOverride: 'auto', tradeRouteAccess: 'random_trade', monsterThreat: 'civilized', ...forced }, null, { seed, customContent: {} });
  lines.push(JSON.stringify(town));
}
writeFileSync(join(out, 'pool.ndjson'), `${lines.join('\n')}\n`);
console.log(`${crisis ? `crisis=${crisis} ` : ''}towns=${lines.length} tiers=${TIERS.length} cultures=${CULTURES.length} seeds=${SEEDS.length}`);
