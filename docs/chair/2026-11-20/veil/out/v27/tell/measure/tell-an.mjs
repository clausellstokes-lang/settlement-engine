// tell-an.mjs <dir>: R3-TELL unit 1's tables from tell.probe.jsx's four shards. MEASURE ONLY (exit 0 unless a shard threw).
import { readFileSync } from 'node:fs';
const dir = process.argv[2];
const towns = [0, 1, 2, 3].flatMap((s) => JSON.parse(readFileSync(`${dir}/shard${s}.json`, 'utf8')));
const pool = towns.filter((t) => t.reads); const ctl = towns.filter((t) => t.control);
// R3-CURE-5's thirteen LOWER towns and the ruled rule each rests on (R3C5-HANDBACK unit 3; PART 28 ruling 52)
const LOWER = {
  'r3m-city-none-0-31': 'income.criminalRow', 'r3m-town-insurgency-1-94': 'income.criminalRow', 'r3m-town-under_siege-0-18': 'income.criminalRow', 'r3m-town-under_siege-1-88': 'income.criminalRow',
  'r3m-city-under_siege-1-118': 'income.criminalRow + covert', 'r3m-town-under_siege-0-28': 'income.criminalRow + covert', 'r3m-town-under_siege-1-98': 'income.criminalRow + covert', 'r3m-town-wartime-0-29': 'income.criminalRow + covert',
  'r3m-town-none-0-17': 'covert', 'r3m-town-none-1-91': 'covert',
  'r3m-metropolis-insurgency-1-124': 'power.entry', 'r3m-metropolis-wartime-0-59': 'power.entry', 'r3m-town-none-0-23': 'power.entry',
};
const n = (o) => Object.values(o || {}).reduce((a, v) => a + (Array.isArray(v) ? v.length : v.n ?? 0), 0);
const cRows = (tell, side) => Object.values(tell).filter((v) => v.kind === 'C').reduce((a, v) => a + v[side], 0);
const dRows = (tell, side) => Object.values(tell).filter((v) => v.kind === 'D').reduce((a, v) => a + v[side], 0);
const med = (xs) => { if (!xs.length) return 0; const s = [...xs].sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; };
const threw = towns.filter((t) => t.threw || t.Bthrew);
console.log(`births ${towns.length}; with a hidden house and a counterfactual ${pool.length}; control ${ctl.length}; threw ${threw.length}`);
console.log(`CONTROL: the counterfactual's path cutting nothing equals the plain birth byte for byte in ${ctl.filter((t) => t.control.cutEqualsPlain).length} of ${ctl.length} (so its target page IS its served page: the rule cannot move a control town)`);
const keys = [...new Set(pool.flatMap((t) => Object.keys(t.reads)))];
const SET_ORDER = ['own', 'g:110', 'g:101', 'g:011', 'g:100', 'g:010', 'g:001', 'g:000', 'allOpen', 'off'];
const ordered = ['off', 'dm'].flatMap((dm) => SET_ORDER.map((s) => `${dm}|${s}`)).filter((k) => keys.includes(k));
console.log('\nSETTINGS: own = the three criminal groupings + hooks open (the gate\'s); g:<services><defense><underside> 1 open 0 shut (+ hooks open); allOpen = every criminal part shown but the hideable houses; off = the criminal switch OFF.');
console.log('\nTABLE 1: PER READ (Reveal) AND SETTING, OF', pool.length, 'TOWNS. target = own setting / a nearer setting / the switch-off page; tell YES (twin; server); YES on content families alone; W uncoverable (the rule would REVEAL); drift (B shows content A never had); server-twin parity breaks; rows a reader of the cured page LOSES beside today\'s (content, derived: total, median per town); rows the target shows that today\'s page lacks (content)');
console.log('read|setting | own | nearer | off | YES twin | YES server | YES content-only | content reachable by withholding alone | uncoverable | drift | parity breaks | lose C (tot/med) | lose D (tot/med) | target-only C (tot)');
for (const k of ordered) {
  const rs = pool.map((t) => t.reads[k]).filter(Boolean);
  const c = (f) => rs.filter(f).length;
  const loseC = rs.map((r) => cRows(r.tell, 'a')); const loseD = rs.map((r) => dRows(r.tell, 'a')); const gainC = rs.map((r) => cRows(r.tell, 'b'));
  console.log(`${k} | ${c((r) => r.nClass === 'own')} | ${c((r) => r.nClass === 'nearer')} | ${c((r) => r.nClass === 'off')} | ${c((r) => !Object.keys(r.tell).length)} | ${c((r) => r.srvTell && !r.srvTell.length)} | ${c((r) => !Object.values(r.tell).some((v) => v.kind === 'C'))} | ${c((r) => !Object.values(r.tell).some((v) => v.kind === 'C' && v.b > 0))} | ${c((r) => n(r.uncovered) > 0)} | ${c((r) => n(r.drift) > 0)} | ${c((r) => (r.parA || []).length || (r.parT || []).length)} | ${loseC.reduce((a, b) => a + b, 0)}/${med(loseC)} | ${loseD.reduce((a, b) => a + b, 0)}/${med(loseD)} | ${gainC.reduce((a, b) => a + b, 0)}`);
}
console.log('\nTABLE 2: PER FAMILY, over every town-read (', pool.length * ordered.length, '): town-reads where today\'s page and the target differ in it; of those, where today\'s page has MORE (a cure withholds: the cost), where the target has MORE (only a reveal closes it); W uncoverable by family; drift by family');
const fams = {};
for (const t of pool) for (const k of ordered) { const r = t.reads[k]; if (!r) continue;
  for (const [f, v] of Object.entries(r.tell)) { const x = (fams[f] ||= { kind: v.kind, differ: 0, aMore: 0, bMore: 0, unc: 0, drift: 0 }); x.differ += 1; if (v.a) x.aMore += 1; if (v.b) x.bMore += 1; }
  for (const f of Object.keys(r.uncovered || {})) (fams[f] ||= { kind: 'C', differ: 0, aMore: 0, bMore: 0, unc: 0, drift: 0 }).unc += 1;
  for (const f of Object.keys(r.drift || {})) (fams[f] ||= { kind: 'C', differ: 0, aMore: 0, bMore: 0, unc: 0, drift: 0 }).drift += 1; }
console.log('family | kind | differ | today has more | target has more | W uncoverable | drift');
for (const [f, x] of Object.entries(fams).sort((a, b) => b[1].differ - a[1].differ)) console.log(`${f} | ${x.kind} | ${x.differ} | ${x.aMore} | ${x.bMore} | ${x.unc} | ${x.drift}`);
console.log('\nTABLE 3: WHAT IS UNCOVERABLE (withheld by a fail-closed rule on today\'s page, shown by the target under EVERY setting of the owner\'s switches, the switch-off page included): towns by read and family, with examples');
const unc = {};
for (const t of pool) for (const k of ordered) { const r = t.reads[k]; if (!r) continue; for (const [f, xs] of Object.entries(r.uncovered || {})) { const u = (unc[`${k.split('|')[0]}|${f}`] ||= { towns: new Set(), ex: new Set() }); u.towns.add(t.seed); for (const x of xs.slice(0, 2)) if (u.ex.size < 4) u.ex.add(x.slice(0, 90)); } }
for (const [k, u] of Object.entries(unc).sort()) console.log(`  ${k}: ${u.towns.size} towns; e.g. ${[...u.ex].join(' ; ')}`);
console.log('\nTABLE 4: THE THIRTEEN LOWER TOWNS (the rule each rests on), the owner\'s own setting: target class and the parts added; W; the families that differ (today more a / target more b); uncoverable');
for (const [seed, rule] of Object.entries(LOWER)) { const t = pool.find((x) => x.seed === seed); if (!t) { console.log(`  ${seed}: NOT IN THE POOL`); continue; }
  for (const dm of ['off', 'dm']) { const r = t.reads[`${dm}|own`];
    console.log(`  ${seed} [${rule}] Reveal ${dm}: target ${r.nClass} ${JSON.stringify(r.added)}; W ${Object.entries(r.W).map(([f, x]) => `${f}:${x.length}`).join(',') || '-'}; differ ${Object.entries(r.tell).map(([f, v]) => `${f}(a${v.a}/b${v.b})`).join(' ') || 'NONE (YES)'}; uncoverable ${Object.keys(r.uncovered).join(',') || '-'}`); } }
console.log('\nTABLE 5: THE 79 EQUAL TOWNS (the', pool.length - Object.keys(LOWER).length, 'hidden-house towns not LOWER): does the rule move them? per read and setting: tell NO / target nearer or off (the rule withholds more there) / uncoverable (it would reveal)');
const eq = pool.filter((t) => !LOWER[t.seed]);
for (const k of ordered) { const rs = eq.map((t) => t.reads[k]).filter(Boolean); console.log(`  ${k}: NO ${rs.filter((r) => Object.keys(r.tell).length).length}/${rs.length}; withholds more (target not own) ${rs.filter((r) => r.nClass !== 'own').length}; uncoverable ${rs.filter((r) => n(r.uncovered)).length}; content rows lost ${rs.reduce((a, r) => a + cRows(r.tell, 'a'), 0)}`); }
console.log('\nTABLE 6: PER TOWN, the owner\'s own setting (Reveal off | on): target class, parts added, content rows lost / derived rows lost / target-only content rows, families differing');
for (const t of [...pool].sort((a, b) => a.seed.localeCompare(b.seed))) {
  const cell = (dm) => { const r = t.reads[`${dm}|own`]; return `${r.nClass}${r.added.length ? ` +${r.added.map((a) => a.replace(/^block:/, '')).join('+')}` : ''} C-${cRows(r.tell, 'a')} D-${dRows(r.tell, 'a')} C+${cRows(r.tell, 'b')} [${Object.keys(r.tell).join(',') || 'YES'}]`; };
  console.log(`  ${t.seed}${LOWER[t.seed] ? ' (LOWER)' : ''} | ${cell('off')} | ${cell('dm')}`);
}
const brk = pool.flatMap((t) => ordered.filter((k) => t.reads[k] && ((t.reads[k].parA || []).length || (t.reads[k].parT || []).length)).map((k) => `${t.seed} ${k}: A ${t.reads[k].parA.join(',')} T ${t.reads[k].parT.join(',')}`));
console.log(`\nPARITY (server against twin, per family, A_X and T): ${brk.length} town-reads break`); for (const x of brk.slice(0, 40)) console.log(`  ${x}`);
const ptowns = {};
for (const t of pool) for (const k of ordered) { const r = t.reads[k]; if (!r) continue; for (const [side, x] of [['A', r.parAx], ['T', r.parTx]]) for (const [f, v] of Object.entries(x || {})) { const e = (ptowns[`${t.seed} ${side} ${f}`] ||= { reads: [], ex: `server more ${JSON.stringify(v.aEx).slice(0, 120)} | twin more ${JSON.stringify(v.bEx).slice(0, 120)}` }); e.reads.push(k); } }
console.log(`PARITY BY TOWN (side A = today's page, T = the target; server more | twin more): ${Object.keys(ptowns).length}`);
for (const [k, e] of Object.entries(ptowns)) console.log(`  ${k}: ${e.reads.length} reads (${e.reads.join(' ')}); ${e.ex}`);
console.log('\nTHE COUNTERFACTUAL\'S FIDELITY: B pages (twin, own setting, Reveal off and on) holding a cut house\'s name, by path (trace items naming a cut house are dropped from every B surface: the trace logs the selection before the cut)');
const fid = {}; let fidTowns = 0;
for (const t of pool) { const h = t.bCutNameHits || {}; if (Object.keys(h).length) fidTowns += 1; for (const [p, c] of Object.entries(h)) (fid[p] ||= { towns: 0, leaves: 0 }), fid[p].towns += 1, fid[p].leaves += c; }
console.log(`  towns ${fidTowns} of ${pool.length}`); for (const [p, x] of Object.entries(fid).sort((a, b) => b[1].towns - a[1].towns)) console.log(`  ${p}: ${x.towns} towns, ${x.leaves} leaves`);
process.exit(threw.length ? 1 : 0);
