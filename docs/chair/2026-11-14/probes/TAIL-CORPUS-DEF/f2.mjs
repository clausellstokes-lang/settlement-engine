// f2.mjs <tree> <recordsDir> <out.json>: extra facts per town for TAIL-CORPUS-DEF-3
import fs from 'node:fs'; import path from 'node:path';
const [tree, rd, out] = process.argv.slice(2);
const { factsOf } = await import(path.join(tree, 'src/domain/facts/factsOf.js'));
const O = {};
for (const f of fs.readdirSync(rd)) { if (!f.endsWith('.json')) continue; const s = f.slice(0, -5);
  const r = JSON.parse(fs.readFileSync(path.join(rd, f), 'utf8')); const F = factsOf(r);
  const ps = r.powerStructure || {};
  O[s] = { tier: F.tier, pop: r.population ?? r.totalPopulation, market: F.market, guild: F.guild, imports: (F.imports||[]).length, exports: (F.exports||[]).length,
    crisis: F.crisis, ruler: F.rulerKind, nfac: (ps.factions||[]).length, facs: (ps.factions||[]).map(x=>x.name||x.faction).slice(0,8),
    rel: Object.keys(ps).filter(k=>/rel|conflict|quarrel|tension/i.test(k)), stab: ps.stability, legit: ps.publicLegitimacy?.label,
    npcs: (r.npcs||[]).length, conds: (r.activeConditions||[]).map(c=>`${c.archetype}:${c.status}:${c.severityBand}`),
    stress: (Array.isArray(r.stress)?r.stress:[]).map(x=>x.type||x.kind||x.id), slaves: r.slavery ?? r.config?.slavery ?? null };
}
fs.writeFileSync(out, JSON.stringify(O)); console.log('f2', Object.keys(O).length);
