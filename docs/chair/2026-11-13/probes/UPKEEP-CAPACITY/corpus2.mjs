// UPKEEP-CAPACITY, the chair's second word (reading A and the alchemist patch WITHDRAWN). MEASURES ONLY.
//   node corpus2.mjs <scratch-root> <census.json> <out.ndjson> <shard> <shards> [drops=1]
// The scratch root is the lane's tip ebcbfc48a carrying capacity-measure-2.patch: the magic presence reads the
// WHOLE roster (as at c72917251), a factor hook on `add`/`paid` (inert unless set) and a raw-parts sink for the
// count law. No alchemist hook. Each seed is BORN THREE TIMES, the factor set through the whole pipeline (so the
// powers, legitimacy and every later reader see the candidate's defence): base (none), A (0.6 + 0.4x), B (0.8 + 0.4x).
// Per birth: readiness and band; the five scores, the disaster score, and each score's page band (scoreBand);
// magic reliance; the defence threats the AI prompt carries (collectThreatSources, originSurface defenseProfile);
// the power structure (a hash; the powers by name; legitimacy); a hash of the record without defence and powers;
// and THE COUNT LAW: each house dropped alone, the parts whose own scores move, per score.
import { createWriteStream, readFileSync } from 'node:fs';
import crypto from 'node:crypto';
import { partLadders } from './chains.mjs';
const [root, cj, out, shardArg = '0', shardsArg = '1', dropsArg = '1'] = process.argv.slice(2);
const shard = Number(shardArg), shards = Number(shardsArg), DROPS = dropsArg === '1';
const imp = (p) => import(`${root}/${p}`);
const L = await partLadders(root, JSON.parse(readFileSync(cj, 'utf8')));
const { DEFAULT_CONFIG } = await imp('src/store/configSlice.js');
const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { defencePartsOf } = await imp('src/generators/defenseGenerator.js');
const { keepOfRecord } = await imp('src/domain/facts/keep.js');
const { nativeSemanticName } = await imp('src/domain/content/customContentSemanticAuthority.js');
const { scoreBand } = await imp('src/domain/display/defenseScoreBands.js');
const { deriveMagicReliance } = await imp('src/domain/magicReliance.js');
const { collectThreatSources } = await imp('src/domain/threatProfile.js');
await loadGenerationLawPayloads();
const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const SCALED = ['garrison', 'militia', 'watch', 'court', 'prison', 'wardens', 'company', 'charter', 'clergy', 'druids', 'market', 'hospital', 'alchemists'];
const HOUSE_PARTS = new Set([...SCALED, 'walls', 'arcane', 'magic', 'parish', 'elders']);
const FA = (h) => (h.of > 1 ? 0.6 + 0.4 * (h.rung - 1) / (h.of - 1) : 1);
const FB = (h) => (h.of > 1 ? 0.8 + 0.4 * (h.rung - 1) / (h.of - 1) : 1);
const factorOf = (pick) => (id, institutions) => {
  if (!SCALED.includes(id)) return 1;
  const hs = (institutions || []).map((i) => L[id][nativeSemanticName(i).toLowerCase()]).filter(Boolean);
  return hs.length ? Math.max(...hs.map(pick)) : 1;
};
const CAND = { base: null, A: factorOf(FA), B: factorOf(FB) };
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
const rawOf = (s, k) => { globalThis.__CAP_rawSink = []; try { defencePartsOf(s, k); return Object.fromEntries(globalThis.__CAP_rawSink); } finally { delete globalThis.__CAP_rawSink; } };
// THE COUNT LAW: drop each house alone; for each score, the HOUSE parts whose own raw points on that score move.
// A house that moves two house parts on one score feeds that score twice. The will (its gate) and the terrain
// (a multiplier on what stands) are derived parts, counted apart.
const countLaw = (s, k) => {
  const all = rawOf(s, k); const roster = s.institutions || []; const twice = []; const derived = {};
  roster.forEach((h, i) => {
    const r = rawOf({ ...s, institutions: roster.filter((_, j) => j !== i) }, k);
    const byScore = {};
    for (const id of new Set([...Object.keys(all), ...Object.keys(r)])) {
      for (const d of new Set([...Object.keys(all[id] || {}), ...Object.keys(r[id] || {})])) {
        if (Math.abs((all[id]?.[d] || 0) - (r[id]?.[d] || 0)) < 1e-9) continue;
        if (HOUSE_PARTS.has(id)) (byScore[d] ||= []).push(id); else derived[id] = (derived[id] || 0) + 1;
      }
    }
    for (const [d, ids] of Object.entries(byScore)) if (ids.length > 1) twice.push([nativeSemanticName(h), d, ids]);
  });
  return { twice, derived };
};
const o = createWriteStream(out);
for (let r = shard; r < rows.length; r += shards) {
  const row = rows[r];
  const cfg = () => (row.stress ? birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: row.tier, selectedStresses: [row.stress], selectedStressesRandom: false }) : birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: row.tier }));
  const line = { key: row.key, tier: row.tier, forced: row.stress };
  for (const [name, f] of Object.entries(CAND)) {
    if (f) globalThis.__CAP_f = f; else delete globalThis.__CAP_f;
    try {
      const s = generateSettlementPipeline(cfg(), null, { seed: row.key, customContent: {} });
      const d = s.defenseProfile || {}; const ps = s.powerStructure || {};
      const rest = JSON.parse(JSON.stringify(s)); delete rest.defenseProfile; delete rest.powerStructure;
      const k = keepOfRecord(s.economicState);
      line[name] = {
        score: d.readiness?.score, band: d.readiness?.label,
        scores: SK.map((x) => d.scores?.[x] ?? null), sbands: SK.map((x) => (typeof d.scores?.[x] === 'number' ? scoreBand(d.scores[x]) : null)),
        reliance: deriveMagicReliance(s).reading,
        threats: collectThreatSources(s).filter((t) => t.originSurface === 'defenseProfile').map((t) => t.raw?.name).sort(),
        hPow: hash(ps), powers: (ps.factions || []).map((x) => x.faction).sort(), legit: ps.publicLegitimacy?.score ?? null, legitLabel: ps.publicLegitimacy?.label ?? null,
        hRest: hash(rest), hAll: hash(s),
        parts: Object.fromEntries(defencePartsOf(s, k).map((x) => [x.id, x.points])),
        houses: name === 'base' ? Object.fromEntries(SCALED.map((p) => [p, (s.institutions || []).map((i) => L[p][nativeSemanticName(i).toLowerCase()]).filter(Boolean).map((h) => [h.name, h.rung, h.of])]).filter(([, v]) => v.length)) : undefined,
        count: DROPS ? countLaw(s, k) : undefined,
        names: name === 'base' ? (s.institutions || []).map((i) => nativeSemanticName(i)) : undefined,
      };
    } finally { delete globalThis.__CAP_f; }
  }
  o.write(`${JSON.stringify(line)}\n`);
}
o.end();
console.error(`shard ${shard}/${shards} done`);
