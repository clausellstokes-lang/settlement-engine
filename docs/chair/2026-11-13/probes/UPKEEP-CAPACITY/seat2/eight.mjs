// eight.mjs <tree> <out.json>: the owner's example towns at one tree. Per town: tier, the houses that defend it, the
// readiness and band, the five scores with their page bands, the power structure (hash, factions, legitimacy); for the
// hired-only village the same place with its tier's watch in its hired force's stead; for the alchemist pair the same
// town with an alchemist quarter in its shop's stead (the one record, the one writer).
import fs from 'node:fs'; import crypto from 'node:crypto';
const [T, out] = process.argv.slice(2);
const { generateSettlementPipeline } = await import(T + '/src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(T + '/src/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(T + '/src/store/configSlice.js');
const { generateDefenseProfile } = await import(T + '/src/generators/defenseGenerator.js');
const { keepOfRecord } = await import(T + '/src/domain/facts/keep.js');
const { scoreBand } = await import(T + '/src/domain/display/defenseScoreBands.js');
await loadGenerationLawPayloads();
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const KEYS = ['cold-town-116', 'cold-city-227', 'cold-thorp-0', 'cold-village-65', 'fresh6-metropolis-30', 'cold-under_siege-town-52', 'cold-thorp-191', 'cold-hamlet-123', 'cold-wartime-town-75', 'cold-city-101'];
const DEF = /adventurers|town hall|city hall|assembly|wall|palisade|citadel|garrison|barrack|watch|militia|levy|mercenar|free company|charter|guild hall|warden|church|cathedral|monaster|shrine|temple|wizard|mage|alchem|apothecar|druid|grove|hospital|healer|court|prison|granar/i;
const HIRED = /mercenar|free company|adventurers'|hireling hall/i;
const WATCH_OF = { thorp: 'Village watch', hamlet: 'Village watch', village: 'Village watch', town: 'Town watch', city: 'Professional city watch', metropolis: 'Professional city watch' };
const SK = ['military', 'monster', 'internal', 'economic', 'magical'];
const view = (d) => ({ score: d.readiness.score, band: d.readiness.label, scores: SK.map((k) => [d.scores[k], scoreBand(d.scores[k])]) });
const res = {};
for (const key of KEYS) {
  const m = /^[a-z0-9]+-(?:([a-z_]+)-)?(thorp|hamlet|village|town|city|metropolis)-\d+$/.exec(key);
  const cfg = m[1] ? birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[2], selectedStresses: [m[1]], selectedStressesRandom: false }) : birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[2] });
  const s = generateSettlementPipeline(cfg, null, { seed: key, customContent: {} });
  const ps = s.powerStructure || {};
  const r = { tier: s.tier, name: s.name, prosperity: s.economicState?.prosperity, crises: (s.stress ? [].concat(s.stress) : []).map((x) => x?.type).filter(Boolean),
    houses: s.institutions.map((i) => i.name).filter((n) => DEF.test(n)), ...view(s.defenseProfile),
    traditions: s.defenseProfile.traditions, hPow: crypto.createHash('sha1').update(JSON.stringify(ps)).digest('hex').slice(0, 12),
    factions: (ps.factions || []).map((f) => `${f.faction} ${f.power}`), governing: ps.governingFaction?.faction ?? ps.governingFaction ?? null, legitimacy: ps.publicLegitimacy };
  const k = keepOfRecord(s.economicState); // the record's own standing keep, as the stored profile reads it
  r.self = view(generateDefenseProfile(s, k));
  if (key === 'cold-village-65') r.watchInStead = view(generateDefenseProfile({ ...s, institutions: [...s.institutions.filter((i) => !HIRED.test(i.name)), { name: WATCH_OF[s.tier], category: 'Defense' }] }, k));
  if (key === 'cold-wartime-town-75') r.quarterInStead = view(generateDefenseProfile({ ...s, institutions: s.institutions.map((i) => (i.name === 'Alchemist shop' ? { ...i, name: 'Alchemist quarter' } : i)) }, k));
  res[key] = r;
}
fs.writeFileSync(out, JSON.stringify(res, null, 1));
