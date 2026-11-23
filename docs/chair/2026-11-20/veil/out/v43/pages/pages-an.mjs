// V43-PAGES: the tables.   node pages-an.mjs <rows dir> [pool dir=/var/tmp/v18/t2/pool-v43]   (read only; prints the tables)
// (F) every differing line of P1 against P0 by tab and class, each named by the narrowest single key that restores it (the
// always-pass's keys in galleryWithholdAlways.js's order, then publicProse, then other:<top>); none -> JOINT. The governance
// paragraph's counts. The server sample. (N) every differing line of P2 against the house-free twin, by tab and class, one
// example each, N63's caution (the house-free page's signature unseen in the pool's universe of its size and Reveal). The
// owner-only Daily Life slot on every page. EXIT 1 on any STOP (a GAINED line in (F), a dm-slot presence, a server line differing).
import { readdirSync, readFileSync, existsSync, writeFileSync } from 'node:fs';
const [DIR, POOL = '/var/tmp/v18/t2/pool-v43'] = process.argv.slice(2);
const J = (v) => JSON.stringify(v);
const rows = readdirSync(DIR).filter((f) => f.endsWith('.json')).map((f) => JSON.parse(readFileSync(`${DIR}/${f}`, 'utf8')));
const F = rows.filter((r) => r.lines || (r.error && r.i != null)); const N = rows.filter((r) => r.reads || (r.error && r.held));
const stops = [];
const ORDER = ['conditions.severity', 'defence.readiness.score', 'defence.scores', 'defence.economicGates', 'compound', 'safety.compound', 'food.storage', 'income.weight', 'economy.situationDesc', 'safety.capture/ratio/crimeTypes', 'safety.flags', 'history.timeline.anchored/year', 'history.event.anchored', 'history.legacy/siegeNarrative', 'npcs.stressNote', 'npcs.memberships.veiled', 'power.fingerprint', 'power.recentConflict', 'power.factions.niche/rawPower/legitimacyCrisis', 'power.relation.ratio', 'legitimacy.breakdown', 'legitimacy.multipliers/flags', 'power.stability', 'prose.economy.aliases', 'prose.glance', 'spatial.quarters', 'cast'];
const rank = (k) => (ORDER.includes(k) ? 0 : k === 'publicProse' ? 1 : 2);
const causeOf = (keys) => { if (!keys?.length) return 'JOINT'; const m = Math.min(...keys.map(rank)); return keys.filter((k) => rank(k) === m).join('|'); };
const how = (a, b) => {
  if (a.replace(/\d+/g, '#') === b.replace(/\d+/g, '#')) return 'a figure';
  const wa = a.split(' '); const wb = b.split(' ');
  const sub = (x, y) => { let j = 0; for (const w of y) if (w === x[j]) j++; return j === x.length; };
  if (sub(wb, wa)) return 'words dropped'; if (sub(wa, wb)) return 'words added'; return 'reworded';
};
const tabOf = (t) => t;
console.log(`ROWS ${rows.length}: (F) ${F.length} births (errors ${F.filter((r) => r.error).length}), (N) ${N.length} towns (errors ${N.filter((r) => r.error).length})`);
for (const r of rows.filter((x) => x.error)) { stops.push(`ERROR ${r.seed}`); console.log(`  ERROR ${r.seed}: ${r.error.split('\n').slice(0, 3).join(' / ')}`); }

// ── (F)
// ORDER (the chair's N103): a pair whose characters are the same multiset in another order (the same tokens, another order)
const isOrder = (a, b) => a !== b && a.length === (b ?? '').length && [...a].sort().join('') === [...b].sort().join('');
// A KIND (the chair's N103: tab + label): the line's label, its common prefix with its pair where 12 characters or more, else
// its first 24 characters, figures masked
const labelOf = (a, b) => { let k = 0; if (b != null && a !== b) while (k < a.length && k < b.length && a[k] === b[k]) k++; return (k >= 12 ? a.slice(0, k) : a.slice(0, 24)).replace(/\d+/g, '#').trim(); };
const KINDS = {};
const FT = {}; const FK = {}; const FH = {}; let nLines = 0; let nP1 = 0; const ex = {}; let hidLeft = 0; const tabsOnly = { P0: {}, P1: {} }; let renders = 0;
const bump = (o, k, n = 1) => { o[k] = (o[k] || 0) + n; };
for (const r of F.filter((x) => !x.error)) {
  nLines += r.lines.P0; nP1 += r.lines.P1; renders += r.renders || 0; if (r.hiddenLeft?.length) { hidLeft += 1; }
  for (const t of r.tabs.P0) if (!r.tabs.P1.includes(t)) bump(tabsOnly.P0, t); for (const t of r.tabs.P1) if (!r.tabs.P0.includes(t)) bump(tabsOnly.P1, t);
  for (const [t, d] of Object.entries(r.diff)) {
    for (const l of d.moved || []) { bump(FT, `${t}|MOVED`); const e = `${t}|MOVED|-`; if (!ex[e]) ex[e] = { seed: r.seed, text: l.slice(0, 220) }; }
    const items = [...d.lost.map((l) => ['LOST', `${t}\u0001L\u0001${l}`, l, l]), ...d.gained.map((l) => ['GAINED', `${t}\u0001G\u0001${l}`, l, l]), ...d.changed.map(([a, b]) => [isOrder(a, b) ? 'ORDER' : 'CHANGED', `${t}\u0001C\u0001${a}\u0001${b}`, `${a}  =>  ${b}`, a, b])];
    for (const [cls, id, text, a, b] of items) {
      const key = r.restored ? causeOf(r.restoredBy?.[id]) : 'UNSAMPLED';
      const kind = `${t}|${labelOf(a, b)}`; const kd = (KINDS[kind] ||= { n: 0, keyed: 0, seeds: new Set(), keys: {} }); kd.n += 1;
      if (r.restored) { kd.keyed += 1; bump(kd.keys, key); } else kd.seeds.add(r.seed);
      bump(FT, `${tabOf(t)}|${cls}`); bump(FK, `${cls}|${key}`); if (cls === 'CHANGED') bump(FH, `${how(a, b)}|${key}`);
      const e = `${tabOf(t)}|${cls}|${key}`; if (!ex[e]) ex[e] = { seed: r.seed, text: text.slice(0, 220) };
      if (cls === 'GAINED') stops.push(`GAINED (F) ${r.seed} ${t}: ${text.slice(0, 160)}`);
    }
  }
}
const tot = (cls) => Object.entries(FT).filter(([k]) => k.endsWith(`|${cls}`)).reduce((a, [, n]) => a + n, 0);
console.log(`\n(F) ${F.length} births, P0 lines ${nLines}, P1 lines ${nP1}, renders ${renders}; hand marker left something hidden on ${hidLeft} births`);
console.log(`(F) TOTAL lost ${tot('LOST')} / gained ${tot('GAINED')} / changed ${tot('CHANGED')} / order ${tot('ORDER')} / moved ${tot('MOVED')} over ${nLines} P0 lines`);
console.log(`(F) tabs only on P0 ${J(tabsOnly.P0)} | only on P1 ${J(tabsOnly.P1)}`);
console.log('(F) BY TAB x CLASS');
for (const [k, n] of Object.entries(FT).sort((a, b) => b[1] - a[1])) console.log(`  ${k.padEnd(48)} ${n}`);
console.log('(F) BY CLASS x KEY (the narrowest single key that restores the line; JOINT = none alone)');
for (const [k, n] of Object.entries(FK).sort((a, b) => b[1] - a[1])) console.log(`  ${k.padEnd(60)} ${n}`);
console.log('(F) CHANGED: HOW x KEY'); for (const [k, n] of Object.entries(FH).sort((a, b) => b[1] - a[1])) console.log(`  ${k.padEnd(60)} ${n}`);
const unkeyed = Object.entries(KINDS).filter(([, v]) => !v.keyed);
console.log(`(F) KINDS (tab + label) ${Object.keys(KINDS).length}: keyed by the restore loop ${Object.keys(KINDS).length - unkeyed.length}, NOT YET KEYED ${unkeyed.length}`);
for (const [k, v] of Object.entries(KINDS).sort((a, b) => b[1].n - a[1].n)) console.log(`  KIND ${k} | n ${v.n} | keyed ${v.keyed} ${J(v.keys)}`);
const needs = [...new Set(unkeyed.flatMap(([, v]) => [...v.seeds].slice(0, 3)))];
writeFileSync(`${DIR}/../needs.txt`, needs.join(','));
console.log(`(F) RESTORE NEEDED on ${needs.length} births (up to three per unkeyed kind): ${needs.join(',')}`);
console.log('(F) ONE EXAMPLE PER TAB x CLASS x KEY'); for (const [k, v] of Object.entries(ex).sort()) console.log(`  ${k} | ${v.seed} | ${J(v.text)}`);

// ── (F) THE GOVERNANCE PARAGRAPH
const CAUSES = ['poverty', 'prosperity', 'crime', 'insecurity', 'the curfew', 'safety', 'weak defences', 'strong defences', 'hunger', 'full stores'];
const FOOD = ['hunger', 'full stores'];
const causesIn = (t) => CAUSES.filter((c) => new RegExp(`\\b${c}\\b`, 'i').test(t));
const sentences = (t) => t.split(/(?<=[.!?])\s+/).filter(Boolean);
const meritOf = (t) => sentences(t).find((s) => / came through it| come through it| coming through it/.test(s)) || null;
const lastingOf = (t) => sentences(t).find((s) => / has (?:also )?lasted | has been here | has endured /.test(s)) || null;
const G = { births: 0, paragraphs: { P0: 0, P1: 0 }, notInPage: { P0: 0, P1: 0 }, differ: 0, causeLost: 0, foodAlone: 0, meritGained: 0, meritLost: 0, otherEvent: 0, lastingChanged: 0, ex: {} };
for (const r of F.filter((x) => !x.error && x.gov)) {
  G.births += 1; const a = r.gov.P0.text; const b = r.gov.P1.text;
  if (a) G.paragraphs.P0 += 1; if (b) G.paragraphs.P1 += 1; if (a && !r.gov.P0.inPage) G.notInPage.P0 += 1; if (b && !r.gov.P1.inPage) G.notInPage.P1 += 1;
  if (a === b) continue; G.differ += 1;
  const ca = causesIn(a); const cb = causesIn(b);
  const mark = (k) => { G[k] += 1; if (!G.ex[k]) G.ex[k] = { seed: r.seed, P0: a.slice(0, 300), P1: b.slice(0, 300) }; };
  if (ca.some((c) => !cb.includes(c))) mark('causeLost');
  if (cb.length && cb.every((c) => FOOD.includes(c)) && ca.some((c) => !FOOD.includes(c))) mark('foodAlone');
  const ma = meritOf(a); const mb = meritOf(b);
  if (mb && !ma) mark('meritGained'); if (ma && !mb) mark('meritLost');
  if (ma && mb && ma.split(' is ')[0] !== mb.split(' is ')[0]) mark('otherEvent');
  if (lastingOf(a) !== lastingOf(b)) mark('lastingChanged');
}
console.log(`\n(F) GOVERNANCE PARAGRAPH (powerDeskRead.js :: governanceAccountRead, publicDossier): ${J({ ...G, ex: undefined })}`);
for (const [k, v] of Object.entries(G.ex)) console.log(`  EX ${k} ${v.seed}: P0 ${J(v.P0)} | P1 ${J(v.P1)}`);

// ── (F) THE SERVER SAMPLE
const S = F.filter((r) => r.server); const sd0 = 0; void sd0; const sd = S.reduce((a, r) => a + (r.server.differ || 0), 0);
console.log(`\n(F) SERVER SAMPLE: ${S.length} places; differing lines (server page vs twin page) ${sd}; same handed document ${S.filter((r) => r.server.sameDoc).length}; served marker ${S.filter((r) => r.server.served).length}; errors ${S.filter((r) => r.server.error).length}; chronicle ${J([...new Set(S.map((r) => r.server.chronicle))])}`);
const SC = {}; const SO = new Map();
for (const r of S.filter((x) => x.server.differ)) for (const [t, d] of Object.entries(r.server.diff)) {
  for (const l of d.lost) { bump(SC, `${t}|LOST`); stops.push(`SERVER LOST ${r.seed} ${t}: ${l.slice(0, 120)}`); }
  for (const l of d.gained) { bump(SC, `${t}|GAINED`); stops.push(`SERVER GAINED ${r.seed} ${t}: ${l.slice(0, 120)}`); }
  for (const l of d.moved || []) bump(SC, `${t}|MOVED`);
  for (const [a, b] of d.changed) { const o = isOrder(a, b); bump(SC, `${t}|${o ? 'ORDER' : 'CHANGED'}`); if (o) { if (!SO.has(`${t}|${a}`)) SO.set(`${t}|${a}`, `${r.seed} ${a}  =>  ${b}`); } else stops.push(`SERVER CHANGED ${r.seed} ${t}: ${a.slice(0, 80)} => ${b.slice(0, 80)}`); }
}
console.log(`(F) SERVER by tab x class: ${J(SC)}`);
console.log(`(F) SERVER ORDER lines, every distinct one (read each: does its meaning move with the order?): ${SO.size}`);
for (const v of SO.values()) console.log(`  ORDER ${v.slice(0, 260)}`);

// ── (N)
const U = {}; // size|rv -> Set of signatures (the pool's universe: part A every setting, part B its nothing-hidden settings)
if (existsSync(POOL)) for (const f of readdirSync(POOL).filter((x) => /^poolb?-shard\d+\.json$/.test(x))) {
  const sh = JSON.parse(readFileSync(`${POOL}/${f}`, 'utf8'));
  for (const b of sh.births) for (const [k, i] of Object.entries(b.sigs)) (U[`${b.size}|${k.split('|')[0]}`] ||= new Set()).add(sh.sigs[i]);
}
const NT = {}; const NX = {}; const towns = {}; const caution = { off: 0, dm: 0 }; const cautionCls = {};
const DLs = {}; const office = {}; const OFF = ['Common folk say the elders decide', 'People grumble that the headman', 'The mayor is blamed for most', 'People say the reeve they chose'];
let dailyDiffer = 0;
for (const r of N.filter((x) => !x.error)) for (const [rv, rd] of Object.entries(r.reads)) {
  const unseen = existsSync(POOL) ? !(U[`${r.size}|${rv}`]?.has(rd.sigB)) : null; if (unseen) caution[rv] += 1;
  let any = false;
  for (const [t, d] of Object.entries(rd.diff)) for (const [cls, list] of [['LOST', d.lost], ['GAINED', d.gained], ['CHANGED', d.changed]]) for (const x of list) {
    any = true; const k = `${rv}|${t}|${cls}`; bump(NT, k); if (unseen) bump(cautionCls, k);
    if (!NX[k]) NX[k] = { seed: r.seed, text: (Array.isArray(x) ? `${x[0]}  =>  ${x[1]}` : x).slice(0, 220) };
  }
  if (any) (towns[rv] ||= new Set()).add(r.seed);
  let dd = false;
  for (const [slot, a] of Object.entries(rd.daily.A)) { const b = rd.daily.B[slot]; const k = `${rv}|${slot}`; DLs[k] ||= { differ: 0, n: 0, ex: null }; DLs[k].n += 1; if (a !== b) { dd = true; DLs[k].differ += 1; DLs[k].ex ||= { seed: r.seed, A: a.slice(0, 160), B: b.slice(0, 160) }; } }
  if (dd) dailyDiffer += 1;
  for (const [form, txt] of [['A', rd.daily.A.commoner_resentments], ['B', rd.daily.B.commoner_resentments]]) { const id = OFF.findIndex((o) => txt.startsWith(o) || txt.includes(o)); if (id >= 0) bump(office, `${rv}|${form}|L${8 + id}`); }
}
const nd = Object.values(NT).reduce((a, n) => a + n, 0); const ntowns = new Set([...(towns.off || []), ...(towns.dm || [])]).size;
console.log(`\n(N) ${N.length} towns; differing lines ${nd} on ${ntowns} towns (off ${towns.off?.size || 0}, dm ${towns.dm?.size || 0}); N63: house-free page's signature unseen in the pool's universe: off ${caution.off}, dm ${caution.dm} of ${N.length}${existsSync(POOL) ? '' : ' (NO POOL)'}`);
console.log('(N) BY READ x TAB x CLASS (lines; [N63] = of them on towns whose house-free page no pool page shows)');
for (const [k, n] of Object.entries(NT).sort((a, b) => b[1] - a[1])) console.log(`  ${k.padEnd(52)} ${String(n).padStart(5)}  [N63 ${cautionCls[k] || 0}]  ex ${NX[k].seed} ${J(NX[k].text)}`);
console.log(`(N) DAILY LIFE (deriveDailyLife(page, null), the eight slots, P2 vs house-free): reads with a slot differing ${dailyDiffer}`);
for (const [k, v] of Object.entries(DLs)) console.log(`  ${k.padEnd(28)} ${v.differ} / ${v.n}${v.ex ? `  ex ${v.ex.seed}: ${J(v.ex.A)} | ${J(v.ex.B)}` : ''}`);
console.log(`(N) OFFICE LINES L8..L11 printed in commoner_resentments (L12 NOT BUILT): ${J(office)}`);

// ── THE OWNER-ONLY SLOT
const dm = { F_P1: [0, 0, 0, 0, 0], F_server: [0, 0, 0, 0, 0], N_A: [0, 0, 0, 0, 0], N_B: [0, 0, 0, 0, 0] }; // pages, printed, slot key, doc key, pages whose owner read has a line
const add = (k, s) => { if (!s) return; dm[k][0] += 1; if (s.printed) dm[k][1] += 1; if (s.slotKey) dm[k][2] += 1; if (s.docKey) dm[k][3] += 1; if (s.dmText) dm[k][4] += 1; };
for (const r of F.filter((x) => !x.error)) { add('F_P1', r.dm); add('F_server', r.server?.dm); }
for (const r of N.filter((x) => !x.error)) for (const rd of Object.values(r.reads)) { add('N_A', rd.dmSlot.A); add('N_B', rd.dmSlot.B); }
const dmPresent = Object.values(dm).reduce((a, v) => a + v[1] + v[2] + v[3], 0);
console.log(`\nDM SLOT (commoner_resentments_dm) [pages, printed, in slots, key in document, owner line exists]: ${J(dm)} -> present ${dmPresent}`);
if (dmPresent) stops.push(`DM SLOT present ${dmPresent}`);
console.log(`\nSTOPS ${stops.length}`); for (const s of stops.slice(0, 40)) console.log(`  ${s}`);
console.log(`ONE LINE: (F) lost ${tot('LOST')} / gained ${tot('GAINED')} / changed ${tot('CHANGED')} over ${nLines} lines; (N) differ ${nd} lines on ${ntowns} towns; dm-slot present ${dmPresent}`);
process.exit(stops.length ? 1 : 0);
