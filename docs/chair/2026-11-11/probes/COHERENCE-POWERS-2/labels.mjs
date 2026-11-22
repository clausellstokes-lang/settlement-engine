import path from 'node:path'; import fs from 'node:fs';
const tree = path.resolve(process.argv[2]); const imp = (p) => import(path.join(tree, p));
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
const { STRESS_TYPE_MAP } = await imp('src/data/stressTypes.js');
await loadGenerationLawPayloads();
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const TIERS = ['thorp','hamlet','village','town','city','metropolis'];
const N = { thorp: 150, hamlet: 150, village: 60, town: 160, city: 100, metropolis: 40 };
const jobs = [];
for (const t of TIERS) for (let i = 0; i < N[t]; i++) jobs.push({ seed: `critique-${t}-${i}`, cfg: { ...DIALS, settType: t } });
for (const st of Object.keys(STRESS_TYPE_MAP)) for (const t of TIERS) for (let i = 0; i < 20; i++) jobs.push({ seed: `l2-${st}-${t}-${i}`, cfg: { ...DIALS, settType: t, selectedStresses: [st], selectedStressesRandom: false } });
const out = {};
// every string leaf whose key ends in Label/label/State/band/Band, plus power figures
const pick = (v, p, o) => { if (v && typeof v === 'object') { for (const k of Object.keys(v)) { if (k === 'npcs') continue; pick(v[k], `${p}.${Array.isArray(v) ? '[]' : k}`, o); } } else if (/(label|Label|State|band|Band|stability|Stability|legitimacy|coup|power|prosperity)$/.test(p) && (typeof v === 'string' || typeof v === 'number')) (o[p] ||= []).push(v); return o; };
for (const j of jobs) { const s = generateSettlementPipeline(birthConfig(j.cfg), null, { seed: j.seed, customContent: {} }); out[j.seed] = Object.fromEntries(Object.entries(pick(s, '', {})).map(([k, v]) => [k, v.join('|')])); }
fs.writeFileSync(process.argv[3], JSON.stringify(out)); console.log('ok');
