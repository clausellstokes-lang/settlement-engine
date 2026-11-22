// PEOPLE-1 seat M1 (2026-11-20): the births the measure reads, born EXACTLY as the chair's instrument births them
// (lane/chair-2026-11-08 :: docs/chair/2026-11-20/seventh/measures/stored-census/census.mjs): seeds hxd-<size>-<i>,
// generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} }) after
// loadGenerationLawPayloads(); the same name mask (the place's name, its people's names and their words of more than three
// letters, its powers' names -> '#'; digits -> '0').
// It keeps, per place, only what the M1 measure reads: the cards that carry structuralPosition or activeConstraint (with the
// keys the projection needs), the place's facts read through `factsOf` on the FINAL record, the powers and the roster.
// Usage: node m1-births.mjs <checkout> <n per size> <cache.json>   (prints count lines only)
import { writeFileSync } from 'node:fs';

const [, , L, nArg = '100', cachePath] = process.argv;
if (!L || !cachePath) throw new Error('usage: node m1-births.mjs <checkout> <n> <cache.json>');
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { factsOf } = await import(`${L}/src/domain/facts/factsOf.js`);
await loadGenerationLawPayloads();

const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const n = +nArg;
const out = { base: process.env.M1_BASE || null, n, sizes: {} };
for (const size of SIZES) {
  const places = [];
  let cards = 0;
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
    const facts = {
      rulerKind: f.rulerKind ?? null, rulingBody: f.rulingBody ?? null, seatMembers: f.seatMembers ?? null, sovereign: !!f.sovereign,
      rivalPower: !!f.rivalPower, seatOutranked: !!f.seatOutranked, guild: !!f.guild, sacredHouse: !!f.sacredHouse,
      hasChurch: !!faith?.hasChurch, faithAccessOnly: !!faith?.accessOnly, tithe: !!faith?.tithe,
      paidWatch: !!f.paidWatch, guardPresence: !!f.guardPresence, watch: !!d.watch, militia: !!d.militia, garrison: !!d.garrison,
      mercenary: !!d.mercenary, walls: !!d.walls, court: !!d.court, courtSits: !!f.courtSits, legalHouse: !!f.legalHouse,
      market: !!f.market, appointedPost: f.appointedPost ?? null, prosperity: f.prosperity ?? null, keep: f.keep,
      populationBand: f.populationBand ?? null, tier: f.tier ?? null, crime: f.crime, magic: f.magic?.functions ?? f.magic ?? null,
      crisisKinds: (() => { try { const c = f.crisis; return Array.isArray(c?.kinds) ? c.kinds : []; } catch { return []; } })(),
      // the goods (NOT masked by the chair's instrument): the export and import lists as factsOf reads them, names only
      exports: (f.exports || []).map((x) => (typeof x === 'string' ? x : x?.name || x?.resource || x?.item || x?.label || null)).filter(Boolean).slice(0, 4),
      imports: (f.imports || []).map((x) => (typeof x === 'string' ? x : x?.name || x?.resource || x?.item || x?.label || null)).filter(Boolean).slice(0, 4),
      terrain: f.terrain || null, route: f.route || null, water: f.water ?? null,
    };
    const factions = (t.powerStructure?.factions || []).map((x) => ({ name: x.faction || x.name, category: x.category || 'other', powerLabel: x.powerLabel ?? null, power: x.power ?? 0, isGoverning: !!x.isGoverning }));
    const institutions = (t.institutions || []).map((x) => ({ name: x.name, category: x.category ?? null }));
    const enriched = (t.npcs || []).filter((c) => c.structuralPosition != null || c.activeConstraint != null).map((c) => ({
      id: c.id, name: c.name, category: c.category ?? null, rank: c.structuralRank ?? null, cond: c.settlementCondition ?? null,
      title: c.title ?? null, role: c.role ?? null, influence: c.influence ?? null,
      inst: c.institution ? { kind: c.institution.kind ?? null, key: c.institution.key ?? null, family: c.institution.family ?? null, title: c.institution.title ?? null } : null,
      memberships: (c.memberships || []).map((m) => ({ power: m?.power ?? null, rank: m?.rank ?? null })),
      pos: c.structuralPosition ?? null, con: c.activeConstraint ?? null,
    }));
    cards += enriched.length;
    places.push({ i, seed, recordSeed: t._seed ?? null, government: t.powerStructure?.government ?? null, names: [...names], facts, factions, institutions, npcCount: (t.npcs || []).length, cards: enriched });
  }
  out.sizes[size] = places;
  console.log(`births ${size}: places ${places.length} · cards carrying a structural field ${cards}`);
}
writeFileSync(cachePath, JSON.stringify(out));
console.log(`written ${cachePath}`);
