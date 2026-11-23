// keylevel-an.mjs <json> <outstem>: the copy of R3-CURE-5 unit 2's analyzer (original: keylevel-an.orig.mjs) over
// m27/kl's keylevel.probe.jsx (twin AND server). Writes <outstem>-twin.txt and <outstem>-server.txt (each the original
// table, verbatim logic, its pages filtered to one engine), <outstem>-side.txt (the two side by side, row by row, DIFF
// marked), <outstem>-parity.txt (every (town, read, holder path, key) one engine serves and the other does not) and
// <outstem>-defkey.txt (task 2). Prints the totals.
import { readFileSync, writeFileSync } from 'node:fs';
const [file, stem] = process.argv.slice(2);
const all = JSON.parse(readFileSync(file, 'utf8'));
const pct = (n, d) => (d ? `${n}/${d} (${(100 * n / d).toFixed(1)}%)` : '0/0');

/** the original analyzer's body, its pages one engine's; returns { lines, rows } (rows: comparable cells by row key) */
function table(engine) {
  const towns = all.map((t) => ({ ...t, pages: (t.pages || []).filter((p) => p.engine === engine) }));
  const L = []; const log = (s) => L.push(s); const R = {};
  log(`ENGINE ${engine}; births ${towns.length}; threw ${towns.filter((t) => t.threw).length}; with a hideable house ${towns.filter((t) => t.hidden?.length).length}; control (none) ${towns.filter((t) => t.hidden && !t.hidden.length).length}; B threw ${towns.filter((t) => t.Bthrew).length}; server read null ${towns.reduce((a, t) => a + (t.serverNull || 0), 0)}`);
  if (towns.some((t) => t.stored)) {
    const st = {};
    for (const t of towns) for (const h of t.stored || []) { const k = `${h.list}|${h.key}|${t.size}`; (st[k] ||= [0, 0]); st[k][0] += 1; if (h.has) st[k][1] += 1; }
    log(`(a0) THE ENGINE (stored, shape ${towns[0].shape}): list | key | size: holders WITH the key`);
    for (const k of Object.keys(st).sort()) log(`  ${k}: with ${pct(st[k][1], st[k][0])}`);
  }
  for (const dm of [false, true]) {
    const D = dm ? 'ON' : 'OFF';
    log(`\n== Reveal DM ${D} (${engine}) ==`);
    const nh = towns.flatMap((t) => (t.pages || []).filter((p) => p.dm === dm && p.role !== 'hidden').map((p) => ({ t, p })));
    const rows = {};
    for (const { t, p } of nh) for (const h of p.served) { const k = `${h.list}|${h.kind}|${h.key}|${t.size}`; (rows[k] ||= [0, 0]); rows[k][0] += 1; if (h.has) rows[k][1] += 1; }
    const rowsPub = {};
    for (const { t, p } of nh) for (const h of p.pub) { const k = `${h.list}|${h.kind}|${h.key}|${t.size}`; (rowsPub[k] ||= [0, 0]); rowsPub[k][0] += 1; if (h.has) rowsPub[k][1] += 1; }
    log(`(a) NOTHING-HIDDEN pages: ${nh.length} (control ${nh.filter((x) => x.p.role === 'control').length}, counterfactual ${nh.filter((x) => x.p.role === 'counterfactual').length}). list | holder kind | key | size: served holders WITHOUT the key / served holders (and in the projection before the veil: WITH the key)`);
    for (const k of Object.keys(rows).sort()) { const [n, has] = rows[k]; const [pn, phas] = rowsPub[k] || [0, 0]; if (k.includes('person') || n) { log(`  ${k}: without ${pct(n - has, n)} | projection with ${pct(phas, pn)}`); R[`${D} (a) ${k}`] = `without ${pct(n - has, n)}`; } }
    const cuts = towns.flatMap((t) => (t.pages || []).filter((p) => p.dm === dm && p.role === 'hidden').flatMap((p) => (p.cuts || []).map((c) => ({ t, c }))));
    const pagesHidden = towns.flatMap((t) => (t.pages || []).filter((p) => p.dm === dm && p.role === 'hidden'));
    log(`(b) PAGES WITH A HOUSE HIDDEN: ${pagesHidden.length}; pages with a key cut: ${pagesHidden.filter((p) => (p.cuts || []).length).length}; cuts: ${cuts.length}`);
    R[`${D} (b) pages hidden / with a cut / cuts`] = `${pagesHidden.length} / ${pagesHidden.filter((p) => (p.cuts || []).length).length} / ${cuts.length}`;
    const by = {};
    for (const { t, c } of cuts) { const k = `${c.list}|${c.kind}|${c.key}|${t.size}`; (by[k] ||= { n: 0, towns: new Set(), servedNull: 0, still: 0 }); by[k].n += 1; by[k].towns.add(t.seed); if (c.servedValue === null) by[k].servedNull += 1; if (c.stillNamed.length) by[k].still += 1; }
    for (const k of Object.keys(by).sort()) { const [n, has] = rows[k] || [0, 0]; log(`  CUT ${k}: ${by[k].n} holders in ${by[k].towns.size} towns (key absent after: ${by[k].servedNull}; a served string still naming the cut value: ${by[k].still}) | nothing-hidden rate WITHOUT the key, same list/kind/size: ${pct(n - has, n)}`); R[`${D} (b) CUT ${k}`] = `${by[k].n} in ${by[k].towns.size} towns`; }
    const still = cuts.filter(({ c }) => c.stillNamed.length);
    if (still.length) log(`  still named: ${still.slice(0, 10).map(({ t, c }) => `${t.seed} ${c.key}=${c.value} at ${c.stillNamed.slice(0, 3).join(',')}`).join(' ; ')}`);
    const powers = cuts.filter(({ c }) => c.list !== 'npcs'); const people = cuts.filter(({ c }) => c.list === 'npcs');
    log(`(c) WITHHOLD THE HOLDER: ${powers.length} served power rows leave (${new Set(powers.map(({ t }) => t.seed)).size} towns); ${people.length} person-keys cut (${new Set(people.map(({ t }) => t.seed)).size} towns). RE-DERIVE: the key re-written over the served powers (contestsNiche: the niche's served holder; an affiliation key: the person's served membership), same holders.`);
    R[`${D} (c) power rows leave / person-keys cut`] = `${powers.length} / ${people.length}`;
    const ppl = people.reduce((o, { c }) => { o[c.key] = (o[c.key] || 0) + 1; o[`members>0`] = (o['members>0'] || 0) + (c.memberships > 0 ? 1 : 0); return o; }, {});
    log(`  person cuts by key: ${JSON.stringify(ppl)}`);
  }
  return { lines: L, rows: R };
}
const tw = table('twin'); const sv = table('server');
writeFileSync(`${stem}-twin.txt`, `${tw.lines.join('\n')}\n`); writeFileSync(`${stem}-server.txt`, `${sv.lines.join('\n')}\n`);
const keys = [...new Set([...Object.keys(tw.rows), ...Object.keys(sv.rows)])].sort();
const side = [`SIDE BY SIDE (${all[0]?.shape}): row | twin | server | DIFF?`];
let rowDiff = 0;
for (const k of keys) { const a = tw.rows[k] ?? '(absent)'; const b = sv.rows[k] ?? '(absent)'; if (a !== b) rowDiff += 1; side.push(`  ${k} | ${a} | ${b}${a !== b ? ' | DIFF' : ''}`); }
side.push(`rows ${keys.length}; rows differing ${rowDiff}`);
writeFileSync(`${stem}-side.txt`, `${side.join('\n')}\n`);

// PARITY
const P = ['PARITY: every (town, read, holder path, key) one engine serves and the other does not'];
const tot = { pages: 0, tableServerOnly: 0, tableTwinOnly: 0, anyServerOnly: 0, anyTwinOnly: 0, holderOnlyServer: 0, holderOnlyTwin: 0, valueDiff: 0 };
for (const t of all) for (const p of t.parity || []) {
  tot.pages += 1; const read = `${p.role}/${p.dm ? 'dm' : 'off'}`;
  for (const x of p.table) { tot[x.servedBy === 'server' ? 'tableServerOnly' : 'tableTwinOnly'] += 1; P.push(`  TABLE ${x.servedBy.toUpperCase()}-ONLY ${t.seed} | ${read} | ${x.path} | ${x.key} | server ${JSON.stringify(x.server)} twin ${JSON.stringify(x.twin)}`); }
  for (const x of p.anyKey) { tot[x.servedBy === 'server' ? 'anyServerOnly' : 'anyTwinOnly'] += 1; P.push(`  ANYKEY ${x.servedBy.toUpperCase()}-ONLY ${t.seed} | ${read} | ${x.path} | ${x.key} | ${x.value}`); }
  for (const x of p.holderOnlyServer) { tot.holderOnlyServer += 1; P.push(`  HOLDER SERVER-ONLY ${t.seed} | ${read} | ${x}`); }
  for (const x of p.holderOnlyTwin) { tot.holderOnlyTwin += 1; P.push(`  HOLDER TWIN-ONLY ${t.seed} | ${read} | ${x}`); }
  for (const x of p.valueDiff) { tot.valueDiff += 1; P.push(`  VALUE ${t.seed} | ${read} | ${x.path} | ${x.key} | server ${x.server} | twin ${x.twin}`); }
}
P.splice(1, 0, `totals: ${JSON.stringify(tot)}; holders compared ${all.flatMap((t) => t.parity || []).reduce((a, p) => a + p.nS, 0)} (server) ${all.flatMap((t) => t.parity || []).reduce((a, p) => a + p.nT, 0)} (twin)`);
writeFileSync(`${stem}-parity.txt`, `${P.join('\n')}\n`);

// TASK 2
const K = ['TASK 2: the Defense key recomputed from the served page alone (DefenseTab.jsx path on a JSON copy) against the gate\'s served key (criminalStructureKeyOf(served page)); per role | engine | Reveal'];
const kt = {}; const differ = []; const veiled = [];
for (const t of all) for (const x of t.keys || []) {
  const k = `${x.role}|${x.engine}|${x.dm ? 'dm' : 'off'}`; (kt[k] ||= { pages: 0, differ: 0, differObj: 0, veiledCopy: 0 }); kt[k].pages += 1;
  if (x.page !== x.served) { kt[k].differ += 1; differ.push(`  ${t.seed} | ${k} | served ${x.served} | page ${x.page} | veiledCopy ${x.veiledCopy}`); }
  if (x.pageObj !== x.served) kt[k].differObj += 1;
  if (x.veiledCopy) { kt[k].veiledCopy += 1; veiled.push(`${t.seed}|${k}`); }
}
for (const k of Object.keys(kt).sort()) K.push(`  ${k}: pages ${kt[k].pages}; recomputed != served ${kt[k].differ} (on the object itself: ${kt[k].differObj}); grouping read veiled on the copy ${kt[k].veiledCopy}`);
const townsDiffer = [...new Set(differ.map((l) => l.trim().split(' | ')[0]))];
K.push(`towns with any page differing: ${townsDiffer.length}${townsDiffer.length ? `: ${townsDiffer.join(', ')}` : ''}`);
K.push(...differ);
// the gate's own tally from the same reads (cross-check against unit3-gate-table.txt)
const RANK = { null: 0, diffuse: 1, 'semi-organized': 2, organized: 3 }; const g = {};
for (const t of all) for (const e of ['server', 'twin']) for (const dm of [false, true]) {
  const a = (t.keys || []).find((x) => x.role === 'hidden' && x.engine === e && x.dm === dm); const b = (t.keys || []).find((x) => x.role === 'counterfactual' && x.engine === e && x.dm === dm);
  if (!a || !b) continue; const k = `${e}/${dm ? 'dm' : 'off'}`; (g[k] ||= { HIGHER: 0, EQUAL: 0, LOWER: 0 });
  const ra = RANK[String(a.served)]; const rb = RANK[String(b.served)]; g[k][ra > rb ? 'HIGHER' : ra < rb ? 'LOWER' : 'EQUAL'] += 1;
}
K.push(`gate tally from these reads (served key, hidden vs counterfactual): ${JSON.stringify(g)}`);
const ks = {}; for (const t of all) for (const x of t.keys || []) { const k = `${x.engine}/${x.dm ? 'dm' : 'off'}/${x.role}`; (ks[k] ||= {}); ks[k][String(x.served)] = (ks[k][String(x.served)] || 0) + 1; }
K.push(`served key distribution: ${JSON.stringify(ks)}`);
const sk = {}; for (const t of all) for (const role of ['hidden', 'counterfactual', 'control']) for (const dm of [false, true]) { const a = (t.keys || []).find((x) => x.role === role && x.engine === 'server' && x.dm === dm); const b = (t.keys || []).find((x) => x.role === role && x.engine === 'twin' && x.dm === dm); if (a && b && (a.served !== b.served || a.page !== b.page)) (sk[`${role}/${dm}`] ||= []).push(`${t.seed}: server ${a.served}/${a.page} twin ${b.served}/${b.page}`); }
K.push(`server vs twin key (served/page) disagreements: ${JSON.stringify(sk)}`);
writeFileSync(`${stem}-defkey.txt`, `${K.join('\n')}\n`);
console.log(`shape ${all[0]?.shape}; births ${all.length}; side-by-side rows ${keys.length}, differing ${rowDiff}`);
console.log(`parity totals ${JSON.stringify(tot)}`);
console.log(K.filter((l) => !l.startsWith('  ') || l.includes('pages ')).join('\n'));
