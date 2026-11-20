// VEIL-V102: the stored shape of a born town, key by key, where the switch's classes live (factions on both lists, the
// people's house field, the ties' ends), for the generator named by V102_GEN.
import { it } from 'vitest';
import { writeFileSync } from 'node:fs';
const GEN = process.env.V102_GEN || process.cwd();
it('shape', async () => {
  const { generateSettlementPipeline } = await import(`${GEN}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${GEN}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${GEN}/src/store/configSlice.js`);
  await loadGenerationLawPayloads();
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const A = JSON.parse(JSON.stringify(generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: 'city' }), null, { seed: 'rv10-sw-city-none-18', customContent: {} })));
  const R = {
    psFactionKeys: [...new Set((A.powerStructure?.factions || []).flatMap((f) => Object.keys(f)))].sort(),
    topFactionKeys: [...new Set((A.factions || []).flatMap((f) => Object.keys(f)))].sort(),
    topFactions: (A.factions || []).length, psFactions: (A.powerStructure?.factions || []).length,
    topMembersType: (A.factions || []).map((f) => (Array.isArray(f.members) ? `arr${f.members.length}:${typeof f.members[0]}` : typeof f.members)),
    psMembersType: (A.powerStructure?.factions || []).map((f) => (Array.isArray(f.members) ? `arr${f.members.length}:${typeof f.members[0]}` : typeof f.members)),
    topSample: (A.factions || []).slice(0, 1).map((f) => ({ ...f, members: Array.isArray(f.members) ? f.members.slice(0, 1).map((m) => Object.keys(m)) : f.members })),
    npcInstitution: [...new Set((A.npcs || []).map((n) => JSON.stringify(n.institution)).filter(Boolean))].slice(0, 8),
    relKeys: [...new Set((A.relationships || []).flatMap((r) => Object.keys(r)))].sort(),
    criminalHouses: (A.institutions || []).filter((i) => /criminal/i.test(String(i.category))).map((i) => i.name),
  };
  writeFileSync(process.env.V102_OUT, JSON.stringify(R, null, 1));
}, 600000);
