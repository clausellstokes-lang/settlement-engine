// PLACE-1 MEASURE, field `economicState.safetyProfile.safetyDesc` (2026-11-20).
// Run from this directory:   node --import ./tap-register.mjs measure.mjs <repo> [n=100] > out/births.jsonl
// Births and mask are the chair's census's, VERBATIM (docs/chair/2026-11-20/seventh/measures/stored-census/census.mjs at
// bca8c6fe3): seeds hxd-<size>-<i>, birthConfig({ ...DEFAULT_CONFIG, settType: size }), the names masked to '#', digits to '0'.
// One JSON line a birth: the stored line (raw, masked), its label, the WRITER's call(s) as the tap saw them (the roster the
// writer had, the seed reachable there), and the facts a wording could say, read at the writer and on the final record.
const [, , L, nArg = '100'] = process.argv;
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { defenceOf } = await import(`${L}/src/domain/facts/defence.js`);
const { factsOf } = await import(`${L}/src/domain/facts/factsOf.js`);
const { orderForceOf } = await import(`${L}/src/domain/facts/orderForce.js`);
const { partitionDefenseInstitutions } = await import(`${L}/src/domain/institutions/defenseInstitutionBuckets.js`);
const { liveInstitutions } = await import(`${L}/src/domain/institutions/institutionRoster.js`);
await loadGenerationLawPayloads();
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const n = +nArg;
const esc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const pickDef = (d) => ({ walls: d.walls, wallKind: d.wallKind, palisade: d.palisade, gate: d.gate, watch: d.watch, militia: d.militia, garrison: d.garrison, mercenary: d.mercenary, court: d.court, prison: d.prison });
const names = (xs) => (xs || []).map((i) => String(i?.name ?? '')).filter(Boolean);
/** the facts a safety wording could say, from one record (the writer's partial one, or the final one) */
function factRow(rec) {
  const f = factsOf(rec);
  const live = liveInstitutions(rec) || [];
  const b = partitionDefenseInstitutions(live);
  const of = orderForceOf(rec);
  const safe = (g) => { try { return g(); } catch (e) { return `ERR:${e.message}`; } };
  return {
    def: pickDef(f.defence),
    forceWalksByDay: safe(() => f.forceWalksByDay),
    paidWatch: safe(() => f.paidWatch),
    guardPresence: safe(() => f.guardPresence),
    orderForce: { kept: of.kept, paid: of.paid, volunteers: of.volunteers, pay: of.pay },
    houses: { garrison: names(b.garrison), watch: names(b.watch), militia: names(b.militia), mercenary: names(b.mercenary), walls: names(b.walls ?? b.wall ?? []) },
    forceDescs: (of.houses || []).map((h) => `${h.name}: ${String(h.desc ?? '').slice(0, 120)}`),
    market: safe(() => f.market),
    route: safe(() => f.route),
    terrain: safe(() => f.terrain),
    tier: safe(() => f.tier),
    courtSits: safe(() => f.courtSits),
    crime: safe(() => f.crime),
    crimeWave: safe(() => f.crimeWave),
    sacredHouse: safe(() => f.sacredHouse),
    guild: safe(() => f.guild),
  };
}

let calls = [];
globalThis.__safetyTap = (args, out, seed) => {
  const [config, tier, institutions] = args;
  calls.push({ tier, seed: seed ?? null, configSeed: typeof config?._seed === 'string' ? config._seed : null, nInst: (institutions || []).length, instNames: names(institutions), safetyLabel: out.safetyLabel, safetyDesc: out.safetyDesc,
    stressTypes: config?.stressTypes ?? (config?.stressType ? [config.stressType] : []), monsterThreat: config?.monsterThreat ?? null,
    routeAtWriter: config?.tradeRouteAccess ?? null, terrainAtWriter: config?.terrainType ?? null,
    facts: factRow({ institutions, tier }) });
};

for (const size of SIZES) {
  for (let i = 0; i < n; i++) {
    const seed = `hxd-${size}-${i}`;
    calls = [];
    const t = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
    const nm = new Set();
    const add = (x) => { if (typeof x === 'string' && x.trim().length > 2) nm.add(x.trim()); };
    add(t.name);
    for (const p of t.npcs || []) { add(p.name); for (const w of String(p.name || '').split(/\s+/)) if (w.length > 3) add(w); }
    for (const f of t.powerStructure?.factions || []) { add(f.name); add(f.faction); }
    const list = [...nm].sort((a, b) => b.length - a.length);
    const re = list.length ? new RegExp(list.map(esc).join('|'), 'g') : null;
    const mask = (s) => (re ? s.replace(re, '#') : s).replace(/\d+/g, '0');
    const sp = t.economicState?.safetyProfile || {};
    const desc = typeof sp.safetyDesc === 'string' ? sp.safetyDesc : null;
    const finalFacts = factRow(t);
    process.stdout.write(JSON.stringify({
      size, i, seed, tier: t.tier ?? t.config?.settType ?? size,
      safetyLabel: sp.safetyLabel ?? null, safetyDesc: desc, masked: desc == null ? null : mask(desc),
      economicDragDesc: sp.economicDragDesc ?? null,
      exports: (t.economicState?.primaryExports || []).map(String), imports: (t.economicState?.primaryImports || []).map(String),
      tradeRouteAccess: t.config?.tradeRouteAccess ?? null,
      tensions: (t.history?.currentTensions || []).map((x) => x?.type).filter(Boolean),
      calls, finalFacts, finalInstNames: names(t.institutions), tapErr: globalThis.__safetyTapErr ? String(globalThis.__safetyTapErr) : null,
    }) + '\n');
  }
}
