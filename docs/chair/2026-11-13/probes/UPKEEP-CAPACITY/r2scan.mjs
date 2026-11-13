// UPKEEP-CAPACITY: R2 (the owner: a hired-only place never reads above the same place with a watch in its hired
// force's stead), scanned over the corpus as upkeepHired.test.js reads it: the place's military against the same
// record with its hired houses out and its tier's watch in.   node r2scan.mjs <tree> <out.ndjson> <shard> <shards>
import { createWriteStream } from 'node:fs';
const [R, out, sh = '0', shs = '1'] = process.argv.slice(2);
const imp = (p) => import(`${R}/${p}`);
const { DEFAULT_CONFIG } = await imp('src/store/configSlice.js');
const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { generateDefenseProfile } = await imp('src/generators/defenseGenerator.js');
const { getInstFlags } = await imp('src/generators/helpers.js');
const { keepOf } = await imp('src/domain/facts/keep.js');
await loadGenerationLawPayloads();
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const HIRED = /mercenar|free company|adventurers'|hireling hall/i;
const WATCH_OF = { thorp: 'Village watch', hamlet: 'Village watch', village: 'Village watch', town: 'Town watch', city: 'Professional city watch', metropolis: 'Professional city watch' };
const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const rows = [];
for (const tier of TIERS) for (let i = 0; i < (tier === 'metropolis' ? 40 : 240); i++) rows.push({ key: `cold-${tier}-${i}`, tier });
for (const tier of TIERS) for (let i = 0; i < 60; i++) rows.push({ key: `fresh6-${tier}-${i}`, tier });
for (let i = 0; i < 60; i++) rows.push({ key: `agree-village-${i}`, tier: 'village' });
const o = createWriteStream(out);
for (let r = Number(sh); r < rows.length; r += Number(shs)) {
  const { key, tier } = rows[r];
  const s = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: tier }), null, { seed: key, customContent: {} });
  const f = getInstFlags(s.config, s.institutions).inst;
  if (!(f.hasCharterHall || f.hasMercenary) || f.hasGarrison || f.hasWatch || f.hasMilitia) continue;
  const k = keepOf(s.economicState.prosperity);
  const w = { ...s, institutions: [...s.institutions.filter((i) => !HIRED.test(i.name)), { name: WATCH_OF[tier], category: 'Defense' }] };
  const hired = generateDefenseProfile(s, k).scores.military, watch = generateDefenseProfile(w, k).scores.military;
  o.write(JSON.stringify({ key, tier, hired, watch, above: hired > watch }) + '\n');
}
o.end();
