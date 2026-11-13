// node item3.mjs <tree> — over the 2,460: every power with no member and no declared line; and per stress power how it is faced
import path from 'node:path';
const tree = path.resolve(process.argv[2]); const imp = (p) => import(path.join(tree, p));
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
const { nameOf, governingFactionOf } = await imp('src/domain/rulingPower.js');
const { STRESS_TYPE_MAP } = await imp('src/data/stressTypes.js');
let SPF = null; try { SPF = await imp('src/domain/people/stressPowerFaces.js'); } catch { /* base */ }
await loadGenerationLawPayloads();
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const TIERS = ['thorp','hamlet','village','town','city','metropolis'];
const N = { thorp: 150, hamlet: 150, village: 60, town: 160, city: 100, metropolis: 40 };
const jobs = [];
for (const t of TIERS) for (let i = 0; i < N[t]; i++) jobs.push({ seed: `critique-${t}-${i}`, cfg: { ...DIALS, settType: t } });
for (const st of Object.keys(STRESS_TYPE_MAP)) for (const t of TIERS) for (let i = 0; i < 20; i++) jobs.push({ seed: `l2-${st}-${t}-${i}`, cfg: { ...DIALS, settType: t, selectedStresses: [st], selectedStressesRandom: false } });
const blank = []; const how = {}; const twoLead = [];
const inc = (k) => { how[k] = (how[k] || 0) + 1; };
for (const j of jobs) {
  const s = generateSettlementPipeline(birthConfig(j.cfg), null, { seed: j.seed, customContent: {} });
  const npcs = s.npcs || [];
  for (const f of s.powerStructure.factions) {
    const p = nameOf(f);
    const mem = npcs.filter((c) => (c.memberships || []).some((m) => m.power === p));
    const row = SPF ? SPF.stressPowerRowOf(s, f) : null;
    const first = npcs.find((c) => (c.memberships || []).some((m) => m.power === p && m.rank === 1));
    if (!mem.length) { const line = SPF ? SPF.leaderlessLineOf(s, p) : ''; if (line) inc(`${p} :: leaderless`); else blank.push(`${j.seed}: ${p}`); continue; }
    if (row || /Thieves/.test(p)) {
      const m = first?.memberships.find((x) => x.power === p);
      const k = !first ? 'no first' : first.institution?.kind === 'power' ? 'mint' : m.share === 0 ? 'joined house face' : 'house share';
      if (row || k === 'mint') inc(`${p} :: ${k}`);
      if (row && first && first.memberships.some((x) => x.rank === 1 && x.power !== p)) twoLead.push(`${j.seed}: ${first.name} ${p}`);
    }
  }
}
console.log('births', jobs.length, 'BLANK', blank.length, blank.slice(0, 10));
console.log('stress face leading another power', twoLead.length, twoLead.slice(0, 6));
for (const k of Object.keys(how).sort()) console.log(String(how[k]).padStart(5), k);
