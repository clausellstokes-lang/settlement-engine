// node reach.mjs <tree> <out.json> — per birth, per power: the first-lit top rung and the power's rank-1 card
import path from 'node:path'; import fs from 'node:fs';
const tree = path.resolve(process.argv[2]); const imp = (p) => import(path.join(tree, p));
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
const { nameOf } = await imp('src/domain/rulingPower.js');
const LS = await imp('src/domain/worldPulse/npcLadderState.js');
const { npcId } = await imp('src/domain/worldPulse/npcAgency.js');
const { STRESS_TYPE_MAP } = await imp('src/data/stressTypes.js');
await loadGenerationLawPayloads();
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const TIERS = ['thorp','hamlet','village','town','city','metropolis'];
const N = { thorp: 150, hamlet: 150, village: 60, town: 160, city: 100, metropolis: 40 };
const jobs = [];
for (const t of TIERS) for (let i = 0; i < N[t]; i++) jobs.push({ seed: `critique-${t}-${i}`, cfg: { ...DIALS, settType: t } });
for (const st of Object.keys(STRESS_TYPE_MAP)) for (const t of TIERS) for (let i = 0; i < 20; i++) jobs.push({ seed: `l2-${st}-${t}-${i}`, cfg: { ...DIALS, settType: t, selectedStresses: [st], selectedStressesRandom: false } });
const out = {};
for (const j of jobs) {
  const s = generateSettlementPipeline(birthConfig(j.cfg), null, { seed: j.seed, customContent: {} });
  const rows = {};
  for (const f of s.powerStructure.factions) {
    const p = nameOf(f);
    const at = (s.npcs || []).findIndex((c) => (c.memberships || []).some((m) => m.power === p && m.rank === 1));
    rows[p] = { gov: !!f.isGoverning, top: LS.eligibleMembersOf('a', s, f, LS.ladderFactionKey(f))[0]?.npcId || null, first: at < 0 ? null : npcId('a', s.npcs[at], at) };
  }
  out[j.seed] = rows;
}
fs.writeFileSync(process.argv[3], JSON.stringify(out)); console.log('ok');
