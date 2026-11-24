// PEOPLE-1 seat M4 (2026-11-20): the births the M4 measures read, born EXACTLY as the chair's instrument births them
// (lane/chair-2026-11-08 :: docs/chair/2026-11-20/seventh/measures/stored-census/census.mjs): seeds hxd-<size>-<i>,
// generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} }) after
// loadGenerationLawPayloads(); the same mask list (the place's name, its people's names and their words of more than three
// letters, its powers' names).
// It keeps, per place, only what the M4 measures read: the powers (faction, category, power, label, governing, desc), the
// relation rows (pair, type, direction, ratio, captureState, narrative), and the place's facts read through `factsOf` on the
// FINAL record (the record the writers' late passes read; see the proposals' approximation notes).
// Usage: node m4-births.mjs <checkout> <n per size> <cache.json>   (prints count lines only)
import { writeFileSync } from 'node:fs';

const [, , L, nArg = '100', cachePath] = process.argv;
if (!L || !cachePath) throw new Error('usage: node m4-births.mjs <checkout> <n> <cache.json>');
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { factsOf } = await import(`${L}/src/domain/facts/factsOf.js`);
await loadGenerationLawPayloads();

const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const n = +nArg;
const nameOfGood = (x) => (typeof x === 'string' ? x : x?.name || x?.resource || x?.item || x?.label || x?.good || null);
const out = { base: process.env.M4_BASE || null, n, sizes: {} };
for (const size of SIZES) {
  const places = [];
  let rels = 0; let facs = 0;
  for (let i = 0; i < n; i++) {
    const seed = `hxd-${size}-${i}`;
    const t = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
    const names = new Set();
    const add = (x) => { if (typeof x === 'string' && x.trim().length > 2) names.add(x.trim()); };
    add(t.name);
    for (const p of t.npcs || []) { add(p.name); for (const w of String(p.name || '').split(/\s+/)) if (w.length > 3) add(w); }
    for (const f of t.powerStructure?.factions || []) { add(f.name); add(f.faction); }
    const f = factsOf(t);
    const d = f.defence;
    const faith = f.faith;
    const safe = (fn, dflt = null) => { try { return fn(); } catch { return dflt; } };
    const facts = {
      tier: f.tier ?? null, populationBand: f.populationBand ?? null, population: t.population ?? null,
      prosperity: f.prosperity ?? null, rulerKind: f.rulerKind ?? null, rulingBody: !!f.rulingBody, seatMembers: !!f.seatMembers,
      rivalPower: !!f.rivalPower, seatOutranked: !!f.seatOutranked, guild: !!f.guild, market: !!f.market,
      hasChurch: !!faith?.hasChurch, churchWords: faith?.churchWords || '', faithAccessOnly: !!faith?.accessOnly, shrine: !!faith?.shrine,
      seniorCleric: faith?.seniorCleric ? { role: faith.seniorCleric.role } : null, tithe: !!faith?.tithe,
      sacredHouse: !!f.sacredHouse, temple: !!f.hasInstitution('temple'), monastery: !!f.hasInstitution('monastery'),
      school: !!f.hasInstitution('school'), bank: !!f.hasInstitution('bank'), granary: !!f.hasInstitution('granary'),
      docks: !!f.hasInstitution('docks'), mill: !!f.hasInstitution('mill'), smith: !!f.hasInstitution('smith'), tavern: !!f.hasInstitution('tavern'),
      hospital: !!d.hospital, healer: !!d.healer, walls: !!d.walls, watch: !!d.watch, militia: !!d.militia, garrison: !!d.garrison,
      mercenary: !!d.mercenary, court: !!d.court, courtSits: !!f.courtSits, paidWatch: !!f.paidWatch, legalHouse: !!f.legalHouse,
      crime: f.crime, legitimacyCrisis: !!safe(() => f.legitimacyCrisis, false),
      crisisKinds: safe(() => { const c = f.crisis; return Array.isArray(c?.kinds) ? [...c.kinds] : []; }, []),
      exports: (f.exports || []).map(nameOfGood).filter(Boolean).slice(0, 4),
      imports: (f.imports || []).map(nameOfGood).filter(Boolean).slice(0, 4),
      foodSources: Array.isArray(f.foodSources) ? [...f.foodSources] : [],
      terrain: f.terrain || null, route: f.route || null, culture: safe(() => f.culture),
      magicLevel: safe(() => f.magic?.level ?? null),
      appointedPost: !!safe(() => f.appointedPost, false), soldiers: !!f.soldiers, sovereign: !!safe(() => f.sovereign, false),
      tradeAtWork: Object.fromEntries(['fish', 'stone', 'woodwork', 'dairy', 'cloth', 'leather', 'ironwork', 'herbs', 'building']
        .map((k) => [k, safe(() => f.tradeAtWork(k), null) ?? null])),
    };
    const ps = t.powerStructure || {};
    const factions = (ps.factions || []).map((x) => ({ faction: x.faction || x.name, category: x.category || 'other', power: x.power ?? 0, rawPower: x.rawPower ?? null, powerLabel: x.powerLabel ?? null, isGoverning: !!x.isGoverning, modifier: x.modifier ?? null, desc: x.desc ?? null }));
    const relations = (ps.factionRelationships || []).map((r) => ({ pair: r.pair, type: r.type, direction: r.direction, ratio: r.ratio ?? null, captureState: r.captureState, narrative: r.narrative ?? null }));
    const institutions = (t.institutions || []).map((x) => ({ name: x.name, category: x.category ?? null }));
    rels += relations.length; facs += factions.length;
    places.push({ i, seed, recordSeed: t._seed ?? null, name: t.name, government: ps.government ?? null, legitimacy: ps.publicLegitimacy?.label ?? null, stability: ps.stability ?? null, names: [...names], facts, factions, relations, institutions, conflicts: (t.conflicts || []).map((c) => ({ parties: c.parties, intensity: c.intensity, issue: c.issue })) });
  }
  out.sizes[size] = places;
  console.log(`births ${size}: places ${places.length} · powers ${facs} · relation rows ${rels}`);
}
writeFileSync(cachePath, JSON.stringify(out));
console.log(`written <cache.json> (a local cache, not committed; reproduce: M4_BASE=<base> node m4-births.mjs <checkout> ${n} <cache.json>)`);
