import path from 'node:path';
const tree = path.resolve(process.argv[2]); const imp = (p) => import(path.join(tree, p));
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
const { governingFactionOf, nameOf } = await imp('src/domain/rulingPower.js');
const LS = await imp('src/domain/worldPulse/npcLadderState.js');
const { npcId } = await imp('src/domain/worldPulse/npcAgency.js');
const { STRESS_TYPE_MAP } = await imp('src/data/stressTypes.js');
await loadGenerationLawPayloads();
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const TIERS = ['thorp','hamlet','village','town','city','metropolis'];
const N = { thorp: 150, hamlet: 150, village: 60, town: 160, city: 100, metropolis: 40 };
const corpus = [];
for (const t of TIERS) for (let i = 0; i < N[t]; i++) corpus.push({ seed: `critique-${t}-${i}`, tier: t, part: 'rand', cfg: { ...DIALS, settType: t } });
for (const st of Object.keys(STRESS_TYPE_MAP)) for (const t of TIERS) for (let i = 0; i < 20; i++) corpus.push({ seed: `l2-${st}-${t}-${i}`, tier: t, part: 'forced', cfg: { ...DIALS, settType: t, selectedStresses: [st], selectedStressesRandom: false } });
const out = { rand: {}, forced: {} }; const miss = [];
const inc = (o, k) => { o[k] = (o[k] || 0) + 1; };
for (const b of corpus) {
  const s = generateSettlementPipeline(birthConfig(b.cfg), null, { seed: b.seed, customContent: {} });
  const g = governingFactionOf(s); const ruler = nameOf(g);
  const npcs = s.npcs || [];
  const li = npcs.findIndex((c) => (c.memberships || []).some((m) => m.power === ruler && m.rank === 1));
  inc(out[b.part], `${b.tier}:births`);
  if (li < 0) { inc(out[b.part], `${b.tier}:noLeaderCard`); continue; }
  const sid = 'sid'; const leaderNid = npcId(sid, npcs[li], li);
  const rungs = LS.eligibleMembersOf(sid, s, g, LS.ladderFactionKey(g));
  if (!rungs.length) { inc(out[b.part], `${b.tier}:noRungs`); continue; }
  if (rungs[0].npcId !== leaderNid) { inc(out[b.part], `${b.tier}:topNotLeader`); miss.push(`${b.seed} ${ruler}: leader ${npcs[li].name}, top ${rungs[0].name}`); }
}
console.log(JSON.stringify(out)); console.log(miss.slice(0, 12).join('\n'));
