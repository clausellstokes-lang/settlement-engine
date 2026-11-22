import { readRun, count, classOf, moduleIndex, moduleOf, SIZES } from '../../../../../../../scripts/sameness-census.mjs';
const [, , dir, cdir] = process.argv;
const run = readRun(dir); const crun = readRun(cdir); const idx = moduleIndex();
const LIST = /^(economicState\.safetyProfile\.(safetyDesc|economicDragDesc)|economicViability\.(dependencies|warnings)\[\]|economicState\.tradeDependencies\[\]\.impact|economicState\.activeChains\[\]\.entrepotNote|npcs\[\]\.(activeConstraint|structuralPosition)|spatialLayout\.quarters\[\]\.desc|settlementReason\[\]|history\.founding\.(foundedBy|overcoming)|powerStructure\.factionRelationships\[\]\.narrative|powerStructure\.factions\[\]\.desc|history\.currentTensions\[\]\.(plotHooks|lastingEffects)|stress\.cast\.stakes\[\]\.reason|economicState\.situationDesc|powerStructure\.recentConflict|pressureSentence)/;
const out = ['# Worst PRINTED one-a-place sentences NOT on the chair\'s 16:25 list (hxd, hxu beside), STATE and NARRATIVE (hand class first), holders >= 10, one row per source + top sentence, top 12 a size, RANKED BY THE SHARE OF ALL PLACES (the chair\'s denominator, 17:00); by containment is NOT yet applied to attribution (the door applies it)', ''];
for (const size of SIZES) {
  const c = count(run[size]); const cc = count(crun[size]); const by = new Map(cc.slots.map((r) => [r.key, r]));
  const m = new Map();
  for (const r of c.slots) {
    if (r.perPlace > 1.5 || r.holders < 10) continue;
    const mm = moduleOf(r.top, idx); r.module = mm ? mm.file : 'unfound';
    Object.assign(r, classOf(r));
    if (!/^(STATE|NARRATIVE)/.test(r.cls)) continue;
    if (r.paths.some((p) => LIST.test(p)) || LIST.test(r.source)) continue;
    const k = `${r.source.startsWith('COMPOSED@') ? r.source + r.module : r.source}\u0000${r.top}`;
    const o = m.get(k); if (!o) m.set(k, { ...r, surfaces: [r.surface] }); else { o.surfaces.push(r.surface); if (r.topShare > o.topShare) Object.assign(o, { ...r, surfaces: o.surfaces }); }
  }
  const N = run[size].length; const NU = crun[size].length; const rows = [...m.values()].sort((a, b) => b.topN - a.topN || b.topShare - a.topShare).slice(0, 12);
  out.push(`## ${size}`, '', '| # | hxd share of ALL places | hxu share of ALL | hxd among the slot\'s printers (slot key fault: siblings uncounted) | class | slot / source | top sentence |', '|---|---|---|---|---|---|---|');
  rows.forEach((r, i) => { const u = by.get(r.key); out.push(`| ${i + 1} | ${Math.round(100 * r.topN / N)}% (${r.topN}/${N}) | ${u ? `${Math.round(100 * u.topN / NU)}% (${u.topN}/${NU})` : 'absent'} | ${Math.round(100 * r.topShare)}% (${r.topN}/${r.holders}) | ${r.cls} | ${r.surfaces.map((s) => '`' + s + '`').join(' ')} · ${(r.source.startsWith('COMPOSED@') ? r.source + ' — ' + r.module : r.paths.slice(0, 2).join(', ')).replace(/\|/g, '\\|')} | ${(r.top.length > 120 ? r.top.slice(0, 119) + '…' : r.top).replace(/\|/g, '\\|')} |`); });
  out.push('');
}
console.log(out.join('\n'));
