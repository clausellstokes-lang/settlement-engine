// PEOPLE-1 seat M2 (2026-11-20): the births of the quarters measure, and each place's facts the quarter wordings read.
// Births exactly as the chair's stored-census instrument does (lane/chair-2026-11-08:
// docs/chair/2026-11-20/seventh/measures/stored-census/census.mjs): `hxd-<size>-<i>`, i < n, through
// generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} })
// after loadGenerationLawPayloads(); the place's own names masked to '#', digits to '0'.
// Usage: node m2-quarters-births.mjs <worktree> [n=100] <out.json>
// Writes one JSON (the births' facts; NOT committed: it is the births, not the count lines). Prints one count line a size.
import { writeFileSync } from 'node:fs';

const [, , L, nArg = '100', OUT] = process.argv;
if (!L || !OUT) { console.error('usage: node m2-quarters-births.mjs <worktree> [n] <out.json>'); process.exit(2); }
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { generateSpatialLayout } = await import(`${L}/src/generators/spatialGenerator.js`);
const { factsOf } = await import(`${L}/src/domain/facts/factsOf.js`);
const { liveInstitutionNames, hasInstitution } = await import(`${L}/src/domain/facts/institutions.js`);
const { faithReadingOf } = await import(`${L}/src/domain/dossier/faithReading.js`);
const { guildHouseStands } = await import(`${L}/src/domain/facts/guild.js`);
const { courtHoldersOf } = await import(`${L}/src/domain/facts/defence.js`);
// §7 (the coordinator's follow-up): every EXISTING atom a §7 wording declares, answered by the vocabulary's own reader
// (`factVocabulary.js :: atomHolds`, the draw door's evaluation), and the live roster's catalogue ids.
const { atomHolds } = await import(`${L}/src/domain/facts/factVocabulary.js`);
const { liveInstitutions } = await import(`${L}/src/domain/institutions/institutionRoster.js`);
const ATOMS = [
  'church', 'church access', 'clergy', 'priest', 'sacredHouse', 'market', 'guild', 'court sits', 'legal house', 'magic', 'enchanting',
  'organised crime', 'rival rings', 'criminal income', 'coast', 'river', 'ruling body', 'appointed post', 'timber at hand', 'timber reaches the saws',
  ...['monastery', 'hospital', 'temple', 'tavern', 'bathhouse', 'bank', 'smith', 'docks', 'school', 'mill', 'granary'].map((k) => `institution: ${k}`),
  ...['plains', 'hills', 'forest', 'riverside', 'coastal', 'mountain', 'desert'].map((k) => `terrain: ${k}`),
  ...['fish', 'kilns', 'clay kilns', 'charcoal kilns', 'stone', 'arcane', 'dairy', 'cloth', 'ironwork', 'herbs', 'spice', 'cut stone', 'woodwork', 'leather', 'dyed cloth', 'building'].map((k) => `trade at work: ${k}`),
  ...['cloth', 'flour', 'hides', 'ale', 'arms'].map((k) => `exported: ${k}`),
  ...['elder', 'lord', 'priest', 'mayor', 'occupier', 'council'].map((k) => `ruler: ${k}`),
  'crisis: under_siege', 'crisis: plague_onset', 'crisis: unrest', 'crisis: threat',
];
await loadGenerationLawPayloads();

const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const n = +nArg;
const esc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const KINDS = ['hospital', 'healer', 'monastery', 'mill', 'smith', 'bathhouse', 'docks', 'quarry', 'mine', 'tavern', 'school', 'temple', 'granary', 'bank'];
const places = [];
for (const size of SIZES) {
  let held = 0, agree = 0;
  for (let i = 0; i < n; i++) {
    const seed = `hxd-${size}-${i}`;
    const t = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
    const names = new Set();
    const add = (x) => { if (typeof x === 'string' && x.trim().length > 2) names.add(x.trim()); };
    add(t.name);
    for (const p of t.npcs || []) { add(p.name); for (const w of String(p.name || '').split(/\s+/)) if (w.length > 3) add(w); }
    for (const f of t.powerStructure?.factions || []) { add(f.name); add(f.faction); }
    const list = [...names].sort((a, b) => b.length - a.length);
    const re = list.length ? new RegExp(list.map(esc).join('|'), 'g') : null;
    const mask = (s) => (re ? String(s).replace(re, '#') : String(s)).replace(/\d+/g, '0');
    const f = factsOf(t);
    const faith = faithReadingOf(t);
    const rawNames = (t.institutions || []).map((x) => String(x?.name || ''));
    const quarters = (t.spatialLayout?.quarters || []).map((q) => ({ name: q.name, desc: q.desc, masked: q.desc == null ? null : mask(q.desc), landmarks: q.landmarks || [] }));
    if (quarters.length) held++;
    // The approximation check: the quarters re-derived from the FINAL roster (the generator ran on the roster at
    // economyReconcilePass); where the set agrees, the facts read off the final record are the facts the step saw.
    const route = f.route;
    const re2 = generateSpatialLayout(t.tier, t.institutions || [], route, f.terrain || 'plains');
    const same = JSON.stringify(re2.quarters.map((q) => q.name)) === JSON.stringify(quarters.map((q) => q.name));
    if (same) agree++;
    let crisis = { kinds: [], families: [] };
    try { const c = f.crisis; crisis = { kinds: [...c.kinds], families: [...c.families] }; } catch { /* a crisis reader that needs the world: none here */ }
    places.push({
      size, i, seed, recSeed: t._seed ?? null, tier: t.tier, population: t.population, terrain: f.terrain, route,
      rawNames, live: liveInstitutionNames(t),
      kinds: Object.fromEntries(KINDS.map((k) => [k, hasInstitution(t, k)])),
      faith: { hasChurch: faith.hasChurch, churchWords: faith.churchWords, accessOnly: faith.accessOnly, shrine: faith.shrine, seniorCleric: faith.seniorCleric, religiousFaction: faith.religiousFaction?.name ? mask(faith.religiousFaction.name) : null },
      market: f.market, guild: f.guild, guildHouse: guildHouseStands(t), court: courtHoldersOf(t).map((x) => String(x?.name || x)),
      defence: { ...f.defence }, magic: { ...f.magic }, crime: f.crime, prosperity: f.prosperity, populationBand: f.populationBand, water: f.water,
      crisis, quarters, rederivedAgrees: same,
      atoms: Object.fromEntries(ATOMS.map((w) => { let v; try { v = atomHolds(w, f); } catch (e) { v = `ERR ${e.message}`; } return [w, v]; })),
      catalogIds: liveInstitutions(t).map((x) => x?.catalogId ?? null),
    });
  }
  console.log(`BIRTHS ${size}: ${n} places, ${held} hold quarters; the quarter set re-derived from the final roster agrees in ${agree}/${n}`);
}
writeFileSync(OUT, JSON.stringify({ base: process.env.M2_BASE || null, n, places }));
console.log(`WROTE ${places.length} places`);
