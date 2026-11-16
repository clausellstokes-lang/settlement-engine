// BAR6-AUDIT-G · THE DEFAULT-DENY DESIGN, MEASURED (BRIEF-BAR6-AUDIT seat G, point 2).
//   node defaultDeny-g.mjs <tree-root> <PAGE-COPY render dir> <out.json>
// The four scene groups that print on the Overview's "The place" paragraph and the Daily Life tab:
//   SENSORY  ARRIVAL_SENSES (src/data/arrivalProse.js), one pool a trade key (`lines` + `dominant`)
//   AMBIENT  ARRIVAL_PEOPLE (arrivalProse.js, one pool a culture) and ARRIVAL_SCENES (src/data/narrativeData.js)
//   ARRIVAL  ARRIVAL_TENSIONS, ARRIVAL_MEMORIES (arrivalProse.js) and STRESS_DESCS (narrativeData.js)
//   DAILY    the state annex's Daily Life blocks (title holds "Daily Life")
// For each line: its classes (tests/helpers/pageLaws/law5w.mjs) and its status a class. THE STATIC HALF: how many
// lines of each pool hold NO class word (safe as written), how many hold one and declare for it, how many need a
// declaration, how many have a twin. THE MEASURED HALF: for every town of three shapes in the render's corpus
// (hamlet under siege, village famine, thorp calm), the lines of each pool the town's OWN record admits today
// (`declarationAdmits(declarationOf(line), factsOf(record))`, the draw's own rule) and the lines it would admit if
// the pool drew ONLY from lines declared safe (no class word, or declared for every class it holds): is a pool MUTE
// (fewer than three lines)? A pool is counted for a town only where the town can reach it (a sense key whose house
// or trade the town has, its culture, its crisis key; a scene key and a daily-life pool everywhere).
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { pathToFileURL } from 'node:url';

const [treeArg, renderDir, outPath] = process.argv.slice(2);
if (!treeArg || !renderDir || !outPath) { console.error('usage: defaultDeny-g.mjs <tree> <render-dir> <out.json>'); process.exit(2); }
const TREE = path.resolve(treeArg);
const imp = async (rel) => import(pathToFileURL(path.join(TREE, rel)).href);
const voc = await imp('src/domain/facts/factVocabulary.js');
const { makeLaw5w } = await import(pathToFileURL(path.join(path.dirname(new URL(import.meta.url).pathname), '../../../../../tests/helpers/pageLaws/law5w.mjs')).href);
const LEX = makeLaw5w(voc);
const { factsOf } = await imp('src/domain/facts/factsOf.js');
const AP = await imp('src/data/arrivalProse.js');
const ND = await imp('src/data/narrativeData.js');

const textOf = (l) => { const t = typeof l === 'function' ? l : typeof l?.text === 'function' ? l.text : null; try { return t ? String(t('Name', 'Name')) : String(l?.text ?? l); } catch { return String(l?.text ?? ''); } };
/** one pool: { group, pool, key, gate, lines: [{ text, decl, twinOf, marks }] } */
const pools = [];
const addTable = (group, name, table, gate) => { for (const [k, arr] of Object.entries(table)) if (Array.isArray(arr)) pools.push({ group, pool: `${name}.${k}`, key: k, gate, lines: arr.map((l) => ({ raw: l, text: textOf(l) })) }); };
for (const s of AP.ARRIVAL_SENSES) for (const part of ['lines', 'dominant']) pools.push({ group: 'SENSORY', pool: `ARRIVAL_SENSES.${s.key}.${part}`, key: s.key, gate: { institutions: s.institutions, trade: s.trade, arcane: !!s.arcane, dominant: part === 'dominant' }, lines: (s[part] || []).map((l) => ({ raw: l, text: textOf(l) })) });
addTable('AMBIENT', 'ARRIVAL_PEOPLE', AP.ARRIVAL_PEOPLE, 'culture');
addTable('AMBIENT', 'ARRIVAL_SCENES', ND.ARRIVAL_SCENES, 'scene');
addTable('ARRIVAL', 'ARRIVAL_TENSIONS', AP.ARRIVAL_TENSIONS, 'tension');
addTable('ARRIVAL', 'ARRIVAL_MEMORIES', AP.ARRIVAL_MEMORIES, 'memory');
addTable('ARRIVAL', 'STRESS_DESCS', ND.STRESS_DESCS, 'stress');
const ANNEX = { defense: 'DOSSIER_STATE_PROSE_DEFENSE', economy: 'DOSSIER_STATE_PROSE_ECONOMY', general: 'DOSSIER_STATE_PROSE_GENERAL', power: 'DOSSIER_STATE_PROSE_POWER', stressors: 'DOSSIER_STATE_PROSE_STRESSORS', warFaith: 'DOSSIER_STATE_PROSE_WAR_FAITH' };
// the DAILY group: the annex pools whose lines the render's Daily Life tab prints (its World/Daily Life section and the
// PDF's IdentityDailyLife): a pool is in the group when one of its variants' longest fixed fragment is found there
const dumpsDir = path.join(renderDir, 'dumps');
const dailyText = fs.readdirSync(dumpsDir).filter((x) => x.endsWith('.txt')).map((x) => fs.readFileSync(path.join(dumpsDir, x), 'utf8'))
  .map((d) => d.split(/^(?=== )/m).filter((sec) => /^== (World\/Daily Life|PDF\/IdentityDailyLife) ==/.test(sec)).join('\n')).join('\n');
const longest = (t) => String(t).split(/\{[^}]*\}/).map((x) => x.trim()).sort((a, b) => b.length - a.length)[0] || '';
for (const [f, n] of Object.entries(ANNEX)) {
  const m = (await imp(`src/data/dossierStateProse/${f}.generated.js`))[n];
  for (const [bid, b] of Object.entries(m)) for (const [pk, arr] of Object.entries(b.pools || {})) {
    if (!arr.some((v) => { const fr = longest(v.text); return fr.length >= 18 && dailyText.includes(fr); })) continue;
    pools.push({ group: 'DAILY', pool: `${bid}::${pk}`, key: pk, gate: 'state', scoped: b.poolMeta?.[pk]?.crisisScoped === true, colour: b.poolMeta?.[pk]?.colour === true,
      lines: arr.map((v) => ({ raw: v, text: v.text, marks: v.marks || [] })) });
  }
}

// ---- the static half
// an annex variant: its mark words (the kernel's) and its atom words (the tag reading), one declaration
const declOf = (l) => { if (!l.marks) return voc.declarationOf(l.raw); const a = voc.declarationOfMarks(l.marks), b = voc.declarationOfTags(l.marks);
  return { needs: [...a.needs, ...b.needs], excludes: [...a.excludes, ...b.excludes], crisis: [...a.crisis, ...b.crisis] }; };
const atomsOf = (l) => (l.marks ? l.marks : voc.atomsOf(voc.declarationOf(l.raw)).flatMap((a) => (/^crisis: /.test(a) ? a.replace(/^crisis: /, '').split(', ').map((v) => `crisis: ${v}`) : [a])));
for (const p of pools) for (const l of p.lines) {
  l.isTwin = typeof l.raw?.twinOf === 'string';
  l.hasTwin = !l.isTwin && p.lines.some((x) => x.raw?.twinOf && x.raw.twinOf.replace(/\{name\}|\{settlement\}/g, 'Name') === l.text);
  l.classes = LEX.classesOf(l.text);
  const d = { atoms: atomsOf(l), twin: l.hasTwin, scoped: !!p.scoped, colour: !!p.colour || (l.marks || []).includes('colour') || l.raw?.colour === true, keyGate: p.group === 'SENSORY' };
  l.status = Object.fromEntries(l.classes.map((c) => [c, LEX.statusFor(c, d)]));
  l.safe = l.classes.every((c) => LEX.DECLARED.has(l.status[c]));
  l.safeStrict = l.classes.every((c) => LEX.DECLARED.has(l.status[c]) && l.status[c] !== 'keyed'); // STRICT: a sense key's house or trade does not answer the good a line shows
}
const stat = {};
for (const p of pools) {
  const g = stat[p.group] || (stat[p.group] = { pools: 0, lines: 0, twins: 0, noClass: 0, declaredAll: 0, needDecl: 0, withTwin: 0, needDeclByClass: {} });
  g.pools++;
  for (const l of p.lines) {
    if (l.isTwin) { g.twins++; continue; }
    g.lines++;
    if (!l.classes.length) g.noClass++; else if (l.safe) g.declaredAll++; else { g.needDecl++; for (const c of l.classes) if (!LEX.DECLARED.has(l.status[c])) g.needDeclByClass[c] = (g.needDeclByClass[c] || 0) + 1; }
    if (l.hasTwin) g.withTwin++;
  }
}

// ---- the measured half: the towns of three shapes
const SHAPES = ['hamlet-under_siege', 'village-famine', 'thorp-calm'];
const recs = [];
for (const line of zlib.gunzipSync(fs.readFileSync(path.join(renderDir, 'corpus.ndjson.gz'))).toString('utf8').split('\n')) {
  if (!line.trim()) continue; const o = JSON.parse(line); const sh = SHAPES.find((x) => o.seed.includes(`-${x}-`)); if (sh) recs.push({ seed: o.seed, shape: sh, s: o.s });
}
const wordStart = (hay, frag) => new RegExp(`(^|[^a-z])${frag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i').test(hay);
const reach = (p, s) => {
  if (p.group === 'SENSORY') { const names = (s.institutions || []).map((i) => String(i?.name || '')).join(' | ').toLowerCase(); const trade = [...(s.economicState?.primaryExports || []), ...(s.economicState?.incomeSources || []).map((x) => x?.source || x?.name || x)].map(String).join(' | ').toLowerCase();
    const has = p.gate.institutions.some((f) => wordStart(names, f)) || p.gate.trade.some((f) => wordStart(trade, f)); return p.gate.dominant ? p.gate.trade.some((f) => wordStart(trade, f)) : has; }
  if (p.gate === 'culture') return String(s.culture || s.config?.culture || '').toLowerCase() === p.key.toLowerCase() || p.key === 'default';
  if (p.gate === 'stress') { const st = [].concat(s.stress || s.stresses || []).map((x) => (typeof x === 'string' ? x : x?.type)); return st.includes(p.key); }
  return true;
};
const towns = [];
for (const r of recs) {
  let facts; try { facts = factsOf(r.s); } catch (e) { console.error(`factsOf ${r.seed}: ${e.message}`); continue; }
  const row = { seed: r.seed, shape: r.shape, pools: [] };
  for (const p of pools) { if (!reach(p, r.s)) continue;
    let today = 0, deny = 0, strict = 0;
    for (const l of p.lines) { if (l.isTwin) continue;
      let ad; try { ad = voc.declarationAdmits(declOf(l), facts, { crisisScoped: !!p.scoped }).admitted; } catch { ad = false; }
      let tw = false; if (!ad && l.hasTwin) { const t = p.lines.find((x) => x.isTwin && x.raw.twinOf.replace(/\{name\}|\{settlement\}/g, 'Name') === l.text); try { tw = !!t && voc.declarationAdmits(declOf(t), facts).admitted; } catch { tw = false; } }
      if (ad || tw) { today++; if (ad ? l.safe : true) deny++; if (ad ? l.safeStrict : true) strict++; }
    }
    row.pools.push({ group: p.group, pool: p.pool, today, deny, strict });
  }
  towns.push(row);
}
fs.writeFileSync(outPath, JSON.stringify({ stat, towns, pools: pools.map((p) => ({ group: p.group, pool: p.pool, lines: p.lines.map((l) => ({ text: l.text.slice(0, 160), isTwin: l.isTwin, hasTwin: l.hasTwin, classes: l.classes, status: l.status, safe: l.safe })) })) }, null, 1));

console.log('THE STATIC HALF (twins counted apart; a line "with a twin" is counted in its own column too)');
console.log('group     pools lines | no class word | declared for every class | needs a declaration | has a twin | twins | needs, by class');
for (const [g, v] of Object.entries(stat)) console.log(`${g.padEnd(9)} ${String(v.pools).padStart(5)} ${String(v.lines).padStart(5)} | ${String(v.noClass).padStart(13)} | ${String(v.declaredAll).padStart(24)} | ${String(v.needDecl).padStart(19)} | ${String(v.withTwin).padStart(10)} | ${String(v.twins).padStart(5)} | ${Object.entries(v.needDeclByClass).sort((a, b) => b[1] - a[1]).map(([c, n]) => `${c} ${n}`).join(', ')}`);
console.log('\nTHE MEASURED HALF: lines a reachable pool can print, today and under default-deny (median over the shape\'s towns; MUTE = fewer than three)');
const med = (a) => { const b = [...a].sort((x, y) => x - y); return b.length ? b[Math.floor((b.length - 1) / 2)] : 0; };
const muteRows = [];
for (const sh of SHAPES) {
  const T = towns.filter((t) => t.shape === sh); console.log(`-- ${sh} (${T.length} towns)`);
  for (const g of ['SENSORY', 'AMBIENT', 'ARRIVAL', 'DAILY']) {
    const P = T.flatMap((t) => t.pools.filter((p) => p.group === g).map((p) => ({ ...p, seed: t.seed })));
    const names = [...new Set(P.map((p) => p.pool))];
    const muteToday = names.filter((n) => P.some((p) => p.pool === n && p.today < 3));
    const muteDeny = names.filter((n) => P.some((p) => p.pool === n && p.deny < 3 && p.today >= 3));
    const muteStrict = names.filter((n) => P.some((p) => p.pool === n && p.strict < 3 && p.today >= 3));
    for (const n of muteDeny) { const ps = P.filter((p) => p.pool === n); muteRows.push({ shape: sh, group: g, pool: n, towns: ps.filter((p) => p.deny < 3 && p.today >= 3).length, of: ps.length, today: med(ps.map((p) => p.today)), deny: med(ps.map((p) => p.deny)), strict: med(ps.map((p) => p.strict)), strictTowns: ps.filter((p) => p.strict < 3 && p.today >= 3).length }); }
    for (const n of muteStrict.filter((x) => !muteDeny.includes(x))) { const ps = P.filter((p) => p.pool === n); muteRows.push({ shape: sh, group: g, pool: n, towns: 0, of: ps.length, today: med(ps.map((p) => p.today)), deny: med(ps.map((p) => p.deny)), strict: med(ps.map((p) => p.strict)), strictTowns: ps.filter((p) => p.strict < 3 && p.today >= 3).length }); }
    console.log(`   ${g.padEnd(8)} pools reached ${String(names.length).padStart(3)} · lines a reached pool can print (median) today ${med(P.map((p) => p.today))} → under deny ${med(P.map((p) => p.deny))} (strict ${med(P.map((p) => p.strict))}) · pools under three TODAY in some town ${muteToday.length} · NEWLY under three under deny in some town ${muteDeny.length} (strict ${muteStrict.length})`);
  }
}
console.log('\nTHE POOLS DEFAULT-DENY WOULD MUTE (fewer than three lines where today they hold three or more): shape · group · pool · towns · lines today → under deny (medians)');
for (const r of muteRows) console.log(`  ${r.shape} · ${r.group} · ${r.pool} · deny ${r.towns} / strict ${r.strictTowns} of ${r.of} towns · ${r.today} → ${r.deny} (strict ${r.strict})`);
fs.writeFileSync(outPath.replace(/\.json$/, '.mute.json'), JSON.stringify(muteRows, null, 1));
