// SR0 dump: births a pool and writes one JSON line per place with its stake rows and the facts the record holds at each.
// usage: node dump.mjs <worktree/> <all|allc|crisis> <out.jsonl> [sizes,comma] [kinds,comma]
import fs from 'node:fs';
const [R, POOL, OUT, SZ, KD] = process.argv.slice(2);
const { generateSettlementPipeline } = await import(R + 'src/generators/generateSettlementPipeline.js');
const C = await import(R + 'src/domain/crisis/crisisCast.js');
const { factionArchetype, FACTION_ARCHETYPES: A } = await import(R + 'src/domain/factionArchetypes.js');
const { governingFactionOf } = await import(R + 'src/domain/rulingPower.js');
const { membersByRank } = await import(R + 'src/domain/people/membership.js');
const { pluralPowerName } = await import(R + 'src/domain/display/pluralPowerName.js');
const { isSeatVacant } = await import(R + 'src/domain/people/seatKeeper.js');
// crisisCast.js :: SYSTEM_BASE is not exported: its archetype/governing columns copied (no role regex needed here).
const SB = {
  food_security: { a: [A.LABOR, A.CIVIC, A.CRAFT] }, labor_capacity: { a: [A.CRAFT, A.LABOR] }, trade_connectivity: { a: [A.MERCHANT] },
  defense_readiness: { a: [A.MILITARY] }, public_legitimacy: { a: [A.GOVERNMENT], g: true }, faction_stability: { a: [A.GOVERNMENT], g: true },
  tax_revenue: { a: [A.GOVERNMENT], g: true }, healing_capacity: { a: [A.RELIGIOUS] }, housing_pressure: { a: [A.LABOR, A.CIVIC] },
  law_order: { a: [A.MILITARY] }, social_trust: { a: [A.CIVIC, A.RELIGIOUS] }, criminal_opportunity: { a: [] },
};
const KEY = Object.fromEntries(Object.entries(C.STAKE_REASONS).map(([k, v]) => [v, k]));
const SIZES = (SZ || 'thorp,hamlet,village,town,city,metropolis').split(',');
const KINDS = (KD || 'famine,plague_onset,mass_migration,monster_pressure,politically_fractured,succession_void,insurgency,slave_revolt,religious_conversion,recently_betrayed,infiltrated,under_siege,occupied,wartime,indebted').split(',');
const jobs = [];
// 'allc': SAME-1's census births (the chair's census.mjs: birthConfig({ ...DEFAULT_CONFIG, settType }) after loadGenerationLawPayloads)
let wrap = (c) => c;
if (POOL === 'allc') {
  const { birthConfig, loadGenerationLawPayloads } = await import(R + 'src/domain/density/densityCreateBoundary.js');
  const { DEFAULT_CONFIG } = await import(R + 'src/store/configSlice.js');
  await loadGenerationLawPayloads();
  wrap = (c) => birthConfig({ ...DEFAULT_CONFIG, ...c });
}
if (POOL === 'all' || POOL === 'allc') for (const z of SIZES) for (let i = 0; i < 50; i++) jobs.push({ cfg: { settType: z }, seed: `hxd-${z}-${i}`, size: z });
else for (const k of KINDS) for (const z of SIZES) for (let i = 0; i < 4; i++) jobs.push({ cfg: { settType: z, stressType: k }, seed: `b7-${k}-${z}-${i}`, size: z, want: k });
const fd = fs.openSync(OUT, 'w');
let miss = 0;
for (const j of jobs) {
  let s;
  try { s = generateSettlementPipeline(wrap(j.cfg), null, { seed: j.seed, customContent: {} }); } catch (e) { miss++; fs.writeSync(fd, JSON.stringify({ seed: j.seed, size: j.size, err: String(e).slice(0, 200) }) + '\n'); continue; }
  const st = (Array.isArray(s.stress) ? s.stress : s.stress ? [s.stress] : []).filter(Boolean);
  const facs = Array.isArray(s.powerStructure?.factions) ? s.powerStructure.factions : [];
  const gov = governingFactionOf(s); const govName = gov ? (gov.faction || gov.name) : '';
  const roster = (s.npcs || []).filter((n) => n && !n.temporary && !n.ousted);
  const instCat = Object.fromEntries((s.institutions || []).map((i) => [i.name, i.category]));
  const vacant = (() => { try { return isSeatVacant(s); } catch { return null; } })();
  const crises = st.map((e) => {
    const kind = e.type; const sys = C.catalogFor(kind).affectedSystems;
    const rows = (e.cast?.stakes || []).map((k) => {
      const f = facs.find((x) => (x.faction || x.name) === k.factionId) || {};
      const arch = factionArchetype(f); const isGov = k.factionId === govName;
      let matched = null;
      for (const sy of sys) { const b = SB[sy]; if (!b) continue; if (b.g && isGov) { matched = sy + ':governing'; break; } if (b.a.includes(arch)) { matched = sy + ':archetype'; break; } }
      const mem = membersByRank(roster, k.factionId);
      const houses = [...new Set(mem.filter((n) => n.institution?.kind === 'house').map((n) => `${n.institution.key}|${n.institution.family || ''}|${instCat[n.institution.key] || ''}`))];
      return { f: k.factionId, stake: k.stake, reason: k.reason, key: KEY[k.reason] || '?', arch, cat: f.category || '', isGov, plural: pluralPowerName(k.factionId), power: f.power, nMem: mem.length, houses, matched };
    });
    return { kind, rank: e.cast?.rank, nature: e.cast?.nature, forced: !!e.forcedByConfig, sys, levers: (e.cast?.levers || []).map((l) => l.institution), rows };
  });
  fs.writeSync(fd, JSON.stringify({ seed: j.seed, size: j.size, want: j.want, govName, vacant, nFac: facs.length, crises }) + '\n');
}
fs.closeSync(fd);
console.log('births', jobs.length, 'miss', miss);
