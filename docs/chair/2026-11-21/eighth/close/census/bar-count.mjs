// The chair's three facts (15:34): the Summary's five (SummaryTab.jsx: ps.factions.slice(0,5), stored order), the governing row, the seat's holder.
import { readFileSync } from 'node:fs';
const T = process.argv[2]; const plan = JSON.parse(readFileSync(process.argv[3], 'utf8'));
const { generateSettlementPipeline } = await import(`${T}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${T}/src/domain/density/densityCreateBoundary.js`);
const { holderOf } = await import(`${T}/src/domain/seat/holderOfSeat.js`);
await loadGenerationLawPayloads();
const one = (s) => {
  const f = s.powerStructure?.factions || [];
  const gi = f.findIndex((x) => x.isGoverning);
  const h = holderOf(s, { audience: 'owner' }); const hn = h?.holderName || h?.holder?.faction || null;
  const hi = hn ? f.findIndex((x) => x.faction === hn) : -1;
  const sorted = f.every((x, i) => i === 0 || (f[i - 1].power ?? 0) >= (x.power ?? 0));
  return { n: f.length, gi, hn, hi, rule: h?.rule, sorted, gov: f[gi]?.faction };
};
if (process.argv[4]) { const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const { DEFAULT_CONFIG } = await import(`${T}/src/store/configSlice.js`);
  const s = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: 'city' }), null, { seed: 'r2r-city-56', customContent: {} });
  console.log('r2r-city-56', JSON.stringify(one(s)), JSON.stringify((s.powerStructure?.factions || []).map((x) => [x.faction, x.power, x.isGoverning ? 'gov' : ''])));
  process.exit(0); }
const out = {};
for (const row of plan) {
  const s = generateSettlementPipeline(birthConfig(row.config), null, { seed: row.seed, customContent: {} });
  const r = one(s); const o = (out[row.size] ||= { births: 0, govOutside5: 0, holderOutside5: 0, neitherIn5: 0, holderDiffersFromGov: 0, unsorted: 0 });
  o.births += 1; if (!r.sorted) o.unsorted += 1;
  const gin = r.gi >= 0 && r.gi < 5, hin = r.hi >= 0 && r.hi < 5;
  if (!gin) o.govOutside5 += 1; if (r.hn && !hin) o.holderOutside5 += 1; if (!gin && !hin) o.neitherIn5 += 1; if (r.hn && r.hn !== r.gov) o.holderDiffersFromGov += 1;
}
for (const [k, v] of Object.entries(out)) console.log(k, JSON.stringify(v));
