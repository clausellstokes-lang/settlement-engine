// node f3look.mjs <tree> <seed-key...> — a succession birth's claimant powers, their people and lines, its cast, its seat row
import path from 'node:path';
import { jobsFor } from './corpus.mjs';
const tree = path.resolve(process.argv[2]); const imp = (p) => import(path.join(tree, p));
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
const { nameOf } = await imp('src/domain/rulingPower.js');
const { rulingChainOf } = await imp('src/domain/dossier/powerStrata.js');
const { leaderlessLineOf, stressPowerRowOf } = await imp('src/domain/people/stressPowerFaces.js');
await loadGenerationLawPayloads();
const want = new Set(process.argv.slice(3));
for (const j of (await jobsFor(imp, 'RS')).filter((x) => want.has(x.key))) {
  const s = generateSettlementPipeline(j.cfg, null, { seed: j.seed, customContent: {} });
  const ch = rulingChainOf(s);
  console.log(`== ${j.key} ${s.name} gov=${s.powerStructure.government} seat:`, ch.npc ? ch.npc.name : ch.absence?.line);
  for (const f of s.powerStructure.factions) {
    const n = nameOf(f); const row = stressPowerRowOf(s, f);
    const ms = s.npcs.filter((c) => (c.memberships || []).some((m) => m.power === n)).map((c) => ({ c, m: c.memberships.find((m) => m.power === n) })).sort((a, b) => (a.m.rank ?? 9) - (b.m.rank ?? 9));
    console.log(`  ${n} (${f.power}) cat=${f.category || ''} row=${row ? (row.archetype || row.power) : '-'} | ${ms.slice(0, 3).map((x) => `${x.m.rank}:${x.c.name}/${x.c.title}/${x.c.institution?.kind}:${x.c.institution?.key}`).join(' · ')} | ${leaderlessLineOf(s, n)}`);
  }
  for (const st of [].concat(s.stress || [])) console.log('  cast', st.type, JSON.stringify((st.cast?.roles || []).map((r) => [r.role, r.name || r.npcName || r.npcId || r.house || null])));
}
