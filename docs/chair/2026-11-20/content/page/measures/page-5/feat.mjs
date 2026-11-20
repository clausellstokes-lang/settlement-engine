// PAGE-5 unit 3 (a): per town, its tensions and a flat set of born-record facts (factsOf atoms + roster/economy readings)
const [, , L, nA = '50', out] = process.argv;
const fs = await import('node:fs');
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { SIZES } = await import(`${L}/tests/components/pageCensusWalk.shared.mjs`);
const { factsOf } = await import(`${L}/src/domain/facts/factsOf.js`);
await loadGenerationLawPayloads();
const GETTERS = ['siegeMotion','dangerComing','uprising','monsterFrontier','legacyRuin','courtSits','courtOrGaol','storesMonths','growsMoreThanEats','defence','guardPresence','soldiers','commander','faith','water','market','legalHouse','paidWatch','forceWalksByDay','appointedPost','famine','magic','magicSupply','magicRelianceShown','rulerKind','sovereign','legitimacyCrisis','rulingBody','migration','warState','sacredHouse','guild','rivalPower','seatOutranked','ironAtHand','timberAtHand','enchanting','tradeAtWork','fishBoughtIn','goodExported','terrain','route','crime','lawBand','crimeWave','rivalRings','orderForce','criminalIncome','prosperity','keep','crisis','imports','exports','failedSource','leadingSourceSpent','criticalImportBroughtIn'];
const flat = (F, k, v, d = 0) => {
  if (v === null || v === undefined || v === false) return;
  if (v === true) { F.add(k); return; }
  if (typeof v === 'string') { if (v.length <= 40) F.add(`${k}=${v}`); else F.add(k); return; }
  if (typeof v === 'number') { F.add(`${k}=${v <= 0 ? '0' : v < 3 ? '<3' : v < 12 ? '<12' : '12+'}`); return; }
  if (Array.isArray(v)) { if (v.length) { F.add(`${k}[]`); if (d < 1) for (const x of v.slice(0, 8)) if (typeof x === 'string' && x.length <= 30) F.add(`${k}∋${x}`); } return; }
  if (typeof v === 'object' && d < 1) { let any = false; for (const [kk, vv] of Object.entries(v)) { if (typeof vv === 'function') continue; any = true; flat(F, `${k}.${kk}`, vv, d + 1); } if (!any) F.add(k); return; }
  if (typeof v === 'object') F.add(k);
};
const rows = [];
for (const size of SIZES) for (let i = 0; i < +nA; i++) {
  const seed = `hxd-${size}-${i}`;
  const t = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
  const F = new Set(); const f = factsOf(t);
  for (const g of GETTERS) { try { flat(F, g, f[g]); } catch (e) { F.add(`${g}!err`); } }
  const ps = t.powerStructure || {};
  for (const x of ps.factions || []) { F.add(`power:${x.category}`); if (x.isGoverning) F.add(`gov:${x.category}`); }
  F.add(`stability=${ps.stability}`); F.add(`legit=${ps.publicLegitimacy?.label}`); F.add(`capture=${ps.criminalCaptureState}`);
  F.add(`prosp=${t.economicState?.prosperity}`); F.add(`route=${t.config?.tradeRouteAccess}`); if (t.economicState?.isEntrepot) F.add('entrepot');
  if ((t.economicViability?.issues || []).length) F.add('viabilityIssues'); F.add(`viable=${t.economicViability?.viable}`);
  F.add(`stress=${(t.stress && (t.stress.type || t.stress.key || t.stress)) || 'none'}`.slice(0, 50));
  F.add(`neighbor=${t.neighborRelationship?.relationshipType || 'none'}`);
  for (const e of t.history?.eventsTimeline || []) F.add(`ev:${e.type}`);
  for (const e of t.history?.historicalEvents || []) F.add(`hev:${e.templateType || e.type}`);
  for (const inst of t.institutions || []) { if (inst.priorityCategory === 'criminal') F.add('inst:criminal'); for (const tg of inst.tags || []) F.add(`tag:${tg}`); }
  for (const s of Object.keys(t.availableServices || {})) if ((t.availableServices[s] || []).length) F.add(`svc:${s}`);
  const insts = (t.institutions || []).map((i) => ({ n: i.name, c: i.category, p: i.priorityCategory, tg: i.tags || [] }));
  const powers = (ps.factions || []).map((x) => ({ n: x.faction, c: x.category, g: !!x.isGoverning, p: x.power }));
  rows.push({ seed, insts, powers, ps: { stability: ps.stability, conflicts: (ps.conflicts || []).map((c) => c.parties) }, tl: (t.history?.eventsTimeline || []).map((e) => [e.type, e.yearsAgo, e.anchored]), tier: t.tier, tensions: (t.history?.currentTensions || []).map((x) => ({ type: x.type, d: x.description, f: x.factions })), F: [...F] });
}
fs.writeFileSync(out, JSON.stringify(rows));
console.log(`wrote ${rows.length} towns`);
