import path from 'node:path';
const tree = path.resolve(process.argv[2]); const imp = (p) => import(path.join(tree, p));
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
const REP = await imp('src/generators/people/representatives.js');
const { faceOfInstitution, FACE_SEAT, isFabricInstitution } = await imp('src/data/institutionalCatalog.js');
const { isHideableHouse } = await imp('src/domain/people/cardVeil.js');
const { governingFactionOf } = await imp('src/domain/rulingPower.js');
await loadGenerationLawPayloads();
const rows = JSON.parse((await import('node:fs')).readFileSync(process.argv[3], 'utf8')).filter((x) => x.g.includes('leaderIsOffice:noHouseOfKind'));
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const out = {}; const odd = [];
for (const r of rows) {
  const m = r.seed.match(/^l2-(.+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/);
  const cfg = m ? { ...DIALS, settType: m[2], selectedStresses: [m[1]], selectedStressesRandom: false } : { ...DIALS, settType: r.tier };
  const s = generateSettlementPipeline(birthConfig(cfg), null, { seed: r.seed, customContent: {} });
  const faced = (s.institutions || []).filter((h) => !isFabricInstitution(h) && typeof faceOfInstitution(h) === 'string' && faceOfInstitution(h) !== FACE_SEAT && REP.houseKindOf(h) !== 'government');
  const k = `${r.part === 'rand' ? 'rand' : 'forced'}:${r.tier}:${faced.length ? 'facedHouseStands' : 'exempt'}`;
  out[k] = (out[k] || 0) + 1;
  if (faced.length) odd.push(`${r.seed} ${r.ruler}: ${faced.map((h) => `${h.name}[${REP.houseKindOf(h)}${isHideableHouse(h) ? ',hidden' : ''}]`).join(', ')}`);
}
console.log(out); console.log(odd.filter(x=>!/^[^:]+:[^\]]*$/.test(x)).length); console.log(odd.filter((x) => x.replace(/\[[^\]]*hidden\]/g, "").match(/\[/)).join('\n'));
