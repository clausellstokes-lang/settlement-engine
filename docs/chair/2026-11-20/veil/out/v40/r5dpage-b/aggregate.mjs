#!/usr/bin/env node
// R5D-PAGE-B (VEIL-40), PHASE 1: the tables of item 5b's measure from the probe's shards (r5dpageb-5b.probe.mjs). Light: no engine,
// no database. Usage: node aggregate.mjs <shard.ndjson>...  (prints the tables R5DPAGE-B-5B-MEASURE.md quotes)
import { readFileSync } from 'node:fs';
import { T12_ROWS } from './rivalRows.mjs';

const recs = [];
for (const f of process.argv.slice(2)) for (const line of readFileSync(f, 'utf8').split('\n')) if (line) recs.push(JSON.parse(line));
const by = (k) => recs.filter((r) => r.k === k);
const inc = (m, k, n = 1) => m.set(k, (m.get(k) || 0) + n);
const out = (...a) => console.log(a.join(' '));
const table = (title, head, rows) => {
  out(`\n### ${title}`);
  out(`| ${head.join(' | ')} |`); out(`|${head.map(() => '---').join('|')}|`);
  for (const r of rows) out(`| ${r.join(' | ')} |`);
};

// ── RUN ──
const starts = by('start'); const ends = by('end'); const errs = by('err');
out('## RUN');
const ofPools = new Map(starts.map((s) => [String(s.shard).split(' ')[0], s.of]));
out(`shards ${starts.length} (ended ${ends.length}); places ${starts.reduce((a, s) => a + s.places, 0)} of ${[...ofPools.values()].reduce((a, b) => a + b, 0)} (${[...ofPools].map(([k, v]) => `${k} ${v}`).join(', ')}); errors ${errs.length}`);
for (const e of errs.slice(0, 20)) out(`  ERR ${JSON.stringify(e)}`);
for (const e of ends) out(`  shard ${e.shard}: ${Math.round(e.ms / 1000)} s, ended ${e.at}`);
for (const b of by('born')) out(`  births made (the whole pool, its recipe's order): ${b.n} in ${Math.round(b.ms / 1000)} s`);
for (const f of by('fp').filter((x) => ['r3m-city-none-0-37', 'jp6-city-8'].includes(x.seed))) out(`  fingerprint ${f.seed}: ${f.fp} roster ${JSON.stringify(f.roster)}`);

// ── PLACES AND RIVALS ──
const places = by('place');
const poolsOf = new Map();
for (const p of places) { const x = poolsOf.get(p.pool) || { places: 0, rivals: 0, prose: 0, noHost: 0, hostHidden: 0, hostGov: 0, drift: 0, copyNe: 0, tpl: new Map() }; x.places += 1; x.prose += p.publicProse ? 1 : 0;
  for (const r of p.rivals) { x.rivals += 1; if (!r.host) x.noHost += 1; if (r.hostHidden) x.hostHidden += 1; if (r.hostGov) x.hostGov += 1; if (r.t12Drift) x.drift += 1; if (r.host && r.tpl === 'T13' && !r.copyEq) x.copyNe += 1; inc(x.tpl, r.tpl); }
  poolsOf.set(p.pool, x); }
table('places and density rivals (stored)', ['pool', 'places', 'with publicProse', 'rivals', 'no host on the born roster', 'host hidden at birth', 'host governing', 'T13 base != host base', 't12 copy drift', 'by template'],
  [...poolsOf].map(([k, x]) => [k, x.places, x.prose, x.rivals, x.noHost, x.hostHidden, x.hostGov, x.copyNe, x.drift, [...x.tpl].sort().map(([t, n]) => `${t} ${n}`).join(', ')]));
const noHost = places.flatMap((p) => p.rivals.filter((r) => !r.host).map((r) => `${p.seed} ${r.name} (niche ${r.niche}, ${r.tpl})`));
if (noHost.length) out(`rivals with no host on the born roster: ${noHost.slice(0, 12).join('; ')}`);
const copyNe = places.flatMap((p) => p.rivals.filter((r) => r.host && r.tpl === 'T13' && !r.copyEq).map((r) => `${p.seed} ${r.name}<-${r.host}: rival ${JSON.stringify(String(r.base).slice(0, 70))} | host ${JSON.stringify(String(r.hostBase).slice(0, 70))}`));
if (copyNe.length) out(`T13 rivals whose base is not the host's (${copyNe.length}): \n  ${copyNe.slice(0, 12).join('\n  ')}`);

// ── Q1 ──
const q1 = by('q1');
const q1rows = new Map();
for (const r of q1) {
  const k = `${r.tpl}|${r.dm ? 'DM' : 'off'}`;
  const x = q1rows.get(k) || { reads: 0, servedH: 0, servedN: 0, eqBase: 0, eqPage: 0, eqStored: 0, masked: 0, host: new Map(), recs: new Set() };
  x.reads += 1; x.recs.add(`${r.rec}|${r.rival}`); if (r.servedH) x.servedH += 1; if (r.servedN) x.servedN += 1; if (r.servedH && r.eqBase) x.eqBase += 1; if (r.servedH && r.eqPage) x.eqPage += 1;
  if (r.servedH && r.eqStored) x.eqStored += 1; if (r.masked) x.masked += 1; inc(x.host, r.hostServed);
  q1rows.set(k, x);
}
table('Q1: the rival\'s served base, hiding read vs the never-there place (engine-door reads; both engines, both doors)', ['template', 'Reveal', 'rival x record', 'engine-door reads', 'rival served (hiding)', 'served (never there)', 'base equal', 'page desc (base+S) equal', 'served base = stored base', 'served base carries the mask', 'the host on the hiding read'],
  [...q1rows].sort().map(([k, x]) => [...k.split('|'), x.recs.size, x.reads, x.servedH, x.servedN, x.eqBase, x.eqPage, x.eqStored, x.masked, [...x.host].map(([a, b]) => `${a} ${b}`).join(', ')]));
const q1ne = q1.filter((r) => r.servedH && !r.eqBase);
out(`Q1 base not equal: ${q1ne.length}${q1ne.length ? `\n  ${q1ne.slice(0, 10).map((r) => `${r.rec} ${r.eng} ${r.door} dm=${r.dm} ${r.rival}: ${JSON.stringify(r.baseH).slice(0, 80)} | ${JSON.stringify(r.baseN).slice(0, 80)}`).join('\n  ')}` : ''}`);
const q1pe = q1.filter((r) => r.servedH && !r.eqPage);
out(`Q1 page desc not equal: ${q1pe.length}${q1pe.length ? `\n  ${q1pe.slice(0, 10).map((r) => `${r.rec} ${r.eng} ${r.door} dm=${r.dm} ${r.rival}: ${JSON.stringify(r.pageH).slice(-90)} | ${JSON.stringify(r.pageN).slice(-90)}`).join('\n  ')}` : ''}`);
const q1ns = q1.filter((r) => r.servedH && !r.eqStored);
out(`Q1 served base != stored base (the projection's mask or a cut): ${q1ns.length}${q1ns.length ? `\n  ${q1ns.slice(0, 6).map((r) => `${r.rec} ${r.eng} ${r.door} dm=${r.dm} ${r.rival}: served ${JSON.stringify(r.baseH).slice(0, 90)} | stored ${JSON.stringify(r.storedBase).slice(0, 90)}`).join('\n  ')}` : ''}`);

// ── THE FREE DIFFERENTIAL ──
const diff = by('diff');
const dd = new Map();
for (const r of diff) { const k = r.dm ? 'DM' : 'off'; const x = dd.get(k) || { reads: 0, powers: 0, bReads: 0, bPow: 0, pReads: 0, pPow: 0, ex: [] }; x.reads += 1; x.powers += r.powers;
  if (r.baseDiff.length) { x.bReads += 1; x.bPow += r.baseDiff.length; } if (r.pageDiff.length) { x.pReads += 1; x.pPow += r.pageDiff.length; if (x.ex.length < 8) x.ex.push(`${r.rec} ${r.eng} ${r.door}: ${r.pageDiff.join(', ')}`); } dd.set(k, x); }
table('the free differential: every served power of every hand-hide record, hiding vs never there', ['Reveal', 'engine-door reads', 'power rows', 'reads with a base differing', 'power rows', 'reads with a page desc differing', 'power rows'],
  [...dd].map(([k, x]) => [k, x.reads, x.powers, x.bReads, x.bPow, x.pReads, x.pPow]));
for (const [k, x] of dd) if (x.ex.length) out(`page desc differs (${k}): \n  ${x.ex.join('\n  ')}`);

// ── Q2 ──
const open = by('open').filter((r) => r.pool === 'A' || r.pool === 'C6');
const openOk = open.filter((r) => r.hn);
const openPlaces = new Set(openOk.map((r) => r.seed));
const allPoolPlaces = new Set(places.filter((p) => p.pool === 'A' || p.pool === 'C6').map((p) => p.seed));
out(`\n## Q2 open index: ${allPoolPlaces.size} pool places; ${openPlaces.size} serve a nothing-hidden read on some engine-door-Reveal (${openOk.length} of ${open.length} engine-door reads hide nothing)`);
const notOpen = open.filter((r) => !r.hn); const nwh = new Map(); for (const r of notOpen) for (const w of r.wh || []) inc(nwh, w);
out(`  reads that hide something at the open setting: ${notOpen.length}; withheld there: ${[...nwh].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([a, b]) => `${a} ${b}`).join(', ')}`);
// variant agreement: per place and Reveal, the rosters (name, base) the four engine-doors serve
const vk = new Map();
for (const r of openOk) { const k = `${r.seed}|${r.dm}`; const s = JSON.stringify(r.roster.map((x) => [x.name, x.base]).sort()); const e = vk.get(k) || new Set(); e.add(s); vk.set(k, e); }
out(`  open place x Reveal whose engine-door rosters (name, base) disagree: ${[...vk.values()].filter((s) => s.size > 1).length} of ${vk.size}`);
// strict: on an open read, a rival whose host is not on the served roster
const strict = []; let openRivalRows = 0; const t12Natural = [];
for (const r of openOk) { const names = new Set(r.roster.map((x) => x.name));
  for (const x of r.roster) { if (x.rival) { openRivalRows += 1; if (!x.host || !names.has(x.host)) strict.push(`${r.seed} ${r.eng} ${r.door} dm=${r.dm} ${x.name} (host ${x.host})`); }
    if (!x.rival && T12_ROWS.some(([, t]) => t === x.base)) t12Natural.push(`${r.seed} ${x.name}`); } }
out(`  open rival rows ${openRivalRows}; of them with no host on the served roster: ${strict.length}${strict.length ? ` (${[...new Set(strict.map((s) => s.split(' ')[0]))].length} places): ${strict.slice(0, 8).join('; ')}` : ''}`);
out(`  open NATURAL rows (no contestsNiche) whose base is a T12 row's text: ${t12Natural.length}${t12Natural.length ? `: ${t12Natural.slice(0, 6).join('; ')}` : ''}`);
const occ = new Map(); // base -> [{seed, size, dm, eng, door, row, roster}]
for (const r of openOk) for (const x of r.roster) if (typeof x.base === 'string') { const e = occ.get(x.base) || []; e.push({ r, x }); occ.set(x.base, e); }
const lone = (tpl, x, roster) => {
  if (tpl === 'T13') return !roster.some((y) => y !== x && y.base === x.base);
  const re = T12_ROWS[Number(tpl.split('.')[1])][0];
  return !roster.some((y) => y !== x && re.test(String(y.base ?? '')));
};
const q2 = new Map(); const q2ex = { lone: [], loneRival: [], sameNameLone: [], otherName: [] };
const dims = (r) => [['template', r.tpl], ['kind', r.cat ?? '?'], ['size', r.size], ['template x Reveal', `${r.tpl} ${r.dm ? 'DM' : 'off'}`]];
const perRival = new Map();
for (const r of q1.filter((y) => y.servedH && typeof y.baseH === 'string')) {
  const os = occ.get(r.baseH) || [];
  const s = { occ: new Set(), lone: new Set(), loneRival: new Set(), loneNatural: new Set(), loneNaturalHost: new Set(), loneNaturalOther: new Set(), sameName: new Set(), sameNameLone: new Set(), sameNameLoneNatural: new Set() };
  for (const { r: ro, x } of os) {
    const l = lone(r.tpl, x, ro.roster);
    s.occ.add(ro.seed); if (x.name === r.rival) s.sameName.add(ro.seed);
    if (l) { s.lone.add(ro.seed); if (x.rival) s.loneRival.add(ro.seed); else { s.loneNatural.add(ro.seed); (x.name === r.host ? s.loneNaturalHost : s.loneNaturalOther).add(ro.seed); if (x.name !== r.host && q2ex.otherName.length < 10) q2ex.otherName.push(`${r.rec} ${r.rival} (${r.tpl}, host ${r.host}): lone natural ${x.name} at ${ro.seed}`); } if (x.name === r.rival) { s.sameNameLone.add(ro.seed); if (!x.rival) s.sameNameLoneNatural.add(ro.seed); } }
  }
  const key = `${r.rec}|${r.rival}`;
  const pr = perRival.get(key) || { r, reads: 0, any: { occ: 0, lone: 0, loneRival: 0, loneNatural: 0, sameNameLone: 0 }, places: { occ: new Set(), lone: new Set(), loneNatural: new Set(), loneRival: new Set(), sameNameLone: new Set() } };
  pr.reads += 1;
  for (const f of ['occ', 'lone', 'loneRival', 'loneNatural', 'sameNameLone']) { if (s[f].size) pr.any[f] += 1; for (const p of s[f]) pr.places[f].add(p); }
  perRival.set(key, pr);
  for (const [dim, v] of dims(r)) {
    const k = `${dim}\u0001${v}`;
    const x = q2.get(k) || { reads: 0, rivals: new Set(), occ: 0, lone: 0, loneRival: 0, loneNatural: 0, loneNaturalHost: 0, loneNaturalOther: 0, sameName: 0, sameNameLone: 0, sameNameLoneNatural: 0, masked: 0 };
    x.reads += 1; x.rivals.add(key); if (r.masked) x.masked += 1;
    for (const f of ['occ', 'lone', 'loneRival', 'loneNatural', 'loneNaturalHost', 'loneNaturalOther', 'sameName', 'sameNameLone', 'sameNameLoneNatural']) if (s[f].size) x[f] += 1;
    q2.set(k, x);
  }
  if (s.lone.size && q2ex.lone.length < 8) q2ex.lone.push(`${r.rec} ${r.rival} (${r.tpl}, dm=${r.dm}): lone at ${[...s.lone].slice(0, 3).join(', ')}`);
  if (s.loneRival.size && q2ex.loneRival.length < 8) q2ex.loneRival.push(`${r.rec} ${r.rival} (${r.tpl}): ${[...s.loneRival].slice(0, 3).join(', ')}`);
  if (s.sameNameLone.size && q2ex.sameNameLone.length < 8) q2ex.sameNameLone.push(`${r.rec} ${r.rival} (${r.tpl}): ${[...s.sameNameLone].slice(0, 3).join(', ')}`);
}
for (const dim of ['template', 'template x Reveal', 'kind', 'size']) {
  table(`Q2 by ${dim}: hiding-read rival engine-door reads whose served base B occurs on SOME open place (counted per read: does any open place ...)`,
    [dim, 'rival x record', 'reads', 'B served on any open place', '... by a power with no source of B on its roster (lone)', 'lone, the power a rival (host absent)', 'lone, the power natural', '... named as the hidden host', '... named otherwise', 'B on a power of the rival\'s NAME', 'that, lone', 'that, lone and natural', 'B carries the mask'],
    [...q2].filter(([k]) => k.startsWith(`${dim}\u0001`)).sort().map(([k, x]) => [k.split('\u0001')[1], x.rivals.size, x.reads, x.occ, x.lone, x.loneRival, x.loneNatural, x.loneNaturalHost, x.loneNaturalOther, x.sameName, x.sameNameLone, x.sameNameLoneNatural, x.masked]));
}
for (const [f, ex] of Object.entries(q2ex)) if (ex.length) out(`Q2 examples (${f}):\n  ${ex.join('\n  ')}`);
// the rival vocabulary: an open NATURAL row carrying a name some rival of the pools carries
const rivalNames = new Set(places.flatMap((p) => p.rivals.map((r) => r.name)));
const natRivalName = []; for (const r of openOk) for (const x of r.roster) if (!x.rival && rivalNames.has(x.name)) natRivalName.push(`${r.seed} ${x.name}`);
out(`\nQ2 rival names in the pools: ${rivalNames.size}; open NATURAL rows carrying one of them: ${natRivalName.length} (${[...new Set(natRivalName)].length} distinct place-names)${natRivalName.length ? `: ${[...new Set(natRivalName)].slice(0, 10).join('; ')}` : ''}`);
// per rival (record), the places
const pr = [...perRival.values()];
const prT = new Map();
for (const p of pr) { const k = p.r.tpl; const x = prT.get(k) || { rivals: 0, occ: 0, lone: 0, loneNatural: 0, loneRival: 0, sameNameLone: 0, lonePlaces: 0 }; x.rivals += 1;
  for (const f of ['occ', 'lone', 'loneNatural', 'loneRival', 'sameNameLone']) if (p.places[f].size) x[f] += 1; x.lonePlaces += p.places.lone.size; prT.set(k, x); }
table('Q2 per rival x record (any read): rivals for which SOME open place serves B ...', ['template', 'rival x record', 'B on an open place', 'lone', 'lone, natural', 'lone, a rival without host', 'lone, the rival\'s name', 'open places (sum) serving B lone'],
  [...prT].sort().map(([k, x]) => [k, x.rivals, x.occ, x.lone, x.loneNatural, x.loneRival, x.sameNameLone, x.lonePlaces]));
// distinct bases
const bases = new Map(); for (const p of pr) { const b = p.r.baseH; const x = bases.get(b) || { tpl: p.r.tpl, rivals: new Set(), lonePlaces: new Set(), occPlaces: new Set() }; x.rivals.add(p.r.rival); for (const s of p.places.lone) x.lonePlaces.add(s); for (const s of p.places.occ) x.occPlaces.add(s); bases.set(b, x); }
out(`\nQ2 distinct hiding-read bases: ${bases.size}; of them served LONE on some open place: ${[...bases.values()].filter((x) => x.lonePlaces.size).length}; on some open place at all: ${[...bases.values()].filter((x) => x.occPlaces.size).length}`);
for (const [b, x] of [...bases].sort((a, c) => c[1].rivals.size - a[1].rivals.size).slice(0, 14)) out(`  ${x.tpl} rivals ${x.rivals.size} | open places ${x.occPlaces.size} | lone ${x.lonePlaces.size} | ${JSON.stringify(b).slice(0, 110)}`);

// ── Q3 ──
const q3 = by('q3');
const recRivals = new Map(by('rec').map((r) => [`${r.rec}|${r.dm}`, r.rivals]));
const placeRivals = new Map(places.map((p) => [p.seed, new Set(p.rivals.map((r) => r.name))]));
const formT = new Map(); const pathT = new Map(); const engT = new Map(); let hTot = 0; let nTot = 0;
const known = [];
for (const r of q3) {
  const n = new Map(); for (const h of r.hits.filter((x) => x.side === 'n')) n.set(`${h.form}|${h.path}|${h.text}`, h.count);
  const rv = placeRivals.get(r.place) || new Set();
  for (const h of r.hits.filter((x) => x.side === 'h')) {
    const nk = n.get(`${h.form}|${h.path}|${h.text}`) || 0; const cls = nk ? 'also never-there' : 'hiding only';
    const inRival = h.owners.some((o) => rv.has(o.replace(/ \[stamped\]$/, '')));
    const stampedOwn = h.owners.some((o) => o.endsWith('[stamped]')) && /\.(faction|name)$/.test(h.path);
    const dmk = r.dm ? 'DM' : 'off';
    hTot += h.count;
    inc(formT, `${dmk}|${h.form}|${cls}`, h.count);
    inc(pathT, `${dmk}|${h.path}${stampedOwn ? ' (the stamped row\'s own name)' : ''}${inRival ? ' (a rival\'s row)' : ''}|${h.form}|${cls}`, h.count);
    inc(engT, `${dmk}|${r.eng}|${r.door}|${/exact/.test(h.form) && !/bare|singular|no-article/.test(h.form) && !/plural|possessive/.test(h.form) ? 'exact' : 'other forms'}|${cls}`, h.count);
    if (/desc$/.test(h.path) && /sentence|lower/.test(h.form) && !r.dm) known.push({ rec: r.rec, eng: r.eng, door: r.door, name: r.name, form: h.form, text: h.text, owners: h.owners, cls, count: h.count, ctx: h.ctx, inRival });
  }
  for (const h of r.hits.filter((x) => x.side === 'n')) nTot += h.count;
}
out(`\n## Q3: hits ${hTot} on hiding reads, ${nTot} on never-there reads (every string leaf, keys excluded; withheld POWERS' names; both engines, both doors)`);
table('Q3 by Reveal and form (hit count; class: does the same form at the same path with the same text occur on the never-there read)', ['Reveal', 'form', 'class', 'hits'],
  [...formT].sort().map(([k, v]) => [...k.split('|'), v]));
table('Q3 by engine and door (exact vs other forms)', ['Reveal', 'engine', 'door', 'forms', 'class', 'hits'], [...engT].sort().map(([k, v]) => [...k.split('|'), v]));
table('Q3 by path (Reveal, path, form, class)', ['Reveal', 'path', 'form', 'class', 'hits'], [...pathT].sort((a, b) => b[1] - a[1]).slice(0, 80).map(([k, v]) => [...k.split('|'), v]));
out(`\nQ3 player-view (Reveal off) hits in a served DESC in sentence or lower case: ${known.length} entries, ${known.reduce((a, k) => a + k.count, 0)} hits`);
for (const k of known.slice(0, 60)) out(`  ${k.rec} | ${k.eng} ${k.door} | ${k.name} | ${k.form} ${JSON.stringify(k.text)} x${k.count} | ${k.owners.join(',')}${k.inRival ? ' (rival row)' : ''} | ${k.cls} | ${JSON.stringify(k.ctx).slice(0, 120)}`);
const knownPlaces = [...new Set(known.map((k) => k.rec))];
out(`  records: ${knownPlaces.length}: ${knownPlaces.slice(0, 30).join('; ')}`);

// ── THE FOCUSED FIGURES the measure quotes (Q1 by whether the desc is served; Q3 in a served power's desc; the vocabulary) ──
{
  const m = new Map();
  for (const r of q1) inc(m, `${r.tpl}|${r.dm ? 'DM' : 'off'}|${!r.servedH ? 'row not served' : r.baseH === null ? 'desc not served' : 'desc served'}`);
  table('Q1 by whether the hiding read serves the rival\'s row and desc (engine-door reads)', ['template', 'Reveal', 'served', 'reads'], [...m].sort().map(([k, v]) => [...k.split('|'), v]));
  const ne = q1.filter((r) => r.servedH && r.baseH !== null && !r.eqStored);
  out(`Q1 desc served and the served base != the stored base: ${ne.length}`);
  const rv = new Map(places.map((p) => [p.seed, new Map(p.rivals.map((r) => [r.name, r]))]));
  const f = new Map(); const per = new Map(); let tot = 0;
  for (const r of q3.filter((x) => !x.dm)) for (const h of r.hits.filter((x) => x.side === 'h' && /^(powerStructure\.factions|factions)\[\]\.desc$/.test(x.path))) {
    const own = h.owners.map((o) => o.replace(/ \[stamped\]$/, '')); const rr = own.map((o) => rv.get(r.place)?.get(o)).find(Boolean);
    const cls = rr ? (rr.host === r.name ? `the hidden host's own rival (${rr.tpl})` : `a rival of another host (${rr.tpl})`) : 'a natural power';
    inc(f, `${h.path}|${h.form}|${cls}`, h.count); tot += h.count;
    const k = `${r.rec}|${own.join(',')}|${h.form} ${JSON.stringify(h.text)}`; const e = per.get(k) || { n: 0, reads: new Set(), ctx: h.ctx }; e.n += h.count; e.reads.add(`${r.eng}/${r.door}`); per.set(k, e);
  }
  table(`Q3 on the PLAYER VIEW in a served power's desc (${tot} hits)`, ['path', 'form', 'whose desc', 'hits'], [...f].sort().map(([k, v]) => [...k.split('|'), v]));
  table('Q3 the same, by record', ['record', 'the desc of', 'form and exact text', 'hits', 'engine/door reads', 'context'], [...per].map(([k, e]) => [...k.split('|'), e.n, [...e.reads].join(' '), JSON.stringify(e.ctx).slice(0, 90)]));
  const offExact = q3.filter((x) => !x.dm).flatMap((x) => x.hits.filter((h) => h.side === 'h' && /^(name|bare)\+exact(\+|$)/.test(h.form))).reduce((a, h) => a + h.count, 0);
  const offAll = q3.filter((x) => !x.dm).flatMap((x) => x.hits.filter((h) => h.side === 'h'));
  out(`Q3 player view: hits ${offAll.reduce((a, h) => a + h.count, 0)}; of them the exact name or bare form: ${offExact}; hiding only (not on the never-there read): ${q3.filter((x) => !x.dm).reduce((a, r) => { const n = new Set(r.hits.filter((h) => h.side === 'n').map((h) => `${h.form}|${h.path}|${h.text}`)); return a + r.hits.filter((h) => h.side === 'h' && !n.has(`${h.form}|${h.path}|${h.text}`)).reduce((b, h) => b + h.count, 0); }, 0)}`);
  const nat = new Map(); const rn = new Map(); for (const p of places) for (const r of p.rivals) inc(rn, r.name);
  for (const r of openOk) for (const x of r.roster) if (!x.rival && rn.has(x.name)) { const e = nat.get(x.name) || new Set(); e.add(r.seed); nat.set(x.name, e); }
  out(`Q2 the rival vocabulary: ${rn.size} names; open NATURAL rows carrying one, by name (places): ${[...nat].map(([k, v]) => `${k} ${v.size}`).join(', ') || 'none'}`);
}
