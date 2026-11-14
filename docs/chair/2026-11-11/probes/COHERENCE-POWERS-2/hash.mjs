// node hash.mjs <tree> <out.json> [dumpKeys.json] — sha256 per birth over the golden's 525 configs and the L2 corpus;
// with dumpKeys, writes full records for those keys to <out>.records.json
import path from 'node:path'; import fs from 'node:fs'; import { createHash } from 'node:crypto';
const tree = path.resolve(process.argv[2]); const imp = (p) => import(path.join(tree, p));
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
const { goldenCorpus, keyOf } = await imp('tests/helpers/goldenMasterCorpus.js');
const { STRESS_TYPE_MAP } = await imp('src/data/stressTypes.js');
await loadGenerationLawPayloads();
const dump = process.argv[4] ? new Set(JSON.parse(fs.readFileSync(process.argv[4], 'utf8'))) : null;
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const TIERS = ['thorp','hamlet','village','town','city','metropolis'];
const N = { thorp: 150, hamlet: 150, village: 60, town: 160, city: 100, metropolis: 40 };
const jobs = [];
for (const c of goldenCorpus()) { const { _seed, ...cfg } = c; jobs.push({ key: 'golden:' + keyOf(c), cfg, seed: _seed }); }
for (const t of TIERS) for (let i = 0; i < N[t]; i++) jobs.push({ key: `critique-${t}-${i}`, cfg: birthConfig({ ...DIALS, settType: t }), seed: `critique-${t}-${i}` });
for (const st of Object.keys(STRESS_TYPE_MAP)) for (const t of TIERS) for (let i = 0; i < 20; i++) jobs.push({ key: `l2-${st}-${t}-${i}`, seed: `l2-${st}-${t}-${i}`, cfg: birthConfig({ ...DIALS, settType: t, selectedStresses: [st], selectedStressesRandom: false }) });
const out = {}; const recs = {};
for (const j of jobs) {
  if (dump && !dump.has(j.key)) continue;
  const s = generateSettlementPipeline(j.cfg, null, { seed: j.seed, customContent: {} });
  const js = JSON.stringify(s);
  out[j.key] = createHash('sha256').update(js).digest('hex');
  if (dump) recs[j.key] = s;
}
fs.writeFileSync(process.argv[3], JSON.stringify(out));
if (dump) fs.writeFileSync(process.argv[3] + '.records.json', JSON.stringify(recs));
console.log('births', Object.keys(out).length);
