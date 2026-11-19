// UPKEEP-CAPACITY, the chair's third word: FOUR GAP CANDIDATES, each measured APART (no anchor factor, no other
// candidate). MEASURES ONLY. Same tree and seeds as corpus2.mjs (capacity-measure-2.patch: the presence whole, every
// hook inert unless set); the base is corpus2's. Each seed is born once per candidate, the hook set through the whole
// pipeline.
//   G1   the Professional city watch opens the watch only (the garrison flag read over the roster without it)
//   G2   the Household levy opens the militia part (at today's points)
//   G3   "Access to parish church" opens no clergy part (the divine names read without it); the parish rows stay
//   G3p  G3, and it opens no parish row either (the church flag read without it)
//   G4   the druids by a two-rung ladder, Druid Circle → Elder Grove Council, at the anchor B's steps (0.8, 1.2)
// Per birth as corpus2 (no drops), and for G1 in cities and metropolises: THE EDITED TOWN, the roster with its
// garrison houses (Barracks, Garrison, Multiple garrisons) removed so the watch stands alone, read with G1 off and on.
//   node corpus3.mjs <scratch-root> <out.ndjson> <shard> <shards>
import { createWriteStream } from 'node:fs';
import crypto from 'node:crypto';
const [root, out, shardArg = '0', shardsArg = '1'] = process.argv.slice(2);
const shard = Number(shardArg), shards = Number(shardsArg);
const imp = (p) => import(`${root}/${p}`);
const { DEFAULT_CONFIG } = await imp('src/store/configSlice.js');
const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { generateDefenseProfile } = await imp('src/generators/defenseGenerator.js');
const { getInstFlags } = await imp('src/generators/helpers.js');
const { defenseTraditionNamesOf } = await imp('src/domain/institutions/defenseInstitutionBuckets.js');
const { keepOfRecord } = await imp('src/domain/facts/keep.js');
const { nativeSemanticName } = await imp('src/domain/content/customContentSemanticAuthority.js');
const { scoreBand } = await imp('src/domain/display/defenseScoreBands.js');
const { deriveMagicReliance } = await imp('src/domain/magicReliance.js');
const { collectThreatSources } = await imp('src/domain/threatProfile.js');
await loadGenerationLawPayloads();
const nm = (i) => nativeSemanticName(i).toLowerCase();
const without = (list, re) => (list || []).filter((i) => !re.test(nm(i)));
const PCW = /professional city watch/, LEVY = /household levy/, ACCESS = /access to parish church/;
const CANDS = {
  G1: { G: (inst, list, cfg) => ({ ...inst, hasGarrison: getInstFlags(cfg, without(list, PCW)).inst.hasGarrison }) },
  G2: { G: (inst, list) => ({ ...inst, hasMilitia: inst.hasMilitia || (list || []).some((i) => LEVY.test(nm(i))) }) },
  G3: { N: (list) => defenseTraditionNamesOf(without(list, ACCESS)) },
  G3p: { N: (list) => defenseTraditionNamesOf(without(list, ACCESS)), G: (inst, list, cfg) => ({ ...inst, hasChurch: getInstFlags(cfg, without(list, ACCESS)).inst.hasChurch }) },
  G4: { f: (id, list) => { if (id !== 'druids') return 1; const n = (list || []).map(nm); return n.includes('elder grove council') ? 1.2 : n.includes('druid circle') ? 0.8 : 1; } },
};
const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const rows = [];
for (const tier of TIERS) for (let i = 0; i < (tier === 'metropolis' ? 40 : 240); i++) rows.push({ key: `cold-${tier}-${i}`, tier, stress: null });
for (const stress of ['famine', 'under_siege', 'wartime']) for (const tier of TIERS) { const n = ['town', 'city', 'metropolis'].includes(tier) ? 84 : 40; for (let i = 0; i < n; i++) rows.push({ key: `cold-${stress}-${tier}-${i}`, tier, stress }); }
for (const tier of TIERS) for (let i = 0; i < 60; i++) rows.push({ key: `fresh5-${tier}-${i}`, tier, stress: null });
for (const stress of ['occupied', 'plague_onset', 'monster_pressure', 'indebted', 'succession_void', 'infiltrated', 'famine', 'under_siege']) for (const tier of ['village', 'town', 'city', 'metropolis']) for (let i = 0; i < 10; i++) rows.push({ key: `fresh5-${stress}-${tier}-${i}`, tier, stress });
for (const tier of TIERS) for (let i = 0; i < 60; i++) rows.push({ key: `fresh6-${tier}-${i}`, tier, stress: null });
for (const stress of ['famine', 'under_siege', 'wartime']) for (const tier of TIERS) for (let i = 0; i < 20; i++) rows.push({ key: `fresh6-${stress}-${tier}-${i}`, tier, stress });
const SK = ['military', 'monster', 'internal', 'economic', 'magical', 'disaster'];
const hash = (x) => crypto.createHash('sha1').update(JSON.stringify(x ?? null)).digest('hex').slice(0, 12);
const set = (c) => { if (c?.G) globalThis.__CAP_G = c.G; if (c?.N) globalThis.__CAP_N = c.N; if (c?.f) globalThis.__CAP_f = c.f; };
const clear = () => { delete globalThis.__CAP_G; delete globalThis.__CAP_N; delete globalThis.__CAP_f; };
const read = (p) => ({ score: p.readiness?.score, band: p.readiness?.label, scores: SK.map((x) => p.scores?.[x] ?? null), sbands: SK.map((x) => (typeof p.scores?.[x] === 'number' ? scoreBand(p.scores[x]) : null)) });
const o = createWriteStream(out);
for (let r = shard; r < rows.length; r += shards) {
  const row = rows[r];
  const cfg = () => (row.stress ? birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: row.tier, selectedStresses: [row.stress], selectedStressesRandom: false }) : birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: row.tier }));
  const line = { key: row.key, tier: row.tier, forced: row.stress };
  for (const [name, c] of Object.entries(CANDS)) {
    set(c);
    try {
      const s = generateSettlementPipeline(cfg(), null, { seed: row.key, customContent: {} });
      const d = s.defenseProfile || {}; const ps = s.powerStructure || {};
      const rest = JSON.parse(JSON.stringify(s)); delete rest.defenseProfile; delete rest.powerStructure;
      line[name] = { ...read(d), reliance: deriveMagicReliance(s).reading,
        threats: collectThreatSources(s).filter((t) => t.originSurface === 'defenseProfile').map((t) => t.raw?.name).sort(),
        hPow: hash(ps), powers: (ps.factions || []).map((x) => x.faction).sort(), legit: ps.publicLegitimacy?.score ?? null, legitLabel: ps.publicLegitimacy?.label ?? null,
        hRest: hash(rest), names: name === 'G1' ? (s.institutions || []).map((i) => nativeSemanticName(i)) : undefined };
      if (name === 'G1' && (row.tier === 'city' || row.tier === 'metropolis')) {
        const k = keepOfRecord(s.economicState);
        const edited = { ...s, institutions: without(s.institutions, /^(barracks|garrison|multiple garrisons)$/) };
        clear(); const off = read(generateDefenseProfile(edited, k)); set(c); const on = read(generateDefenseProfile(edited, k));
        line.G1edited = { off, on };
      }
    } finally { clear(); }
  }
  o.write(`${JSON.stringify(line)}\n`);
}
o.end();
console.error(`shard ${shard}/${shards} done`);
