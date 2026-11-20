// facts.mjs <tree> <recordsDir> <out.json>: per seed, a compact read of factsOf + a few raw fields
import fs from 'node:fs'; import path from 'node:path';
const [tree, rd, out] = process.argv.slice(2); const T = (p) => path.join(tree, p);
const { factsOf } = await import(T('src/domain/facts/factsOf.js'));
const O = {};
for (const f of fs.readdirSync(rd)) { if (!f.endsWith('.json')) continue; const s = f.slice(0, -5);
  const r = JSON.parse(fs.readFileSync(path.join(rd, f), 'utf8')); const F = factsOf(r); const d = F.defence || {};
  const c = F.crisis || {};
  O[s] = { tier: F.tier, pop: F.populationBand, kinds: c.kinds || c.active || null, fam: c.families || null,
    walls: d.walls, palisade: d.palisade, gate: d.gate, watch: d.watch, militia: d.militia, garrison: d.garrison, merc: d.mercenary, court: d.court, prison: d.prison,
    guard: F.guardPresence, soldiers: F.soldiers, port: F.water?.port ?? null, navigable: F.water?.navigable, coast: F.water?.coast,
    magicFn: F.magic?.functions, magicLvl: F.magic?.level, food: F.famine?.band, famine: F.famine?.famine, stores: F.storesMonths, pros: F.prosperity, crime: F.crime,
    ruler: F.rulerKind, war: F.warState, route: F.route, terrain: F.terrain,
    gov: r.powerStructure?.governingName || r.powerStructure?.government, stab: r.powerStructure?.stability,
    hist: (r.history?.historicalEvents || []).map((e) => `${e.type || e.category || '?'}:${e.name || ''}:${e.yearsAgo ?? ''}:${e.severity ?? ''}`),
    magicDep: r.defenseProfile?.magicDependency, inst: (r.institutions || []).map((i) => i.name).slice(0, 80),
    defInst: r.defenseProfile?.institutions, viable: r.viability?.viable ?? r.viabilityAnalysis?.viable,
    deficit: r.economicState?.foodSecurity?.deficitPct ?? r.economicState?.foodSecurity?.deficit, safety: r.safetyProfile?.safetyLabel,
  };
}
fs.writeFileSync(out, JSON.stringify(O)); console.log('facts', Object.keys(O).length);
